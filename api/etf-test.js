export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'QQQ' } = req.query;
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  const [ovHtml, hoHtml] = await Promise.all([
    fetch(`https://stockanalysis.com/etf/${symbol.toLowerCase()}/`, { headers: { 'User-Agent': ua } }).then(r => r.text()),
    fetch(`https://stockanalysis.com/etf/${symbol.toLowerCase()}/holdings/`, { headers: { 'User-Agent': ua } }).then(r => r.text()),
  ]);

  const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const ov = strip(ovHtml);
  const ho = strip(hoHtml);

  // Find Technology in both pages
  const ovTech = ov.indexOf('Technology');
  const hoTech = ho.indexOf('Technology');
  // Find % patterns near "53" (known sector weight)
  const ovPercent = ov.indexOf('53.');
  const hoPercent = ho.indexOf('53.');

  res.status(200).json({
    ov_technology: ovTech > 0 ? ov.slice(Math.max(0,ovTech-100), ovTech+300) : 'NOT FOUND',
    ho_technology: hoTech > 0 ? ho.slice(Math.max(0,hoTech-100), hoTech+300) : 'NOT FOUND',
    ov_53pct: ovPercent > 0 ? ov.slice(Math.max(0,ovPercent-100), ovPercent+200) : 'NOT FOUND',
    ho_53pct: hoPercent > 0 ? ho.slice(Math.max(0,hoPercent-100), hoPercent+200) : 'NOT FOUND',
  });
}
