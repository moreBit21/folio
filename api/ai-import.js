// api/ai-import.js — Phase 2c: AI Universal File Import
// AI job: detect format + normalize columns only
// App job: derive positions from normalized transactions (correct semantics)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { content, fileType, fileName } = req.body || {};
  if (!content) return res.status(400).json({ error: "No content provided" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  function sampleContent(raw, maxChars = 28000) {
    if (raw.length <= maxChars) return raw;
    const lines = raw.split("\n");
    if (lines.length <= 1) return raw.slice(0, maxChars);
    const header = lines[0];
    const dataLines = lines.slice(1).filter(l => l.trim());
    const totalData = dataLines.length;
    const first = dataLines.slice(0, 40);
    const last = dataLines.slice(-10);
    const midCount = 30;
    const mid = [];
    for (let i = 0; i < midCount; i++) {
      const idx = Math.floor((totalData / (midCount + 1)) * (i + 1));
      if (idx < totalData) mid.push(dataLines[idx]);
    }
    const sampled = [header, ...first, `... (${totalData - 40 - 10 - midCount} rows omitted) ...`, ...mid, ...last].join("\n");
    return sampled.slice(0, maxChars);
  }

  const sampledContent = sampleContent(content);

  const systemPrompt = `You are a financial data extraction specialist. Parse broker export files and normalize them into a standard schema.

You MUST respond with ONLY a valid JSON object — no explanation, no markdown, no code fences.

JSON schema:
{
  "broker": "detected broker name or 'Unknown'",
  "mode": "positions" | "transactions",
  "confidence": 0.0-1.0,
  "positions": [
    {
      "symbol": "ticker symbol (e.g. AAPL, BTC, VWCE)",
      "isin": "ISIN if present, else null",
      "name": "full asset name",
      "type": "stock" | "etf" | "crypto" | "derivative",
      "qty": number,
      "avgPrice": number (cost basis per unit in EUR, or current price if cost basis unavailable),
      "broker": "broker name"
    }
  ],
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "type": "buy" | "sell" | "transfer_in" | "transfer_out" | "reward" | "ignore",
      "isin": "ISIN if present, else null",
      "symbol": "ticker symbol (NOT the ISIN — the actual symbol like BTC, AAPL)",
      "name": "asset name",
      "qty": number (always positive),
      "price": number (price per unit in EUR, 0 if unknown),
      "total": number (total EUR value, always positive, 0 if unknown)
    }
  ] | null,
  "parserSpec": {
    "numberFormat": "de" | "en",
    "fieldMap": {
      "symbol":   "regex matching ticker/symbol column header, or null",
      "isin":     "regex matching ISIN column header, or null",
      "name":     "regex matching name/asset column header, or null",
      "qty":      "regex matching quantity/shares column header, or null",
      "avgPrice": "regex matching avg price/cost column header, or null",
      "date":     "regex matching date column header, or null",
      "txType":   "regex matching transaction type column, or null",
      "total":    "regex matching total amount column, or null"
    },
    "typeMap": {
      "buy":         ["list of raw type strings that mean buy"],
      "sell":        ["list of raw type strings that mean sell"],
      "transfer_in": ["list of raw type strings that mean asset arriving (deposit, withdrawal_cancelled, etc)"],
      "transfer_out":["list of raw type strings that mean asset leaving (withdrawal, etc)"],
      "reward":      ["list of raw type strings that mean free incoming (staking, rebate, cashback, etc)"],
      "ignore":      ["list of raw type strings to skip (margin bookkeeping, EUR cash flows, fees, etc)"]
    }
  }
}

TRANSACTION TYPE RULES — normalize source type strings to one of these 6 values:
- "buy"          → user purchased an asset (kauf, purchase, buy, limit order filled, savings plan)
- "sell"         → user sold an asset (verkauf, sale, sell)
- "transfer_in"  → asset arrived from external wallet/account (deposit of crypto/stock, withdrawal_cancelled)
- "transfer_out" → asset left to external wallet/account (withdrawal of crypto/stock to cold wallet)
- "reward"       → free incoming assets with no cost basis (staking, rebate, cashback, airdrop, dividend reinvestment, fixed_staking, campaign incentive)
- "ignore"       → internal bookkeeping, not a real position change (margin_loan_borrow, margin_loan_repay, margin_loan_collateral_*, EUR cash deposits/withdrawals, affiliate EUR payouts, fees)

CRITICAL SEMANTICS (the app will use these to derive positions):
- "buy" and "transfer_in" and "reward" all ADD to holdings
- "sell" and "transfer_out" both REDUCE holdings
- "ignore" rows are skipped entirely
- transfer_in has NO purchase cost (user bought it elsewhere)
- reward has NO purchase cost (it was free)
- qty is ALWAYS positive regardless of sign in source file

POSITION MODE vs TRANSACTION MODE:
- "positions" mode: file shows current holdings snapshot (depot statement, balance overview)
- "transactions" mode: file shows activity history
- If the file has both, prefer "transactions"
- In transactions mode: positions = []

SYMBOL RULES:
- symbol field must be the TRADING SYMBOL, never the ISIN
- For ISINs: extract the ISIN separately into the isin field, look up or infer the ticker symbol
- If you cannot determine the ticker from context, use the first 4-6 chars of the company name

KNOWN BROKER FORMATS:
Bitvavo CSV: Timezone,Date,Time,Type,Currency,Amount,Quote Currency,Quote Price,Received/Paid Currency,Received/Paid Amount,...
  - symbol = Currency column (e.g. SOL, BTC)
  - qty = abs(Amount)
  - price = Quote Price (EUR)
  - total = abs(Received/Paid Amount) when Received/Paid Currency = EUR
  - Type mapping: buy→buy, sell→sell, deposit→transfer_in, withdrawal→transfer_out, staking→reward, fixed_staking→reward, rebate→reward, campaign_new_user_incentive→reward, margin_loan_*→ignore, affiliate→ignore, withdrawal_cancelled→ignore

Smartbroker+ activity CSV: German format, columns include Transaktionstyp, ISIN, Stücke, Anlagebetrag
  - type mapping: Kauf/BUY_SAVINGSPLAN→buy, Verkauf→sell

Scalable Capital: similar German format

- NEVER return markdown, ONLY return the JSON object`;

  const userPrompt = `File: ${fileName || "unknown"} (${fileType || "unknown"})
Length: ${content.length} chars, ${content.split("\n").length} lines

${sampledContent}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `Anthropic API error: ${response.status}`, detail: err });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[0]); }
        catch (e2) { return res.status(422).json({ error: "Claude returned invalid JSON", raw: raw.slice(0, 800) }); }
      } else {
        return res.status(422).json({ error: "Claude returned invalid JSON", raw: raw.slice(0, 800) });
      }
    }

    if (!parsed.positions) parsed.positions = [];
    if (!parsed.transactions) parsed.transactions = null;
    if (!parsed.broker) parsed.broker = "Unknown";
    if (typeof parsed.confidence !== "number") parsed.confidence = 0.7;

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
