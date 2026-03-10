export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  try {
    // Build screener query from passed params
    const {
      marketCapMin, marketCapMax,
      peMin, peMax,
      betaMin, betaMax,
      dividendMin, dividendMax,
      sector, exchange, country,
      limit = 200,
    } = req.query;

    const params = new URLSearchParams({ apikey: FMP_KEY, limit });
    if (marketCapMin) params.set('marketCapMoreThan', marketCapMin);
    if (marketCapMax) params.set('marketCapLowerThan', marketCapMax);
    if (peMin)        params.set('peMoreThan', peMin);
    if (peMax)        params.set('peLowerThan', peMax);
    if (betaMin)      params.set('betaMoreThan', betaMin);
    if (betaMax)      params.set('betaLowerThan', betaMax);
    if (dividendMin)  params.set('dividendMoreThan', dividendMin);
    if (dividendMax)  params.set('dividendLowerThan', dividendMax);
    if (sector && sector !== 'All') params.set('sector', sector);
    if (exchange && exchange !== 'All') params.set('exchange', exchange);
    if (country && country !== 'All') params.set('country', country);
    // Only include active stocks with price > 1
    params.set('isActivelyTrading', 'true');
    params.set('priceMoreThan', '1');

    const url = `https://financialmodelingprep.com/stable/stock-screener?${params.toString()}`;
    const r = await fetch(url);
    const text = await r.text();

    if (text.startsWith('Premium') || text.includes('Premium Query')) {
      res.status(200).json({ error: 'Premium', results: [] });
      return;
    }

    let data;
    try { data = JSON.parse(text); } catch { data = []; }
    if (!Array.isArray(data)) data = [];

    res.status(200).json({ results: data });
  } catch (e) {
    res.status(500).json({ error: e.message, results: [] });
  }
}
