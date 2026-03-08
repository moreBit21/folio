// /api/etf.js — ETF data: stockanalysis.com for US, justETF for EU
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

    // FMP profile for price/marketCap/description/name
    let fmpProfile = null;
    if (FMP_KEY && symbol) {
      const tickers = symbol.includes('.') ? [symbol, symbol.replace(/\.\w+$/, '')] : [`${symbol}.AS`, `${symbol}.DE`, symbol];
      for (const tk of tickers) {
        try {
          const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${tk}&apikey=${FMP_KEY}`);
          const d = await r.json();
          const p = Array.isArray(d) ? d[0] : null;
          if (p?.companyName) { fmpProfile = p; break; }
        } catch {}
      }
    }

    // Route: US ISIN or bare ticker (no exchange suffix) → stockanalysis.com
    const isUS = lookupIsin?.startsWith('US') || (!lookupIsin && symbol && !symbol.includes('.'));
    const baseTicker = (symbol || '').replace(/\.(AS|DE|L|PA|F|MI|SW)$/i, '').toUpperCase();

    let etfData;
    if (isUS) {
      etfData = await fetchStockAnalysis(baseTicker);
    } else {
      etfData = await fetchJustEtf(lookupIsin || isin);
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
      holdings:      (etfData.holdings || []).slice(0, 10),
      countries:     (etfData.countries || []).slice(0, 5),
      sectors:       (etfData.sectors || []).slice(0, 5),
      price:       fmpProfile?.price    ?? null,
      marketCap:   fmpProfile?.marketCap ?? null,
      currency:    fmpProfile?.currency  ?? (isUS ? 'USD' : 'EUR'),
      description: fmpProfile?.description ?? null,
      source:    isUS ? 'stockanalysis' : 'justETF',
      sourceUrl: etfData.sourceUrl,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message, isin, symbol });
  }
}

// ── stockanalysis.com — US ETFs ───────────────────────────────────────────────
async function fetchStockAnalysis(ticker) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  const baseUrl = `https://stockanalysis.com/etf/${ticker.toLowerCase()}`;

  // Fetch overview page and holdings page in parallel
  const [overviewHtml, holdingsHtml] = await Promise.all([
    fetch(`${baseUrl}/`, { headers: { 'User-Agent': ua } }).then(r => r.text()).catch(() => ''),
    fetch(`${baseUrl}/holdings/`, { headers: { 'User-Agent': ua } }).then(r => r.text()).catch(() => ''),
  ]);

  const ov = stripHtml(overviewHtml);
  const ho = stripHtml(holdingsHtml);

  // Key facts from overview page — tab-separated values
  const ter          = matchTabValue(ov, 'Expense Ratio');
  const inceptionDate= matchTabValue(ov, 'Inception Date');
  const holdingsCount= matchTabValue(ov, /Number of Holdings|Holdings\s*\n/);

  // Fund size — look for AUM pattern "$XXX.XX B" or "XXX.XXM"
  const aumMatch = ov.match(/(?:AUM|Net Assets|Total Assets|Fund Size)\s*[\t\n]\s*\$?([\d,\.]+\s*[BMT])/i);
  const fundSize = aumMatch ? aumMatch[1] : null;

  // ETF name
  const nameMatch = overviewHtml.match(/<h1[^>]*>([^<]{5,80})<\/h1>/i);
  const name = nameMatch ? nameMatch[1].trim() : null;

  // Holdings — from holdings page, pattern: "No. Symbol Name % Weight"
  // Text format: "1\tNVDA\tNVIDIA Corporation\t8.66%\t..."
  const holdings = [];
  const holdRe = /\d+\t[A-Z]{1,6}\t([^\t]+)\t([\d\.]+)%/g;
  let hm;
  while ((hm = holdRe.exec(ho)) !== null && holdings.length < 10) {
    holdings.push({ name: hm[1].trim(), weight: parseFloat(hm[2]) });
  }
  // Fallback: parse from overview "Name\tSymbol\tWeight" table
  if (!holdings.length) {
    const tableRe = /([A-Za-z][A-Za-z0-9\s,\.\-&']+)\t[A-Z]{1,6}\t([\d\.]+)%/g;
    const topSection = ov.slice(ov.search(/Top 10 Holdings|Top Holdings/i), ov.search(/Top 10 Holdings|Top Holdings/i) + 1000);
    while ((hm = tableRe.exec(topSection)) !== null && holdings.length < 10) {
      holdings.push({ name: hm[1].trim(), weight: parseFloat(hm[2]) });
    }
  }

  // Sectors — from holdings page "Technology: 53.60%"
  const sectors = [];
  const sectSection = ho.slice(ho.search(/Sector Allocation/i), ho.search(/Sector Allocation/i) + 600);
  const sectRe = /([A-Za-z][A-Za-z\s&]+?):\s*([\d\.]+)%/g;
  let sm;
  while ((sm = sectRe.exec(sectSection)) !== null && sectors.length < 5) {
    const n = sm[1].trim();
    const w = parseFloat(sm[2]);
    if (n !== 'Other' && n.length > 2) sectors.push({ name: n, weight: w });
  }

  return {
    name, ter, distPolicy: 'Distributing', replication: null,
    fundSize, holdingsCount, inceptionDate,
    holdings, countries: [], sectors,
    sourceUrl: `${baseUrl}/holdings/`,
  };
}

// ── justETF — EU UCITS ETFs ───────────────────────────────────────────────────
async function fetchJustEtf(isin) {
  const url = `https://www.justetf.com/en/etf-profile.html?isin=${isin}`;
  const html = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  }).then(r => r.text());

  const s = stripHtml(html);

  // Key facts
  const ter          = matchAfter(s, /\bTER\b/, /[\d]+[.,][\d]+\s*%\s*p\.a\./);
  const distPolicy   = matchAfter(s, /Distribution policy/, /(Accumulating|Distributing)/i);
  const replication  = matchAfter(s, /Replication/, /(Physical|Synthetic|Optimised sampling|Full replication|Sampling)/i);
  const fundSize     = matchAfter(s, /Fund size/, /((?:EUR|USD)\s*[\d,\.]+\s*[mb])/i);
  const inceptionDate= matchAfter(s, /Inception Date/, /(\d{1,2}\s+\w+\s+\d{4})/);
  const holdingsCount= matchAfter(s, /\bHoldings\b/, /(\d[\d,]+)/);
  const nameMatch    = html.match(/<h1[^>]*>([^<]{10,100})<\/h1>/i);

  // Holdings
  const holdings = [];
  const holdSection = s.match(/Top 10 Holdings[\s\S]*?(?=Countries|Sectors|Savings plan|$)/i)?.[0] || '';
  const holdRe = /([A-Za-z][A-Za-z0-9\s,\.\-&'®]+?)\s+([\d]+[.,][\d]+)\s*%/g;
  let hm;
  while ((hm = holdRe.exec(holdSection)) !== null && holdings.length < 10) {
    const n = hm[1].trim().replace(/\s+/g, ' ');
    const w = parseFloat(hm[2].replace(',', '.'));
    if (n.length >= 3 && n.length <= 60 && w > 0 && w < 20
        && !n.match(/^(?:Weight|Top|out of|below|composition)/i))
      holdings.push({ name: n, weight: w });
  }

  // Countries — between LAST "Countries" and next "Sectors"
  const countries = [];
  const cIdx = s.lastIndexOf(' Countries ');
  const sIdx = s.indexOf(' Sectors ', cIdx);
  if (cIdx !== -1 && sIdx !== -1) {
    const slice = s.slice(cIdx, sIdx);
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

  // Sectors
  const sectors = [];
  const lastSIdx = s.lastIndexOf(' Sectors ');
  if (lastSIdx !== -1) {
    const slice = s.slice(lastSIdx, lastSIdx + 400);
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}

function matchTabValue(text, labelRe) {
  const re = typeof labelRe === 'string'
    ? new RegExp(labelRe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[\\t\\n]\\s*([^\\t\\n]{1,40})')
    : new RegExp(labelRe.source + '\\s*[\\t\\n]\\s*([^\\t\\n]{1,40})');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function matchAfter(text, labelRe, valueRe) {
  const idx = text.search(labelRe);
  if (idx === -1) return null;
  const m = text.slice(idx, idx + 200).match(valueRe);
  return m ? (m[1] || m[0]).trim() : null;
}

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
