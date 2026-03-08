export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol } = req.query;
  if (!symbol) { res.status(400).json({ error: 'missing symbol' }); return; }

  const FMP_KEY = process.env.FMP_KEY;
  if (!FMP_KEY) { res.status(500).json({ error: 'FMP_KEY not configured' }); return; }

  // Stable v2 API (most endpoints)
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

  // v3 legacy API — needed for analyst-estimates (forward EPS consensus)
  const fmpV3 = async (path) => {
    try {
      const sep = path.includes('?') ? '&' : '?';
      const r = await fetch(`https://financialmodelingprep.com/api/v3${path}${sep}apikey=${FMP_KEY}`);
      const text = await r.text();
      if (text.startsWith('Premium') || text.includes('Premium Query')) return [];
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  };

  const div = (a, b) => (a != null && b != null && b !== 0) ? a / b : null;

  try {
    const [income, cashflow, balance, keyMetrics, profile, analystEstimates] = await Promise.all([
      fmp(`/income-statement?symbol=${symbol}&limit=5`),
      fmp(`/cash-flow-statement?symbol=${symbol}&limit=5`),
      fmp(`/balance-sheet-statement?symbol=${symbol}&limit=5`),
      fmp(`/key-metrics?symbol=${symbol}&limit=5`),
      fmp(`/profile?symbol=${symbol}`),
      fmpV3(`/analyst-estimates/${symbol}?limit=6&period=annual`),
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

      const roe  = km.returnOnEquity          ?? null;
      const roa  = km.returnOnAssets          ?? km.returnOnTangibleAssets ?? null;
      const roic = km.returnOnInvestedCapital ?? div(
        inc.operatingIncome != null ? inc.operatingIncome * 0.79 : null,
        (bs.totalStockholdersEquity != null && bs.totalDebt != null)
          ? bs.totalStockholdersEquity + bs.totalDebt : null
      );

      const debtEquity = div(bs.totalDebt, bs.totalStockholdersEquity);
      const peRatio    = km.earningsYield && km.earningsYield > 0
        ? 1 / km.earningsYield : null;
      const pbRatio    = div(km.marketCap, bs.totalStockholdersEquity);

      return {
        year: yr,
        revenue: inc.revenue ?? null, grossProfit: inc.grossProfit ?? null,
        operatingIncome: inc.operatingIncome ?? null, netIncome: inc.netIncome ?? null,
        eps: inc.eps ?? null, ebitda: inc.ebitda ?? null,
        operatingCF: cf.operatingCashFlow ?? null, capex: cf.capitalExpenditure ?? null,
        freeCashFlow: cf.freeCashFlow ?? null, totalAssets: bs.totalAssets ?? null,
        totalDebt: bs.totalDebt ?? null, cashAndEquiv: bs.cashAndCashEquivalents ?? null,
        equity: bs.totalStockholdersEquity ?? null,
        grossMargin, operatingMargin, netMargin,
        roe, roa, roic, debtEquity, peRatio, pbRatio,
        evEbitda: km.evToEBITDA ?? null, fcfYield: km.freeCashFlowYield ?? null,
        grahamNumber: km.grahamNumber ?? null, currentRatio: km.currentRatio ?? null,
        netDebtEbitda: km.netDebtToEBITDA ?? null,
      };
    });

    // ── Top-level valuation ──────────────────────────────────────────────────
    const latestKm = keyMetrics[0] || {};
    const topPE    = latestKm.earningsYield && latestKm.earningsYield > 0
      ? 1 / latestKm.earningsYield : null;
    const topPB    = div(latestKm.marketCap, (balance[0] || {}).totalStockholdersEquity);

    // ── PEG Ratio — Forward analyst consensus (Peter Lynch: PEG = PE / fwd EPS growth%)
    // Uses next fiscal year's analyst consensus EPS vs most recent actual EPS.
    // This is the same methodology as Bloomberg, FactSet, and most professional platforms.
    // Note: TradingView may use NTM (blended quarterly) EPS which can differ slightly.
    let pegRatio = null;
    let pegNote  = null;

    const now       = new Date();
    const sortedEst = [...analystEstimates].sort((a,b) => new Date(a.date)-new Date(b.date));
    const fwdEst    = sortedEst.find(r => new Date(r.date) > now);
    const latestActualEps = byYear[byYear.length - 1]?.eps;

    if (fwdEst?.epsAvg && latestActualEps && latestActualEps > 0 && topPE != null) {
      const fwdGrowth = (fwdEst.epsAvg - latestActualEps) / latestActualEps;
      if (fwdGrowth > 0) {
        pegRatio = topPE / (fwdGrowth * 100);
        pegNote  = `Forward EPS est. ${fwdEst.epsAvg.toFixed(2)} (${fwdEst.date.slice(0,7)}), ${(fwdGrowth*100).toFixed(1)}% growth`;
      }
    }

    // Fallback: YoY trailing if no forward estimates available
    if (pegRatio == null) {
      const epsVals = byYear.map(y => y.eps).filter(v => v != null && v > 0);
      if (epsVals.length >= 2 && topPE != null) {
        const yoy = (epsVals[epsVals.length-1] - epsVals[epsVals.length-2]) / epsVals[epsVals.length-2];
        if (yoy > 0) { pegRatio = topPE / (yoy * 100); pegNote = 'Trailing YoY (no fwd estimates)'; }
      }
    }

    res.status(200).json({
      symbol,
      name: p.companyName || symbol, currency: p.currency || 'USD',
      sector: p.sector || null, industry: p.industry || null,
      marketCap: p.marketCap ?? latestKm.marketCap ?? null,
      peRatio: topPE, pbRatio: topPB,
      evEbitda: latestKm.evToEBITDA ?? null,
      pegRatio, pegNote,
      beta: p.beta ?? null, dividendYield: p.lastDividend ?? null,
      description: p.description || null,
      byYear,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, symbol });
  }
}
