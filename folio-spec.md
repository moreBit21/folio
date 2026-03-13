# folio. — Product Specification & Development Roadmap

> European AI-powered portfolio tracker & personal finance OS  
> Last updated: March 2026 | Status: Active Development

-----

## 🎯 Product Vision

**folio.** is a premium European investment platform combining:

- The portfolio depth of **Finanzfluss Copilot**
- The AI research quality of **StockOracle / OracleIQ**
- The charting of **TradingView Lightweight**
- The personal finance features of **Finanzguru**
- Built specifically for European retail investors (EU brokers, EUR-first, GDPR-compliant)

**Target users:** German-speaking retail investors with accounts at EU brokers (Trade Republic, Scalable Capital, Smartbroker+, DKB, ING, Bitvavo, etc.)

**Monetization:** SaaS — Free · Starter €5.99/mo · Premium €10.99/mo  
**Tech stack:** React 18 + Vite · Vercel Functions · Supabase · Anthropic Claude Sonnet 4 · FMP API · Tink Open Banking

-----

## 💰 Pricing Tiers

|Tier         |Price    |Sync                                                 |Features                                               |AI                                              |
|-------------|---------|-----------------------------------------------------|-------------------------------------------------------|------------------------------------------------|
|**Free**     |€0       |AI file import (5 files/mo)                          |Raw prices · basic portfolio                           |AI file parser only                             |
|**Starter**  |€5.99/mo |Tink auto-sync (bank + broker) + unlimited AI imports|Charts · health scores · screener · ETF analyser · news|AI imports (unlimited) · news summaries (cached)|
|**Premium**  |€10.99/mo|Everything in Starter                                |Everything + portfolio analysis · spending · budgets   |Full AI with monthly quota (see below)          |
|**Premium+** |€13.99/mo|Everything in Premium                                |Everything + tax reports · crypto FIFO/LIFO · Anlage SO|Full AI + tax report generation                 |

### Important distinctions

- **AI file import** — Claude parses any file (PDF, CSV, Excel) from any broker, any language. 5/month on Free, unlimited on Starter+. ~€0.03/file cost. The Free tier's only AI feature — and a key acquisition mechanic.
- **Health scores, screener, ETF overlap** — purely algorithmic (FMP data + scoring logic). No Claude calls. Available on Starter+.
- **AI research** — actual Claude calls: DCF, moat ratings, balance sheet grades, portfolio analysis, portfolio chat. Premium only.
- **wealthAPI** — shelved until ~3,000 users. Tink covers 80–90% of target brokers for now.

-----

## 🏆 Competitive Landscape

### Parqet — Closest Direct Competitor

350,000+ users · Hamburg · Parqet Fintech GmbH · 4.7 stars App Store

**Their tiers:** Free €0 · Plus €11.99/mo · Investor €29.99/mo (all with 14-day trial)

**What Parqet does well:**

- Free broker autosync (Trade Republic, Scalable Capital, ING, Comdirect, Consorsbank)
- Deep portfolio analytics (X-Ray ETF overlap, drawdown, TTWROR what-if, tax dashboard, dividend calendar with 24-month forecasts)
- PDF import for 50+ brokers with zero-click parsing
- Native iOS + Android apps
- "Parqet Terminal" — separate research product in waitlist beta (fundamentals, earnings, insiders, peer comparison)

**How they offer autosync free:** Parqet uses a *client-side* ("local") sync via Qplix (a licensed PSD2 AISP). Credentials go directly from the user's phone to the broker — Parqet's servers never see them. Near-zero marginal cost, hence free.

**folio. sync vs Parqet sync:**

|                  |Parqet autosync      |folio. Tink sync   |
|------------------|---------------------|-------------------|
|Architecture      |Client-side (local)  |Server-side (OAuth)|
|Credentials       |Phone → broker direct|Never handled      |
|Runs automatically|Manual re-trigger    |Daily background   |
|Cost to product   |~€0/user             |~€0.50/user/mo     |
|Broker coverage   |5 brokers            |Same 5 + 6,000 more|

**What Parqet doesn't have (folio.'s gap to fill):**

- No AI health scores, moat ratings, DCF, balance sheet grades anywhere
- No portfolio chat
- No spending / budgeting / subscription detection
- No stock screener with algorithmic scoring
- Terminal is waitlist-only — no AI in it

### Full Competitive Matrix

|Feature               |Finanzguru €2.99|FF Copilot Free|FF Copilot Plus ~€8|Parqet Free|Parqet Plus €12|folio. Free|folio. Starter €6|folio. Premium €11|
|----------------------|:--------------:|:-------------:|:-----------------:|:---------:|:-------------:|:---------:|:---------------:|:----------------:|
|Bank/broker sync      |✓ bank          |✓ both         |✓ both             |✓ local†   |✓ local†       |✗          |✓ Tink           |✓ Tink            |
|Spending & budgets    |✓ full          |✓ basic        |✓ full             |✗          |✗              |✗          |✗                |✓ full            |
|Subscription detection|✓               |✗              |✗                  |✗          |✗              |✗          |✗                |✓                 |
|Net worth dashboard   |basic           |✓              |✓                  |✓          |✓              |✗          |✗                |✓                 |
|Investment portfolio  |basic           |✓ basic        |✓ deep             |✓ deep     |✓ deep         |raw        |✓                |✓                 |
|X-Ray (ETF overlap)   |✗               |✗              |✗                  |✗          |✓              |✗          |✓ algo           |✓ algo            |
|Health scorecard      |✗               |✗              |✗                  |✗          |✗              |✗          |✓ algo           |✓ algo            |
|Stock screener        |✗               |✗              |✗                  |✗          |✗              |✗          |✓ algo           |✓ algo            |
|Dividend tools        |✗               |✗              |✗                  |basic      |✓ full         |✗          |✗                |✓                 |
|Tax dashboard         |✗               |✗              |✗                  |✗          |✓              |✗          |✗                |✗                 |
|Insider transactions  |✗               |✗              |✗                  |✗          |waitlist†      |✗          |✓ raw            |✓ raw+AI          |
|AI moat / DCF / grades|✗               |✗              |✗                  |✗          |✗              |✗          |✗                |✓ Claude          |
|Portfolio chat (AI)   |✗               |✗              |✗                  |✗          |✗              |✗          |✗                |✓ 50/mo           |
|AI news summaries     |✗               |✗              |✗                  |✗          |✗              |✗          |✓ cache          |✓ cache           |
|Charts                |✗               |✗              |✗                  |basic      |basic          |✗          |✓ light          |✓ light           |

† Parqet's autosync is client-side: credentials go from user's phone directly to the broker. folio. uses server-side Tink OAuth (more secure, runs automatically daily) at ~€0.50/user/mo.

†† Parqet Terminal includes insider data but is currently waitlist-only with no public launch date and no AI interpretation. folio. Starter shows raw insider tables for US stocks; Premium adds Claude signal interpretation.

**Key positioning note:** Parqet free already beats folio. Starter on raw analytics depth and sync. The Starter value proposition must lean on health scorecard + AI news + insider data as features Parqet doesn't have at any price today. Premium's moat is AI research + portfolio chat.

### AI Quota (Premium — transparent, always visible)

|Feature            |Monthly Quota            |Cost/call|Notes                             |
|-------------------|-------------------------|---------|----------------------------------|
|DCF analysis       |20 runs                  |~€0.01   |On-demand per stock               |
|Moat analysis      |20 runs                  |~€0.01   |On-demand per stock               |
|Balance sheet grade|Auto (earnings-triggered)|~€0.01   |Doesn't count toward quota        |
|Portfolio analysis |5 runs                   |~€0.05   |Full portfolio scan               |
|Portfolio chat     |50 messages              |~€0.001  |Conversational AI on your holdings|

**UX rule:** Quota bar always visible in sidebar ("Chat: 38/50 · resets in 12 days"). Soft warning at 80%. Friendly hard stop at 100% with reset date shown. Never a surprise.

-----

## ✅ Phase 1 — Core Dashboard (COMPLETE)

- [x] Sidebar navigation: Dashboard, Portfolio, Screener, News Feed, Settings
- [x] 4 KPI cards: Portfolio Value, Total P&L, Invested, Live Prices status
- [x] Allocation donut charts: by asset + by type (crypto / stock / ETF)
- [x] Positions table with filters (by broker, by type)
- [x] Add Position modal (manual entry)
- [x] Demo data: BTC, ETH, SOL (Bitvavo) · MSFT, NVDA, VWCE (Smartbroker+) · KO (Trade Republic)

-----

## ✅ Phase 2 — Live Prices, Logos & News (COMPLETE)

- [x] CoinGecko API (free, no key) → BTC, ETH, SOL in EUR
- [x] Yahoo Finance proxy → stocks/ETFs with USD→EUR conversion
- [x] Graceful fallback to demo prices if APIs fail
- [x] Refresh button + last updated timestamp
- [x] Inline SVG logos per asset (sandbox-safe, swap to CDN in production)
- [x] Performance AreaChart: Portfolio value vs Invested vs Benchmarks
- [x] Broker toggles on chart (Bitvavo / Smartbroker+ / Trade Republic)
- [x] Benchmark pills: S&P 500, Nasdaq 100, DAX, BTC
- [x] Time ranges: 1M / 3M / 6M / YTD / 1Y / ALL
- [x] TWR (time-weighted return) chart — deposit-agnostic, both portfolio and benchmarks start at 0%
- [x] AI News Feed powered by Anthropic API + web_search tool
- [x] News filtered by ticker, sentiment-coded (bullish/bearish/neutral)

-----

## ✅ Phase 2b — CSV Import (COMPLETE)

- [x] Drag & drop CSV import modal
- [x] Smartbroker+ depot snapshot format (hardcoded fast path)
- [x] German number format parsing (1.234,56 → 1234.56)
- [x] Reads directly from snapshot: qty, avg price, current price, name, ISIN
- [x] Derivative type detection and tagging (turbos, warrants, factor certs)
- [x] ISIN → ticker/name resolution (local map + OpenFIGI API fallback)
- [x] WKN ticker resolution — positions imported with WKN codes (e.g. A2QHKM, 858301) as their symbol field now correctly resolve via ISIN lookup path (`isRealTicker` → ISIN lookup → `fmpTicker` persisted)
- [x] Preview screen before importing
- [x] Empty portfolio state with import CTA

**Technical notes — ticker resolution (critical, do not regress):**

- Smartbroker+ activity CSV stores WKN codes (e.g. `865985`, `A2PGMG`, `A14R0G`) in the `symbol` field, not tickers. The `isin` field is always present.
- `displayTicker(pos)` must prefer `pos.fmpTicker` (split at `.`) over `pos.symbol` — otherwise WKNs like `865985` are shown to the user instead of `AAPL`. Fixed in v104.
- Some Smartbroker+ ISINs are invalid or outdated (corporate actions, deposit receipt ISINs). Examples: HubSpot `US44922N1037`, Qualcomm `US7960508882` — FMP `/search-isin` returns nothing for these. Fix: fall back to name-based search via `/search?query=` using the position's `name` field. Fixed in v104.
- Resolution pipeline priority: (1) `ISIN_MAP` instant lookup → (2) FMP `/search-isin` with name validation → (3) FMP `/search?query={name}` fallback → (4) unresolved (show first word of name)
- `resolvedTickerMap[isin]` in `fetchPrices` must be applied to ALL positions sharing that ISIN in a single `setPositions` call — never per-position setState (causes stale state)
- **Critical v105→v106 fix:** ISIN_MAP completely removed from the resolution pipeline in `fetchPrices`. ALL positions now go through the same generic path: FMP `/search-isin` → name validation → name fallback. ISIN_MAP remains only as a temporary display fallback in `displayTicker`, `AssetLogo`, and chart code — to be removed entirely in a future version once we confirm the generic pipeline resolves everything.
  - (a) Positions that were previously shortcutted via ISIN_MAP (Apple, Goldman, Meta etc.) now go through `/search-isin` like every other stock. `fmpTicker` is persisted to Supabase on first successful resolution.
  - (b) German deposit receipt ISINs (Qualcomm `US7960508882` → Samsung, Broadcom `US1255231003` → Cigna) are caught by name validation and routed to name fallback.
  - (c) Name fallback searches `/search?query={cleanName}` and filters results by name match before picking.
- **v108 — critical learnings from real data:**
  - ISINs in real Smartbroker+ exports are CORRECT. All resolution problems in v104–v107 were caused by (a) bad test data with wrong ISINs, and (b) nameMatches falsely rejecting valid resolutions because Smartbroker abbreviates names differently from FMP.
  - **Rule: TRUST the ISIN.** When FMP `/search-isin` returns a result for a valid ISIN, it IS the correct security. No name validation needed on this path. ISINs are globally unique.
  - **nameMatches only applies to name-based fallback** (Step 2) where we search by company name and need to verify.
  - **Zero-price self-healing removed** — caused infinite re-resolution loops when FMP quote endpoint doesn't cover European-listed tickers (e.g. XSIL.L, EL4C.DE). These tickers ARE correctly resolved from their ISIN; they just don't have live quotes on FMP's current plan.
  - **One-time migration (v108):** clears all `fmpTicker` values from Supabase on first load so the corrected pipeline re-resolves everything cleanly. Uses localStorage flag `folio_migration_v108` to run only once.
  - **German derivatives (Turbos, Warrants, Factor Certs):** ISINs starting with DE000 from issuers like Morgan Stanley, UniCredit, Vontobel — FMP doesn't cover these. Expected and not fixable via FMP. Strategy for future: use the derivative's underlying asset (encoded in the product name or obtainable from the issuer) to at least show the underlying's price and reference data. Alternatively, German derivative data providers like Onvista or Ariva could serve as supplementary sources.
