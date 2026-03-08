import React, { useState, useMemo, useEffect, useCallback } from "react"; // v25-compare-fwd-metrics
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');`;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080c10; --surface: #0d1117; --surface2: #131920;
    --border: #1c2730; --border2: #243040;
    --text: #e8edf2; --text2: #7a8a98; --text3: #3d4f5e;
    --green: #00e5a0; --green-dim: rgba(0,229,160,0.10);
    --red: #ff4d6d;   --red-dim: rgba(255,77,109,0.10);
    --gold: #f0b429;  --blue: #4d9fff; --violet: #a78bfa;
  }
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; }
  .mono { font-family:'IBM Plex Mono',monospace; }
  .serif { font-family:'DM Serif Display',serif; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{opacity:0.4}50%{opacity:0.8}100%{opacity:0.4}}
  .fu{animation:fadeUp 0.35s ease both} .fu2{animation:fadeUp 0.35s 0.08s ease both}
  .fu3{animation:fadeUp 0.35s 0.16s ease both} .fu4{animation:fadeUp 0.35s 0.24s ease both}
  .ldot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  .spin{animation:spin 1s linear infinite}
  .shimmer{animation:shimmer 1.5s ease-in-out infinite}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text2);transition:all 0.15s;border:1px solid transparent}
  .nav-item:hover{color:var(--text);background:var(--surface2)}
  .nav-item.active{color:var(--green);background:var(--green-dim);border-color:rgba(0,229,160,0.15)}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:10px;transition:border-color 0.2s}
  .card:hover{border-color:var(--border2)}
  .pill{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.07em;padding:4px 10px;border-radius:4px;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--text3);transition:all 0.15s;font-weight:500}
  .pill:hover{color:var(--text2);border-color:var(--border2)}
  .tag{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.06em;padding:3px 8px;border-radius:3px;font-weight:500}
  .tag-green{background:var(--green-dim);color:var(--green)} .tag-red{background:var(--red-dim);color:var(--red)}
  .tag-gold{background:rgba(240,180,41,0.12);color:var(--gold)} .tag-gray{background:var(--surface2);color:var(--text2)}
  .tag-blue{background:rgba(77,159,255,0.12);color:var(--blue)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.06em;font-weight:500;cursor:pointer;transition:all 0.15s;border:none}
  .btn-primary{background:var(--green);color:#080c10} .btn-primary:hover{background:#00ffb3}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)} .btn-ghost:hover{color:var(--text);border-color:var(--text3)}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px);animation:fadeUp 0.2s ease}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:28px;width:440px;box-shadow:0 24px 80px rgba(0,0,0,0.6)}
  .inp{width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:6px;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:13px;padding:10px 12px;outline:none;transition:border 0.15s}
  .inp:focus{border-color:var(--green)} .inp::placeholder{color:var(--text3)}
  .trow{display:grid;grid-template-columns:2.2fr 0.8fr 1fr 1fr 1fr 0.8fr;align-items:center;padding:13px 18px;border-bottom:1px solid var(--border);transition:background 0.12s;cursor:pointer}
  .trow:hover{background:var(--surface2)} .trow:last-child{border-bottom:none}
  .btog{display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;transition:all 0.15s;font-family:'IBM Plex Mono',monospace;font-size:10px}
  .btog.on{border-color:rgba(0,229,160,0.3);background:var(--green-dim)} .btog.off{opacity:0.4}
  .ctt{background:var(--surface);border:1px solid var(--border2);border-radius:8px;padding:12px 16px;font-family:'IBM Plex Mono',monospace;font-size:11px;box-shadow:0 8px 32px rgba(0,0,0,0.5)}
  .logo-wrap{width:36px;height:36px;border-radius:9px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative}
  .logo-img{width:100%;height:100%;object-fit:cover;border-radius:9px}
  .logo-fallback{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .price-live{position:relative;display:inline-flex;align-items:center;gap:5px}
  .price-live::after{content:'';position:absolute;right:-10px;top:50%;transform:translateY(-50%);width:4px;height:4px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  /* ── Mobile ── */
  @media(max-width:768px){
    .sidebar{display:none!important}
    .main-scroll{padding:16px 14px 80px!important}
    .kpi-grid{grid-template-columns:1fr 1fr!important}
    .trow{grid-template-columns:1fr auto!important}
    .trow-qty,.trow-avg,.trow-pnl{display:none!important}
    .modal{width:calc(100vw - 32px)!important;padding:20px!important}
    .chart-bm-row{flex-wrap:wrap;gap:4px!important}
    .mobile-bottom-nav{display:flex!important}
    .page-header-actions{display:none!important}
  }
  @media(min-width:769px){
    .mobile-bottom-nav{display:none!important}
  }
  .mobile-bottom-nav{
    position:fixed;bottom:0;left:0;right:0;height:60px;
    background:var(--surface);border-top:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-around;
    z-index:50;padding:0 8px;
  }
  .mob-nav-btn{
    display:flex;flex-direction:column;align-items:center;gap:2px;
    padding:6px 12px;border-radius:8px;cursor:pointer;
    font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.06em;
    color:var(--text3);background:transparent;border:none;transition:all 0.15s;
    flex:1;
  }
  .mob-nav-btn.active{color:var(--green)}
  .mob-nav-btn span.icon{font-size:18px;line-height:1}
`;

// ── Positions config (prices fetched live) ──
const POSITIONS_CONFIG = [
  {id:1, symbol:"BTC",  name:"Bitcoin",               type:"crypto", coinId:"bitcoin",       qty:0.11, avgPrice:52000, broker:"Bitvavo",       color:"#f7931a"},
  {id:2, symbol:"ETH",  name:"Ethereum",              type:"crypto", coinId:"ethereum",      qty:1.4,  avgPrice:2800,  broker:"Bitvavo",       color:"#627eea"},
  {id:3, symbol:"SOL",  name:"Solana",                type:"crypto", coinId:"solana",        qty:12.5, avgPrice:90,    broker:"Bitvavo",       color:"#9945ff"},
  {id:4, symbol:"MSFT", name:"Microsoft",             type:"stock",  stockTicker:"MSFT",     qty:3,    avgPrice:380,   broker:"Smartbroker+",  color:"#00a4ef"},
  {id:5, symbol:"NVDA", name:"NVIDIA",                type:"stock",  stockTicker:"NVDA",     qty:5,    avgPrice:850,   broker:"Smartbroker+",  color:"#76b900"},
  {id:6, symbol:"VWCE", name:"Vanguard FTSE All-World",type:"etf",   stockTicker:"VWCE.AS",  qty:8,    avgPrice:105,   broker:"Smartbroker+",  color:"#e84142"},
  {id:7, symbol:"KO",   name:"Coca-Cola",             type:"stock",  stockTicker:"KO",       qty:10,   avgPrice:58,    broker:"Trade Republic", color:"#e63b2e"},
];

// ── Inline SVG logos (no external requests needed) ──
const LOGOS = {
  BTC: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path d="M22.3 13.9c.3-2.1-1.3-3.2-3.5-4l.7-2.8-1.7-.4-.7 2.7-1.4-.3.7-2.8-1.7-.4-.7 2.8-2.8-.7-.4 1.8s1.3.3 1.2.3c.7.2.8.6.8.9l-2 7.9c-.1.2-.3.5-.8.4l-1.2-.3-.9 1.9 2.7.7-.7 2.9 1.7.4.7-2.9 1.4.3-.7 2.9 1.7.4.7-2.9c2.9.5 5.1.3 6-2.3.8-2-.04-3.2-1.5-3.9 1.1-.3 1.9-1 2.1-2.5zm-3.7 5.2c-.6 2.3-4.4 1.1-5.7.8l1-4c1.2.3 5.2.9 4.7 3.2zm.6-5.3c-.5 2.1-3.7 1-4.7.8l.9-3.7c1 .3 4.3.7 3.8 2.9z" fill="white"/>
    </svg>
  ),
  ETH: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <path d="M16 5v8.3l7 3.1L16 5z" fill="white" fillOpacity=".6"/>
      <path d="M16 5L9 16.4l7-3.1V5z" fill="white"/>
      <path d="M16 21.9v5.1l7-9.7-7 4.6z" fill="white" fillOpacity=".6"/>
      <path d="M16 27v-5.1l-7-4.6 7 9.7z" fill="white"/>
      <path d="M16 20.6l7-4.2-7-3.1v7.3z" fill="white" fillOpacity=".2"/>
      <path d="M9 16.4l7 4.2v-7.3l-7 3.1z" fill="white" fillOpacity=".6"/>
    </svg>
  ),
  SOL: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="16" cy="16" r="16" fill="#9945FF"/>
      <path d="M9 20.5h11.5c.2 0 .3.1.2.2l-1.5 1.8c-.1.1-.2.2-.4.2H7.3c-.2 0-.3-.1-.2-.2L8.6 20.7c.1-.1.3-.2.4-.2zM9 13.3h11.5c.2 0 .3.1.2.2l-1.5 1.8c-.1.1-.2.2-.4.2H7.3c-.2 0-.3-.1-.2-.2l1.5-1.8c.1-.1.3-.2.4-.2zM20.5 9.5c.1-.1.2-.2.4-.2H23c.2 0 .3.1.2.2l-1.5 1.8c-.1.1-.3.2-.4.2H7.3c-.2 0-.3-.1-.2-.2l1.5-1.8c.1-.1.3-.2.4-.2h11.5z" fill="white"/>
    </svg>
  ),
  MSFT: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <rect x="3" y="3" width="12" height="12" fill="#F25022"/>
      <rect x="17" y="3" width="12" height="12" fill="#7FBA00"/>
      <rect x="3" y="17" width="12" height="12" fill="#00A4EF"/>
      <rect x="17" y="17" width="12" height="12" fill="#FFB900"/>
    </svg>
  ),
  NVDA: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <rect width="32" height="32" rx="6" fill="#76B900"/>
      <path d="M7 12.5v7h2.5v-4.8l2.3 4.8H14l2.3-4.8v4.8H19v-7h-3.5L13 17.8l-2.5-5.3H7zm13 0v7h7v-2H22.5v-1H27v-2h-4.5v-.8H27v-1.2h-7z" fill="white"/>
    </svg>
  ),
  KO: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="16" cy="16" r="16" fill="#E63B2E"/>
      <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="#E63B2E"/>
      <path d="M11 13.5c1.5-1 3.5-.5 4.5 1 .5.8.6 1.7.4 2.5 2-1.5 3-1 3.5-.3.6 1-.2 2.5-1.8 3-1 .4-2 .2-2.7-.3-.5 1.3-1.8 2.1-3.2 1.8-1.8-.4-2.7-2.3-2-4 .3-.9 1-1.5 1.8-1.7zm1 1.2c-.8.2-1.3 1-1.1 1.8.2.8 1 1.2 1.8 1 .5-.1.9-.5 1.1-1-.5-.6-.7-1.3-.5-1.8-.4-.2-.9-.2-1.3 0z" fill="white"/>
    </svg>
  ),
  VWCE: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="16" cy="16" r="16" fill="#C6253F"/>
      <path d="M8 10h3.5l4.5 9 4.5-9H24l-7 13L8 10z" fill="white"/>
    </svg>
  ),
};

function getLogoSVG(symbol) { return LOGOS[symbol] || null; }

const BROKERS_LIST  = ["Bitvavo","Smartbroker+","Trade Republic"];
const BENCHMARKS    = [
  {id:"sp500", label:"S&P 500",   color:"#4d9fff"},
  {id:"nasdaq",label:"Nasdaq 100",color:"#f0b429"},
  {id:"dax",   label:"DAX",       color:"#a78bfa"},
  {id:"btc",   label:"BTC",       color:"#f7931a"},
];
const RANGES        = ["1M","3M","6M","YTD","1Y","ALL"];
const RANGE_MONTHS  = {"1M":1,"3M":3,"6M":6,"YTD":2,"1Y":12,"ALL":999};
const ALLOC_COLORS  = ["#00e5a0","#627eea","#f7931a","#9945ff","#f0b429","#76b900","#e84142"];
const BROKERS_OPT   = ["Bitvavo","Smartbroker+","Trade Republic","Manual"];
const ASSET_TYPES   = ["stock","etf","crypto"];
const NAV_ITEMS     = [
  {id:"dashboard",label:"Dashboard",icon:"⬡"},
  {id:"portfolio",label:"Portfolio", icon:"◈"},
  {id:"screener", label:"Screener",  icon:"⊞"},
  {id:"compare",  label:"Compare",   icon:"⇌"},
  {id:"news",     label:"News Feed", icon:"◎"},
  {id:"settings", label:"Settings",  icon:"⚙"},
];

// ── Chart helpers ──
// Seeded PRNG — no sine waves
function seededRand(seed) {
  let s = seed * 9301 + 49297;
  return () => { s=(s*9301+49297)%233280; return s/233280; };
}

function buildChart(months, positions, activeBrokers, activeBenchmarks, transactions) {
  const vis = positions.filter(p=>activeBrokers[p.broker]);
  const totalCost    = vis.reduce((s,p)=>s+p.qty*p.avgPrice,0);
  const totalCurrent = vis.reduce((s,p)=>s+p.qty*p.currentPrice,0);
  if(!totalCurrent) return [];

  const now   = new Date(2026,2,7);
  const start = new Date(now);
  start.setMonth(start.getMonth()-months);
  const totalDays = Math.round((now-start)/(86400000));

  // Build invested staircase from transactions (if available)
  const hasTx = Array.isArray(transactions) && transactions.length>0;
  const investedByDay = new Array(totalDays+1).fill(0);
  if(hasTx) {
    let running = 0;
    const sorted = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));
    const startStr = start.toISOString().slice(0,10);
    // Sum up pre-window transactions as starting invested
    sorted.filter(t=>t.date<startStr).forEach(t=>{ running+=(t.type==='buy'?t.amountEur:-t.amountEur); });
    let dayRunning = running;
    let txIdx = 0;
    const inWindow = sorted.filter(t=>t.date>=startStr);
    for(let i=0;i<=totalDays;i++){
      const d=new Date(start); d.setDate(d.getDate()+i);
      const ds=d.toISOString().slice(0,10);
      while(txIdx<inWindow.length&&inWindow[txIdx].date<=ds){
        const t=inWindow[txIdx++];
        dayRunning+=(t.type==='buy'?t.amountEur:-t.amountEur);
      }
      investedByDay[i]=Math.max(0,dayRunning);
    }
  } else {
    investedByDay.fill(totalCost);
  }

  // Random-walk portfolio — anchored to totalCurrent at end
  const rPort = seededRand(42);
  const portByDay = new Array(totalDays+1);
  const startInvested = investedByDay[0]||totalCost||1;
  portByDay[0] = startInvested * 0.97;
  for(let i=1;i<=totalDays;i++){
    const inv = investedByDay[i]||startInvested;
    const prev = portByDay[i-1];
    const drift = 0.00045;
    const shock = rPort()<0.04?(rPort()-0.5)*0.06:0;
    const noise = (rPort()-0.487)*0.018+shock;
    // Blend toward invested ratio when it changes
    const invRatio = inv/startInvested;
    portByDay[i] = prev*(1+drift+noise)*invRatio/((investedByDay[i-1]||startInvested)/startInvested);
  }
  // Scale so last value = totalCurrent
  const scale = totalCurrent/(portByDay[totalDays]||1);
  for(let i=0;i<=totalDays;i++) portByDay[i]=+(portByDay[i]*scale).toFixed(2);

  // Benchmarks — independent random walks from same startInvested base
  const bmCfg = {
    sp500:{drift:0.00055,vol:0.012,seed:21},
    nasdaq:{drift:0.00072,vol:0.016,seed:37},
    dax:  {drift:0.00042,vol:0.013,seed:53},
    btc:  {drift:0.0015, vol:0.045,seed:71},
  };
  const bmSeries = {};
  activeBenchmarks.forEach(id=>{
    const c=bmCfg[id]||{drift:0.0005,vol:0.015,seed:99};
    const r=seededRand(c.seed);
    const vals=new Array(totalDays+1);
    vals[0]=startInvested;
    for(let i=1;i<=totalDays;i++){
      const shock=r()<0.04?(r()-0.5)*c.vol*3:0;
      vals[i]=vals[i-1]*(1+c.drift+(r()-0.487)*c.vol+shock);
    }
    bmSeries[id]=vals;
  });

  // Sample every N days to keep chart fast
  const step = Math.max(1,Math.floor(totalDays/180));
  const rows=[];
  for(let i=0;i<=totalDays;i+=step){
    const d=new Date(start); d.setDate(d.getDate()+i);
    const row={
      date:d.toLocaleDateString("de-DE",{day:"2-digit",month:"short"}),
      portfolio:portByDay[i],
      invested:+investedByDay[i].toFixed(0),
    };
    activeBenchmarks.forEach(id=>{ row[id]=+(bmSeries[id][i]).toFixed(0); });
    rows.push(row);
  }
  return rows;
}

// ── Logo component — inline SVG, no external requests ──
// Logo domain map for clearbit
const LOGO_DOMAINS = {
  AAPL:'apple.com', MSFT:'microsoft.com', GOOGL:'google.com', GOOG:'google.com',
  AMZN:'amazon.com', META:'meta.com', NVDA:'nvidia.com', TSLA:'tesla.com',
  JPM:'jpmorganchase.com', GS:'goldmansachs.com', SHOP:'shopify.com',
  COIN:'coinbase.com', AVGO:'broadcom.com', QCOM:'qualcomm.com',
  HUBS:'hubspot.com', TTD:'thetradedesk.com', NFLX:'netflix.com',
  ORCL:'oracle.com', ADBE:'adobe.com', CRM:'salesforce.com', AMD:'amd.com',
  INTC:'intel.com', PYPL:'paypal.com', DIS:'disney.com', V:'visa.com',
  MA:'mastercard.com', WMT:'walmart.com', PG:'pg.com', JNJ:'jnj.com',
  XOM:'exxonmobil.com', CVX:'chevron.com', BAC:'bankofamerica.com',
  WFC:'wellsfargo.com', MRNA:'modernatx.com', PFE:'pfizer.com',
  KO:'coca-cola.com', PEP:'pepsico.com', MCD:'mcdonalds.com',
  SBUX:'starbucks.com', NKE:'nike.com', ABNB:'airbnb.com',
  UBER:'uber.com', LYFT:'lyft.com', SNAP:'snap.com', TWTR:'twitter.com',
  BILI:'bilibili.com', BABA:'alibaba.com', TCEHY:'tencent.com',
  SPY:'ssga.com', QQQ:'invesco.com', GLD:'spdrgoldshares.com',
  IVV:'ishares.com', VTI:'vanguard.com',
};
const CRYPTO_LOGOS = {
  BTC:'bitcoin', ETH:'ethereum', SOL:'solana', BNB:'binance-coin',
  XRP:'xrp', ADA:'cardano', DOT:'polkadot', MATIC:'polygon',
  AVAX:'avalanche', LINK:'chainlink', UNI:'uniswap', AAVE:'aave',
};
function AssetLogo({pos, size=36}) {
  const r = Math.round(size * 0.25);
  const resolvedTicker = pos.fmpTicker?.split('.')[0] || ISIN_MAP[pos.isin] || pos.symbol?.split('.')[0];
  const baseSymbol = resolvedTicker?.toUpperCase();
  // Use key on inner component so state resets when ticker changes
  return <AssetLogoInner key={baseSymbol} baseSymbol={baseSymbol} pos={pos} size={size} r={r} />;
}
function AssetLogoInner({baseSymbol, pos, size, r}) {
  const [imgErr, setImgErr] = React.useState(false);
  const domain = LOGO_DOMAINS[baseSymbol];

  // Crypto: use CoinGecko asset logos
  if (pos.type === 'crypto' && CRYPTO_LOGOS[baseSymbol] && !imgErr) {
    const url = `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`
      .replace('1/small/bitcoin', (() => {
        const m = {BTC:'1/small/bitcoin',ETH:'279/small/ethereum',SOL:'4128/small/solana',BNB:'825/small/binance-coin',XRP:'44/small/xrp-symbol-white-128',ADA:'975/small/cardano',DOT:'12171/small/polkadot',MATIC:'4713/small/matic-token',AVAX:'12559/small/avalanche-2',LINK:'877/small/chainlink-new-logo',UNI:'12504/small/uni',AAVE:'7279/small/aave-v3-logo'};
        return m[baseSymbol] || '1/small/bitcoin';
      })());
    return (
      <div style={{width:size,height:size,borderRadius:r,overflow:'hidden',flexShrink:0,background:'#1a1a2e'}}>
        <img src={url} width={size} height={size} style={{objectFit:'cover'}}
          onError={()=>setImgErr(true)}/>
      </div>
    );
  }

  // Stocks/ETFs: use logo.dev
  if (domain && !imgErr) {
    return (
      <div style={{width:size,height:size,borderRadius:r,overflow:'hidden',flexShrink:0,background:'#fff',border:'1px solid rgba(255,255,255,0.08)'}}>
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} width={size} height={size}
          style={{objectFit:'cover'}} onError={()=>setImgErr(true)}/>
      </div>
    );
  }

  // Fallback: colored ticker badge
  const svg = getLogoSVG(pos.symbol);
  if (svg) return (
    <div style={{width:size,height:size,borderRadius:r,flexShrink:0,background:`${pos.color}15`,border:`1px solid ${pos.color}33`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      {svg}
    </div>
  );
  return (
    <div style={{width:size,height:size,borderRadius:r,background:`${pos.color}22`,border:`1px solid ${pos.color}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <span className="mono" style={{fontSize:size*0.25,color:pos.color,fontWeight:700}}>{pos.symbol.slice(0,4)}</span>
    </div>
  );
}

// ── Price badge ──
function PriceBadge({loading}) {
  if (!loading) return null;
  return <span className="mono shimmer" style={{fontSize:9,color:"var(--text3)",marginLeft:6}}>fetching live prices…</span>;
}

function PieTooltip({active, payload}) {
  if(!active||!payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:6,padding:"7px 11px",fontFamily:"IBM Plex Mono",fontSize:11,pointerEvents:"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <div style={{width:8,height:8,borderRadius:2,background:d.payload.color,flexShrink:0}}/>
        <span style={{color:"var(--text)",fontWeight:600}}>{d.name}</span>
        <span style={{color:"var(--text2)",marginLeft:4}}>{d.value.toFixed(1)}%</span>
      </div>
    </div>
  );
}
function MiniPie({data}) {
  const [activeIdx, setActiveIdx] = React.useState(null);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="52%" outerRadius="78%"
          dataKey="value" paddingAngle={2}
          onMouseEnter={(_,i)=>setActiveIdx(i)} onMouseLeave={()=>setActiveIdx(null)}>
          {data.map((e,i)=>(
            <Cell key={i} fill={e.color} stroke="none" opacity={activeIdx===null||activeIdx===i?1:0.35}/>
          ))}
        </Pie>
        <Tooltip content={<PieTooltip/>}/>
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartTip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return (
    <div className="ctt">
      <div style={{color:"var(--text3)",marginBottom:8,fontSize:10,letterSpacing:"0.08em"}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:20,marginBottom:3}}>
          <span style={{color:p.color,display:"flex",alignItems:"center",gap:5}}>
            <span style={{display:"inline-block",width:6,height:6,borderRadius:2,background:p.color}}/>
            {p.name}
          </span>
          <span style={{color:"var(--text)",fontWeight:600}}>€{Number(p.value).toLocaleString("de-DE",{maximumFractionDigits:0})}</span>
        </div>
      ))}
    </div>
  );
}

