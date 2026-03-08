export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol } = req.query;
  if (!symbol) { res.status(400).json({ error: 'missing symbol' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  const fmp = async (path) => {
    try {
      const sep = path.includes('?') ? '&' : '?';
      const r = await fetch(`https://financialmodelingprep.com/stable${path}${sep}apikey=${FMP_KEY}`);
      const text = await r.text();
      if (text.startsWith('Premium') || text.includes('Premium Query')) return [];
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : (data?.data ?? data ?? []);
    } catch { return []; }
  };

  try {
    const [income, cashflow, balance, ratios, profile] = await Promise.all([
      fmp(`/income-statement?symbol=${symbol}&limit=5`),
      fmp(`/cash-flow-statement?symbol=${symbol}&limit=5`),
      fmp(`/balance-sheet-statement?symbol=${symbol}&limit=5`),
      fmp(`/key-metrics?symbol=${symbol}&limit=5`),
      fmp(`/profile?symbol=${symbol}`),
    ]);

    const p = profile[0] || {};

    const years = [...new Set([
      ...income.map(r => r.calendarYear || r.date?.slice(0,4)).filter(Boolean),
      ...cashflow.map(r => r.calendarYear || r.date?.slice(0,4)).filter(Boolean),
    ])].sort();

    const byYear = years.map(yr => {
      const inc = income.find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)   || {};
      const cf  = cashflow.find(r=>(r.calendarYear||r.date?.slice(0,4))===yr) || {};
      const bs  = balance.find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)  || {};
      const km  = ratios.find(r=>(r.calendarYear||r.date?.slice(0,4))===yr)   || {};

      // D/E and ROIC — use direct FMP fields where available, fallback to manual calc
      const roic = km.returnOnInvestedCapital ?? (() => {
        const nopat = inc.operatingIncome != null ? inc.operatingIncome * 0.79 : null;
        const ic    = (bs.totalStockholdersEquity != null && bs.totalDebt != null)
                      ? bs.totalStockholdersEquity + bs.totalDebt : null;
        return nopat != null && ic ? nopat / ic : null;
      })();
      const debtEquity = bs.totalDebt != null && bs.totalStockholdersEquity
                    ? bs.totalDebt / bs.totalStockholdersEquity : null;
      // P/E: FMP stable /key-metrics exposes earningsYield (E/P); invert to get P/E
      const peRatio = km.priceToEarningsRatio
        ?? (km.earningsYield && km.earningsYield > 0 ? 1 / km.earningsYield : null);
      // P/B from key-metrics
      const pbRatio = km.priceToBookRatio ?? km.pbRatio ?? null;

      return {
        year:            yr,
        revenue:         inc.revenue              ?? null,
        grossProfit:     inc.grossProfit           ?? null,
        operatingIncome: inc.operatingIncome       ?? null,
        netIncome:       inc.netIncome             ?? null,
        eps:             inc.eps                   ?? null,
        ebitda:          inc.ebitda                ?? null,
        operatingCF:     cf.operatingCashFlow      ?? null,
        capex:           cf.capitalExpenditure     ?? null,
        freeCashFlow:    cf.freeCashFlow           ?? null,
        totalAssets:     bs.totalAssets            ?? null,
        totalDebt:       bs.totalDebt              ?? null,
        cashAndEquiv:    bs.cashAndCashEquivalents ?? null,
        equity:          bs.totalStockholdersEquity ?? null,
        grossMargin:     inc.grossProfitRatio       ?? null,
        operatingMargin: inc.operatingIncomeRatio   ?? null,
        netMargin:       inc.netIncomeRatio         ?? null,
        roe:             km.returnOnEquity          ?? null,   // was km.roe — wrong field
        roa:             km.returnOnAssets          ?? km.returnOnTangibleAssets ?? null,
        roic,
        debtEquity,
        peRatio,
        pbRatio,
        evEbitda:        km.evToEBITDA             ?? null,   // was km.enterpriseValueOverEBITDA
        fcfYield:        km.freeCashFlowYield       ?? null,  // was km.fcfYield
        grahamNumber:    km.grahamNumber            ?? null,
        currentRatio:    km.currentRatio            ?? null,
        netDebtEbitda:   km.netDebtToEBITDA         ?? null,
      };
    });

    // Derive top-level P/E: use most recent year's value from key-metrics
    const latestKm = ratios[0] || {};
    const topPE = latestKm.priceToEarningsRatio
      ?? (latestKm.earningsYield && latestKm.earningsYield > 0 ? 1 / latestKm.earningsYield : null);

    res.status(200).json({
      symbol,
      name:          p.companyName  || symbol,
      currency:      p.currency     || 'USD',
      sector:        p.sector       || null,
      industry:      p.industry     || null,
      marketCap:     p.marketCap    ?? null,   // was q.marketCap ?? p.mktCap (wrong fields)
      peRatio:       topPE,
      pbRatio:       latestKm.priceToBookRatio ?? null,
      evEbitda:      latestKm.evToEBITDA       ?? null,
      beta:          p.beta         ?? null,
      dividendYield: p.lastDividend ?? null,   // was p.lastDiv (wrong field)
      description:   p.description  || null,
      byYear,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, symbol });
  }
}
