// FMP proxy — keeps API key server-side, fixes CORS
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const path = req.query.path;
  if (!path) { res.status(400).json({ error: 'missing path' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  const sep = path.includes('?') ? '&' : '?';
  const url = `https://financialmodelingprep.com/api/v3${path}${sep}apikey=${FMP_KEY}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