// ── EUR/USD rate fallback ──
const EUR_USD = 1.085;

// ── AI News Feed ──────────────────────────────────────────────
const SENTIMENT_STYLE = {
  bullish:  { color:"#00e5a0", bg:"rgba(0,229,160,0.10)",  border:"rgba(0,229,160,0.25)",  label:"BULLISH"  },
  bearish:  { color:"#ff4d6d", bg:"rgba(255,77,109,0.10)", border:"rgba(255,77,109,0.25)", label:"BEARISH"  },
  neutral:  { color:"#7a8a98", bg:"rgba(122,138,152,0.10)",border:"rgba(122,138,152,0.2)", label:"NEUTRAL"  },
};

function NewsCard({ item, index }) {
  const s = SENTIMENT_STYLE[item.sentiment] || SENTIMENT_STYLE.neutral;
  return (
    <div className="card" style={{
      padding:"18px 20px", animation:`fadeUp 0.3s ${index*0.06}s ease both`,
      borderLeft:`3px solid ${s.color}`,
    }}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {item.tickers.map(t=>(
            <span key={t} className="mono" style={{fontSize:10,padding:"2px 8px",borderRadius:3,background:"var(--surface2)",color:"var(--text2)",border:"1px solid var(--border2)"}}>{t}</span>
          ))}
          <span className="mono" style={{fontSize:10,padding:"2px 8px",borderRadius:3,background:s.bg,color:s.color,border:`1px solid ${s.border}`}}>{s.label}</span>
        </div>
        <span className="mono" style={{fontSize:9,color:"var(--text3)",whiteSpace:"nowrap",flexShrink:0}}>{item.time}</span>
      </div>
      <div style={{fontSize:14,fontWeight:500,color:"var(--text)",lineHeight:1.5,marginBottom:8}}>{item.headline}</div>
      <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6,marginBottom:10}}>{item.summary}</div>
      <div className="mono" style={{fontSize:10,color:"var(--text3)"}}>{item.source}</div>
    </div>
  );
}

function NewsFeed({ positions }) {
  const [selectedTicker, setSelectedTicker] = useState("ALL");
  const [newsItems, setNewsItems]           = useState([]);
  const [loading, setLoading]               = useState(false);
  const [fetched, setFetched]               = useState(false);
  const [error, setError]                   = useState(null);

  const tickers = ["ALL", ...positions.map(p=>p.symbol)];

  const fetchNews = useCallback(async (ticker) => {
    setLoading(true);
    setError(null);
    setNewsItems([]);
    const watchlist = ticker === "ALL"
      ? positions.map(p=>`${p.symbol} (${p.name})`).join(", ")
      : `${ticker} (${positions.find(p=>p.symbol===ticker)?.name||ticker})`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1800,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          system: `You are a financial news assistant for European retail investors. 
Your job is to find and summarize the LATEST real news for the given assets.
Search for recent news (last 7 days) for each asset. 
Return ONLY a JSON array, no preamble, no markdown fences.
Each item must have exactly these fields:
{
  "headline": "string (concise, max 12 words)",
  "summary": "string (2 sentences max, investor-relevant insight)",
  "tickers": ["array of ticker symbols this news relates to"],
  "sentiment": "bullish|bearish|neutral",
  "source": "Source Name",
  "time": "X hours ago or X days ago"
}
Return 6-8 items total. Prioritize market-moving news. RETURN ONLY THE JSON ARRAY.`,
          messages:[{
            role:"user",
            content:`Search for and summarize the latest financial news for this watchlist: ${watchlist}. Focus on price-moving developments, earnings, regulatory news, and macro factors relevant to each asset. Return the JSON array only.`
          }]
        })
      });

      const data = await res.json();
      const fullText = data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean = fullText.replace(/```json|```/g,"").trim();
      const start = clean.indexOf("["), end = clean.lastIndexOf("]");
      const parsed = JSON.parse(clean.slice(start, end+1));
      setNewsItems(parsed);
    } catch(e) {
      setError("Could not load news. Please try again.");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [positions]);

  function handleTickerClick(t) {
    setSelectedTicker(t);
    fetchNews(t);
  }

  return (
    <div className="fu">
      {/* Header row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <div className="serif" style={{fontSize:22,letterSpacing:"-0.02em"}}>News Feed</div>
          <div className="mono" style={{fontSize:10,color:"var(--text3)",marginTop:3}}>AI-powered · filtered to your positions · web search enabled</div>
        </div>
        {fetched && !loading && (
          <button className="btn btn-ghost" onClick={()=>fetchNews(selectedTicker)} style={{fontSize:10}}>↻ Refresh</button>
        )}
      </div>

      {/* Ticker filters */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
        {tickers.map(t=>{
          const pos = positions.find(p=>p.symbol===t);
          const active = selectedTicker===t;
          return (
            <button key={t} onClick={()=>handleTickerClick(t)}
              style={{
                display:"flex",alignItems:"center",gap:6,
                padding:"6px 12px",borderRadius:6,cursor:"pointer",
                fontFamily:"IBM Plex Mono,monospace",fontSize:11,fontWeight:500,
                border:`1px solid ${active?"rgba(0,229,160,0.35)":pos?`${pos.color}33`:"var(--border)"}`,
                background:active?"var(--green-dim)":pos?`${pos.color}0d`:"transparent",
                color:active?"var(--green)":pos?pos.color:"var(--text2)",
                transition:"all 0.15s"
              }}>
              {t!=="ALL" && pos && (
                <span style={{fontSize:9,opacity:0.8}}>{t}</span>
              )}
              {t==="ALL" ? "ALL POSITIONS" : pos?.name||t}
            </button>
          );
        })}
      </div>

      {/* Empty state — not yet fetched */}
      {!fetched && !loading && (
        <div className="card" style={{padding:56,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:16}}>📰</div>
          <div className="serif" style={{fontSize:20,color:"var(--text2)",marginBottom:8}}>Ready to fetch news</div>
          <div style={{fontSize:13,color:"var(--text3)",marginBottom:24,maxWidth:340,margin:"0 auto 24px"}}>
            Select a position above or click below to load AI-curated news for all your holdings
          </div>
          <button className="btn btn-primary" onClick={()=>handleTickerClick("ALL")}>
            Load news for all positions
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[...Array(6)].map((_,i)=>(
            <div key={i} className="card shimmer" style={{padding:"18px 20px",height:140,borderLeft:"3px solid var(--border2)"}}/>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card" style={{padding:32,textAlign:"center",borderColor:"var(--red-dim)"}}>
          <div style={{color:"var(--red)",marginBottom:8,fontSize:13}}>{error}</div>
          <button className="btn btn-ghost" onClick={()=>fetchNews(selectedTicker)}>Try again</button>
        </div>
      )}

      {/* News grid */}
      {!loading && newsItems.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {newsItems.map((item,i)=><NewsCard key={i} item={item} index={i}/>)}
        </div>
      )}
    </div>
  );
}

// ── CSV Import Modal ──────────────────────────────────────────
// Smartbroker+ activity CSV parser
function parseSmartbrokerActivity(rows, headers) {
  const hi = k => headers.findIndex(h => new RegExp(k,'i').test(h));
  const iType=hi('transaktionstyp'), iISIN=hi('isin'), iName=hi('name 1|name1');
  const iQty=hi('stücke|stucke'), iAmount=hi('anlagebetrag in kontow');
  const iDate=hi('valutadatum'), iStatus=hi('status');
  const pd = s => parseFloat(String(s||'').trim().replace(/\./g,'').replace(',','.')) || 0;
  return rows
    .filter(r => {
      const status=(r[iStatus]||'').trim().toUpperCase();
      const type=(r[iType]||'').trim().toUpperCase();
      return status==='CONFIRMED'&&(type==='BUY'||type==='SELL'||type==='BUY_SAVINGSPLAN');
    })
    .map(r => ({
      date: (r[iDate]||'').trim(),
      type: (r[iType]||'').toUpperCase().includes('SELL')?'sell':'buy',
      amountEur: Math.abs(pd(r[iAmount])),
      isin: (r[iISIN]||'').trim(),
      name: (r[iName]||'').trim(),
      qty: pd(r[iQty]),
    }))
    .filter(t=>t.date&&t.amountEur>0);
}
function isSmartbrokerActivity(headers) {
  return headers.some(h=>/transaktionstyp/i.test(h)) && headers.some(h=>/valutadatum/i.test(h));
}

const BROKER_FORMATS = {
  bitvavo: {
    name: "Bitvavo", color: "#1a6aff",
    detect: (headers) => headers.some(h => /market|side|amount|currency/i.test(h)),
    parse: (rows, headers) => {
      // Bitvavo format: Date, Market (BTC-EUR), Side (buy/sell), Amount, Price, Total, Fee
      const h = k => headers.findIndex(h => new RegExp(k,"i").test(h));
      const iMarket=h("market"), iSide=h("side|type"), iAmt=h("^amount"), iPrice=h("price"), iDate=h("date|time");
      return rows.filter(r=>r[iSide]?.toLowerCase()==="buy").reduce((acc,r)=>{
        const parts = (r[iMarket]||"").split("-");
        const symbol = parts[0]?.toUpperCase();
        if (!symbol) return acc;
        const qty = parseFloat(r[iAmt])||0;
        const price = parseFloat(r[iPrice])||0;
        const ex = acc.find(p=>p.symbol===symbol);
        if (ex) { ex.avgPrice=(ex.avgPrice*ex.qty+price*qty)/(ex.qty+qty); ex.qty+=qty; }
        else acc.push({symbol,name:symbol,type:"crypto",qty,avgPrice:price,currentPrice:price,broker:"Bitvavo",color:"#1a6aff"});
        return acc;
      },[]);
    }
  },
  smartbroker: {
    name: "Smartbroker+", color: "#00a4ef",
    detect: (headers) => headers.some(h => /kundennummer|depotnummer|einstandskurs|marktkurs|stücke|kürzel/i.test(h)),
    parse: (rows, headers) => {
      // Smartbroker+ depot snapshot format
      // Columns: DATUM,KUNDENNUMMER,DEPOTNUMMER,ISIN,WKN,KÜRZEL,NAME 1,NAME 2,ASSETKLASSE,STÜCKE,
      //          EINSTANDSKURS PRO STÜCK,MARKTKURS PRO STÜCK,EINSTANDSWERT,MARKTWERT,...,WÄHRUNG,...
      const hi = k => headers.findIndex(h => new RegExp(k,"i").test(h));
      const iISIN    = hi("isin");
      const iKuerzel = hi("kürzel|kurzel");
      const iName1   = hi("name 1|name1");
      const iName2   = hi("name 2|name2");
      const iKlasse  = hi("assetklasse");
      const iQty     = hi("stücke|stucke");
      const iAvg     = hi("einstandskurs pro|einstandskurs");
      const iCurrent = hi("marktkurs pro|marktkurs");
      const iWaehrung= hi("währung|wahrung");

      // German number format: "1.234,56" → 1234.56
      const parseDE = s => {
        if (!s) return 0;
        return parseFloat(s.replace(/\./g,"").replace(",",".")) || 0;
      };

      const typeMap = {
        "aktien": "stock", "etfs": "etf", "etf": "etf",
        "derivate": "derivative", "fonds": "etf", "anleihen": "stock"
      };

      return rows.reduce((acc, r) => {
        const isin    = (r[iISIN]    || "").trim();
        const kuerzel = (r[iKuerzel] || "").trim();
        const name    = (r[iName1]   || "").trim();
        const klasse  = (r[iKlasse]  || "").toLowerCase().trim();
        const qty     = parseDE(r[iQty]);
        const avg     = parseDE(r[iAvg]);
        const current = parseDE(r[iCurrent]);

        if (!isin || !qty) return acc;

        // Always use ISIN as the canonical symbol — KÜRZEL is a display name only
        const symbol = isin;
        const displaySymbol = (kuerzel && !isISIN(kuerzel)) ? kuerzel.toUpperCase() : null;

        const rawType = typeMap[klasse] || "stock";
        const knownTicker = ISIN_MAP[isin];
        const type = inferType(knownTicker, isin, name, rawType);

        const ex = acc.find(p => p.isin === isin || p.symbol === symbol);
        if (ex) {
          ex.avgPrice = (ex.avgPrice * ex.qty + avg * qty) / (ex.qty + qty);
          ex.qty += qty;
        } else {
          acc.push({
            symbol,
            displaySymbol,
            name,
            type,
            qty,
            avgPrice: avg,
            currentPrice: current,
            broker: "Smartbroker+",
            color: "#00a4ef",
            isin,
          });
        }
        return acc;
      }, []);
    }
  },
  traderepublic: {
    name: "Trade Republic", color: "#e63b2e",
    detect: (headers) => headers.some(h => /isin|shares|share price|asset/i.test(h)),
    parse: (rows, headers) => {
      const h = k => headers.findIndex(h => new RegExp(k,"i").test(h));
      const iAsset=h("asset|name|titel|security"), iQty=h("shares|amount|anzahl|qty|stück"), iPrice=h("price|kurs|avg"), iType=h("type|typ|status");
      return rows.filter(r=>/buy|kauf/i.test(r[iType]||"")).reduce((acc,r)=>{
        const symbol=(r[iAsset]||"").toUpperCase().trim().split(" ")[0];
        if(!symbol) return acc;
        const qty=parseFloat((r[iQty]||"").replace(",","."))||0;
        const price=parseFloat((r[iPrice]||"").replace(",","."))||0;
        const ex=acc.find(p=>p.symbol===symbol);
        if(ex){ex.avgPrice=(ex.avgPrice*ex.qty+price*qty)/(ex.qty+qty);ex.qty+=qty;}
        else acc.push({symbol,name:r[iAsset]||symbol,type:"stock",qty,avgPrice:price,currentPrice:price,broker:"Trade Republic",color:"#e63b2e"});
        return acc;
      },[]);
    }
  },
  generic: {
    name: "Generic CSV", color: "#7a8a98",
    detect: () => true,
    parse: (rows, headers) => {
      const h = k => headers.findIndex(h => new RegExp(k,"i").test(h));
      const iSymbol=h("symbol|ticker|asset|coin"), iName=h("name"), iQty=h("qty|quantity|amount|shares|stück"), iPrice=h("price|avg|kurs"), iType=h("type|typ");
      return rows.reduce((acc,r)=>{
        const symbol=(r[iSymbol]||"").toUpperCase().trim();
        if(!symbol||symbol==="SYMBOL") return acc;
        const qty=parseFloat((r[iQty]||"").replace(",","."))||0;
        const price=parseFloat((r[iPrice]||"").replace(",","."))||0;
        if(!qty||!price) return acc;
        const rawT=/crypto|btc|eth|sol/i.test(r[iType]||symbol)?'crypto':'stock';
        const type=inferType(symbol,'',r[iName]||'',rawT);
        const ex=acc.find(p=>p.symbol===symbol);
        if(ex){ex.avgPrice=(ex.avgPrice*ex.qty+price*qty)/(ex.qty+qty);ex.qty+=qty;}
        else acc.push({symbol,name:r[iName]||symbol,type,qty,avgPrice:price,currentPrice:price,broker:"Generic",color:"#7a8a98"});
        return acc;
      },[]);
    }
  }
};

const ALLOC_COLORS_EXT = ["#00e5a0","#627eea","#f7931a","#9945ff","#f0b429","#76b900","#e84142","#4d9fff","#a78bfa","#ff4d6d"];

// ISIN detection
const isISIN = s => /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s);

