// Temporary test endpoint — remove after diagnosis
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'QQQ', isin = 'US46090E1038' } = req.query;

  const results = {};

  // Test 1: Yahoo Finance v7 quote summary (ETF specific fields)
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=topHoldings,fundProfile,defaultKeyStatistics,summaryDetail`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    const d = await r.json();
    const th = d?.quoteSummary?.result?.[0]?.topHoldings;
    results.yahoo_topHoldings = th ? {
      expenseRatio: th.annualReportExpenseRatio?.fmt,
      holdings: th.holdings?.slice(0,3).map(h=>({name:h.holdingName, pct:h.holdingPercent?.fmt})),
      equity: th.equityHoldings,
      sectorWeightings: th.sectorWeightings?.slice(0,3),
    } : { error: 'no topHoldings', keys: Object.keys(d?.quoteSummary?.result?.[0]||{}) };
  } catch(e) { results.yahoo = { error: e.message }; }

  // Test 2: Yahoo Finance v11 (different endpoint)
  try {
    const r = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=topHoldings`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' }
    });
    const d = await r.json();
    results.yahoo_v11_status = r.status;
    results.yahoo_v11_sample = JSON.stringify(d).slice(0, 300);
  } catch(e) { results.yahoo_v11 = { error: e.message }; }

  // Test 3: sectors.finance (free ETF API)
  try {
    const r = await fetch(`https://api.sectors.finance/v1/etf/${symbol}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    results.sectors_finance_status = r.status;
    const t = await r.text();
    results.sectors_finance_sample = t.slice(0, 300);
  } catch(e) { results.sectors_finance = { error: e.message }; }

  // Test 4: stockanalysis.com — try multiple UA strings and headers
  for (const [label, headers] of [
    ['sa_basic', { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }],
    ['sa_curl', { 'User-Agent': 'curl/7.88.1', 'Accept': '*/*' }],
    ['sa_bot', { 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' }],
    ['sa_full', { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9', 'Accept-Encoding': 'gzip, deflate, br', 'Cache-Control': 'no-cache' }],
  ]) {
    try {
      const r = await fetch(`https://stockanalysis.com/etf/${symbol.toLowerCase()}/holdings/`, { headers });
      const t = await r.text();
      const stripped = t.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
      const nIdx = stripped.indexOf('NVIDIA');
      const expIdx = stripped.search(/[Ee]xpense/);
      results[label] = { 
        status: r.status, 
        hasNvidia: nIdx > 0,
        snippet: nIdx > 0 ? stripped.slice(nIdx-20, nIdx+120) : stripped.slice(500, 700),
        expenseSnippet: expIdx > 0 ? stripped.slice(expIdx, expIdx+60) : 'not found',
        htmlStart: t.slice(0, 200),
      };
    } catch(e) { results[label] = { error: e.message }; }
  }

  // Test 5: etf.com holdings API
  try {
    const r = await fetch(`https://www.etf.com/${symbol}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const t = await r.text();
    const stripped = t.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    const nIdx = stripped.indexOf('NVIDIA');
    const expIdx = stripped.search(/expense ratio/i);
    results.etfcom = { status: r.status, hasNvidia: nIdx > 0, expenseSnippet: expIdx > 0 ? stripped.slice(expIdx, expIdx+60) : 'not found', nvidiaSnippet: nIdx > 0 ? stripped.slice(nIdx-20, nIdx+80) : 'not found' };
  } catch(e) { results.etfcom = { error: e.message }; }

  res.status(200).json(results);
}
