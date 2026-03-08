// /api/etf.js — ETF data: stockanalysis.com for US, justETF for EU
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

    // FMP profile for price/marketCap/description/name
    let fmpProfile = null;
    if (FMP_KEY && symbol) {
      const tickers = symbol.includes('.')
        ? [symbol, symbol.replace(/\.\w+$/, '')]
        : [`${symbol}.AS`, `${symbol}.DE`, symbol];
      for (const tk of tickers) {
        try {
          const r = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${tk}&apikey=${FMP_KEY}`);
          const d = await r.json();
          const p = Array.isArray(d) ? d[0] : null;
          if (p?.companyName) { fmpProfile = p; break; }
        } catch {}
      }
    }

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
// Server-side renders a SvelteKit app — data lives in <meta> tags and JSON blobs
async function fetchStockAnalysis(ticker) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  const baseUrl = `https://stockanalysis.com/etf/${ticker.toLowerCase()}`;

  const [overviewHtml, holdingsHtml] = await Promise.all([
    fetch(`${baseUrl}/`, { headers: { 'User-Agent': ua } }).then(r => r.text()).catch(() => ''),
    fetch(`${baseUrl}/holdings/`, { headers: { 'User-Agent': ua } }).then(r => r.text()).catch(() => ''),
  ]);

  // ── Strip HTML first ──
  const stripped = (holdingsHtml || overviewHtml)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const overviewStripped = overviewHtml
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();

  // ── Holdings: data is in body text "NVIDIA stock at 8.66%, Apple at 7.48%" ──
  const holdings = [];
  const proseIdx = stripped.search(/top holdings are/i);
  const prose = proseIdx >= 0 ? stripped.slice(proseIdx, proseIdx + 600) : '';
  const holdRe = /([A-Za-z][A-Za-z0-9\s\.\,\-&]+?)\s+(?:stock\s+)?at\s+([\d\.]+)%/g;
  let hm;
  while ((hm = holdRe.exec(prose)) !== null && holdings.length < 10) {
    const name = hm[1].trim()
      .replace(/^(?:the\s+)?top\s+holdings?\s+(?:are\s+)?/i, '')
      .replace(/^and\s+/i, '')
      .trim();
    const weight = parseFloat(hm[2]);
    if (name.length > 1 && name.length < 50 && weight > 0) holdings.push({ name, weight });
  }

  let ter = null, inceptionDate = null, holdingsCount = null, fundSize = null;
  let sectors = [];

  // Expense ratio from text
  if (!ter) {
    const em = stripped.match(/[Ee]xpense [Rr]atio\s+([0-9.]+%)/);
    if (em) ter = em[1];
  }

  // Holdings count: "Total Holdings 104"
  if (!holdingsCount) {
    const hcm = stripped.match(/Total Holdings\s+(\d+)/i) ||
                stripped.match(/Number of Holdings\s+(\d+)/i);
    if (hcm) holdingsCount = hcm[1];
  }

  // Inception date from text
  if (!inceptionDate) {
    const im = stripped.match(/Inception\s+(?:Date\s+)?([A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4})/i);
    if (im) inceptionDate = im[1];
  }

  // Sectors: "Technology: 53.60%" pattern in stripped body text
  const sectIdx = stripped.search(/[Ss]ector [Aa]llocation/);
  if (sectIdx >= 0) {
    const sectSlice = stripped.slice(sectIdx, sectIdx + 600);
    const sectRe = /([A-Za-z][A-Za-z\s&]{2,35}?):\s*([\d\.]+)%/g;
    let sm;
    while ((sm = sectRe.exec(sectSlice)) !== null && sectors.length < 5) {
      const n = sm[1].trim();
      const w = parseFloat(sm[2]);
      if (n.length > 2 && w > 0 && !n.match(/^(Other|End|Total|Asset)/i))
        sectors.push({ name: n, weight: w });
    }
  }

  return {
    name: null,
    ter, distPolicy: 'Distributing', replication: null,
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

  const ter          = matchAfter(s, /\bTER\b/, /[\d]+[.,][\d]+\s*%\s*p\.a\./);
  const distPolicy   = matchAfter(s, /Distribution policy/, /(Accumulating|Distributing)/i);
  const replication  = matchAfter(s, /Replication/, /(Physical|Synthetic|Optimised sampling|Full replication|Sampling)/i);
  const fundSize     = matchAfter(s, /Fund size/, /((?:EUR|USD)\s*[\d,\.]+\s*[mb])/i);
  const inceptionDate= matchAfter(s, /Inception Date/, /(\d{1,2}\s+\w+\s+\d{4})/);
  const holdingsCount= matchAfter(s, /\bHoldings\b/, /(\d[\d,]+)/);
  const nameMatch    = html.match(/<h1[^>]*>([^<]{10,100})<\/h1>/i);

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

  const sectors = [];
  const lastSIdx = s.lastIndexOf(' Sectors ');
  if (lastSIdx !== -1) {
    const slice = s.slice(lastSIdx, lastSIdx + 400);
    const re = /([A-Za-z][A-Za-z\s&]{2,35}?)\s+([\d]+[.,][\d]+)\s*%/g;
    let sm;
    while ((sm = re.exec(slice)) !== null && sectors.length < 5) {
      const n = sm[1].trim();
      const w = parseFloat(sm[2].replace(',', '.'));
      if (n.length >= 3 && n.length <= 40 && w > 0 && !n.match(/^(?:Show|Other|As of|Sectors)/i))
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
