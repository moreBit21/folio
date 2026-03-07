import React, { useState, useMemo, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

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
const RANGE_MONTHS  = {"1M":1,"3M":3,"6M":6,"YTD":2,"1Y":12,"ALL":18};
const ALLOC_COLORS  = ["#00e5a0","#627eea","#f7931a","#9945ff","#f0b429","#76b900","#e84142"];
const BROKERS_OPT   = ["Bitvavo","Smartbroker+","Trade Republic","Manual"];
const ASSET_TYPES   = ["stock","etf","crypto"];
const NAV_ITEMS     = [
  {id:"dashboard",label:"Dashboard",icon:"⬡"},
  {id:"portfolio",label:"Portfolio", icon:"◈"},
  {id:"screener", label:"Screener",  icon:"⊞"},
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
function AssetLogo({pos}) {
  const svg = getLogoSVG(pos.symbol);
  if (svg) {
    return (
      <div style={{
        width:36, height:36, borderRadius:9, flexShrink:0,
        background: pos.type==="crypto" ? "transparent" : `${pos.color}15`,
        border:`1px solid ${pos.color}33`,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden"
      }}>
        {svg}
      </div>
    );
  }
  // Fallback: colored ticker badge
  return (
    <div style={{width:36,height:36,borderRadius:9,background:`${pos.color}22`,border:`1px solid ${pos.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span className="mono" style={{fontSize:9,color:pos.color,fontWeight:700}}>{pos.symbol.slice(0,4)}</span>
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

        const type = typeMap[klasse] || "stock";

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
        const type=/crypto|btc|eth|sol/i.test(r[iType]||symbol)?"crypto":(/etf/i.test(r[iType]||r[iName]||"")?"etf":"stock");
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
  "US1912161007":"KO","US7132711086":"PEP","US8923561067":"MCD",
  "US9197941076":"V","US69343P1057":"MA","US0258161092":"AXP",
  "US02209S1033":"AMD","US00724F1012":"ABNB","US09175A2069":"BKNG",
  "US83406F1021":"SNOW","US8522341036":"SHOP","US86800U3023":"SQ",
  "US88023B1035":"TTD","US6974351057":"PTON","US6323071042":"NFLX",
  "US6541061031":"NDAQ","US15118V2079":"COIN","US5011471027":"LLY",
  "US4523271090":"IRM","US26856L1035":"EA","US14888U1016":"C",
  "US11135F1012":"BRKA","US03945R1023":"ARBK","US72352L1061":"PINS",
  "US79466L3024":"ROKU","US30231G1022":"XOM","US1247531029":"CB",
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

const ISIN_NAMES = {
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

function guessTypeFromISIN(isin, ticker) {
  if(/^(IE|LU)/.test(isin)) return "etf";
  if(/^DE000(ETF|EXS|EL4|A0S|A1J)/.test(isin)) return "etf";
  if(/^(BTC|ETH|SOL|XRP|BNB|ADA)$/.test(ticker)) return "crypto";
  return "stock";
}

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
        name: ISIN_NAMES[ticker] || ticker,
        type: guessTypeFromISIN(p.symbol, ticker),
        isin: p.symbol,
      };
    }
    return p;
  });

  // Second pass: try OpenFIGI API for any still unresolved
  const stillISIN = resolved.filter(p => isISIN(p.symbol));
  if (stillISIN.length > 0) {
    try {
      const body = stillISIN.map(p => ({ idType: "ID_ISIN", idValue: p.symbol }));
      const res = await fetch("https://api.openfigi.com/v3/mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        data.forEach((result, i) => {
          if (result.data && result.data.length > 0) {
            const best = result.data.find(d => d.exchCode === "GY" || d.exchCode === "US") || result.data[0];
            const idx = resolved.findIndex(p => p.symbol === stillISIN[i].symbol);
            if (idx >= 0) {
              resolved[idx] = {
                ...resolved[idx],
                symbol: best.ticker || resolved[idx].symbol,
                name: best.name || resolved[idx].symbol,
                type: guessTypeFromISIN(resolved[idx].symbol, best.ticker || ""),
                isin: resolved[idx].symbol,
              };
            }
          }
        });
      }
    } catch(e) {
      // OpenFIGI failed — keep ISINs as-is, user can rename
      console.log("OpenFIGI lookup failed:", e);
    }
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
            <div style={{fontSize:12,color:"var(--text3)"}}>Looking up {fileName} via OpenFIGI</div>
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

  // ── Fetch live prices ──
  // ── Data fetching — powered by FMP (Financial Modeling Prep) ──
  // All calls go through /api/fmp Vercel proxy to keep key server-side
  const fmpGet = useCallback(async (path) => {
    const r = await fetch('/api/fmp?path=' + encodeURIComponent(path));
    if (!r.ok) throw new Error('fmp ' + r.status);
    const data = await r.json();
    if (data?.['Error Message'] || data?.error) throw new Error(data['Error Message'] || data.error);
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
              setPositions(prev=>prev.map(q=>q.isin===p.isin?{...q,fmpTicker:pick.symbol}:q));
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
    const from   = new Date(now); from.setMonth(from.getMonth()-months);
    const fromStr = from.toISOString().slice(0,10);
    const toStr   = now.toISOString().slice(0,10);
    const totalDays = Math.round((now-from)/86400000);
    const sorted = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));

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
      const from   = new Date(now); from.setMonth(from.getMonth()-months);
      const fromStr = from.toISOString().slice(0,10);
      const toStr   = now.toISOString().slice(0,10);
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
      const sorted = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));
      const allIsins = [...new Set(sorted.map(t=>t.isin).filter(Boolean))];
      const inWindow = sorted.filter(t=>t.date>=fromStr&&t.date<=toStr);

      const qtyAtStart = {};
      positions.forEach(p=>{ if(p.isin) qtyAtStart[p.isin]=p.qty||0; });
      [...inWindow].reverse().forEach(t=>{
        if(!t.isin) return;
        if(qtyAtStart[t.isin]===undefined) qtyAtStart[t.isin]=0;
        qtyAtStart[t.isin] -= t.type==='buy' ? t.qty : -t.qty;
      });

      const qtyByDay = {};
      allIsins.forEach(isin=>{
        const isinTx = inWindow.filter(t=>t.isin===isin);
        let q=Math.max(0,qtyAtStart[isin]||0), ti=0;
        qtyByDay[isin]=new Float64Array(totalDays+1);
        for(let i=0;i<=totalDays;i++){
          const d=new Date(from); d.setDate(d.getDate()+i);
          const ds=d.toISOString().slice(0,10);
          while(ti<isinTx.length&&isinTx[ti].date<=ds){
            q=Math.max(0,q+(isinTx[ti].type==='buy'?isinTx[ti].qty:-isinTx[ti].qty)); ti++;
          }
          qtyByDay[isin][i]=q;
        }
      });

      // ── EUR/USD ──
      let eurUsd=1.085;
      try{ const fx=await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR').then(r=>r.json()); eurUsd=1/(fx?.rates?.EUR||0.92); }catch(e){}

      // ── Resolve ISIN → FMP ticker ──
      const isinToTicker={};
      positions.forEach(p=>{ if(p.isin&&p.type!=='crypto'&&p.type!=='derivative') isinToTicker[p.isin]=getT(p); });
      // For ISINs only in transactions (already sold positions), search FMP
      const needsSearch = allIsins.filter(isin=>!isinToTicker[isin] && !positions.find(p=>p.isin===isin));
      await Promise.all(needsSearch.slice(0,20).map(async isin=>{
        try{
          const res = await fmpGet('/search-isin?isin='+isin);
          if(!Array.isArray(res)||!res.length) return;
          const pick = res.find(r=>r.exchangeShortName==='XETRA')
            || res.find(r=>['EURONEXT','LSE','SIX'].includes(r.exchangeShortName))
            || res[0];
          if(pick?.symbol) isinToTicker[isin]=pick.symbol;
        }catch(e){}
      }));

      // ── Price history per ticker ──
      const priceByIsin={};
      const uniqueTickers = [...new Set(Object.values(isinToTicker))];
      await Promise.all(uniqueTickers.map(async ticker=>{
        try{
          const data = await fmpGet('/historical-price-eod/full?symbol='+ticker+'&from='+fromStr+'&to='+toStr);
          const hist = data?.historical||[];
          if(!hist.length) return;
          const isins = Object.entries(isinToTicker).filter(([,t])=>t===ticker).map(([i])=>i);
          const isUsd = !ticker.endsWith('.DE')&&!ticker.endsWith('.F')&&!ticker.endsWith('.AS')&&!ticker.endsWith('.PA')&&!ticker.endsWith('.L');
          isins.forEach(isin=>{
            priceByIsin[isin]={};
            hist.forEach(h=>{ priceByIsin[isin][h.date]=isUsd?h.close/eurUsd:h.close; });
          });
        }catch(e){ console.warn('price fail:',ticker,e.message); }
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
      const BM_FMP={sp500:'SPY',nasdaq:'QQQ',dax:'^GDAXI',btc:'BTC/USD'};
      const bmPrices={};
      await Promise.all(activeBM.map(async id=>{
        try{
          const data=await fmpGet('/historical-price-eod/full?symbol='+encodeURIComponent(BM_FMP[id])+'&from='+fromStr+'&to='+toStr);
          bmPrices[id]={};
          (data?.historical||[]).forEach(h=>{ bmPrices[id][h.date]=h.close; });
        }catch(e){}
      }));

      // ── Assemble rows ──
      const lastPrice={};
      let bmNormBase=null;
      const rows=[];

      for(let i=0;i<=totalDays;i+=step){
        const d=new Date(from); d.setDate(d.getDate()+i);
        const ds=d.toISOString().slice(0,10);
        const baseRow=investedChartData[Math.round(i/step)]||{};

        let portVal=0;
        allIsins.forEach(isin=>{
          const qty=qtyByDay[isin]?.[i]||0; if(qty<=0) return;
          const p=priceByIsin[isin]?.[ds];
          if(p!=null) lastPrice[isin]=p;
          portVal+=qty*(lastPrice[isin]||0);
        });

        if(!bmNormBase&&portVal>0){
          const bp={};
          activeBM.forEach(id=>{ if(bmPrices[id]?.[ds]) bp[id]=bmPrices[id][ds]; });
          if(Object.keys(bp).length||!activeBM.length) bmNormBase={portVal,bp};
        }

        const row={
          date:baseRow.date||d.toLocaleDateString('de-DE',{day:'2-digit',month:'short'}),
          invested:baseRow.invested||0,
          ...(portVal>0?{portfolio:+portVal.toFixed(2)}:{}),
        };
        if(bmNormBase){
          activeBM.forEach(id=>{
            const p0=bmNormBase.bp[id],p1=bmPrices[id]?.[ds];
            if(p0&&p1) row[id]=+(bmNormBase.portVal*(p1/p0)).toFixed(0);
          });
        }
        rows.push(row);
      }

      setChartData(rows);
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

  const fmt  = (n,d=2)=>n.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  const fmtE = (n)=>`€${fmt(Math.abs(n),0)}`;
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
        <div style={{width:220,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:"20px 12px"}}>
          <div style={{padding:"4px 14px 24px"}}>
            <div className="serif" style={{fontSize:20,letterSpacing:"-0.02em"}}>folio<span style={{color:"var(--green)"}}>.</span></div>
            <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.12em",marginTop:2}}>EU INVESTOR PLATFORM</div>
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
        <div style={{flex:1,overflow:"auto",padding:"26px 30px"}}>

          {/* Header */}
          <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
            <div>
              <div className="serif" style={{fontSize:24,letterSpacing:"-0.02em"}}>
                {nav==="dashboard"?"Overview":nav==="portfolio"?"Portfolio":nav==="screener"?"Screener":nav==="news"?"News Feed":"Settings"}
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


            <div className="fu2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
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

            {/* ═══ PERFORMANCE CHART ═══ */}
            <div className="fu3 card" style={{padding:"20px 20px 14px",marginBottom:16}}>
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
                <div style={{padding:"8px 12px",marginBottom:8,background:"rgba(255,77,109,0.1)",border:"1px solid rgba(255,77,109,0.3)",borderRadius:6,fontSize:11,color:"var(--red)",fontFamily:"IBM Plex Mono"}}>
                  ⚠ {chartError}
                </div>
              )}
              {chartLoading && (
                <div style={{height:250,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span className="mono shimmer" style={{fontSize:11,color:"var(--text3)"}}>⟳ Loading price history…</span>
                </div>
              )}
              {!chartLoading && !transactions.length && (
                <div style={{height:250,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                  <div style={{fontSize:32}}>📊</div>
                  <div className="mono" style={{fontSize:11,color:"var(--text3)"}}>Import your transaction history to see performance</div>
                  <button className="btn btn-ghost" style={{fontSize:11,padding:"5px 14px"}} onClick={()=>setShowImport(true)}>↑ Import CSV</button>
                </div>
              )}
              {!chartLoading && transactions.length>0 && (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData.length ? chartData : investedChartData} margin={{top:4,right:4,left:0,bottom:0}}>
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
                      return <Area key={id} type="linear" dataKey={id} name={b.label} stroke={b.color} strokeWidth={1.5} fill={"url(#g_"+id+")"} dot={false}/>;
                    })}
                    <Area type="linear" dataKey="portfolio" name="Portfolio" stroke="#00e5a0" strokeWidth={2.5} fill="url(#gPort)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="mono" style={{fontSize:9,color:"var(--text3)",marginTop:6,textAlign:"right"}}>
                {chartData.length ? "● REAL DATA — FMP" : transactions.length ? "● invested line only — prices loading" : ""}
              </div>
            </div>
                        {/* Allocation — full width */}
            <div style={{marginBottom:16}}>
              <div className="card" style={{padding:20}}>
                <div className="mono" style={{fontSize:10,color:"var(--text2)",letterSpacing:"0.1em",marginBottom:14}}>ALLOCATION BY ASSET</div>
                <div style={{height:340}}><MiniPie data={allocData}/></div>
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
                  <div key={pos.id} className="trow">
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

          {nav==="screener"&&<div className="fu card" style={{padding:40,textAlign:"center"}}><div className="serif" style={{fontSize:22,color:"var(--text2)",marginBottom:8}}>Stock Screener</div><div style={{fontSize:13,color:"var(--text3)"}}>Coming in Phase 3 — filter by P/E, dividend yield, sector, region & more</div></div>}
          {nav==="news"&&<NewsFeed positions={positions}/>}
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
        </div>
      </div>

      {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImport={(imported)=>{
    if(imported?.type==="transactions"){setTransactions(imported.data);}
    else{setPositions(prev=>[...prev,...imported]);}
    setShowImport(false); setNav("dashboard");
  }}/>}
      {showModal && (
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
              {[{k:"qty",l:"QUANTITY",p:"0.00"},{k:"avgPrice",l:"AVG PRICE (€)",p:"0.00"},{k:"currentPrice",l:"CURRENT (€)",p:"0.00"}].map(f=>(
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
