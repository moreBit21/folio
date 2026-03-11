// api/ai-import.js — Phase 2c: AI Universal File Import
// Accepts: { content: string, fileType: "csv"|"pdf"|"xlsx", fileName: string }
// Returns: { positions: [...], transactions: [...] | null, broker: string, confidence: number }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { content, fileType, fileName } = req.body || {};
  if (!content) return res.status(400).json({ error: "No content provided" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  // ── System prompt ──────────────────────────────────────────────────────────
  const systemPrompt = `You are a financial data extraction specialist. Your job is to parse broker export files and extract portfolio positions or transaction history.

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
- Use "positions" mode for depot snapshot files (current holdings)
- Use "transactions" mode for activity/transaction history files
- If the file has both, prefer "transactions" as it's more valuable
- For ISINs: always include if present in the data
- For type detection: ISINs starting with IE/LU = etf, US = stock (unless known ETF), crypto = crypto
- avgPrice should be cost basis per unit in EUR if available, else current price
- Confidence: 1.0 = known broker format, 0.7 = likely correct, 0.4 = best guess
- Known brokers: Smartbroker+, Bitvavo, Trade Republic, Scalable Capital, ING, Comdirect, DKB, Flatex, Interactive Brokers, Degiro
- If transactions mode: set positions to []
- If positions mode: set transactions to null
- parserSpec.fieldMap: provide regex patterns (case-insensitive) that match the EXACT column headers in this file. These will be used to build a local parser so future files from this broker need no AI. Be precise.
- parserSpec.numberFormat: "de" if numbers use period as thousands sep and comma as decimal (e.g. "1.234,56"), else "en"
- NEVER return markdown, NEVER add commentary, ONLY return the JSON object`;

  // ── User prompt ────────────────────────────────────────────────────────────
  const userPrompt = `File name: ${fileName || "unknown"}
File type: ${fileType || "unknown"}

File content:
${content.slice(0, 12000)}`; // cap at ~12k chars to stay within token limits

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
        max_tokens: 4096,
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
      return res.status(422).json({ error: "Claude returned invalid JSON", raw: raw.slice(0, 500) });
    }

    // Validate minimal structure
    if (!parsed.positions) parsed.positions = [];
    if (!parsed.broker) parsed.broker = "Unknown";
    if (typeof parsed.confidence !== "number") parsed.confidence = 0.7;

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
