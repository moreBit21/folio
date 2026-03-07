// Proxy for Yahoo Finance — free, no key, supports ISIN search and historical prices
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { type, symbol, isin, from, to } = req.query;

  try {
    let url, data;

    if (type === 'search') {
      // Search by symbol or ISIN
      url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(isin||symbol)}&quotesCount=5&newsCount=0`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const json = await r.json();
      data = (json?.quotes || []).map(q => ({ symbol: q.symbol, name: q.shortname, exchange: q.exchange }));

    } else if (type === 'history') {
      // Historical OHLC — Yahoo uses Unix timestamps
      const fromTs = Math.floor(new Date(from).getTime() / 1000);
      const toTs   = Math.floor(new Date(to).getTime() / 1000);
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&period1=${fromTs}&period2=${toTs}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const json = await r.json();
      const result = json?.chart?.result?.[0];
      if (!result) { res.status(200).json([]); return; }
      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];
      const currency = result.meta?.currency || 'USD';
      data = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        close: closes[i] ?? null,
        currency,
      })).filter(d => d.close !== null);

    } else if (type === 'quote') {
      // Current quote for multiple symbols
      url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const json = await r.json();
      data = (json?.quoteResponse?.result || []).map(q => ({
        symbol: q.symbol,
        price: q.regularMarketPrice,
        currency: q.currency,
      }));

    } else {
      res.status(400).json({ error: 'unknown type' }); return;
    }

    console.log(type, symbol||isin, '->', Array.isArray(data) ? data.length + ' results' : data);
    res.status(200).json(data);
  } catch (e) {
    console.error('proxy error:', e.message);
    res.status(500).json({ error: e.message });
  }
}
