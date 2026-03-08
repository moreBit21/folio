export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'QQQ' } = req.query;
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  const html = await fetch(`https://stockanalysis.com/etf/${symbol.toLowerCase()}/holdings/`, {
    headers: { 'User-Agent': ua }
  }).then(r => r.text());

  // Extract every meta tag
  const metas = [...html.matchAll(/<meta[^>]+>/gi)].map(m => m[0]).filter(m =>
    m.includes('description') || m.includes('title') || m.includes('content')
  ).slice(0, 10);

  // Find the description content value
  const desc = html.match(/name="description"[^>]*content="([^"]+)"/i)?.[1]
            || html.match(/content="([^"]+)"[^>]*name="description"/i)?.[1];

  // Raw 500 chars of HTML around "NVIDIA"
  const nIdx = html.indexOf('NVIDIA');
  const rawAroundNvidia = nIdx > 0 ? html.slice(Math.max(0, nIdx - 200), nIdx + 300) : 'NOT FOUND';

  // Also look for __INITIAL_STATE__ or sveltekit data blobs
  const dataBlobs = [...html.matchAll(/\{[^{}]{20,500}(?:expense|holdings|inception|weight)[^{}]{0,200}\}/gi)]
    .slice(0, 3).map(m => m[0].slice(0, 200));

  res.status(200).json({ metas, desc, rawAroundNvidia, dataBlobs });
}
