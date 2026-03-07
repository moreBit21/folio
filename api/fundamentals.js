// FMP stable API — fundamentals proxy
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol } = req.query;
  if (!symbol) { res.status(400).json({ error: 'missing symbol' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  const fmp = async (path) => {
    const sep = path.includes('?') ? '&' : '?';
    const r = await fetch(`https://financialmodelingprep.com/stable${path}${sep}apikey=${FMP_KEY}`);
    return r.json();
  };

  try {
    const [income, cashflow, ratios, profile, quote] = await Promise.all([
      fmp(`/income-statement?symbol=${symbol}&limit=5`),
      fmp(`/cash-flow-statement?symbol=${symbol}&limit=5`),
      fmp(`/key-metrics?symbol=${symbol}&limit=5`),
      fmp(`/profile?symbol=${symbol}`),
      fmp(`/quotes?symbols=${symbol}`),
    ]);

    const p = Array.isArray(profile)  ? profile[0]  : {};
    const q = Array.isArray(quote)    ? quote[0]    : {};

    const years = [...new Set([
      ...(Array.isArray(income)   ? income.map(r=>r.calendarYear||r.date?.slice(0,4))   : []),
      ...(Array.isArray(cashflow) ? cashflow.map(r=>r.calendarYear||r.date?.slice(0,4)) : []),
    ])].sort();

    const byYear = years.map(yr => {
      const inc = (Array.isArray(income)   ? income   : []).find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)||{};
      const cf  = (Array.isArray(cashflow) ? cashflow : []).find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)||{};
      const km  = (Array.isArray(ratios)   ? ratios   : []).find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)||{};
      return {
        year: yr,
        revenue:         inc.revenue             ?? null,
        grossProfit:     inc.grossProfit          ?? null,
        operatingIncome: inc.operatingIncome      ?? null,
        netIncome:       inc.netIncome            ?? null,
        eps:             inc.eps                  ?? null,
        operatingCF:     cf.operatingCashFlow     ?? null,
        capex:           cf.capitalExpenditure    ?? null,
        freeCashFlow:    cf.freeCashFlow          ?? null,
        grossMargin:     inc.grossProfitRatio      ?? null,
        operatingMargin: inc.operatingIncomeRatio  ?? null,
        netMargin:       inc.netIncomeRatio        ?? null,
        roe:             km.roe                   ?? null,
        peRatio:         km.peRatio               ?? null,
      };
    });

    res.status(200).json({
      symbol,
      name:          p.companyName || symbol,
      currency:      p.currency    || 'USD',
      sector:        p.sector      || null,
      industry:      p.industry    || null,
      marketCap:     q.marketCap   ?? null,
      peRatio:       q.pe          ?? null,
      dividendYield: p.lastDiv     ?? null,
      beta:          p.beta        ?? null,
      description:   p.description || null,
      image:         p.image       || null,
      byYear,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, symbol });
  }
}
