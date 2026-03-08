// /api/etf.js — ETF data: justETF for EU/IE, etfdb.com for US
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { isin, symbol } = req.query;
  const FMP_KEY = process.env.FMP_KEY;

  try {
    // Resolve ISIN if missing
    let lookupIsin = isin;
    if (!lookupIsin && symbol && FMP_KEY) {
      lookupIsin = await resolveIsin(symbol, FMP_KEY);
    }
    if (!lookupIsin && !symbol) {
      return res.status(400).json({ error: 'Provide isin or symbol' });
    }

    // FMP profile (price, description, name) — works for both US and EU
    let fmpProfile = null;
    if (FMP_KEY && symbol) {
      const tickers = symbol.includes('.') ? [symbol] : [`${symbol}.AS`, `${symbol}.DE`, symbol];
      for (const tk of tickers) {
        try {
          const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${tk}&apikey=${FMP_KEY}`);
          const d = await r.json();
          const p = Array.isArray(d) ? d[0] : null;
          if (p?.companyName) { fmpProfile = p; break; }
        } catch {}
      }
    }
    // Also try bare symbol for US ETFs
    if (!fmpProfile && FMP_KEY && symbol && !symbol.includes('.')) {
      try {
        const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${FMP_KEY}`);
        const d = await r.json();
        fmpProfile = Array.isArray(d) ? d[0] : null;
      } catch {}
    }

    const isUS = lookupIsin?.startsWith('US') || (!lookupIsin && !symbol?.includes('.'));

    let etfData;
    if (isUS) {
      etfData = await fetchEtfDbData(symbol, lookupIsin);
    } else {
      etfData = await fetchJustEtfData(lookupIsin || isin);
    }

    return res.status(200).json({
      isin: lookupIsin || null,
      name: fmpProfile?.companyName || etfData.name || null,
      ter:           etfData.ter,
      distPolicy:    etfData.distPolicy,
      replication:   etfData.replication,
      fundSize:      etfData.fundSize,
      holdingsCount: etfData.holdingsCount,
      inceptionDate: etfData.inceptionDate,
      holdings:      etfData.holdings.slice(0, 10),
      countries:     etfData.countries.slice(0, 5),
      sectors:       etfData.sectors.slice(0, 5),
      price:       fmpProfile?.price    ?? null,
      marketCap:   fmpProfile?.marketCap ?? null,
      currency:    fmpProfile?.currency  ?? (isUS ? 'USD' : 'EUR'),
      description: fmpProfile?.description ?? null,
      source:    isUS ? 'etfdb' : 'justETF',
      sourceUrl: etfData.sourceUrl,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message, isin, symbol });
  }
}