- **v110: Derivative auto-detection from ISIN issuer codes.** German structured products (turbos, warrants, factor certs) have ISINs starting with `DE000` + a 2-letter issuer code: UG=UBS, MM/MH=Morgan Stanley, HD=HSBC, VH/VJ=Vontobel, SB=SocGen, HB=UniCredit/HVB, DW/DV=DZ Bank, GX/GK=Goldman Sachs, CU/CZ=Citigroup. These are now auto-detected as `type: "derivative"` in `inferType` and excluded from the price resolution pipeline. Also detects issuer names in position names (Morgan Stanley, UniCredit, Vontobel etc.) as fallback. Prevents derivatives from resolving to their issuer's stock ticker (e.g. Morgan Stanley warrant → MS-PQ was wrong).
- **v111: Manual ticker resolution prompt + derivative migration fix.**
  - When the pipeline can't resolve a position (no fmpTicker, not a derivative, price = 0), a "⚠ resolve" badge appears in the positions table. User clicks it → modal asks for the ticker symbol → validates against FMP `/quote` → saves as fmpTicker permanently. Fully generic — works for any unresolvable position from any broker.
  - Migration v111: re-runs `inferType` on all positions loaded from Supabase to reclassify derivatives. v110's derivative detection code was correct but only ran at import time — positions already saved as `type: "stock"` from previous sessions were never reclassified. The migration fixes this by re-evaluating the type of every position on load.
- **TODO (future):** Remove ISIN_MAP constant entirely. Add "Re-resolve all tickers" button in developer settings.

**Broker export instructions:**

- **Smartbroker+:** Depot → Depotübersicht → Export → CSV (depot snapshot)
- **Bitvavo:** Account → Transaction History → Export → Full History (CSV)
- **Trade Republic:** Use "TR Exporter" browser extension (Chrome/Firefox) → export CSV

-----

## ✅ Phase 2c — AI Universal File Import (COMPLETE)

> **The Free tier's killer feature.** Works on any file from any broker — PDF, CSV, Excel —
> in any language, any column order. No hardcoding. No format knowledge needed.
> This is the first thing a new user does. It has to feel magical.
> 
> **Free tier:** 5 file parses/month · **Starter+:** unlimited
> **Cost per parse:** ~€0.03 (avg) · max ~€0.06 for large PDFs
> **Zero extra infrastructure cost** — Claude call + existing Supabase counter

### Implementation status

Working 3-tier import pipeline:

- [x] **Tier 1 — Hardcoded fast-paths** (Smartbroker+ depot, Smartbroker+ activity, Bitvavo) — instant, zero cost, legacy parsers
- [x] **Tier 2 — Learned parsers** (Supabase `broker_parsers` table + localStorage cache) — instant, zero cost, shared across all users
- [x] **Tier 3 — AI path** (`/api/ai-import` → Claude Sonnet 4) — costs ~€0.03/call, quota-counted on Free tier
- [x] After every successful AI parse, a learned parser spec is saved to Supabase (if confidence ≥ 0.75) — so each broker format only costs **one AI call ever, globally**
- [x] Quota system: Free tier 5/month, Starter+ unlimited, counter visible on import screen
- [x] XLSX → CSV client-side conversion (SheetJS)
- [x] Preview screen before confirming import
- [x] Cold wallet transfer detection on all paths

### TODO: Developer toggle for hardcoded parsers

- [ ] Add a developer/debug setting in Settings that lets the developer choose whether to use hardcoded parsers or skip them and rely entirely on learned parsers + AI path. Since learned parsers stored in Supabase are also free and instant, the hardcoded path is a legacy optimization — the toggle allows testing that the learned parser path works correctly for Smartbroker+ and Bitvavo without the hardcoded fast-path intercepting.

### How the AI path works

```
User uploads file (PDF / CSV / XLS / XLSX)
        ↓
  1. XLSX? → convert to CSV (SheetJS, client-side)
  2. Try hardcoded fast-paths (Smartbroker+, Bitvavo) → instant return if matched
  3. Try learned parsers (Supabase lookup by header fingerprint) → instant return if matched
  4. Check AI quota (Free: 5/month) → reject if exhausted
  5. POST /api/ai-import { content, fileType, fileName, brokerHint }
     → Claude Sonnet 4 parses → returns positions or transactions
  6. Show preview ("We found 47 transactions — does this look right?")
  7. On confirm → merge into portfolio
  8. Save learned parser spec to Supabase (if confidence ≥ 0.75)
  9. Decrement quota counter (Free only)
```

### Claude prompt design

```
You are a financial data parser. Extract all investment transactions from the text below.

Return ONLY a JSON array. No explanation. No markdown. No preamble.

Each transaction object must have these fields (use null if unavailable):
{
  "date": "YYYY-MM-DD",
  "type": "BUY | SELL | DIVIDEND | FEE | TRANSFER",
  "isin": "string or null",
  "ticker": "string or null",
  "name": "string",
  "quantity": number or null,
  "price": number or null,
  "currency": "EUR | USD | GBP | ...",
  "total_amount": number,
  "broker_detected": "string — your best guess at the broker name"
}

File content:
{file_text}
```

### File support matrix

|Format             |Method              |Notes                        |
|-------------------|--------------------|-----------------------------|
|CSV                |Read directly       |Any delimiter, any language  |
|PDF (text)         |pdf-parse extraction|Works for most broker PDFs   |
|PDF (scanned image)|Not supported v1    |Show "text PDF only" message |
|XLS / XLSX         |xlsx → CSV          |Full Excel support           |
|JSON               |Read directly       |For future broker API exports|

### Quota system

```sql
create table ai_import_usage (
  user_id uuid references auth.users not null,
  month text not null,           -- '2026-03'
  files_parsed int default 0,
  primary key (user_id, month)
);
```

- Free tier hard limit: 5/month. Friendly message at limit: "You've used all 5 free imports this month. Upgrade to Starter for unlimited imports, or your quota resets on [date]."
- Counter always visible on the import screen: "3 of 5 free imports used this month"
- Starter/Premium: no counter shown, no limit enforced

### Cost model

|Scenario                             |Cost/file|Monthly cost/user|
|-------------------------------------|---------|-----------------|
|Light CSV (< 50 rows)                |~€0.01   |—                |
|Typical export (50–200 rows)         |~€0.03   |—                |
|Heavy PDF (200+ transactions)        |~€0.06   |—                |
|**Free user (avg 2 imports/month)**  |€0.03    |**~€0.06**       |
|**Free user (max 5 imports/month)**  |€0.03    |**~€0.15**       |
|Starter/Premium (avg 3 imports/month)|€0.03    |**~€0.09**       |

At 100K users (80K free, 20% monthly active, avg 2 imports): **~€960/month** — under 0.5% of MRR.

### Error handling

- Low-confidence parse (Claude flags uncertainty): show raw table + "Review carefully — we weren't confident about this file"
- Completely failed parse: "We couldn't read this file. You can still add positions manually, or send this file to support@folio.app"
- "Report import issue" button → logs file type + broker name (no PII) → builds QA library
- Hardcoded Smartbroker+ fast-path still runs first — saves a Claude call when detected

### Competitive edge

Parqet supports 50+ brokers via hardcoded PDF/CSV parsers — engineering-heavy, breaks on format changes. folio.'s AI parser works on any broker from day one, including ones that don't exist yet, and handles format changes automatically.

-----

## 🔧 Phase 2d — Tink Open Banking Integration (AUTO-SYNC)

> **Provider decision: Tink** (owned by Visa) — replaces previously planned wealthAPI for launch.
> GoCardless Nordigen closed new accounts in July 2025. Tink is the best available alternative:
> 6,000+ EU banks and brokers, PSD2-compliant, used by major fintechs across Europe.
> 
> **Requires a registered GmbH/UG** before applying for a production account.
> Build the product first, form the company, then apply.
> 
> **wealthAPI** deferred to Phase 2e — only needed once Tink coverage proves insufficient
> for a meaningful share of users (~3,000 users is the reassessment point).

### Why Tink works for broker sync

Modern neobrokers (Trade Republic, Scalable Capital, DKB, ING, Flatex) expose their depot
accounts via PSD2/open banking APIs. Tink can read these the same way it reads a Giro account.
The transaction data includes ISIN, quantity, price — enough to reconstruct holdings and cost basis.

### PSD2 Parser (lib/psd2-parser.js)

Raw PSD2 transactions from brokers require parsing to reconstruct a portfolio. This is a
one-time engineering investment — not an ongoing API cost.

- [ ] Detect transaction type from description:
  - BUY  → "Kauf", "Erwerb", "Kauf von", "Wertpapierkauf"
  - SELL → "Verkauf", "Veräußerung", "Wertpapierverkauf"
  - DIV  → "Dividende", "Ausschüttung", "Dividendengutschrift"
  - FEE  → "Gebühr", "Provision", "Transaktionskosten", "Ordergebühr"
  - XFER → "Einzahlung", "Auszahlung", "Überweisung"
- [ ] Extract: ISIN, quantity, price per share, total amount, currency, date
- [ ] Resolve ISIN → FMP symbol (local ISIN map + FMP `/search` fallback)
- [ ] Apply corporate actions from FMP (`/historical-price-full` splits/mergers)
- [ ] Reconstruct current holdings: quantity = sum(buys) - sum(sells) per ISIN
- [ ] Calculate cost basis: weighted average purchase price per position
- [ ] Handle multi-currency: EUR-denominated + USD positions with daily FX

### Supabase Schema

```sql
-- Tink connection per user
create table tink_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  institution_id text not null,
  institution_name text,
  access_token text not null,       -- encrypted at rest
  consent_expires_at timestamptz,   -- 90-day PSD2 window
  last_synced_at timestamptz,
  status text default 'active'      -- active | expired | error
);

-- Full transaction log (source of truth)
create table portfolio_transactions (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  symbol text,
  isin text,
  type text not null,               -- BUY | SELL | DIVIDEND | FEE | TRANSFER
  quantity numeric,
  price numeric,
  currency text default 'EUR',
  total_amount numeric,
  date date not null,
  raw_description text,
  source text default 'manual'      -- manual | tink | csv
);

-- Rebuilt nightly from transactions
create table current_holdings (
  user_id uuid references auth.users not null,
  symbol text not null,
  isin text,
  quantity numeric not null,
  avg_cost_basis numeric,
  total_invested numeric,
  primary key (user_id, symbol)
);

-- Bank account spending (for budgeting features)
create table spending_transactions (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  currency text default 'EUR',
  category text,
  merchant text,
  date date not null,
  account_id text,
  raw_description text
);
```

### Implementation

- [ ] `api/tink-link.js` — generate Tink OAuth URL for user
- [ ] `api/tink-callback.js` — exchange auth code for access token, store encrypted
- [ ] `api/sync-accounts.js` — daily cron: fetch transactions → parse → upsert holdings
- [ ] `lib/psd2-parser.js` — transaction type detection + ISIN extraction
- [ ] `lib/holdings-builder.js` — reconstruct holdings from transaction log
- [ ] 90-day re-auth flow: email reminder at day 80 → re-auth banner in app at day 88
- [ ] Connection status in Settings ("Connected · Last synced 2 min ago")
- [ ] CSV import remains as fallback (privacy-conscious users, unsupported brokers)

### GDPR & Trust

- Tink is PSD2-licensed across EU, GDPR-compliant, Visa-backed
- Read-only access only — emphasize prominently: "We can never move your money"
- Access tokens encrypted at rest in Supabase
- Users can disconnect and delete all synced data at any time

### Coverage — primary targets

|Broker                |PSD2 via Tink|Notes                  |
|----------------------|-------------|-----------------------|
|Trade Republic        |✓            |Good transaction detail|
|Scalable Capital      |✓            |Good transaction detail|
|DKB                   |✓            |Major German bank      |
|ING Germany           |✓            |Major German bank      |
|Flatex / flatex DEGIRO|✓            |Pan-EU broker          |
|Comdirect             |✓            |Commerzbank subsidiary |
|Smartbroker+          |check        |Requires verification  |
|Bitvavo (crypto)      |partial      |Manual/CSV fallback    |

### Phase 2e — wealthAPI (deferred, ~3,000 users)

> Reassess when Tink coverage proves insufficient for a meaningful user share.
> wealthAPI provides enriched depot data (pre-normalised, corporate actions handled)
> for 100+ German brokers, but costs €0.21/user/month (Startup: €1,488/mo flat).
> Trigger: user feedback showing >10% of users can't connect their broker via Tink.

-----

## 🔧 Phase 2e — Extended Benchmarks & Model Portfolio Comparison

### Part A — Additional Index Benchmarks

**Current benchmarks (implemented):** S&P 500 (SPY), Nasdaq 100 (QQQ), DAX (EWG), Bitcoin (GBTC)

**New indices to add** — all fetchable via FMP historical prices, all USD→EUR converted:

|Label                |Ticker|What it represents                                                         |
|---------------------|------|---------------------------------------------------------------------------|
|MSCI World           |IWDA  |Global developed markets — the European passive investor's default         |
|MSCI Emerging Markets|EEM   |EM exposure — China, India, Brazil etc.                                    |
|Euro Stoxx 50        |FEZ   |Europe's 50 largest companies                                              |
|Russell 2000         |IWM   |US small caps                                                              |
|Gold                 |GLD   |Inflation hedge / safe haven                                               |
|Global Bonds (Agg)   |AGG   |US investment-grade bond aggregate                                         |
|60/40 (synthetic)    |—     |Computed: 60% SPY + 40% AGG daily weighted — the classic balanced benchmark|

**UI change:** The benchmark pill strip becomes scrollable / wraps. Max 3 active at once to keep chart readable. Each pill shows the index name, not the ticker.

### Part B — Model Portfolio Comparison

**Concept:** Instead of comparing against a single index, the user can benchmark their portfolio against a *strategy* — a named, weighted blend of ETFs representing a real-world investment approach. This answers: *"How would I have done if I just did the lazy ETF thing?"*

**How it works technically:**

- Each model portfolio is a static list of `{ ticker, weight }` pairs
- Chart engine fetches historical prices for each component ticker (same FMP path already used)
- Computes a weighted daily return: `modelReturn = Σ(weight_i × price_i_t / price_i_t0)`
- Applies TWR normalization (same as portfolio and benchmarks) — so it starts at 0% and is directly comparable
- No cash flow mirroring needed — model portfolios are buy-and-hold from day 0

**Model portfolios to include (v1):**

