export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  try {
    const {
      marketCapMin, marketCapMax,
      peMin, peMax,
      betaMin, betaMax,
      dividendMin,
      volumeMin,
      evEbitdaMin, evEbitdaMax,
      sector, exchange,
      limit = 200,
    } = req.query;

    const params = new URLSearchParams({ apikey: FMP_KEY, limit });
    if (marketCapMin) params.set('marketCapMoreThan', marketCapMin);
    if (marketCapMax) params.set('marketCapLowerThan', marketCapMax);
    if (peMin)        params.set('peMoreThan', peMin);
    if (peMax)        params.set('peLowerThan', peMax);
    if (betaMin)      params.set('betaMoreThan', betaMin);
    if (betaMax)      params.set('betaLowerThan', betaMax);
    if (dividendMin)  params.set('lastAnnualDividendMoreThan', dividendMin);
    if (volumeMin)    params.set('volumeMoreThan', volumeMin);
    if (evEbitdaMin)  params.set('evEbitdaMoreThan', evEbitdaMin);
    if (evEbitdaMax)  params.set('evEbitdaLowerThan', evEbitdaMax);
    if (sector && sector !== 'All')   params.set('sector', sector);
    if (exchange && exchange !== 'All') params.set('exchange', exchange);

    // correct endpoint: /stable/company-screener
    const url = `https://financialmodelingprep.com/stable/company-screener?${params.toString()}`;
    const r = await fetch(url);
    const text = await r.text();

    if (text.startsWith('Premium') || text.includes('Premium Query')) {
      res.status(200).json({ error: 'Premium', results: [] });
      return;
    }

    // Log first result keys for debugging
    let data;
    try { data = JSON.parse(text); } catch { data = []; }
    if (!Array.isArray(data)) data = [];

    if (data.length > 0) {
      res.setHeader('X-FMP-Fields', Object.keys(data[0]).join(',').slice(0, 300));
    }

    res.status(200).json({ results: data, total: data.length });
  } catch (e) {
    res.status(500).json({ error: e.message, results: [] });
  }
}
