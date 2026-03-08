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

  // Safe division helper
  const div = (a, b) => (a != null && b != null && b !== 0) ? a / b : null;

  try {
    const [income, cashflow, balance, keyMetrics, profile] = await Promise.all([
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
      const km  = keyMetrics.find(r=>(r.fiscalYear||r.date?.slice(0,4))===yr) || {};

      // Margins: FMP stable income-statement has NO ratio fields — calculate from raws
      const grossMargin     = div(inc.grossProfit,     inc.revenue);
      const operatingMargin = div(inc.operatingIncome, inc.revenue);
      const netMargin       = div(inc.netIncome,       inc.revenue);

      // Returns: use FMP key-metrics fields directly (confirmed working)
      const roe  = km.returnOnEquity          ?? null;
      const roa  = km.returnOnAssets          ?? km.returnOnTangibleAssets ?? null;
      const roic = km.returnOnInvestedCapital ?? div(
        inc.operatingIncome != null ? inc.operatingIncome * 0.79 : null,
        (bs.totalStockholdersEquity != null && bs.totalDebt != null)
          ? bs.totalStockholdersEquity + bs.totalDebt : null
      );

      // Leverage
      const debtEquity = div(bs.totalDebt, bs.totalStockholdersEquity);

      // P/E from earningsYield (E/P inversion) — only valuation metric in FMP stable
      const peRatio = km.earningsYield && km.earningsYield > 0
        ? 1 / km.earningsYield : null;

      // P/B: use marketCap from key-metrics row (confirmed present) / book equity
      const pbRatio = div(km.marketCap, bs.totalStockholdersEquity);

      return {
        year:            yr,
        revenue:         inc.revenue               ?? null,
        grossProfit:     inc.grossProfit            ?? null,
        operatingIncome: inc.operatingIncome        ?? null,
        netIncome:       inc.netIncome              ?? null,
        eps:             inc.eps                    ?? null,
        ebitda:          inc.ebitda                 ?? null,
        operatingCF:     cf.operatingCashFlow       ?? null,
        capex:           cf.capitalExpenditure      ?? null,
        freeCashFlow:    cf.freeCashFlow            ?? null,
        totalAssets:     bs.totalAssets             ?? null,
        totalDebt:       bs.totalDebt               ?? null,
        cashAndEquiv:    bs.cashAndCashEquivalents  ?? null,
        equity:          bs.totalStockholdersEquity ?? null,
        grossMargin,
        operatingMargin,
        netMargin,
        roe,
        roa,
        roic,
        debtEquity,
        peRatio,
        pbRatio,
        evEbitda:      km.evToEBITDA    ?? null,
        fcfYield:      km.freeCashFlowYield ?? null,
        grahamNumber:  km.grahamNumber  ?? null,
        currentRatio:  km.currentRatio  ?? null,
        netDebtEbitda: km.netDebtToEBITDA ?? null,
      };
    });

    // Top-level valuation from most recent key-metrics row
    const latestKm    = keyMetrics[0] || {};
    const topPE       = latestKm.earningsYield && latestKm.earningsYield > 0
      ? 1 / latestKm.earningsYield : null;
    const topPB       = div(latestKm.marketCap, (balance[0] || {}).totalStockholdersEquity);
    const topEvEbitda = latestKm.evToEBITDA ?? null;

    // PEG ratio: P/E divided by EPS annualised CAGR across available years
    // PEG < 1 = potentially undervalued; > 2 = expensive relative to growth
    let pegRatio = null;
    const epsValues = byYear.map(y => y.eps).filter(v => v != null && v > 0);
    if (epsValues.length >= 2 && topPE != null) {
      const n    = epsValues.length - 1;
      const cagr = Math.pow(epsValues[n] / epsValues[0], 1 / n) - 1; // annualised rate
      if (cagr > 0) pegRatio = topPE / (cagr * 100); // PEG = PE / growth-as-percent
    }

    res.status(200).json({
      symbol,
      name:          p.companyName  || symbol,
      currency:      p.currency     || 'USD',
      sector:        p.sector       || null,
      industry:      p.industry     || null,
      marketCap:     p.marketCap    ?? latestKm.marketCap ?? null,
      peRatio:       topPE,
      pbRatio:       topPB,
      evEbitda:      topEvEbitda,
      pegRatio,
      beta:          p.beta         ?? null,
      dividendYield: p.lastDividend ?? null,
      description:   p.description  || null,
      byYear,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, symbol });
  }
}