|Name                    |Allocation                           |Philosophy                                                   |
|------------------------|-------------------------------------|-------------------------------------------------------------|
|🌍 **World ETF**         |100% IWDA                            |Single-fund global passive — simplest possible strategy      |
|🇺🇸 **S&P 500 Pure**      |100% SPY                             |US-only passive — most popular benchmark worldwide           |
|⚖️ **Classic 60/40**     |60% SPY + 40% AGG                    |Stocks/bonds balanced — traditional risk-managed portfolio   |
|🌐 **Global Diversified**|50% IWDA + 30% EEM + 20% AGG         |Global stocks + EM + bonds — well-diversified moderate risk  |
|📈 **Growth**            |60% QQQ + 25% SPY + 15% ARKK         |Tech-heavy growth — high risk, high upside                   |
|💰 **Dividend Income**   |40% VYM + 30% SCHD + 30% AGG         |Dividend-focused + bonds — income-oriented conservative      |
|🏗️ **All Weather**       |30% SPY + 40% TLT + 15% GLD + 15% IEF|Ray Dalio's All Weather — designed for any macro environment |
|🪙 **Crypto Tilt**       |70% SPY + 20% GBTC + 10% ETHE        |Traditional + crypto allocation — for risk-tolerant investors|

**UI:**

```
[Benchmarks]  ● S&P 500  ○ Nasdaq  ○ MSCI World  ○ Gold  ○ ...

[Model Portfolios]  ○ World ETF  ○ Classic 60/40  ○ Global Diversified  ○ Growth  ○ ...
```

