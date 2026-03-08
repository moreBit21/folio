export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'QQQ' } = req.query;
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  const html = await fetch(`https://stockanalysis.com/etf/${symbol.toLowerCase()}/`, {
    headers: { 'User-Agent': ua }
  }).then(r => r.text());

  const s = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')
    .replace(/\s+/g, ' ').trim();

  const techIdx = s.indexOf('Technology');
  const sectIdx = s.search(/[Ss]ector/);

  res.status(200).json({
    around_technology: techIdx > 0 ? s.slice(Math.max(0, techIdx-100), techIdx+400) : 'NOT FOUND',
    around_sector: sectIdx > 0 ? s.slice(Math.max(0, sectIdx-50), sectIdx+400) : 'NOT FOUND',
  });
}
