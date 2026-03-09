export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const path = req.query.path;
  if (!path) { res.status(400).json({ error: 'missing path' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  const sep = path.includes('?') ? '&' : '?';
  const url = `https://financialmodelingprep.com/stable${path}${sep}apikey=${FMP_KEY}`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    if (text.startsWith('Premium') || text.includes('Premium Query')) {
      res.status(200).json({ error: 'Premium', message: text.slice(0, 100) });
      return;
    }
    let parsed;
    try { parsed = JSON.parse(text); } catch { res.status(200).json({ error: 'parse', raw: text.slice(0, 200) }); return; }
    // Add debug header so client can see first symbol's fields in dev
    if (Array.isArray(parsed) && parsed.length > 0) {
      res.setHeader('X-FMP-Fields', Object.keys(parsed[0]).join(',').slice(0, 200));
    }
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