- Two separate pill groups: "Indices" and "Model Portfolios"
- Selecting a model portfolio shows it as a distinct line colour with a dashed style to differentiate from single-index lines
- Tooltip shows model name + current % return
- On hover/click of a model portfolio pill: small popover shows the allocation breakdown (e.g. "60% SPY · 40% AGG")
- Max 1 model portfolio active at a time (they're complex enough on their own)

**Implementation notes:**

- All component tickers (IWDA, EEM, AGG, TLT, GLD, VYM, SCHD, IEF, ARKK, ETHE) need to be added to the FMP historical fetch batch in `fetchChart`
- Weighted return calculation happens in the row assembly loop — very cheap, no extra API calls if tickers are already fetched
- Model portfolio definitions are a static constant `MODEL_PORTFOLIOS` in App.jsx — no backend needed
- ARKK and ETHE may have limited FMP coverage on current plan — fallback gracefully (skip component, reweight remaining)

**Future:** Allow users to create custom model portfolios (Premium feature — Phase 4 territory)

### Part C — Model Portfolios in Watchlist (Settings)

**Concept:** Any model portfolio can be "pinned" to the Watchlist feature so the user can track it alongside their individual stock/ETF watchlist entries — without it being part of their actual portfolio.

**Settings tab — "Model Portfolios" section:**

- Lists all available model portfolios with name, allocation summary, and a toggle/button to add or remove from watchlist
- Adding pins it as a watchlist entry; removing unpins it — the model portfolio definition itself is never deleted
- Clear label distinction: "Add to Watchlist" / "Remove from Watchlist" (never "Delete")

**Watchlist behaviour once pinned:**

- Appears as a row in the Watchlist view with a special `[MODEL]` tag (like the `[ETF]` / `[STOCK]` tags)
- Shows current % return (TWR, same calculation as the chart) for the selected time range
- Shows allocation breakdown on hover/expand (e.g. "60% SPY · 40% AGG")
- Can be organised into watchlist categories like any other entry
- Cannot be edited inline (it's a read-only reference strategy) — edit happens only in Settings

**Data model:**

- `watchlists` array already exists in Supabase state
- Pinned model portfolios stored as watchlist items with `type: 'model-portfolio'` and `modelId: 'classic-60-40'` (references the static `MODEL_PORTFOLIOS` constant)
- On removal from watchlist: item deleted from watchlist array — `MODEL_PORTFOLIOS` constant untouched
- No backend changes needed — purely frontend state + existing Supabase persist

-----

## 🔧 Phase 2g — Crypto Tools Suite

A set of Bitcoin-specific and altcoin-specific analytical tools. All chart-heavy, data-driven, and designed to give crypto holders the signals that professional traders already use.

### Tool 1 — Altcoin Season Chart & Indicator

**Concept:** Classic "Altcoin Season Index" — what percentage of the top 50 altcoins have outperformed Bitcoin over the last 90 days. Widely used by crypto traders to time rotation from BTC into alts and back.

**Index logic:**

- Fetch 90-day price return for BTC and the top 50 altcoins (by market cap, excl. stablecoins) via CoinGecko
- Count how many altcoins have outperformed BTC over that window
- `altcoin_season_score = (count / 50) * 100` → 0–100
- Score ≥ 75 = **Altcoin Season** 🟢; Score ≤ 25 = **Bitcoin Season** 🟠; middle = **Neutral** 🟡

**Chart:**

- Time-series line chart of the index score (daily, rolling) — last 2 years of history
- Horizontal bands: green zone (≥75), orange zone (≤25), grey neutral
- Current score badge prominently displayed with label + emoji
- Table below: top 50 coins ranked by 90-day BTC-relative outperformance

**Data source:** CoinGecko `/coins/markets` (already used) — no additional API cost
**Refresh:** Daily cron job (Vercel), cached in Supabase

### Tool 2 — Bitcoin Accumulate / Hold / Sell Signals

**Concept:** Composite signal dashboard aggregating the most widely-followed BTC on-chain and market cycle indicators, distilled into a single actionable signal per indicator plus an overall composite.

**Indicators included:**

|Indicator              |Signal logic                                                                            |Data source                                    |
|-----------------------|----------------------------------------------------------------------------------------|-----------------------------------------------|
|**BTC Rainbow Chart**  |Log-regression price band the current price falls into (Deep Value → Maximum Bubble)    |Computed from CoinGecko historical prices      |
|**MVRV Z-Score**       |Market cap vs. realised cap vs. historical std dev — classic overheating signal         |Computed / CoinGecko approximation             |
|**Pi Cycle Top**       |111-day MA vs. 2× 350-day MA crossover — historically pinpoints cycle tops within 3 days|CoinGecko historical prices                    |
|**200-week MA Heatmap**|Distance of current price from 200-week MA — colour-coded accumulation zones            |CoinGecko historical prices                    |
|**Puell Multiple**     |Daily BTC issuance value vs. 365-day moving average — miner profitability cycle signal  |Approximated from price + block reward schedule|
|**Fear & Greed Index** |Already sourced from Alternative.me API                                                 |Existing integration                           |

**Output per indicator:**

- Signal pill: `ACCUMULATE` 🟢 / `HOLD` 🟡 / `REDUCE` 🟠 / `SELL` 🔴
- One-line explanation ("Price is in the 'Fire' band — historically strong accumulation zone")
- Confidence level (based on how deep into the zone current readings are)

**Composite signal:** weighted average of all indicators → single master signal card at the top

**Data sources:** All computable from CoinGecko historical price data (free/Analyst plan). No Glassnode required.

### Tool 3 — Bitcoin 4-Year Cycle Chart

**Concept:** Overlays all historical BTC 4-year cycles on a single chart aligned by halving date, plus projects the *current cycle* forward based on historical cycle shape.

**Chart design:**

- X-axis: days since halving (0 → ~1460)
- Y-axis: BTC price indexed to 1.0 at halving date (% change from halving)
- Lines: Cycle 1 (2012), Cycle 2 (2016), Cycle 3 (2020), Cycle 4 (2024 — current, thicker line, live data)
- **Projected path:** dashed line continuing Cycle 4 based on weighted average of prior cycles (with confidence band shading)
- Halving date markers, ATH markers per cycle, current position indicator ("📍 You are here — Day 342")

**Projection methodology:**

- At each future day `d`, projected price = current halving-day price × weighted_avg(cycle1[d], cycle2[d], cycle3[d]) indexed returns
- Weights: cycle3 = 50%, cycle2 = 30%, cycle1 = 20% (recency bias)
- Confidence band: ±1 std dev across historical cycles at that day

**Data:** CoinGecko historical daily prices (free, goes back to 2013)
**Halving dates hardcoded:** Nov 28 2012, Jul 9 2016, May 11 2020, Apr 19 2024, next ~2028

### Tool 4 — Altcoin Sell Strategy Builder

**Concept:** Given a user's altcoin holding, calculate exactly how many tokens to sell at each target price to achieve specific financial goals — while keeping a defined "moon bag" for maximum upside.

**User inputs:**

- Coin (picker, auto-fills current price)
- Amount held (tokens)
- Average buy price (auto-filled from portfolio if holding exists, editable)
- Total invested (€ — auto-calculated, editable)

**Targets — auto-calculated, editable:**

|Goal      |Label                                          |What it means                 |
|----------|-----------------------------------------------|------------------------------|
|Break-even|Sell enough to recover 100% of invested capital|Keep remaining tokens for free|
|2×        |Sell enough to bank 2× invested                |Keep rest riding              |
|3×        |Sell enough to bank 3× invested                |Keep rest riding              |
|5×        |Sell enough to bank 5× invested                |Keep rest riding              |
|10×       |Sell enough to bank 10× invested               |Keep rest riding — moon bag   |

**Output per target row:**

- Target price (€/token) — at what price this goal is achieved
- Tokens to sell
- € to receive (gross)
- Tokens remaining ("moon bag") + their current value
- % of position being sold

**Visual:** Horizontal stacked bar showing "sell zone" vs "moon bag" per target — colour progresses from 🟢 (conservative) to 🟡 to 🔴 (moon bag)

**Also shows:** At current price, what would selling X% of position return? Slider for quick simulation.

**Integration:** If coin is in user's portfolio, auto-populates amount and avg buy price. Otherwise manual entry. Results exportable as a simple plan summary.

### Availability

All four tools: **Premium tier only** (€10.99/mo)

**Navigation:** New "Crypto Tools" tab in the main nav (visible to all users, Premium paywall on content)

**Additional API cost:** Near zero — all tools compute from CoinGecko price history already fetched. No new API subscriptions required.

-----

## 🔧 Phase 2h — Global Search

### Overview

A universal search bar accessible from anywhere in the app — not just the watchlist or compare tool. Search for any stock, ETF, or coin by name or ticker, see the full detail view, and add it to a watchlist in one tap.

### Entry points

- **Top nav** — persistent search icon (🔍) in the header, always visible regardless of active tab
- **Keyboard shortcut** — `Cmd+K` / `Ctrl+K` opens search modal (standard power-user pattern)
- No separate "Search" tab needed — the modal overlay pattern keeps it lightweight

### Search modal behaviour

- Opens as a centred overlay with a text input auto-focused
- Results appear instantly as the user types (debounced ~300ms)
- Searches across: stocks (FMP), ETFs (FMP), coins (CoinGecko) — unified results list
- Results grouped by type: **Stocks & ETFs** / **Crypto** with a subtle divider
- Each result row shows: logo/icon, name, ticker/symbol, current price, daily change %, asset type pill (`[STOCK]` / `[ETF]` / `[CRYPTO]`)
- Click any result → opens the existing **Asset Detail drawer/modal** (same component used in watchlist and compare tool — no new UI to build)
- `Esc` closes modal

### Add to Watchlist

- Inside the Asset Detail view (opened from search or anywhere else), a persistent **"+ Add to Watchlist"** button lives in the header of the detail panel
- If already in a watchlist: button shows **"✓ In Watchlist"** (greyed, or with a dropdown to pick which list)
- Clicking opens a small popover: list of user's watchlists with checkboxes → confirm → added
- Works identically whether the user arrived via search, screener, compare tool, or portfolio click

### Data sources

- Stocks/ETFs: FMP `/search?query=` endpoint (already used in screener/compare)
- Crypto: CoinGecko `/search` endpoint (free, no additional cost)
- No new API subscriptions required

### Availability

- Search is available to **all users** (Free, Starter, Premium)
- The detail view respects existing tier gates (e.g. AI analysis sections are still Premium-only)
- "Add to Watchlist" is available to all users

-----

## 🔧 Phase 2i — New User Email Notification

### Overview

Whenever a new user creates an account, an automated email is sent to the founder (you) with basic signup details. Simple, zero-infrastructure — no analytics dashboard needed at this stage.

### Trigger

Supabase Auth webhook on `user.created` event → calls a Vercel serverless function → sends email.

### Implementation

**Option A — Supabase webhook → Vercel function → Resend API (recommended)**

- Supabase Dashboard → Auth → Webhooks → add webhook for `INSERT` on `auth.users`
- Webhook calls `POST /api/notify-new-user` (new Vercel function)
- Function sends email via Resend (free tier: 3,000 emails/mo, no credit card required)
- Simple, free, reliable

**Option B — Supabase Database webhook + pg_net (no extra service)**

- Postgres trigger on `auth.users` INSERT → `pg_net.http_post` to a notification endpoint
- Slightly more complex to set up but keeps everything in Supabase

**Recommended: Option A** — Resend is trivial to integrate and the free tier is more than sufficient.

### Email content

```
Subject: 🎉 New folio. user — {email}

New signup on folio.

Email:      user@example.com
Signed up:  Friday, 13 March 2026 at 14:32 UTC
Provider:   email / google / github
User ID:    uuid-xxxx-xxxx

Total users to date: 42
```

Total users count: simple `SELECT COUNT(*) FROM auth.users` query in the Vercel function before sending.

### Vercel function sketch

```javascript
// api/notify-new-user.js
export default async function handler(req, res) {
  const { email, id, created_at, app_metadata } = req.body.record;

  // Get total user count
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  await resend.emails.send({
    from: 'folio <noreply@yourfoliodomain.com>',
    to: 'you@youremail.com',
    subject: `🎉 New folio. user — ${email}`,
    html: `...`
  });

  res.status(200).json({ ok: true });
}
```

### Cost

|Item                              |Cost                          |
|----------------------------------|------------------------------|
|Resend free tier (3,000 emails/mo)|**€0**                        |
|Vercel function invocation        |**€0** (well within free tier)|
|**Total**                         |**€0**                        |

### Security note

Verify the webhook secret (Supabase sends a `x-supabase-signature` header) to ensure only legitimate Supabase calls can trigger the notification function.

-----

## ✅ Phase 3 — Fundamentals & Stock Research (MOSTLY COMPLETE)

### ✅ 3a — Financial Data Layer (FMP Integration) (COMPLETE)

- [x] Integrate **Financial Modeling Prep API** as primary data source
  - [x] Income statements, balance sheets, cash flow (via `/api/fundamentals` endpoint)
  - [x] Key ratios: P/E, P/B, EV/EBITDA, FCF yield, ROIC, debt/equity
  - [x] **Historical daily prices** — foundation for the real performance chart
- [x] Replace Yahoo Finance unofficial proxy with FMP — **Yahoo Finance fully removed**
- [x] **XETRA/gettex price support** — German & EU stocks priced in EUR natively
  - [x] `.DE` suffix for XETRA tickers (SAP.DE, BMW.DE, ALV.DE, VWCE.DE etc.)
  - [x] Smart ticker resolution: try `.DE` first → `.AS` (Amsterdam) → plain ticker (US)

**Still TODO:**

- [ ] Upgrade to FMP Premium plan (€97/mo) — currently on a lower tier; some endpoints return "Premium required" errors
- [ ] ETF holdings data + corporate actions (splits, mergers — needed by future PSD2 parser)

### ✅ 3a+ — Real Historical Performance Chart (COMPLETE — enabled by FMP)

- [x] Load all confirmed transactions (buys/sells with dates + quantities)
- [x] For each day in range: reconstruct holdings from transaction log
- [x] Fetch historical daily price per ISIN from FMP
- [x] Portfolio value on day D = sum(qty_held × price) across all positions
- [x] TWR (time-weighted return) — deposit-agnostic comparison, both portfolio and benchmarks start at 0%

**Still TODO:**

- [ ] Cache historical prices in Supabase — avoid repeated FMP calls

### ✅ 3b — Fundamentals Bar Charts (COMPLETE)

- [x] Revenue, gross profit, operating income, net income, EPS, EBITDA bar charts
- [x] Operating cash flow, free cash flow, capex, total debt charts
- [x] Margin trends (gross, operating, net)
- [x] Color-coded bars (green = improving, red = deteriorating)
- [x] Quarterly + annual toggle
- [x] Balance sheet trend (total assets, equity)

### ✅ 3c — Stock Comparison Tool (COMPLETE)

- [x] Side-by-side comparison of up to 4 stocks
- [x] Visual comparison bars for Valuation (P/E trailing, forward FY1/FY2, P/B, PEG, EV/EBITDA)
- [x] Profitability metrics (gross/operating/net margin, ROE, ROIC)
- [x] Growth metrics (revenue YoY, EPS TTM/FY1/FY2)
- [x] Health Score comparison per stock
- [x] Live autocomplete search for adding stocks
- [x] Color-coded bars with good/bad thresholds per metric

### ✅ 3d — Health Scorecard (COMPLETE — algorithmic, no AI)

- [x] 6-dimension scorecard: Profitability · Growth · Economic Moat · Balance Sheet · Cash Generation · Valuation
- [x] Overall Health Score (0–100) with progress bar
- [x] Sector-adjusted thresholds (Damodaran NYU Stern benchmarks)
- [x] Moat proxy-scored from ROIC, gross margin, ROE, revenue consistency — **not Claude**
- [x] Feeds directly into Screener filters

### ✅ 3e — TradingView Lightweight Charts (COMPLETE)

- [x] Candlestick, line, area charts
- [x] Drawing tools: trend lines, horizontal levels, fibonacci
- [x] Time ranges: 1D / 1W / 1M / 3M / 1Y / ALL

### 🔧 3f — Insider Transactions

> **Data source:** FMP `/stable/insider-trading/search?symbol={ticker}` — already included in
> the Premium plan we're on. Zero additional API cost.
> **Coverage:** US-listed stocks only (SEC Form 3/4/5 filings). EU stocks (SAP.DE, BMW.DE etc.)
> not covered — make this clear in the UI.
> **Competitive edge:** Parqet Terminal shows raw insider data (waitlist only, no AI).
> folio. shows raw data on Starter AND adds AI signal interpretation on Premium.

#### Insider tab on stock detail page (Starter+ — algorithmic, zero Claude cost)

- [ ] Transaction table: insider name · role · buy/sell · shares · price · total value · date
- [ ] Filter: last 30 / 90 / 365 days
- [ ] Net buy/sell bar: visual 90-day summary — total $ bought vs total $ sold
- [ ] Role highlight: CEO/CFO/Director purchases weighted more prominently than minor holders
- [ ] "View SEC filing" link per transaction row
- [ ] "No insider data available" graceful fallback for EU stocks

#### Insider signal summary (Premium — on-demand, counts toward AI quota)

- [ ] Claude-generated 2-3 sentence interpretation of the recent pattern
- [ ] Output: signal (Bullish / Neutral / Bearish) + confidence + plain-English explanation
  - Example: "3 executives have bought a combined $4.2M in the last 90 days with zero sells — historically a strong confidence signal at this company."
- [ ] Feeds into portfolio chat context payload: `insiderSignal` per holding
  - Enables chat queries like "Which stocks in my portfolio have the most insider buying?"

#### Caching & data pipeline

```javascript
// api/cron-insiders.js — daily cron, runs after market close
// For each symbol in the top-1000 watchlist:
//   GET /stable/insider-trading/search?symbol={ticker}&limit=50
//   Upsert into insider_transactions table
//   If significant new purchase (>$500K): flag for AI summary refresh
```

```sql
create table insider_transactions (
  id bigserial primary key,
  symbol text not null,
  filing_date date,
  transaction_date date,
  insider_name text,
  insider_role text,           -- CEO, CFO, Director, 10% Owner, etc.
  transaction_type text,       -- P (purchase) / S (sale) / A (award)
  shares numeric,
  price_per_share numeric,
  total_value numeric,
  shares_owned_after numeric,
  sec_filing_url text,
  created_at timestamptz default now()
);
create index on insider_transactions(symbol, transaction_date desc);

-- Cached AI summary (refreshed when significant new activity detected)
create table insider_summaries (
  symbol text primary key,
  signal text,                 -- Bullish / Neutral / Bearish
  confidence text,             -- High / Medium / Low
  summary text,
  net_90d_bought numeric,
  net_90d_sold numeric,
  transaction_count_90d int,
  generated_at timestamptz
);
```

### 🔧 3g — Dividend Dashboard & Calendar

> **Competitive context:** Parqet's dividend calendar with 24-month forecasts is one of their most loved features.
> folio. needs parity here — and can exceed it by showing crypto staking rewards alongside traditional dividends.

#### Historical dividend tracking

- [ ] Parse dividend transactions from all sources (Tink, CSV import, AI import, manual entry)
- [ ] Dividend history view: total received per month, quarter, year — filterable by broker, by stock
- [ ] Per-position dividend yield (actual yield based on cost basis, not just trailing yield from FMP)
- [ ] Dividend growth tracking: compare year-over-year dividend income growth

#### Dividend estimates & forecast

- [ ] Forward dividend estimates per holding using FMP dividend calendar data (`/stock_dividend_calendar`)
- [ ] Quarterly + annual projected income: "You're on track to receive ~€840 in dividends this year"
- [ ] Per-position breakdown: expected next payment date, expected amount, ex-dividend date
- [ ] Distinguish between confirmed (ex-date passed) and estimated (based on historical pattern)

#### Dividend calendar

- [ ] Monthly calendar view showing expected dividend payment dates for all portfolio holdings
- [ ] Colour-coded by status: confirmed (green), estimated (gold), past (dimmed)
- [ ] Click on a date → shows which stocks pay, how much, ex-date
- [ ] Summary bar at top: "This month: ~€62 from 4 positions"

#### Data sources

- FMP `/stock_dividend_calendar` for upcoming dates
- FMP `/historical-price-full/stock_dividend/{symbol}` for per-stock dividend history
- Transaction log (portfolio_transactions) for actual received dividends
- No additional API cost — all covered by existing FMP plan

#### Access

- **Starter:** Historical dividends + simple calendar
- **Premium:** Full forecast + estimates + dividend growth tracking

-----

### 🔧 3h — Earnings Calendar

> Track upcoming earnings dates for stocks in the portfolio and/or watchlists.
> Essential for active investors — no surprises on reporting day.

- [ ] Earnings calendar pulling from FMP `/earning_calendar` endpoint
- [ ] Scope selection: user chooses what feeds the calendar — portfolio only, specific watchlist(s), or all watchlists
- [ ] Calendar view (monthly) with earnings dates highlighted
- [ ] List view: upcoming earnings sorted by date, showing: company, date, time (BMO/AMC), EPS estimate, revenue estimate
- [ ] Past earnings: actual vs estimate (beat/miss indicator), stock price reaction (% change on day)
- [ ] Notification-ready: flag for push notifications in Phase 7 (mobile)

#### Access

- **Starter:** Portfolio earnings only
- **Premium:** Portfolio + any watchlist(s)

-----

### 🔧 3i — Portfolio Activity Tab

> A unified activity feed showing all transactions across all brokers/wallets/exchanges.
> Inspired by Parqet's activity view — collapsible by year and by broker.

- [ ] Activity tab in the Portfolio section, alongside existing Holdings tab
- [ ] Lists all transactions from all imported sources (Tink, CSV, AI import, manual)
- [ ] **Collapsed by default** — shows year headers (2026, 2025, 2024…) with summary: total buys, total sells, total dividends, net invested
- [ ] Click to expand a year → shows transactions grouped by broker/exchange/wallet
- [ ] Each broker group also collapsible, showing: transaction date, type (buy/sell/dividend/fee/transfer), asset, quantity, price, total amount
- [ ] Sort by date (newest first within each group)
- [ ] Filter bar: by transaction type (buy/sell/dividend/transfer), by broker, by asset
- [ ] Search within activity (find a specific transaction)
- [ ] Running totals per year: net invested, total dividends, total fees

#### Data source

- `portfolio_transactions` table (already exists) + `txData` state in App.jsx
- No additional API calls — purely reads from existing transaction log

#### Access

- **All tiers** — activity tab is a portfolio feature, not an AI feature

-----

> All stock-level AI features use **quarterly caching**:
> Earnings calendar cron → triggers grading → stores in DB → users see instantly.
> Cost: ~€35/quarter for 1,000 stocks regardless of user count.
> 
> **These are genuine Claude calls — not available on Free or Starter tier.**

### 4a — AI Economic Moat Rating (Premium)

- [ ] Rating: Wide / Narrow / None — Claude-evaluated across 5 moat types
- [ ] Input: company fundamentals from FMP
- [ ] Output: rating + 2-3 sentence explanation
- [ ] Pre-cached for top 1,000 global stocks, updated quarterly
- [ ] On-demand refresh counts toward user's 20 runs/mo quota

### 4b — AI DCF / Intrinsic Value (Premium)

- [ ] DCF using real FMP financial data — model shows its work
- [ ] Shows: intrinsic value + current price + margin of safety %
- [ ] Validated against DCF + EV/EBITDA + P/FCF
- [ ] Pre-cached quarterly + on-demand (counts toward quota)

### 4c — AI Balance Sheet Grade (Premium — auto on earnings)

- [ ] Grade: A+ / A / B+ / B / C / D — sector-aware
- [ ] Triggered by earnings calendar cron — does NOT count toward user quota
- [ ] User sees: grade + headline + 2 strengths + 1-2 risks + QoQ change

### 4d — AI ETF Analyzer (Premium)

- [ ] TER check: find cheaper alternatives
- [ ] Closure risk: flag AUM < €50M
- [ ] Overlap analysis across full portfolio
- [ ] Diversification score

### 4e — AI Portfolio Analysis (Premium — 5 runs/mo)

- [ ] Concentration risk, geographic/sector exposure, rebalancing suggestions
- [ ] Bear / Base / Bull scenarios (1Y and 5Y) — clearly labeled as scenario analysis
- [ ] Updated on-demand, counts toward 5 runs/mo quota

### 4f — Smart News Architecture (spec complete, ready to build)

- [ ] `api/cron-news.js` — daily: fetch FMP headlines → store raw in `stock_news` table
- [ ] `api/news-summary.js` — on-demand: serve cached summary if <7 days old, else call Claude
- [ ] Cost: ~€0.15/mo vs €49/mo naive daily approach
- [ ] Available on Starter tier (cached, not counted against quota)

```sql
create table stock_news (
  id bigserial primary key,
  symbol text not null,
  headline text not null,
  url text,
  published_at timestamptz,
  source text,
  fmp_sentiment text,
  ai_summary text,
  ai_summary_at timestamptz,
  created_at timestamptz default now()
);
create index on stock_news(symbol, published_at desc);
```

### 4g — Portfolio Chat (Premium — 50 messages/mo) ⭐

> Conversational AI with full knowledge of the user's actual portfolio.
> The key Premium differentiator that competitors cannot easily replicate.

- [ ] `api/portfolio-chat.js` — check quota → build context → call Claude → stream response
- [ ] Context payload sent to Claude:
  - Current holdings (symbol, quantity, cost basis, current value, P&L)
  - Cached health scores per holding
  - Cached DCF / moat data where available
  - Recent portfolio performance
- [ ] Conversation history: last 10 messages kept for context
- [ ] System prompt enforces: data-driven analysis only, never financial advice
- [ ] Examples: "Which of my holdings is most overvalued?" / "Where is my portfolio most concentrated?" / "Which stock in my portfolio has the weakest balance sheet?"
- [ ] Quota deducted per message. Quota bar visible at top of chat window.

#### AI Quota tracking schema

```sql
create table ai_usage (
  user_id uuid references auth.users not null,
  month text not null,              -- '2026-03'
  chat_messages_used int default 0,
  dcf_runs_used int default 0,
  moat_runs_used int default 0,
  portfolio_analyses_used int default 0,
  reset_at timestamptz,
  primary key (user_id, month)
);
```

### 4h — AI Crypto Fundamental Analysis & Survival Score

#### Overview

Just as Phase 4a delivers AI moat analysis for stocks, Phase 4h delivers AI-powered fundamental analysis for any cryptocurrency — summarising what actually makes a coin worth holding, and distilling it into a single **Survival Score** (0–100). The top 500 coins by market cap are analysed quarterly and buffered; any coin outside that set is analysed on-demand when a user views it.

#### Data Inputs (per coin)

All sourced from a single CoinGecko `/coins/{id}` call with full flags, which returns everything needed:

|Signal                   |CoinGecko field                                                           |
|-------------------------|--------------------------------------------------------------------------|
|Project description      |`description.en`                                                          |
|Categories / sector      |`categories[]`                                                            |
|Website, whitepaper, docs|`links.homepage`, `links.whitepaper`                                      |
|GitHub activity          |`developer_data` (commits, contributors, forks, stars, PRs)               |
|Community size           |`community_data` (Twitter followers, Reddit subscribers, Telegram members)|
|Market data              |`market_data` (market cap, volume, ATH, circulating vs total supply)      |
|Exchange listings        |`tickers[]` — which CEX/DEX the coin trades on                            |
|Contract addresses       |`platforms` — which chains it's deployed on                               |
|Genesis date             |`genesis_date`                                                            |

No additional API subscriptions needed. CoinGecko Analyst plan ($129/mo) is already required for price data — the fundamental data rides for free on existing calls.

#### AI Analysis Dimensions

Claude receives the structured CoinGecko data and a research prompt covering **8 dimensions**:

**1. Use Case & Real-World Utility**
Does this coin solve a genuine problem? Is the use case novel or just replicating existing solutions? What industries or workflows does it target?

**2. Partnerships & Enterprise Adoption**
Has the project announced partnerships with established companies, governments, or financial institutions? Are those partnerships live/operational or just MOUs? Examples: Chainlink × Mastercard, XRP × bank settlement rails.

**3. Institutional & ETF Adoption**
Is there an ETF? Are hedge funds, treasuries, or public companies holding it? Has BlackRock, Fidelity, or similar filed for related products?

**4. Developer Activity & Ecosystem Health**
GitHub commit frequency, number of active contributors, open issues vs closed, forks. Is development accelerating or stagnating? Are third-party dApps building on this chain?

**5. Tokenomics & Supply Dynamics**
Circulating vs max supply ratio. Inflation schedule. Vesting cliffs. Is there a burn mechanism? Are large holders (VCs, team) still in lock-up or already unlocked?

**6. Network Security & Decentralisation**
PoW / PoS / other consensus. Number of validators or miners. Has the network been exploited? Is it battle-tested?

**7. Competitive Moat**
What are the top 3 direct competitors? Is this coin the category leader or a challenger? What switching costs exist for users and developers?

**8. Regulatory Risk**
Is the coin a registered security in any jurisdiction? Has it been targeted by the SEC, ESMA, or other regulators? Is it MiCA-compliant?

#### Survival Score (0–100)

A single AI-generated score summarising long-term survival probability across a 5-year horizon. **Not a price prediction** — explicitly a fundamental durability score.

**Score bands:**

|Score |Label            |Colour   |
|------|-----------------|---------|
|80–100|🟢 Strong Survivor|`#00e5a0`|
|60–79 |🟡 Likely Survivor|`#f0c040`|
|40–59 |🟠 Uncertain      |`#ff8c42`|
|20–39 |🔴 At Risk        |`#ff4d6d`|
|0–19  |⚫ High Risk      |`#888`   |

**Scoring weights (AI-applied, not hard-coded — used in the prompt as guidance):**

|Dimension                        |Weight|
|---------------------------------|------|
|Use case & utility               |20%   |
|Developer activity               |18%   |
|Tokenomics                       |17%   |
|Competitive moat                 |15%   |
|Institutional/enterprise adoption|15%   |
|Network security                 |10%   |
|Regulatory risk (negative)       |5%    |

#### Output Format

```json
{
  "coinId": "chainlink",
  "analysedAt": "2026-03-01T00:00:00Z",
  "quarter": "Q1-2026",
  "survivalScore": 84,
  "scoreBand": "strong-survivor",
  "headline": "Chainlink is the dominant oracle layer with deepening enterprise integrations and near-unassailable network effects.",
  "dimensions": {
    "useCase": { "score": 18, "summary": "Solves a critical infrastructure problem..." },
    "developerActivity": { "score": 16, "summary": "Consistently high commit cadence..." },
    "tokenomics": { "score": 13, "summary": "~50% circulating, ongoing team vesting..." },
    "competitiveMoat": { "score": 13, "summary": "Pyth competes on Solana but LINK dominates EVM..." },
    "institutionalAdoption": { "score": 14, "summary": "Mastercard, UBS, SBI Group partnerships live..." },
    "networkSecurity": { "score": 9, "summary": "Battle-tested since 2017, no major exploits..." },
    "regulatoryRisk": { "score": -4, "summary": "LINK classified as commodity in most jurisdictions..." }
  },
  "keyRisks": ["Team token unlock in Q3 2026", "Pyth gaining Solana share"],
  "keyStrengths": ["First-mover oracle dominance", "150+ enterprise integrations", "EVM standard"]
}
```

#### Buffering Architecture

**Quarterly batch job** (Vercel cron — `0 0 1 1,4,7,10 *`):

1. Fetch top 500 coins by market cap from CoinGecko `/coins/markets`
2. For each coin, fetch full data from `/coins/{id}`
3. Send to Claude Sonnet with analysis prompt
4. Store result in Supabase `crypto_analyses` table with `coin_id`, `quarter`, `analysed_at`, full JSON
5. Batch in groups of 10 with 1s delay to respect rate limits — full run completes in ~10 minutes

**On-demand** (for coins outside top 500, or if buffer is stale):

- Triggered when user opens a coin detail page and no fresh analysis exists
- Same pipeline, single coin — result cached to Supabase immediately

**Staleness:** Any analysis older than 95 days is considered stale and regenerated on next access.

**Supabase schema:**

```sql
crypto_analyses (
  id          uuid primary key,
  coin_id     text not null,           -- CoinGecko ID e.g. 'bitcoin'
  quarter     text not null,           -- 'Q1-2026'
  analysed_at timestamptz not null,
  score       int not null,
  score_band  text not null,
  data        jsonb not null,          -- full analysis JSON
  unique(coin_id, quarter)
)
```

#### UI Placement

**1. Coin detail page / screener drawer**

- Survival Score badge (colour-coded, prominent) next to price
- Expandable accordion: one card per dimension, each with a score bar and 2–3 sentence summary
- "Key Risks" and "Key Strengths" bullet lists
- Footer: `AI analysis by Claude · Q1 2026 · Refresh available Q2 2026`

**2. Portfolio view — crypto holdings**

- Survival Score shown as a small coloured pill next to each crypto holding (like Health Score for stocks)
- Tap/click → opens full analysis

**3. Screener**

- Filter by survival score range (e.g. "Only show coins scoring ≥ 60")
- Sort by survival score column

#### Cost Analysis

|Item                                    |Cost                                   |
|----------------------------------------|---------------------------------------|
|CoinGecko data (500 coins/quarter)      |**$0** — rides on existing Analyst plan|
|Claude API — quarterly batch (500 coins)|**~$10.20/quarter** (~$41/year)        |
|Claude API — on-demand (outside top 500)|**~$0.02 per coin**                    |
|Supabase storage (500 analyses × ~3KB)  |**~1.5 MB** — negligible               |
|**Total annual cost**                   |**~$41/year**                          |

*Assumptions: claude-sonnet-4, ~800 input tokens + ~1200 output tokens per coin. CoinGecko Analyst plan already required for price data.*

**This is one of the highest-value-per-dollar features in the product.** 500 quarterly-refreshed AI fundamental analyses for ~$41/year is essentially free infrastructure.

#### Access Tier

- **Survival Score (number + band only):** Starter plan
- **Full analysis (all 8 dimensions + risks/strengths):** Premium plan
- **Screener filter by score:** Starter plan

#### Disclaimer

Claude's analysis must include: *"This is AI-generated fundamental analysis for informational purposes only. It is not financial advice. Scores are based on publicly available data and may not reflect recent developments."*

-----

### 4i — AI Radar 20: Quarterly High-Conviction Stock Picks ⭐

> **The feature that drives organic traffic and social sharing.**
> Every quarter — after earnings season — Claude selects 20 stocks with the highest probability
> of significant outperformance over a 2–5 year horizon. Not momentum plays, not meme stocks —
> fundamentally undervalued companies with real catalysts that the market is missing.
>
> Think early Palantir at $5, Netflix before streaming took off, NVIDIA before the AI boom.
> The key differentiator: **full public transparency with a tracked record that can never be edited.**

#### Philosophy

- **Time horizon: 2–5 years minimum.** This is not a trading signal. No 1-year targets. No short-term price predictions. The question is: "Will this company be worth significantly more in 3–5 years than the market currently prices it?"
- **Quarterly cadence, timed after earnings season.** The only thing that should change a long-term thesis is new fundamental data — and that arrives quarterly with earnings. Between earnings, nothing has changed except price and sentiment, which are irrelevant for a 3-year thesis. Every addition, removal, or change is grounded in actual new data, not market noise.
- **Publication schedule:** mid-February (after Q4 earnings), mid-May (after Q1), mid-August (after Q2), mid-November (after Q3). Allow 2–3 weeks after the bulk of earnings are reported.
- **Survivorship bias eliminated.** Every quarterly list is timestamped and immutable. Performance is tracked publicly — winners AND losers. No cherry-picking, no "we called it" without the receipts.
- **Thesis-driven, not hype-driven.** Each pick has a specific written thesis explaining what the market is missing, what the catalyst is, and what would invalidate the thesis.

#### AI screening methodology

**Layer 1 — Quantitative filter (FMP data, algorithmic):**

- [ ] Revenue growth > 15% YoY (or accelerating from a low base)
- [ ] Market cap under $50B (room for multi-bagger growth)
- [ ] Positive free cash flow OR clear path to profitability with funded runway
- [ ] ROIC improving or already above sector median
- [ ] Low analyst coverage (< 10 analysts) — underfollowed = mispriced
- [ ] Price below estimated intrinsic value (DCF or P/FCF based)
- [ ] Not in a secular decline sector

This narrows the universe to ~50–80 candidates.

**Layer 2 — Qualitative AI analysis (Claude):**

Claude receives the candidate list with full fundamentals (income statements, balance sheets, cash flow, ratios, recent earnings, sector data) and evaluates each on:

- [ ] **Moat quality** — is there a durable competitive advantage? (network effects, switching costs, IP, scale)
- [ ] **Catalyst identification** — what specific event or trend could unlock value? (new product cycle, market expansion, regulatory tailwind, margin inflection, AI adoption)
- [ ] **Market misunderstanding** — why is the market wrong about this stock right now? (temporary headwind misread as permanent, hidden optionality, segment mispricing)
- [ ] **Management quality** — insider buying, capital allocation track record, founder-led
- [ ] **Bear case** — what's the biggest risk? What would make this pick wrong?
- [ ] **Conviction score (1–10)** — Claude's overall confidence in the 2–5 year thesis

**Layer 3 — Final selection:**

- Top 20 by conviction score
- Sector diversification enforced: max 4 stocks per sector
- Geography diversification: mix of US, EU, and emerging markets
- No penny stocks (min $500M market cap to ensure liquidity)

#### Thesis categories

Each stock is tagged with one primary thesis type:

| Category | What it means | Example archetype |
|---|---|---|
| 🔬 **Undervalued Compounder** | High-quality business trading below intrinsic value | Early MSFT, GOOGL |
| 🔄 **Turnaround** | Company fixing itself, market hasn't noticed yet | Early AMD (2017) |
| 🌊 **Secular Tailwind** | Riding a multi-year macro trend | Early ENPH (solar) |
| 🧩 **Misunderstood by Market** | Market misprices due to complexity or temporary noise | Early PLTR |
| 📈 **Pre-Inflection** | Approaching a revenue/margin inflection point | Early CRWD |

#### Quarterly update cycle

**Published ~2–3 weeks after each earnings season (Feb / May / Aug / Nov):**

- [ ] Re-evaluate all 20 current picks against fresh earnings data: is the thesis still intact?
- [ ] Score the top 30 new candidates from the quantitative filter with updated fundamentals
- [ ] Produce the quarterly diff:
  - **Unchanged** (thesis intact, earnings confirmed direction) — brief status update per stock referencing latest earnings
  - **New entries** — full thesis writeup: why it was added, what the catalyst is, what the bear case is
  - **Removed** — explicit reason: "Thesis broken because [Q2 earnings showed X]" or "Target valuation reached" or "Displaced by stronger candidate [Y]"
  - **Watchlist** — 5 stocks that almost made the list (transparency about what's being monitored)
- [ ] Between quarters: no changes. Price movements and sentiment are not reasons to update a 3-year thesis. This discipline is the feature's credibility.

#### Track record — public, immutable, honest

> **This is the credibility engine.** The track record page is public (no login required)
> and serves as the primary marketing asset for the feature.

- [ ] Public page at folio.app/radar showing every quarterly list since inception
- [ ] Performance tracked at: **entry date, 6 months, 1 year, 2 years, 3 years, 5 years** (as time passes)
- [ ] Display: Radar 20 average return vs S&P 500 vs MSCI World over same periods
- [ ] Individual stock performance cards: entry price, current price, % return, thesis status (active / target reached / thesis broken)
- [ ] **No editing after publication.** Quarterly snapshots stored in Supabase with `published_at` timestamp. Once published, immutable.
- [ ] Running statistics: hit rate (% of picks that outperformed S&P over 2 years), average return, best pick, worst pick

#### Output format per stock

```json
{
  "symbol": "PLTR",
  "name": "Palantir Technologies",
  "addedDate": "2026-05-15",
  "addedQuarter": "Q1-2026",
  "thesisCategory": "misunderstood",
  "convictionScore": 8,
  "priceAtEntry": 24.50,
  "thesisTitle": "Government AI infrastructure monopoly with accelerating commercial growth",
  "thesis": "Palantir's AIP platform is becoming the default operating system for...",
  "catalyst": "Commercial revenue inflection — Q1 2026 showed 45% YoY commercial growth...",
  "marketMissing": "Market still prices PLTR as a government contractor. Commercial is now 40%...",
  "bearCase": "Valuation already stretched at 25x forward revenue. Competition from...",
  "exitSignal": "Remove if commercial growth decelerates below 20% for 2 consecutive quarters",
  "status": "active",
  "quartersOnList": 3,
  "returnSinceEntry": 0.12
}
```

#### Supabase schema

```sql
-- Immutable quarterly snapshots
create table radar_snapshots (
  id uuid primary key default gen_random_uuid(),
  quarter text not null,              -- 'Q1-2026'
  published_at timestamptz not null,
  stocks jsonb not null,              -- array of 20 stock objects (full thesis)
  watchlist jsonb,                    -- 5 almost-made-it stocks
  diff_summary text,                  -- "3 new, 2 removed, 15 unchanged"
  created_at timestamptz default now(),
  unique(quarter)
);

-- Running performance tracker (updated daily by cron)
create table radar_performance (
  symbol text not null,
  entry_quarter text not null,
  entry_price numeric not null,
  current_price numeric,
  return_pct numeric,
  status text default 'active',       -- active | removed | target_reached | thesis_broken
  removed_quarter text,
  removed_reason text,
  primary key (symbol, entry_quarter)
);
```

#### Content flywheel

The Radar 20 generates its own marketing content every quarter — and because it's quarterly, each publication is an event, not background noise:

- **Quarterly blog post** (auto-generated from Claude's analysis): "Radar 20 Q2 2026: 3 new picks after earnings season — here's why" — SEO gold for "best stocks to buy 2026"
- **Social media**: screenshot of the top 5 new additions with one-line thesis — shareable, drives traffic. Quarterly scarcity creates anticipation.
- **YouTuber content**: "I'm tracking folio.'s AI stock picks — here's the 2-year results" — perfect for creator partnerships. Quarterly cadence means the creator can do a recurring series.
- **Email newsletter**: quarterly Radar update to all registered users (free, drives re-engagement and reactivation of churned users)
- **Track record page**: public, linkable, builds SEO authority over time. Gets more powerful with every passing quarter.

#### Cost

| Item | Cost |
|---|---|
| Claude API — quarterly analysis (80 candidates × ~2000 tokens, deeper than monthly would be) | ~€2.50/quarter |
| FMP data | €0 (already fetched for screener) |
| Supabase storage | Negligible |
| **Total** | **~€10/year** |

The cheapest feature to run in the entire product, with potentially the highest organic growth impact.

#### Access tier

- **Track record page (public):** Everyone — this is marketing, not a gated feature
- **Current quarter's top 5 with headlines:** Starter
- **Full Radar 20 with complete thesis + watchlist:** Premium
- **Historical archive + performance analytics:** Premium

#### Disclaimer

Every Radar 20 publication must include: *"The AI Radar 20 is generated by artificial intelligence for informational and educational purposes only. It is not personalised investment advice. Past selections do not predict future performance. Always do your own research before investing. folio. is not a licensed investment advisor."*

-----

### 🔧 4j — Notification Centre (Push + Email + In-App)

> **A unified, user-configurable notification system** that powers alerts across all features.
> Works in three channels: in-app (always), email (web users), and push notifications (mobile, Phase 7).
> The user controls everything — nothing is on by default except critical account alerts.

#### Notification categories & triggers

**Portfolio & Market Events:**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **Earnings reported** | A stock in your portfolio just reported quarterly earnings | Email: ON | Starter+ |
| **Earnings upcoming** | A stock in your portfolio reports earnings within 7 days | In-app: ON | Starter+ |
| **Balance sheet grade updated** | AI re-graded a stock after earnings (A→B+, etc.) | Email: ON | Premium |
| **Possible Deal detected** | A stock in your portfolio or watchlist matches Possible Deal criteria (price pullback + strong fundamentals) | Email: ON | Starter+ |
| **New Possible Deal (any stock)** | A stock NOT in your portfolio matches Possible Deal — discovery alert | Email: OFF | Premium |
| **Health Score change** | A stock's health score moved significantly (±15 points) | In-app: ON | Starter+ |
| **Price alert** | User-set price target hit (above or below) | Email: ON | Starter+ |
| **Dividend payment** | A dividend was paid on one of your holdings | In-app: ON | Starter+ |
| **Dividend ex-date upcoming** | Ex-dividend date within 5 days for a holding | Email: OFF | Starter+ |
| **Insider activity** | Significant insider purchase (>$500K) on a portfolio stock | Email: ON | Starter+ |

**AI Radar 20:**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **New Radar 20 published** | Quarterly list is live — "The Q2 2026 Radar 20 is out" | Email: ON | Starter+ |
| **Your stock entered Radar** | A stock you already hold was added to the Radar 20 | Email: ON | Premium |
| **Your stock removed from Radar** | A stock you hold was removed — with reason | Email: ON | Premium |
| **Radar watchlist stock** | A stock on the Radar watchlist (almost made it) enters next quarter | Email: OFF | Premium |

**Crypto:**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **Survival Score change** | A crypto holding's score changed band (e.g. Likely → Uncertain) | Email: ON | Premium |
| **BTC signal change** | Composite BTC signal changed (Accumulate → Hold, etc.) | Email: ON | Premium |
| **Altcoin season status change** | Index crossed 75 (Altcoin Season) or 25 (Bitcoin Season) | In-app: ON | Premium |

**Personal Finance (Finanzguru — Phase 6):**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **Large incoming payment** | Unusual large deposit detected (potential taxable income flag) | Email: ON | Premium |
| **Subscription detected** | New recurring charge identified — "New subscription: €14.99/mo to [X]" | Email: ON | Premium |
| **Subscription price increase** | A known subscription increased its charge amount | Email: ON | Premium |
| **Upcoming large payment** | A recurring large payment (rent, insurance) is due within 3 days | In-app: ON | Premium |
| **Balance runway warning** | "Your account is projected to drop below €[threshold] in [X] days" | Email: ON | Premium |
| **Balance runway critical** | Projected to go negative before next salary — urgent | Email: ON, Push: ON | Premium |
| **Safe to invest signal** | "You can safely invest ~€[X] this month — all bills covered until payday" | In-app: ON | Premium |
| **Annual/quarterly bill reminder** | Irregular recurring payment detected: "Annual car insurance €840 due in 12 days" | Email: ON | Premium |
| **Monthly spending summary** | "You spent €X,XXX in March — €XXX more than February" | Email: 1st of month | Premium |
| **Budget limit approaching** | A budget category hit 80% of limit | In-app: ON | Premium |
| **Budget limit exceeded** | A budget category exceeded 100% | Email: ON | Premium |
| **Free cashflow update** | "You have €420 free this month to invest" — after salary arrives | In-app: ON | Premium |

**Tax (Phase 6b):**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **Tax-relevant income flagged** | Potentially taxable incoming bank transaction detected | In-app: ON | Premium+ |
| **Crypto Haltefrist milestone** | A crypto holding just passed the 12-month tax-free threshold | Email: ON | Premium+ |
| **Tax year summary ready** | Annual tax report for selected year is ready to generate | Email: ON | Premium+ |
| **Freistellungsauftrag utilisation** | FSA at 80% used for a broker — "€200 left at Smartbroker+" | Email: ON | Premium+ |

**Account & System:**

| Trigger | Description | Default | Tier |
|---|---|---|---|
| **AI quota warning** | Chat or analysis quota at 80% | In-app: ON | Premium |
| **AI quota exhausted** | Quota reached 100% — resets on [date] | Email: ON | Premium |
| **Tink sync failed** | Bank/broker connection failed — needs re-auth | Email: ON | Starter+ |
| **Tink consent expiring** | PSD2 90-day consent expires in 7 days | Email: ON | Starter+ |
| **New feature launched** | Major product update announcement | Email: ON | All |

#### User configuration UI (Settings → Notifications)

- [ ] Master toggles per channel: **In-App** / **Email** / **Push** (push only visible after Phase 7 mobile app)
- [ ] Category grouping: Portfolio, Radar 20, Crypto, Personal Finance, Tax, Account
- [ ] Per-trigger toggle: each row has in-app / email / push checkboxes
- [ ] Quiet hours: "Don't send push notifications between 22:00 and 08:00"
- [ ] Email digest option: instead of individual emails, bundle into a daily or weekly digest
- [ ] "Mute for 7 days" quick action on any notification (temporary snooze)

#### Implementation architecture

```
Event occurs (earnings reported, price alert hit, etc.)
        ↓
api/notify.js — central notification dispatcher
  1. Check: is user subscribed to this trigger?
  2. Check: which channels are enabled (in-app / email / push)?
  3. For each enabled channel:
       In-app  → insert into notifications table (Supabase real-time subscription)
       Email   → queue via Resend API (or batch into digest)
       Push    → queue via Expo Push Notifications (Phase 7)
```

#### Supabase schema

```sql
-- User notification preferences
create table notification_preferences (
  user_id uuid references auth.users not null,
  trigger_id text not null,            -- 'earnings_reported', 'possible_deal', etc.
  in_app boolean default true,
  email boolean default false,
  push boolean default false,
  primary key (user_id, trigger_id)
);

-- Notification log (in-app feed)
create table notifications (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  trigger_id text not null,
  title text not null,
  body text,
  symbol text,                         -- related stock/coin if applicable
  action_url text,                     -- deep link: '/stock/PLTR' or '/radar'
  read boolean default false,
  created_at timestamptz default now()
);
create index on notifications(user_id, created_at desc);

-- Email digest queue
create table email_digest_queue (
  id bigserial primary key,
  user_id uuid references auth.users not null,
  trigger_id text not null,
  title text not null,
  body text,
  created_at timestamptz default now(),
  sent boolean default false
);
```

#### In-app notification bell

- [ ] Bell icon in top nav bar (next to search icon)
- [ ] Red badge with unread count
- [ ] Click → dropdown showing last 20 notifications, newest first
- [ ] Each notification: icon + title + time + click to navigate (e.g. click "PLTR reported earnings" → opens PLTR detail page)
- [ ] "Mark all as read" button
- [ ] "View all" → full notification history page

#### Email templates (via Resend)

- [ ] Clean, dark-themed HTML email matching folio. design system
- [ ] One-click unsubscribe per notification type (CAN-SPAM / GDPR compliant)
- [ ] Footer: "Manage your notification preferences in folio. Settings"
- [ ] Digest mode: single email with all notifications from the past 24h or 7 days, grouped by category

#### Cost

| Item | Cost |
|---|---|
| Resend (email) | Free tier: 3,000 emails/mo (sufficient for first ~500 users) |
| Resend Pro | $20/mo for 50,000 emails (when scaling) |
| Expo Push | Free for push notifications |
| Supabase real-time | Included in Pro plan |
| **Total at launch** | **€0** |

#### Rollout plan

- **Phase 1 (web launch):** In-app notifications + email for critical triggers only (earnings, Radar 20, Tink failures)
- **Phase 2 (growth):** Full email notification suite with digest option, all triggers configurable
- **Phase 3 (mobile — Phase 7):** Push notifications added as a third channel, all existing triggers gain push toggle

-----

## 📊 Phase 5 — Market Intelligence

### ✅ 5b — Stock Screener + ETF Screener (COMPLETE — algorithmic, no AI)

- [x] Filter by: P/E, dividend yield, sector, region, market cap, FCF yield, ROIC
- [x] Scorecard-based filtering (health score dimensions — all algorithmic)
- [x] Pre-built screens: "Wide moat + undervalued", "High FCF EU stocks" etc.
- [x] "Possible Deal" signal — fully working

### 5a — Market Heatmaps

- [ ] S&P 500, Nasdaq 100, DAX, Crypto top 50 heatmaps (D3.js treemap)
- [ ] Filterable by sector, time range

### 5c — Watchlist Builder

- [ ] Multiple watchlists · quick add from any stock page · price alerts

### 5d — Theoretical Portfolio Builder

- [ ] Hypothetical portfolio with custom allocations
- [ ] Compare against real portfolio on dashboard chart

-----

## 🏦 Phase 6 — Personal Finance (Finanzguru Layer)

> Enabled by the same Tink connection built in Phase 2d.
> Bank account transactions are already flowing — this phase adds the spending UI on top.
> **Near-zero additional infrastructure cost.**

- [ ] Automatic transaction categorisation (rule-based first, Claude fallback for unknowns)
- [ ] Monthly income vs expenses overview
- [ ] Subscription & contract detection ("You're paying €14.99/mo for X — still using it?")
- [ ] Budget tracking with category limits and budget buckets
- [ ] Savings goals
- [ ] Upcoming payments forecast ("€340 coming out this week")
- [ ] **Predictive account balance / "Runway to payday"** — the killer Finanzguru feature:
  - Detects the user's salary/wage pattern: amount, day of month, source (employer name)
  - Detects all recurring outgoings: rent, insurance, subscriptions, loan payments, Sparplan deductions — with their specific debit dates and frequencies (monthly, quarterly, annual)
  - From the current account balance, simulates forward day-by-day: subtract each known upcoming deduction on its expected date, add expected income on its expected date
  - Produces a **balance forecast chart**: line chart showing projected account balance for the next 30–60 days, with markers for each known deduction and income event
  - **"Runway" number**: "Your account will be at ~€380 when your salary arrives in 15 days"
  - Colour-coded warning zones: green (comfortable buffer), gold (getting tight), red (projected to go below €0 or a user-set minimum)
  - Notification triggers (feed into Phase 4j):
    - "Your account is projected to drop below €200 in 8 days" (threshold configurable)
    - "You have €420 free after all known bills until your next salary" (free cashflow signal)
    - "Annual insurance payment of €840 due in 12 days — make sure funds are available"
  - Handles irregular recurring payments: quarterly (insurance), semi-annual, annual (detected from transaction history patterns)
  - User can manually add/edit expected future payments the system hasn't detected yet
  - **The insight this unlocks:** "You can safely invest €300 this month" or "Hold off investing this month — your annual car insurance hits in 9 days"
- [ ] Net worth dashboard (bank accounts + investments + crypto combined)
- [ ] Free cashflow tracking → "You have €420 free this month to invest"
- [ ] **Potentially taxable income detection** — flag incoming bank transactions that may need to be declared in the annual tax return. Rule-based detection for: freelance/self-employment payments (irregular large incomings from non-employer sources), rental income, eBay/Vinted/marketplace sales above €2,000/year threshold (Plattformen-Steuertransparenzgesetz), foreign transfers, interest from non-German accounts, crypto-to-EUR deposits from exchanges. Shows a "Tax-relevant?" badge on flagged transactions. User can confirm or dismiss. Year-end summary: "We flagged €X,XXX in potentially taxable income across Y transactions — review before filing." Feeds into the Phase 6b tax report as a checklist item.

-----

## 🧾 Phase 6b — Tax Reports & Crypto Tax Tool (Premium+)

> **The feature that justifies Premium+.** Currently German crypto investors need separate products
> (CoinTracking €149/yr, Blockpit €49/yr, Koinly €49/yr) just to generate tax reports.
> folio. already has the full transaction history — generating the report is a natural extension.
> 
> **Premium+ tier only** (€17.99/mo) — this is the upsell from Premium.

### Crypto tax (§23 EStG — privates Veräußerungsgeschäft)

> German crypto tax rules:
> - Gains on sales within 12 months ("Haltefrist") are taxable as income
> - Gains after 12 months holding are **completely tax-free**
> - Freigrenze: €1,000/year (from 2024 onward) — if total short-term gains < €1,000, no tax
> - FIFO is the default method; LIFO allowed if consistently applied
> - Staking/lending rewards are income when received (taxed at receipt, separate Haltefrist for disposal)
> - Transfers between own wallets are not taxable events
> - Tax year: Jan 1 – Dec 31 (calendar year)

#### Features

- [ ] **Year selector** — user picks the tax year (e.g. 2025). All calculations use only transactions within Jan 1 – Dec 31 of that year
- [ ] **Cost basis method selector** — FIFO (default) or LIFO, applied consistently per year
- [ ] **Haltefrist tracking** — for each disposal, automatically determine if the coin was held > 12 months
  - If yes → mark as tax-free
  - If no → calculate gain/loss against cost basis
- [ ] **FIFO lot matching** — match each sale against the earliest unsold buy lots, tracking across years
- [ ] **Tax-free gains report** — separate section showing gains exempt due to Haltefrist
- [ ] **Short-term gains summary** — total taxable gains, check against €1,000 Freigrenze
- [ ] **Staking/lending income** — list all rewards received in the tax year with EUR value at receipt date
- [ ] **Transfer detection** — transfers between own wallets excluded from taxable events (uses `coldWalletResolved` + transfer_in/transfer_out types)
- [ ] **PDF export: Anlage SO helper** — generates a summary PDF matching the fields needed for ELSTER:
  - Line 46: "Kryptowährungen" (or per-coin breakdown)
  - Line 47: acquisition + disposal period (01/01/YYYY – 31/12/YYYY)
  - Line 48: total disposal proceeds
  - Line 49: total acquisition costs
  - Line 50: transaction fees
- [ ] **Detailed transaction log export** — CSV/PDF with every taxable event, showing: date, coin, qty, buy price, sell price, gain/loss, Haltefrist status, FIFO lot reference

#### Supabase schema addition

```sql
create table tax_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tax_year int not null,
  method text default 'fifo',        -- fifo | lifo
  short_term_gains numeric,
  long_term_gains numeric,           -- tax-free
  staking_income numeric,
  total_fees numeric,
  report_data jsonb,                 -- full lot-matching detail
  generated_at timestamptz default now(),
  unique(user_id, tax_year, method)
);
```

### Stocks & ETFs tax tracking

> Simpler than crypto — German brokers withhold Abgeltungssteuer (25% + Soli + optional Kirchensteuer)
> automatically. The user's main concern is whether their **Freistellungsauftrag** (tax-free allowance,
> currently €1,000/person or €2,000/couple) is being used efficiently across brokers.

- [ ] **Freistellungsauftrag per broker** — user sets their FSA allocation per broker in Settings (e.g. "Trade Republic: €500, Smartbroker+: €500")
- [ ] **FSA utilisation tracker** — shows how much of the allowance has been used per broker this year based on realised gains + dividends
- [ ] **Tax withheld overview** — total Abgeltungssteuer deducted across all brokers for the tax year
- [ ] **Dividend tax summary** — total dividends received, tax withheld, net received
- [ ] **Realised gains/losses** — per broker, per year, with running total against FSA

### Competitive positioning

|Feature                         |CoinTracking €149/yr|Blockpit €49/yr|Koinly €49/yr|folio. Premium+ €216/yr|
|--------------------------------|:------------------:|:-------------:|:-----------:|:---------------------:|
|Crypto FIFO/LIFO tax report     |✓                   |✓              |✓            |✓                      |
|Haltefrist tracking             |✓                   |✓              |✓            |✓                      |
|Anlage SO PDF helper            |✓                   |✓              |✓            |✓                      |
|Stock/ETF tax tracking          |✗                   |✗              |✗            |✓                      |
|Freistellungsauftrag tracker    |✗                   |✗              |✗            |✓                      |
|Portfolio tracker included      |basic               |basic          |basic        |✓ full                 |
|AI research + portfolio chat    |✗                   |✗              |✗            |✓                      |
|Price                           |€149/yr standalone  |€49/yr standalone|€49/yr standalone|€216/yr all-inclusive |

**Value prop:** "Stop paying for a separate crypto tax tool. folio. Premium+ includes tax reports alongside everything else — portfolio tracking, AI research, charts, and more. One subscription, everything you need."

-----

## 📱 Phase 7 — iOS & Android Apps

> React Native + Expo — single codebase for iOS, Android, and web.
> ~70% of logic (API calls, state, AI features) reusable from web app.

- [ ] Bottom tab navigation · swipeable cards · full-screen charts
- [ ] Biometric authentication (Face ID / fingerprint)
- [ ] Push notifications: third channel for the Phase 4j notification system — all existing triggers gain push toggle
- [ ] Home screen widgets (portfolio value, top mover)
- [ ] Offline mode for cached data

|Cost item              |Amount              |
|-----------------------|--------------------|
|Expo EAS Build         |$13/mo              |
|Apple Developer Account|$99/year            |
|Google Play            |$25 one-time        |
|**Total to launch**    |**~€140 first year**|

-----

## 🌍 Phase 8 — Internationalization

- [ ] Full i18n via react-i18next · Languages: DE (primary) → EN → FR → ES → IT → NL
- [ ] EUR-first · multi-currency support (GBP, CHF, PLN)
- [ ] GDPR-compliant by design (Supabase EU region)

-----

## 🚀 Phase 9 — Landing Page & Demo

> First impressions matter. The landing page is what converts visitors into users.
> Inspired by Parqet's landing page — clean, feature-focused, with social proof.

### Landing page (parqet.com style)

- [ ] Hero section: headline + subtitle + CTA ("Start for free") + hero screenshot/animation
- [ ] Feature showcase sections (scrollable): portfolio tracking, AI research, charts, screener, crypto tools, tax reports
- [ ] **Live demo** — interactive demo page with fake portfolio data, fully functional (all features work, nothing is gated). User can explore without creating an account. CTA at every section: "Create your free account to use your own data"
- [ ] Pricing comparison table — all 4 tiers (Free / Starter / Premium / Premium+) with feature matrix
- [ ] **Competitive comparison** — "How folio. compares" section:
  - folio. vs Parqet vs Finanzfluss Copilot vs Finanzguru
  - Highlight: AI research, crypto tools, tax reports — things competitors don't have
- [ ] **Security & trust section** — prominently displayed:
  - "All data encrypted at rest and in transit"
  - "Hosted in EU (Supabase EU region) — GDPR compliant"
  - "Read-only bank access — we can never move your money"
  - "No ads, no data selling — you are the customer, not the product"
  - Tink/Visa logo for open banking trust
- [ ] Social proof: testimonials, user count, newsletter signup
- [ ] FAQ section (collapsible)
- [ ] Footer: legal links, Impressum, Datenschutz (required in Germany)

### Demo page

- [ ] Route: `/demo` — accessible without login
- [ ] Pre-loaded with a realistic fake portfolio (mix of stocks, ETFs, crypto across 3 brokers)
- [ ] All features fully functional: charts, screener, compare tool, health scores, news
- [ ] Banner at top: "This is a demo with sample data. [Create your free account →]"
- [ ] AI features show cached/sample results (no actual Claude calls)

### Tech

- Landing page: can be a separate Next.js/Astro static site for SEO, or a public route in the existing Vite app
- Demo: route within the existing app using a `DEMO_MODE` flag that loads fake data instead of Supabase

-----

## 👥 Phase 9b — Community

> Parqet uses a custom community forum (community.parqet.com) — not Discord.
> It has spaces/categories like "Starte hier", "Hilfe", "Diskussionen", "Unsere Roadmap".
> For folio., Discord is the better starting choice: zero cost, faster to set up, better for
> a younger/crypto-savvy audience, voice channels for AMAs.

### Discord community (launch option — recommended)

- [ ] Create `folio. Community` Discord server
- [ ] Channels:
  - `#announcements` — product updates, new features, changelog
  - `#general` — open discussion
  - `#portfolio-talk` — share portfolio strategies, discuss allocations
  - `#crypto` — crypto-specific discussion, market signals
  - `#feature-requests` — users suggest and vote on features
  - `#bug-reports` — report issues (triage into GitHub issues)
  - `#support` — help each other + team support
- [ ] Roles: `Team`, `Premium`, `Premium+`, `Beta Tester`, `Community`
- [ ] Bot: auto-assign `Premium` role when Stripe subscription is active (webhook integration)
- [ ] Premium-only channels: `#premium-chat`, `#tax-help` — incentivises upgrades
- [ ] Link prominently in app sidebar + landing page

### Future: Self-hosted forum (at scale, ~5,000+ users)

- Evaluate Discourse (open-source, SEO-friendly, self-hostable) when Discord gets noisy
- community.folio.app — categories mirror Discord channels
- Import Discord history if migrating
- SEO benefit: forum posts indexed by Google → organic traffic

### In-app community link

- [ ] "Community" item in sidebar navigation → opens Discord invite link (or future forum URL)
- [ ] Settings → "Join our community" card with Discord invite

### Cost

|Item                    |Cost|
|------------------------|----|
|Discord server          |€0  |
|Discord Nitro (optional)|€10/mo (for custom branding, not required)|
|Future Discourse hosting|~€20/mo (DigitalOcean droplet)|

-----

## 📟 Phase 10 — Hardware Dashboard (Arduino / Raspberry Pi)

> A physical, always-on portfolio display that sits on a desk or sideboard.
> Low-cost, low-power, beautiful — the ultimate "set and forget" portfolio glance.
> Built after the product is fully deployed and stable.

### Concept

A small screen (2.8"–7") connected to an Arduino (ESP32) or Raspberry Pi Zero W that displays
a customisable portfolio dashboard. Pulls data from the folio. API via WiFi. User configures
what to show via the folio. web app Settings.

### Hardware options

|Option                      |Cost     |Screen           |Power     |Notes                                          |
|----------------------------|---------|-----------------|----------|-----------------------------------------------|
|**ESP32 + e-ink (cheapest)**|~€25–35  |2.9" e-ink       |USB / battery|Ultra low power, updates every 5–15 min, always readable|
|**ESP32 + TFT colour**     |~€20–30  |2.8"–3.5" TFT IPS|USB       |Colour charts, faster refresh, needs constant power|
|**Raspberry Pi Zero 2 W**  |~€30–45  |3.5"–7" IPS/e-ink|USB       |Full Linux, can run a mini browser, most flexible|
|**Raspberry Pi + e-ink HAT**|~€40–55  |4.2"–7.5" e-ink  |USB       |Premium look, no glare, very low power          |

**Recommended MVP:** ESP32 + 2.9" e-ink display (~€30 total). Looks like a premium desk widget.
Battery-powered option possible with deep sleep (update every 15 min → months of battery life).

### What the user can configure (in folio. web app Settings → "Hardware Dashboard")

- [ ] **Widget picker** — drag-and-drop grid of available widgets:
  - Portfolio total value + daily P&L (% and €)
  - Top 3 / Top 5 movers (biggest gainers/losers today)
  - Allocation donut (by asset type or by broker)
  - Mini portfolio chart (last 30 days, sparkline style)
  - BTC price + 24h change
  - Fear & Greed Index
  - Next dividend payment
  - Next earnings date
  - Custom stock/coin price ticker
  - Clock + date (always useful on a desk display)
- [ ] **Layout selector** — pre-designed layouts for different screen sizes (1-widget, 2-widget, 4-widget grid)
- [ ] **Refresh interval** — 5 min / 15 min / 30 min / 1 hour
- [ ] **Theme** — light / dark / auto (match e-ink or TFT capabilities)
- [ ] Generates a **device token** (one-time setup code) that the hardware uses to authenticate

### API endpoint

```
GET /api/dashboard-widget?token={device_token}
→ Returns JSON with the user's configured widgets + current data
→ Lightweight payload (~2KB), designed for constrained devices
→ Rate limited: max 1 call per 5 minutes per token
```

### Hardware firmware

- ESP32: Arduino/PlatformIO sketch — connects to WiFi, fetches JSON, renders to display
- Raspberry Pi: Python script or minimal Chromium kiosk mode pointing at a dedicated `/dashboard-hw` route
- Open-source firmware on GitHub — users can flash themselves or buy pre-flashed from a shop

### Future: folio. hardware store

- Sell pre-assembled, pre-flashed devices with a nice 3D-printed or laser-cut case
- "folio. Dashboard Mini" — €49 (ESP32 + e-ink + case + USB-C cable)
- "folio. Dashboard Pro" — €89 (Raspberry Pi + 5" IPS + case)
- Margin: ~60–70% on hardware, but primary goal is brand/retention, not revenue

### Access

- API endpoint: **Premium+** tier (hardware dashboard is a power-user feature)
- Firmware: open-source, anyone can build their own — but needs a Premium+ account for the API

-----

**Requirement:** When Tink auto-poll, Tink manual refresh, or CSV append import detects new outbound crypto transfers, the ColdWalletModal must be re-prompted — exactly like on first import. Once resolved, it must never be flagged again.

### The "never flag twice" rule

- Each transfer transaction gets a `coldWalletResolved: true` flag once the user confirms (assigns to cold wallet) OR explicitly dismisses
- All detection logic (import, Tink poll, CSV append) skips any tx where `coldWalletResolved === true`

### Full coin lifecycle (must always stay consistent)

1. **Buy on exchange** → position held on exchange
2. **Outbound transfer detected** → ColdWalletModal prompted
3. **User assigns to cold wallet** → qty moves from exchange position to cold wallet position, tx flagged `coldWalletResolved: true`
4. **Future Tink poll / CSV re-upload** → same transfer detected → already flagged → no re-prompt ✓
5. **User sells from cold wallet** → cold wallet qty reduces correctly
6. **Inbound transfer** (cold wallet → exchange) → reverse: reduce cold wallet qty, add back to exchange position

### Edge cases to handle

- **Partial transfer** — some coins moved, some stay on exchange (qty split)
- **Multiple transfers of same coin over time** — each needs its own `coldWalletResolved` flag (keyed by tx date + amount, not just coin)
- **Dismissed transfers** — user says "not a cold wallet" → also flagged `coldWalletResolved: true`, never re-prompted
- **Re-import / Tink re-sync** — no phantom positions, no duplicate prompts, no qty drift

### Key anchor

`coldWalletResolved: boolean` on the transaction object — persisted to Supabase with the rest of the transaction array. This is the single source of truth for what has and hasn't been resolved.

-----

## 📋 Pending UI / UX Improvements

### Portfolio Chart — Add Invested Capital Line

**Context:** Dashboard chart correctly shows % returns (TWR). Portfolio chart (€ values) is separate and correct. User wants invested capital visible there too.

**Implementation:**

- The `invested` field already exists on every chart row
- Add a second `<Line>` to the portfolio (€) chart using `invested`
- Style: dashed, neutral colour (`var(--text3)` / `#555`) so it doesn't compete with portfolio value line
- Label "Invested" in tooltip
- Shows the gap between capital deployed and current value at a glance
- Bundle into next deploy (v104)

-----

## 💰 Cost Architecture & Unit Economics

### Fixed base (no sync, no AI): ~€325/mo

|Service  |Plan   |Cost/mo|
|---------|-------|-------|
|Vercel   |Pro    |€26    |
|Supabase |Pro    |€33    |
|FMP      |Premium|€97    |
|CoinGecko|Analyst|€168   |
|Domain   |Annual |€2     |

### Marginal cost per user per month

|Tier   |Tink  |FMP (cached)|AI                  |Total  |
|-------|------|------------|--------------------|-------|
|Free   |€0    |~€0         |€0                  |~€0.003|
|Starter|~€0.50|~€0.02      |~€0.015 (news cache)|~€0.54 |
|Premium|~€0.50|~€0.02      |~€0.08 (quota max)  |~€0.60 |

> Note: Tink ~€0.50/user/mo is the published standard rate. Startup/volume pricing
> likely lower — negotiate before launch.

### Gross margin at scale

|Tier   |Price |Max COGS|Gross Margin|
|-------|------|--------|------------|
|Free   |€0    |€0.003  |—           |
|Starter|€5.99 |~€0.54  |~91%        |
|Premium|€10.99|~€0.60  |~94.5%      |

### Scale (100K users, typical mix 70/20/10 free/starter/premium)

|Service              |Cost           |
|---------------------|---------------|
|Vercel               |~€150          |
|Supabase             |~€370          |
|FMP Ultimate         |€274           |
|CoinGecko Pro        |€450           |
|Tink (30K paid users)|~€15,000       |
|AI (Claude)          |~€495          |
|**Total**            |**~€16,700/mo**|
|**MRR**              |**~€230,000**  |
|**Gross margin**     |**~93%**       |

> wealthAPI completely removed from cost model until ~3,000 users.
> At that point reassess based on user feedback on broker coverage.

-----

## 🛠️ Tech Stack

|Layer          |Technology                                            |Cost            |
|---------------|------------------------------------------------------|----------------|
|Frontend       |React 18 + Recharts + TradingView Lightweight Charts  |Free            |
|Build          |Vite                                                  |Free            |
|Deployment     |Vercel Pro                                            |€26/mo          |
|Backend API    |Vercel Functions (Node.js)                            |Included        |
|Database + Auth|Supabase Pro                                          |€33/mo          |
|Payments       |Stripe                                                |1.4% + €0.25/txn|
|AI             |Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`)|Pay per use     |
|Financial Data |FMP Premium                                           |€97/mo          |
|Crypto Prices  |CoinGecko Analyst                                     |€168/mo         |
|Open Banking   |Tink (PSD2 — bank + broker sync)                      |~€0.50/user/mo  |
|Cron Jobs      |Vercel Cron                                           |Free            |

-----

## 🎨 Design System

### Theme: Light (Default) + Dark (User Toggle)

> The current dark design is loved and stays — but the **default** for new users should be a clean,
> modern light theme inspired by Parqet and Finanzfluss Copilot. Users can switch to dark mode
> in Settings. Preference persisted to localStorage + Supabase user profile.

**Light theme (default):**

|Token         |Value           |
|--------------|----------------|
|Background    |`#ffffff`       |
|Surface       |`#f5f7fa`       |
|Border        |`#e2e8f0`       |
|Text primary  |`#1a202c`       |
|Text secondary|`#718096`       |
|Green (profit)|`#16a34a`       |
|Red (loss)    |`#dc2626`       |
|Gold (crypto) |`#d97706`       |
|Blue (info)   |`#2563eb`       |

**Dark theme (toggle in Settings):**

|Token         |Value           |
|--------------|----------------|
|Background    |`#080c10`       |
|Surface       |`#0f1923`       |
|Green (profit)|`#00e5a0`       |
|Red (loss)    |`#ff4d6d`       |
|Gold (crypto) |`#f5c842`       |
|Blue (info)   |`#4da6ff`       |

**Shared across themes:**

|Token         |Value           |
|--------------|----------------|
|Heading font  |DM Serif Display|
|Data font     |IBM Plex Mono   |
|Body font     |DM Sans         |

**Implementation:**

- [ ] CSS custom properties (`var(--bg)`, `var(--surface)`, etc.) already used throughout — swap values via a `.theme-dark` / `.theme-light` class on `<body>`
- [ ] Toggle in Settings: "Appearance" → Light / Dark / System (auto-detect `prefers-color-scheme`)
- [ ] Persist to `localStorage` for instant load, sync to Supabase `user_preferences` for cross-device
- [ ] All charts (Recharts, TradingView) must respect theme colours — test thoroughly

**Aesthetic:** Light = clean, trustworthy Parqet/Copilot vibe (great for onboarding). Dark = premium Bloomberg Terminal meets modern fintech (power users love it).

-----

## ⚙️ Development Workflow

> **This section defines how Claude and the developer collaborate on folio.**
> Claude: re-read this section at the start of every session.

### Spec-first development

1. **Every feature must be in the spec before implementation begins.** If the developer asks Claude to implement something not yet in the spec, Claude first adds it to the appropriate section of this spec file, then proceeds with implementation.
2. **Active work item is marked in the spec.** The feature currently being worked on is marked with a `🚧 ACTIVE` tag next to its checkbox. Only one item is active at a time. When work begins, Claude marks it; when it's done, Claude removes the tag and ticks the checkbox.
3. **Tick-off on confirmation.** When the developer confirms a feature is successfully implemented and tested (e.g. "this works", "confirmed", "looks good"), Claude automatically ticks off the corresponding `[ ]` → `[x]` in this spec.

### File delivery & deployment

4. **Claude delivers:** the updated `App.jsx` (or other changed files) + ready-to-use git commands (copy-paste ready).
5. **Git commands format:** Claude provides the exact commands every time. The main app code lives in `src/App.jsx` (not the root). The spec and roadmap live in the repo root.
   ```
   git add src/App.jsx folio-spec.md
   git commit -m "v105 — [short description]" -m "- [detail 1]
   - [detail 2]
   - Spec: [what was updated]"
   git push
   ```
   The developer copies and pastes these directly — no editing needed.
6. **The developer handles:** running the git commands and triggering Vercel deployment. Claude never assumes deployment has failed — if the developer reports a problem, it's always on the latest version Claude produced.
7. **This spec file (`folio-spec.md`) is also tracked in git.** Whenever Claude updates the spec (new features, tick-offs, status changes), Claude includes it in the git add and the commit message describes the spec changes.

### Version tracking

8. **Version number visible on the website.** Every new deployment increments the version (e.g. v104 → v105). The version string is displayed in the app footer or Settings page so both developer and Claude can confirm which version is live.
9. **Claude includes the version bump** in every code delivery. Format: `const APP_VERSION = "v105";` at the top of App.jsx.

### Session startup checklist (for Claude)

When starting a new session or continuing work:
1. Read this workflow section
2. Check which item is marked `🚧 ACTIVE` in the spec (if any)
3. Ask the developer what to work on if nothing is active
4. Verify the current version number if code is uploaded

### Knowledge persistence across chat sessions

> Chats break after they get too long. This always happens. The spec is the single source of truth
> that survives across sessions.

9. **Write it down or lose it.** If Claude discovers something important during a session — a tricky bug root cause, an architectural decision, a data format quirk, an API behaviour, a pattern that must not be broken — Claude writes it into the spec immediately. The appropriate place is either in the relevant phase section (as an implementation note), in the "Key Decisions & Notes" section, or in a "Technical Notes" subsection within the relevant feature. If it doesn't fit anywhere, add it to a "Session Notes" block at the bottom of the Session Log.
10. **The spec is Claude's memory.** When a new chat starts, Claude has no memory of the previous session beyond what's in this spec and the conversation summary. Anything not written down here is lost. Treat the spec like a handover document to your future self.
11. **Bug fixes get documented.** When a bug is found and fixed, Claude adds a brief note to the relevant spec section describing the root cause and the fix pattern, so the same class of bug is never reintroduced. Example: "WKN ticker resolution: positions with WKN codes in the `symbol` field must resolve via `p.isin` when `isRealTicker(p.symbol)` is false — fixed in v100–v103."

### Code quality rules — NON-NEGOTIABLE

> These rules override speed. Claude must follow them on every single code change.

12. **No non-generic solutions. Ever.** Every feature and every bugfix must be implemented generically, considering the full project scope. No hardcoded one-off patches. No "quick fix for this one case." If a fix applies to one broker, it must work for all brokers. If it handles one edge case, it must handle the class of edge cases. Ask: "Will this still work when there are 10 more brokers, 50 more stocks, and 3 new data sources?"
13. **Never break what's working.** Before changing any function or component, Claude must understand what currently depends on it. Every fix must preserve all existing behaviour. If unsure, simulate. Regressions are unacceptable — a bug fix that introduces a new bug is worse than no fix at all.
14. **Quality over speed.** When Claude is unsure whether a change is correct, Claude must:
    - Re-read the relevant code paths
    - Mentally simulate (or actually simulate via browser tools when available) the change against multiple scenarios
    - Consider edge cases: empty data, missing fields, different brokers, different currencies, crypto vs stock vs ETF
    - Only then write the code
    - If still unsure: ask the developer rather than guess
15. **Understand before changing.** Claude must never modify code it doesn't fully understand. If a function's purpose or dependencies are unclear, Claude reads the surrounding code first, traces the data flow, and only then makes changes.

-----

## 🔑 Key Decisions & Notes

- **Tink over wealthAPI for launch** — PSD2 covers 80–90% of target brokers, zero upfront cost, no company formation gate (for sandbox). wealthAPI deferred to ~3,000 users.
- **GoCardless Nordigen is dead** — stopped accepting new accounts July 2025. Tink is the replacement.
- **Health scores & screener are algorithmic** — not AI features. Never market them as "AI-powered".
- **AI quota must be transparent** — always-visible bar in sidebar. Build trust, not anxiety.
- **Portfolio chat is the Premium moat** — conversational AI with real user data is hard to replicate.
- **Quarterly caching** is the key AI cost optimization — stock-level analysis never charged per view.
- **No API key in frontend** — all Claude calls through Vercel Function proxies.
- **CSV import stays forever** — fallback for unsupported brokers + privacy-conscious users.
- **TradingView Lightweight Charts** (not full TradingView) — for portfolio context, not professional TA.
- **Stability and speed are king** — cache aggressively, lazy-load AI features, never block UI.

-----

## 📅 Session Log

|Date        |What was built / decided                                                                                                                                                                                                                                                                                                                         |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Sessions 1–3|Core dashboard, live prices, performance chart, broker toggles, benchmarks, AI news feed, CSV import, full spec documented                                                                                                                                                                                                                       |
|Session 4   |FMP integration, fundamentals charts, CSV import (Smartbroker+), ISIN resolution, .DE ticker handling                                                                                                                                                                                                                                            |
|Session 5   |Phase 3d: 6-dimension health scorecard, sector-adjusted thresholds, Economic Moat, Overall Health Score. Screener spec.                                                                                                                                                                                                                          |
|Session 6   |Phase 3e: TradingView charts + drawing tools. Phase 5b: Stock + ETF screener. "Possible Deal" signal.                                                                                                                                                                                                                                            |
|Session 7   |Pricing model finalised: Free / Starter €5.99 / Premium €10.99. Competitive analysis (Finanzguru, Finanzfluss, TradingView). Infrastructure cost PDF built.                                                                                                                                                                                      |
|Session 8   |**Major architecture decision:** wealthAPI replaced by Tink for launch. PSD2 parser approach. GoCardless dead (July 2025). AI quota system designed. Portfolio chat (4g) added as Premium differentiator. Health scores clarified as algorithmic (not AI). wealthAPI deferred to ~3,000 users.                                                   |
|Session 9   |Parqet added to competitive analysis (350K users, closest direct competitor). Autosync mechanism understood (Qplix KID licence, client-side local sync = zero marginal cost). Phase 3f (Insider Transactions) added — FMP already covers this on current plan, US stocks only, raw on Starter + AI signal on Premium. Competitive matrix updated.|
|Session 10  |Phase 2c redesigned as AI Universal File Import — Free tier gets 5 parses/month (PDF/CSV/Excel, any broker, any language, ~€0.03/file). Starter+ unlimited. Tier table updated. Cost ~€960/mo at 100K users = <0.5% of MRR.                                                                                                                      |
|2026-03-13  |v99 TWR chart (time-weighted return, deposit-agnostic). v100–v103 WKN ticker resolution + display fix (isRealTicker → ISIN lookup → fmpTicker persisted). Phase 2e specced (extended indices + model portfolios). Phase 2g (crypto tools suite) specced. Phase 2h (global search) specced. Phase 2i (new user email notification) specced. Phase 4h (AI crypto survival score) specced. Cold wallet lifecycle spec added. Invested capital line pending (v104).|

-----
