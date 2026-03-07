// FMP stable API proxy — new endpoints (post Aug 2025)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const path = req.query.path;
  if (!path) { res.status(400).json({ error: 'missing path' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  const sep = path.includes('?') ? '&' : '?';
  // New stable API base
  const url = `https://financialmodelingprep.com/stable${path}${sep}apikey=${FMP_KEY}`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    try { res.status(200).json(JSON.parse(text)); }
    catch { res.status(200).send(text); }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
