
// Server-side health score (mirrors client calcCanonicalHealthScore)
function computeHealthScore({ byYear, sector, peRatio, pegRatio, evEbitda }) {
  const yrs  = (byYear || []).slice(-3);
  const last = yrs[yrs.length - 1] || {};
  const prev = yrs[yrs.length - 2] || {};
  const prev2= yrs[yrs.length - 3] || {};
  const s = (sector || '').toLowerCase();
  const isTech    = /tech|software|semi|information/i.test(s);
  const isFinance = /financ|bank|insurance|reit/i.test(s);
  const isRetail  = /retail|consumer staple|grocery/i.test(s);
  const isHealth2 = /health|pharma|biotech|medical/i.test(s);
  const isEnergy  = /energy|oil|gas|util/i.test(s);
  const nmGood = isTech?0.15:isRetail?0.04:isEnergy?0.06:0.08;
  const nmOk   = isTech?0.06:isRetail?0.01:isEnergy?0.02:0.03;
  const deGood = isFinance?8:isTech?0.5:1;
  const deOk   = isFinance?15:isTech?1.5:2;
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b)/arr.length : null;
  const sc = (v, good, ok) => v==null?null:v>=good?2:v>=ok?1:0;
  const colorOf = (scores, t1=1.5, t2=0.8) => {
    const f = scores.filter(s=>s!==null);
    if (!f.length) return 'gray';
    const a = avg(f);
    return a>=t1?'green':a>=t2?'gold':'red';
  };
  const profitColor = colorOf([
    sc(last.netMargin, nmGood, nmOk),
    sc(last.roe, 0.15, 0.08),
    sc(last.roic, 0.10, 0.05),
    sc(last.grossMargin, isTech?0.50:isRetail?0.25:0.35, isTech?0.30:isRetail?0.15:0.20),
  ]);
  const g = (last.revenue&&prev.revenue&&prev.revenue>0)?(last.revenue/prev.revenue-1):null;
  const growthColor = g==null?'gray':g>(isTech?0.15:0.07)?'green':g>(isTech?0.05:0.02)?'gold':'red';
  const g2 = (prev.revenue&&prev2.revenue&&prev2.revenue>0)?prev.revenue/prev2.revenue-1:null;
  const moatColor = colorOf([
    sc(last.grossMargin, isTech?0.55:isRetail?0.30:0.40, isTech?0.35:isRetail?0.15:0.25),
    sc(last.roic, 0.15, 0.08),
    sc(last.roe, 0.20, 0.12),
    (g!=null&&g2!=null&&g>0&&g2>0)?2:(g!=null?(g>0?1:0):null),
  ]);
  const balanceColor = colorOf([
    last.debtEquity!=null?(last.debtEquity<=deGood?2:last.debtEquity<=deOk?1:0):null,
    sc(last.currentRatio, 2.0, 1.0),
  ]);
  const fcfRev = last.freeCashFlow&&last.revenue?last.freeCashFlow/last.revenue:null;
  const cashColor = colorOf([
    last.freeCashFlow!=null?(last.freeCashFlow>0?(fcfRev>=0.10?2:1):0):null,
    last.operatingCF!=null?(last.operatingCF>0?2:0):null,
  ]);
  const peFair=isTech?30:isHealth2?22:isFinance?15:20;
  const peOk  =isTech?45:isHealth2?35:isFinance?20:30;
  const valuationColor = colorOf([
    peRatio !=null?(peRatio <=peFair?2:peRatio <=peOk?1:0):null,
    evEbitda!=null?(evEbitda<=10   ?2:evEbitda<=18  ?1:0):null,
    pegRatio!=null?(pegRatio<=1    ?2:pegRatio<=2   ?1:0):null,
  ]);
  const cScore = {green:2,gold:1,red:0,gray:null};
  const dims = [profitColor,growthColor,moatColor,balanceColor,cashColor,valuationColor]
    .map(c=>cScore[c]).filter(v=>v!==null);
  if (!dims.length) return null;
  return Math.round(avg(dims)*50);
}

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

  // lite=1: same full pipeline, but strips byQuarter+description from response (see bottom)
  const isLite = req.query.lite === '1';

  try {
    const [income, cashflow, balance, keyMetrics, profile, analystEstimates, analystEstQ,
           incomeQ, cashflowQ, quote] = await Promise.all([
      fmp(`/income-statement?symbol=${symbol}&limit=5`),
      fmp(`/cash-flow-statement?symbol=${symbol}&limit=5`),
      fmp(`/balance-sheet-statement?symbol=${symbol}&limit=5`),
      fmp(`/key-metrics?symbol=${symbol}&limit=5`),
      fmp(`/profile?symbol=${symbol}`),
      fmp(`/analyst-estimates?symbol=${symbol}&limit=6&period=annual`),
      fmp(`/analyst-estimates?symbol=${symbol}&limit=6&period=quarter`),
      fmp(`/income-statement?symbol=${symbol}&limit=12&period=quarter`),
      fmp(`/cash-flow-statement?symbol=${symbol}&limit=12&period=quarter`),
      fmpV3(`/quote/${symbol}`),
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

    // ── Quarterly data ──────────────────────────────────────────────────────
    const byQuarter = [...incomeQ].reverse().map(q => {
      const period = q.period || '';
      const yr     = q.calendarYear || q.date?.slice(0,4) || '';
      const label  = period && yr ? `${period} ${yr.slice(2)}` : q.date?.slice(0,7) || '';
      const cf     = cashflowQ.find(r => r.date === q.date) || {};
      return {
        label,
        date: q.date,
        revenue:         q.revenue         ?? null,
        grossProfit:     q.grossProfit      ?? null,
        operatingIncome: q.operatingIncome  ?? null,
        netIncome:       q.netIncome        ?? null,
        eps:             q.eps              ?? null,
        ebitda:          q.ebitda           ?? null,
        operatingCF:     cf.operatingCashFlow  ?? null,
        freeCashFlow:    cf.freeCashFlow       ?? null,
        capex:           cf.capitalExpenditure ?? null,
        grossMargin:     div(q.grossProfit,    q.revenue),
        operatingMargin: div(q.operatingIncome,q.revenue),
        netMargin:       div(q.netIncome,      q.revenue),
      };
    });

    // ── Top-level valuation ──────────────────────────────────────────────────
    const latestKm = keyMetrics[0] || {};
    const topPE    = latestKm.earningsYield && latestKm.earningsYield > 0
      ? 1 / latestKm.earningsYield : null;
    const topPB    = div(latestKm.marketCap, (balance[0] || {}).totalStockholdersEquity);

    // ── Forward EPS estimates — sorted ascending by date ────────────────────
    const now       = new Date();
    const sortedEst = [...analystEstimates].sort((a,b) => new Date(a.date)-new Date(b.date));
    // Future estimates only (FY1 = nearest, FY2 = second nearest)
    const futureEst = sortedEst.filter(r => new Date(r.date) > now);
    const fwdEst    = futureEst[0] || null;  // FY1 — current year estimate
    const fwd2Est   = futureEst[1] || null;  // FY2 — next year estimate

    const latestActualEps = byYear[byYear.length - 1]?.eps;
    const prevActualEps   = byYear[byYear.length - 2]?.eps;

    // ── TTM EPS Growth (trailing YoY: latest actual vs prior actual) ─────────
    const ttmEpsGrowth = (latestActualEps != null && prevActualEps != null && prevActualEps !== 0)
      ? (latestActualEps - prevActualEps) / Math.abs(prevActualEps)
      : null;

    // ── Current year expected EPS growth (FY1 est vs latest actual) ──────────
    const fy1EpsGrowth = (fwdEst?.epsAvg && latestActualEps != null && latestActualEps !== 0)
      ? (fwdEst.epsAvg - latestActualEps) / Math.abs(latestActualEps)
      : null;

    // ── Next year expected EPS growth (FY2 est vs FY1 est) ───────────────────
    const fy2EpsGrowth = (fwd2Est?.epsAvg && fwdEst?.epsAvg && fwdEst.epsAvg !== 0)
      ? (fwd2Est.epsAvg - fwdEst.epsAvg) / Math.abs(fwdEst.epsAvg)
      : null;

    // ── Forward P/E (current price / FY1 EPS estimate) ───────────────────────
    // Price derived from P/E × current EPS (best proxy without live price endpoint)
    const currentPrice = (topPE != null && latestActualEps != null && latestActualEps > 0)
      ? topPE * latestActualEps : null;

    const forwardPE  = (currentPrice != null && fwdEst?.epsAvg  && fwdEst.epsAvg  > 0)
      ? currentPrice / fwdEst.epsAvg  : null;
    const forward2PE = (currentPrice != null && fwd2Est?.epsAvg && fwd2Est.epsAvg > 0)
      ? currentPrice / fwd2Est.epsAvg : null;

    // ── PEG Ratio — Forward analyst consensus (Peter Lynch: PEG = PE / fwd EPS growth%)
    let pegRatio = null;
    let pegNote  = null;

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
        if (yoy > 0) {
          pegRatio = topPE / (yoy * 100);
          pegNote  = 'Trailing YoY (no fwd estimates)';
        } else {
          pegRatio = null;
          pegNote  = 'N/A — negative EPS growth';
        }
      }
    }

    // ── Revenue growth estimates ─────────────────────────────────────────────
    const latestActualRev = byYear[byYear.length - 1]?.revenue;
    const prevActualRev   = byYear[byYear.length - 2]?.revenue;
    const ttmRevGrowth = (latestActualRev && prevActualRev && prevActualRev !== 0)
      ? (latestActualRev - prevActualRev) / Math.abs(prevActualRev) : null;

    const fwdRevEst  = futureEst[0] || null;
    const fwd2RevEst = futureEst[1] || null;
    const fy1RevGrowth = (fwdRevEst?.revenueAvg && latestActualRev && latestActualRev !== 0)
      ? (fwdRevEst.revenueAvg - latestActualRev) / Math.abs(latestActualRev) : null;
    const fy2RevGrowth = (fwd2RevEst?.revenueAvg && fwdRevEst?.revenueAvg && fwdRevEst.revenueAvg !== 0)
      ? (fwd2RevEst.revenueAvg - fwdRevEst.revenueAvg) / Math.abs(fwdRevEst.revenueAvg) : null;

    // ── NTM EPS growth (FY1 est vs TTM actual — same as fy1EpsGrowth alias) ──
    const ntmEpsGrowth = fy1EpsGrowth;

    // ── Quarterly EPS growth YoY (most recent Q vs same Q prior year) ────────
    const sortedQ = [...incomeQ].sort((a,b) => b.date.localeCompare(a.date));
    let qtrEpsGrowthYoY = null;
    if (sortedQ.length >= 5) {
      const qCurr = sortedQ[0]?.eps, qPrior = sortedQ[4]?.eps;
      if (qCurr != null && qPrior != null && qPrior !== 0)
        qtrEpsGrowthYoY = (qCurr - qPrior) / Math.abs(qPrior);
    }

    // ── 2-year stacked EPS growth ─────────────────────────────────────────────
    const stackEpsGrowth = (fy1EpsGrowth != null && ttmEpsGrowth != null)
      ? ((1 + fy1EpsGrowth) * (1 + ttmEpsGrowth) - 1) : null;

    // ── Quarterly revenue growth YoY ─────────────────────────────────────────
    let qtrRevGrowthYoY = null;
    if (sortedQ.length >= 5) {
      const rCurr = sortedQ[0]?.revenue, rPrior = sortedQ[4]?.revenue;
      if (rCurr != null && rPrior != null && rPrior !== 0)
        qtrRevGrowthYoY = (rCurr - rPrior) / Math.abs(rPrior);
    }

    // ── 2-year stacked revenue growth ────────────────────────────────────────
    const stackRevGrowth = (fy1RevGrowth != null && ttmRevGrowth != null)
      ? ((1 + fy1RevGrowth) * (1 + ttmRevGrowth) - 1) : null;

    // ── P/S ratio ─────────────────────────────────────────────────────────────
    const psRatio = latestKm.priceToSalesRatio ?? null;
    const forwardPS = (currentPrice != null && fwdRevEst?.revenueAvg && p.sharesOutstanding > 0)
      ? (currentPrice * p.sharesOutstanding) / fwdRevEst.revenueAvg : null;

    res.status(200).json({
      symbol,
      name: p.companyName || symbol, currency: p.currency || 'USD',
      sector: p.sector || null, industry: p.industry || null,
      marketCap: p.marketCap ?? latestKm.marketCap ?? null,
      peRatio: topPE, pbRatio: topPB,
      evEbitda: latestKm.evToEBITDA ?? null,
      pegRatio, pegNote,
      // Forward valuation
      forwardPE, forward2PE,
      // EPS growth
      ttmEpsGrowth, fy1EpsGrowth, fy2EpsGrowth,
      ntmEpsGrowth, qtrEpsGrowthYoY, stackEpsGrowth,
      // Revenue growth
      ttmRevGrowth, fy1RevGrowth, fy2RevGrowth,
      qtrRevGrowthYoY, stackRevGrowth,
      // P/S
      psRatio, forwardPS,
      // Raw estimates for reference
      fy1EpsEst: fwdEst?.epsAvg ?? null,
      fy2EpsEst: fwd2Est?.epsAvg ?? null,
      fy1Date: fwdEst?.date?.slice(0,7) ?? null,
      fy2Date: fwd2Est?.date?.slice(0,7) ?? null,
      beta: p.beta ?? null, dividendYield: p.lastDividend ?? null,
      priceAvg50: quote[0]?.priceAvg50 ?? null, priceAvg200: quote[0]?.priceAvg200 ?? null,
      yearHigh: quote[0]?.yearHigh ?? null, yearLow: quote[0]?.yearLow ?? null,
      currentPrice: quote[0]?.price ?? p.price ?? null,
      description: isLite ? undefined : (p.description || null),
      byYear,
      byQuarter,
      // Pre-computed health score included in lite mode so screener doesn't need to recalc
      healthScore: isLite ? computeHealthScore({ byYear, sector: p.sector, peRatio: topPE, pegRatio, evEbitda: latestKm.evToEBITDA ?? null }) : undefined,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, symbol });
  }
}