// Known ISINs for instant resolution without API call
const ISIN_MAP = {
  "US0378331005":"AAPL","US5949181045":"MSFT","US02079K3059":"GOOGL",
  "US0231351067":"AMZN","US30303M1027":"META","US88160R1014":"TSLA",
  "US67066G1040":"NVDA","US4592001014":"IBM","US4581401001":"INTC",
  "US9311421039":"WMT","US0970231058":"BA","US1667641005":"CHTR",
  "US46625H1005":"JPM","US38141G1040":"GS","US0605051046":"BAC",
  "US9042141039":"WFC","US46080Q1031":"JNJ","US7427181091":"PFE",
  "US58933Y1055":"MRK","US4781601046":"JNJ","US2546871060":"DIS",
  "US1912161007":"AMZN","US7132711086":"PEP","US8923561067":"MCD",
  "US9197941076":"V","US69343P1057":"MA","US0258161092":"AXP",
  "US02209S1033":"AMD","US00724F1012":"ABNB","US09175A2069":"BKNG",
  "US83406F1021":"SNOW","US8522341036":"SHOP","US86800U3023":"SQ",
  "US88023B1035":"TTD","US6974351057":"PTON","US6323071042":"NFLX",
  "US6541061031":"NDAQ","US15118V2079":"COIN",
  "US88339J1051":"TTD",
  "US44922N1037":"HUBS",
  "US7960508882":"QCOM",
  "US9229085538":"VTI",
  "US4642875987":"IVV",
  "US81369Y8030":"GLD",
  "US78462F1030":"SPY",
  "US46090E1038":"QQQ",
  "US1255231003":"AVGO",
  "US19260Q1076":"COIN","US5011471027":"LLY",
  "US4523271090":"IRM","US26856L1035":"EA","US14888U1016":"C",
  "US11135F1012":"BRKA","US03945R1023":"ARBK","US72352L1061":"PINS",
  "US79466L3024":"SHOP","US30231G1022":"XOM","US1247531029":"CB",
  // EU stocks
  "DE0007164600":"SAP","DE0005140008":"DBK","DE0005552004":"DTE",
  "DE0007236101":"SIE","DE0008404005":"ALV","DE0005190003":"BMW",
  "DE0007100000":"DAI","DE0006231004":"INF","DE0008232125":"LHA",
  "DE000BASF111":"BAS","DE0005493105":"FRE","DE0007031040":"VOW3",
  "NL0010273215":"ASML","GB0007188757":"BP","GB0009252882":"GSK",
  "GB00B10RZP78":"ULVR","FR0000131104":"BNP","FR0000120578":"SAN",
  "CH0012221716":"ABB","CH0012138605":"CSGN","CH0244767585":"UBS",
  // Common ETFs
  "IE00B4L5Y983":"IWDA","IE00B5BMR087":"CSPX","IE00BKM4GZ66":"EIMI",
  "IE00B4JNQZ49":"VEUR","IE00B4KBBD01":"VNRT","IE00BYXYX521":"VWCE",
  "IE00B3RBWM25":"VWRL","DE000A0S9GB0":"EXS1","DE000ETFL037":"EL4A",
  "IE000AON7ET1":"XDWH","IE000YDOORK7":"XDWS","IE00BMFKG444":"XMAW",
  "JE00BQRFDY49":"XDWD","CH0334081137":"CSIF","CA74767K1030":"QEC",
};

// Known ETF tickers — used to correct type after ISIN resolution
const ETF_TICKERS = new Set([
  'SPY','QQQ','IVV','VTI','VOO','GLD','SLV','VEA','VWO','EFA','AGG','BND',
  'LQD','TLT','IEF','XLF','XLK','XLE','XLV','XLI','XLU','XLP','XLB','XLRE',
  'GDX','GDXJ','HYG','JNK','EEM','EWJ','EWG','EWU','EWC','EWA','EWH','EWZ',
  'ARKK','ARKG','ARKW','ARKF','ARKQ','ARKX',
  'VWCE','IWDA','CSPX','EIMI','VEUR','VWRL','EXS1','XDWD','XMAW','XDWH','XDWS',
  'VNQ','VNQI','BIL','SHY','MUB','VTIP','SCHD','JEPI','QYLD','XYLD','RYLD',
  'SQQQ','TQQQ','UVXY','VXX','SVXY','SPXS','SPXL','UPRO','TMF','TNA','TZA',
  'HACK','CIBR','KWEB','CQQQ','MCHI','ASHR','FXI',
  'IVV','IWM','IWF','IWD','IWB','IJH','IJR','IEV','IAU','IEFA','IEMG',
]);
// Known stocks — always override ETF_TICKERS classification
const STOCK_TICKERS = new Set([
  'AAPL','MSFT','GOOGL','GOOG','AMZN','META','NVDA','TSLA','NFLX',
  'BABA','BIDU','JD','PDD','TCEHY','SHOP','COIN','HUBS','IRM',
  'JPM','GS','BAC','WFC','V','MA','PYPL','SQ','TTD','NDAQ',
  'KO','PEP','MCD','SBUX','NKE','DIS','AMGN','PFE','MRNA','JNJ',
  'XOM','CVX','WMT','PG','HD','INTC','AMD','QCOM','AVGO','ORCL',
  'CRM','ADBE','NOW','SNOW','UBER','LYFT','ABNB','DASH','SNAP','PINS',
]);

const TICKER_NAMES = {
  "AAPL":"Apple","MSFT":"Microsoft","GOOGL":"Alphabet","AMZN":"Amazon",
  "META":"Meta","TSLA":"Tesla","NVDA":"NVIDIA","ABNB":"Airbnb",
  "BKNG":"Booking Holdings","SNOW":"Snowflake","SHOP":"Shopify",
  "SQ":"Block","TTD":"Trade Desk","NFLX":"Netflix","NDAQ":"Nasdaq Inc",
  "COIN":"Coinbase","SAP":"SAP SE","DBK":"Deutsche Bank",
  "DTE":"Deutsche Telekom","SIE":"Siemens","ALV":"Allianz","BMW":"BMW",
  "BAS":"BASF","VOW3":"Volkswagen","ASML":"ASML Holding",
  "IWDA":"iShares Core MSCI World","CSPX":"iShares Core S&P 500",
  "EIMI":"iShares Core MSCI EM","VEUR":"Vanguard FTSE Europe",
  "VWCE":"Vanguard FTSE All-World","VWRL":"Vanguard FTSE All-World Dist",
  "EXS1":"iShares Core DAX","XDWH":"Xtrackers MSCI World Health",
  "XDWS":"Xtrackers MSCI World Swap","XMAW":"Xtrackers MSCI All World",
  "XDWD":"Xtrackers MSCI World","EL4A":"Deka MSCI World",
};

const ISIN_TYPES = {
  "IE":"etf","DE0009":"etf","DE000ETF":"etf","DE000EXS":"etf",
  "DE000EL4":"etf","LU":"etf","FR0010":"etf",
};

function inferType(ticker, isin, name, rawType) {
  const t = (ticker || '').toUpperCase();
  const n = (name   || '').toLowerCase();
  const i = (isin   || '').toUpperCase();

  if (rawType === 'crypto') return 'crypto';
  if (rawType === 'derivative') return 'derivative';
  if (/derivat|warrant|zertifikat|knock.out|turbo|faktor/i.test(n)) return 'derivative';
  if (STOCK_TICKERS.has(t)) return 'stock';

  // ISIN prefix — most reliable for EU instruments
  if (i.startsWith('IE') || i.startsWith('LU')) return 'etf';
  if (/^DE000(ETF|EXS|EL4|A0S|A1J)/.test(i)) return 'etf';
  if (i.startsWith('US')) {
    if (ETF_TICKERS.has(t)) return 'etf';
    return 'stock';
  }
  if (i.startsWith('DE') || i.startsWith('FR') || i.startsWith('NL') || i.startsWith('CH')) {
    if (ETF_TICKERS.has(t)) return 'etf';
    return 'stock';
  }

  if (ETF_TICKERS.has(t)) return 'etf';
  if (/\betf\b|index fund|ishares|vanguard|xtrackers|amundi|lyxor|invesco|spdr|wisdomtree/i.test(n)) return 'etf';

  return rawType || 'stock';
}
// legacy alias
function guessTypeFromISIN(isin, ticker) { return inferType(ticker, isin, '', 'stock'); }

async function resolveISINs(positions) {
  const toResolve = positions.filter(p => isISIN(p.symbol));
  if (!toResolve.length) return positions;

  // First pass: use local map
  const resolved = positions.map(p => {
    if (!isISIN(p.symbol)) return p;
    const ticker = ISIN_MAP[p.symbol];
    if (ticker) {
      return {
        ...p,
        symbol: ticker,
        name: TICKER_NAMES[ticker] || ticker,
        type: guessTypeFromISIN(p.symbol, ticker),
        isin: p.symbol,
      };
    }
    return p;
  });

  // Second pass: try FMP search-isin for any still unresolved
  const stillISIN = resolved.filter(p => isISIN(p.symbol));
  if (stillISIN.length > 0) {
    await Promise.all(stillISIN.slice(0, 20).map(async p => {
      try {
        const r = await fetch('/api/fmp?path=' + encodeURIComponent('/search-isin?isin=' + p.symbol));
        if (!r.ok) return;
        const data = await r.json();
        if (!Array.isArray(data) || !data.length) return;
        const pick = data.find(d => d.symbol?.endsWith('.DE'))
          || data.find(d => d.symbol?.endsWith('.F'))
          || data.find(d => d.symbol?.endsWith('.AS') || d.symbol?.endsWith('.PA'))
          || data.find(d => d.marketCap > 0) || data[0];
        if (!pick?.symbol) return;
        const idx = resolved.findIndex(q => q.symbol === p.symbol);
        if (idx >= 0) {
          resolved[idx] = {
            ...resolved[idx],
            fmpTicker: pick.symbol,
            symbol: pick.symbol,
            name: pick.name || resolved[idx].name,
            type: guessTypeFromISIN(resolved[idx].symbol, pick.symbol),
            isin: p.symbol,
          };
        }
      } catch(e) {}
    }));
  }

  return resolved;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines[0];
  const delim = (firstLine.split(";").length > firstLine.split(",").length) ? ";" : ",";
  function parseLine(line) {
    const cells = []; let cur = "", inQ = false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){inQ=!inQ;}
      else if(ch===delim&&!inQ){cells.push(cur.trim());cur="";}
      else{cur+=ch;}
    }
    cells.push(cur.trim()); return cells;
  }
  const headers = parseLine(firstLine).map(h=>h.replace(/^"|"$/g,"").trim().toLowerCase());
  const rows = lines.slice(1).filter(l=>l.trim()).map(l=>parseLine(l).map(c=>c.replace(/^"|"$/g,"").trim()));
  return { headers, rows };
}

function detectBroker(headers) {
  for (const [key, fmt] of Object.entries(BROKER_FORMATS)) {
    if (key !== "generic" && fmt.detect(headers)) return key;
  }
  return "generic";
}

