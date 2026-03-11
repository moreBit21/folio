// api/ai-import.js — Phase 2c: AI Universal File Import
// Accepts: { content: string, fileType: "csv"|"pdf"|"xlsx", fileName: string }
// Returns: { positions: [...], transactions: [...] | null, broker: string, confidence: number }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { content, fileType, fileName } = req.body || {};
  if (!content) return res.status(400).json({ error: "No content provided" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  // ── Smart content sampling: send header + spread of rows, not just first N chars ──
  function sampleContent(raw, maxChars = 28000) {
    if (raw.length <= maxChars) return raw;
    const lines = raw.split("\n");
    if (lines.length <= 1) return raw.slice(0, maxChars);
    const header = lines[0];
    const dataLines = lines.slice(1).filter(l => l.trim());
    const totalData = dataLines.length;
    // Always include first 40 rows (establishes pattern), last 10 rows, and spread sample
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

  // ── System prompt ──────────────────────────────────────────────────────────
  const systemPrompt = `You are a financial data extraction specialist. Parse broker export files and extract transaction history or portfolio positions.

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
      "avgPrice": number,
      "currency": "EUR" | "USD" | "GBP" etc,
      "broker": "broker name"
    }
  ],
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "type": "buy" | "sell",
      "isin": "ISIN if present, else null",
      "symbol": "ticker symbol",
      "name": "asset name",
      "qty": number,
      "price": number,
      "currency": "EUR",
      "total": number
    }
  ] | null,
  "parserSpec": {
    "numberFormat": "de" | "en",
    "fieldMap": {
      "symbol":   "regex pattern matching the ticker/symbol column header, or null",
      "isin":     "regex pattern matching ISIN column header, or null",
      "name":     "regex pattern matching name/asset column header, or null",
      "type":     "regex pattern matching asset class column header, or null",
      "qty":      "regex pattern matching quantity/shares column header, or null",
      "avgPrice": "regex pattern matching price/cost column header, or null",
      "currency": "regex pattern matching currency column header, or null",
      "date":     "regex pattern matching date column header, or null",
      "txType":   "regex pattern matching transaction type (buy/sell) column, or null",
      "total":    "regex pattern matching total amount column, or null"
    }
  }
}

Rules:
- Use "positions" mode for depot snapshot files (current holdings with quantities and avg prices)
- Use "transactions" mode for activity/transaction history files
- If the file has both, prefer "transactions" as it's more valuable
- For ISINs: always include if present in the data
- For type detection: ISINs starting with IE/LU = etf, US = stock (unless known ETF), crypto = crypto
- avgPrice should be cost basis per unit in EUR if available, else current price
- Confidence: 1.0 = known broker format, 0.7 = likely correct, 0.4 = best guess
- Known brokers: Bitvavo, Smartbroker+, Trade Republic, Scalable Capital, ING, Comdirect, DKB, Flatex, Interactive Brokers, Degiro

TRANSACTION TYPE MAPPING — map source types to "buy" or "sell":
- "buy", "kauf", "purchase" → "buy"
- "sell", "verkauf", "sale" → "sell"
- "staking", "rebate", "affiliate", "campaign_new_user_incentive", "fixed_staking" → "buy" (treat as incoming, use qty from Amount column, price=0, total=0)
- "withdrawal" → "sell" (asset leaving, use negative Amount as qty)
- "deposit" → skip (EUR/cash deposits, not asset transactions)
- "margin_loan_*" → skip (internal margin bookkeeping)
- "withdrawal_cancelled" → skip

BITVAVO FORMAT NOTES:
- Columns: Timezone, Date, Time, Type, Currency, Amount, Quote Currency, Quote Price, Received/Paid Currency, Received/Paid Amount, Fee currency, Fee amount, Status, Transaction ID, Address
- For buy rows: Currency=asset, Amount=qty bought, Quote Price=price in EUR, Received/Paid Amount=EUR total (negative = paid)
- For sell rows: Amount is negative (asset sold), Received/Paid Amount is positive (EUR received)
- For staking/rebate: Currency=asset, Amount=qty received, no price data
- Only include rows where Status="Completed" or Status="Distributed"
- symbol = Currency column value (e.g. BTC, ETH, SOL)

- If transactions mode: set positions to [] (positions will be derived client-side from transactions)
- parserSpec.fieldMap: provide regex patterns matching EXACT column headers for future local parsing
- parserSpec.numberFormat: "de" if numbers use period as thousands sep and comma as decimal, else "en"
- NEVER return markdown, NEVER add commentary, ONLY return the JSON object`;

  const userPrompt = `File name: ${fileName || "unknown"}
File type: ${fileType || "unknown"}
Total content length: ${content.length} chars (${content.split("\n").length} lines)

File content (sampled):
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

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Try to extract JSON from response if there's surrounding text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          return res.status(422).json({ error: "Claude returned invalid JSON", raw: raw.slice(0, 800) });
        }
      } else {
        return res.status(422).json({ error: "Claude returned invalid JSON", raw: raw.slice(0, 800) });
      }
    }

    // Validate minimal structure
    if (!parsed.positions) parsed.positions = [];
    if (!parsed.transactions) parsed.transactions = null;
    if (!parsed.broker) parsed.broker = "Unknown";
    if (typeof parsed.confidence !== "number") parsed.confidence = 0.7;

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
