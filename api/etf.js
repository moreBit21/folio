// /api/etf.js — ETF profile data via justETF (server-side fetch, text parsing)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { isin, symbol } = req.query;
  const FMP_KEY = process.env.FMP_KEY;

  try {
    let lookupIsin = isin;
    if (!lookupIsin && symbol && FMP_KEY) {
      lookupIsin = await resolveIsin(symbol, FMP_KEY);
    }
    if (!lookupIsin) {
      return res.status(400).json({ error: 'Could not resolve ISIN. Provide ?isin= or ensure FMP_KEY is set.' });
    }

    const url = `https://www.justetf.com/en/etf-profile.html?isin=${lookupIsin}`;
    const html = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }).then(r => r.text());

    // Strip scripts/styles, collapse whitespace
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ').trim();

    // Key facts
    const ter          = matchAfter(stripped, /\bTER\b/, /[\d]+[.,][\d]+\s*%\s*p\.a\./);
    const distPolicy   = matchAfter(stripped, /Distribution policy/, /(Accumulating|Distributing)/i);
    const replication  = matchAfter(stripped, /Replication/, /(Physical|Synthetic|Optimised sampling|Full replication|Sampling)/i);
    const fundSize     = matchAfter(stripped, /Fund size/, /((?:EUR|USD)\s*[\d,\.]+\s*[mb])/i);
    const inceptionDate= matchAfter(stripped, /Inception Date/, /(\d{1,2}\s+\w+\s+\d{4})/);
    const holdingsCount= matchAfter(stripped, /Holdings/, /(\d[\d,]+)/);
    const nameMatch    = html.match(/<h1[^>]*>([^<]{10,100})<\/h1>/i) || html.match(/<title>([^|<]{10,100})/i);
    const name         = nameMatch ? nameMatch[1].trim() : null;

    // Top 10 Holdings
    const holdings = [];
    const holdingSection = stripped.match(/Top 10 Holdings[\s\S]*?(?=Countries|Sectors|Savings plan|$)/i)?.[0] || '';
    const holdingRe = /([A-Za-z][A-Za-z0-9\s,\.\-&'®]+?)\s+([\d]+[.,][\d]+)\s*%/g;
    let hm;
    while ((hm = holdingRe.exec(holdingSection)) !== null && holdings.length < 10) {
      const n = hm[1].trim().replace(/\s+/g, ' ');
      const w = parseFloat(hm[2].replace(',', '.'));
      if (n.length >= 3 && n.length <= 60 && w > 0 && w < 20
          && !n.match(/^(?:Weight|Top|out of|below|composition)/i)) {
        holdings.push({ name: n, weight: w });
      }
    }

    // Countries — find the LAST "Countries" heading (after Holdings section), then parse to "Sectors"
    const countries = [];
    const lastCountriesIdx = stripped.lastIndexOf(' Countries ');
    const sectorsAfterIdx  = stripped.indexOf(' Sectors ', lastCountriesIdx);
    if (lastCountriesIdx !== -1 && sectorsAfterIdx !== -1) {
      const countrySlice = stripped.slice(lastCountriesIdx, sectorsAfterIdx);
      const countryRe = /([A-Za-z][A-Za-z\s]{1,30}?)\s+([\d]+[.,][\d]+)\s*%/g;
      let cm;
      while ((cm = countryRe.exec(countrySlice)) !== null && countries.length < 5) {
        const n = cm[1].trim(); const w = parseFloat(cm[2].replace(',', '.'));
        if (n.length >= 2 && n.length <= 35 && w > 0 && w <= 100
            && !n.match(/^(?:Show|Other|As of|Top|Weight|Below|Composition|Holdings|TER|Fund|Total|The|This|Index)/i))
          countries.push({ name: n, weight: w });
      }
    }

    // Sectors
    const sectors = [];
    const sectorSection = stripped.match(/\bSectors\b([\s\S]*?)(?=As of|Savings plan|ETF Savings|$)/i)?.[1] || '';
    const sectorRe = /([A-Za-z][A-Za-z\s&]{2,35}?)\s+([\d]+[.,][\d]+)\s*%/g;
    let sm;
    while ((sm = sectorRe.exec(sectorSection)) !== null && sectors.length < 5) {
      const n = sm[1].trim(); const w = parseFloat(sm[2].replace(',', '.'));
      if (n.length >= 3 && n.length <= 40 && w > 0 && !n.match(/^(?:Show|Other|As of)/i))
        sectors.push({ name: n, weight: w });
    }

    // FMP supplement
    let fmpProfile = null;
    if (FMP_KEY && symbol) {
      const tickers = symbol.includes('.') ? [symbol] : [`${symbol}.AS`, `${symbol}.DE`, `${symbol}.L`, symbol];
      for (const tk of tickers) {
        try {
          const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${tk}&apikey=${FMP_KEY}`);
          const d = await r.json();
          const p = Array.isArray(d) ? d[0] : null;
          if (p?.companyName) { fmpProfile = p; break; }
        } catch {}
      }
    }

    return res.status(200).json({
      isin: lookupIsin, name: name || fmpProfile?.companyName || null,
      ter, distPolicy, replication, fundSize, holdingsCount, inceptionDate,
      holdings: holdings.slice(0, 10),
      countries: countries.slice(0, 5),
      sectors: sectors.slice(0, 5),
      price: fmpProfile?.price ?? null,
      marketCap: fmpProfile?.marketCap ?? null,
      currency: fmpProfile?.currency ?? 'EUR',
      description: fmpProfile?.description ?? null,
      source: 'justETF', sourceUrl: url,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message, isin, symbol });
  }
}

async function resolveIsin(symbol, fmpKey) {
  const tickers = symbol.includes('.') ? [symbol] : [`${symbol}.AS`, `${symbol}.DE`, `${symbol}.L`, symbol];
  for (const tk of tickers) {
    try {
      const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${tk}&apikey=${fmpKey}`);
      const d = await r.json();
      const isin = Array.isArray(d) ? d[0]?.isin : null;
      if (isin) return isin;
    } catch {}
  }
  return null;
}

function matchAfter(text, labelRe, valueRe) {
  const idx = text.search(labelRe);
  if (idx === -1) return null;
  const snippet = text.slice(idx, idx + 200);
  const m = snippet.match(valueRe);
  return m ? (m[1] || m[0]).trim() : null;
}