function ImportModal({ onClose, onImport }) {
  const [step, setStep] = useState("upload");
  const [broker, setBroker] = useState(null);
  const [preview, setPreview] = useState([]);
  const [txPreview, setTxPreview] = useState(null);
  const [txData, setTxData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  async function processFile(file) {
    if (!file) return;
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const { headers, rows } = parseCSV(e.target.result);
        if(isSmartbrokerActivity(headers)){
          const txs = parseSmartbrokerActivity(rows,headers);
          if(!txs.length){setError("No confirmed transactions found.");return;}
          const dates=txs.map(t=>t.date).sort();
          const net=txs.reduce((s,t)=>s+(t.type==='buy'?t.amountEur:-t.amountEur),0);
          setTxData(txs);
          setTxPreview({count:txs.length,from:dates[0],to:dates[dates.length-1],net});
          setStep("activity"); return;
        }
        const detected = detectBroker(headers);
        setBroker(detected);
        const fmt = BROKER_FORMATS[detected];
        let parsed = fmt.parse(rows, headers).map((p,i)=>({
          ...p, id: Date.now()+i,
          color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length]
        }));
        if (!parsed.length) { setError("No valid positions found. Make sure the file contains buy transactions."); return; }

        // Check if any ISINs need resolving
        const hasISINs = parsed.some(p => isISIN(p.symbol));
        if (hasISINs) {
          setStep("resolving");
          parsed = await resolveISINs(parsed);
        }
        setPreview(parsed);
        setStep("preview");
      } catch(err) {
        setError("Could not parse this file. Please check the format.");
      }
    };
    reader.readAsText(file);
  }

  function onDrop(e) { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }

  const fmt = BROKER_FORMATS[broker];

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{width:560,maxHeight:"85vh",overflowY:"auto"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <div>
            <div className="serif" style={{fontSize:20}}>Import Portfolio</div>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>Upload a CSV export from your broker</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text3)",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>

        {step==="upload" && (<>
          {/* Broker guide pills */}
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {Object.entries(BROKER_FORMATS).filter(([k])=>k!=="generic").map(([k,f])=>(
              <div key={k} style={{padding:"4px 10px",borderRadius:4,background:`${f.color}18`,border:`1px solid ${f.color}33`,fontSize:11,color:f.color,fontFamily:"IBM Plex Mono,monospace"}}>{f.name}</div>
            ))}
            <div style={{padding:"4px 10px",borderRadius:4,background:"var(--surface2)",border:"1px solid var(--border)",fontSize:11,color:"var(--text3)",fontFamily:"IBM Plex Mono,monospace"}}>+ Any CSV</div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={onDrop}
            onClick={()=>document.getElementById("csv-file-input").click()}
            style={{
              border:`2px dashed ${dragging?"var(--green)":"var(--border2)"}`,
              borderRadius:10, padding:"44px 20px", textAlign:"center",
              cursor:"pointer", transition:"all 0.2s",
              background:dragging?"var(--green-dim)":"transparent"
            }}>
            <div style={{fontSize:32,marginBottom:12}}>📂</div>
            <div style={{fontSize:14,color:"var(--text)",marginBottom:6}}>Drop your CSV file here</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>or click to browse — Bitvavo, Smartbroker+, Trade Republic, or any CSV</div>
            <input id="csv-file-input" type="file" accept=".csv,.txt" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])}/>
          </div>

          {error && <div style={{marginTop:14,padding:"10px 14px",borderRadius:6,background:"var(--red-dim)",border:"1px solid rgba(255,77,109,0.3)",color:"var(--red)",fontSize:12}}>{error}</div>}

          {/* Sample CSV download hint */}
          <div style={{marginTop:16,padding:"12px 16px",borderRadius:8,background:"var(--surface2)",border:"1px solid var(--border)"}}>
            <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:6}}>SAMPLE FORMAT (GENERIC CSV)</div>
            <div className="mono" style={{fontSize:10,color:"var(--text2)",lineHeight:1.8}}>
              symbol,name,type,qty,price,broker<br/>
              BTC,Bitcoin,crypto,0.05,55000,Manual<br/>
              MSFT,Microsoft,stock,3,390,Manual
            </div>
          </div>
        </>)}

        {step==="resolving" && (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:32,marginBottom:16}}>🔍</div>
            <div style={{fontSize:14,color:"var(--text)",marginBottom:8}}>Resolving ISINs to tickers...</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Resolving tickers via FMP…</div>
          </div>
        )}

        {step==="preview" && (<>
          {/* Detected broker */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,padding:"10px 14px",borderRadius:8,background:"var(--green-dim)",border:"1px solid rgba(0,229,160,0.25)"}}>
            <span style={{fontSize:16}}>✓</span>
            <div>
              <div style={{fontSize:13,color:"var(--green)",fontWeight:500}}>Detected: {fmt?.name || "Generic"}</div>
              <div className="mono" style={{fontSize:10,color:"var(--text2)"}}>{fileName} · {preview.length} positions found</div>
            </div>
          </div>

          {/* Preview table */}
          <div style={{border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",marginBottom:18}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 0.7fr 0.8fr 0.8fr",padding:"8px 14px",background:"var(--surface2)",borderBottom:"1px solid var(--border)"}}>
              {["ASSET","QTY","AVG PRICE","TYPE"].map(h=><div key={h} className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em"}}>{h}</div>)}
            </div>
            {preview.map((p,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 0.7fr 0.8fr 0.8fr",padding:"10px 14px",borderBottom:i<preview.length-1?"1px solid var(--border)":"none",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:28,height:28,borderRadius:6,background:`${p.color}22`,border:`1px solid ${p.color}44`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span className="mono" style={{fontSize:8,color:p.color,fontWeight:700}}>{p.symbol.slice(0,4)}</span>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:500}}>{p.symbol}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{p.broker}</div>
                  </div>
                </div>
                <div className="mono" style={{fontSize:12,color:"var(--text2)"}}>{p.qty.toFixed(p.qty<1?4:2)}</div>
                <div className="mono" style={{fontSize:12,color:"var(--text2)"}}>€{p.avgPrice.toFixed(2)}</div>
                <span className={`tag tag-${p.type==="crypto"?"gold":p.type==="etf"?"blue":"gray"}`}>{p.type.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setStep("upload")}>← Back</button>
            <button className="btn btn-primary" onClick={()=>onImport(preview)}>
              Import {preview.length} position{preview.length!==1?"s":""} →
            </button>
          </div>
        </>)}
        {step==="activity"&&txPreview&&(<>
          <div style={{padding:"10px 14px",borderRadius:8,background:"var(--green-dim)",border:"1px solid rgba(0,229,160,0.25)",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
            <span>📈</span>
            <div>
              <div style={{fontSize:13,color:"var(--green)",fontWeight:500}}>Transaction History Detected</div>
              <div className="mono" style={{fontSize:10,color:"var(--text2)"}}>{txPreview.count} confirmed transactions · {txPreview.from} → {txPreview.to}</div>
            </div>
          </div>
          <div style={{padding:"10px 14px",borderRadius:8,background:"var(--surface2)",border:"1px solid var(--border)",marginBottom:16,fontSize:12,color:"var(--text2)"}}>
            This powers your <span style={{color:"var(--green)"}}>real performance chart</span> — invested capital staircase based on actual trade dates and amounts.
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setStep("upload")}>← Back</button>
            <button className="btn btn-primary" onClick={()=>onImport({type:"transactions",data:txData})}>
              Import {txPreview.count} transactions →
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}



const fmt  = (n,d=2)=>n.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtE = (n)=>`€${fmt(Math.abs(n),0)}`;

// ── StockDetail — full page (3a financials + 3b charts + 3d scorecard) ──────

// ── TxPriceChart: price history with buy/sell markers ──
function TxPriceChart({ ticker, txs, currentPrice }) {
  const [prices, setPrices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    const to   = new Date().toISOString().slice(0,10);
    const from = new Date(Date.now() - 365*2*86400000).toISOString().slice(0,10);
    fetch(`/api/fmp?path=/historical-price-eod/full?symbol=${ticker}&from=${from}&to=${to}`)
      .then(r=>r.json())
      .then(data=>{
        const arr = Array.isArray(data) ? data : (data?.historical||[]);
        const sorted = [...arr].sort((a,b)=>a.date.localeCompare(b.date));
        setPrices(sorted);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [ticker]);

  if (loading) return (
    <div className="card shimmer" style={{height:160,marginBottom:16,borderRadius:10}}/>
  );
  if (!prices.length) return null;

  const firstTx = txs.length ? txs.reduce((a,b)=>a.date<b.date?a:b).date : null;
  const visible = firstTx ? prices.filter(p=>p.date>=firstTx) : prices;
  if (!visible.length) return null;

  const vals = visible.map(p=>p.close);
  const minV = Math.min(...vals)*0.97;
  const maxV = Math.max(...vals)*1.03;
  const W = 700, H = 140, PAD = {t:10,r:12,b:24,l:44};
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const xf = i => PAD.l + (i/(visible.length-1||1))*cw;
  const yf = v => PAD.t + ch - ((v-minV)/(maxV-minV||1))*ch;

  const pathD = visible.map((p,i)=>`${i===0?'M':'L'}${xf(i).toFixed(1)},${yf(p.close).toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${xf(visible.length-1)},${H-PAD.b} L${PAD.l},${H-PAD.b} Z`;

  const markers = txs.map(tx => {
    const idx = visible.findIndex(p=>p.date>=tx.date);
    if (idx < 0) return null;
    return { ...tx, cx: xf(idx), cy: yf(visible[idx].close), isBuy: tx.type==='buy' };
  }).filter(Boolean);

  const yLabels = [0,0.5,1].map(t=>({ v: minV+t*(maxV-minV), y: PAD.t+ch*(1-t) }));
  const xLabels = [0,0.33,0.66,1].map(t=>({ i:Math.round(t*(visible.length-1)) }))
    .map(l=>({ ...l, date: visible[l.i]?.date?.slice(0,7) }));
  const isUp = currentPrice >= (visible[0]?.close||0);

  return (
    <div className="card" style={{padding:'16px 16px 10px',marginBottom:16,overflow:'hidden'}}>
      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:10}}>PRICE HISTORY</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        <defs>
          <linearGradient id="txgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp?'#00e5a0':'#ff4d6d'} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={isUp?'#00e5a0':'#ff4d6d'} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yLabels.map((l,i)=>(
          <g key={i}>
            <line x1={PAD.l} x2={W-PAD.r} y1={l.y} y2={l.y} stroke="#1c2730" strokeWidth="1"/>
            <text x={PAD.l-4} y={l.y+4} textAnchor="end" fill="#3d4f5e" fontSize="8" fontFamily="IBM Plex Mono">
              {l.v>=1000?`${(l.v/1000).toFixed(1)}k`:l.v.toFixed(1)}
            </text>
          </g>
        ))}
        <path d={areaD} fill="url(#txgrad)"/>
        <path d={pathD} fill="none" stroke={isUp?'#00e5a0':'#ff4d6d'} strokeWidth="1.5"/>
        {xLabels.map((l,i)=>(
          <text key={i} x={xf(l.i)} y={H-4} textAnchor="middle" fill="#3d4f5e" fontSize="8" fontFamily="IBM Plex Mono">{l.date}</text>
        ))}
        {markers.map((m,i)=>(
          <g key={i}>
            <line x1={m.cx} x2={m.cx} y1={PAD.t} y2={H-PAD.b} stroke={m.isBuy?'rgba(0,229,160,0.4)':'rgba(255,77,109,0.4)'} strokeWidth="1" strokeDasharray="3,2"/>
            <circle cx={m.cx} cy={m.cy} r="5" fill={m.isBuy?'#00e5a0':'#ff4d6d'} stroke="#080c10" strokeWidth="1.5"/>
            <text x={m.cx} y={m.cy+(m.isBuy?14:-8)} textAnchor="middle" fill={m.isBuy?'#00e5a0':'#ff4d6d'} fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700">{m.isBuy?'B':'S'}</text>
          </g>
        ))}
      </svg>
      <div style={{display:'flex',gap:16,marginTop:4}}>
        {[['#00e5a0','BUY'],['#ff4d6d','SELL']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:c}}/>
            <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CompareView — 3c Stock Comparison ─────────────────────────────────────────
const COMPARE_COLORS = ['#00e5a0','#4d9fff','#f0b429','#a78bfa'];

function CompareBar({ label, stocks, valueKey, format='pct', good, bad, invert=false }) {
  const vals = stocks.map(s => s?.data?.[valueKey] ?? null);
  const defined = vals.filter(v => v != null);
  if (!defined.length) return null;
  const maxAbs = Math.max(...defined.map(Math.abs), 0.001);

  const fmt = v => {
    if (v == null) return '—';
    if (format === 'pct')   return (v * 100).toFixed(1) + '%';
    if (format === 'x')     return v.toFixed(1) + 'x';
    if (format === 'raw')   return v.toFixed(2);
    if (format === 'B') {
      const a = Math.abs(v);
      if (a >= 1e12) return (v/1e12).toFixed(1)+'T';
      if (a >= 1e9)  return (v/1e9).toFixed(1)+'B';
      if (a >= 1e6)  return (v/1e6).toFixed(0)+'M';
      return v.toFixed(0);
    }
    return v.toFixed(2);
  };

  const barColor = (v, i) => {
    if (v == null) return 'var(--border2)';
    if (good != null && bad != null) {
      const good_ = invert ? v <= good : v >= good;
      const bad_  = invert ? v >= bad  : v <= bad;
      if (good_) return '#00e5a0';
      if (bad_)  return '#ff4d6d';
      return '#f0b429';
    }
    return COMPARE_COLORS[i];
  };

  return (
    <div style={{marginBottom:14}}>
      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:6}}>{label}</div>
      {stocks.map((s, i) => {
        const v = vals[i];
        const pct = v == null ? 0 : Math.min(Math.abs(v) / maxAbs * 100, 100);
        const neg = v != null && v < 0;
        return (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
            <div style={{width:36,flexShrink:0}}>
              <span className="mono" style={{fontSize:9,color:COMPARE_COLORS[i],fontWeight:600}}>{s.ticker}</span>
            </div>
            <div style={{flex:1,height:18,background:'var(--surface2)',borderRadius:3,overflow:'hidden',position:'relative'}}>
              <div style={{
                position:'absolute', top:0, bottom:0, left:0,
                width: pct+'%',
                background: neg ? '#ff4d6d44' : barColor(v, i)+'55',
                borderRight: `2px solid ${neg ? '#ff4d6d' : barColor(v, i)}`,
                borderRadius:3,
                transition:'width 0.6s ease',
              }}/>
            </div>
            <div className="mono" style={{width:52,textAlign:'right',fontSize:11,fontWeight:600,color: barColor(v,i),flexShrink:0}}>
              {fmt(v)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompareSection({ title, icon, children }) {
  return (
    <div className="card" style={{padding:'20px 22px',marginBottom:14}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
        <span style={{fontSize:14}}>{icon}</span>
        <div className="mono" style={{fontSize:10,letterSpacing:'0.12em',color:'var(--text2)'}}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function CompareView() {
  const [tickers, setTickers] = useState([]);
  const [input, setInput]     = useState('');
  const [stocks, setStocks]   = useState([]); // [{ticker, data, loading, error}]

  const addTicker = async (raw) => {
    const tk = raw.trim().toUpperCase();
    if (!tk || tickers.includes(tk) || tickers.length >= 4) return;
    setTickers(prev => [...prev, tk]);
    setInput('');
    setStocks(prev => [...prev, { ticker: tk, data: null, loading: true, error: null }]);
    try {
      const res = await fetch('/api/fundamentals?symbol=' + tk);
      const d   = await res.json();
      if (d.error) throw new Error(d.error);
      setStocks(prev => prev.map(s => s.ticker === tk ? { ...s, data: d, loading: false } : s));
    } catch(e) {
      setStocks(prev => prev.map(s => s.ticker === tk ? { ...s, loading: false, error: e.message } : s));
    }
  };

  const removeTicker = (tk) => {
    setTickers(prev => prev.filter(t => t !== tk));
    setStocks(prev => prev.filter(s => s.ticker !== tk));
  };

  // Extract last-year metrics from fundamentals response
  const stocksWithMetrics = stocks.map(s => {
    if (!s.data) return s;
    const yrs  = s.data.byYear?.slice(-5) || [];
    const last = yrs[yrs.length - 1] || {};
    const prev = yrs[yrs.length - 2] || {};
    const revGrowth = (last.revenue && prev.revenue) ? (last.revenue / prev.revenue - 1) : null;
    const epsGrowth = (last.eps     && prev.eps)     ? (last.eps     / prev.eps     - 1) : null;
    return {
      ...s,
      data: {
        ...s.data,
        // valuation (direct from top-level)
        peRatio:    s.data.peRatio,
        pbRatio:    s.data.pbRatio ?? last.pbRatio,
        pegRatio:   s.data.pegRatio,
        evEbitda:   s.data.evEbitda ?? last.evEbitda,
        // forward valuation
        forwardPE:  s.data.forwardPE,
        forward2PE: s.data.forward2PE,
        fy1Date:    s.data.fy1Date,
        fy2Date:    s.data.fy2Date,
        // profitability
        netMargin:  last.netMargin,
        grossMargin:last.grossMargin,
        opMargin:   last.operatingMargin,
        roe:        last.roe,
        roic:       last.roic,
        // growth
        revGrowth,
        epsGrowth,
        ttmEpsGrowth: s.data.ttmEpsGrowth,
        fy1EpsGrowth: s.data.fy1EpsGrowth,
        fy2EpsGrowth: s.data.fy2EpsGrowth,
        eps:        last.eps,
        revenue:    last.revenue,
        // balance sheet
        debtEquity: last.debtEquity,
        fcfYield:   last.fcfYield,
      }
    };
  });

  const hasData = stocksWithMetrics.some(s => s.data && !s.loading);

  return (
    <div className="fu">
      {/* Header */}
      <div style={{marginBottom:22}}>
        <div className="serif" style={{fontSize:22,letterSpacing:'-0.02em'}}>Compare</div>
        <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:3}}>
          Side-by-side fundamental analysis · up to 4 stocks
        </div>
      </div>

      {/* Ticker input */}
      <div className="card" style={{padding:'16px 18px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          {/* Added tickers */}
          {stocksWithMetrics.map((s, i) => (
            <div key={s.ticker} style={{
              display:'flex',alignItems:'center',gap:6,
              padding:'5px 10px',borderRadius:6,
              background:`${COMPARE_COLORS[i]}15`,
              border:`1px solid ${COMPARE_COLORS[i]}40`,
            }}>
              {s.loading ? (
                <span className="mono" style={{fontSize:11,color:COMPARE_COLORS[i]}}>
                  {s.ticker} <span className="shimmer" style={{opacity:0.6}}>···</span>
                </span>
              ) : s.error ? (
                <span className="mono" style={{fontSize:11,color:'var(--red)'}}>{s.ticker} ✗</span>
              ) : (
                <span className="mono" style={{fontSize:11,color:COMPARE_COLORS[i],fontWeight:600}}>
                  {s.ticker}
                  {s.data?.profile?.companyName && (
                    <span style={{fontWeight:400,color:'var(--text2)',marginLeft:4,fontSize:10}}>
                      {s.data.profile.companyName.split(' ').slice(0,2).join(' ')}
                    </span>
                  )}
                </span>
              )}
              <button onClick={() => removeTicker(s.ticker)} style={{
                background:'none',border:'none',cursor:'pointer',
                color:'var(--text3)',fontSize:12,lineHeight:1,padding:'0 2px',
              }}>×</button>
            </div>
          ))}

          {/* Input */}
          {tickers.length < 4 && (
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <input
                className="inp"
                placeholder="Add ticker… AAPL, MSFT"
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === 'Enter') addTicker(input); }}
                style={{width:180,padding:'6px 10px',fontSize:12}}
              />
              <button className="btn btn-primary" onClick={() => addTicker(input)}
                style={{padding:'6px 12px',fontSize:10}}>+ ADD</button>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {tickers.length === 0 && (
          <div style={{marginTop:12,display:'flex',gap:6,flexWrap:'wrap'}}>
            <span className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',alignSelf:'center'}}>TRY:</span>
            {['AAPL','MSFT','GOOGL','NVDA','TSLA','AMZN','META'].map(t => (
              <button key={t} className="pill" onClick={() => addTicker(t)}
                style={{fontSize:9,padding:'3px 8px'}}>{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {tickers.length === 0 && (
        <div className="card fu" style={{padding:'48px 20px',textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:16}}>⇌</div>
          <div className="serif" style={{fontSize:18,color:'var(--text2)',marginBottom:8}}>
            Compare up to 4 stocks
          </div>
          <div style={{fontSize:12,color:'var(--text3)',maxWidth:320,margin:'0 auto',lineHeight:1.6}}>
            Add tickers above to compare valuation, profitability, and growth side-by-side
          </div>
        </div>
      )}

      {/* Charts */}
      {hasData && (<>

        {/* Legend */}
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
          {stocksWithMetrics.filter(s=>s.data).map((s,i) => (
            <div key={s.ticker} style={{display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:10,height:10,borderRadius:2,background:COMPARE_COLORS[i]}}/>
              <span className="mono" style={{fontSize:10,color:'var(--text2)'}}>
                {s.ticker}
                {s.data?.profile?.companyName &&
                  <span style={{color:'var(--text3)',marginLeft:4}}>{s.data.profile.companyName.split(' ').slice(0,2).join(' ')}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Valuation */}
        <CompareSection title="VALUATION" icon="🎯">
          <CompareBar label="P/E (TRAILING)"   stocks={stocksWithMetrics} valueKey="peRatio"    format="x"   good={17}  bad={30}  invert={true}/>
          <CompareBar label="P/E (FORWARD FY1)" stocks={stocksWithMetrics} valueKey="forwardPE"  format="x"   good={15}  bad={25}  invert={true}/>
          <CompareBar label="P/E (FORWARD FY2)" stocks={stocksWithMetrics} valueKey="forward2PE" format="x"   good={12}  bad={20}  invert={true}/>
          <CompareBar label="P/B RATIO"         stocks={stocksWithMetrics} valueKey="pbRatio"    format="x"   good={2}   bad={5}   invert={true}/>
          <CompareBar label="PEG RATIO"         stocks={stocksWithMetrics} valueKey="pegRatio"   format="raw" good={1}   bad={2.5} invert={true}/>
          <CompareBar label="EV / EBITDA"       stocks={stocksWithMetrics} valueKey="evEbitda"   format="x"   good={10}  bad={20}  invert={true}/>
        </CompareSection>

        {/* Profitability */}
        <CompareSection title="PROFITABILITY" icon="💰">
          <CompareBar label="GROSS MARGIN"     stocks={stocksWithMetrics} valueKey="grossMargin" format="pct" good={0.40} bad={0.15}/>
          <CompareBar label="OPERATING MARGIN" stocks={stocksWithMetrics} valueKey="opMargin"    format="pct" good={0.15} bad={0.03}/>
          <CompareBar label="NET MARGIN"       stocks={stocksWithMetrics} valueKey="netMargin"   format="pct" good={0.10} bad={0.03}/>
          <CompareBar label="ROE"              stocks={stocksWithMetrics} valueKey="roe"         format="pct" good={0.15} bad={0.08}/>
          <CompareBar label="ROIC"             stocks={stocksWithMetrics} valueKey="roic"        format="pct" good={0.10} bad={0.05}/>
        </CompareSection>

        {/* Growth */}
        <CompareSection title="GROWTH" icon="📈">
          <CompareBar label="REVENUE GROWTH (YoY)"        stocks={stocksWithMetrics} valueKey="revGrowth"    format="pct" good={0.10} bad={-0.05}/>
          <CompareBar label="EPS GROWTH TTM (actual)"     stocks={stocksWithMetrics} valueKey="ttmEpsGrowth" format="pct" good={0.10} bad={-0.05}/>
          <CompareBar label="EPS GROWTH FY1 (est)"        stocks={stocksWithMetrics} valueKey="fy1EpsGrowth" format="pct" good={0.10} bad={-0.05}/>
          <CompareBar label="EPS GROWTH FY2 (est)"        stocks={stocksWithMetrics} valueKey="fy2EpsGrowth" format="pct" good={0.10} bad={-0.05}/>
          <CompareBar label="EPS LATEST (actual)"         stocks={stocksWithMetrics} valueKey="eps"          format="raw"/>
        </CompareSection>

        {/* Summary table */}
        <div className="card" style={{padding:'18px 20px',marginBottom:14,overflowX:'auto'}}>
          <div className="mono" style={{fontSize:10,letterSpacing:'0.12em',color:'var(--text2)',marginBottom:14}}>⊞  SUMMARY TABLE</div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead>
              <tr>
                <td className="mono" style={{fontSize:9,color:'var(--text3)',paddingBottom:8,paddingRight:16,letterSpacing:'0.08em'}}>METRIC</td>
                {stocksWithMetrics.filter(s=>s.data).map((s,i) => (
                  <td key={s.ticker} className="mono" style={{fontSize:9,color:COMPARE_COLORS[i],paddingBottom:8,paddingRight:12,textAlign:'right',letterSpacing:'0.06em',fontWeight:600}}>
                    {s.ticker}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {label:'P/E (TTM)',    key:'peRatio',      fmt:v=>v!=null?v.toFixed(1)+'x':'—', lowerBetter:true},
                {label:'P/E (FY1)',   key:'forwardPE',    fmt:v=>v!=null?v.toFixed(1)+'x':'—', lowerBetter:true},
                {label:'P/E (FY2)',   key:'forward2PE',   fmt:v=>v!=null?v.toFixed(1)+'x':'—', lowerBetter:true},
                {label:'P/B',         key:'pbRatio',      fmt:v=>v!=null?v.toFixed(1)+'x':'—', lowerBetter:true},
                {label:'PEG',         key:'pegRatio',     fmt:v=>v!=null?v.toFixed(2):'—',     lowerBetter:true},
                {label:'EV/EBITDA',   key:'evEbitda',     fmt:v=>v!=null?v.toFixed(1)+'x':'—', lowerBetter:true},
                {label:'Gross Margin',key:'grossMargin',  fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'Net Margin',  key:'netMargin',    fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'ROE',         key:'roe',          fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'ROIC',        key:'roic',         fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'Rev Growth',  key:'revGrowth',    fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'EPS Grw TTM', key:'ttmEpsGrowth', fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'EPS Grw FY1', key:'fy1EpsGrowth', fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'EPS Grw FY2', key:'fy2EpsGrowth', fmt:v=>v!=null?(v*100).toFixed(1)+'%':'—', lowerBetter:false},
                {label:'D/E',         key:'debtEquity',   fmt:v=>v!=null?v.toFixed(2)+'x':'—', lowerBetter:true},
              ].map(row => {
                const activeStocks = stocksWithMetrics.filter(s=>s.data);
                const vals = activeStocks.map(s => s.data[row.key]);
                const defined = vals.filter(v => v != null);
                // Find best value index
                let bestIdx = -1;
                if (defined.length > 1) {
                  const best = row.lowerBetter
                    ? Math.min(...defined)
                    : Math.max(...defined);
                  bestIdx = vals.indexOf(best);
                }
                return (
                  <tr key={row.label} style={{borderTop:'1px solid var(--border)'}}>
                    <td className="mono" style={{fontSize:10,color:'var(--text3)',padding:'7px 16px 7px 0',letterSpacing:'0.04em'}}>{row.label}</td>
                    {activeStocks.map((s, i) => {
                      const v = s.data[row.key];
                      const isBest = bestIdx === i && v != null;
                      return (
                        <td key={s.ticker} style={{padding:'5px 12px 5px 0',textAlign:'right'}}>
                          <span className="mono" style={{
                            fontSize:11,
                            fontWeight: isBest ? 700 : 400,
                            color: isBest ? COMPARE_COLORS[i] : 'var(--text2)',
                            background: isBest ? `${COMPARE_COLORS[i]}18` : 'transparent',
                            padding: isBest ? '2px 7px' : '2px 7px',
                            borderRadius: 4,
                            border: isBest ? `1px solid ${COMPARE_COLORS[i]}40` : '1px solid transparent',
                            display:'inline-block',
                          }}>
                            {isBest ? '▲ ' : ''}{row.fmt(v)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>)}
    </div>
  );
}

// ── EtfOverview — ETF-specific overview tab ────────────────────────────────
function EtfOverview({ pos }) {
  const [etf, setEtf]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isin   = pos.isin;
  const symbol = pos.fmpTicker || ISIN_MAP[pos.isin] || pos.symbol;

  useEffect(() => {
    setLoading(true); setError(null); setEtf(null);
    const params = isin ? `isin=${isin}&symbol=${symbol}` : `symbol=${symbol}`;
    fetch('/api/etf?' + params)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setEtf(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [isin, symbol]);

  if (loading) return (
    <div className="card" style={{padding:60,textAlign:'center'}}>
      <span className="mono shimmer" style={{fontSize:12,color:'var(--text3)'}}>⟳ Loading ETF data…</span>
    </div>
  );
  if (error) return (
    <div className="card" style={{padding:24}}>
      <div style={{color:'var(--red)',fontSize:13,marginBottom:8}}>✕ Could not load ETF data: {error}</div>
      <div style={{fontSize:11,color:'var(--text3)'}}>
        ETF data is sourced from justETF. This ETF may not be listed there, or the ISIN could not be resolved.
      </div>
    </div>
  );
  if (!etf) return null;

  // ── Weight bar component ──
  const WeightBar = ({ name, weight, color = 'var(--green)', maxWeight }) => {
    const pct = maxWeight > 0 ? (weight / maxWeight) * 100 : 0;
    return (
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <div style={{width:140,flexShrink:0,fontSize:12,color:'var(--text)',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{name}</div>
        <div style={{flex:1,height:16,background:'var(--surface2)',borderRadius:3,overflow:'hidden',position:'relative'}}>
          <div style={{
            position:'absolute',top:0,bottom:0,left:0,
            width:pct+'%',
            background:color+'30',
            borderRight:`2px solid ${color}`,
            borderRadius:3,
            transition:'width 0.5s ease',
          }}/>
        </div>
        <div className="mono" style={{width:42,textAlign:'right',fontSize:11,fontWeight:600,color,flexShrink:0}}>
          {weight.toFixed(2)}%
        </div>
      </div>
    );
  };

  const maxHolding = etf.holdings?.[0]?.weight || 1;
  const maxCountry = etf.countries?.[0]?.weight || 1;
  const maxSector  = etf.sectors?.[0]?.weight   || 1;

  return (
    <div className="fu2">
      {/* ── Key Facts bar ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
        {[
          { l:'TER p.a.',      v: etf.ter        || '—', icon:'💸', note:'Total expense ratio' },
          { l:'Fund Size',     v: etf.fundSize || (etf.marketCap ? (etf.marketCap>=1e12?`$${(etf.marketCap/1e12).toFixed(2)}T`:etf.marketCap>=1e9?`$${(etf.marketCap/1e9).toFixed(2)}B`:`$${(etf.marketCap/1e6).toFixed(0)}M`) : '—'), icon:'🏦', note:'Assets under management' },
          { l:'Distribution',  v: etf.distPolicy  || '—', icon: etf.distPolicy?.toLowerCase().includes('accum') ? '🔄' : '💰', note:'Dividend policy' },
          { l:'Replication',   v: etf.replication || '—', icon:'🔁', note:'Index tracking method' },
          { l:'Holdings',      v: etf.holdingsCount ? Number(etf.holdingsCount.replace(/,/g,'')).toLocaleString('de-DE') : '—', icon:'📊', note:'Total number of positions' },
        ].map(({l,v,icon,note}) => (
          <div key={l} className="card" style={{padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <span style={{fontSize:14}}>{icon}</span>
              <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em'}}>{l}</div>
            </div>
            <div className="mono" style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:2}}>{v}</div>
            <div style={{fontSize:10,color:'var(--text3)'}}>{note}</div>
          </div>
        ))}
      </div>

      {/* ── 3-column grid: Holdings / Countries / Sectors ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>

        {/* Top 10 Holdings */}
        <div className="card" style={{padding:'18px 20px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div className="mono" style={{fontSize:10,letterSpacing:'0.12em',color:'var(--text2)'}}>TOP 10 HOLDINGS</div>
            {etf.holdingsCount && <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>of {Number(etf.holdingsCount.replace(/,/g,'')).toLocaleString('de-DE')} total</span>}
          </div>
          {etf.holdings?.length > 0 ? etf.holdings.map((h, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
              <span className="mono" style={{fontSize:9,color:'var(--text3)',width:14,flexShrink:0}}>{i+1}</span>
              <div style={{flex:1,overflow:'hidden'}}>
                <div style={{fontSize:11,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:2}}>{h.name}</div>
                <div style={{height:4,background:'var(--surface2)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:(h.weight/maxHolding*100)+'%',background:'var(--green)',borderRadius:2,opacity:0.7}}/>
                </div>
              </div>
              <span className="mono" style={{fontSize:10,fontWeight:600,color:'var(--green)',flexShrink:0,width:36,textAlign:'right'}}>{h.weight.toFixed(2)}%</span>
            </div>
          )) : <div style={{fontSize:11,color:'var(--text3)',textAlign:'center',padding:'20px 0'}}>No holdings data</div>}
        </div>

        {/* Top Countries */}
        <div className="card" style={{padding:'18px 20px'}}>
          <div className="mono" style={{fontSize:10,letterSpacing:'0.12em',color:'var(--text2)',marginBottom:14}}>TOP 5 COUNTRIES</div>
          {etf.countries?.length > 0 ? etf.countries.map((c, i) => (
            <WeightBar key={i} name={c.name} weight={c.weight} maxWeight={maxCountry} color='#4d9fff'/>
          )) : <div style={{fontSize:11,color:'var(--text3)',textAlign:'center',padding:'20px 0'}}>No country data</div>}
        </div>

        {/* Top Sectors */}
        <div className="card" style={{padding:'18px 20px'}}>
          <div className="mono" style={{fontSize:10,letterSpacing:'0.12em',color:'var(--text2)',marginBottom:14}}>TOP 5 SECTORS</div>
          {etf.sectors?.length > 0 ? etf.sectors.map((s, i) => (
            <WeightBar key={i} name={s.name} weight={s.weight} maxWeight={maxSector} color='#a78bfa'/>
          )) : <div style={{fontSize:11,color:'var(--text3)',textAlign:'center',padding:'20px 0'}}>No sector data</div>}
        </div>
      </div>

      {/* ── Description ── */}
      {etf.description && (
        <div className="card" style={{padding:'16px 20px'}}>
          <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>DESCRIPTION</div>
          <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}>{etf.description}</div>
        </div>
      )}

      {/* ── Source credit ── */}
      <div style={{marginTop:10,textAlign:'right'}}>
        <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>
          Holdings & weights via{' '}
          <a href={etf.sourceUrl} target="_blank" rel="noreferrer"
            style={{color:'var(--text3)',textDecoration:'underline'}}>justETF</a>
          {etf.isin && ` · ISIN ${etf.isin}`}
        </span>
      </div>
    </div>
  );
}

function StockDetail({ pos, onBack, transactions }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [tab, setTab]       = useState('overview');

  const ticker = pos.fmpTicker || ISIN_MAP[pos.isin] || pos.symbol;

  useEffect(() => {
    if (pos.type === 'etf') { setData({}); setLoading(false); return; }
    setLoading(true); setError(null); setData(null);
    fetch('/api/fundamentals?symbol=' + ticker)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticker]);

  const fmtB = v => {
    if (v == null) return '—';
    const abs = Math.abs(v);
    if (abs >= 1e12) return (v/1e12).toFixed(2) + 'T';
    if (abs >= 1e9)  return (v/1e9).toFixed(2)  + 'B';
    if (abs >= 1e6)  return (v/1e6).toFixed(1)  + 'M';
    return v.toFixed(0);
  };
  const fmtPct = v => v == null ? '—' : (v * 100).toFixed(1) + '%';
  const fmtX   = v => v == null ? '—' : v.toFixed(1) + 'x';
  const fmtN   = v => v == null ? '—' : v.toFixed(2);

  const yrs = data?.byYear?.slice(-5) || [];
  const last = yrs[yrs.length - 1] || {};
  const prev = yrs[yrs.length - 2] || {};

  // ── Scorecard ──
  const SCORE_COLOR = { green:'#00e5a0', gold:'#f0b429', red:'#ff4d6d', gray:'#3d4f5e' };
  const SCORE_BG    = { green:'rgba(0,229,160,0.08)', gold:'rgba(240,180,41,0.08)', red:'rgba(255,77,109,0.08)', gray:'rgba(61,79,94,0.08)' };

  // ── Grading helpers ──────────────────────────────────────────────────────────
  // Sources: Benjamin Graham "The Intelligent Investor" (P/E ≤15, P/B ≤1.5),
  //          Damodaran (NYU Stern) sector data, CFA Institute ratio analysis,
  //          Wall Street Prep (ROIC 10-15% threshold), S&P 500 historical avg P/E ~17x
  const grade    = (val, good, ok) => val==null?'gray': val>=good?'green': val>=ok?'gold':'red';
  const gradeInv = (val, good, ok) => val==null?'gray': val<=good?'green': val<=ok?'gold':'red';

  // Revenue trend: +5% YoY = healthy growth (Damodaran avg US equity growth),
  //                -5% = concern, flat in between = caution
  const trendGrade = (cur, prv) => cur==null||prv==null?'gray': cur>prv*1.05?'green': cur<prv*0.95?'red':'gold';

  // Profitability grading: net margin thresholds vary widely by sector.
  // We use a composite score across margin + ROE + ROIC for a fairer picture.
  // Net margin: >10% strong (Damodaran S&P 500 median ~11%), >3% acceptable, <3% weak
  // ROE: >15% strong (Buffett/Graham standard, cost of equity ~10-12%),
  //       >8% acceptable (above typical cost of equity floor), <8% weak
  // ROIC: >10% strong (above WACC for most firms, Wall Street Prep),
  //        >5% acceptable, <5% value-destroying territory
  const profitColor = (() => {
    const nm   = last.netMargin;
    const roe  = last.roe;
    const roic = last.roic;
    const scores = [
      nm   != null ? (nm   >= 0.10 ? 2 : nm   >= 0.03 ? 1 : 0) : null,
      roe  != null ? (roe  >= 0.15 ? 2 : roe  >= 0.08 ? 1 : 0) : null,
      roic != null ? (roic >= 0.10 ? 2 : roic >= 0.05 ? 1 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();

  // Balance sheet: D/E thresholds per CFA Institute & BDC research.
  // D/E < 1.0x = conservative/healthy (below "equal debt/equity" line per CFA)
  // D/E < 2.0x = acceptable (BDC: 2-2.5x "generally considered good" for most industries)
  // D/E >= 2.0x = elevated leverage, risk increases
  const balanceColor = last.debtEquity==null ? 'gray'
    : last.debtEquity < 1.0 ? 'green'
    : last.debtEquity < 2.0 ? 'gold' : 'red';

  // Valuation: P/E grading anchored to Benjamin Graham (≤15x = value, The Intelligent
  // Investor Ch.14), S&P 500 historical avg ~17x, and interest-rate context.
  // We use EV/EBITDA alongside P/E as a more capital-structure-neutral check.
  // P/E ≤ 17x = reasonable (S&P avg), ≤ 25x = elevated but not extreme (growth premium),
  // > 25x = expensive; EV/EBITDA ≤ 10x = value, ≤ 15x = fair
  const peRatio  = data?.peRatio;
  const evEbitda = data?.evEbitda ?? last.evEbitda;
  const pegRatio = data?.pegRatio;
  const valuationColor = (() => {
    // PEG < 1 = undervalued (Peter Lynch), < 2 = fair, > 2 = expensive
    // P/E ≤ 17x = at/below S&P avg, ≤ 25x = growth premium
    // EV/EBITDA ≤ 10x = value, ≤ 15x = fair
    const scores = [
      peRatio  != null ? (peRatio  <= 17 ? 2 : peRatio  <= 25 ? 1 : 0) : null,
      evEbitda != null ? (evEbitda <= 10 ? 2 : evEbitda <= 15 ? 1 : 0) : null,
      pegRatio != null ? (pegRatio <=  1 ? 2 : pegRatio <=  2 ? 1 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();
  // PEG color: < 1 green, < 2 gold, >= 2 red (Peter Lynch standard)
  const pegColor = pegRatio == null ? 'var(--text2)'
    : pegRatio <= 1 ? '#00e5a0' : pegRatio <= 2 ? '#f0b429' : '#ff4d6d';

  const scorecard = [
    { label:'Profitability',   icon:'💰',
      color: profitColor,
      metrics: [
        { l:'Gross Margin',    v: fmtPct(last.grossMargin) },
        { l:'Operating Margin',v: fmtPct(last.operatingMargin) },
        { l:'Net Margin',      v: fmtPct(last.netMargin) },
        { l:'ROE',             v: fmtPct(last.roe) },
        { l:'ROIC',            v: fmtPct(last.roic) },
      ]
    },
    { label:'Revenue Growth',  icon:'📈',
      // YoY >5% = healthy (Damodaran US equity avg growth), <-5% = declining
      color: trendGrade(last.revenue, prev.revenue),
      metrics: [
        { l:'Revenue',         v: fmtB(last.revenue) },
        { l:'YoY Growth',      v: last.revenue&&prev.revenue ? ((last.revenue/prev.revenue-1)*100).toFixed(1)+'%' : '—' },
        { l:'Gross Profit',    v: fmtB(last.grossProfit) },
        { l:'EBITDA',          v: fmtB(last.ebitda) },
        { l:'EPS',             v: fmtN(last.eps) },
      ]
    },
    { label:'Cash Generation', icon:'🏦',
      // FCF>0 is minimum bar; FCF/Revenue >5% = strong cash conversion (Old School Value: >15% excellent)
      color: last.freeCashFlow==null ? 'gray'
        : last.freeCashFlow <= 0 ? 'red'
        : (last.revenue && last.freeCashFlow/last.revenue >= 0.05) ? 'green' : 'gold',
      metrics: [
        { l:'Operating CF',    v: fmtB(last.operatingCF) },
        { l:'CapEx',           v: fmtB(last.capex) },
        { l:'Free Cash Flow',  v: fmtB(last.freeCashFlow) },
        { l:'FCF Yield',       v: fmtPct(last.fcfYield) },
        { l:'FCF / Revenue',   v: last.freeCashFlow&&last.revenue ? fmtPct(last.freeCashFlow/last.revenue) : '—' },
      ]
    },
    { label:'Balance Sheet',   icon:'🏛',
      color: balanceColor,
      metrics: [
        { l:'Total Assets',    v: fmtB(last.totalAssets) },
        { l:'Total Debt',      v: fmtB(last.totalDebt) },
        { l:'Cash',            v: fmtB(last.cashAndEquiv) },
        { l:'Equity',          v: fmtB(last.equity) },
        { l:'Debt / Equity',   v: last.debtEquity!=null ? last.debtEquity.toFixed(2)+'x' : '—' },
      ]
    },
    { label:'Valuation',       icon:'🎯',
      color: valuationColor,
      metrics: [
        { l:'P/E Ratio',       v: fmtX(data?.peRatio) },
        { l:'P/B Ratio',       v: fmtX(data?.pbRatio ?? last.pbRatio) },
        { l:'PEG Ratio',       v: pegRatio != null ? pegRatio.toFixed(2) : '—', color: pegColor, note: data?.pegNote },
        { l:'EV/EBITDA',       v: fmtX(data?.evEbitda ?? last.evEbitda) },
        { l:'Beta',            v: fmtN(data?.beta) },
        { l:'Mkt Cap',         v: fmtB(data?.marketCap) },
      ]
    },
  ];

  // ── Mini bar chart ──
  function BarChart({ data: bdata, getVal, color='#00e5a0', fmtFn=fmtB }) {
    const vals = bdata.map(getVal);
    const max  = Math.max(...vals.filter(v=>v!=null).map(Math.abs), 1);
    return (
      <div style={{display:'flex', alignItems:'flex-end', gap:5, height:90}}>
        {bdata.map((yr, i) => {
          const v = getVal(yr);
          const h = v==null ? 2 : Math.abs(v)/max*78;
          const c = v==null ? '#1c2730' : v<0 ? '#ff4d6d' : color;
          return (
            <div key={yr.year} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <div className="mono" style={{fontSize:7,color:'var(--text3)',textAlign:'center',lineHeight:1.2}}>
                {v==null?'—':fmtFn(v)}
              </div>
              <div style={{width:'100%',height:h,background:c,borderRadius:'2px 2px 0 0',
                opacity: i===bdata.length-1?1:0.55, minHeight:2}}/>
              <div className="mono" style={{fontSize:7,color:'var(--text3)'}}>{yr.year?.slice(-2)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const posVal    = pos.qty * pos.currentPrice;
  const posGain   = pos.qty * (pos.currentPrice - pos.avgPrice);
  const posGainPct = pos.avgPrice > 0 ? (pos.currentPrice/pos.avgPrice - 1)*100 : 0;
  const isUp      = posGain >= 0;

  return (
    <div className="fu" style={{paddingBottom:40}}>
      {/* ── Back + header ── */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button className="btn btn-ghost" style={{fontSize:12,padding:'4px 12px'}} onClick={onBack}>
          ← Back
        </button>
        <AssetLogo pos={pos}/>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10}}>
            <span className="serif" style={{fontSize:22}}>{pos.name}</span>
            <span className="mono" style={{fontSize:13,color:'var(--text3)'}}>{ticker}</span>
            {data?.sector && <span className="mono" style={{fontSize:10,color:'var(--text3)',background:'var(--surface2)',border:'1px solid var(--border)',padding:'2px 8px',borderRadius:4}}>{data.sector}</span>}
          </div>
          {data?.industry && <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{data.industry}</div>}
        </div>
      </div>

      {/* ── Position KPIs ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20}}>
        {[
          { l:'POSITION VALUE', v: fmtE(posVal),                        c: 'var(--text)' },
          { l:'AVG COST',       v: fmtE(pos.avgPrice),                  c: 'var(--text2)' },
          { l:'LIVE PRICE',     v: fmtE(pos.currentPrice),              c: 'var(--text)' },
          { l:'TOTAL P&L',      v: (isUp?'+':'')+fmtE(posGain)+' ('+posGainPct.toFixed(1)+'%)', c: isUp?'var(--green)':'var(--red)' },
        ].map(({l,v,c}) => (
          <div key={l} className="card" style={{padding:'14px 16px'}}>
            <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>{l}</div>
            <div className="mono" style={{fontSize:14,fontWeight:600,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{display:'flex',gap:6,marginBottom:20}}>
        {[['overview','Overview'],['financials','Financials'],['ratios','Ratios'],['transactions','Transactions']].map(([id,label])=>(
          <button key={id} className="btn" onClick={()=>setTab(id)}
            style={{fontSize:11,padding:'5px 14px',
              ...(tab===id?{background:'var(--green-dim)',color:'var(--green)',borderColor:'rgba(0,229,160,0.3)'}:{})}}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="card" style={{padding:60,textAlign:'center'}}>
        <span className="mono shimmer" style={{fontSize:12,color:'var(--text3)'}}>⟳ Loading fundamentals for {ticker}…</span>
      </div>}

      {error && <div className="card" style={{padding:24,color:'var(--red)',fontSize:13}}>
        ✕ Could not load fundamentals: {error}
      </div>}

      {!loading && data && (<>

        {/* ══ OVERVIEW TAB ══ */}
        {tab==='overview' && (<>
          {/* ETF: show ETF-specific overview instead of scorecard */}
          {pos.type === 'etf' ? (
            <EtfOverview pos={pos} />
          ) : (<>
          {/* Scorecard grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:16}}>
            {scorecard.slice(0,4).map(sc => (
              <div key={sc.label} className="card" style={{padding:16,borderColor:SCORE_COLOR[sc.color]+'33',background:SCORE_BG[sc.color]}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:16}}>{sc.icon}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{sc.label}</span>
                  </div>
                  <span className="mono" style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',
                    color:SCORE_COLOR[sc.color],background:SCORE_COLOR[sc.color]+'22',padding:'2px 8px',borderRadius:4}}>
                    {sc.color==='green'?'STRONG':sc.color==='gold'?'OK':sc.color==='red'?'WEAK':'N/A'}
                  </span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {sc.metrics.map(m=>(
                    <div key={m.l} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:4}}>
                      <span style={{fontSize:11,color:'var(--text2)',flexShrink:0}}>{m.l}</span>
                      <div style={{textAlign:'right'}}>
                        <span className="mono" style={{fontSize:11,fontWeight:500,color:m.color||'var(--text)'}}>{m.v}</span>
                        {m.note && <div className="mono" style={{fontSize:8,color:'var(--text3)',marginTop:1}}>{m.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Valuation card full width */}
          {(() => { const sc = scorecard[4]; return (
            <div className="card" style={{padding:16,borderColor:SCORE_COLOR[sc.color]+'33',background:SCORE_BG[sc.color],marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:16}}>{sc.icon}</span>
                  <span style={{fontSize:13,fontWeight:500}}>{sc.label}</span>
                </div>
                <span className="mono" style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',
                  color:SCORE_COLOR[sc.color],background:SCORE_COLOR[sc.color]+'22',padding:'2px 8px',borderRadius:4}}>
                  {sc.color==='green'?'CHEAP':sc.color==='gold'?'FAIR':sc.color==='red'?'EXPENSIVE':'N/A'}
                </span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
                {sc.metrics.map(m=>(
                  <div key={m.l} style={{textAlign:'center'}}>
                    <div className="mono" style={{fontSize:16,fontWeight:600,marginBottom:3,color:m.color||'inherit'}}>{m.v}</div>
                    <div className="mono" style={{fontSize:9,color:'var(--text3)'}}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          );})()}
          {/* Description */}
          {data.description && (
            <div className="card" style={{padding:16}}>
              <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>ABOUT</div>
              <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7,
                display:'-webkit-box',WebkitLineClamp:5,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                {data.description}
              </div>
            </div>
          )}
          </>)}  {/* end non-ETF scorecard */}
        </>)}

        {/* ══ FINANCIALS TAB ══ */}
        {tab==='financials' && yrs.length>0 && (<>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            {[
              {label:'REVENUE',         getVal:y=>y.revenue,        color:'#4d9fff'},
              {label:'GROSS PROFIT',    getVal:y=>y.grossProfit,    color:'#00e5a0'},
              {label:'OPERATING INCOME',getVal:y=>y.operatingIncome,color:'#a78bfa'},
              {label:'NET INCOME',      getVal:y=>y.netIncome,      color:'#00e5a0'},
              {label:'EPS',             getVal:y=>y.eps,            color:'#f0b429', fmtFn:v=>v.toFixed(2)},
              {label:'EBITDA',          getVal:y=>y.ebitda,         color:'#4d9fff'},
            ].map(({label,getVal,color,fmtFn})=>(
              <div key={label} className="card" style={{padding:14}}>
                <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:10}}>{label}</div>
                <BarChart data={yrs} getVal={getVal} color={color} fmtFn={fmtFn||fmtB}/>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            {[
              {label:'OPERATING CASH FLOW', getVal:y=>y.operatingCF,    color:'#4d9fff'},
              {label:'FREE CASH FLOW',      getVal:y=>y.freeCashFlow,   color:'#f0b429'},
              {label:'CAPEX',               getVal:y=>y.capex,          color:'#ff4d6d'},
              {label:'TOTAL DEBT',          getVal:y=>y.totalDebt,      color:'#ff4d6d'},
            ].map(({label,getVal,color})=>(
              <div key={label} className="card" style={{padding:14}}>
                <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:10}}>{label}</div>
                <BarChart data={yrs} getVal={getVal} color={color}/>
              </div>
            ))}
          </div>
          {/* Margins */}
          <div className="card" style={{padding:14}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:12}}>MARGIN TRENDS</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {[
                {label:'GROSS MARGIN',    getVal:y=>y.grossMargin,    color:'#4d9fff'},
                {label:'OPERATING MARGIN',getVal:y=>y.operatingMargin,color:'#a78bfa'},
                {label:'NET MARGIN',      getVal:y=>y.netMargin,      color:'#00e5a0'},
              ].map(({label,getVal,color})=>(
                <div key={label}>
                  <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>{label}</div>
                  <BarChart data={yrs} getVal={getVal} color={color} fmtFn={fmtPct}/>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ══ RATIOS TAB ══ */}
        {tab==='ratios' && (<>
          <div className="card" style={{padding:0,overflow:'hidden',marginBottom:12}}>
            <div style={{padding:'12px 16px',background:'var(--surface2)',borderBottom:'1px solid var(--border)'}}>
              <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em'}}>KEY RATIOS (5Y)</div>
            </div>
            {/* Header */}
            <div style={{display:'grid',gridTemplateColumns:'160px repeat(5,1fr)',padding:'8px 16px',
              borderBottom:'1px solid var(--border)',background:'var(--surface2)'}}>
              <div className="mono" style={{fontSize:9,color:'var(--text3)'}}>METRIC</div>
              {yrs.map(y=><div key={y.year} className="mono" style={{fontSize:9,color:'var(--text3)',textAlign:'right'}}>{y.year}</div>)}
            </div>
            {[
              { l:'P/E Ratio',      get:y=>y.peRatio,      fmt:fmtX },
              { l:'P/B Ratio',      get:y=>y.pbRatio,      fmt:fmtX },
              { l:'EV/EBITDA',      get:y=>y.evEbitda,     fmt:fmtX },
              { l:'FCF Yield',      get:y=>y.fcfYield,     fmt:fmtPct },
              { l:'ROIC',           get:y=>y.roic,         fmt:fmtPct },
              { l:'ROE',            get:y=>y.roe,          fmt:fmtPct },
              { l:'Net Margin',     get:y=>y.netMargin,    fmt:fmtPct },
              { l:'Gross Margin',   get:y=>y.grossMargin,  fmt:fmtPct },
              { l:'Debt / Equity',  get:y=>y.debtEquity,   fmt:v=>v.toFixed(2)+'x' },
              { l:'EPS',            get:y=>y.eps,          fmt:v=>'$'+v.toFixed(2) },
            ].map(({l,get,fmt},ri)=>(
              <div key={l} style={{display:'grid',gridTemplateColumns:'160px repeat(5,1fr)',
                padding:'9px 16px',borderBottom:'1px solid var(--border)',
                background:ri%2===0?'transparent':'var(--surface2)'}}>
                <div style={{fontSize:12,color:'var(--text2)'}}>{l}</div>
                {yrs.map(y=>{
                  const v=get(y);
                  return <div key={y.year} className="mono" style={{fontSize:12,textAlign:'right',
                    color:v==null?'var(--text3)':'var(--text)'}}>{v==null?'—':fmt(v)}</div>;
                })}
              </div>
            ))}
          </div>

          {/* Balance sheet snapshot */}
          <div className="card" style={{padding:16}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:14}}>BALANCE SHEET TREND</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                {label:'TOTAL ASSETS', getVal:y=>y.totalAssets, color:'#4d9fff'},
                {label:'EQUITY',       getVal:y=>y.equity,      color:'#00e5a0'},
              ].map(({label,getVal,color})=>(
                <div key={label}>
                  <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>{label}</div>
                  <BarChart data={yrs} getVal={getVal} color={color}/>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ══ TRANSACTIONS TAB ══ */}
        {tab==='transactions' && (() => {
          const txs = (transactions||[])
            .filter(t => t.isin === pos.isin)
            .sort((a,b) => b.date.localeCompare(a.date));

          if (!txs.length) return (
            <div className="card" style={{padding:40,textAlign:'center',color:'var(--text3)',fontSize:13}}>
              No transactions found for this position.
            </div>
          );

          // Running P&L per lot: for each buy, P&L = (currentPrice - buyPrice) * qty
          // For sells: realised P&L = (sellPrice - avgCost) * qty — we approximate with sell price vs pos.avgPrice
          const totalInvested = txs.filter(t=>t.type==='buy').reduce((s,t)=>s+t.amountEur,0);
          const totalRealized = txs.filter(t=>t.type==='sell').reduce((s,t)=>s+t.amountEur,0);

          // Build chart: fetch 1Y historical prices + overlay buy/sell markers
          const ticker = pos.fmpTicker?.split('.')[0] || ISIN_MAP[pos.isin] || pos.symbol?.split('.')[0];

          return (
            <div>
              {/* ── Price chart with buy/sell markers ── */}
              {ticker && <TxPriceChart ticker={ticker} txs={txs} currentPrice={pos.currentPrice}/>}

              {/* Summary bar */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
                {[
                  { l:'TOTAL INVESTED', v: fmtE(totalInvested), c:'var(--text)' },
                  { l:'TOTAL SOLD',     v: fmtE(totalRealized), c:'var(--text)' },
                  { l:'TRANSACTIONS',   v: txs.length,          c:'var(--text)' },
                ].map(({l,v,c})=>(
                  <div key={l} className="card" style={{padding:'12px 14px'}}>
                    <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>{l}</div>
                    <div className="mono" style={{fontSize:14,fontWeight:600,color:c}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Transaction list */}
              <div className="card" style={{padding:0,overflow:'hidden'}}>
                {/* Header */}
                <div style={{display:'grid',gridTemplateColumns:'90px 1fr 1fr 1fr',
                  padding:'8px 16px',background:'var(--surface2)',borderBottom:'1px solid var(--border)'}}>
                  {['DATE','DETAILS','AMOUNT','P&L'].map(h=>(
                    <div key={h} className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',
                      textAlign: h==='DATE'?'left':'right'}}>{h}</div>
                  ))}
                </div>

                {txs.map((tx, i) => {
                  const isBuy  = tx.type === 'buy';
                  const pricePerShare = tx.qty > 0 ? tx.amountEur / tx.qty : 0;
                  // P&L: unrealised for buys (vs current price), realised for sells (vs avg cost)
                  const pnl = isBuy
                    ? (pos.currentPrice - pricePerShare) * tx.qty
                    : (pricePerShare - pos.avgPrice) * tx.qty;
                  const pnlPct = pricePerShare > 0
                    ? ((isBuy ? pos.currentPrice : pricePerShare) / pricePerShare - 1) * 100 * (isBuy ? 1 : -1) * (isBuy ? 1 : -1)
                    : 0;
                  const pnlUp = pnl >= 0;

                  return (
                    <div key={i} style={{
                      display:'grid', gridTemplateColumns:'90px 1fr 1fr 1fr',
                      padding:'12px 16px', borderBottom: i<txs.length-1?'1px solid var(--border)':'none',
                      alignItems:'center',
                    }}>
                      {/* Date + type badge */}
                      <div>
                        <div style={{marginBottom:4}}>
                          <span style={{
                            fontSize:9, fontWeight:700, letterSpacing:'0.06em',
                            padding:'2px 7px', borderRadius:4,
                            background: isBuy?'rgba(0,229,160,0.12)':'rgba(255,77,109,0.12)',
                            color: isBuy?'var(--green)':'var(--red)',
                          }}>
                            {isBuy ? 'BUY' : 'SELL'}
                          </span>
                        </div>
                        <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>{tx.date}</div>
                      </div>

                      {/* Qty × price */}
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:13,fontWeight:500}}>
                          {tx.qty % 1 === 0 ? tx.qty : tx.qty.toFixed(4)} × {fmtE(pricePerShare)}
                        </div>
                        <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>
                          {tx.qty % 1 === 0 ? tx.qty : tx.qty.toFixed(4)} Stk.
                        </div>
                      </div>

                      {/* Total amount */}
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:13,fontWeight:500}}>{fmtE(tx.amountEur)}</div>
                      </div>

                      {/* P&L */}
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:13,fontWeight:600,
                          color: pnlUp?'var(--green)':'var(--red)'}}>
                          {pnlUp?'+':''}{fmtE(pnl)}
                        </div>
                        <div className="mono" style={{fontSize:10,
                          color: pnlUp?'var(--green)':'var(--red)'}}>
                          {isBuy ? 'unrealised' : 'realised'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </>)}
    </div>
  );
}


export default function App() {
  const [positions,   setPositions]   = useState([]);
  const positionsRef = React.useRef([]);
  React.useEffect(()=>{ positionsRef.current = positions; }, [positions]);
  // FMP key is server-side only (Vercel env var FMP_KEY)
  const [transactions, setTransactions] = useState([]);
  const [priceLoading,setPriceLoading]= useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nav,         setNav]         = useState("dashboard");
  const [showModal,   setShowModal]   = useState(false);
  const [showImport,  setShowImport]  = useState(false);
  const [range,       setRange]       = useState("1Y");
  const [activeBrokers, setActiveBrokers] = useState({"Bitvavo":true,"Smartbroker+":true,"Trade Republic":true});
  const [activeBM,    setActiveBM]    = useState(["sp500"]);
  const [fBroker,     setFBroker]     = useState("All");
  const [fType,       setFType]       = useState("All");
  const [sortBy,      setSortBy]      = useState("value");
  const [sortDir,     setSortDir]     = useState("desc");
  const [newPos,      setNewPos]      = useState({symbol:"",name:"",type:"stock",qty:"",avgPrice:"",currentPrice:"",broker:"Smartbroker+"});
  const [selectedPos,  setSelectedPos]  = useState(null);

  // ── Fetch live prices ──
  // ── Data fetching — powered by FMP (Financial Modeling Prep) ──
  // All calls go through /api/fmp Vercel proxy to keep key server-side
  const fmpGet = useCallback(async (path) => {
    const r = await fetch('/api/fmp?path=' + encodeURIComponent(path));
    if (!r.ok) throw new Error('fmp ' + r.status);
    const text = await r.text();
    // Handle plain-text premium errors ("Premium Query : ...")
    if (text.startsWith('Premium') || text.includes('Premium Query')) throw new Error('Premium');
    let data;
    try { data = JSON.parse(text); } catch(e) { throw new Error('parse: ' + text.slice(0,80)); }
    if (data?.error === 'Premium' || data?.['Error Message']?.includes('Premium')) throw new Error('Premium');
    if (data?.['Error Message']) throw new Error(data['Error Message']);
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const fetchPrices = useCallback(async () => {
    const cur = positionsRef.current;
    if(!cur.length){ setPriceLoading(false); return; }
    setPriceLoading(true);
    try {
      let eurUsd = 1.085;
      try {
        const fx = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR').then(r=>r.json());
        eurUsd = 1/(fx?.rates?.EUR||0.92);
      } catch(e){}

      // Crypto: CoinGecko
      const cryptoPos = cur.filter(p=>p.type==='crypto'&&p.coinId);
      if(cryptoPos.length){
        const ids=[...new Set(cryptoPos.map(p=>p.coinId))].join(',');
        try {
          const cg = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=eur').then(r=>r.json());
          setPositions(prev=>prev.map(p=>p.type==='crypto'&&p.coinId&&cg[p.coinId]?.eur?{...p,currentPrice:cg[p.coinId].eur}:p));
        } catch(e){}
      }

      // Stocks/ETFs: FMP
      const stockPos = cur.filter(p=>p.type!=='crypto'&&p.type!=='derivative');
      if(!stockPos.length){ setLastUpdated(new Date()); return; }
      const getT = p => {
        if(p.fmpTicker) return p.fmpTicker;
        // Check ISIN_MAP first (pre-mapped known tickers)
        if(p.isin && ISIN_MAP[p.isin]) return ISIN_MAP[p.isin];
        // If symbol is an ISIN (not yet resolved), we can't use it as ticker
        if(p.isin && isISIN(p.symbol)) {
          // Guess ticker from ISIN country prefix
          if(p.isin.startsWith('DE')||p.isin.startsWith('LU')) return null; // needs FMP search
          if(p.isin.startsWith('IE')) return null;
          return null;
        }
        // symbol is already a real ticker
        if(p.isin?.startsWith('DE')||p.isin?.startsWith('LU')) return p.symbol+'.DE';
        if(p.isin?.startsWith('IE')) return p.symbol+'.AS';
        return p.symbol;
      };
      // Resolve any unresolved ISINs via FMP search
      const needsResolution = stockPos.filter(p => !getT(p) && p.isin);
      if(needsResolution.length) {
        await Promise.all(needsResolution.slice(0,20).map(async p => {
          try {
            const res = await fmpGet('/search-isin?isin='+p.isin);
            if(!Array.isArray(res)||!res.length) return;
            const pick = res.find(r=>r.symbol?.endsWith('.DE'))
              || res.find(r=>r.symbol?.endsWith('.F'))
              || res.find(r=>r.symbol?.endsWith('.AS')||r.symbol?.endsWith('.PA'))
              || res.find(r=>r.marketCap>0) || res[0];
            if(pick?.symbol) {
              const resolvedTk = pick.symbol.split('.')[0].toUpperCase();
              const correctedType = inferType(resolvedTk, p.isin, p.name, p.type);
              setPositions(prev=>prev.map(q=>q.isin===p.isin?{...q,fmpTicker:pick.symbol,type:correctedType}:q));
              p.fmpTicker = pick.symbol; // also update local ref
            }
          } catch(e){}
        }));
      }
      const tickerList=[...new Set(stockPos.map(getT).filter(Boolean))];
      if(!tickerList.length){ setLastUpdated(new Date()); return; }
      const quotes = await fmpGet('/quotes?symbols='+tickerList.join(','));
      const pm={};
      (Array.isArray(quotes)?quotes:[]).forEach(q=>{ pm[q.symbol]=q.currency==='USD'?q.price/eurUsd:q.price; });
      setPositions(prev=>prev.map(p=>{
        if(p.type==='crypto'||p.type==='derivative') return p;
        const t=getT(p); return pm[t]?{...p,currentPrice:pm[t]}:p;
      }));
      setLastUpdated(new Date());
    } catch(e){ console.warn('fetchPrices error:',e); }
    finally{ setPriceLoading(false); }
  }, [fmpGet]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  // Derived values
  const vis       = useMemo(()=>positions.filter(p=>activeBrokers[p.broker]),[positions,activeBrokers]);
  const totalVal  = useMemo(()=>vis.reduce((s,p)=>s+p.qty*p.currentPrice,0),[vis]);
  const totalCost = useMemo(()=>vis.reduce((s,p)=>s+p.qty*p.avgPrice,0),[vis]);
  const pnl       = totalVal-totalCost;
  const pnlPct    = (pnl/totalCost)*100;

  // ── Real historical chart ──────────────────────────────────────
  const [chartData,    setChartData]    = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError,   setChartError]   = useState(null);

  // Benchmark ticker map for FMP
  const BM_TICKERS = {sp500:'SPY',nasdaq:'QQQ',dax:'DAX',btc:'BTCUSD'};

  // Invested = net cash deployed to broker = cumulative buys - cumulative sells
  // This approximates "money wired in minus money taken out" since we don't
  // have explicit deposit/withdrawal records in the Smartbroker export
  const investedChartData = useMemo(()=>{
    if(!transactions.length) return [];
    const months = RANGE_MONTHS[range] ?? 12;
    const now    = new Date(2026,2,7);
    const sorted0 = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));
    const requestedFrom = new Date(now); requestedFrom.setMonth(requestedFrom.getMonth()-months);
    const firstTx = sorted0[0]?.date;
    const from = (firstTx && new Date(firstTx) > requestedFrom) ? new Date(firstTx) : requestedFrom;
    const fromStr = from.toISOString().slice(0,10);
    const toStr   = now.toISOString().slice(0,10);
    const totalDays = Math.round((now-from)/86400000);
    const sorted = sorted0;

    // Cumulative buys = total capital ever deployed (always positive)
    let cumBuys = 0;
    sorted.filter(t=>t.date<fromStr&&t.type==='buy').forEach(t=>{ cumBuys+=t.amountEur; });

    const inWindow = sorted.filter(t=>t.date>=fromStr&&t.date<=toStr);
    const step = Math.max(1, Math.floor(totalDays/180));
    const rows = [];
    let ti=0;
    for(let i=0;i<=totalDays;i+=step){
      const d = new Date(from); d.setDate(d.getDate()+i);
      const ds = d.toISOString().slice(0,10);
      while(ti<inWindow.length && inWindow[ti].date<=ds){
        const t=inWindow[ti++];
        if(t.type==='buy') cumBuys+=t.amountEur;
      }
      rows.push({
        date: d.toLocaleDateString('de-DE',{day:'2-digit',month:'short'}),
        invested: +cumBuys.toFixed(0),
      });
    }
    return rows;
  }, [transactions, range]);

  const fetchChart = useCallback(async () => {
    if(!transactions.length || !positions.length) return;
    setChartLoading(true); setChartError(null);
    try {
      const months = RANGE_MONTHS[range] ?? 12;
      const now    = new Date(2026,2,7);
      const toStr  = now.toISOString().slice(0,10);

      // ── Sort transactions first (needed to clamp window start) ──
      const sorted = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));

      // Clamp window start to first transaction date
      const requestedFrom = new Date(now); requestedFrom.setMonth(requestedFrom.getMonth()-months);
      const firstTxDate = sorted[0]?.date;
      const from = firstTxDate && new Date(firstTxDate) > requestedFrom
        ? new Date(firstTxDate)
        : requestedFrom;
      const fromStr = from.toISOString().slice(0,10);
      const totalDays = Math.round((now-from)/86400000);
      const step = Math.max(1, Math.floor(totalDays/180));

      // ── Ticker resolver ──
      const getT = p => {
        if(p.fmpTicker) return p.fmpTicker;
        if(!p.isin) return p.symbol;
        if(p.isin.startsWith('DE')||p.isin.startsWith('LU')) return p.symbol+'.DE';
        if(p.isin.startsWith('IE')) return p.symbol+'.AS';
        if(p.isin.startsWith('GB')) return p.symbol+'.L';
        return p.symbol;
      };

      // ── Reconstruct exact qty per ISIN per day ──
      const allIsins = [...new Set(sorted.map(t=>t.isin).filter(Boolean))];

      // ── Qty reconstruction ──
      // Strategy: use current depot qty as ground truth, work backwards using ALL transactions
      // This correctly handles positions bought before transaction history starts
      const depotQty = {};
      positions.forEach(p=>{ if(p.isin) depotQty[p.isin] = p.qty||0; });

      // For each ISIN: qty on day D = depotQty - sum(buys after D) + sum(sells after D)
      const qtyByDay = {};
      allIsins.forEach(isin=>{
        const txs = sorted.filter(t=>t.isin===isin);
        qtyByDay[isin] = new Float64Array(totalDays+1);
        for(let i=0;i<=totalDays;i++){
          const d=new Date(from); d.setDate(d.getDate()+i);
          const ds=d.toISOString().slice(0,10);
          // qty at ds = current qty minus all buys after ds + all sells after ds
          let qty = depotQty[isin]||0;
          txs.filter(t=>t.date>ds).forEach(t=>{
            qty -= t.type==='buy' ? t.qty : -t.qty;
          });
          qtyByDay[isin][i] = Math.max(0, qty);
        }
      });

      // qtyByDay built above

      // ── EUR/USD ──
      let eurUsd=1.085;
      try{ const fx=await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR').then(r=>r.json()); eurUsd=1/(fx?.rates?.EUR||0.92); }catch(e){}

      // ── Resolve ISIN → FMP ticker ──
      const isinToTicker={};
      const pickTicker = (results, isin) => {
        if(!Array.isArray(results)||!results.length) return null;
        // US ISINs: prefer clean US ticker (no suffix) — APC.DE/NVD.DE are wrong German mappings
        if(isin?.startsWith('US')) {
          return (results.find(r=>!r.symbol?.includes('.'))
            || results.find(r=>r.marketCap>0)
            || results[0])?.symbol || null;
        }
        // EU ISINs: prefer home exchange
        return (results.find(r=>r.symbol?.endsWith('.DE'))
          || results.find(r=>r.symbol?.endsWith('.F'))
          || results.find(r=>r.symbol?.endsWith('.AS')||r.symbol?.endsWith('.PA'))
          || results.find(r=>r.marketCap>0)
          || results[0])?.symbol || null;
      };

      // Step 1: use fmpTicker if already resolved, or ISIN_MAP
      positions.forEach(p=>{
        if(!p.isin||p.type==='crypto'||p.type==='derivative') return;
        if(p.fmpTicker) { isinToTicker[p.isin]=p.fmpTicker; return; }
        if(ISIN_MAP[p.isin]) { isinToTicker[p.isin]=ISIN_MAP[p.isin]; return; }
      });

      // Step 2: search FMP for all remaining ISINs (current + sold positions)
      const needsSearch = allIsins.filter(isin=>{
        const pos = positions.find(p=>p.isin===isin);
        if(pos?.type==='crypto'||pos?.type==='derivative') return false;
        return !isinToTicker[isin];
      });
      console.log('Searching FMP for', needsSearch.length, 'ISINs, already resolved:', Object.keys(isinToTicker).length);
      await Promise.all(needsSearch.slice(0,30).map(async isin=>{
        try{
          const res = await fmpGet('/search-isin?isin='+isin);
          const t = pickTicker(res, isin);
          if(t) { isinToTicker[isin]=t; console.log(isin,'->',t); }
          else console.warn('no ticker for', isin);
        }catch(e){ console.warn('search fail', isin, e.message); }
      }));
      console.log('Total resolved:', Object.keys(isinToTicker).length, '/', allIsins.length);
      console.log('Sample tickers:', Object.values(isinToTicker).slice(0,10));

      // ── Price history per ticker ──
      const priceByIsin={};
      const skippedTickers=[];
      const uniqueTickers = [...new Set(Object.values(isinToTicker))];
      await Promise.all(uniqueTickers.map(async ticker=>{
        try{
          const data = await fmpGet('/historical-price-eod/full?symbol='+ticker+'&from='+fromStr+'&to='+toStr);
          // premium check now handled in fmpGet via throw
          // Stable API returns flat array, not {historical:[]}
          const hist = Array.isArray(data) ? data : (data?.historical||[]);
          if(!hist.length){ skippedTickers.push(ticker+'(no data)'); return; }
          const isins = Object.entries(isinToTicker).filter(([,t])=>t===ticker).map(([i])=>i);
          const isUsd = !ticker.endsWith('.DE')&&!ticker.endsWith('.F')&&!ticker.endsWith('.AS')&&!ticker.endsWith('.PA')&&!ticker.endsWith('.L');
          isins.forEach(isin=>{
            priceByIsin[isin]={};
            hist.forEach(h=>{ priceByIsin[isin][h.date]=isUsd?h.close/eurUsd:h.close; });
          });
        }catch(e){ if(e.message==='Premium') skippedTickers.push(ticker+'(premium)'); else { skippedTickers.push(ticker+'(err)'); console.warn('hist fail:',ticker,e.message); } }
      }));

      // ── Crypto via CoinGecko ──
      const cryptoPos = positions.filter(p=>p.type==='crypto'&&p.coinId&&p.qty>0);
      await Promise.all(cryptoPos.map(async p=>{
        if(!p.isin) return;
        try{
          const cg=await fetch('https://api.coingecko.com/api/v3/coins/'+p.coinId+'/market_chart?vs_currency=eur&days='+(months*30+5)).then(r=>r.json());
          priceByIsin[p.isin]={};
          (cg.prices||[]).forEach(([ts,pr])=>{ priceByIsin[p.isin][new Date(ts).toISOString().slice(0,10)]=pr; });
        }catch(e){}
      }));

      // ── Benchmark history ──
      const BM_FMP={sp500:'SPY',nasdaq:'QQQ',dax:'EWG',btc:'GBTC'};
      const bmPrices={};
      await Promise.all(activeBM.map(async id=>{
        try{
          const data=await fmpGet('/historical-price-eod/full?symbol='+encodeURIComponent(BM_FMP[id])+'&from='+fromStr+'&to='+toStr);
          // premium check now handled in fmpGet via throw
          bmPrices[id]={};
          const bmHist = Array.isArray(data) ? data : (data?.historical||[]);
          bmHist.forEach(h=>{ bmPrices[id][h.date]=h.close; });
        }catch(e){}
      }));

      // ── Build carry-forward price maps (every day, no step) ──
      const lastPrice={};
      const lastBmPrice={};
      // priceOnDay[isin][i] = price at day i (carry-forward filled)
      const priceOnDay={};
      allIsins.forEach(isin=>{ priceOnDay[isin]=new Float64Array(totalDays+1); });
      for(let i=0;i<=totalDays;i++){
        const d=new Date(from); d.setDate(d.getDate()+i);
        const ds=d.toISOString().slice(0,10);
        allIsins.forEach(isin=>{
          const p=priceByIsin[isin]?.[ds];
          if(p!=null) lastPrice[isin]=p;
          priceOnDay[isin][i]=lastPrice[isin]||0;
        });
        activeBM.forEach(id=>{ if(bmPrices[id]?.[ds]) lastBmPrice[id]=bmPrices[id][ds]; });
      }
      // bmPriceOnDay[id][i] = benchmark price at day i (carry-forward filled)
      const bmPriceOnDay={};
      activeBM.forEach(id=>{
        bmPriceOnDay[id]=new Float64Array(totalDays+1);
        Object.keys(lastBmPrice).forEach(k=>delete lastBmPrice[k]);
        for(let i=0;i<=totalDays;i++){
          const d=new Date(from); d.setDate(d.getDate()+i);
          const ds=d.toISOString().slice(0,10);
          if(bmPrices[id]?.[ds]) lastBmPrice[id]=bmPrices[id][ds];
          bmPriceOnDay[id][i]=lastBmPrice[id]||0;
        }
      });

      // ── Benchmark = hypothetical portfolio that invested same cash flows into benchmark ──
      // On each buy transaction, "buy" equivalent benchmark units at that day's price.
      // This makes the comparison fair regardless of when capital was deployed.
      const bmUnits={};  // benchmark units accumulated per id
      activeBM.forEach(id=>{ bmUnits[id]=0; });
      // Sort all buy transactions by date index
      const sortedBuys = sorted
        .filter(t=>t.type==='buy' && t.amountEur>0)
        .map(t=>{
          const txD = new Date(t.date);
          const i = Math.max(0, Math.round((txD-from)/86400000));
          return {i: Math.min(i, totalDays), amount: t.amountEur};
        });
      // Accumulate benchmark units as capital is deployed
      // bmUnits[id] after all buys = total units if you'd invested all buys into benchmark
      const bmUnitsOnDay={};
      activeBM.forEach(id=>{
        bmUnitsOnDay[id]=new Float64Array(totalDays+1);
        let units=0;
        let buyIdx=0;
        for(let i=0;i<=totalDays;i++){
          while(buyIdx<sortedBuys.length && sortedBuys[buyIdx].i<=i){
            const bp=bmPriceOnDay[id][sortedBuys[buyIdx].i];
            if(bp>0) units+=sortedBuys[buyIdx].amount/bp;
            buyIdx++;
          }
          bmUnitsOnDay[id][i]=units;
        }
      });

      // ── Assemble rows ──
      const rows=[];
      for(let i=0;i<=totalDays;i+=step){
        const d=new Date(from); d.setDate(d.getDate()+i);
        const baseRow=investedChartData[Math.round(i/step)]||{};

        let portVal=0;
        allIsins.forEach(isin=>{
          const qty=qtyByDay[isin]?.[i]||0; if(qty<=0) return;
          const p=priceOnDay[isin][i]; if(!p) return;
          portVal+=qty*p;
        });

        const row={
          date:baseRow.date||d.toLocaleDateString('de-DE',{day:'2-digit',month:'short'}),
          invested:baseRow.invested||0,
          ...(portVal>0?{portfolio:+portVal.toFixed(2)}:{}),
        };
        activeBM.forEach(id=>{
          const units=bmUnitsOnDay[id][i];
          const p=bmPriceOnDay[id][i];
          if(units>0&&p>0) row[id]=+(units*p).toFixed(0);
        });
        rows.push(row);
      }

      setChartData(rows);
      if(skippedTickers.length>0){
        const covered = uniqueTickers.length - skippedTickers.length;
        setChartError(`Partial data — ${covered}/${uniqueTickers.length} positions loaded. Missing: ${skippedTickers.join(', ')}`);
      }
    }catch(e){ console.error('fetchChart:',e); setChartError(e.message); }
    finally{ setChartLoading(false); }
  }, [transactions, positions, range, activeBM, fmpGet, investedChartData]);

  useEffect(()=>{ fetchChart(); }, [fetchChart]);

  const chartDomain = useMemo(()=>{
    const data = chartData.length ? chartData : investedChartData;
    if(!data.length) return ['auto','auto'];
    let mn=Infinity,mx=-Infinity;
    data.forEach(row=>{ ['portfolio',...activeBM].forEach(k=>{ if(row[k]!=null&&row[k]>0){if(row[k]<mn)mn=row[k];if(row[k]>mx)mx=row[k];} }); });
    if(!isFinite(mn)) return ['auto','auto'];
    const pad=(mx-mn)*0.12;
    return [Math.floor(mn-pad),Math.ceil(mx+pad)];
  },[chartData,investedChartData,activeBM]);
  const perfStats = useMemo(()=>{
    if(!chartData.length) return {};
    const f=chartData[0],l=chartData[chartData.length-1],st={};
    ["portfolio",...activeBM].forEach(k=>{ if(f[k]&&l[k]) st[k]=+((l[k]-f[k])/f[k]*100).toFixed(2); });
    return st;
  },[chartData,activeBM]);

  const allocData = useMemo(()=>vis.map((p,i)=>({name:p.symbol,value:+((p.qty*p.currentPrice/totalVal)*100).toFixed(2),color:ALLOC_COLORS[i%ALLOC_COLORS.length]})),[vis,totalVal]);
  const byType    = useMemo(()=>["crypto","stock","etf"].map(t=>({name:t.toUpperCase(),value:+((vis.filter(p=>p.type===t).reduce((s,p)=>s+p.qty*p.currentPrice,0)/totalVal*100).toFixed(1)),color:t==="crypto"?"#f7931a":t==="stock"?"#00e5a0":"#627eea"})).filter(x=>x.value>0),[vis,totalVal]);
  const tableRows = useMemo(()=>{
    const rows = positions.filter(p=>(fBroker==="All"||p.broker===fBroker)&&(fType==="All"||p.type===fType));
    return [...rows].sort((a,b)=>{
      const mul = sortDir==="asc"?1:-1;
      if(sortBy==="name")   return mul*a.symbol.localeCompare(b.symbol);
      if(sortBy==="value")  return mul*(a.qty*a.currentPrice-b.qty*b.currentPrice);
      if(sortBy==="pnl")    return mul*((a.qty*a.currentPrice-a.qty*a.avgPrice)-(b.qty*b.currentPrice-b.qty*b.avgPrice));
      if(sortBy==="pnlpct") return mul*(((a.currentPrice-a.avgPrice)/a.avgPrice)-((b.currentPrice-b.avgPrice)/b.avgPrice));
      if(sortBy==="qty")    return mul*(a.qty-b.qty);
      if(sortBy==="price")  return mul*(a.currentPrice-b.currentPrice);
      return 0;
    });
  },[positions,fBroker,fType,sortBy,sortDir]);
  function toggleSort(col){ if(sortBy===col) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortBy(col);setSortDir("desc");} }

  function toggleBM(id){ setActiveBM(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }

  function addPos() {
    if(!newPos.symbol||!newPos.qty||!newPos.currentPrice) return;
    setPositions(prev=>[...prev,{id:Date.now(),...newPos,qty:parseFloat(newPos.qty),avgPrice:parseFloat(newPos.avgPrice)||parseFloat(newPos.currentPrice),currentPrice:parseFloat(newPos.currentPrice),color:ALLOC_COLORS[prev.length%ALLOC_COLORS.length]}]);
    setShowModal(false);
    setNewPos({symbol:"",name:"",type:"stock",qty:"",avgPrice:"",currentPrice:"",broker:"Smartbroker+"});
  }

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"var(--bg)"}}>

        {/* ── Sidebar ── */}
        <div className="sidebar" style={{width:220,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:"20px 12px"}}>
          <div style={{padding:"4px 14px 24px"}}>
            <div className="serif" style={{fontSize:20,letterSpacing:"-0.02em"}}>folio<span style={{color:"var(--green)"}}>.</span></div>
            <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.12em",marginTop:2}}>EU INVESTOR PLATFORM</div>
            <div className="mono" style={{fontSize:8,color:"var(--green)",letterSpacing:"0.08em",marginTop:2,opacity:0.7}}>v35 · ETF __data.json sectors+countries</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {NAV_ITEMS.map(item=>(
              <div key={item.id} className={`nav-item${nav===item.id?" active":""}`} onClick={()=>setNav(item.id)}>
                <span style={{fontSize:14}}>{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
          <div style={{flex:1}}/>
          <div style={{padding:"0 14px"}}>
            <div style={{borderTop:"1px solid var(--border)",paddingTop:14,marginBottom:12}}>
              <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:8}}>CONNECTED BROKERS</div>
              {BROKERS_LIST.map(b=>(
                <div key={b} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span className="ldot" style={{width:5,height:5}}/><span style={{fontSize:11,color:"var(--text2)"}}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{background:"var(--green-dim)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:6,padding:"8px 10px"}}>
              <div className="mono" style={{fontSize:9,color:"var(--green)",letterSpacing:"0.1em"}}>PRO PLAN</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>All features unlocked</div>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="main-scroll" style={{flex:1,overflow:"auto",padding:"26px 30px"}}>

          {/* Header */}
          <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
            <div>
              <div className="serif" style={{fontSize:24,letterSpacing:"-0.02em"}}>
                {nav==="dashboard"?"Overview":nav==="portfolio"?"Portfolio":nav==="stock"&&selectedPos?selectedPos.symbol:nav==="screener"?"Screener":nav==="news"?"News Feed":"Settings"}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
                <span className="ldot"/>
                <span className="mono" style={{fontSize:10,color:"var(--text2)"}}>
                  {priceLoading ? "Fetching live prices…" : `Updated ${lastUpdated?.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}`}
                </span>
                {!priceLoading && (
                  <button onClick={fetchPrices} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",fontSize:11,padding:"0 4px"}} title="Refresh prices">↻</button>
                )}
                <PriceBadge loading={priceLoading}/>
              </div>
            </div>
            <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ ADD POSITION</button>
          </div>

          {(nav==="dashboard"||nav==="portfolio")&&(<>

            {/* Empty state */}
            {positions.length === 0 && (
              <div className="fu card" style={{padding:"60px 40px",textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:48,marginBottom:16}}>📂</div>
                <div className="serif" style={{fontSize:24,marginBottom:8}}>Your portfolio is empty</div>
                <div style={{fontSize:13,color:"var(--text2)",marginBottom:28,maxWidth:400,margin:"0 auto 28px"}}>
                  Import your positions from Bitvavo, Trade Republic, Smartbroker+ or any broker CSV to get started.
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button className="btn btn-primary" onClick={()=>{setNav("settings");setShowImport(true)}}>↑ Import CSV</button>
                  <button className="btn btn-ghost" onClick={()=>setShowModal(true)}>+ Add manually</button>
                </div>
              </div>
            )}


            <div className="fu2 kpi-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {label:"PORTFOLIO VALUE", val: priceLoading?"Loading…":`€${fmt(totalVal,0)}`, sub:`${vis.length} positions`, bar:null},
                {label:"TOTAL P&L",       val: priceLoading?"…":`${pnl>=0?"+":"-"}€${fmt(Math.abs(pnl),0)}`, sub:`${pnl>=0?"▲":"▼"} ${fmt(Math.abs(pnlPct))}%`, bar:pnl>=0?"g":"r"},
                {label:"INVESTED",        val:`€${fmt(totalCost,0)}`, sub:"Cost basis", bar:"n"},
                {label:"LIVE PRICES",     val: priceLoading?"Syncing…":"Active", sub:"CoinGecko + FMP", bar:priceLoading?null:"g"},
              ].map((k,i)=>(
                <div key={i} className="card" style={{padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:k.bar==="g"?"var(--green)":k.bar==="r"?"var(--red)":"var(--border2)"}}/>
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:7}}>{k.label}</div>
                  <div className="mono" style={{fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:k.bar==="g"?"var(--green)":k.bar==="r"?"var(--red)":"var(--text)"}}>{k.val}</div>
                  <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* ═══ PERFORMANCE + ALLOCATION ═══ */}
            <div className="fu3 card" style={{padding:"20px 20px 14px",marginBottom:16}}>
              {/* Header row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div className="mono" style={{fontSize:10,color:"var(--text2)",letterSpacing:"0.1em"}}>PERFORMANCE</div>
                  {perfStats.portfolio!=null&&<span className="mono" style={{fontSize:10,color:perfStats.portfolio>=0?"var(--green)":"var(--red)",fontWeight:600}}>{perfStats.portfolio>=0?"+":""}{perfStats.portfolio}%</span>}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {BENCHMARKS.map(b=>(
                    <button key={b.id} onClick={()=>setActiveBM(a=>a.includes(b.id)?a.filter(x=>x!==b.id):[...a,b.id])}
                      className="btn" style={{fontSize:10,padding:"3px 10px",borderColor:activeBM.includes(b.id)?b.color:"var(--border)",color:activeBM.includes(b.id)?b.color:"var(--text3)",background:activeBM.includes(b.id)?"rgba("+b.color.slice(1).match(/../g).map(x=>parseInt(x,16)).join(",")+",0.08)":"transparent"}}>
                      {b.label}{perfStats[b.id]!=null&&<span style={{marginLeft:4,opacity:0.8}}>{perfStats[b.id]>=0?"+":""}{perfStats[b.id]}%</span>}
                    </button>
                  ))}
                  <div style={{width:1,background:"var(--border)",margin:"0 2px"}}/>
                  {["1M","3M","6M","YTD","1Y","ALL"].map(r=>(
                    <button key={r} onClick={()=>setRange(r)} className="btn"
                      style={{fontSize:10,padding:"3px 10px",borderColor:range===r?"var(--green)":"var(--border)",color:range===r?"var(--green)":"var(--text3)",background:range===r?"rgba(0,229,160,0.08)":"transparent"}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {chartError && (
                <div style={{padding:"8px 12px",marginBottom:8,
                  background:chartError.includes('Partial')?"rgba(240,180,41,0.08)":"rgba(255,77,109,0.1)",
                  border:"1px solid "+(chartError.includes('Partial')?"rgba(240,180,41,0.3)":"rgba(255,77,109,0.3)"),
                  borderRadius:6,fontSize:11,color:chartError.includes('Partial')?"var(--gold)":"var(--red)",fontFamily:"IBM Plex Mono"}}>
                  ⚠ {chartError}
                </div>
              )}

              {/* Side-by-side: chart left, donut right */}
              <div style={{display:"flex",gap:20,alignItems:"stretch"}}>

                {/* ── Left: Performance Chart ── */}
                <div style={{flex:"1 1 0",minWidth:0}}>
                  {chartLoading && (
                    <div style={{height:240,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span className="mono shimmer" style={{fontSize:11,color:"var(--text3)"}}>⟳ Loading price history…</span>
                    </div>
                  )}
                  {!chartLoading && !transactions.length && (
                    <div style={{height:240,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                      <div style={{fontSize:32}}>📊</div>
                      <div className="mono" style={{fontSize:11,color:"var(--text3)"}}>Import your transaction history to see performance</div>
                      <button className="btn btn-ghost" style={{fontSize:11,padding:"5px 14px"}} onClick={()=>setShowImport(true)}>↑ Import CSV</button>
                    </div>
                  )}
                  {!chartLoading && transactions.length>0 && (
                    <ResponsiveContainer width="100%" height={240}>
                      <ComposedChart data={chartData.length ? chartData : investedChartData} margin={{top:4,right:4,left:0,bottom:0}}>
                        <defs>
                          <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.15}/><stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/>
                          </linearGradient>
                          {BENCHMARKS.map(b=>(
                            <linearGradient key={b.id} id={"g_"+b.id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={b.color} stopOpacity={0.10}/><stop offset="95%" stopColor={b.color} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2730" vertical={false}/>
                        <XAxis dataKey="date" tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:"#3d4f5e"}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                        <YAxis tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:"#3d4f5e"}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} width={44} domain={chartDomain}/>
                        <Tooltip content={<ChartTip/>}/>
                        {activeBM.map(id=>{
                          const b=BENCHMARKS.find(x=>x.id===id);
                          return <Line key={id} type="linear" dataKey={id} name={b.label} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.75} dot={false} connectNulls isAnimationActive={false}/>;
                        })}
                        <Area type="linear" dataKey="portfolio" name="Portfolio" stroke="#00e5a0" strokeWidth={2.5} fill="url(#gPort)" dot={false}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",marginTop:4,textAlign:"right"}}>
                    {chartData.length ? "● REAL DATA — FMP" : transactions.length ? "● invested line only — prices loading" : ""}
                  </div>
                </div>

                {/* ── Divider ── */}
                <div style={{width:1,background:"var(--border)",flexShrink:0}}/>

                {/* ── Right: Allocation Donut + Legend ── */}
                <div style={{width:220,flexShrink:0,display:"flex",flexDirection:"column",justifyContent:"center",gap:0}}>
                  <div className="mono" style={{fontSize:10,color:"var(--text2)",letterSpacing:"0.1em",marginBottom:10}}>ALLOCATION</div>
                  {allocData.length ? (
                    <>
                      <div style={{height:160,position:"relative"}}>
                        <MiniPie data={allocData}/>
                        {/* Centre label */}
                        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
                          <div className="mono" style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{allocData.length}</div>
                          <div className="mono" style={{fontSize:9,color:"var(--text3)"}}>positions</div>
                        </div>
                      </div>
                      {/* Legend */}
                      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
                        {allocData.slice(0,6).map(d=>(
                          <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                              <span className="mono" style={{fontSize:10,color:"var(--text2)",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</span>
                            </div>
                            <span className="mono" style={{fontSize:10,color:"var(--text)",fontWeight:500}}>{d.value}%</span>
                          </div>
                        ))}
                        {allocData.length>6&&<div className="mono" style={{fontSize:9,color:"var(--text3)",marginTop:2}}>+{allocData.length-6} more</div>}
                      </div>
                    </>
                  ) : (
                    <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span className="mono" style={{fontSize:10,color:"var(--text3)"}}>No positions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Positions Table ── */}
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"14px 18px 0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className="mono" style={{fontSize:10,color:"var(--text2)",letterSpacing:"0.1em"}}>POSITIONS</div>
                  {priceLoading && <span className="mono shimmer" style={{fontSize:9,color:"var(--text3)"}}>● syncing</span>}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {["All",...BROKERS_LIST].map(b=>(
                    <button key={b} className="pill" onClick={()=>setFBroker(b)}
                      style={{padding:"3px 9px",fontSize:9,...(fBroker===b?{color:"var(--green)",background:"var(--green-dim)",borderColor:"rgba(0,229,160,0.3)"}:{})}}>{b}</button>
                  ))}
                  <div style={{width:1,background:"var(--border)",margin:"0 2px"}}/>
                  {["All","stock","etf","crypto"].map(t=>(
                    <button key={t} className="pill" onClick={()=>setFType(t)}
                      style={{padding:"3px 9px",fontSize:9,textTransform:"uppercase",...(fType===t?{color:"var(--green)",background:"var(--green-dim)",borderColor:"rgba(0,229,160,0.3)"}:{})}}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Table header — sortable */}
              <div className="trow" style={{padding:"9px 18px",borderBottom:"1px solid var(--border2)",borderTop:"1px solid var(--border)"}}>
                {[["name","ASSET"],["qty","QTY"],["price","AVG PRICE"],["value","LIVE PRICE"],["pnl","P&L"],["pnlpct","P&L %"]].map(([col,label])=>{
                  const active=sortBy===col;
                  return <div key={col} onClick={()=>toggleSort(col)} className="mono"
                    style={{fontSize:9,color:active?"var(--green)":"var(--text3)",letterSpacing:"0.12em",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:4}}>
                    {label}<span style={{opacity:active?1:0.3,fontSize:8}}>{active&&sortDir==="asc"?"▲":"▼"}</span>
                  </div>;
                })}
              </div>

              {/* Rows */}
              {tableRows.map(pos=>{
                const val = pos.qty*pos.currentPrice;
                const p   = pos.qty*(pos.currentPrice-pos.avgPrice);
                const pp  = ((pos.currentPrice-pos.avgPrice)/pos.avgPrice*100);
                const up  = p>=0;
                return (
                  <div key={pos.id} className="trow" style={{cursor:"pointer"}} onClick={()=>{setSelectedPos(pos);setNav("stock")}}>
                    {/* Asset cell with logo */}
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <AssetLogo pos={pos}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{pos.symbol}</div>
                        <div style={{fontSize:11,color:"var(--text2)"}}>{pos.name}</div>
                      </div>
                      <span className={`tag tag-${pos.type==="crypto"?"gold":pos.type==="etf"?"blue":pos.type==="derivative"?"red":"gray"}`}
                        style={{marginLeft:2}}>{pos.type==="derivative"?"DERIV":pos.type.toUpperCase()}</span>
                    </div>

                    {/* Qty */}
                    <div className="mono" style={{fontSize:12,color:"var(--text2)"}}>
                      {pos.qty < 1 ? pos.qty.toFixed(4) : fmt(pos.qty, pos.qty<10?3:2)}
                    </div>

                    {/* Avg price */}
                    <div className="mono" style={{fontSize:12,color:"var(--text2)"}}>
                      {fmtE(pos.avgPrice)}
                    </div>

                    {/* Total value bold, live price underneath */}
                    <div>
                      <div className="mono" style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>
                        {fmtE(val)}
                      </div>
                      <div className="mono price-live" style={{fontSize:11,color:"var(--text2)"}}>
                        {fmtE(pos.currentPrice)}
                      </div>
                    </div>

                    <div className="mono" style={{fontSize:13,color:up?"var(--green)":"var(--red)",fontWeight:500}}>
                      {up?"+":"-"}{fmtE(Math.abs(p))}
                    </div>
                    <div className="mono" style={{fontSize:13,color:up?"var(--green)":"var(--red)",fontWeight:500}}>
                      {pos.avgPrice>0?(up?"+":"")+fmt(pp)+"%":"—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}

          {nav==="stock"&&selectedPos&&<StockDetail pos={selectedPos} onBack={()=>{setNav("dashboard");setSelectedPos(null)}} transactions={transactions}/> }
          {nav==="screener"&&<div className="fu card" style={{padding:40,textAlign:"center"}}><div className="serif" style={{fontSize:22,color:"var(--text2)",marginBottom:8}}>Stock Screener</div><div style={{fontSize:13,color:"var(--text3)"}}>Coming in Phase 3 — filter by P/E, dividend yield, sector, region & more</div></div>}
          {nav==="compare"&&<CompareView/>}
          {nav==="news"&&<NewsFeed positions={positions}/> }
          {nav==="settings"&&(
            <div className="fu" style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Import Card */}
              <div className="card" style={{padding:28}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                  <div>
                    <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:4}}>PORTFOLIO IMPORT</div>
                    <div style={{fontSize:13,color:"var(--text2)"}}>Import your transaction history from any broker</div>
                  </div>
                  <button className="btn btn-primary" onClick={()=>setShowImport(true)}>↑ Import CSV</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[
                    {broker:"Bitvavo",   steps:"Account → Transaction History → Export → Full History (CSV)",   native:true},
                    {broker:"Smartbroker+", steps:"Depot → Transaktionen → Export → CSV",                       native:true},
                    {broker:"Trade Republic", steps:"Use TR Exporter browser extension, then import CSV here",  native:false},
                  ].map(b=>(
                    <div key={b.broker} style={{background:"var(--surface2)",borderRadius:8,padding:"14px 16px",border:"1px solid var(--border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <span style={{fontSize:13,fontWeight:500}}>{b.broker}</span>
                        <span className={`tag tag-${b.native?"green":"gold"}`}>{b.native?"NATIVE CSV":"VIA EXTENSION"}</span>
                      </div>
                      <div style={{fontSize:11,color:"var(--text3)",lineHeight:1.6}}>{b.steps}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Broker connections */}
              <div className="card" style={{padding:28}}>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:18}}>CONNECTED BROKERS</div>
                {BROKERS_LIST.map(b=>(
                  <div key={b} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span className="ldot"/><span>{b}</span></div>
                    <span className="tag tag-green">CONNECTED</span>
                  </div>
                ))}
                <div style={{marginTop:14}}><button className="btn btn-ghost">+ Connect new broker</button></div>
              </div>
            </div>
          )}

        </div>{/* end main-scroll */}

        {/* ── Mobile Bottom Nav ── */}
        <nav className="mobile-bottom-nav">
          {NAV_ITEMS.map(item=>(
            <button key={item.id} className={`mob-nav-btn${nav===item.id?" active":""}`}
              onClick={()=>setNav(item.id)}>
              <span className="icon">{item.icon}</span>
              {item.label==="Dashboard"?"Home":item.label==="News Feed"?"News":item.label}
            </button>
          ))}
        </nav>
      </div>{/* end outer flex */}

      {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImport={(imported)=>{
        if(imported?.type==="transactions"){
          const txs = imported.data;
          if(positions.length > 0) {
            const txQty = {};
            txs.forEach(t=>{ if(!t.isin) return; txQty[t.isin]=(txQty[t.isin]||0)+(t.type==='buy'?t.qty:-t.qty); });
            const mismatches = positions.filter(p=>{
              if(!p.isin||p.qty<=0) return false;
              const computed = Math.max(0, txQty[p.isin]||0);
              const actual = p.qty;
              if(computed===0 && actual>0) return true;
              if(actual>0 && Math.abs(computed-actual)/actual > 0.2) return true;
              return false;
            });
            if(mismatches.length > positions.length * 0.3) {
              const names = mismatches.slice(0,3).map(p=>p.name||p.symbol).join(', ');
              const msg = "\u26a0 Incomplete transaction history\n\n" + mismatches.length + " of your " + positions.length + " positions have missing buy records\n(e.g. " + names + "...)\n\nSmartbroker+ only exported partial history. Please re-export going back to your first purchase.\n\nImport anyway?";
              if(!window.confirm(msg)) return;
            }
          }
          setTransactions(txs);
        }
        else{setPositions(prev=>[...prev,...imported]);}
        setShowImport(false); setNav("dashboard");
      }}/>}

      {showModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="serif" style={{fontSize:20,marginBottom:5}}>Add Position</div>
            <div style={{fontSize:12,color:"var(--text2)",marginBottom:22}}>Enter your position details manually</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {[{k:"symbol",l:"TICKER",p:"BTC, MSFT..."},{k:"name",l:"NAME",p:"Full name"}].map(f=>(
                <div key={f.k}>
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:5}}>{f.l}</div>
                  <input className="inp" placeholder={f.p} value={newPos[f.k]} onChange={e=>setNewPos(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              {[{k:"qty",l:"QUANTITY",p:"0.00"},{k:"avgPrice",l:"AVG PRICE (\u20ac)",p:"0.00"},{k:"currentPrice",l:"CURRENT (\u20ac)",p:"0.00"}].map(f=>(
                <div key={f.k}>
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:5}}>{f.l}</div>
                  <input className="inp" type="number" placeholder={f.p} value={newPos[f.k]} onChange={e=>setNewPos(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
              {[{k:"type",l:"TYPE",opts:ASSET_TYPES},{k:"broker",l:"BROKER",opts:BROKERS_OPT}].map(f=>(
                <div key={f.k}>
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:5}}>{f.l}</div>
                  <select className="inp" value={newPos[f.k]} onChange={e=>setNewPos(p=>({...p,[f.k]:e.target.value}))}>
                    {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>CANCEL</button>
              <button className="btn btn-primary" onClick={addPos}>ADD POSITION</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