// ── justETF (for EU UCITS ETFs with IE/LU/DE/FR ISINs) ───────────────────────
async function fetchJustEtfData(isin) {
  const url = `https://www.justetf.com/en/etf-profile.html?isin=${isin}`;
  const html = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  }).then(r => r.text());

  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
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

  // Holdings — section between "Top 10 Holdings" and "Countries"
  const holdings = [];
  const holdingSection = stripped.match(/Top 10 Holdings[\s\S]*?(?=Countries|Sectors|Savings plan|$)/i)?.[0] || '';
  const holdingRe = /([A-Za-z][A-Za-z0-9\s,\.\-&'®]+?)\s+([\d]+[.,][\d]+)\s*%/g;
  let hm;
  while ((hm = holdingRe.exec(holdingSection)) !== null && holdings.length < 10) {
    const n = hm[1].trim().replace(/\s+/g, ' ');
    const w = parseFloat(hm[2].replace(',', '.'));
    if (n.length >= 3 && n.length <= 60 && w > 0 && w < 20
        && !n.match(/^(?:Weight|Top|out of|below|composition)/i))
      holdings.push({ name: n, weight: w });
  }

  // Countries — between LAST "Countries" and next "Sectors"
  const countries = [];
  const lastCIdx = stripped.lastIndexOf(' Countries ');
  const sectorsAfterIdx = stripped.indexOf(' Sectors ', lastCIdx);
  if (lastCIdx !== -1 && sectorsAfterIdx !== -1) {
    const slice = stripped.slice(lastCIdx, sectorsAfterIdx);
    const re = /([A-Za-z][A-Za-z\s]{1,30}?)\s+([\d]+[.,][\d]+)\s*%/g;
    let cm;
    while ((cm = re.exec(slice)) !== null && countries.length < 5) {
      const n = cm[1].trim().replace(/^Countries\s*/i, '');
      const w = parseFloat(cm[2].replace(',', '.'));
      if (n.length >= 2 && n.length <= 35 && w > 0 && w <= 100
          && !n.match(/^(?:Show|Other|As of|Top|Weight|Below|Holdings|TER|Fund|Total|The|This)/i))
        countries.push({ name: n, weight: w });
    }
  }

  // Sectors — after LAST "Sectors" heading
  const sectors = [];
  const lastSIdx = stripped.lastIndexOf(' Sectors ');
  if (lastSIdx !== -1) {
    const slice = stripped.slice(lastSIdx, lastSIdx + 400);
    const re = /([A-Za-z][A-Za-z\s&]{2,35}?)\s+([\d]+[.,][\d]+)\s*%/g;
    let sm;
    while ((sm = re.exec(slice)) !== null && sectors.length < 5) {
      const n = sm[1].trim();
      const w = parseFloat(sm[2].replace(',', '.'));
      if (n.length >= 3 && n.length <= 40 && w > 0
          && !n.match(/^(?:Show|Other|As of|Sectors)/i))
        sectors.push({ name: n, weight: w });
    }
  }

  return {
    name: nameMatch?.[1]?.trim() || null,
    ter, distPolicy, replication, fundSize, holdingsCount, inceptionDate,
    holdings, countries, sectors, sourceUrl: url,
  };
}

// ── etfdb.com (for US ETFs) ───────────────────────────────────────────────────
async function fetchEtfDbData(symbol, isin) {
  const ticker = symbol?.replace(/\.(AS|DE|L|PA)$/i, '') || '';
  const url = `https://etfdb.com/etf/${ticker}/`;
  
  try {
    const html = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }).then(r => r.text());

    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ').trim();

    // Key facts from etfdb
    const ter          = matchAfter(stripped, /Expense Ratio/, /([\d]+[.,][\d]+\s*%)/i);
    const inceptionDate= matchAfter(stripped, /Inception Date/, /(\w+\s+\d{1,2},?\s+\d{4})/i);
    const fundSize     = matchAfter(stripped, /(?:AUM|Assets Under Management|Total Assets)/, /(\$[\d,\.]+\s*(?:B|M|T|billion|million)?)/i);
    const holdingsCount= matchAfter(stripped, /(?:Number of Holdings|Holdings Count|\# of Holdings)/, /(\d[\d,]+)/i);

    // Holdings — look for percentage table rows
    const holdings = [];
    const holdRe = /([A-Za-z][A-Za-z0-9\s,\.\-&']+?)\s+([\d]+[.,][\d]+)\s*%/g;
    // Find the top holdings section
    const holdIdx = stripped.search(/top.*holding|holding.*top/i);
    const holdSlice = holdIdx !== -1 ? stripped.slice(holdIdx, holdIdx + 2000) : '';
    let hm;
    while ((hm = holdRe.exec(holdSlice)) !== null && holdings.length < 10) {
      const n = hm[1].trim();
      const w = parseFloat(hm[2].replace(',', '.'));
      if (n.length >= 2 && n.length <= 60 && w > 0 && w < 25
          && !n.match(/^(?:Top|Holding|Fund|ETF|Weight|Percent|Index)/i))
        holdings.push({ name: n, weight: w });
    }

    // Sector weightings
    const sectors = [];
    const sectIdx = stripped.search(/sector.*weight|weight.*sector/i);
    const sectSlice = sectIdx !== -1 ? stripped.slice(sectIdx, sectIdx + 1000) : '';
    const sectRe = /([A-Za-z][A-Za-z\s&]{2,30}?)\s+([\d]+[.,][\d]+)\s*%/g;
    let sm;
    while ((sm = sectRe.exec(sectSlice)) !== null && sectors.length < 5) {
      const n = sm[1].trim();
      const w = parseFloat(sm[2].replace(',', '.'));
      if (n.length >= 3 && n.length <= 35 && w > 0
          && !n.match(/^(?:Sector|Weight|Other|Show)/i))
        sectors.push({ name: n, weight: w });
    }

    return {
      name: null,
      ter, distPolicy: 'Distributing', replication: null,
      fundSize, holdingsCount, inceptionDate,
      holdings, countries: [], sectors,
      sourceUrl: url,
    };
  } catch(e) {
    return { name: null, ter: null, distPolicy: null, replication: null,
      fundSize: null, holdingsCount: null, inceptionDate: null,
      holdings: [], countries: [], sectors: [], sourceUrl: url };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function resolveIsin(symbol, fmpKey) {
  const tickers = symbol.includes('.') ? [symbol] : [`${symbol}.AS`, `${symbol}.DE`, symbol];
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
