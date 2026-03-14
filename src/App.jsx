import React, { useState, useMemo, useEffect, useCallback } from "react"; // v25-compare-fwd-metrics
import ReactDOM from "react-dom";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const FOLIOLOGIC_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAWM0lEQVR42rVaeZiUxdH/VXe/887MXuwCC3IIKCJZQSQgKocDBMEjioKDGAEBCQoeiEfiER3HL4hHIhJEgiBoVCQ7YExQ8EPjMvFIYoBAghg8ABFh2V32nOs9uuv7Y3YVD77c+zzzzDwz229XVdev6ldVDfzrfxSNRiUQld/0o6T8S9Dx10ciERWLxQT+HSH++SVMiIyUSCb9z7/Zty84acGKvjUNzf3SLc6pOdfpZgcCXXxtlG+01trUlIRDDSRpT1lJ4V8GnHbi+w/9aF6t4c8fKqLRKCUSCf3fVIAQjQq0brJjx46C2+9/avShhpYJuZx7kWHRkSEgCBCCYYyBJAIRwTBDCAkmCWaAtQsl6I+lxcFfn9Gv+4srfnrvHm3ye8RiMYrH4+Y/qkAsFhNtD43FHin/360fz6pvSs92texB0FDQB0K2fKM4HP5TSWnh7s4dSo6Utgs2tCspoXaBAH/w2SFuaG4pqa3LdE+lndNb0s6wrOOMZGG3F1LAFtjUtVPhotcSS17zNSPvlgkDgP99BSIRhWTSZ94VGHbRkuuPNKTudI3qaJHrFQatp0/oFH721bXL/kBE3j9jtb37qoIzbn5hWG1DbkbG8a4SyoYtzZZ+vdrfWfnMoj+0Wk7g75zG/69ANCqRSOhLp80fsmd/3ZKMK4eQyaFTacGSUQN7P/bQg3fu/cJEURmJ1FB5eTnX1FRQMhn3H3niifLb586tiUajsqKignfv3k01NTWUTJYzkHdFAjB19t0n/3XvZ/NTWX09kUJxAR56MXZB/MShk7Kt/8L/CjYkAAy/aNbsHkMm57oO/h73HX7VG5dMvnHgMRpKRKPyWENEIhEFAJFL5sw4Y+x11eOn3Dg0b4uvRauvRbFJM+YPqDh3ypYeZ0/jvsOu2nn+5OsG5tdWymhlpYzEqhSY6R8RXkhBGDTumke6Db6Suw++goeMm/5jZhZtbvWN4a9VyFGXzh7b6+zJutOAidznnCtrplxzR+82LB0HZAKtiltKYMi46Xf1HjqVB46ZvmfWjbFu/5zlIxElhcC3x05f1nXwldzjzEn63ItmTTsm3MnjCgGImdfHupx8zhVHy0+/1HQecInbeeDl3Hf4lds3btxot1r7uBYcNHu51fZ50YBIOwuATYS7Xn+969g1a847d+3ahZetXTvgWGOoL+M1IpPJpD/ogpkLD9VmriPj+r1P6jz9t+ueeB6DBlnYts1PJBLfDKrdu4kA/e57H/8k45gygvHBwmLt+qmcHHjvo2vvABLxNlx90yO2PXmtF5QC09e/eOobyj5tUOqGYY3N6WFr9uw7zbVUoW0H0Kk4vOYbQRyNRmUikdCjJsyd+uGBul+w0ejVueSmtzauWoJBsy1se9I7Ptbza78z8caBH39asy2bcwwRSzAYBDCDC8OhzLjhp57yxE/i1cxMRJQHZqtPr/z1rwufb8n97KDnn+Plcr1MKBzwAXi5HIzjAEqadgL7P5rz/b6tEY8AtPp0LCYSiYSeduNtJ+8/WP+E7xuUl4affmfTqiWD/o7wAJCoqSEAqGtsnusZQYKIiQhCKgKICDCuz4Vb//LJFAAYOXLkF25IxLjvPip23Qz77uuu43Zp0TqQa27y/eZmn1xXS4IvLEvYSu2VRF4r1hgARNvxMzNt3XF4ScblwsKg+vCaa8+60TDktm3L/b+Lm2TS/+CDD+xszh9ntAuQkUII7lBa0MIMEDF5vsepnHuZFALJZPLLLhSPm6XvvUdbZkx7fmqH4DklAZVlQQJgCYY0DAgpYQvsyvtv9AsOEolEFBIJ/Z2JN3035fAFtgX06Fp2+w2TbkhFIhECiP9OmiYAiP1kdS/X87uyMcwsiIjcgCXeBhEYBDaGco7b68231oZarfdF6I3FVDIe92MvvdRlfYOzJOWxLQyYAQ2wAREECEEptzMzfVB5hmpbL5LJkYaZxcHqo3e7mrkoZP3u9XVLf4NoVCaPIWzH9f/duwkAqo80lhkmkReOAEY2qNQOKWT+lNiAiEpefuPTstYoklcgVqWS8bg/o7Ky4oW65qo6FqOM62gPkDJcoChoCwLIZo2+Qwe+ff75MwbOnrDoPgAcjUalAuLm3EuOjM64+iyLgPKSdouJiAcNmi0KIzFKYguQLGdE8n4eAVBeXs6VlZXmcyACKArZriABAGSYQYCRlvikzc5EAtDGKSoLZY45PYX4KH/CM8+PSdZn1jR6Xkd2HW0VFVlFvtPckf3FGUmj6sraDbfSqZpVffrv6+9483XG3LbyoZUPzPrhrBaVB1/L1dqAC2zaf+8tQzZWbVhG274K3OSX3vLQRFTW1FQQAAw8q8dH731S28CQ7QAfJIQO26EGGAMiASZiy1aH7pgzp/HOI0dEHBCIx/3zn14zZVsq91Sz6wWsQADBoPA7SLMs0qnT4kXjx39UufW1kthfDr4sCWWKiHuP+N6InEfq2d9vGw/gObVw4ROlK17aMkZAUtgWr4waNSOHWExMPYzuHx+qm57KZsrCQavcc/20lKrJtmh/cVHR30YOP/0vP5g7rSaZBFBREbj/lvmNA74zfWPG1Vdpx2NBQnbu2N7e9dFn8DxtVCCgCkKBDQQALx+WatuT3pAnn719Z0Y/7EKiWGq3Y8ha278k9OjqiRN3bgdQuasyMKnfeU2x1asv3l1kj9oFoCAU2Jd2NDc0psYT8Jza/O57I1wfXQga4cLw5raogOtjwdqmVDyddUGNGZAQIAIEEURtCz785FD9gDEzXutWWrjslcSSJAM4qVvHeEvq4KXNriyQAiwEfGbWDBJBC5mBp5/y5DYitgBv4MrnVh2wCmbI3FF9oi3WnlJc9Gjl1MnbtwK4fs2aLm81u3fHNtfuA/NP40RNAH4FAB1Kijcdbaqb35L2zn5scaxYtGTSI33NUIKdfj0772ojaWuW3f+B8J3fG8/ztHZc7WZ9z8n62WyKM5m0aU5ly2rq01e892ndlkFjZy5mrlIvPv3Ih51KQ1eHQzY8V4c/+nhfja91NhgKiQ6lBT9a+dN79i18+eXSU5f94s2jmmd0TDc8dX7n4rN2XDtzSuXUydvvWr/+hDOXrF7w6qGWHdUIzrVD4W+BiLF8uYrEYgoAenUr301GZ33DXTe+VXeayGa9/oCBsujw3beOOQwAgwaVCm0YxUXhF5RlWTAkQFBSClUYtrNKSkFCwWjPy2SyfnW9c9PpI1e+yFu3Wu9sWrX+xPLCy0NhO8tklYNRUBziV3//ysrHxj+++oy1+2tfN0RHhgZNxc65M2etnDRp2w0bny0esWz1fS/sq91xwOG7mnJeR5NJ67BQ+RBw6BAn43EfAH7+6LAjVsA6AGFROpPtJ3xjerFhKEENp/QenQNA27Yu9wHQ8NO6P28rc5RJCIAMg9i27Jbe3TusLysOviGksoSUynfT2YYsX3zmnY8vJALefHnF+tFn9jmzuCRcFwraZEuxcnP1znAgKMe1E+r6v1039fJnr776fQOACChE+54HtYzVZfxyP5322RiPCTLluumvRG2h5GhfCK5lCGRcPlm4ni4iIhhfH83XpTECEUejUbFoUby+rKTgAcsKCGYYNkz1zZlO+w41ji0pDH3Yv1f5nKBl7ZFWMOTlsrmjTdlbz7t8ziBEImrZY/G9hQXh+lA4jHBh2G5684NcYta0h5Jzp/7BAKiqqgqee9kNc0eOnXVacbduKZPL+ZINM1gxiIwxCCpZ9JWsQ9owHMdpMABc1+8gAgFV6vs+7GCgQAoCEM/zm0TCAFEZv3DA0kIbOyAsBTa+JAPX84r2Vzdd+0l185Rh/bvc2L7IXh2wg8GcZ/jTQ/VxSib9WCwmahuaLMNAIBjEpEmTNABUvlZZMnLivJu+f8+K7QdrWpbu+6y6Q8/eXT1iKGK0ZpK8uIaPU4kRwIYRDtvlQmvjEwDP0+G2LknbeyxWwRfOm+cM6tPzqqJwoNmQUMzwAcB4jt+Yzg57e9ehdaf06pQ4oX3odiUlpR0ed97EOUPj8TizNh18DaSa0yAAIy6Zfd19Czb+ed9n9YtTKedbjpPTQkC7uRxBM0gbgBkwDDAgvlb+JFgQQRKVMmsAzML4XhMT4Hp+x1Wrny44lqfE43ETjUbl86sX7u7bo92FJeFgLaStmNkAIBjfy+a84q27PtkYYmdrl/bBm40IqMN1zQ8QwPXNqSKjNbycxwDQ0OTc0dCc6+Xm0i7YeCBIsqRCFmDfgA2DNYO1ATQD2nyV+hv9pz9ZxlBnMCPVkq4VlhQNAoDRKH/pja1dvsRT8q6ko9Go3LDm8beHVJSdVV4S3BAKBoVQAQmhLIZBJudifwNXtW9X9KdC2yTSnopEZ/xwgKdZAQTP5BXwtW5g4xlmI5lZEANaawZyIM5bHWwAbUDMaKUmXyKNk5/6VWeG6UIwEJY8KoS0DhAJ+CzUoYONAwHQ7laC9lUlnlv5+L6/bnnmkoqepaPLioMrSgrtXcVhu760OJSRxPWHjzYt+N55Z97Dxs/t3ntwUUhZg32t4ftG5H3TKGaIVi8GwJBSiFAoCMEA6baXAWmG8fTXSGNtTVM/ZhlWYISD1qfKsuQ2kmKcz4xmxxsHoDKRqPla3Zpv+8WE4Tg2Vi6rAlAVsBQWPriszJOBQpvrmxsbhbkvdnNz3+FXVjalzbSWVNMgUAChUEExAcgHCQbwhWsEApbwLen4rmeYWcA3ADHY14CWXyuamltazvM1oIhNaTi4U3Qpb5+0lYTRBo7rXvj4448XAkn9zcV33AAwbe0Q1/Nx663fr7/j5qsPzJ8/vzEefyttmNGhrHAdgznreME8GrkdAZBKEZghWIAZLKVEz+5d2yHnSABkfB+mDQe+AbxjMJBMauatVnNL7mLP8xCwVM3k7571V/HDiUPfsQPyU4DhGtV5/eYdEwBwJBKRxy0hEwkNJEy0slKiNcXnUZbQRITmbOaA0S4RiLQx8DyvEARo33OONQuBACLlZomIQTAMmDyARRuQAfT+Y70EwJGLl4/JutxbCOJwKPTuNTNnNIpRkyalQsHABmlZcF2XP6ttmc/Mrd2zb+6TIhJTADgxaZKmeNx/bevWklELfj5h4I+XJmYkEj3qPq5JwwgQ8thUUnbUDLSkcw1CCBhiJgIYDM/xOBzOHzcxg9i0ApphOI+Bjw5UsxSEuqbsnY6vYVmS2hXbLxlurYk7tQ8+owRgfKOzHs4YcdE1U4CEbuuygZlahc53jpNxn5nVBQ+uOO/0uxatvG5dcvf7qdz6Wo8ub8kYcVKfLiGpJBjMIEY6nWkry/JbtgpIDEgJ+BzivPAMMq0ZTBsYYwwBwO6EO+ayOeOznhkBY9gSpmHkwBN+3dYXEr9dv+Ld3mdd/qbrqRGu6+rqen7k1ljsf38aj9fGYjERJzIAfEsSLrnlwcF7s/6Ek29YMD4jrQoHAsZ4gICW8BFsF9RhO1xCMgdDYDKMUCjUuS25tmVKBmDYgIVRezq4jbmc6xJRwGjNTMTGMBtfFzFAscWLi15I/PHRbNYxth0QRQXWsng8Xh+JRJSKRCIimUyanl3K7n7/QMPvstmcTuVMp1ff+PDnQmBC/OWX1dirb+nT6FoXNxkz4Z0DR8/W4TA0MTQcI5RlpCJppJIsBEpLQ9hx6AgZLUEkQERoTKWZAVhKwnMNiNryEsFoYD9cw6y5NQ8Yn6UstiR1tOUrAPhXv/nz0lRWn8RsfNuSjef26/7YzipQcuRII5LJpB+NRuXmF3/+ZnFYrVEBO2CM5zRm/MvOHDvjAWzb5tU3NVXUp3MPH83S2bmc6/uZlM+uawRBgI0CmAgMRQLl5R10587tOwspQWAwGwSUKpMEWMoyDHHsrAdat/EXBthoFlIWWNKcHPCvee2uG58ZfP7M25pS/hTfc3IB21Ydi+17lyxZWBuNRgXi8XyCqaioYGaI0UMrbikMyiMEaXme41bX5+4cPX7OD7a+9NSLp55gn9UhjD2BggIFiLx0hls3zvstMaN9+zA+q24CM38eiD3fDxGAUNAWYIBIgkhCEEED6AnAgH0/GJRFIVX3rRI1/nfx21YNGjfzupqj2UecXMaRMhAsCorkO6+uWobWTuDnja1WzkM/W3j3kW7lRdOCthJgErls1t9b3fjQ4DHT739l+cPv3j9h8OATCsXyUMgCLFtqA8AYn9loAiGXzXrV7fs0BMOBjm3zL2MYSgXaSUXIZnN1JPJpmIiZGdr42gA9YYWCBZ0CXDWmY3hwVfzWjUMumHVXbX1mmevkPMMcKLRFzcBTu00hIkZFxecRUhwb2yORiKp66cnN5aXBuaFQWDGAbDbrVzdm7xkwetr6P//5w9COJ//nujO6FJ3dyZbrikK2FsEixcLKD780e10Az/P9dswM5GMItDZBrRk5x20URL5h1sawYpJSQ4frN20K9Cm0rv94wW2j5xZbtWeMmf7c4br0AsdxPMMsC0K2Prl72cTnVz58sM11vqZAPtkl/UgkorZu/sWyHp0L7wuFwgoM4Ts5r6YhO2Hdll07hl48a/orD9zx7vvL7ome0zM8sFvAPFgqeZdtSViWCg8DKGDZHTnfGyJmAwaKPM1KSBmAsJRlWXbQUqnigN5UGA5uX3Lhhc1b7rrpiRHjZ1865dnf7aptyF3lOhmXGVZRQQin9egUfTXxxFuRSER9dZJJx5uLUTLpn33hzLnVR9NLMzkHbNghkrZtB1BYoKo6dyxbkkz87Fe6dZRz3oKlpzekW0aef3bFyl8+uObR5hxfq72sxyCrwFbZW6ePKn92w7b5jo/+Idts+HavEzYuXfrgUSUJ519xywV7D1Xf0pLyx7ieD7DOgVSwIGQ1n9qjfPKmXy7e1Dar+ydmZBEFJP1RE6698MDhhlXpHHdi3/OIiISylG1JFIStXXbQWt+hqOg3b6xbvN1rdfz+kavW1Ta7E1m7nmG2wkHLnT3l3G53z5tX27bhZTNuPungoZbLU1nniozjf9txfRjf9xmAsmxVFFa7BpzSbUrl6od2RiIRdbw2J/0jE8qZc2/tsf1vdY83tDjfzbkuiLXLICGVUkJKCDCCtvWJknJXUcjeebSheULK8fuCfcMsRMASfHK39j9K54xwPK9/Nuf283y/r6eF8H0HbLQHCBbCCtgBidKS4PIZw779g3nxec3/n/D/0Ji1bXghBTDi4tlXHKhuvNfxUKGNBoyvDdgDsyWEkkJZEELC+F4+O7eyEIaBZdkQQkFrDTYahrVh1h4MLJIBEbAUCoL0Vo9O7e/ZvH7pFv7KfPrfm9Tn57UAYKqqVgfv/snbU5sy3uxUKjvY9Qx883kX3CWQAViiNd/mtTBgQLdmNgkSliALQhACClwUsn/buX3p8i0blq7zfPMfHnR/w2kAgGVJXDT5+uH7Pq2/KJPzvuP63I+FCOUtDnArFWbiPGkgkSdrZCAlmm0ldxSE7de+dVKnDWtXPLzTb8XPsXv8ly57fPnOBAAoSfj+vPu77z/U0Lclnentuv6JJMUJzc1NCARshEMhz/j6UDBof1oYtPYM7ttnz4//Z27NMTU7RaNR8a9c9vi3brpEo1HZOt/91wzxH7hu83/MHKXXLuq9rQAAAABJRU5ErkJggg==';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Open+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');`;

// Helper: read current theme colors from DOM — works in any component without prop drilling
function getTC() {
  const dark = document.documentElement.classList.contains('theme-dark');
  return dark ? {
    bg:'#0f1a28',surface:'#162033',border:'#243548',text:'#e0ddd6',text2:'#7a8a98',text3:'#3d5060',
    green:'#4aaec0',red:'#e06060',gold:'#d4c06a',blue:'#5ab8cc',gridLine:'#1e3245',accent:'#3a9ab5'
  } : {
    bg:'#f7f4ee',surface:'#ffffff',border:'#d4cbb5',text:'#1A314E',text2:'#5e7082',text3:'#94a3b4',
    green:'#2d8a5e',red:'#c92a2a',gold:'#b8a04c',blue:'#2A758D',gridLine:'#e4ddd0',accent:'#2A758D'
  };
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    /* Light theme — foliologic warm paper + teal brand */
    --bg: #f7f4ee; --surface: #ffffff; --surface2: #f0ebe1;
    --border: #d4cbb5; --border2: #c4b9a0;
    --text: #1A314E; --text2: #5e7082; --text3: #94a3b4;
    --accent: #2A758D; --accent-dim: rgba(42,117,141,0.07); --accent-border: rgba(42,117,141,0.2);
    --green: #2d8a5e; --green-dim: rgba(45,138,94,0.07);
    --red: #c92a2a;   --red-dim: rgba(201,42,42,0.06);
    --gold: #b8a04c;  --blue: #2A758D; --violet: #7c5cbf;
    --modal-shadow: rgba(0,0,0,0.12);
    --chart-grid: #e4ddd0;
    --popover-shadow: 0 12px 40px rgba(0,0,0,0.10);
  }
  .theme-dark {
    /* Dark theme — foliologic navy + teal brand */
    --bg: #0f1a28; --surface: #162033; --surface2: #1a2d42;
    --border: #243548; --border2: #2e4158;
    --text: #e0ddd6; --text2: #7a8a98; --text3: #3d5060;
    --accent: #3a9ab5; --accent-dim: rgba(58,154,181,0.1); --accent-border: rgba(58,154,181,0.25);
    --green: #4aaec0; --green-dim: rgba(74,174,192,0.08);
    --red: #e06060;   --red-dim: rgba(224,96,96,0.08);
    --gold: #d4c06a;  --blue: #5ab8cc; --violet: #a78bfa;
    --modal-shadow: rgba(0,0,0,0.5);
    --chart-grid: #1e3245;
    --popover-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }
  body { background:var(--bg); color:var(--text); font-family:'Open Sans',sans-serif; }
  .mono { font-family:'IBM Plex Mono',monospace; }
  .serif { font-family:'Cormorant Garamond',serif; }
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
  .nav-item.active{color:var(--accent);background:var(--accent-dim);border-color:var(--accent-border)}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:10px;transition:border-color 0.2s}
  .card:hover{border-color:var(--border2)}
  .pill{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.07em;padding:4px 10px;border-radius:4px;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--text3);transition:all 0.15s;font-weight:500}
  .pill:hover{color:var(--text2);border-color:var(--border2)}
  .tag{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.06em;padding:3px 8px;border-radius:3px;font-weight:500}
  .tag-green{background:var(--green-dim);color:var(--green)} .tag-red{background:var(--red-dim);color:var(--red)}
  .tag-gold{background:rgba(184,160,76,0.12);color:var(--gold)} .tag-gray{background:var(--surface2);color:var(--text2)}
  .tag-blue{background:rgba(42,117,141,0.12);color:var(--blue)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.06em;font-weight:500;cursor:pointer;transition:all 0.15s;border:none}
  .btn-primary{background:var(--accent);color:#fff} .btn-primary:hover{filter:brightness(1.1)}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)} .btn-ghost:hover{color:var(--text);border-color:var(--text3)}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px);animation:fadeUp 0.2s ease}
  .theme-dark .modal-overlay{background:rgba(0,0,0,0.75)}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:28px;width:440px;box-shadow:0 24px 80px var(--modal-shadow)}
  .inp{width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:6px;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:13px;padding:10px 12px;outline:none;transition:border 0.15s}
  .inp:focus{border-color:var(--accent)} .inp::placeholder{color:var(--text3)}
  .trow{display:grid;grid-template-columns:2.2fr 0.8fr 1fr 1fr 0.8fr 1fr 0.8fr;align-items:center;padding:13px 18px;border-bottom:1px solid var(--border);transition:background 0.12s;cursor:pointer}
  .trow:hover{background:var(--surface2)} .trow:last-child{border-bottom:none}
  .btog{display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;transition:all 0.15s;font-family:'IBM Plex Mono',monospace;font-size:10px}
  .btog.on{border-color:var(--accent-border);background:var(--accent-dim)} .btog.off{opacity:0.4}
  .ctt{background:var(--surface);border:1px solid var(--border2);border-radius:8px;padding:12px 16px;font-family:'IBM Plex Mono',monospace;font-size:11px;box-shadow:0 8px 32px var(--modal-shadow)}
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
  .mob-nav-btn.active{color:var(--accent)}
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

// ── Account type map: name → { label, icon } ─────────────────────────────────
// Used in "By Account" tab badge. cold_wallet type is always overridden by wallet.type.
const ACCOUNT_TYPE_MAP = {
  // Crypto Exchanges
  'Bitvavo':       { label: 'Crypto Exchange', icon: '⬡' },
  'Binance':       { label: 'Crypto Exchange', icon: '⬡' },
  'Coinbase':      { label: 'Crypto Exchange', icon: '⬡' },
  'Kraken':        { label: 'Crypto Exchange', icon: '⬡' },
  'Bybit':         { label: 'Crypto Exchange', icon: '⬡' },
  'OKX':           { label: 'Crypto Exchange', icon: '⬡' },
  'KuCoin':        { label: 'Crypto Exchange', icon: '⬡' },
  'Gate.io':       { label: 'Crypto Exchange', icon: '⬡' },
  'Huobi':         { label: 'Crypto Exchange', icon: '⬡' },
  'Bitfinex':      { label: 'Crypto Exchange', icon: '⬡' },
  'Gemini':        { label: 'Crypto Exchange', icon: '⬡' },
  'Bitpanda':      { label: 'Crypto Exchange', icon: '⬡' },
  'Crypto.com':    { label: 'Crypto Exchange', icon: '⬡' },
  'eToro':         { label: 'Crypto Exchange', icon: '⬡' },
  'Nexo':          { label: 'Crypto Exchange', icon: '⬡' },
  // Stock/ETF Brokers
  'Smartbroker+':    { label: 'Broker', icon: '◈' },
  'Trade Republic':  { label: 'Broker', icon: '◈' },
  'DEGIRO':          { label: 'Broker', icon: '◈' },
  'Interactive Brokers': { label: 'Broker', icon: '◈' },
  'Flatex':          { label: 'Broker', icon: '◈' },
  'Scalable Capital': { label: 'Broker', icon: '◈' },
  'Comdirect':       { label: 'Broker', icon: '◈' },
  'ING':             { label: 'Broker', icon: '◈' },
  'DKB':             { label: 'Broker', icon: '◈' },
  'Consorsbank':     { label: 'Broker', icon: '◈' },
  'Fidelity':        { label: 'Broker', icon: '◈' },
  'Charles Schwab':  { label: 'Broker', icon: '◈' },
  'Robinhood':       { label: 'Broker', icon: '◈' },
  'Revolut':         { label: 'Broker', icon: '◈' },
  // Cold / Hardware Wallets
  'Tangem':          { label: 'Cold Wallet', icon: '🔒' },
  'Ledger':          { label: 'Cold Wallet', icon: '🔒' },
  'Trezor':          { label: 'Cold Wallet', icon: '🔒' },
  'Coldcard':        { label: 'Cold Wallet', icon: '🔒' },
  'BitBox':          { label: 'Cold Wallet', icon: '🔒' },
  'Keepkey':         { label: 'Cold Wallet', icon: '🔒' },
  'Foundation Passport': { label: 'Cold Wallet', icon: '🔒' },
  'Ellipal':         { label: 'Cold Wallet', icon: '🔒' },
  'Manual':          { label: 'Manual', icon: '✎' },
};

const getAccountType = (name, isCold) => {
  if (isCold) return { label: 'Cold Wallet', icon: '🔒' };
  if (!name) return { label: 'Broker', icon: '◈' };
  const key = Object.keys(ACCOUNT_TYPE_MAP).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? ACCOUNT_TYPE_MAP[key] : { label: 'Broker', icon: '◈' };
};




const BENCHMARKS    = [
  {id:"sp500", label:"S&P 500",   color:"#5ab8cc"},
  {id:"nasdaq",label:"Nasdaq 100",color:"#d4c06a"},
  {id:"dax",   label:"DAX",       color:"#a78bfa"},
  {id:"btc",   label:"BTC",       color:"#f7931a"},
];
const RANGES        = ["1M","3M","6M","YTD","1Y","ALL"];
const RANGE_MONTHS  = {"1M":1,"3M":3,"6M":6,"YTD":2,"1Y":12,"ALL":999};
const ALLOC_COLORS  = ["#4aaec0","#627eea","#f7931a","#9945ff","#d4c06a","#76b900","#e84142"];
const BROKERS_OPT   = ["Bitvavo","Smartbroker+","Trade Republic","Manual"];
const ASSET_TYPES   = ["stock","etf","crypto"];
const NAV_ITEMS     = [
  {id:"dashboard", label:"Dashboard", icon:"📊"},
  {id:"portfolio", label:"Portfolio",  icon:"💼"},
  {id:"charts",    label:"Charts",     icon:"📈"},
  {id:"watchlist", label:"Watchlist",  icon:"👁"},
  {id:"screener",  label:"Screener",   icon:"🔍"},
  {id:"compare",   label:"Compare",    icon:"⇌"},
  {id:"news",      label:"News Feed",  icon:"📰"},
  {id:"landing",   label:"Landing Page",icon:"🌐"},
  {id:"settings",  label:"Settings",   icon:"⚙"},
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
// Logos resolved automatically via logo.dev (no hardcoded map needed)
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
  const [fallback, setFallback] = React.useState(false);

  // Crypto: CoinGecko
  if (pos.type === 'crypto' && !imgErr) {
    const m = {BTC:'1/small/bitcoin',ETH:'279/small/ethereum',SOL:'4128/small/solana',BNB:'825/small/binance-coin',XRP:'44/small/xrp-symbol-white-128',ADA:'975/small/cardano',DOT:'12171/small/polkadot',MATIC:'4713/small/matic-token',AVAX:'12559/small/avalanche-2',LINK:'877/small/chainlink-new-logo',UNI:'12504/small/uni',AAVE:'7279/small/aave-v3-logo'};
    const path = m[baseSymbol];
    if (path) return (
      <div style={{width:size,height:size,borderRadius:r,overflow:'hidden',flexShrink:0,background:'var(--surface2)'}}>
        <img src={`https://assets.coingecko.com/coins/images/${path}.png`} width={size} height={size}
          style={{objectFit:'cover'}} onError={()=>setImgErr(true)}/>
      </div>
    );
  }

  // Stocks/ETFs: use Clearbit logo API (free, no key, works for most tickers)
  if (baseSymbol && !fallback) {
    // Map ticker to company domain for logo lookup
    const domainGuess = (() => {
      const knownDomains = {
        // US mega-caps
        AAPL:'apple.com',MSFT:'microsoft.com',GOOGL:'google.com',GOOG:'google.com',
        AMZN:'amazon.com',META:'meta.com',NVDA:'nvidia.com',TSLA:'tesla.com',
        AMD:'amd.com',INTC:'intel.com',QCOM:'qualcomm.com',AVGO:'broadcom.com',
        JPM:'jpmorganchase.com',GS:'goldmansachs.com',V:'visa.com',MA:'mastercard.com',
        PYPL:'paypal.com',COIN:'coinbase.com',SOFI:'sofi.com',
        ADBE:'adobe.com',CRM:'salesforce.com',NOW:'servicenow.com',ORCL:'oracle.com',
        SAP:'sap.com',HUBS:'hubspot.com',SNOW:'snowflake.com',
        NFLX:'netflix.com',DIS:'disney.com',SPOT:'spotify.com',
        UBER:'uber.com',LYFT:'lyft.com',ABNB:'airbnb.com',
        SHOP:'shopify.com',ETSY:'etsy.com',EBAY:'ebay.com',
        NKE:'nike.com',MCD:'mcdonalds.com',SBUX:'starbucks.com',
        KO:'coca-cola.com',PEP:'pepsico.com',WMT:'walmart.com',
        PFE:'pfizer.com',MRNA:'modernatx.com',JNJ:'jnj.com',
        PANW:'paloaltonetworks.com',CRWD:'crowdstrike.com',FTNT:'fortinet.com',
        SMCI:'supermicro.com',NTRA:'natera.com',ILMN:'illumina.com',
        CELH:'celsius.com',ELF:'elfcosmetics.com',CPRX:'catalystpharma.com',
        KRYS:'krystalbio.com',ACHR:'archer.com',PINS:'pinterest.com',
        TEM:'tempus.com',XYZ:'block.xyz',SQ:'block.xyz',BLOCK:'block.xyz',
        TTD:'thetradedesk.com',SNAP:'snap.com',
        HUBS:'hubspot.com',QCOM:'qualcomm.com',AVGO:'broadcom.com',
        BNTX:'biontech.de',IRM:'ironmountain.com',
        CRISPR:'crisprtx.com',
        // ETFs
        SPY:'ssga.com',QQQ:'invesco.com',GLD:'spdrgoldshares.com',
        IVV:'ishares.com',VTI:'vanguard.com',
        IWDA:'ishares.com',CSPX:'ishares.com',EIMI:'ishares.com',
        VWCE:'vanguard.com',VWRL:'vanguard.com',
        XNAS:'xtrackers.com',XDWH:'xtrackers.com',
        ARKX:'ark-funds.com',
        // EU stocks
        ASML:'asml.com',
      };
      if (knownDomains[baseSymbol]) return knownDomains[baseSymbol];
      // For .DE tickers, strip suffix and try base symbol
      const base = baseSymbol.replace(/\.(DE|F|AS|PA|MI|L)$/, '');
      if (knownDomains[base]) return knownDomains[base];
      return null;
    })();
    if (!domainGuess) {
      // No domain known yet — skip to ticker badge (avoids firing onError on a doomed URL)
      // Will re-render with correct logo once fmpTicker resolves
    } else {
      const logoUrl = `https://www.google.com/s2/favicons?domain=${domainGuess}&sz=64`;
      return (
        <div style={{width:size,height:size,borderRadius:r,overflow:'hidden',flexShrink:0,
          background:'#fff',border:'1px solid rgba(255,255,255,0.08)'}}>
          <img src={logoUrl} width={size} height={size} style={{objectFit:'contain',padding:3}}
            onError={()=>setFallback(true)}/>
        </div>
      );
    }
  }

  // Final fallback: colored ticker badge
  const svg = getLogoSVG(pos.symbol);
  if (svg) return (
    <div style={{width:size,height:size,borderRadius:r,flexShrink:0,background:`${pos.color}15`,
      border:`1px solid ${pos.color}33`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      {svg}
    </div>
  );
  return (
    <div style={{width:size,height:size,borderRadius:r,background:`${pos.color}22`,
      border:`1px solid ${pos.color}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <span className="mono" style={{fontSize:size*0.25,color:pos.color,fontWeight:700}}>
        {(baseSymbol||pos.symbol||'?').slice(0,4)}
      </span>
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
          <span style={{color:p.value>=0?"var(--green)":"var(--red)",fontWeight:600}}>{p.value>=0?"+":""}{Number(p.value).toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}

// ── EUR/USD rate fallback ──
const EUR_USD = 1.085;

// ── AI News Feed ──────────────────────────────────────────────
const SENTIMENT_STYLE = {
  bullish:  { color:"#4aaec0", bg:"rgba(58,154,181,0.10)",  border:"rgba(58,154,181,0.25)",  label:"BULLISH"  },
  bearish:  { color:"#e06060", bg:"rgba(224,96,96,0.10)", border:"rgba(224,96,96,0.25)", label:"BEARISH"  },
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
                border:`1px solid ${active?"rgba(58,154,181,0.35)":pos?`${pos.color}33`:"var(--border)"}`,
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


// ── ColdWalletModal ────────────────────────────────────────────────────────────
// Shows after import when transfer_out transactions are detected.
// Lets user create cold wallets and assign transferred coins to them.
class ColdWalletErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error('[ColdWallet crash]', e, info?.componentStack); }
  render() {
    if (this.state.error) return (
      <div className="modal-overlay">
        <div className="modal" style={{padding:24,maxWidth:500}}>
          <div style={{color:'var(--red)',fontWeight:600,marginBottom:8}}>Cold Wallet Modal Error</div>
          <pre style={{fontSize:11,color:'var(--text2)',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{this.state.error?.message}{'\n'}{this.state.error?.stack?.slice(0,600)}</pre>
          <button className="btn btn-ghost" onClick={this.props.onClose} style={{marginTop:12}}>Close</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function ColdWalletModal({ transfers, existingWallets, existingPositions, sourceBroker, onSave, onClose }) {
  const COLD_COLORS = ['#9945ff','#f7931a','#627eea','#e84142','#00d395','#2775ca','#ff6b35','#c3a634'];

  // Wallets: start with ALL existing cold wallets pre-populated
  const [wallets, setWallets] = useState(() =>
    existingWallets.filter(w => w.type === 'cold_wallet')
  );
  const [newWalletName, setNewWalletName] = useState('');

  // allocations: { symbol: { walletId: qtyString } }
  const [allocations, setAllocations] = useState(() => {
    const init = {};
    const coldWallets = existingWallets.filter(w => w.type === 'cold_wallet');
    for (const t of transfers) {
      init[t.symbol] = {};
      if (coldWallets.length === 1) {
        // Single cold wallet — always assign full detected qty (source of truth is transaction history)
        init[t.symbol][coldWallets[0].id] = String(Math.round(t.qty * 1e6) / 1e6);
      } else if (coldWallets.length > 1) {
        // Multiple wallets — assign all to first by default, user can redistribute
        init[t.symbol][coldWallets[0].id] = String(Math.round(t.qty * 1e6) / 1e6);
      }
    }
    return init;
  });

  const addWallet = () => {
    const name = newWalletName.trim();
    if (!name) return;
    const id = 'cw_' + Date.now();
    const color = COLD_COLORS[(existingWallets.filter(w=>w.type==='cold_wallet').length + wallets.length) % COLD_COLORS.length];
    const newWallet = { id, name, type: 'cold_wallet', color };
    const isFirst = wallets.length === 0;
    setWallets(w => [...w, newWallet]);
    // If this is the first wallet being added, auto-fill all unassigned coins to it
    if (isFirst) {
      setAllocations(prev => {
        const next = { ...prev };
        for (const t of transfers) {
          const sym = t.symbol;
          const hasAnyAlloc = Object.values(next[sym] || {}).some(v => parseFloat(v) > 0);
          if (!hasAnyAlloc) {
            next[sym] = { ...next[sym], [id]: String(Math.round(t.qty * 1e6) / 1e6) };
          }
        }
        return next;
      });
    }
    setNewWalletName('');
  };

  const setAlloc = (symbol, walletId, val) => {
    setAllocations(a => ({
      ...a,
      [symbol]: { ...a[symbol], [walletId]: val }
    }));
  };

  // For a given symbol, parse all allocations and compute totals
  const getSymbolStats = (t) => {
    const alloc = allocations[t.symbol] || {};
    const entries = Object.entries(alloc)
      .map(([wid, v]) => ({ walletId: wid, qty: parseFloat(v) || 0 }))
      .filter(e => e.qty > 0);
    const totalAllocated = entries.reduce((s, e) => s + e.qty, 0);
    const remaining = Math.round((t.qty - totalAllocated) * 1e8) / 1e8;
    const isOverAllocated = totalAllocated > t.qty * 1.001;
    return { entries, totalAllocated, remaining, isOverAllocated };
  };

  const fillRemaining = (symbol, walletId, remaining) => {
    if (remaining <= 0) return;
    setAllocations(a => {
      const current = parseFloat((a[symbol] || {})[walletId]) || 0;
      return { ...a, [symbol]: { ...a[symbol], [walletId]: String(Math.round((current + remaining) * 1e8) / 1e8) } };
    });
  };

  // Count how many coins have at least one valid allocation
  const coinsWithAlloc = transfers.filter(t => {
    const { entries, isOverAllocated } = getSymbolStats(t);
    return entries.length > 0 && !isOverAllocated;
  });

  const handleSave = () => {
    const newPositions = [];
    let posIdx = 0;
    for (const t of transfers) {
      const { entries, isOverAllocated } = getSymbolStats(t);
      if (isOverAllocated) continue;
      for (const { walletId, qty } of entries) {
        const wallet = wallets.find(w => w.id === walletId);
        if (!wallet || qty <= 0) continue;
        newPositions.push({
          id: Date.now() + posIdx++,
          symbol: t.symbol, isin: null, name: t.name,
          type: 'crypto', qty: Math.round(qty * 1e8) / 1e8,
          avgPrice: t.avgPrice || 0, currentPrice: 0,
          broker: wallet.name, walletId: wallet.id,
          color: wallet.color,
          coinId: getCoinId(t.symbol),
        });
      }
    }
    onSave({ newWallets: wallets, newPositions, sourceBroker });
  };

  const hasExistingWallets = wallets.length > 0;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div className="serif" style={{ fontSize: 20 }}>Cold Wallet Transfers Detected</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
              {transfers.length} coin{transfers.length !== 1 ? 's' : ''} sent to cold wallet. Quantities show what Bitvavo sent — adjust for network fees if needed.
            </div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 18, padding: '2px 8px', flexShrink: 0, marginLeft: 12 }} onClick={onClose}>×</button>
        </div>

        {/* Create wallet row */}
        <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px', marginBottom: 16, border: '1px solid var(--border)' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 8 }}>
            {hasExistingWallets ? 'ADD ANOTHER COLD WALLET' : 'CREATE COLD WALLET'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={newWalletName} onChange={e => setNewWalletName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWallet()}
              placeholder="e.g. Ledger Nano, MetaMask, Trezor…"
              style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                padding: '7px 12px', fontSize: 13, color: 'var(--text)', outline: 'none' }} />
            <button className="btn btn-primary" onClick={addWallet} disabled={!newWalletName.trim()} style={{ flexShrink: 0 }}>+ Add</button>
          </div>
          {wallets.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {wallets.map(w => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px',
                  borderRadius: 20, background: w.color + '18', border: `1px solid ${w.color}50` }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: w.color }} />
                  <span style={{ fontSize: 11, color: w.color, fontWeight: 500 }}>🔒 {w.name}</span>
                  <button onClick={() => {
                    setWallets(ws => ws.filter(x => x.id !== w.id));
                    setAllocations(a => {
                      const n = {};
                      for (const sym of Object.keys(a)) {
                        n[sym] = { ...a[sym] };
                        delete n[sym][w.id];
                      }
                      return n;
                    });
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coin allocation table */}
        {wallets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text3)', fontSize: 13, fontStyle: 'italic' }}>
            Create at least one cold wallet above to start assigning coins
          </div>
        ) : (
          <>
            <div className="mono" style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 10 }}>
              ASSIGN QUANTITIES · split across multiple wallets or leave blank to skip
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {transfers.map(t => {
                const { entries, totalAllocated, remaining, isOverAllocated } = getSymbolStats(t);
                const decimals = t.qty < 1 ? 6 : 4;
                return (
                  <div key={t.symbol} style={{ borderRadius: 8, border: `1px solid ${isOverAllocated ? 'var(--red)' : entries.length > 0 ? 'var(--border-active, #2a3a4a)' : 'var(--border)'}`,
                    background: isOverAllocated ? 'rgba(224,96,96,0.05)' : 'var(--surface2)', overflow: 'hidden' }}>

                    {/* Coin header */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', gap: 10, borderBottom: '1px solid var(--border)' }}>
                      <AssetLogo pos={{ symbol: t.symbol, type: 'crypto', name: t.name }} size={22} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{t.symbol}</span>
                        <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 6 }}>{t.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--text2)' }}>
                          {t.qty.toFixed(decimals)} available
                        </div>
                        {totalAllocated > 0 && (
                          <div className="mono" style={{ fontSize: 10, color: isOverAllocated ? 'var(--red)' : remaining > 0.000001 ? 'var(--text3)' : 'var(--green)', marginTop: 1 }}>
                            {isOverAllocated
                              ? `⚠ over by ${(totalAllocated - t.qty).toFixed(decimals)}`
                              : remaining > 0.000001
                                ? `${remaining.toFixed(decimals)} unassigned`
                                : '✓ fully assigned'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Per-wallet qty inputs */}
                    <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {wallets.map(w => {
                        const val = (allocations[t.symbol] || {})[w.id] || '';
                        const parsedVal = parseFloat(val) || 0;
                        return (
                          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {w.name}
                            </span>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              {/* Quick-fill remaining button */}
                              {remaining > 0.000001 && (
                                <button onClick={() => fillRemaining(t.symbol, w.id, remaining)}
                                  style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                                    background: w.color + '15', border: `1px solid ${w.color}40`,
                                    color: w.color, whiteSpace: 'nowrap' }}>
                                  +{remaining.toFixed(decimals > 4 ? 4 : decimals)}
                                </button>
                              )}
                              <input
                                type="number" step="any" min="0" max={t.qty}
                                value={val}
                                onChange={e => setAlloc(t.symbol, w.id, e.target.value)}
                                placeholder="0"
                                style={{ width: 110, textAlign: 'right', background: 'var(--surface)',
                                  border: `1px solid ${parsedVal > 0 ? w.color + '60' : 'var(--border)'}`,
                                  borderRadius: 5, padding: '4px 8px', fontSize: 12, color: 'var(--text)', outline: 'none' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
          {coinsWithAlloc.length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text3)', marginRight: 'auto' }}>
              {coinsWithAlloc.length} coin{coinsWithAlloc.length !== 1 ? 's' : ''} will be added ·{' '}
              {transfers.length - coinsWithAlloc.length > 0 && `${transfers.length - coinsWithAlloc.length} skipped`}
            </span>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Skip</button>
          <button className="btn btn-primary" onClick={handleSave}
            disabled={coinsWithAlloc.length === 0 || wallets.length === 0}>
            Add to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}


// ── TransferModal — record a transfer between broker ↔ cold wallet ──────────
function TransferModal({ modal, wallets, positions, onClose, onSave }) {
  const { direction, pos } = modal; // direction: 'to_cold' | 'from_cold'
  const isToCold   = direction === 'to_cold';
  const coldWallets = (wallets || []).filter(w => w.type === 'cold_wallet');

  const symbol  = pos.symbol;
  const maxQty  = parseFloat(pos.qty) || 0;
  const brokerPositions = positions.filter(p => p.symbol === symbol && !p.walletId);

  const [qty,       setQty]       = React.useState('');
  const [fee,       setFee]       = React.useState('');
  const [targetId,  setTargetId]  = React.useState(coldWallets[0]?.id || '');
  const [destBroker,setDestBroker]= React.useState(brokerPositions[0]?.broker || '');
  const [date,      setDate]      = React.useState(new Date().toISOString().split('T')[0]);
  const [err,       setErr]       = React.useState('');

  const labelInput = {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '8px 12px', color: 'var(--text)', fontSize: 13,
    width: '100%', boxSizing: 'border-box',
  };

  const handleSave = () => {
    const qtyNum = parseFloat(qty);
    if (!qtyNum || qtyNum <= 0)             { setErr('Enter a valid quantity.'); return; }
    if (qtyNum > maxQty)                    { setErr(`Max available: ${maxQty}`); return; }
    if (isToCold && !targetId)              { setErr('Select a cold wallet.'); return; }

    const txId = 'tx_transfer_' + Date.now();
    // Fee is paid in the coin (deducted from what arrives at destination)
    const feeCoins = parseFloat(fee) || 0;
    const arrivedQty = +(qtyNum - feeCoins).toFixed(8);
    if (arrivedQty < 0) { setErr('Fee cannot exceed transfer amount.'); return; }

    if (isToCold) {
      const wallet = wallets.find(w => w.id === targetId);
      // Reduce source broker position by full sent amount
      const fromPos = { id: pos.id, newQty: +(maxQty - qtyNum).toFixed(8) };

      // Find existing cold wallet position for same symbol
      const existingCold = positions.find(p =>
        p.symbol === symbol && p.walletId === targetId
      );
      // Cold wallet receives arrived qty (sent minus fee)
      const toPos = existingCold
        ? { id: existingCold.id, newQty: +(existingCold.qty + arrivedQty).toFixed(8) }
        : {
            isNew: true,
            id: 'pos_cold_' + symbol + '_' + targetId + '_' + Date.now(),
            symbol, name: pos.name, type: 'crypto',
            qty: arrivedQty,
            avgPrice: pos.avgPrice,
            currentPrice: pos.currentPrice,
            broker: wallet?.name || 'Cold Wallet',
            walletId: targetId,
            color: wallet?.color || '#9945ff',
          };

      const txRecord = {
        id: txId, date, type: 'transfer_out', symbol,
        qty: qtyNum, price: pos.currentPrice,
        fee: feeCoins, broker: pos.broker,
        note: `Transfer to ${wallet?.name || 'cold wallet'}${feeCoins > 0 ? ` (fee: ${feeCoins} ${symbol})` : ''}`,
      };
      onSave(fromPos, toPos, txRecord);

    } else {
      // from_cold → exchange
      const exchPos = positions.find(p =>
        p.symbol === symbol && !p.walletId && p.broker === destBroker
      ) || positions.find(p => p.symbol === symbol && !p.walletId);

      // Cold wallet sends full qtyNum, exchange receives arrivedQty
      const fromPos = { id: pos.id, newQty: +(maxQty - qtyNum).toFixed(8) };
      const toPos = exchPos
        ? { id: exchPos.id, newQty: +(parseFloat(exchPos.qty) + arrivedQty).toFixed(8) }
        : {
            isNew: true,
            id: 'pos_exch_' + symbol + '_' + Date.now(),
            symbol, name: pos.name, type: 'crypto',
            qty: arrivedQty, avgPrice: pos.avgPrice,
            currentPrice: pos.currentPrice,
            broker: destBroker || 'Exchange',
            color: pos.color,
          };

      const txRecord = {
        id: txId, date, type: 'transfer_in', symbol,
        qty: arrivedQty, price: pos.currentPrice,
        fee: feeCoins, broker: destBroker || pos.broker,
        note: `Transfer from cold wallet${feeCoins > 0 ? ` (fee: ${feeCoins} ${symbol})` : ''}`,
      };
      onSave(fromPos, toPos, txRecord);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="serif" style={{ fontSize: 20, marginBottom: 4 }}>
          {isToCold ? '🔒 Transfer to Cold Wallet' : '↩ Transfer to Exchange'}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 20 }}>
          {symbol} · Available: {maxQty % 1 === 0 ? maxQty : maxQty.toFixed(6)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quantity */}
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.08em' }}>AMOUNT TO TRANSFER</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" min="0" max={maxQty} step="any" value={qty}
                onChange={e => setQty(e.target.value)} placeholder={`Max ${maxQty}`}
                style={labelInput} />
              <button className="btn btn-ghost" style={{ fontSize: 11, whiteSpace: 'nowrap' }}
                onClick={() => setQty(String(maxQty))}>MAX</button>
            </div>
          </div>

          {/* Network fee */}
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.08em' }}>NETWORK FEE (in {symbol}, deducted from arrival)</div>
            <input type="number" min="0" step="any" value={fee}
              onChange={e => setFee(e.target.value)} placeholder="0"
              style={labelInput} />
            {fee > 0 && qty > 0 && (
              <div className="mono" style={{fontSize:10, color:'var(--text3)', marginTop:4}}>
                Recipient receives: {Math.max(0, parseFloat(qty) - parseFloat(fee)).toFixed(6)} {symbol}
              </div>
            )}
          </div>

          {/* Cold wallet selector (to_cold only) */}
          {isToCold && coldWallets.length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.08em' }}>DESTINATION COLD WALLET</div>
              <select value={targetId} onChange={e => setTargetId(e.target.value)} style={labelInput}>
                {coldWallets.map(w => <option key={w.id} value={w.id}>🔒 {w.name}</option>)}
              </select>
            </div>
          )}
          {isToCold && coldWallets.length === 0 && (
            <div className="mono" style={{ fontSize: 11, color: 'var(--red)', padding: '8px 12px', background: 'rgba(224,96,96,0.1)', borderRadius: 6 }}>
              No cold wallets added yet. Add one first via the + ADD menu.
            </div>
          )}

          {/* Broker picker (from_cold) */}
          {!isToCold && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.08em' }}>DESTINATION EXCHANGE / BROKER</div>
              {brokerPositions.length > 0
                ? <select value={destBroker} onChange={e => setDestBroker(e.target.value)} style={labelInput}>
                    {brokerPositions.map(p => <option key={p.broker} value={p.broker}>{p.broker}</option>)}
                  </select>
                : <input value={destBroker} onChange={e => setDestBroker(e.target.value)}
                    placeholder="e.g. Bitvavo" style={labelInput} />
              }
            </div>
          )}

          {/* Date */}
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.08em' }}>TRANSFER DATE</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={labelInput} />
          </div>

          {err && <div className="mono" style={{ fontSize: 11, color: 'var(--red)', padding: '6px 10px', background: 'rgba(224,96,96,0.1)', borderRadius: 6 }}>{err}</div>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-ghost" onClick={onClose}>CANCEL</button>
            <button className="btn btn-primary" onClick={handleSave}
              disabled={isToCold && coldWallets.length === 0}>
              CONFIRM TRANSFER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function DangerZone({ positions, transactions, wallets, setPositions, setTransactions, setWallets, setNav, setChartData }) {
  const [deleteSelected, setDeleteSelected] = React.useState(new Set());
  const [deleteMode, setDeleteMode] = React.useState(false);

  const brokersWithData = (() => {
    // Start with wallets that have matching positions/transactions
    const fromWallets = wallets.filter(w => {
      if (w.type === 'cold_wallet') return positions.some(p => p.broker === w.name || p.walletId === w.id);
      return positions.some(p => p.broker === w.name) || transactions.some(t => t.broker === w.name);
    });
    // Also find broker names from positions that have NO matching wallet entry
    const walletNames = new Set(wallets.map(w => w.name));
    const orphanBrokers = [...new Set(positions.map(p => p.broker).filter(Boolean))]
      .filter(name => !walletNames.has(name))
      .map(name => ({ id: 'auto_' + name.toLowerCase().replace(/\s+/g, '_'), name, type: 'broker', color: '#7a8a98' }));
    return [...fromWallets, ...orphanBrokers];
  })();
  const hasAnyData = positions.length > 0 || transactions.length > 0;

  const toggleSelect = (id) => setDeleteSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const selectAll = () => setDeleteSelected(new Set(['__all__', ...brokersWithData.map(w => w.id)]));
  const selectNone = () => setDeleteSelected(new Set());

  const handleDelete = () => {
    const isAll = deleteSelected.has('__all__');
    const label = isAll ? 'ALL portfolio data' : [...deleteSelected].map(id => brokersWithData.find(w => w.id === id)?.name).filter(Boolean).join(', ');
    if (!label) return;
    if (!window.confirm(`Delete ${label}?\n\nThis cannot be undone.`)) return;
    if (isAll) {
      setPositions([]);
      setTransactions([]);
      setWallets(prev => prev.filter(w => w.type !== 'cold_wallet'));
      if (setChartData) setChartData([]);
    } else {
      const selectedWallets = brokersWithData.filter(w => deleteSelected.has(w.id));
      const selectedNames = new Set(selectedWallets.map(w => w.name));
      const coldIds = new Set(selectedWallets.filter(w => w.type === 'cold_wallet').map(w => w.id));
      setPositions(prev => prev.filter(p => !selectedNames.has(p.broker) && !(p.walletId && coldIds.has(p.walletId))));
      setTransactions(prev => prev.filter(t => !selectedNames.has(t.broker)));
      setWallets(prev => prev.filter(w => !coldIds.has(w.id)));
    }
    setDeleteMode(false);
    setDeleteSelected(new Set());
    setNav('dashboard');
  };

  return (
    <div className="card" style={{padding:28,borderColor:"rgba(224,96,96,0.2)"}}>
      <div className="mono" style={{fontSize:10,color:"var(--red)",letterSpacing:"0.12em",marginBottom:18}}>DANGER ZONE</div>
      {!deleteMode ? (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>Delete portfolio data</div>
            <div style={{fontSize:11,color:"var(--text3)"}}>Remove positions and transactions by broker or wallet. Cannot be undone.</div>
          </div>
          <button className="btn" style={{borderColor:"var(--red)",color:"var(--red)",flexShrink:0,marginLeft:16}}
            onClick={() => setDeleteMode(true)} disabled={!hasAnyData}>
            🗑 Delete…
          </button>
        </div>
      ) : (
        <div>
          <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>Select what to delete</div>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:14}}>Choose brokers or wallets to remove, or delete everything.</div>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <button className="btn btn-ghost" style={{fontSize:11,padding:'3px 10px'}} onClick={selectAll}>Select all</button>
            <button className="btn btn-ghost" style={{fontSize:11,padding:'3px 10px'}} onClick={selectNone}>Clear</button>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,
            background:deleteSelected.has('__all__')?'rgba(224,96,96,0.08)':'var(--surface2)',
            border:`1px solid ${deleteSelected.has('__all__')?'var(--red)':'var(--border)'}`,
            cursor:'pointer',marginBottom:8,userSelect:'none'}}>
            <input type="checkbox" checked={deleteSelected.has('__all__')} onChange={()=>toggleSelect('__all__')} style={{accentColor:'var(--red)',width:14,height:14}} />
            <span style={{fontSize:13,fontWeight:600,color:'var(--red)'}}>🗑 Everything</span>
            <span style={{fontSize:11,color:'var(--text3)',marginLeft:'auto'}}>All positions, transactions &amp; wallets</span>
          </label>
          {brokersWithData.length > 0 && (
            <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
              {brokersWithData.map(w => {
                const posCount = positions.filter(p => p.broker === w.name || p.walletId === w.id).length;
                const txCount = transactions.filter(t => t.broker === w.name).length;
                const checked = deleteSelected.has(w.id) && !deleteSelected.has('__all__');
                const disabled = deleteSelected.has('__all__');
                return (
                  <label key={w.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,
                    background:checked?'rgba(224,96,96,0.06)':'var(--surface2)',
                    border:`1px solid ${checked?'rgba(224,96,96,0.4)':'var(--border)'}`,
                    cursor:disabled?'default':'pointer',opacity:disabled?0.5:1,userSelect:'none'}}>
                    <input type="checkbox" checked={checked} disabled={disabled} onChange={()=>!disabled&&toggleSelect(w.id)} style={{accentColor:'var(--red)',width:14,height:14}} />
                    <div style={{width:8,height:8,borderRadius:'50%',background:w.color,flexShrink:0}} />
                    <span style={{fontSize:13,flex:1}}>{w.type==='cold_wallet'?'🔒 ':''}{w.name}</span>
                    <span style={{fontSize:11,color:'var(--text3)'}}>{posCount} position{posCount!==1?'s':''}{txCount>0?`, ${txCount} tx`:''}</span>
                  </label>
                );
              })}
            </div>
          )}
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" onClick={()=>{setDeleteMode(false);setDeleteSelected(new Set());}}>Cancel</button>
            <button className="btn" style={{borderColor:'var(--red)',color:'var(--red)'}} onClick={handleDelete} disabled={deleteSelected.size===0}>
              🗑 Delete {deleteSelected.has('__all__')?'Everything':deleteSelected.size>0?`${deleteSelected.size} selected`:'…'}
            </button>
          </div>
        </div>
      )}
      <div style={{borderTop:'1px solid var(--border)',marginTop:20,paddingTop:20}}>
        <DevModeToggle />
      </div>
    </div>
  );
}

function DevModeToggle() {
  const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD || '';
  const [devMode, setDevMode] = React.useState(() => {
    try { return localStorage.getItem('folio_dev_mode') === 'true'; } catch(e) { return false; }
  });
  const toggle = () => {
    if (devMode) {
      // turning off — no password needed
      try { localStorage.setItem('folio_dev_mode', 'false'); } catch(e) {}
      setDevMode(false);
      return;
    }
    if (DEV_PASSWORD) {
      const entered = prompt('Enter developer password:');
      if (!entered || entered !== DEV_PASSWORD) {
        alert('Incorrect password.');
        return;
      }
    }
    try { localStorage.setItem('folio_dev_mode', 'true'); } catch(e) {}
    setDevMode(true);
  };
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>Developer mode</div>
        <div style={{fontSize:11,color:"var(--text3)"}}>Unlimited AI imports for testing. Disable before launch.</div>
      </div>
      <button className="btn" style={{flexShrink:0,marginLeft:16,
        ...(devMode?{background:'var(--green-dim)',color:'var(--green)',borderColor:'rgba(58,154,181,0.3)'}:{})}}
        onClick={toggle}>
        {devMode ? '✓ Dev Mode ON' : 'Dev Mode OFF'}
      </button>
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
  const iKuerzel=hi('kürzel|kurzel|wkn');
  const pd = s => parseFloat(String(s||'').trim().replace(/\./g,'').replace(',','.')) || 0;
  return rows
    .filter(r => {
      const status=(r[iStatus]||'').trim().toUpperCase();
      const type=(r[iType]||'').trim().toUpperCase();
      return status==='CONFIRMED'&&(type==='BUY'||type==='SELL'||type==='BUY_SAVINGSPLAN');
    })
    .map(r => {
      const isin = (r[iISIN]||'').trim();
      const kuerzel = iKuerzel>=0 ? (r[iKuerzel]||'').trim() : '';
      // symbol: use Kürzel if available and not an ISIN, else ISIN_MAP lookup, else isin itself
      const symbol = (kuerzel && !isISIN(kuerzel)) ? kuerzel.toUpperCase()
        : (ISIN_MAP[isin] || isin);
      return {
        date: (r[iDate]||'').trim(),
        type: (r[iType]||'').toUpperCase().includes('SELL')?'sell':'buy',
        amountEur: Math.abs(pd(r[iAmount])),
        isin,
        symbol,
        name: (r[iName]||'').trim(),
        qty: pd(r[iQty]),
      };
    })
    .filter(t=>t.date&&t.amountEur>0);
}
function isSmartbrokerActivity(headers) {
  return headers.some(h=>/transaktionstyp/i.test(h)) && headers.some(h=>/valutadatum/i.test(h));
}

// ── German depot snapshot parser (Smartbroker+, DKB, ING — known reliable formats) ──
function isGermanDepotSnapshot(headers) {
  return headers.some(h => /kundennummer|depotnummer|einstandskurs|einstiegskurs|marktkurs|bewertungskurs|stücke|stückzahl/i.test(h));
}
function parseGermanDepotSnapshot(rows, headers) {
  const hi = k => headers.findIndex(h => new RegExp(k,"i").test(h));
  const iISIN=hi("isin"), iKuerzel=hi("kürzel|kurzel|wkn"), iName1=hi("name 1|name1|wertpapierbezeichnung"),
        iName2=hi("name 2|name2"), iKlasse=hi("assetklasse"), iQty=hi("stücke|stucke|stückzahl|stueckzahl|anzahl"),
        iAvg=hi("einstandskurs|einstiegskurs"), iCurrent=hi("marktkurs|bewertungskurs");
  const parseDE = s => s ? parseFloat(String(s).replace(/[€%]/g,"").replace(/\./g,"").replace(",",".").trim()) || 0 : 0;
  const typeMap = { "aktien":"stock","etfs":"etf","etf":"etf","derivate":"derivative","fonds":"etf","anleihen":"stock" };
  // Detect broker from headers
  const brokerName = headers.some(h => /kundennummer/i.test(h)) ? "Smartbroker+"
    : headers.some(h => /einstiegskurs|bewertungskurs/i.test(h)) ? "DKB"
    : "Imported";
  return rows.reduce((acc, r) => {
    const isin=(r[iISIN]||"").trim(), kuerzel=iKuerzel>=0?(r[iKuerzel]||"").trim():"";
    const name1=(r[iName1]||"").trim(), name2=iName2>=0?(r[iName2]||"").trim():"";
    const klasse=(r[iKlasse]||"").toLowerCase().trim();
    const name = klasse==="derivate"&&name2 ? name2 : (name1||name2);
    const qty=parseDE(r[iQty]), avg=parseDE(r[iAvg]), current=parseDE(r[iCurrent]);
    if (!isin||!qty) return acc;
    const displaySymbol = (kuerzel&&!isISIN(kuerzel)) ? kuerzel.toUpperCase() : null;
    const type = inferType(ISIN_MAP[isin], isin, name, typeMap[klasse]||"stock");
    const ex = acc.find(p=>p.isin===isin||p.symbol===isin);
    if (ex) { ex.avgPrice=(ex.avgPrice*ex.qty+avg*qty)/(ex.qty+qty); ex.qty+=qty; }
    else acc.push({ symbol:isin, displaySymbol, name, type, qty, avgPrice:avg, currentPrice:current, broker:brokerName, color:"#2A758D", isin });
    return acc;
  }, []);
}


const ALLOC_COLORS_EXT = ["#4aaec0","#627eea","#f7931a","#9945ff","#d4c06a","#76b900","#e84142","#5ab8cc","#a78bfa","#e06060"];

// ISIN detection
const isISIN = s => /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s);
// WKN = 6 alphanumeric chars (German stock ID). Real US tickers are 1-5 letters only.
// Returns true if the symbol looks like a real exchange ticker (not a WKN like "858301", "A2QHKM")
const isUSOrGlobalTicker = s => s && /^[A-Z]{1,5}(\.[A-Z]+)?$/.test(s) && !/^[A-Z0-9]{6}$/.test(s);
// If symbol is still a raw ISIN, show first word of name or abbreviated ISIN
const displayTicker = pos => {
  if (!pos) return '?';
  // Prefer resolved FMP ticker (base, without exchange suffix)
  if (pos.fmpTicker) return pos.fmpTicker.split('.')[0];
  // Then displaySymbol from Smartbroker+ parser (cleaned Kürzel column)
  if (pos.displaySymbol) return pos.displaySymbol;
  // Then check ISIN_MAP
  if (pos.isin && ISIN_MAP[pos.isin]) return ISIN_MAP[pos.isin];
  const sym = pos.symbol || '';
  // If symbol is an ISIN (12 chars) or WKN (6 alphanumeric) — show first word of name
  if (isISIN(sym) || /^[A-Z0-9]{6}$/.test(sym)) {
    return pos.name ? pos.name.split(' ')[0].slice(0,8).toUpperCase() : sym.slice(0,6)+'…';
  }
  return sym;
};

// Known ISINs for instant resolution without API call
const ISIN_MAP = {
  "US0378331005":"AAPL","US5949181045":"MSFT","US02079K3059":"GOOGL",
  "US0231351067":"AMZN","US30303M1027":"META","US88160R1014":"TSLA",
  "US67066G1040":"NVDA","US46625H1005":"JPM","US38141G1040":"GS",
  "US02209S1033":"AMD","US9197941076":"V","US69343P1057":"MA",
  "IE00B4L5Y983":"IWDA","IE00B5BMR087":"CSPX","IE00BKM4GZ66":"EIMI",
  "IE00B4JNQZ49":"IUFS","IE00B4KBBD01":"IUUS","IE00BYXYX521":"VWCE",
  "IE00B3RBWM25":"VWRL","DE000A0S9GB0":"4GLD","DE000ETFL037":"EL4A",
  "IE000AON7ET1":"ARKX","IE000YDOORK7":"XDWH","IE00BMFKG444":"XNAS",
  "JE00BQRFDY49":"WZRD",
};

const ETF_TICKERS = new Set([
  'SPY','QQQ','IVV','VTI','VOO','GLD','SLV','VEA','VWO','EFA','AGG','BND',
  'LQD','TLT','IEF','XLF','XLK','XLE','XLV','XLI','XLU','XLP','XLB','XLRE',
  'GDX','GDXJ','HYG','JNK','EEM','EWJ','EWG','EWU','EWC','EWA','EWH','EWZ',
  'ARKK','ARKG','ARKW','ARKF','ARKQ','ARKX',
  'VWCE','IWDA','CSPX','EIMI','VEUR','VWRL','EXS1','XDWD','XMAW','XDWH','XDWS',
  'VNQ','VNQI','BIL','SHY','MUB','VTIP','SCHD','JEPI','QYLD','XYLD','RYLD',
  'SQQQ','TQQQ','UVXY','VXX','SVXY','SPXS','SPXL','UPRO','TMF','TNA','TZA',
  'HACK','CIBR','KWEB','CQQQ','MCHI','ASHR','FXI',
  'IWM','IWF','IWD','IWB','IJH','IJR','IEV','IAU','IEFA','IEMG',
]);
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

// CoinGecko ID map for common crypto symbols
const CRYPTO_COIN_IDS = {
  'BTC':'bitcoin','ETH':'ethereum','SOL':'solana','BNB':'binancecoin',
  'XRP':'ripple','ADA':'cardano','AVAX':'avalanche-2','DOT':'polkadot',
  'MATIC':'matic-network','LINK':'chainlink','UNI':'uniswap','ATOM':'cosmos',
  'NEAR':'near','FTM':'fantom','ALGO':'algorand','XLM':'stellar',
  'ICP':'internet-computer','FIL':'filecoin','HBAR':'hedera-hashgraph',
  'VET':'vechain','SAND':'the-sandbox','MANA':'decentraland','AXS':'axie-infinity',
  'AAVE':'aave','MKR':'maker','COMP':'compound-governance-token','CRV':'curve-dao-token',
  'SNX':'havven','YFI':'yearn-finance','SUSHI':'sushi','1INCH':'1inch',
  'LTC':'litecoin','BCH':'bitcoin-cash','ETC':'ethereum-classic','XMR':'monero',
  'ZEC':'zcash','DASH':'dash','DOGE':'dogecoin','SHIB':'shiba-inu',
  'CRO':'crypto-com-chain','FET':'fetch-ai','INJ':'injective-protocol',
  'SEI':'sei-network','SUI':'sui','APT':'aptos','ARB':'arbitrum',
  'OP':'optimism','IMX':'immutable-x','RNDR':'render-token','RENDER':'render-token',
  'QNT':'quant-network','AERO':'aerodrome-finance','MORPHO':'morpho',
  'PYTH':'pyth-network','W':'wormhole','PLUME':'plume',
  'FLUX':'zelcash','ONDO':'ondo-finance',
};

function getCoinId(symbol) {
  return CRYPTO_COIN_IDS[(symbol||'').toUpperCase()] || (symbol||'').toLowerCase();
}

function inferType(ticker, isin, name, rawType) {
  const t = (ticker || '').toUpperCase();
  const n = (name   || '').toLowerCase();
  const i = (isin   || '').toUpperCase();
  if (rawType === 'crypto') return 'crypto';
  // ETC detection — commodity trackers, gold, silver, crypto ETPs
  // Must check BEFORE derivative detection since some ETCs have DE000 ISINs
  if (/xetra.gold|gold.*ihs|gold.*etc|silver.*etc|silber|physical.*gold|physical.*silver|physical.*platin|physical.*pallad|wisdomtree.*physical|xtrackers.*physical/i.test(n)) return 'etc';
  if (/crypto.*etp|crypto.*etc|bitcoin.*etp|ethereum.*etp|21shares|coinshares|vaneck.*crypto|vaneck.*bitcoin|vaneck.*ethereum|invesco.*physical.*bitcoin|wisdomtree.*crypto/i.test(n)) return 'etc';
  if (/^DE000A0S9GB/.test(i)) return 'etc'; // Xetra-Gold specifically
  if (/^DE000A1E0HS/.test(i)) return 'etc'; // Xtrackers Physical Silver
  if (/^(DE000A|CH|GB|JE)/.test(i) && /gold|silber|silver|platin|pallad|physical|commodity|rohstoff/i.test(n)) return 'etc';
  // Derivative detection — structured products: warrants, knock-outs, turbos, factor certs, mini futures
  if (rawType === 'derivative') return 'derivative';
  if (/derivat|warrant|zertifikat|knock.out|turbo|faktor|mini.?future|call\s+\d|put\s+\d|optionsschein/i.test(n)) return 'derivative';
  // German structured products: DE000 + issuer code. Known derivative issuers:
  // UG=UBS, MM/MH=Morgan Stanley, HD=HSBC, VH/VJ=Vontobel, SB=Société Générale,
  // HB=UniCredit/HVB, DW/DV=DZ Bank, GX/GK=Goldman Sachs, CU/CZ=Citigroup, PK=BNP Paribas
  if (/^DE000(UG|MM|MH|HD|VH|VJ|SB|HB|DW|DV|GX|GK|CU|CZ|PK)[A-Z0-9]/.test(i)) return 'derivative';
  // Issuer names in position name (Smartbroker activity CSV uses issuer as name for derivatives)
  if (/morgan stanley|unicredit|vontobel|hsbc trinkaus|société générale|goldman sachs.*warrant|bnp paribas.*turbo/i.test(n)) return 'derivative';
  if (STOCK_TICKERS.has(t)) return 'stock';
  if (i.startsWith('IE') || i.startsWith('LU')) return 'etf';
  if (/^DE000(ETF|EXS|EL4|A0S|A1J)/.test(i)) return 'etf';
  if (i.startsWith('US')) return ETF_TICKERS.has(t) ? 'etf' : 'stock';
  if (i.startsWith('DE') || i.startsWith('FR') || i.startsWith('NL') || i.startsWith('CH')) {
    return ETF_TICKERS.has(t) ? 'etf' : 'stock';
  }
  if (ETF_TICKERS.has(t)) return 'etf';
  if (/\betf\b|index fund|ishares|vanguard|xtrackers|amundi|lyxor|invesco|spdr|wisdomtree/i.test(n)) return 'etf';
  if (/\betc\b|exchange.traded.commodit/i.test(n)) return 'etc';
  return rawType || 'stock';
}
function guessTypeFromISIN(isin, ticker) { return inferType(ticker, isin, '', 'stock'); }

async function resolveISINs(positions) {
  // Needs resolution if: symbol is an ISIN, OR symbol is a WKN/non-ticker but p.isin exists and no fmpTicker yet
  const needsResolution = p => (isISIN(p.symbol) || (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)));
  const toResolve = positions.filter(needsResolution);
  if (!toResolve.length) return positions;
  const resolved = positions.map(p => {
    // Case 1: symbol IS the ISIN
    if (isISIN(p.symbol)) {
      const ticker = ISIN_MAP[p.symbol];
      if (ticker) {
        return { ...p, fmpTicker: ticker, symbol: ticker,
          name: (p.name && p.name !== p.symbol) ? p.name : (TICKER_NAMES[ticker] || ticker),
          type: (p.type && p.type !== 'stock') ? p.type : guessTypeFromISIN(p.symbol, ticker),
          isin: p.symbol };
      }
      return p;
    }
    // Case 2: symbol is WKN/non-ticker but p.isin is a real ISIN — try ISIN_MAP
    if (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)) {
      const ticker = ISIN_MAP[p.isin];
      if (ticker) {
        return { ...p, fmpTicker: ticker,
          name: (p.name && p.name !== p.symbol) ? p.name : (TICKER_NAMES[ticker] || ticker),
          type: (p.type && p.type !== 'stock') ? p.type : guessTypeFromISIN(p.isin, ticker) };
      }
    }
    return p;
  });
  // Still needs API resolution: ISIN as symbol not in map, OR WKN with isin not in map
  const stillISIN = resolved.filter(p => isISIN(p.symbol) || (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)));
  if (stillISIN.length > 0) {
    const pickTicker = (data, isin) => {
      if (!Array.isArray(data) || !data.length) return null;
      const isUSIsin = isin?.startsWith('US');
      if (isUSIsin) {
        return data.filter(d => !d.symbol?.includes('.')).sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0]
          || data.sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0] || data[0];
      } else {
        return data.find(d => d.symbol?.endsWith('.DE'))
          || data.find(d => d.symbol?.endsWith('.F'))
          || data.find(d => d.symbol?.endsWith('.AS') || d.symbol?.endsWith('.PA'))
          || data.sort((a,b) => (b.marketCap||0)-(a.marketCap||0))[0] || data[0];
      }
    };
    const BATCH = 3;
    const delay = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < stillISIN.length; i += BATCH) {
      const batch = stillISIN.slice(i, i + BATCH);
      await Promise.all(batch.map(async p => {
        try {
          // Use p.isin if available (WKN case), otherwise p.symbol (ISIN case)
          const isinToSearch = p.isin && isISIN(p.isin) ? p.isin : (isISIN(p.symbol) ? p.symbol : null);
          if (!isinToSearch) return;
          const r = await fetch('/api/fmp?path=' + encodeURIComponent('/search-isin?isin=' + isinToSearch));
          if (!r.ok) return;
          const data = await r.json();
          const pick = pickTicker(data, isinToSearch);
          if (!pick?.symbol) return;
          // Find by original symbol OR isin
          const idx = resolved.findIndex(q => q.symbol === p.symbol || (q.isin && q.isin === isinToSearch));
          if (idx >= 0) {
            const orig = resolved[idx];
            resolved[idx] = { ...orig, fmpTicker: pick.symbol,
              name: (orig.name && orig.name !== orig.symbol) ? orig.name : (pick.name || orig.name),
              type: (orig.type && orig.type !== 'stock') ? orig.type : guessTypeFromISIN(isinToSearch, pick.symbol),
              isin: isinToSearch };
          }
        } catch(e) {}
      }));
      if (i + BATCH < stillISIN.length) await delay(300);
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


// ─────────────────────────────────────────────────────────────────────────────
// ── BITVAVO HARDCODED PARSER ──────────────────────────────────────────────────
// Handles all Bitvavo transaction types correctly:
//   buy/sell → trades; deposit/withdrawal → transfers (affect qty, not cost basis);
//   staking/fixed_staking/rebate/campaign → rewards (qty only);
//   margin_loan_* → ignored (borrowed/repaid, not owned);
//   withdrawal_cancelled → ignored (cancellation of a pending withdrawal)
// ─────────────────────────────────────────────────────────────────────────────
function isBitvavoCSV(headers) {
  // Bitvavo exports have these exact headers
  return headers.includes('timezone') && headers.includes('type') &&
    headers.includes('currency') && headers.includes('amount') &&
    headers.includes('quote currency') && headers.includes('quote price') &&
    headers.includes('transaction id');
}

function parseBitvavoCSV(rows, headers) {
  // Emits ALL transaction types in the normalized 6-type schema so that
  // broker-agnostic cold wallet detection and position derivation work uniformly.
  const col = h => headers.indexOf(h.toLowerCase());
  const iDate = col('date'), iTime = col('time'), iType = col('type');
  const iCurrency = col('currency'), iAmount = col('amount');
  const iQuotePrice = col('quote price');
  const iRecvCurrency = col('received / paid currency');
  const iRecvAmount = col('received / paid amount');

  const BITVAVO_TYPE_MAP = {
    'buy':  'buy', 'sell': 'sell',
    'deposit': 'transfer_in', 'withdrawal': 'transfer_out',
    'staking': 'reward', 'fixed_staking': 'reward',
    'rebate': 'reward', 'campaign_new_user_incentive': 'reward',
    'affiliate': 'ignore',
    'margin_loan_borrow': 'margin_borrow', 'margin_loan_repay': 'margin_repay',
    'margin_loan_collateral_deposit': 'ignore', 'margin_loan_collateral_return': 'ignore',
    'withdrawal_cancelled': 'ignore',
  };

  const txs = [];
  for (const row of rows) {
    const rawType = (row[iType] || '').toLowerCase().trim();
    const normalizedType = BITVAVO_TYPE_MAP[rawType] || 'ignore';
    if (normalizedType === 'ignore') continue;

    const currency = (row[iCurrency] || '').trim();
    if (!currency || currency === 'EUR') continue;

    const amount = parseFloat(row[iAmount]) || 0;
    const quotePrice = parseFloat(row[iQuotePrice]) || 0;
    const recvCurrency = (row[iRecvCurrency] || '').trim();
    const recvAmount = parseFloat(row[iRecvAmount]) || 0;
    const qty = Math.abs(amount);
    const eurAmount = recvCurrency === 'EUR' ? Math.abs(recvAmount) : qty * quotePrice;

    txs.push({
      date: ((row[iDate] || '').slice(0, 10) + ' ' + (iTime >= 0 ? (row[iTime] || '') : '')).trim(),
      type: normalizedType,
      symbol: currency,
      isin: null,
      name: currency,
      qty,
      price: quotePrice,
      amountEur: eurAmount,
    });
  }
  return txs;
}

// ── Broker-agnostic position deriver ─────────────────────────────────────────
// Works on any normalized transactions (6-type schema).
// Called by: Bitvavo hardcoded parser, AI path, learned parsers, future Tink integration.
function derivePositionsFromTxs(normalizedTxs, brokerName) {
  const sorted = [...normalizedTxs].sort((a, b) => (a.date || '') < (b.date || '') ? -1 : (a.date || '') > (b.date || '') ? 1 : 0);
  const hMap = {};
  for (const t of sorted) {
    const sym = (t.symbol || '').toUpperCase();
    if (!sym || sym === 'EUR') continue;
    if (!hMap[sym]) hMap[sym] = { symbol: sym, isin: t.isin || null, name: t.name || sym, qty: 0, totalCost: 0, totalBuyCost: 0, totalSellRevenue: 0, lastAvgPrice: 0 };
    const h = hMap[sym];
    const qty = Math.abs(t.qty || 0);
    const cost = Math.abs(t.amountEur || 0);
    if (t.type === 'buy') {
      h.qty += qty; h.totalCost += cost; h.totalBuyCost += cost;
      if (h.qty > 0) h.lastAvgPrice = h.totalCost / h.qty;
    } else if (t.type === 'sell' || t.type === 'transfer_out') {
      if (h.qty > 0) {
        const frac = Math.min(qty, h.qty) / h.qty;
        h.totalCost *= (1 - frac);
        h.qty = Math.max(0, h.qty - qty);
      }
      if (t.type === 'sell') h.totalSellRevenue += cost;
    } else if (t.type === 'transfer_in' || t.type === 'reward') {
      h.qty += qty; // no cost basis for free/transferred-in coins
    } else if (t.type === 'margin_borrow') {
      h.qty += qty; // borrowed coins: add qty, but no EUR cost (avoid avgCost dilution)
    } else if (t.type === 'margin_repay') {
      if (h.qty > 0) { // repaid coins: remove qty, proportionally reduce cost basis
        const frac = Math.min(qty, h.qty) / h.qty;
        h.totalCost *= (1 - frac);
        h.qty = Math.max(0, h.qty - qty);
      }
    }
    // 'ignore' → skip
  }
  return Object.values(hMap)
    .filter(h => h.qty > 0.01 || h.totalSellRevenue > 0) // Keep sold positions too
    .map(h => ({
      symbol: h.symbol,
      isin: h.isin,
      name: h.name,
      qty: Math.round(h.qty * 1e8) / 1e8,
      avgPrice: h.qty > 0 && h.totalCost > 0 ? h.totalCost / h.qty : (h.lastAvgPrice || 0),
      type: inferType(h.symbol, h.isin, h.name, h.isin ? 'stock' : 'crypto'),
      broker: brokerName || 'Imported',
      coinId: getCoinId(h.symbol),
      ...(h.qty <= 0.01 && h.totalSellRevenue > 0 ? {
        sold: true,
        realizedPnL: h.totalSellRevenue - h.totalBuyCost,
        totalSellRevenue: h.totalSellRevenue,
        totalBuyCost: h.totalBuyCost,
      } : {}),
    }));
}

// ── Broker-agnostic cold wallet transfer detection ────────────────────────────
// Works on normalized transactions (type: buy|sell|transfer_in|transfer_out|reward|ignore)
// from ANY broker — Bitvavo hardcoded, Tink, AI-parsed, learned parsers, all feed the same schema.
function detectColdWalletTransfers(normalizedTxs) {
  // Track exchange qty, cold wallet qty, AND cost basis per symbol.
  // avgPrice is tracked throughout so cold wallet positions get correct cost basis
  // even when the coin was fully withdrawn (qty=0 on exchange) and wouldn't appear
  // in derivePositionsFromTxs results.
  const FEE_TOLERANCE = 0.05;
  const onEx = {}, onCold = {}, totalCost = {};
  const sorted = [...normalizedTxs].sort((a, b) => (a.date || '') < (b.date || '') ? -1 : (a.date || '') > (b.date || '') ? 1 : 0);
  for (const t of sorted) {
    const sym = (t.symbol || '').toUpperCase();
    if (!sym || sym === 'EUR') continue;
    const qty = Math.abs(t.qty || 0);
    const eur = Math.abs(t.amountEur || 0);
    if (!Object.prototype.hasOwnProperty.call(onEx, sym)) { onEx[sym] = 0; onCold[sym] = 0; totalCost[sym] = 0; }
    if (t.type === 'buy' || t.type === 'margin_borrow') {
      onEx[sym] += qty;
      totalCost[sym] += eur;
    } else if (t.type === 'reward') {
      onEx[sym] += qty; // no cost basis for rewards
    } else if (t.type === 'sell' || t.type === 'margin_repay') {
      if (onEx[sym] > 0) {
        const frac = Math.min(qty, onEx[sym]) / onEx[sym];
        totalCost[sym] *= (1 - frac);
        onEx[sym] = Math.max(0, onEx[sym] - qty);
      }
    } else if (t.type === 'transfer_in') {
      const returned = Math.min(qty * (1 + FEE_TOLERANCE), onCold[sym]);
      onCold[sym] = Math.max(0, onCold[sym] - returned);
      onEx[sym] += qty;
    } else if (t.type === 'transfer_out') {
      const moved = Math.min(qty, onEx[sym]);
      // Proportionally move cost basis to cold wallet tracking
      const coldFrac = onEx[sym] > 0 ? moved / onEx[sym] : 0;
      onEx[sym] = Math.max(0, onEx[sym] - qty);
      onCold[sym] += moved;
      // totalCost stays attached to remaining exchange qty (FIFO-style proportional)
      totalCost[sym] *= (1 - coldFrac);
    }
  }
  // avgPrice = totalCost / onEx for exchange; for cold wallet use original purchase avg
  // Re-derive avgPrice from full history per symbol for cold wallet positions
  const symAvg = {};
  for (const sym of Object.keys(onCold)) {
    // Recompute avgPrice over all buys for this symbol regardless of where coins ended up
    const allBuys = sorted.filter(t => t.symbol?.toUpperCase() === sym && (t.type === 'buy' || t.type === 'margin_borrow'));
    const totalQty = allBuys.reduce((s, t) => s + Math.abs(t.qty || 0), 0);
    const totalEur = allBuys.reduce((s, t) => s + Math.abs(t.amountEur || 0), 0);
    symAvg[sym] = totalQty > 0 && totalEur > 0 ? totalEur / totalQty : 0;
  }
  return Object.entries(onCold)
    .filter(([, q]) => q > 0.001)
    .map(([sym, qty]) => ({ symbol: sym, name: sym, qty: qty || 0, avgPrice: symAvg[sym] || 0 }));
}


function deriveBitvavoPositions(rows, headers) {
  const col = h => headers.indexOf(h.toLowerCase());
  const iDate = col('date'), iType = col('type');
  const iCurrency = col('currency'), iAmount = col('amount');
  const iQuotePrice = col('quote price');
  const iRecvCurrency = col('received / paid currency');
  const iRecvAmount = col('received / paid amount');

  // Track (qty, totalCost) per symbol using correct semantics per type
  const hMap = {};
  const get = sym => { if (!hMap[sym]) hMap[sym] = { qty: 0, totalCost: 0 }; return hMap[sym]; };

  // Process in chronological order (CSV is newest-first, so reverse)
  const chronoRows = [...rows].reverse();

  for (const row of chronoRows) {
    const type = (row[iType] || '').toLowerCase().trim();
    const currency = (row[iCurrency] || '').trim();
    if (!currency || currency === 'EUR') continue;

    const amount = parseFloat(row[iAmount]) || 0;
    const quotePrice = parseFloat(row[iQuotePrice]) || 0;
    const recvCurrency = (row[iRecvCurrency] || '').trim();
    const recvAmount = parseFloat(row[iRecvAmount]) || 0;
    const qty = Math.abs(amount);
    const eurAmount = recvCurrency === 'EUR' ? Math.abs(recvAmount) : qty * quotePrice;

    const h = get(currency);

    if (type === 'buy') {
      h.qty += qty;
      h.totalCost += eurAmount;
    } else if (type === 'sell') {
      if (h.qty > 0) {
        const frac = Math.min(qty, h.qty) / h.qty;
        h.totalCost *= (1 - frac);
        h.qty = Math.max(0, h.qty - qty);
      }
    } else if (type === 'deposit') {
      // Crypto moved TO Bitvavo from external wallet — add qty, no cost (bought elsewhere)
      h.qty += qty;
    } else if (type === 'withdrawal') {
      // Crypto moved OUT of Bitvavo — reduce qty, proportional cost reduction
      if (h.qty > 0) {
        const frac = Math.min(qty, h.qty) / h.qty;
        h.totalCost *= (1 - frac);
        h.qty = Math.max(0, h.qty - qty);
      }
    } else if (type === 'staking' || type === 'fixed_staking' ||
               type === 'rebate' || type === 'campaign_new_user_incentive') {
      // Rewards — add qty, zero cost basis
      h.qty += qty;
    } else if (type === 'margin_loan_repay') {
      // Returning borrowed crypto — removes it from your balance
      if (h.qty > 0) {
        const frac = Math.min(qty, h.qty) / h.qty;
        h.totalCost *= (1 - frac);
        h.qty = Math.max(0, h.qty - qty);
      }
    } else if (type === 'margin_loan_borrow' ||
               type === 'margin_loan_collateral_deposit' || type === 'margin_loan_collateral_return' ||
               type === 'withdrawal_cancelled' || type === 'affiliate') {
      // Ignore — these don't change actual ownership
    }
  }

  return Object.entries(hMap)
    .filter(([, h]) => h.qty > 0.01)  // filter dust (staking crumbs, rounding residuals)
    .map(([sym, h], i) => ({
      symbol: sym,
      name: sym,
      qty: Math.round(h.qty * 1e8) / 1e8,
      avgPrice: h.qty > 0 && h.totalCost > 0 ? h.totalCost / h.qty : 0,
      type: 'crypto',
      isin: null,
      broker: 'Bitvavo',
      coinId: getCoinId(sym),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LEARNED PARSER SYSTEM ────────────────────────────────────────────────────
// After every successful AI parse, we save a structural spec to localStorage.
// On the next import, we try learned parsers BEFORE calling the AI.
// This means each broker only costs 1 AI call — ever (per device).
// ─────────────────────────────────────────────────────────────────────────────

// Fingerprint = sorted, normalised headers joined — stable across column order changes
function fingerprintHeaders(headers) {
  return [...headers].map(h => h.toLowerCase().trim()).sort().join("|");
}

// ── Shared broker parser store (Supabase) ─────────────────────────────────
// One AI call per broker format — globally, across all users, forever.
// localStorage is used as a cache to avoid round-trips on every import.
//
// Supabase table:
//   broker_parsers (
//     fingerprint   text primary key,
//     broker_name   text,
//     parser_spec   jsonb,
//     confidence    float,
//     use_count     int  default 1,
//     created_at    timestamptz default now()
//   )
//   -- public read, authenticated write (RLS)
//
const PARSER_CACHE_KEY = "folio_parser_cache";
const PARSER_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function _getCachedParsers() {
  try {
    const raw = localStorage.getItem(PARSER_CACHE_KEY);
    if (!raw) return {};
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > PARSER_CACHE_TTL) return {};
    return data || {};
  } catch { return {}; }
}

function _setCachedParser(fingerprint, spec) {
  try {
    const cache = _getCachedParsers();
    cache[fingerprint] = spec;
    localStorage.setItem(PARSER_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: cache }));
  } catch(e) {}
}

// Look up a parser: local cache first, then Supabase
async function findLearnedParser(headers) {
  const fp = fingerprintHeaders(headers);

  // 1. Check local cache (instant)
  const cache = _getCachedParsers();
  if (cache[fp]) return cache[fp];

  // 2. Check Supabase (shared across all users)
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("broker_parsers")
      .select("parser_spec, broker_name, confidence")
      .eq("fingerprint", fp)
      .single();
    if (error || !data) return null;
    const spec = { ...data.parser_spec, brokerName: data.broker_name, confidence: data.confidence };
    _setCachedParser(fp, spec); // cache locally for next time
    // Increment use_count in background (fire and forget)
    supabase.from("broker_parsers").update({ use_count: supabase.rpc ? undefined : undefined })
      .eq("fingerprint", fp)
      .then(() => {});
    // Use RPC for atomic increment
    supabase.rpc("increment_parser_use_count", { fp }).catch(() => {});
    return spec;
  } catch(e) {
    return null;
  }
}

// Save a newly AI-learned parser to Supabase (only if confidence >= 0.75)
async function saveLearnedParser(fingerprint, spec, confidence) {
  if (confidence < 0.75) return; // don't pollute shared table with low-quality parses

  // Always cache locally immediately
  _setCachedParser(fingerprint, spec);

  // Save to Supabase for all users
  if (!supabase) return;
  try {
    await supabase.from("broker_parsers").upsert({
      fingerprint,
      broker_name: spec.brokerName || "Unknown",
      parser_spec: spec,
      confidence,
      use_count: 1,
    }, { onConflict: "fingerprint", ignoreDuplicates: true }); // first writer wins
  } catch(e) {}
}

// Count of locally cached parsers (for UI display)
function getLearnedParserCount() {
  return Object.keys(_getCachedParsers()).length;
}

// Run a learned parser spec against rows
// spec.fieldMap: { symbol, isin, name, type, qty, avgPrice, currency, broker, date, txType, total }
// spec.numberFormat: "de" | "en"
// spec.mode: "positions" | "transactions"
// spec.brokerName: string
function runLearnedParser(rows, headers, spec) {
  const parseNum = (s) => {
    if (!s) return 0;
    const clean = spec.numberFormat === "de"
      ? String(s).replace(/\./g, "").replace(",", ".")
      : String(s).replace(/,/g, "");
    return parseFloat(clean) || 0;
  };

  const col = (fieldName) => {
    const hint = spec.fieldMap[fieldName];
    if (!hint) return -1;
    // Try exact index first, then by name search
    if (typeof hint === "number") return hint;
    return headers.findIndex(h => new RegExp(hint, "i").test(h));
  };

  if (spec.mode === "transactions") {
    const txs = rows.map(r => ({
      date: r[col("date")] || "",
      type: /sell|verk/i.test(r[col("txType")] || "") ? "sell" : "buy",
      isin: r[col("isin")] || null,
      symbol: r[col("symbol")] || r[col("isin")] || "",
      name: r[col("name")] || "",
      qty: parseNum(r[col("qty")]),
      price: parseNum(r[col("avgPrice")]),
      currency: r[col("currency")] || "EUR",
      total: parseNum(r[col("total")]),
    })).filter(t => t.date && (t.qty > 0 || t.total > 0));

    // Derive amountEur for compatibility
    return txs.map(t => ({
      ...t,
      amountEur: t.total || (t.qty * t.price),
    }));
  }

  // Positions mode
  return rows.reduce((acc, r) => {
    const isin = (r[col("isin")] || "").trim();
    const sym = (r[col("symbol")] || isin || "").trim().toUpperCase();
    if (!sym) return acc;
    const qty = parseNum(r[col("qty")]);
    const avg = parseNum(r[col("avgPrice")]);
    if (!qty) return acc;
    const rawType = (r[col("type")] || "stock").toLowerCase();
    const type = inferType(sym, isin, r[col("name")] || "", rawType);
    const ex = acc.find(p => p.isin === isin || p.symbol === sym);
    if (ex) {
      ex.avgPrice = (ex.avgPrice * ex.qty + avg * qty) / (ex.qty + qty);
      ex.qty += qty;
    } else {
      acc.push({
        symbol: isin && isISIN(isin) ? isin : sym,
        isin: isin || null,
        name: r[col("name")] || sym,
        type,
        qty,
        avgPrice: avg,
        currentPrice: avg,
        broker: spec.brokerName || "Imported",
        color: "#7a8a98",
      });
    }
    return acc;
  }, []);
}

// ── SHARED ISIN → TICKER MAP (Supabase-backed, crowd-sourced) ─────────────
// One user resolves a ticker → all users benefit forever.
// Pipeline: localStorage cache → Supabase lookup → FMP /search-isin → name fallback → manual
// Every successful resolution (automatic or manual) is saved to Supabase for all users.
// ─────────────────────────────────────────────────────────────────────────────

const ISIN_CACHE_KEY = "folio_isin_cache";
const ISIN_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function _getISINCache() {
  try {
    const raw = localStorage.getItem(ISIN_CACHE_KEY);
    if (!raw) return {};
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > ISIN_CACHE_TTL) return {};
    return data || {};
  } catch { return {}; }
}

function _setISINCache(isin, ticker) {
  try {
    const cache = _getISINCache();
    cache[isin] = ticker;
    localStorage.setItem(ISIN_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: cache }));
  } catch(e) {}
}

// Look up ticker: local cache first, then Supabase
async function lookupISINTicker(isin) {
  if (!isin) return null;

  // 1. Local cache (instant)
  const cache = _getISINCache();
  if (cache[isin]) return cache[isin];

  // 2. Supabase (shared across all users)
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("isin_ticker_map")
      .select("ticker")
      .eq("isin", isin)
      .single();
    if (error || !data) return null;
    _setISINCache(isin, data.ticker); // cache locally
    // Increment use_count in background
    supabase.rpc("increment_isin_use_count", { p_isin: isin }).catch(() => {});
    return data.ticker;
  } catch(e) {
    return null;
  }
}

// Save a resolved ISIN → ticker mapping to Supabase (shared for all users)
async function saveISINTicker(isin, ticker, name, source) {
  if (!isin || !ticker) return;
  _setISINCache(isin, ticker); // always cache locally

  if (!supabase) return;
  try {
    await supabase.from("isin_ticker_map").upsert({
      isin,
      ticker,
      name: name || null,
      source: source || 'auto',
      use_count: 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: "isin" });
  } catch(e) {}
}

// Batch lookup: check multiple ISINs at once against local cache + Supabase
async function batchLookupISINs(isins) {
  const result = {}; // isin → ticker
  const cache = _getISINCache();
  const needsSupabase = [];

  // Check local cache first
  for (const isin of isins) {
    if (cache[isin]) {
      result[isin] = cache[isin];
    } else {
      needsSupabase.push(isin);
    }
  }

  // Batch query Supabase for uncached ISINs
  if (needsSupabase.length && supabase) {
    try {
      const { data, error } = await supabase
        .from("isin_ticker_map")
        .select("isin, ticker")
        .in("isin", needsSupabase);
      if (!error && data) {
        for (const row of data) {
          result[row.isin] = row.ticker;
          _setISINCache(row.isin, row.ticker);
        }
      }
    } catch(e) {}
  }

  return result;
}

// Build a parser spec from Claude's AI result + the original headers
// This is what we save to localStorage after a successful AI parse
function buildParserSpec(aiResult, headers) {
  const { broker, mode, parserSpec } = aiResult;
  // If Claude returned an explicit parserSpec, use it directly
  if (parserSpec && parserSpec.fieldMap) {
    return {
      brokerName: broker,
      mode: mode || "positions",
      ...parserSpec,
    };
  }

  // Otherwise, infer fieldMap by pattern-matching Claude's output against headers
  const find = (...patterns) => {
    for (const pat of patterns) {
      const idx = headers.findIndex(h => new RegExp(pat, "i").test(h));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const isDE = headers.some(h => /stücke|einstandskurs|valutadatum|kürzel/i.test(h));

  const fieldMap = {
    symbol:   find("kürzel|kurzel|ticker|symbol|kürzel"),
    isin:     find("isin"),
    name:     find("^name|name 1|name1|bezeichnung|wertpapier"),
    type:     find("assetklasse|asset.?class|type|typ"),
    qty:      find("stücke|stucke|quantity|qty|amount|shares|anzahl"),
    avgPrice: find("einstandskurs|avg.?price|kurs|preis|cost"),
    currency: find("währung|currency|ccy"),
    broker:   -1,
    date:     find("datum|date|valuta"),
    txType:   find("transaktionstyp|type|typ|side"),
    total:    find("anlagebetrag|total|betrag|amount"),
  };

  return {
    brokerName: broker || "Unknown",
    mode: mode || "positions",
    numberFormat: isDE ? "de" : "en",
    fieldMap,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ── XLSX CLIENT-SIDE PARSER (SheetJS CDN) ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
let _xlsxPromise = null;
function loadXLSX() {
  if (_xlsxPromise) return _xlsxPromise;
  _xlsxPromise = new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _xlsxPromise;
}

async function xlsxToCSV(file) {
  const XLSX = await loadXLSX();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(ws);
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AI IMPORT QUOTA ───────────────────────────────────────────────────────────
// Only counts when we actually call the API.
// Free CSV fast-path and learned parsers = always free, never counted.
// ─────────────────────────────────────────────────────────────────────────────
const AI_IMPORT_LIMIT = 5;
const AI_IMPORT_LIMIT_DEV = 999;
function getImportLimit() {
  try { return localStorage.getItem('folio_dev_mode') === 'true' ? AI_IMPORT_LIMIT_DEV : AI_IMPORT_LIMIT; } catch(e) { return AI_IMPORT_LIMIT; }
}

function getAIImportUsage() {
  try {
    const raw = localStorage.getItem("folio_ai_imports");
    if (!raw) return { month: "", count: 0 };
    return JSON.parse(raw);
  } catch { return { month: "", count: 0 }; }
}
function incrementAIImportUsage() {
  const now = new Date().toISOString().slice(0, 7);
  const usage = getAIImportUsage();
  const current = usage.month === now ? usage.count : 0;
  localStorage.setItem("folio_ai_imports", JSON.stringify({ month: now, count: current + 1 }));
  return current + 1;
}
function getRemainingImports() {
  const now = new Date().toISOString().slice(0, 7);
  const usage = getAIImportUsage();
  const limit = getImportLimit();
  if (usage.month !== now) return limit;
  return Math.max(0, limit - usage.count);
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function getFileType(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "xlsx";
  if (name.endsWith(".csv") || name.endsWith(".txt")) return "csv";
  if (file.type.includes("pdf")) return "pdf";
  if (file.type.includes("spreadsheet") || file.type.includes("excel")) return "xlsx";
  return "csv";
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ImportModal v3 ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ── Import mode confirmation buttons (shown at preview step) ─────────────────
function ImportModeButtons({ mode, onToggle, hasExisting, existingCount, incomingCount, label, onImport, onBack }) {
  const isAppend = mode === "append";
  return (
    <div style={{ marginTop: 18 }}>
      {hasExisting && (
        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            {isAppend
              ? `Adding to ${existingCount} existing ${label}${existingCount !== 1 ? "s" : ""}`
              : `Replacing ${existingCount} existing ${label}${existingCount !== 1 ? "s" : ""}`}
          </span>
          <div style={{ display: "flex", borderRadius: 5, overflow: "hidden", border: "1px solid var(--border)", fontSize: 11 }}>
            <button onClick={()=>onToggle("replace")} style={{ padding: "3px 9px", background: !isAppend ? "var(--surface2)" : "transparent", color: !isAppend ? "var(--text)" : "var(--text3)", border: "none", cursor: "pointer", fontFamily: "inherit", borderRight: "1px solid var(--border)" }}>Replace</button>
            <button onClick={()=>onToggle("append")} style={{ padding: "3px 9px", background: isAppend ? "rgba(58,154,181,0.12)" : "transparent", color: isAppend ? "var(--green)" : "var(--text3)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>+ Append</button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        {hasExisting && !isAppend && (
          <button className="btn btn-ghost" style={{ color: "var(--text3)", borderColor: "var(--border)" }} onClick={()=>onImport("append")}>
            + Add to existing
          </button>
        )}
        <button className="btn btn-primary" onClick={()=>onImport(isAppend && hasExisting ? "append" : "replace")}>
          {isAppend && hasExisting ? `Add ${incomingCount} ${label}${incomingCount !== 1 ? "s" : ""} →` : `Import ${incomingCount} ${label}${incomingCount !== 1 ? "s" : ""} →`}
        </button>
      </div>
    </div>
  );
}

const IMPORT_MODE_KEY = "folio_import_mode";
function getStoredImportMode() {
  try { return localStorage.getItem(IMPORT_MODE_KEY) === "append" ? "append" : "replace"; } catch { return "replace"; }
}
function setStoredImportMode(mode) {
  try { localStorage.setItem(IMPORT_MODE_KEY, mode); } catch {}
}

const KNOWN_BROKERS = [
  { id: "bitvavo",        label: "Bitvavo",         color: "#1a6aff", flag: "🇳🇱", type: "crypto" },
  { id: "smartbroker",   label: "Smartbroker+",    color: "#00a4ef", flag: "🇩🇪", type: "broker" },
  { id: "trade_republic",label: "Trade Republic",  color: "#e63b2e", flag: "🇩🇪", type: "broker" },
  { id: "scalable",      label: "Scalable Capital",color: "#4aaec0", flag: "🇩🇪", type: "broker" },
  { id: "dkb",           label: "DKB",             color: "#1a8fd1", flag: "🇩🇪", type: "broker" },
  { id: "ing",           label: "ING",             color: "#ff6200", flag: "🇩🇪", type: "broker" },
  { id: "consorsbank",   label: "Consorsbank",     color: "#003f72", flag: "🇩🇪", type: "broker" },
  { id: "comdirect",     label: "Comdirect",       color: "#ffd200", flag: "🇩🇪", type: "broker" },
  { id: "degiro",        label: "DEGIRO",          color: "#ff6b00", flag: "🇳🇱", type: "broker" },
  { id: "flatex",        label: "Flatex",          color: "#004b8d", flag: "🇩🇪", type: "broker" },
  { id: "interactive_brokers", label: "Interactive Brokers", color: "#e31837", flag: "🌍", type: "broker" },
  { id: "coinbase",      label: "Coinbase",        color: "#0052ff", flag: "🇺🇸", type: "crypto" },
  { id: "binance",       label: "Binance",         color: "#f0b90b", flag: "🌍", type: "crypto" },
  { id: "kraken",        label: "Kraken",          color: "#5741d9", flag: "🇺🇸", type: "crypto" },
  { id: "other",         label: "Other broker…",   color: "#7a8a98", flag: "🏦", type: "other" },
];

function ImportModal({ onClose, onImport, existingPositions = [], existingTransactions = [] }) {
  const [step, setStep] = useState("broker");
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [customBrokerName, setCustomBrokerName] = useState("");
  const [broker, setBroker] = useState(null);
  const [preview, setPreview] = useState([]);
  const [txPreview, setTxPreview] = useState(null);
  const [txData, setTxData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("csv");
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [parseMethod, setParseMethod] = useState(""); // "hardcoded"|"learned"|"ai"
  const [aiResult, setAiResult] = useState(null);
  const [derivedPositions, setDerivedPositions] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState(null);
  const [importMode, setImportMode] = useState(getStoredImportMode);
  const remaining = getRemainingImports();
  const learnedCount = getLearnedParserCount();

  function toggleMode(mode) {
    setImportMode(mode);
    setStoredImportMode(mode);
  }

  const hasExisting = existingPositions.length > 0 || existingTransactions.length > 0;

  async function processFile(file) {
    if (!file) return;
    setFileName(file.name);
    setError(null);
    let fType = getFileType(file);
    setFileType(fType);

    // ── Step 1: Convert XLSX → CSV text (client-side, free, always) ──────────
    let textContent = null;
    if (fType === "xlsx") {
      try {
        setStep("resolving"); // reuse "thinking" spinner
        textContent = await xlsxToCSV(file);
        fType = "csv"; // treat as CSV from here
      } catch(e) {
        // SheetJS failed — fall through to AI with raw text
        textContent = null;
      }
    } else if (fType !== "pdf") {
      try { textContent = await readFileAsText(file); } catch(e) {}
    }

    // ── Step 2: Smartbroker+ depot snapshot (hardcoded — reliable German format) ─
    if (textContent && fType === "csv") {
      try {
        const { headers, rows } = parseCSV(textContent);

        // Smartbroker+ activity (transaction history)
        // Smartbroker+ activity CSV — fully self-sufficient, derives positions from tx history
        if (isSmartbrokerActivity(headers)) {
          const txs = parseSmartbrokerActivity(rows, headers);
          if (txs.length) {
            const dates = txs.map(t => t.date).sort();
            const net = txs.reduce((s,t) => s + (t.type==="buy" ? t.amountEur : -t.amountEur), 0);
            const derived = derivePositionsFromTxs(txs, 'Smartbroker+').map((p, i) => ({
              ...p, id: Date.now()+i, color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length], currentPrice: 0,
            }));
            setTxData(txs);
            setTxPreview({ count: txs.length, from: dates[0], to: dates[dates.length-1], net, brokerName: "Smartbroker+" });
            setParseMethod("hardcoded");
            setDerivedPositions(derived);
            setStep("activity");
            return;
          }
        }

        // Smartbroker+ depot snapshot (positions)
        if (isGermanDepotSnapshot(headers)) {
          let parsed = parseGermanDepotSnapshot(rows, headers).map((p,i) => ({
            ...p, id: Date.now()+i, color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length]
          }));
          if (parsed.length > 0) {
            setBroker("smartbroker");
            setParseMethod("hardcoded");
            const hasISINs = parsed.some(p => isISIN(p.symbol) || (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)));
            if (hasISINs) { setStep("resolving"); parsed = await resolveISINs(parsed); }
            setPreview(parsed);
            setStep("preview");
            return;
          }
        }

        // ── Step 2c: Bitvavo (hardcoded — handles all crypto tx types correctly) ──
        if (isBitvavoCSV(headers)) {
          const allTxs = parseBitvavoCSV(rows, headers); // full normalized txs incl. transfer_in/out/reward
          const tradeTxs = allTxs.filter(t => t.type === 'buy' || t.type === 'sell' || t.type === 'transfer_in' || t.type === 'transfer_out' || t.type === 'reward'); // all meaningful tx types for history
          // Derive positions from normalized txs (broker-agnostic function)
          const positions = derivePositionsFromTxs(allTxs, 'Bitvavo').map((p, i) => ({
            ...p, id: Date.now() + i, color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length], currentPrice: 0,
          }));
          // Detect cold wallet transfers (broker-agnostic function)
          const transfers = detectColdWalletTransfers(allTxs);
          const _xrpAll = allTxs.filter(t=>t.symbol==='XRP');
          const dates = tradeTxs.map(t => t.date).sort();
          const net = tradeTxs.filter(t=>t.type==='buy'||t.type==='sell').reduce((s,t) => s + (t.type==='buy' ? t.amountEur : -t.amountEur), 0);
          setTxData(tradeTxs);
          setTxPreview({ count: tradeTxs.length, from: dates[0], to: dates[dates.length-1], net, brokerName: 'Bitvavo' });
          setParseMethod('hardcoded');
          setDerivedPositions(positions);
          setPendingTransfers(transfers.length > 0 ? transfers : null);
          setStep('activity');
          return;
        }

        // ── Step 3: Try learned parsers (Supabase-backed, free, instant) ──────
        const learned = await findLearnedParser(headers);
        if (learned) {
          try {
            if (learned.mode === "transactions") {
              const txs = runLearnedParser(rows, headers, learned);
              if (txs.length > 0) {
                const dates = txs.map(t => t.date).sort();
                const net = txs.reduce((s,t) => s + (t.type==="buy" ? t.amountEur : -t.amountEur), 0);
                setTxData(txs);
                setTxPreview({ count: txs.length, from: dates[0], to: dates[dates.length-1], net, isLearned: true, brokerName: learned.brokerName });
                setParseMethod("learned");
                // Use generic derivers — works for any broker incl. future Tink
                const dp = derivePositionsFromTxs(txs, learned.brokerName).map((h, i) => ({
                  ...h, id: Date.now()+i, color: ALLOC_COLORS_EXT[i%ALLOC_COLORS_EXT.length], currentPrice: 0,
                }));
                setDerivedPositions(dp);
                const learnedTransfers = detectColdWalletTransfers(txs);
                setPendingTransfers(learnedTransfers.length > 0 ? learnedTransfers : null);
                setStep("activity");
                return;
              }
            } else {
              let parsed = runLearnedParser(rows, headers, learned);
              if (parsed.length > 0) {
                parsed = parsed.map((p,i) => ({ ...p, id: Date.now()+i, color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length] }));
                const hasISINs = parsed.some(p => isISIN(p.symbol) || (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)));
                if (hasISINs) { setStep("resolving"); parsed = await resolveISINs(parsed); }
                setPreview(parsed);
                setBroker("learned");
                setAiResult({ broker: learned.brokerName, confidence: 0.95 });
                setParseMethod("learned");
                setStep("ai_preview");
                return;
              }
            }
          } catch(e) {
            // Learned parser failed — fall through to AI
          }
        }
      } catch(e) {
        // CSV parse error — fall through to AI
      }
    }

    // ── Step 5: AI path — only here do we consume quota ──────────────────────
    if (remaining <= 0) {
      setError("You've used all 5 free AI imports this month. Upgrade to Starter for unlimited imports.");
      setStep("upload");
      return;
    }

    await runAIParse(file, fType, textContent);
  }

  async function runAIParse(file, fType, cachedText = null) {
    setStep("ai_parsing");
    let content = cachedText;

    if (!content) {
      try {
        content = await readFileAsText(file);
      } catch(e) {
        setError("Could not read file.");
        setStep("upload");
        return;
      }
    }

    try {
      let response;
      try {
        response = await fetch("/api/ai-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, fileType: fType, fileName: file.name, brokerHint: selectedBroker?.id || null, brokerLabel: selectedBroker?.label || null }),
        });
      } catch(fetchErr) {
        throw new Error(`Network error — could not reach /api/ai-import: ${fetchErr.message}`);
      }

      let data;
      try {
        data = await response.json();
      } catch(jsonErr) {
        throw new Error(`Server returned HTTP ${response.status} with non-JSON body`);
      }

      if (!response.ok || data.error) {
        setError(data.error || `Server error ${response.status}. Try again.`);
        setStep("upload");
        return;
      }

      if (!data.positions?.length && !data.transactions?.length) {
        setError("No portfolio data found. Try exporting as CSV from your broker.");
        setStep("upload");
        return;
      }

      // ── Quota only ticks here, after a confirmed successful AI call ────────
      incrementAIImportUsage();
      setAiResult(data);
      setParseMethod("ai");

      // ── Save learned parser for next time (CSV/XLSX only — not PDF) ────────
      if (fType !== "pdf" && content) {
        try {
          const { headers } = parseCSV(content);
          if (headers.length > 2) {
            const fp = fingerprintHeaders(headers);
            const spec = buildParserSpec(data, headers);
            saveLearnedParser(fp, spec, data.confidence || 0); // only saves if confidence >= 0.75
          }
        } catch(e) {}
      }

      // ── Route to correct preview step ─────────────────────────────────────
      if (data.mode === "transactions" && data.transactions?.length) {
        const txs = data.transactions
          .filter(t => t.type !== 'ignore')
          .map(t => ({
            date: t.date,
            type: t.type, // buy | sell | transfer_in | transfer_out | reward
            isin: t.isin || null,
            symbol: t.symbol || null,
            name: t.name || t.symbol,
            qty: Math.abs(t.qty || 0),
            price: t.price || 0,
            amountEur: Math.abs(t.total || (t.qty * (t.price || 0))),
          }));
        setTxData(txs);
        const dates = txs.map(t => t.date).sort();
        const isBuy = t => t.type === 'buy';
        const isSell = t => t.type === 'sell' || t.type === 'transfer_out';
        const net = txs.reduce((s,t) => s + (isBuy(t) ? t.amountEur : isSell(t) ? -t.amountEur : 0), 0);
        setTxPreview({ count: txs.length, from: dates[0], to: dates[dates.length-1], net, isAI: true });
        // Derive positions first so we can carry avgPrice into cold wallet positions
        const aiDerived = derivePositionsFromTxs(txs, data.broker || 'Imported').map((p, i) => ({
          ...p, id: Date.now() + i, color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length], currentPrice: 0,
        }));
        setDerivedPositions(aiDerived);
        // Broker-agnostic cold wallet detection — works for any broker
        const aiTransfers = detectColdWalletTransfers(txs);
        setPendingTransfers(aiTransfers.length > 0 ? aiTransfers : null);

        // ── Derive current positions from transaction history ──────────────
        // Group buys/sells by symbol, compute net qty + weighted avg cost
        const holdingMap = {};
        for (const t of txs) {
          const key = t.isin || t.symbol || t.name;
          if (!key) continue;
          if (!holdingMap[key]) holdingMap[key] = {
            symbol: t.symbol || key,
            isin: t.isin || null,
            name: t.name || t.symbol || key,
            qty: 0,
            totalCost: 0,
            type: 'crypto',
          };
          const h = holdingMap[key];
          const qty = Math.abs(t.qty || 0);
          const cost = Math.abs(t.amountEur || 0);
          if (t.type === 'buy') {
            h.totalCost += cost;
            h.qty += qty;
          } else if (t.type === 'sell') {
            if (h.qty > 0) {
              const frac = Math.min(qty, h.qty) / h.qty;
              h.totalCost *= (1 - frac);
              h.qty = Math.max(0, h.qty - qty);
            }
          }
        }
        const derivedPositions = Object.values(holdingMap)
          .filter(h => h.qty > 0.000001) // filter out fully sold / dust
          .map((h, i) => ({
            id: Date.now() + i,
            symbol: h.isin && isISIN(h.isin) ? h.isin : h.symbol,
            isin: h.isin || null,
            name: h.name,
            type: inferType(h.symbol, h.isin, h.name, h.type),
            qty: Math.round(h.qty * 1e8) / 1e8, // round floating point dust
            avgPrice: h.qty > 0 && h.totalCost > 0 ? h.totalCost / h.qty : 0,
            currentPrice: h.qty > 0 && h.totalCost > 0 ? h.totalCost / h.qty : 0,
            broker: data.broker || 'Imported',
            color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length],
          }));
        setDerivedPositions(derivedPositions);
        setStep("activity");
      } else {
        let positions = (data.positions || []).map((p,i) => ({
          id: Date.now()+i,
          symbol: p.isin && isISIN(p.isin) ? p.isin : (p.symbol || p.isin),
          isin: p.isin || null,
          name: p.name || p.symbol,
          type: p.type || "stock",
          qty: p.qty,
          avgPrice: p.avgPrice,
          currentPrice: p.avgPrice,
          broker: p.broker || data.broker || "Imported",
          color: ALLOC_COLORS_EXT[i % ALLOC_COLORS_EXT.length],
        }));
        const hasISINs = positions.some(p => isISIN(p.symbol) || (p.isin && !p.fmpTicker && !isUSOrGlobalTicker(p.symbol)));
        if (hasISINs) { setStep("resolving"); positions = await resolveISINs(positions); }
        setPreview(positions);
        setBroker("ai");
        setStep("ai_preview");
      }
    } catch(e) {
      console.error('[folio] ai-import error:', e);
      const msg = e?.message || String(e);
      // Show the real error so we can debug
      setError(`Import failed: ${msg}`);
      setStep("upload");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  }

  const confidenceColor = c => c >= 0.85 ? "var(--green)" : c >= 0.6 ? "var(--gold)" : "var(--red)";
  const confidenceLabel = c => c >= 0.85 ? "High confidence" : c >= 0.6 ? "Review recommended" : "Low confidence";
  const quotaColor = remaining > 2 ? "var(--text2)" : remaining > 0 ? "var(--gold)" : "var(--red)";
  const quotaBarColor = remaining > 2 ? "var(--green)" : remaining > 0 ? "var(--gold)" : "var(--red)";

  return (
    <div className="modal-overlay" onClick={e=>e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 580, maxHeight: "88vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div className="serif" style={{ fontSize: 20 }}>Import Portfolio</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>
              CSV, PDF, or Excel — any broker
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Persistent mode toggle — only shown when there's existing data */}
            {hasExisting && (
              <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)", fontSize: 11 }}>
                <button onClick={()=>toggleMode("replace")} style={{ padding: "4px 10px", background: importMode === "replace" ? "var(--surface2)" : "transparent", color: importMode === "replace" ? "var(--text)" : "var(--text3)", border: "none", cursor: "pointer", fontFamily: "inherit", borderRight: "1px solid var(--border)" }}>
                  Replace
                </button>
                <button onClick={()=>toggleMode("append")} style={{ padding: "4px 10px", background: importMode === "append" ? "rgba(58,154,181,0.12)" : "transparent", color: importMode === "append" ? "var(--green)" : "var(--text3)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  + Append
                </button>
              </div>
            )}
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 18, cursor: "pointer", marginTop: 2 }}>✕</button>
          </div>
        </div>

        {/* ── UPLOAD ─────────────────────────────────────────────────────── */}
        {step === "broker" && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Where is your file from?</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Helps the AI recognise the exact export format — even for unknown brokers</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {KNOWN_BROKERS.map(b => (
                <button key={b.id} onClick={() => {
                  if (b.id === "other") {
                    setSelectedBroker(b);
                    setCustomBrokerName("");
                    // Stay on broker step to show name input
                  } else {
                    setSelectedBroker(b);
                    setCustomBrokerName("");
                    setStep("upload");
                  }
                }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    borderRadius: 8, cursor: "pointer", textAlign: "left",
                    border: `1px solid ${selectedBroker?.id === b.id ? b.color + '88' : b.color + '44'}`,
                    background: selectedBroker?.id === b.id ? `${b.color}22` : `${b.color}0d`,
                    color: "var(--text)", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${b.color}22`}
                  onMouseLeave={e => e.currentTarget.style.background = selectedBroker?.id === b.id ? `${b.color}22` : `${b.color}0d`}
                >
                  <span style={{ fontSize: 18 }}>{b.flag}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: b.color }}>{b.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{b.type === "crypto" ? "Crypto exchange" : b.type === "broker" ? "Stock broker" : "Type broker name below"}</div>
                  </div>
                </button>
              ))}
            </div>
            {/* Custom broker name input — shown when "Other" is selected */}
            {selectedBroker?.id === "other" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>Enter broker name (helps AI parse correctly & saves for future users):</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="inp"
                    type="text"
                    placeholder="e.g. Postbank, Targobank, eToro..."
                    value={customBrokerName}
                    onChange={e => setCustomBrokerName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && customBrokerName.trim()) { setSelectedBroker({ ...selectedBroker, label: customBrokerName.trim(), id: customBrokerName.trim().toLowerCase().replace(/\s+/g, '_') }); setStep("upload"); }}}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-primary"
                    disabled={!customBrokerName.trim()}
                    onClick={() => { setSelectedBroker({ ...selectedBroker, label: customBrokerName.trim(), id: customBrokerName.trim().toLowerCase().replace(/\s+/g, '_') }); setStep("upload"); }}
                    style={{ opacity: customBrokerName.trim() ? 1 : 0.4 }}
                  >Continue →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "upload" && (<>

          {/* Selected broker header */}
          {selectedBroker && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "8px 12px", borderRadius: 6, background: `${selectedBroker.color}12`, border: `1px solid ${selectedBroker.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{selectedBroker.flag}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: selectedBroker.color }}>{selectedBroker.label}</span>
              </div>
              <button onClick={() => setStep("broker")} style={{ fontSize: 10, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>change ↩</button>
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[
              { ext: "CSV",      icon: "📊", note: "instant"  },
              { ext: "PDF",      icon: "📄", note: "AI"       },
              { ext: "XLS/XLSX", icon: "📗", note: "instant"  },
            ].map(f => (
              <div key={f.ext} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text2)", fontFamily: "IBM Plex Mono,monospace" }}>
                {f.icon} {f.ext}
                <span style={{ marginLeft: 2, color: f.note === "instant" ? "var(--green)" : "var(--text3)", fontSize: 9 }}>{f.note}</span>
              </div>
            ))}
          </div>

          <div
            onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
            onDragLeave={()=>setDragging(false)}
            onDrop={onDrop}
            onClick={()=>document.getElementById("ai-file-input").click()}
            style={{
              border: `2px dashed ${dragging ? "var(--green)" : "var(--border2)"}`,
              borderRadius: 10, padding: "40px 20px", textAlign: "center",
              cursor: "pointer", transition: "all 0.2s",
              background: dragging ? "var(--green-dim)" : "transparent"
            }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>📂</div>
            <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 6 }}>Drop your file here</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>CSV · PDF · Excel — click to browse</div>
            <input id="ai-file-input" type="file" accept=".csv,.txt,.pdf,.xlsx,.xls" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
          </div>

          {error && (
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 6, background: "var(--red-dim)", border: "1px solid rgba(224,96,96,0.3)", color: "var(--red)", fontSize: 12 }}>{error}</div>
          )}

          {/* AI quota + learned parser status */}
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em" }}>AI IMPORTS · FREE TIER</div>
              <div className="mono" style={{ fontSize: 10, color: quotaColor }}>
                {remaining} / {getImportLimit()} remaining
              </div>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: "var(--border2)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${(remaining / getImportLimit()) * 100}%`,
                background: quotaBarColor,
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>
                CSV & Excel from known brokers are always free
              </div>
              {learnedCount > 0 && (
                <div style={{ fontSize: 10, color: "var(--green)", fontFamily: "IBM Plex Mono,monospace" }}>
                  ✦ {learnedCount} broker{learnedCount !== 1 ? "s" : ""} learned
                </div>
              )}
            </div>
          </div>

        </>)}

        {/* ── THINKING/RESOLVING ──────────────────────────────────────────── */}
        {step === "resolving" && (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ fontSize: 30, marginBottom: 14 }}>🔍</div>
            <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Resolving ISINs to tickers…</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>Looking up via FMP…</div>
          </div>
        )}

        {/* ── AI PARSING ─────────────────────────────────────────────────── */}
        {step === "ai_parsing" && (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ fontSize: 30, marginBottom: 14 }}>✦</div>
            <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Reading your file…</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>
              Identifying broker format, extracting positions
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── STANDARD CSV PREVIEW ───────────────────────────────────────── */}
        {step === "preview" && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "10px 14px", borderRadius: 8, background: "var(--green-dim)", border: "1px solid rgba(58,154,181,0.25)" }}>
            <span>✓</span>
            <div>
              <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
                {broker === "smartbroker" ? "Smartbroker+" : broker === "learned" ? (aiResult?.broker || "Known broker") : "Portfolio"} · {parseMethod === "hardcoded" ? "Instant parse" : parseMethod === "learned" ? "⚡ Instant" : "Parsed"}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text2)" }}>
                {fileName} · {preview.length} positions · no AI used
              </div>
            </div>
          </div>
          <PreviewTable positions={preview} />
          <ImportModeButtons
            mode={importMode} onToggle={toggleMode}
            hasExisting={existingPositions.length > 0}
            existingCount={existingPositions.length}
            incomingCount={preview.length}
            label="position"
            onImport={(m)=>onImport({ data: preview, mode: m })}
            onBack={()=>setStep("upload")}
          />
        </>)}

        {/* ── AI / LEARNED POSITIONS PREVIEW ─────────────────────────────── */}
        {step === "ai_preview" && aiResult && (<>
          <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 3 }}>
                  {parseMethod === "learned" ? "⚡ Learned parser" : "✦ AI parsed"} · {aiResult.broker}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--text3)" }}>
                  {fileName} · {preview.length} positions
                  {parseMethod === "learned" && <span style={{ color: "var(--green)", marginLeft: 6 }}>no AI used</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, color: confidenceColor(aiResult.confidence), letterSpacing: "0.06em" }}>
                  {Math.round(aiResult.confidence * 100)}%
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                  {confidenceLabel(aiResult.confidence)}
                </div>
              </div>
            </div>
            {parseMethod === "ai" && (
              <div style={{ marginTop: 8, fontSize: 10, color: "var(--text3)" }}>
                ✦ Format saved — next import from this broker will be instant
              </div>
            )}
            {aiResult.confidence < 0.75 && (
              <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 6, background: "rgba(184,160,76,0.08)", border: "1px solid rgba(184,160,76,0.2)", fontSize: 11, color: "var(--gold)" }}>
                ⚠ Review the positions below before importing.
              </div>
            )}
          </div>
          <PreviewTable positions={preview} />
          <ImportModeButtons
            mode={importMode} onToggle={toggleMode}
            hasExisting={existingPositions.length > 0}
            existingCount={existingPositions.length}
            incomingCount={preview.length}
            label="position"
            onImport={(m)=>onImport({ data: preview, mode: m })}
            onBack={()=>setStep("upload")}
          />
        </>)}

        {/* ── TRANSACTION HISTORY ─────────────────────────────────────────── */}
        {step === "activity" && txPreview && (<>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--green-dim)", border: "1px solid rgba(58,154,181,0.25)", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <span>📈</span>
            <div>
              <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
                Transaction History
                {txPreview.isAI && " · AI Parsed"}
                {txPreview.isLearned && " · ⚡ Instant"}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text2)" }}>
                {txPreview.count} transactions · {txPreview.from} → {txPreview.to}
                {(txPreview.isAI || txPreview.isLearned) && txPreview.brokerName && ` · ${txPreview.brokerName}`}
              </div>
            </div>
          </div>
          {txPreview.isAI && aiResult && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--border)", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                ✦ Format saved — next import will be instant
              </span>
              <span className="mono" style={{ fontSize: 10, color: confidenceColor(aiResult.confidence) }}>
                {Math.round(aiResult.confidence * 100)}% confidence
              </span>
            </div>
          )}
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", marginBottom: 16, fontSize: 12, color: "var(--text2)" }}>
            This powers your <span style={{ color: "var(--green)" }}>real performance chart</span> — invested capital staircase based on actual trade dates.
          </div>
          {/* ── Derived positions section ── */}
          {derivedPositions.length > 0 && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(58,154,181,0.04)", border: "1px solid rgba(58,154,181,0.2)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 500 }}>
                  📊 {derivedPositions.length} positions derived from transactions
                </div>
                <div className="mono" style={{ fontSize: 9, color: "var(--text3)" }}>auto-calculated</div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text2)", marginBottom: 10 }}>
                Net holdings after all buys &amp; sells. Avg cost = weighted purchase price.
              </div>
              <div style={{ maxHeight: 140, overflowY: "auto", marginBottom: 10 }}>
                {derivedPositions.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                    <span className="mono" style={{ color: "var(--text)", fontWeight: 600 }}>{p.symbol}</span>
                    <span style={{ color: "var(--text2)" }}>{p.name?.slice(0, 24)}</span>
                    <span className="mono" style={{ color: "var(--text3)" }}>{p.qty % 1 === 0 ? p.qty : p.qty.toFixed(6)} @ €{p.avgPrice > 0 ? p.avgPrice.toFixed(p.avgPrice < 1 ? 4 : 2) : "—"}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>
                These will be added to your portfolio alongside the transaction history.
              </div>
            </div>
          )}
          <ImportModeButtons
            mode={importMode} onToggle={toggleMode}
            hasExisting={existingTransactions.length > 0}
            existingCount={existingTransactions.length}
            incomingCount={txPreview?.count || 0}
            label="transaction"
            onImport={(m)=>onImport({ type: "transactions", data: txData, mode: m, derivedPositions: derivedPositions.length > 0 ? derivedPositions : null, pendingTransfers })}
            onBack={()=>setStep("upload")}
          />
        </>)}

      </div>
    </div>
  );
}

// ── Shared preview table ────────────────────────────────────────────────────
function PreviewTable({ positions }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr 0.9fr 0.7fr", padding: "8px 14px", background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
        {["ASSET","QTY","AVG PRICE","TYPE"].map(h => (
          <div key={h} className="mono" style={{ fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em" }}>{h}</div>
        ))}
      </div>
      {positions.map((p,i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr 0.9fr 0.7fr", padding: "10px 14px", borderBottom: i < positions.length-1 ? "1px solid var(--border)" : "none", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `${p.color}22`, border: `1px solid ${p.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="mono" style={{ fontSize: 7, color: p.color, fontWeight: 700 }}>{displayTicker(p).slice(0,4)}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{displayTicker(p)}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text2)" }}>
            {p.qty < 1 ? p.qty.toFixed(6) : p.qty.toFixed(2)}
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text2)" }}>
            €{(p.avgPrice||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}
          </div>
          <span className={`tag tag-${p.type==="crypto"?"gold":p.type==="etf"?"blue":"gray"}`}>
            {(p.type||"stock").toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}


const fmt  = (n,d=2)=>n.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtE = (n)=>`€${fmt(Math.abs(n),0)}`;

// ── StockDetail — full page (3a financials + 3b charts + 3d scorecard) ──────

// ── TradingView Lightweight Charts loader ───────────────────────────────────
let _tvLibPromise = null;
function loadTVLib() {
  if (_tvLibPromise) return _tvLibPromise;
  _tvLibPromise = new Promise((resolve, reject) => {
    if (window.LightweightCharts) { resolve(window.LightweightCharts); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
    s.onload = () => resolve(window.LightweightCharts);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _tvLibPromise;
}

// ── TVChart: full TradingView Lightweight Chart with range + mode controls ──
function TVChart({ ticker, txs = [], currentPrice, compact = false }) {
  const containerRef = React.useRef(null);
  const chartRef     = React.useRef(null);
  const seriesRef    = React.useRef(null);
  const [allData, setAllData]   = React.useState(null); // full price history
  const [loading, setLoading]   = React.useState(true);
  const [error, setError]       = React.useState(null);
  const [range, setRange]       = React.useState('1Y');
  const [mode, setMode]         = React.useState('area'); // area | candle | line

  const RANGES = compact
    ? [['3M',90],['6M',180],['1Y',365],['ALL',3650]]
    : [['1M',30],['3M',90],['6M',180],['1Y',365],['2Y',730],['ALL',3650]];

  // ── Fetch full history once ──
  React.useEffect(() => {
    if (!ticker) return;
    setLoading(true); setError(null); setAllData(null);
    const to   = new Date().toISOString().slice(0,10);
    const from = new Date(Date.now() - 365*3*86400000).toISOString().slice(0,10);
    fetch(`/api/fmp?path=/historical-price-eod/full?symbol=${ticker}&from=${from}&to=${to}`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.historical || []);
        if (!arr.length) throw new Error('No price data');
        const sorted = [...arr]
          .filter(p => p.date && p.close != null)
          .sort((a,b) => a.date.localeCompare(b.date));
        setAllData(sorted);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticker]);

  // ── Build + destroy chart ──
  React.useEffect(() => {
    if (!allData || !containerRef.current) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (RANGES.find(r=>r[0]===range)?.[1] ?? 365));
    const cutStr = cutoff.toISOString().slice(0,10);
    const filtered = allData.filter(p => p.date >= cutStr);
    if (!filtered.length) return;

    const isUp = filtered[filtered.length-1].close >= filtered[0].close;
    const _tc = getTC();
    const GREEN = _tc.green, RED = _tc.red;
    const upColor = isUp ? GREEN : RED;

    loadTVLib().then(LW => {
      // Destroy previous chart
      if (chartRef.current) { try { chartRef.current.remove(); } catch(e){} chartRef.current = null; }

      const h = compact ? 200 : 340;
      const chart = LW.createChart(containerRef.current, {
        width:  containerRef.current.clientWidth,
        height: h,
        layout:  { background: { color: 'transparent' }, textColor: getTC().text2 },
        grid:    { vertLines: { color: getTC().gridLine }, horzLines: { color: getTC().gridLine } },
        crosshair: { mode: LW.CrosshairMode.Normal },
        rightPriceScale: { borderColor: getTC().gridLine, textColor: getTC().text2 },
        timeScale: { borderColor: getTC().gridLine, timeVisible: true, secondsVisible: false },
        handleScroll: true,
        handleScale:  true,
      });
      chartRef.current = chart;

      let series;
      if (mode === 'candle') {
        series = chart.addCandlestickSeries({
          upColor: GREEN, downColor: RED,
          borderUpColor: GREEN, borderDownColor: RED,
          wickUpColor: GREEN, wickDownColor: RED,
        });
        series.setData(filtered.map(p => ({
          time: p.date,
          open:  p.open  ?? p.close,
          high:  p.high  ?? p.close,
          low:   p.low   ?? p.close,
          close: p.close,
        })));
      } else if (mode === 'line') {
        series = chart.addLineSeries({ color: upColor, lineWidth: 2, priceLineVisible: false });
        series.setData(filtered.map(p => ({ time: p.date, value: p.close })));
      } else {
        // area (default)
        series = chart.addAreaSeries({
          lineColor: upColor,
          topColor:   upColor + '28',
          bottomColor: upColor + '00',
          lineWidth: 2,
          priceLineVisible: false,
        });
        series.setData(filtered.map(p => ({ time: p.date, value: p.close })));
      }
      seriesRef.current = series;

      // ── Buy/sell/transfer markers — grouped by date to avoid overlap ──
      if (txs.length && mode !== 'candle') {
        const firstDate = filtered[0].date;
        const lastDate  = filtered[filtered.length-1].date;
        const inRange = txs.filter(tx => tx.date >= firstDate && tx.date <= lastDate);

        // Group by date
        const byDate = {};
        inRange.forEach(tx => {
          if (!byDate[tx.date]) byDate[tx.date] = [];
          byDate[tx.date].push(tx);
        });

        const mks = Object.entries(byDate).map(([date, group]) => {
          // Determine dominant type: prefer buy/sell over transfer; if mixed use the most common
          const typeCount = {};
          group.forEach(tx => { typeCount[tx.type] = (typeCount[tx.type] || 0) + 1; });
          const dominant = group.reduce((a, b) => (typeCount[a.type] >= typeCount[b.type] ? a : b)).type;
          const n = group.length;

          const isBuyDom     = dominant === 'buy';
          const isSellDom    = dominant === 'sell';
          const isTransOutDom = dominant === 'transfer_out';
          const isTransInDom  = dominant === 'transfer_in';

          const color    = isBuyDom ? GREEN : isSellDom ? RED : isTransOutDom ? '#d4c06a' : '#5ab8cc';
          const position = (isBuyDom || isTransInDom) ? 'belowBar' : 'aboveBar';
          const shape    = (isBuyDom || isTransInDom) ? 'arrowUp' : 'arrowDown';

          // Label: show count if >1, otherwise show short qty
          let text;
          if (n > 1) {
            const label = isBuyDom ? 'B' : isSellDom ? 'S' : isTransOutDom ? '→' : '←';
            text = `${label}×${n}`;
          } else {
            const tx = group[0];
            const qtyStr = tx.qty < 1 ? tx.qty.toFixed(4) : tx.qty.toFixed(tx.qty < 10 ? 2 : 0);
            text = isBuyDom ? `B ${qtyStr}` : isSellDom ? `S ${qtyStr}` : isTransOutDom ? `→ ${qtyStr}` : `← ${qtyStr}`;
          }

          return { time: date, position, color, shape, text, size: 1 };
        });

        if (mks.length) series.setMarkers(mks.sort((a,b) => a.time.localeCompare(b.time)));
      }

      chart.timeScale().fitContent();

      // Resize observer
      const ro = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      ro.observe(containerRef.current);
      return () => { ro.disconnect(); };
    }).catch(() => {});

    return () => {
      if (chartRef.current) { try { chartRef.current.remove(); } catch(e){} chartRef.current = null; }
    };
  }, [allData, range, mode, txs]);

  if (loading) return <div className="card shimmer" style={{height: compact?200:340, marginBottom:16, borderRadius:10}}/>;
  if (error)   return null; // silently skip if no data

  return (
    <div className="card" style={{padding:'14px 16px 12px', marginBottom:16, overflow:'hidden'}}>
      {/* Controls row */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:6}}>
        {/* Range pills */}
        <div style={{display:'flex', gap:4}}>
          {RANGES.map(([label]) => (
            <button key={label} onClick={() => setRange(label)}
              className="mono"
              style={{fontSize:9, padding:'3px 8px', borderRadius:4, cursor:'pointer', border:'1px solid',
                borderColor: range===label ? 'rgba(58,154,181,0.4)' : 'var(--border)',
                background:  range===label ? 'rgba(58,154,181,0.1)' : 'transparent',
                color:       range===label ? 'var(--green)' : 'var(--text3)',
                letterSpacing: '0.06em', fontWeight: range===label ? 700 : 400,
                transition: 'all 0.15s',
              }}>
              {label}
            </button>
          ))}
        </div>
        {/* Mode toggle */}
        {!compact && (
          <div style={{display:'flex', gap:4}}>
            {[['area','▲ Area'],['line','― Line'],['candle','┤ Candle']].map(([m,label]) => (
              <button key={m} onClick={() => setMode(m)}
                className="mono"
                style={{fontSize:9, padding:'3px 8px', borderRadius:4, cursor:'pointer', border:'1px solid',
                  borderColor: mode===m ? 'rgba(42,117,141,0.4)' : 'var(--border)',
                  background:  mode===m ? 'rgba(42,117,141,0.1)' : 'transparent',
                  color:       mode===m ? 'var(--blue)' : 'var(--text3)',
                  letterSpacing: '0.05em', transition: 'all 0.15s',
                }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Chart container */}
      <div ref={containerRef} style={{width:'100%'}}/>
      {/* Legend */}
      {txs.length > 0 && mode !== 'candle' && (
        <div style={{display:'flex', gap:16, marginTop:8, flexWrap:'wrap'}}>
          {[['#4aaec0','BUY / IN'],['#e06060','SELL / OUT'],['#d4c06a','TRANSFER OUT'],['#5ab8cc','TRANSFER IN']].map(([col,lbl]) => (
            <div key={lbl} style={{display:'flex', alignItems:'center', gap:5}}>
              <div style={{width:7, height:7, borderRadius:'50%', background:col}}/>
              <span className="mono" style={{fontSize:9, color:'var(--text3)'}}>{lbl}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TxPriceChart: alias to TVChart for backwards compat ──────────────────────
function TxPriceChart({ ticker, txs, currentPrice }) {
  return <TVChart ticker={ticker} txs={txs} currentPrice={currentPrice} compact={true}/>;
}

// ── Shared ticker search: name + symbol search via /search-name ──────────────
// Ranks results: primary US exchanges first, deduplicates by company name
const PRIM_EXCHANGES = ['NASDAQ Global Select','New York Stock Exchange','NASDAQ Global Market','NYSE American','NYSE Arca'];
function rankSearchResult(r) {
  // Score 0 = best
  if (PRIM_EXCHANGES.includes(r.exchangeFullName)) return 0;
  if (r.exchange === 'NASDAQ' || r.exchange === 'NYSE') return 1;
  if (!r.symbol?.includes('.')) return 2;  // plain ticker (likely US)
  if (r.symbol?.endsWith('.DE') || r.symbol?.endsWith('.F')) return 3;
  return 5;
}
function dedupeSearchResults(results) {
  // Dedupe by name, keep first occurrence (preserves caller's sort order)
  const seen = new Set();
  return results.filter(r => {
    const key = (r.name || r.symbol || '').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0, 16);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 7);
}
async function fetchTickerSearch(query, limit = 12, signal) {
  if (!query || query.length < 1) return [];
  const looksLikeTicker = query.length <= 6 && !/\s/.test(query);
  const q = query.toUpperCase();
  const searchLimit = Math.max(limit, 20);
  const opts = signal ? { signal } : {};

  const safeFetch = (url) => fetch(url, opts).then(r => r.ok ? r.json() : []).catch(() => []);

  const [nameData, symbolData, quoteExact] = await Promise.all([
    safeFetch('/api/fmp?path=' + encodeURIComponent('/search-name?query=' + q + '&limit=' + searchLimit)),
    safeFetch('/api/fmp?path=' + encodeURIComponent('/search?query=' + q + '&limit=' + searchLimit)),
    looksLikeTicker
      ? safeFetch('/api/fmp?path=' + encodeURIComponent('/quote?symbol=' + q))
      : Promise.resolve([]),
  ]);

  if (signal?.aborted) return [];

  const normalize = (arr) => (Array.isArray(arr) ? arr : []).filter(t => t?.symbol);
  const quoteResults  = normalize(quoteExact).map(t => ({ symbol: t.symbol, name: t.name, exchange: t.exchange || '', exchangeFullName: t.exchangeFullName || t.exchange || '' }));
  const symbolResults = normalize(symbolData);
  const nameResults   = normalize(nameData);

  // Merge: exact quote first, then symbol search, then name search
  const seen = new Set();
  const merged = [];
  for (const r of [...quoteResults, ...symbolResults, ...nameResults]) {
    if (r?.symbol && !seen.has(r.symbol)) { seen.add(r.symbol); merged.push(r); }
  }

  merged.sort((a, b) => {
    const aExact  = a.symbol?.toUpperCase() === q ? -100 : 0;
    const bExact  = b.symbol?.toUpperCase() === q ? -100 : 0;
    const aStarts = a.symbol?.toUpperCase().startsWith(q) ? -50 : 0;
    const bStarts = b.symbol?.toUpperCase().startsWith(q) ? -50 : 0;
    const aLen    = a.symbol?.length || 99;
    const bLen    = b.symbol?.length || 99;
    // exchange rank is 0-5, symbol length penalty tiny — neither can overcome starts-with bonus
    return (aExact + aStarts + (aStarts ? aLen * 0.1 : 0) + rankSearchResult(a))
         - (bExact + bStarts + (bStarts ? bLen * 0.1 : 0) + rankSearchResult(b));
  });

  return dedupeSearchResults(merged.filter(r => r && r.symbol)).slice(0, limit);
}

function TickerDropdown({ results, searching, onSelect, highlightIdx = -1 }) {
  if (!searching && !results.length) return null;
  return (
    <div style={{
      position:'absolute', top:'110%', left:0, zIndex:9999,
      background:'var(--surface)', border:'1px solid var(--border2)',
      borderRadius:8, minWidth:280, maxWidth:360,
      boxShadow:'var(--popover-shadow)', overflow:'hidden',
    }}>
      {searching && !results.length && <div className="mono" style={{padding:'10px 14px',fontSize:11,color:'var(--text3)'}}>Searching…</div>}
      {results.map((r, i) => (
        <div key={r.symbol} onMouseDown={e => { e.preventDefault(); onSelect(r); }}
          style={{display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid var(--border)',
            background: i === highlightIdx ? 'var(--surface2)' : 'transparent',
            transition:'background 0.1s'}}
          onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
          onMouseLeave={e=>e.currentTarget.style.background= i === highlightIdx ? 'var(--surface2)' : 'transparent'}>
          <div style={{minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span className="mono" style={{fontSize:12,fontWeight:700,color:'var(--text)',flexShrink:0}}>{r.symbol}</span>
              {rankSearchResult(r) === 0 && <span style={{fontSize:8,padding:'1px 5px',borderRadius:3,background:'var(--green-dim)',color:'var(--green)',fontFamily:'IBM Plex Mono'}}>PRIMARY</span>}
            </div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200}}>{r.name}</div>
          </div>
          <div className="mono" style={{fontSize:9,color:'var(--text3)',flexShrink:0,marginLeft:8,textAlign:'right'}}>
            {r.exchangeShortName || r.exchange || ''}
          </div>
        </div>
      ))}
    </div>
  );
}


// ── Watchlist utilities ──────────────────────────────────────────────────────
const FLAG_COLORS = {
  red:    { bg:'rgba(224,96,96,0.15)',  border:'rgba(224,96,96,0.4)',  dot:'#e06060' },
  green:  { bg:'rgba(58,154,181,0.12)',  border:'rgba(58,154,181,0.35)',  dot:'#4aaec0' },
  gold:   { bg:'rgba(184,160,76,0.12)', border:'rgba(184,160,76,0.35)', dot:'#d4c06a' },
  blue:   { bg:'rgba(42,117,141,0.12)', border:'rgba(42,117,141,0.35)', dot:'#5ab8cc' },
  violet: { bg:'rgba(167,139,250,0.12)',border:'rgba(167,139,250,0.35)',dot:'#a78bfa' },
};

// Context menu for right-click on watchlist items
function WLContextMenu({ x, y, item, onFlag, onOpenStock, onRemove, onClose }) {
  React.useEffect(() => {
    const handler = () => onClose();
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  return (
    <div onMouseDown={e => e.stopPropagation()}
      style={{ position:'fixed', left:x, top:y, zIndex:9999,
        background:'var(--surface)', border:'1px solid var(--border2)',
        borderRadius:8, minWidth:180, boxShadow:'var(--popover-shadow)',
        overflow:'hidden', animation:'fadeUp 0.12s ease' }}>
      {/* Flag row */}
      <div style={{ padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
        <div className="mono" style={{ fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:6 }}>FLAG</div>
        <div style={{ display:'flex', gap:6 }}>
          {Object.entries(FLAG_COLORS).map(([key, col]) => (
            <div key={key} onClick={() => { onFlag(item.symbol, item.flag === key ? null : key); onClose(); }}
              style={{ width:18, height:18, borderRadius:'50%', background:col.dot, cursor:'pointer',
                outline: item.flag===key ? '2px solid white' : 'none', outlineOffset:1,
                transition:'transform 0.1s' }}
              title={key}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}/>
          ))}
          {item.flag && (
            <div onClick={() => { onFlag(item.symbol, null); onClose(); }}
              style={{ width:18, height:18, borderRadius:'50%', background:'var(--surface2)',
                border:'1px solid var(--border)', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:9, color:'var(--text3)' }}
              title="Clear flag">✕</div>
          )}
        </div>
      </div>
      {/* Actions */}
      {[
        { label:'📊  Open Overview', action: onOpenStock },
        { label:'🗑  Remove from list', action: onRemove, danger: true },
      ].map(({ label, action, danger }) => (
        <div key={label} onClick={() => { action(); onClose(); }}
          style={{ padding:'10px 14px', cursor:'pointer', fontSize:12,
            color: danger ? 'var(--red)' : 'var(--text)',
            borderBottom:'1px solid var(--border)', transition:'background 0.1s' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          {label}
        </div>
      ))}
    </div>
  );
}


// ── Canonical health score — MUST match StockDetail scorecard logic exactly ──
// Input: d = fundamentals API response ({ byYear, sector, peRatio, evEbitda, pegRatio, marketCap })
// Returns: 0-100 integer or null
function calcCanonicalHealthScore(d) {
  if (!d) return null;
  const yrs  = d.byYear?.slice(-3) || [];
  const last = yrs[yrs.length - 1] || {};
  const prev = yrs[yrs.length - 2] || {};
  const prev2= yrs[yrs.length - 3] || {};
  const sector = (d.sector || '').toLowerCase();
  const isTech    = /tech|software|semi|information/i.test(sector);
  const isFinance = /financ|bank|insurance|reit/i.test(sector);
  const isRetail  = /retail|consumer staple|grocery/i.test(sector);
  const isHealth2 = /health|pharma|biotech|medical/i.test(sector);
  const isEnergy  = /energy|oil|gas|util/i.test(sector);

  const nmGood = isTech?0.15:isRetail?0.04:isEnergy?0.06:0.08;
  const nmOk   = isTech?0.06:isRetail?0.01:isEnergy?0.02:0.03;
  const deGood = isFinance?8:isTech?0.5:1;
  const deOk   = isFinance?15:isTech?1.5:2;

  // Profitability
  const profitScores = [
    last.netMargin  !=null?(last.netMargin >=nmGood?2:last.netMargin >=nmOk?1:0):null,
    last.roe        !=null?(last.roe       >=0.15  ?2:last.roe       >=0.08?1:0):null,
    last.roic       !=null?(last.roic      >=0.10  ?2:last.roic      >=0.05?1:0):null,
    last.grossMargin!=null?(last.grossMargin>=(isTech?0.50:isRetail?0.25:0.35)?2
                            :last.grossMargin>=(isTech?0.30:isRetail?0.15:0.20)?1:0):null,
  ].filter(s=>s!==null);
  const profitColor = profitScores.length?
    (profitScores.reduce((a,b)=>a+b)/profitScores.length>=1.5?'green':
     profitScores.reduce((a,b)=>a+b)/profitScores.length>=0.8?'gold':'red'):'gray';

  // Growth
  const g = (last.revenue&&prev.revenue&&prev.revenue>0)?(last.revenue/prev.revenue-1):null;
  const growthGood=isTech?0.15:0.07, growthOk=isTech?0.05:0.02;
  const growthColor = g==null?'gray':g>growthGood?'green':g>growthOk?'gold':'red';

  // Moat
  const revGrowthYoy =(last.revenue&&prev.revenue&&prev.revenue>0)?last.revenue/prev.revenue-1:null;
  const revGrowthPrev=(prev.revenue&&prev2.revenue&&prev2.revenue>0)?prev.revenue/prev2.revenue-1:null;
  const growthConsistent=revGrowthYoy!=null&&revGrowthPrev!=null&&revGrowthYoy>0&&revGrowthPrev>0;
  const moatScores=[
    last.grossMargin!=null?(last.grossMargin>=(isTech?0.55:isRetail?0.30:0.40)?2
                            :last.grossMargin>=(isTech?0.35:isRetail?0.15:0.25)?1:0):null,
    last.roic!=null?(last.roic>=0.15?2:last.roic>=0.08?1:0):null,
    last.roe !=null?(last.roe >=0.20?2:last.roe >=0.12?1:0):null,
    growthConsistent?2:(revGrowthYoy!=null?(revGrowthYoy>0?1:0):null),
  ].filter(s=>s!==null);
  const moatColor=moatScores.length<2?'gray':
    (moatScores.reduce((a,b)=>a+b)/moatScores.length>=1.6?'green':
     moatScores.reduce((a,b)=>a+b)/moatScores.length>=0.9?'gold':'red');

  // Balance
  const de=last.debtEquity, cr=last.currentRatio;
  const balScores=[
    de!=null?(de<=deGood?2:de<=deOk?1:0):null,
    cr!=null?(cr>=2.0?2:cr>=1.0?1:0):null,
  ].filter(s=>s!==null);
  const balanceColor=balScores.length?
    (balScores.reduce((a,b)=>a+b)/balScores.length>=1.5?'green':
     balScores.reduce((a,b)=>a+b)/balScores.length>=0.8?'gold':'red'):'gray';

  // Cash Generation
  const fcf=last.freeCashFlow, fcfRev=(fcf&&last.revenue)?fcf/last.revenue:null;
  const cashScores=[
    fcf!=null?(fcf>0?(fcfRev>=0.10?2:1):0):null,
    last.operatingCF!=null?(last.operatingCF>0?2:0):null,
  ].filter(s=>s!==null);
  const cashColor=cashScores.length?
    (cashScores.reduce((a,b)=>a+b)/cashScores.length>=1.5?'green':
     cashScores.reduce((a,b)=>a+b)/cashScores.length>=0.8?'gold':'red'):'gray';

  // Valuation
  const peFair=isTech?30:isHealth2?22:isFinance?15:20;
  const peOk  =isTech?45:isHealth2?35:isFinance?20:30;
  const pe=d.peRatio, ev=d.evEbitda, peg=d.pegRatio;
  const valScores=[
    pe !=null?(pe <=peFair?2:pe <=peOk?1:0):null,
    ev !=null?(ev <=10   ?2:ev <=18  ?1:0):null,
    peg!=null?(peg<=1    ?2:peg<=2   ?1:0):null,
  ].filter(s=>s!==null);
  const valuationColor=valScores.length?
    (valScores.reduce((a,b)=>a+b)/valScores.length>=1.5?'green':
     valScores.reduce((a,b)=>a+b)/valScores.length>=0.8?'gold':'red'):'gray';

  // Aggregate (same formula as StockDetail)
  const colorScore={green:2,gold:1,red:0,gray:null};
  const dims=[profitColor,growthColor,moatColor,balanceColor,cashColor,valuationColor]
    .map(col=>colorScore[col]).filter(v=>v!==null);
  if(!dims.length) return null;
  return Math.round(dims.reduce((a,b)=>a+b)/dims.length*50);
}


// ── ScreenerPage ─────────────────────────────────────────────────────────────
const SECTORS = ['All','Technology','Healthcare','Financial Services','Consumer Cyclical',
  'Industrials','Communication Services','Consumer Defensive','Energy','Basic Materials',
  'Real Estate','Utilities'];
const EXCHANGES = ['All','NASDAQ','NYSE','AMEX'];
const PRESETS = [
  { label: 'Quality Growth', icon: '🚀', filters: { peMax:'40', marketCapMin:'1000000000', sector:'All', healthMin:60 } },
  { label: 'Value',          icon: '💎', filters: { peMax:'15', marketCapMin:'500000000',  sector:'All', healthMin:40 } },
  { label: 'Possible Deal',  icon: '🎯', filters: { marketCapMin:'2000000000', sector:'All', healthMin:55, dealOnly:true } },
  { label: 'Large Cap',      icon: '🏛️', filters: { marketCapMin:'10000000000', sector:'All' } },
  { label: 'High Dividend',  icon: '💰', filters: { dividendMin:'1', sector:'All' } },
  { label: 'Small Cap',      icon: '🌱', filters: { marketCapMax:'2000000000', marketCapMin:'100000000', sector:'All' } },
  { label: 'Low Beta',       icon: '🛡️', filters: { betaMax:'0.8', marketCapMin:'1000000000', sector:'All' } },
];

// Deal signal helper — module-level so available to all components
function isFundamentallyImproving(fund) {
  try {
    const yrs = Array.isArray(fund?.byYear) ? fund.byYear : null;
    if (!yrs || yrs.length < 2) {
      // Fall back to growth rate fields if byYear unavailable
      return (fund?.ttmRevGrowth > 0.03 && fund?.ttmEpsGrowth > 0) ||
             (fund?.fy1RevGrowth > 0.05 && fund?.fy1EpsGrowth > 0.05);
    }
    const last = yrs[yrs.length - 1] || {};
    const prev = yrs[yrs.length - 2] || {};
    // Revenue must be growing year-over-year
    const revGrowing = last.revenue && prev.revenue && last.revenue > prev.revenue;
    // EPS growing, or at least positive with margins not collapsing
    const epsGrowing = last.eps != null && prev.eps != null && last.eps > prev.eps;
    const epsPositive = last.eps != null && last.eps > 0;
    const marginOk = last.netMargin != null && prev.netMargin != null
      ? last.netMargin >= prev.netMargin * 0.88
      : true;
    return !!(revGrowing && (epsGrowing || (epsPositive && marginOk)));
  } catch { return false; }
}

function ScreenerPage({ onOpenStock, watchlists = [], setWatchlists }) {
  const [filters, setFilters] = React.useState({
    sector: 'All', exchange: 'All',
    marketCapMin: '', marketCapMax: '',
    peMin: '', peMax: '',
    betaMin: '', betaMax: '',
    dividendMin: '',
    volumeMin: '',
    evEbitdaMin: '', evEbitdaMax: '',
    pegMax: '',
    forwardPEMax: '',
    healthMin: 0,
    dealOnly: false,
  });
  const [results, setResults]     = React.useState([]);
  const [wlDropdown, setWlDropdown] = React.useState(null); // symbol showing WL dropdown
  const wlDropRef = React.useRef(null);
  React.useEffect(() => {
    if (!wlDropdown) return;
    const close = (e) => { if (wlDropRef.current && !wlDropRef.current.contains(e.target)) setWlDropdown(null); };
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', close); };
  }, [wlDropdown]);
  const [loading, setLoading]     = React.useState(false);
  const [error, setError]         = React.useState(null);
  const [sortCol, setSortCol]     = React.useState('marketCap');
  const [sortDir, setSortDir]     = React.useState('desc');
  const [searched, setSearched]   = React.useState(false);
  const [fundCache, setFundCache] = React.useState({});
  const [loadingFund, setLoadingFund] = React.useState({});

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const applyPreset = (preset) => {
    setFilters(f => ({ ...f, peMin:'', peMax:'', marketCapMin:'', marketCapMax:'',
      betaMin:'', betaMax:'', dividendMin:'', dividendMax:'', healthMin:0, ...preset.filters }));
  };

  const runScreener = async () => {
    setLoading(true); setError(null); setSearched(true);
    try {
      const p = new URLSearchParams();
      if (filters.marketCapMin) p.set('marketCapMin', filters.marketCapMin);
      if (filters.marketCapMax) p.set('marketCapMax', filters.marketCapMax);
      if (filters.peMin)        p.set('peMin', filters.peMin);
      if (filters.peMax)        p.set('peMax', filters.peMax);
      if (filters.betaMin)      p.set('betaMin', filters.betaMin);
      if (filters.betaMax)      p.set('betaMax', filters.betaMax);
      if (filters.dividendMin)  p.set('dividendMin', filters.dividendMin);
      if (filters.volumeMin)    p.set('volumeMin', filters.volumeMin);
      if (filters.evEbitdaMin)  p.set('evEbitdaMin', filters.evEbitdaMin);
      if (filters.evEbitdaMax)  p.set('evEbitdaMax', filters.evEbitdaMax);
      if (filters.sector && filters.sector !== 'All') p.set('sector', filters.sector);
      if (filters.exchange && filters.exchange !== 'All') p.set('exchange', filters.exchange);
      p.set('isEtf', 'false');
      p.set('limit', '200');
      const res = await fetch('/api/screener?' + p.toString());
      const data = await res.json();
      if (data.error && data.error === 'Premium') throw new Error('This endpoint requires a higher FMP plan.');
      const res2 = (data.results || []).filter(r => !r.isEtf && !/\bETF\b|\bFund\b|\bTrust\b|\bIndex Fund\b/i.test(r.companyName || ''));
      setResults(res2);
      // Auto-batch load fundamentals for first 30 results in parallel
      const toLoad = res2.slice(0, 30).map(r => r.symbol).filter(sym => !fundCache[sym]);
      if (toLoad.length) {
        // Stagger in batches of 5 to avoid FMP rate limiting
        const BATCH = 5;
        const fetchOne = (sym) => {
          setLoadingFund(prev => ({ ...prev, [sym]: true }));
          return fetch('/api/fundamentals?lite=1&symbol=' + sym.split('.')[0])
            .then(r => r.json())
            .then(d => {
              const score = d.healthScore ?? null;
              const pe = d.peRatio ?? null;
              const peg = d.pegRatio ?? null;
              const fwdPE = d.forwardPE ?? null;
              const ttmRevGrowth = d.ttmRevGrowth ?? null;
              const ttmEpsGrowth = d.ttmEpsGrowth ?? null;
              const fy1RevGrowth = d.fy1RevGrowth ?? null;
              const fy1EpsGrowth = d.fy1EpsGrowth ?? null;
              const priceAvg50   = d.priceAvg50   ?? null;
              const yearHigh     = d.yearHigh     ?? null;
              const curPrice     = d.currentPrice ?? null;
              const byYear       = d.byYear       ?? null;
              setFundCache(prev => ({ ...prev, [sym]: { score, pe, peg, fwdPE, ttmRevGrowth, ttmEpsGrowth, fy1RevGrowth, fy1EpsGrowth, priceAvg50, yearHigh, curPrice, byYear } }));
            })
            .catch(() => setFundCache(prev => ({ ...prev, [sym]: { score: null, pe: null, peg: null, fwdPE: null } })))
            .finally(() => setLoadingFund(prev => ({ ...prev, [sym]: false })));
        };
        const runBatches = async () => {
          for (let i = 0; i < toLoad.length; i += BATCH) {
            const batch = toLoad.slice(i, i + BATCH);
            await Promise.all(batch.map(fetchOne));
            if (i + BATCH < toLoad.length) await new Promise(r => setTimeout(r, 300));
          }
        };
        runBatches();
      }
    } catch(e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch health score for a ticker on demand
  const fetchHealthScore = async (symbol) => {
    if (fundCache[symbol] !== undefined || loadingFund[symbol]) return;
    setLoadingFund(prev => ({ ...prev, [symbol]: true }));
    try {
      const res = await fetch('/api/fundamentals?lite=1&symbol=' + symbol.split('.')[0]);
      const d = await res.json();
      const score = d.healthScore ?? null;
      const pe = d.peRatio ?? null;
      const peg = d.pegRatio ?? null;
      const fwdPE = d.forwardPE ?? null;
      const ttmRevGrowth = d.ttmRevGrowth ?? null;
      const ttmEpsGrowth = d.ttmEpsGrowth ?? null;
      const fy1RevGrowth = d.fy1RevGrowth ?? null;
      const fy1EpsGrowth = d.fy1EpsGrowth ?? null;
      const priceAvg50   = d.priceAvg50   ?? null;
      const yearHigh     = d.yearHigh     ?? null;
      const curPrice     = d.currentPrice ?? null;
      const byYear       = d.byYear       ?? null;
      setFundCache(prev => ({ ...prev, [symbol]: { score, pe, peg, fwdPE, ttmRevGrowth, ttmEpsGrowth, fy1RevGrowth, fy1EpsGrowth, priceAvg50, yearHigh, curPrice, byYear } }));
    } catch {
      setFundCache(prev => ({ ...prev, [symbol]: { score: null, pe: null, peg: null, fwdPE: null } }));
    } finally {
      setLoadingFund(prev => ({ ...prev, [symbol]: false }));
    }
  };

  // Sort + health filter
  const filtered = results.filter(r => {
    const f = fundCache[r.symbol];
    if (filters.healthMin > 0) {
      if (f == null) return false; // exclude until loaded — avoids inflated count
      if ((f.score ?? 0) < filters.healthMin) return false;
    }
    if (filters.pegMax) {
      const maxPeg = parseFloat(filters.pegMax);
      if (!isNaN(maxPeg) && f != null && f.peg != null) {
        if (f.peg > maxPeg) return false;
      }
    }
    if (filters.forwardPEMax) {
      const maxFPE = parseFloat(filters.forwardPEMax);
      if (!isNaN(maxFPE) && f != null && f.fwdPE != null) {
        if (f.fwdPE > maxFPE) return false;
      }
    }
    if (filters.dealOnly) {
      const fund = fundCache[r.symbol];
      if (!fund) return false; // exclude until loaded
      const dp = fund.curPrice ?? r.price;
      const priceTrendDown = dp != null
        && (fund.priceAvg50 != null && dp < fund.priceAvg50)   // below 50d MA
        && (fund.yearHigh != null && dp < fund.yearHigh * 0.80); // AND >20% off 52w high
      const fundStrong = (fund.score ?? 0) >= 55 && isFundamentallyImproving(fund);
      if (!priceTrendDown || !fundStrong) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol] ?? -Infinity;
    const bv = b[sortCol] ?? -Infinity;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const fmtCap = v => {
    if (!v) return '—';
    if (v >= 1e12) return (v/1e12).toFixed(1) + 'T';
    if (v >= 1e9)  return (v/1e9).toFixed(1) + 'B';
    if (v >= 1e6)  return (v/1e6).toFixed(0) + 'M';
    return v.toFixed(0);
  };
  const fmtX   = v => v == null ? '—' : v.toFixed(1) + 'x';
  const fmtPct = v => v == null ? '—' : (v * 100).toFixed(1) + '%';
  const fmtN   = v => v == null ? '—' : v.toFixed(2);

  const COLS = [
    { key: 'symbol',         label: 'Ticker',   fmt: v => v,           numeric: false },
    { key: 'companyName',    label: 'Company',  fmt: v => v?.split(' ').slice(0,3).join(' '), numeric: false },
    { key: 'sector',         label: 'Sector',   fmt: v => v?.split(' ')[0] || '—', numeric: false },
    { key: 'marketCap',      label: 'Mkt Cap',  fmt: fmtCap,           numeric: true },
    { key: 'price',          label: 'Price',    fmt: v => v == null ? '—' : '$'+v.toFixed(2), numeric: true },
    { key: 'beta',           label: 'Beta',     fmt: fmtN,             numeric: true,
      color: v => v == null ? 'var(--text3)' : v <= 1 ? 'var(--green)' : v <= 1.5 ? 'var(--gold)' : 'var(--red)' },
    { key: '_div', label: 'Div%', fmt: () => '', numeric: true },
    { key: 'volume',         label: 'Volume',   fmt: fmtCap,           numeric: true },
    { key: '_pe',            label: 'P/E',      fmt: () => '',         numeric: true },
    { key: '_fwdpe',         label: 'Fwd P/E',  fmt: () => '',         numeric: true },
    { key: '_peg',           label: 'PEG',      fmt: () => '',         numeric: true },
    { key: '_health',        label: 'Health',   fmt: () => '',         numeric: true },
    { key: '_wl',            label: '+WL',      fmt: () => '',         numeric: false },
  ];

  const InpFilter = ({ label, fromKey, toKey, placeholder='e.g. 15' }) => (
    <div style={{marginBottom:10}}>
      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>{label}</div>
      <div style={{display:'flex',gap:4,alignItems:'center'}}>
        <input className="inp mono" placeholder="Min" value={filters[fromKey]||''}
          onChange={e => setFilter(fromKey, e.target.value)}
          style={{width:70,padding:'5px 8px',fontSize:11}} />
        <span style={{color:'var(--text3)',fontSize:11}}>–</span>
        <input className="inp mono" placeholder="Max" value={filters[toKey]||''}
          onChange={e => setFilter(toKey, e.target.value)}
          style={{width:70,padding:'5px 8px',fontSize:11}} />
      </div>
    </div>
  );

  const scoreColor = s => s == null ? 'var(--text3)' : s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--gold)' : 'var(--red)';

  return (
    <div className="fu" style={{display:'flex',flexDirection:'column',minHeight:0}}>
      {/* Header */}
      <div style={{marginBottom:18}}>
        <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:3,marginBottom:14}}>
          Filter by fundamentals · up to 200 results
        </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
        {PRESETS.map(p => (
          <button key={p.label} className="pill" onClick={() => applyPreset(p)}
            style={{fontSize:10,padding:'5px 10px',gap:4,display:'flex',alignItems:'center'}}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{padding:'16px 18px',marginBottom:14}}>
        <div style={{display:'flex',gap:20,flexWrap:'wrap',alignItems:'flex-start'}}>

          {/* Sector */}
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>SECTOR</div>
            <select className="inp mono" value={filters.sector} onChange={e => setFilter('sector', e.target.value)}
              style={{padding:'5px 8px',fontSize:11,minWidth:160}}>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Exchange */}
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>EXCHANGE</div>
            <select className="inp mono" value={filters.exchange} onChange={e => setFilter('exchange', e.target.value)}
              style={{padding:'5px 8px',fontSize:11,minWidth:100}}>
              {EXCHANGES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <InpFilter label="MARKET CAP ($)" fromKey="marketCapMin" toKey="marketCapMax" />
          <InpFilter label="P/E RATIO" fromKey="peMin" toKey="peMax" />
          <InpFilter label="BETA" fromKey="betaMin" toKey="betaMax" />
          <InpFilter label="EV/EBITDA" fromKey="evEbitdaMin" toKey="evEbitdaMax" />
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>MAX FWD P/E <span style={{fontStyle:'italic',color:'var(--text3)'}}>(client-side)</span></div>
            <input className="inp mono" placeholder="e.g. 25" value={filters.forwardPEMax||''}
              onChange={e => setFilter('forwardPEMax', e.target.value)}
              style={{width:80,padding:'5px 8px',fontSize:11}} />
          </div>
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>MAX PEG RATIO <span style={{fontStyle:'italic',color:'var(--text3)'}}>(client-side)</span></div>
            <input className="inp mono" placeholder="e.g. 2" value={filters.pegMax||''}
              onChange={e => setFilter('pegMax', e.target.value)}
              style={{width:80,padding:'5px 8px',fontSize:11}} />
          </div>
          {/* Min dividend only - FMP only supports min */}
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>MIN ANNUAL DIVIDEND ($)</div>
            <input className="inp mono" placeholder="e.g. 0.50" value={filters.dividendMin||''}
              onChange={e => setFilter('dividendMin', e.target.value)}
              style={{width:80,padding:'5px 8px',fontSize:11}} />
          </div>

          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>MIN VOLUME</div>
            <input className="inp mono" placeholder="e.g. 500000" value={filters.volumeMin||''}
              onChange={e => setFilter('volumeMin', e.target.value)}
              style={{width:100,padding:'5px 8px',fontSize:11}} />
          </div>

          {/* Health score */}
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>
              MIN HEALTH SCORE
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="range" min={0} max={100} step={10} value={filters.healthMin}
                onChange={e => setFilter('healthMin', +e.target.value)}
                style={{width:100,accentColor:'var(--green)'}} />
              <span className="mono" style={{fontSize:12,fontWeight:700,
                color:filters.healthMin>=70?'var(--green)':filters.healthMin>=40?'var(--gold)':'var(--text3)',
                minWidth:30}}>
                {filters.healthMin > 0 ? filters.healthMin + '+' : 'Any'}
              </span>
            </div>
          </div>
        </div>

        <button onClick={runScreener} disabled={loading}
          style={{marginTop:4,padding:'9px 22px',background:'var(--green)',color:'#fff',
            border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer',
            opacity:loading?0.6:1,letterSpacing:'0.06em'}}>
          {loading ? 'SCREENING…' : '⊞  RUN SCREENER'}
        </button>
      </div>

      {error && (
        <div style={{padding:'10px 14px',borderRadius:6,marginBottom:12,fontSize:12,
          background:'var(--red-dim)',color:'var(--red)',border:'1px solid var(--red)'}}>
          {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div className="card" style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border2)',display:'flex',alignItems:'center',gap:12}}>
            <span className="mono" style={{fontSize:11,color:'var(--text2)',fontWeight:600}}>
              {sorted.length} results
            </span>
            {filters.healthMin > 0 && (
              <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>
                · health score filter active — click a row to load score
              </span>
            )}
          </div>

          {sorted.length === 0 ? (
            <div style={{padding:'48px 20px',textAlign:'center',color:'var(--text3)',fontSize:13}}>
              No stocks match your filters
            </div>
          ) : (
            <div style={{overflowX:'auto',overflowY:'auto',flex:1}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'var(--surface2)',position:'sticky',top:0,zIndex:2}}>
                    {COLS.map(col => (
                      <th key={col.key} onClick={() => col.numeric && toggleSort(col.key)}
                        style={{padding:'9px 12px',textAlign:col.numeric?'right':'left',
                          cursor:col.numeric?'pointer':'default',
                          borderBottom:'1px solid var(--border2)',whiteSpace:'nowrap',
                          userSelect:'none'}}>
                        <span className="mono" style={{fontSize:9,letterSpacing:'0.1em',color:sortCol===col.key?'var(--green)':'var(--text3)'}}>
                          {col.label}{col.numeric && sortCol===col.key ? (sortDir==='asc'?' ↑':' ↓') : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, ri) => {
                    const fund = fundCache[row.symbol];
                    const score = fund?.score ?? null;
                    const rowPe = fund?.pe ?? null;
                    const rowPeg = fund?.peg ?? null;
                    const rowFwdPE = fund?.fwdPE ?? null;
                    const isLoadingScore = loadingFund[row.symbol];
                    // Possible Deal: price below 50d MA + >15% off 52w high + strong fundamentals
                    const dp = fund?.curPrice ?? row.price;
                    const priceTrendDown = dp != null
                      && (fund?.priceAvg50 != null && dp < fund.priceAvg50)   // below 50d MA
                      && (fund?.yearHigh != null && dp < fund.yearHigh * 0.80); // AND >20% off 52w high
                    const fundStrong = score != null && score >= 55 && isFundamentallyImproving(fund);
                    const isPossibleDeal = fund != null && priceTrendDown && fundStrong;
                    return (
                      <tr key={row.symbol}
                        onClick={() => {
                          fetchHealthScore(row.symbol);
                          if (onOpenStock) onOpenStock({ symbol: row.symbol, name: row.companyName, type: 'stock' });
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{cursor:'pointer',borderBottom:'1px solid var(--border)',
                          background: ri % 2 === 1 ? 'rgba(255,255,255,0.012)' : 'transparent',
                          transition:'background 0.1s'}}>
                        <td style={{padding:'8px 12px'}}>
                          <span className="mono" style={{fontSize:12,fontWeight:700,color:'var(--green)'}}>{row.symbol}</span>
                        </td>
                        <td style={{padding:'8px 12px',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          <span style={{color:'var(--text2)',fontSize:11}}>{row.companyName || '—'}</span>
                          {isPossibleDeal && (
                            <span title="Strong fundamentals, price pulling back — possible opportunity" style={{
                              marginLeft:6,fontSize:9,fontFamily:"'IBM Plex Mono',monospace",
                              fontWeight:700,letterSpacing:'0.05em',padding:'2px 5px',
                              borderRadius:3,background:'rgba(58,154,181,0.10)',
                              color:'var(--green)',border:'1px solid rgba(58,154,181,0.22)',
                              verticalAlign:'middle',whiteSpace:'nowrap',cursor:'default'
                            }}>🎯 DEAL?</span>
                          )}
                        </td>
                        <td style={{padding:'8px 12px'}}>
                          <span style={{fontSize:10,color:'var(--text3)'}}>{row.sector?.split(' ')[0] || '—'}</span>
                        </td>
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          <span className="mono" style={{color:'var(--text2)'}}>{fmtCap(row.marketCap)}</span>
                        </td>
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          <span className="mono" style={{color:'var(--text)'}}>{row.price == null ? '—' : '$' + row.price.toFixed(2)}</span>
                        </td>
                        {/* beta */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          <span className="mono" style={{fontSize:11,color: row.beta<=1?'var(--green)':row.beta<=1.5?'var(--gold)':'var(--red)'}}>
                            {fmtN(row.beta)}
                          </span>
                        </td>
                        {/* Div yield% = lastAnnualDividend / price * 100 */}
                        {(() => { const dy = row.price > 0 ? (row.lastAnnualDividend / row.price * 100) : 0; return (
                          <td style={{padding:'8px 12px',textAlign:'right'}}>
                            <span className="mono" style={{fontSize:11,color: dy > 0 ? 'var(--green)' : 'var(--text3)'}}>
                              {dy > 0 ? dy.toFixed(2)+'%' : '—'}
                            </span>
                          </td>
                        );})()}
                        {/* Volume */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          <span className="mono" style={{fontSize:11,color:'var(--text3)'}}>{fmtCap(row.volume)}</span>
                        </td>
                        {/* P/E — from fundamentals */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          {isLoadingScore ? (
                            <span className="mono shimmer" style={{fontSize:10,color:'var(--text3)'}}>···</span>
                          ) : rowPe != null ? (
                            <span className="mono" style={{fontSize:11,color: rowPe<=20?'var(--green)':rowPe<=35?'var(--gold)':'var(--red)'}}>
                              {rowPe.toFixed(1)}x
                            </span>
                          ) : <span style={{color:'var(--text3)'}}>—</span>}
                        </td>
                        {/* Fwd P/E */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          {isLoadingScore ? (
                            <span className="mono shimmer" style={{fontSize:10,color:'var(--text3)'}}>···</span>
                          ) : rowFwdPE != null ? (
                            <span className="mono" style={{fontSize:11,color: rowFwdPE<=20?'var(--green)':rowFwdPE<=35?'var(--gold)':'var(--red)'}}>
                              {rowFwdPE.toFixed(1)}x
                            </span>
                          ) : <span style={{color:'var(--text3)'}}>—</span>}
                        </td>
                        {/* PEG */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}>
                          {isLoadingScore ? (
                            <span className="mono shimmer" style={{fontSize:10,color:'var(--text3)'}}>···</span>
                          ) : rowPeg != null ? (
                            <span className="mono" style={{fontSize:11,color: rowPeg<=1?'var(--green)':rowPeg<=2?'var(--gold)':'var(--red)'}}>
                              {rowPeg.toFixed(2)}
                            </span>
                          ) : <span style={{color:'var(--text3)'}}>—</span>}
                        </td>
                        {/* Health score */}
                        <td style={{padding:'8px 12px',textAlign:'right'}}
                          onClick={e => { e.stopPropagation(); fetchHealthScore(row.symbol); }}>
                          {isLoadingScore ? (
                            <span className="mono shimmer" style={{fontSize:10,color:'var(--text3)'}}>···</span>
                          ) : score != null ? (
                            <span className="mono" style={{fontSize:12,fontWeight:700,color:scoreColor(score)}}>
                              {score}<span style={{fontSize:8,color:'var(--text3)'}}>/100</span>
                            </span>
                          ) : (
                            <span style={{fontSize:9,color:'var(--text3)',cursor:'pointer',
                              padding:'2px 6px',border:'1px solid var(--border)',borderRadius:3}}>
                              load
                            </span>
                          )}
                        </td>
                        {/* Add to watchlist */}
                        <td style={{padding:'8px 6px',textAlign:'center'}} onClick={e => e.stopPropagation()}>
                          <div style={{position:'relative'}}>
                            <button
                              onClick={e => { e.stopPropagation(); setWlDropdown(wlDropdown===row.symbol?null:row.symbol); }}
                              style={{background:'none',border:'1px solid var(--border)',borderRadius:4,
                                color:'var(--text3)',cursor:'pointer',fontSize:10,padding:'2px 6px',
                                lineHeight:1.4}}
                              title="Add to watchlist">＋</button>
                            {wlDropdown===row.symbol && watchlists.length > 0 && (
                              <div style={{position:'absolute',right:0,top:'100%',zIndex:50,
                                background:'var(--surface)',border:'1px solid var(--border2)',
                                borderRadius:6,padding:4,minWidth:140,boxShadow:'var(--popover-shadow)'}}>
                                {watchlists.map(wl => (
                                  <div key={wl.id}
                                    onClick={() => {
                                      if (!setWatchlists) return;
                                      setWatchlists(prev => prev.map(w => {
                                        if (w.id !== wl.id) return w;
                                        const cat = w.categories[0];
                                        if (!cat) return w;
                                        if (cat.items.some(it => it.symbol === row.symbol)) return w;
                                        return { ...w, categories: w.categories.map((c,i) => i===0
                                          ? { ...c, items: [...c.items, { id: Date.now()+'', symbol: row.symbol, name: row.companyName, type:'stock' }] }
                                          : c) };
                                      }));
                                      setWlDropdown(null);
                                    }}
                                    style={{padding:'6px 10px',cursor:'pointer',borderRadius:4,fontSize:11,
                                      color:'var(--text2)',whiteSpace:'nowrap'}}
                                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                    📋 {wl.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="card fu" style={{padding:'48px 20px',textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:16}}>⊞</div>
          <div className="serif" style={{fontSize:18,color:'var(--text2)',marginBottom:8}}>
            Filter the market
          </div>
          <div style={{fontSize:12,color:'var(--text3)',maxWidth:360,margin:'0 auto',lineHeight:1.6}}>
            Set your filters above and run the screener — or pick a preset to get started
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

// ── ETFScreenerPage ──────────────────────────────────────────────────────────
function ETFScreenerPage({ onOpenStock, watchlists = [], setWatchlists }) {
  const [filters, setFilters] = React.useState({
    exchange: 'All',
    assetClass: 'All',
    aumMin: '', aumMax: '',
    expenseRatioMax: '',
    dividendMin: '',
    volumeMin: '',
  });
  const [results, setResults]   = React.useState([]);
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState(null);
  const [searched, setSearched] = React.useState(false);
  const [sortCol, setSortCol]   = React.useState('marketCap');
  const [sortDir, setSortDir]   = React.useState('desc');
  const [wlDropdown, setWlDropdown] = React.useState(null);
  const wlDropRef = React.useRef(null);

  React.useEffect(() => {
    if (!wlDropdown) return;
    const close = (e) => { if (wlDropRef.current && !wlDropRef.current.contains(e.target)) setWlDropdown(null); };
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', close); };
  }, [wlDropdown]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const ETF_EXCHANGES = ['All','NYSE','NASDAQ','AMEX','EURONEXT','LSE','XETRA','SIX','CBOE'];
  const ASSET_CLASSES = ['All','Equity','Fixed Income','Commodity','Real Estate','Currency','Multi-Asset','Alternatives'];

  const ETF_PRESETS = [
    { label: 'US Large Cap', filters: { exchange:'NYSE', assetClass:'Equity', expenseRatioMax:'0.2', aumMin:'1000000000' } },
    { label: 'Low Cost', filters: { expenseRatioMax:'0.1', aumMin:'500000000' } },
    { label: 'High Dividend', filters: { dividendMin:'2', expenseRatioMax:'0.5' } },
    { label: 'Euro Zone', filters: { exchange:'EURONEXT', assetClass:'Equity' } },
    { label: 'Bond ETFs', filters: { assetClass:'Fixed Income' } },
    { label: 'Big AUM', filters: { aumMin:'50000000000' } },
  ];

  const runScreener = async () => {
    setLoading(true); setError(null); setSearched(true);
    try {
      const p = new URLSearchParams({ limit: 200, isEtf: 'true' });
      if (filters.aumMin)    p.set('marketCapMin', filters.aumMin);
      if (filters.aumMax)    p.set('marketCapMax', filters.aumMax);
      if (filters.dividendMin) p.set('dividendMin', filters.dividendMin);
      if (filters.volumeMin)   p.set('volumeMin', filters.volumeMin);
      if (filters.exchange && filters.exchange !== 'All') p.set('exchange', filters.exchange);
      const res = await fetch('/api/screener?' + p.toString());
      const data = await res.json();
      if (data.error === 'Premium') throw new Error('This endpoint requires a higher FMP plan.');
      let rows = data.results || [];
      // Client-side filters
      if (filters.expenseRatioMax) {
        const max = parseFloat(filters.expenseRatioMax) / 100; // convert % to decimal
        rows = rows.filter(r => r.lastAnnualDividend == null || true); // expense ratio not in screener data, skip
      }
      // Filter by asset class keyword in name if selected
      if (filters.assetClass !== 'All') {
        const kw = {
          'Equity': ['equity','stock','shares','s&p','nasdaq','russell','index'],
          'Fixed Income': ['bond','treasury','debt','fixed income','gilt','credit'],
          'Commodity': ['gold','silver','oil','commodity','commodities','metal','energy','agriculture'],
          'Real Estate': ['reit','real estate','property'],
          'Currency': ['currency','forex','dollar','euro','yen'],
          'Multi-Asset': ['multi','balanced','allocation','mixed'],
          'Alternatives': ['hedge','alternative','infrastructure','private'],
        }[filters.assetClass] || [];
        if (kw.length) rows = rows.filter(r => kw.some(k => (r.companyName||'').toLowerCase().includes(k)));
      }
      setResults(rows);
    } catch(e) {
      setError(e.message); setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fmtCap = v => {
    if (!v) return '—';
    if (v >= 1e12) return (v/1e12).toFixed(1) + 'T';
    if (v >= 1e9)  return (v/1e9).toFixed(1) + 'B';
    if (v >= 1e6)  return (v/1e6).toFixed(0) + 'M';
    return v.toFixed(0);
  };
  const fmtDiv = v => v == null || v === 0 ? '—' : (v).toFixed(2) + '%';

  const sorted = [...results].sort((a,b) => {
    const av = a[sortCol] ?? -Infinity, bv = b[sortCol] ?? -Infinity;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const Th = ({ col, label, right }) => (
    <th onClick={() => toggleSort(col)} style={{
      padding:'8px 12px', textAlign: right ? 'right' : 'left',
      cursor:'pointer', fontWeight:500, fontSize:10,
      color: sortCol===col ? 'var(--green)' : 'var(--text3)',
      letterSpacing:'0.06em', whiteSpace:'nowrap', userSelect:'none',
      borderBottom:'1px solid var(--border)'
    }}>
      {label}{sortCol===col ? (sortDir==='desc'?' ▼':' ▲') : ''}
    </th>
  );

  return (
    <div className="fu" style={{display:'flex', flexDirection:'column', minHeight:0}}>
      {/* Header */}
      <div style={{marginBottom:18}}>
        <div className="serif" style={{fontSize:22, letterSpacing:'-0.02em'}}>ETF Screener</div>
        <div className="mono" style={{fontSize:10, color:'var(--text3)', marginTop:3}}>
          Screen ETFs by AUM, region, asset class, dividend yield · up to 200 results
        </div>
      </div>

      {/* Presets */}
      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
        {ETF_PRESETS.map(p => (
          <button key={p.label} onClick={() => { setFilters(f => ({...f, exchange:'All', assetClass:'All', aumMin:'', aumMax:'', expenseRatioMax:'', dividendMin:'', volumeMin:'', ...p.filters})); }}
            style={{background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:20,
              padding:'4px 12px', fontSize:11, color:'var(--text2)', cursor:'pointer', whiteSpace:'nowrap'}}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', marginBottom:14}}>
        <div style={{display:'flex', flexWrap:'wrap', gap:16, alignItems:'flex-start'}}>

          {/* Exchange */}
          <div style={{minWidth:130}}>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>EXCHANGE</div>
            <select className="inp mono" value={filters.exchange} onChange={e=>setFilter('exchange',e.target.value)}
              style={{width:'100%', padding:'5px 8px', fontSize:11}}>
              {ETF_EXCHANGES.map(x=><option key={x} value={x}>{x}</option>)}
            </select>
          </div>

          {/* Asset Class */}
          <div style={{minWidth:150}}>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>ASSET CLASS</div>
            <select className="inp mono" value={filters.assetClass} onChange={e=>setFilter('assetClass',e.target.value)}
              style={{width:'100%', padding:'5px 8px', fontSize:11}}>
              {ASSET_CLASSES.map(x=><option key={x} value={x}>{x}</option>)}
            </select>
          </div>

          {/* AUM */}
          <div>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>AUM (USD)</div>
            <div style={{display:'flex', gap:4, alignItems:'center'}}>
              <input className="inp mono" placeholder="Min e.g. 1B" value={filters.aumMin}
                onChange={e=>setFilter('aumMin', e.target.value.replace(/[^0-9.]/g,''))}
                style={{width:90, padding:'5px 8px', fontSize:11}}/>
              <span style={{color:'var(--text3)', fontSize:11}}>–</span>
              <input className="inp mono" placeholder="Max" value={filters.aumMax}
                onChange={e=>setFilter('aumMax', e.target.value.replace(/[^0-9.]/g,''))}
                style={{width:90, padding:'5px 8px', fontSize:11}}/>
            </div>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', marginTop:2}}>use B/T suffix not supported — enter raw numbers e.g. 1000000000</div>
          </div>

          {/* Expense Ratio */}
          <div style={{minWidth:120}}>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>MAX EXPENSE RATIO %</div>
            <input className="inp mono" placeholder="e.g. 0.5" value={filters.expenseRatioMax}
              onChange={e=>setFilter('expenseRatioMax', e.target.value)}
              style={{width:'100%', padding:'5px 8px', fontSize:11}}/>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', marginTop:2}}>note: applied client-side if available</div>
          </div>

          {/* Min Dividend Yield */}
          <div style={{minWidth:130}}>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>MIN DIV YIELD %</div>
            <input className="inp mono" placeholder="e.g. 2" value={filters.dividendMin}
              onChange={e=>setFilter('dividendMin', e.target.value)}
              style={{width:'100%', padding:'5px 8px', fontSize:11}}/>
          </div>

          {/* Volume */}
          <div style={{minWidth:120}}>
            <div className="mono" style={{fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:4}}>MIN VOLUME</div>
            <input className="inp mono" placeholder="e.g. 100000" value={filters.volumeMin}
              onChange={e=>setFilter('volumeMin', e.target.value)}
              style={{width:'100%', padding:'5px 8px', fontSize:11}}/>
          </div>

        </div>

        {/* Run button */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginTop:14}}>
          <button onClick={runScreener} disabled={loading}
            className="btn btn-primary" style={{minWidth:120}}>
            {loading ? '⟳ Scanning…' : '▶ Run ETF Screener'}
          </button>
          {searched && !loading && (
            <span className="mono" style={{fontSize:11, color:'var(--text3)'}}>
              {results.length} ETFs found
            </span>
          )}
          {error && <span style={{fontSize:11, color:'var(--red)'}}>{error}</span>}
        </div>
      </div>

      {/* Results table */}
      {sorted.length > 0 && (
        <div style={{flex:1, overflow:'auto', borderRadius:10, border:'1px solid var(--border)'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
            <thead style={{position:'sticky', top:0, background:'var(--surface)', zIndex:2}}>
              <tr>
                <Th col="symbol"      label="Ticker" />
                <Th col="companyName" label="Name" />
                <Th col="exchange"    label="Exchange" />
                <Th col="marketCap"   label="AUM" right />
                <Th col="price"       label="Price" right />
                <Th col="changesPercentage" label="Day %" right />
                <Th col="_div"        label="Div %" right />
                <Th col="volume"      label="Volume" right />
                <th style={{padding:'8px 12px', fontSize:10, color:'var(--text3)', letterSpacing:'0.06em', borderBottom:'1px solid var(--border)'}}>+WL</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const divYield = r.lastAnnualDividend && r.price ? (r.lastAnnualDividend / r.price * 100) : null;
                const dayPct = r.changesPercentage;
                return (
                  <tr key={r.symbol} onClick={()=>onOpenStock({symbol:r.symbol,name:r.companyName,type:'etf',qty:0,avgPrice:0,broker:'',color:'#5ab8cc'})}
                    style={{borderBottom:'1px solid var(--border)', cursor:'pointer',
                      background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.015)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'rgba(255,255,255,0.015)'}>
                    <td style={{padding:'8px 12px', fontWeight:600, color:'var(--green)', fontFamily:'monospace'}}>{r.symbol}</td>
                    <td style={{padding:'8px 12px', color:'var(--text2)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.companyName}</td>
                    <td style={{padding:'8px 12px', color:'var(--text3)', fontSize:11, fontFamily:'monospace'}}>{r.exchangeShortName||r.exchange||'—'}</td>
                    <td style={{padding:'8px 12px', textAlign:'right', fontFamily:'monospace', color:'var(--text2)'}}>{fmtCap(r.marketCap)}</td>
                    <td style={{padding:'8px 12px', textAlign:'right', fontFamily:'monospace'}}>${r.price?.toFixed(2)||'—'}</td>
                    <td style={{padding:'8px 12px', textAlign:'right', fontFamily:'monospace',
                      color: dayPct==null?'var(--text3)':dayPct>=0?'var(--green)':'var(--red)'}}>
                      {dayPct==null?'—':(dayPct>=0?'+':'')+dayPct.toFixed(2)+'%'}
                    </td>
                    <td style={{padding:'8px 12px', textAlign:'right', fontFamily:'monospace', color:'var(--gold)'}}>
                      {fmtDiv(divYield)}
                    </td>
                    <td style={{padding:'8px 12px', textAlign:'right', fontFamily:'monospace', color:'var(--text3)', fontSize:11}}>{fmtCap(r.volume)}</td>
                    <td style={{padding:'8px 4px', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
                      {watchlists.length > 0 ? (
                        <div style={{position:'relative', display:'inline-block'}} ref={wlDropdown===r.symbol ? wlDropRef : null}>
                          <button onClick={()=>setWlDropdown(v=>v===r.symbol?null:r.symbol)}
                            style={{background:'none', border:'1px solid var(--border2)', borderRadius:4,
                              padding:'2px 6px', fontSize:10, color:'var(--text3)', cursor:'pointer'}}>★</button>
                          {wlDropdown===r.symbol && ReactDOM.createPortal(
                            (() => {
                              const btn = wlDropRef.current?.querySelector('button');
                              const rect = btn?.getBoundingClientRect();
                              return (
                                <div style={{position:'fixed', right: rect?window.innerWidth-rect.right:16,
                                  top:rect?rect.bottom+4:100, background:'var(--surface)',
                                  border:'1px solid var(--border2)', borderRadius:8, padding:6,
                                  zIndex:99999, minWidth:150, boxShadow:'var(--popover-shadow)'}}>
                                  {watchlists.map(wl=>(
                                    <div key={wl.id} onClick={()=>{
                                      setWatchlists(prev=>prev.map(w=>w.id===wl.id?{...w,items:[...w.items,{symbol:r.symbol,name:r.companyName,type:'etf',addedAt:Date.now()}]}:w));
                                      setWlDropdown(null);
                                    }} style={{padding:'7px 12px', cursor:'pointer', fontSize:12,
                                      color:'var(--text2)', borderRadius:5}}
                                      onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                      {wl.name}
                                    </div>
                                  ))}
                                </div>
                              );
                            })(),
                            document.body
                          )}
                        </div>
                      ) : <span style={{color:'var(--text3)',fontSize:10}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {searched && !loading && sorted.length === 0 && !error && (
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text3)'}}>
          <div style={{fontSize:32, marginBottom:10}}>📊</div>
          <div style={{fontSize:13}}>No ETFs matched your filters</div>
          <div style={{fontSize:11, marginTop:4}}>Try loosening the criteria</div>
        </div>
      )}

      {!searched && (
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text3)'}}>
          <div style={{fontSize:36, marginBottom:12}}>🏦</div>
          <div style={{fontSize:13, marginBottom:4}}>Set your filters and run the ETF screener</div>
          <div style={{fontSize:11}}>Screener covers thousands of ETFs across global exchanges</div>
        </div>
      )}
    </div>
  );
}

// ── WatchlistPage ────────────────────────────────────────────────────────────
function WatchlistPage({ watchlists, setWatchlists, activeWLId, setActiveWLId, onOpenStock, onOpenChart, positions }) {
  const [ctxMenu, setCtxMenu]         = React.useState(null);
  const [addingWL, setAddingWL]       = React.useState(false);
  const [newWLName, setNewWLName]     = React.useState('');
  const [addingCat, setAddingCat]     = React.useState(false);
  const [newCatName, setNewCatName]   = React.useState('');
  const [addTickerQ, setAddTickerQ]   = React.useState('');
  const [addTickerRes, setAddTickerRes] = React.useState([]);
  const [addTickerHL, setAddTickerHL] = React.useState(-1);
  const [addingTocat, setAddingTocat] = React.useState(null); // catId or 'top'
  const [fundamentals, setFundamentals] = React.useState({});
  const [loadingFund, setLoadingFund] = React.useState({});
  const [dragState, setDragState]     = React.useState(null);
  const [dragOverCat, setDragOverCat] = React.useState(null);
  const [dragOverSym, setDragOverSym] = React.useState(null);
  const [sortCol, setSortCol]         = React.useState(null);
  const [sortDir, setSortDir]         = React.useState('desc');
  const [livePrices, setLivePrices]   = React.useState({}); // symbol → {price, change, mktcap}

  const wl = watchlists.find(w => w.id === activeWLId);
  const allItems = wl ? wl.categories.flatMap(cat => cat.items) : [];

  // ── Fetch live FMP prices for all watchlist items ──
  const symKey = allItems.map(i => i.symbol).filter(Boolean).sort().join(',');
  React.useEffect(() => {
    const syms = [...new Set(allItems.map(i => i.symbol).filter(Boolean))];
    if (!syms.length) return;
    let cancelled = false;
    const doFetch = async () => {
      try {
        const BATCH = 15;
        for (let i = 0; i < syms.length; i += BATCH) {
          if (cancelled) return;
          const batch = syms.slice(i, i + BATCH).join(',');
          const r = await fetch('/api/fmp?path=' + encodeURIComponent('/quote?symbol=' + batch));
          if (!r.ok) continue;
          const data = await r.json().catch(() => null);
          if (!data || cancelled) continue;
          const arr = Array.isArray(data) ? data : (data && typeof data === 'object' && !data.error ? [data] : []);
          if (!arr.length) continue;
          const map = {};
          arr.forEach(q => {
            if (!q?.symbol) return;
            let chg = q.changePercentage ?? q.changesPercentage ?? q.changePercent ?? null;
            if (chg == null && q.previousClose > 0 && q.price != null) {
              chg = (q.price - q.previousClose) / q.previousClose * 100;
            }
            map[q.symbol] = { price: q.price, change: chg, mktcap: q.marketCap };
          });
          if (!cancelled) setLivePrices(p => ({...p, ...map}));
        }
      } catch(e) { console.warn('WL price fetch error:', e); }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [activeWLId, symKey]);

  // Fetch fundamentals — batched, cached
  React.useEffect(() => {
    if (!wl) return;
    const syms = allItems.map(i => i.symbol).filter(s => s && !isISIN(s) && !loadingFund[s] && !fundamentals[s]);
    if (!syms.length) return;
    const BATCH = 3;
    (async () => {
      for (let i = 0; i < syms.length; i += BATCH) {
        const batch = syms.slice(i, i + BATCH);
        batch.forEach(s => setLoadingFund(p => ({...p, [s]: true})));
        await Promise.all(batch.map(async sym => {
          try {
            const r = await fetch('/api/fundamentals?symbol=' + sym.split('.')[0]);
            const d = await r.json();
            if (!d.error) setFundamentals(p => ({...p, [sym]: d}));
          } catch(e) {}
          finally { setLoadingFund(p => ({...p, [sym]: false})); }
        }));
        if (i + BATCH < syms.length) await new Promise(r => setTimeout(r, 400));
      }
    })();
  }, [activeWLId, allItems.map(i=>i.symbol).join(',')]);

  // ── Mutations ──
  const mutateWL = fn => setWatchlists(prev => prev.map(w => w.id === activeWLId ? fn(w) : w));
  const flagItem = (symbol, flag) => mutateWL(w => ({
    ...w, categories: w.categories.map(cat => ({
      ...cat, items: cat.items.map(it => it.symbol === symbol ? {...it, flag} : it)
    }))
  }));
  const removeItem = (symbol) => mutateWL(w => ({
    ...w, categories: w.categories.map(cat => ({
      ...cat, items: cat.items.filter(it => it.symbol !== symbol)
    }))
  }));
  const addCategory = (name) => mutateWL(w => ({
    ...w, categories: [...w.categories, { id: 'cat_' + Date.now(), name, items: [] }]
  }));
  const deleteCategory = (catId) => mutateWL(w => {
    const cats = w.categories.filter(c => c.id !== catId);
    const orphans = w.categories.find(c => c.id === catId)?.items || [];
    if (!cats.length) return w;
    return { ...w, categories: cats.map((c, i) => i === 0 ? {...c, items: [...c.items, ...orphans]} : c) };
  });
  const addItemToCat = (catId, item) => mutateWL(w => {
    const already = w.categories.some(cat => cat.items.some(it => it.symbol === item.symbol));
    if (already) return w;
    const targetCat = catId || w.categories[0]?.id;
    return { ...w, categories: w.categories.map(cat =>
      cat.id === targetCat ? {...cat, items: [...cat.items, {...item, flag: null}]} : cat
    )};
  });

  // ── Drag & drop ──
  const handleDragStart = (e, symbol, fromCatId) => {
    setDragState({ symbol, fromCatId }); e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, catId, overSym) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    setDragOverCat(catId); setDragOverSym(overSym || null);
  };
  const handleDrop = (e, toCatId, beforeSym) => {
    e.preventDefault();
    if (!dragState) return;
    const { symbol, fromCatId } = dragState;
    setDragState(null); setDragOverCat(null); setDragOverSym(null);
    mutateWL(w => {
      let draggedItem = null;
      const cats = w.categories.map(cat => {
        if (cat.id === fromCatId) {
          draggedItem = cat.items.find(it => it.symbol === symbol);
          return {...cat, items: cat.items.filter(it => it.symbol !== symbol)};
        }
        return cat;
      });
      if (!draggedItem) return w;
      return { ...w, categories: cats.map(cat => {
        if (cat.id !== toCatId) return cat;
        const items = [...cat.items];
        if (beforeSym) {
          const idx = items.findIndex(it => it.symbol === beforeSym);
          items.splice(idx >= 0 ? idx : items.length, 0, draggedItem);
        } else { items.push(draggedItem); }
        return {...cat, items};
      })};
    });
  };
  const handleDragEnd = () => { setDragState(null); setDragOverCat(null); setDragOverSym(null); };

  // ── Data helpers ──
  const getHealthScore = (sym) => calcCanonicalHealthScore(fundamentals[sym]);
  const getEPSGrowth = (sym) => {
    const d = fundamentals[sym];
    if (!d) return null;
    const yrs = d.byYear?.slice(-3) || [];
    const last = yrs[yrs.length-1]; const prev = yrs[yrs.length-2];
    if (!last?.eps || !prev?.eps || prev.eps === 0) return null;
    return (last.eps / prev.eps - 1) * 100;
  };
  // Live prices fetched independently (not just from portfolio positions)
  const [wlLivePrices, setWlLivePrices] = React.useState({});
  React.useEffect(() => {
    if (!wl || !allItems.length) return;
    const syms = [...new Set(allItems.map(i=>i.symbol).filter(s=>s&&!isISIN(s)))];
    if (!syms.length) return;
    fetch('/api/fmp?path=' + encodeURIComponent('/quote?symbol=' + syms[0]))
      .then(r=>r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const pm = {};
        data.forEach(q => { const chg = q.changePercentage ?? q.changesPercentage ?? null; pm[q.symbol] = { price: q.price, change: chg }; });
        setWlLivePrices(pm);
      })
      .catch(() => {});
  }, [activeWLId, allItems.map(i=>i.symbol).join(',')]);

  const getItemPrice = sym => {
    const lp = livePrices[sym];
    if (lp) return { price: lp.price, change: lp.change, mktcap: lp.mktcap };
    // Fallback to portfolio position while live prices load
    // Match on full fmpTicker, base ticker (SAP.DE → SAP), or symbol
    const pos = positions.find(p => {
      const ft = p.fmpTicker || p.symbol;
      return ft === sym || ft.split('.')[0] === sym || p.symbol === sym;
    });
    return pos?.currentPrice ? { price: pos.currentPrice, change: pos.dailyChange ?? null, mktcap: null } : null;
  };
  const fmtMktCap = v => {
    if (v == null) return null;
    if (v >= 1e12) return (v/1e12).toFixed(1) + 'T';
    if (v >= 1e9)  return (v/1e9).toFixed(1)  + 'B';
    if (v >= 1e6)  return (v/1e6).toFixed(0)  + 'M';
    return v.toFixed(0);
  };

  // ── Sorting ──
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };
  const getSortVal = (sym, col) => {
    const fund = fundamentals[sym];
    const pd = getItemPrice(sym);
    if (col === 'price')  return pd?.price ?? -Infinity;
    if (col === 'change' || col === 'daily') return pd?.change ?? -Infinity;
    if (col === 'mktcap') return fund?.marketCap ?? -Infinity;
    if (col === 'eps')    return getEPSGrowth(sym) ?? -Infinity;
    if (col === 'health') return getHealthScore(sym) ?? -Infinity;
    if (col === 'sector') return fund?.sector ?? '';
    return 0;
  };
  const sortItems = (items) => {
    if (!sortCol) return items;
    return [...items].sort((a, b) => {
      const va = getSortVal(a.symbol, sortCol);
      const vb = getSortVal(b.symbol, sortCol);
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  };

  // Ticker search
  React.useEffect(() => {
    if (!addTickerQ) { setAddTickerRes([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetchTickerSearch(addTickerQ, 10, ctrl.signal).then(r => { if (!ctrl.signal.aborted) setAddTickerRes(r); }).catch(() => {});
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [addTickerQ]);

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span style={{opacity:0.25,fontSize:9,marginLeft:2}}>⇅</span>;
    return <span style={{color:'var(--green)',fontSize:9,marginLeft:2}}>{sortDir==='desc'?'↓':'↑'}</span>;
  };

  const COL_HDR = { fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', cursor:'pointer',
    userSelect:'none', display:'flex', alignItems:'center', gap:2, transition:'color 0.12s' };

  if (!wl) return null;

  // Flatten all items for sorted "flat" view vs per-category
  const isSorted = !!sortCol;
  const flatSortedItems = isSorted ? sortItems(allItems) : null;

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'var(--bg)' }}>

      {/* ── Left sidebar: WL selector ── */}
      <div style={{ width:200, flexShrink:0, borderRight:'1px solid var(--border)',
        background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 10px', gap:4 }}>
        <div className="mono" style={{ fontSize:9, color:'var(--text3)', letterSpacing:'0.12em', marginBottom:6, paddingLeft:4 }}>WATCHLISTS</div>
        {watchlists.map(w => (
          <button key={w.id} onClick={() => setActiveWLId(w.id)} className="mono"
            style={{ textAlign:'left', padding:'7px 10px', borderRadius:6, cursor:'pointer',
              border:'1px solid', fontSize:11, letterSpacing:'0.04em', transition:'all 0.12s',
              borderColor: activeWLId===w.id ? 'rgba(58,154,181,0.35)' : 'var(--border)',
              background:  activeWLId===w.id ? 'var(--green-dim)' : 'transparent',
              color:       activeWLId===w.id ? 'var(--green)' : 'var(--text2)' }}>
            {w.name}
            <span style={{ float:'right', opacity:0.5, fontSize:10 }}>{w.categories.flatMap(c=>c.items).length}</span>
          </button>
        ))}
        {addingWL ? (
          <input className="inp mono" autoFocus placeholder="List name…" value={newWLName}
            onChange={e=>setNewWLName(e.target.value)}
            onKeyDown={e=>{
              if(e.key==='Enter'&&newWLName.trim()){
                const id='wl_'+Date.now();
                setWatchlists(p=>[...p,{id,name:newWLName.trim(),categories:[{id:'cat_default',name:'Uncategorized',items:[]}]}]);
                setActiveWLId(id); setNewWLName(''); setAddingWL(false);
              }
              if(e.key==='Escape'){setAddingWL(false);setNewWLName('');}
            }}
            style={{fontSize:11,padding:'6px 8px',marginTop:4}}/>
        ) : (
          <button onClick={()=>setAddingWL(true)} className="mono"
            style={{textAlign:'left',padding:'6px 10px',borderRadius:6,cursor:'pointer',
              border:'1px dashed var(--border)',background:'transparent',color:'var(--text3)',fontSize:10,marginTop:4}}>
            + New watchlist
          </button>
        )}
        <div style={{flex:1}}/>
        {activeWLId!=='portfolio' && (
          <button onClick={()=>{
            if(!window.confirm('Delete "'+wl.name+'"?')) return;
            setWatchlists(p=>p.filter(w=>w.id!==activeWLId));
            setActiveWLId('portfolio');
          }} className="mono"
            style={{padding:'5px 10px',borderRadius:5,border:'1px solid var(--red-dim)',background:'transparent',
              color:'var(--red)',cursor:'pointer',fontSize:9,letterSpacing:'0.06em',opacity:0.7}}>
            Delete list
          </button>
        )}
      </div>

      {/* ── Right: table ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* ── Toolbar ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'11px 20px', borderBottom:'1px solid var(--border)', flexShrink:0, gap:12 }}>
          <div>
            <div className="serif" style={{ fontSize:20, letterSpacing:'-0.02em' }}>{wl.name}</div>
            <div className="mono" style={{ fontSize:10, color:'var(--text3)', marginTop:1 }}>
              {allItems.length} item{allItems.length!==1?'s':''} · {wl.categories.length} categor{wl.categories.length!==1?'ies':'y'}
              {sortCol && <span style={{color:'var(--green)'}}> · sorted by {sortCol}</span>}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {/* ── Global add item button ── */}
            <div style={{position:'relative'}}>
              {addingTocat==='top' ? (
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <div style={{position:'relative'}}>
                    <input className="inp mono" autoFocus placeholder="Search stock, ETF, crypto…"
                      value={addTickerQ} onChange={e=>{setAddTickerQ(e.target.value);setAddTickerHL(-1);}}
                      onKeyDown={e=>{
                        if(e.key==='ArrowDown'){e.preventDefault();setAddTickerHL(h=>Math.min(h+1,addTickerRes.length-1));}
                        else if(e.key==='ArrowUp'){e.preventDefault();setAddTickerHL(h=>Math.max(h-1,-1));}
                        else if(e.key==='Enter'){
                          e.preventDefault();
                          const pick = addTickerHL>=0 ? addTickerRes[addTickerHL] : null;
                          const sym = pick?.symbol || addTickerQ.trim().toUpperCase();
                          const name = pick?.name || sym;
                          if(sym){addItemToCat(wl.categories[0]?.id,{symbol:sym,name});setAddTickerQ('');setAddTickerRes([]);setAddTickerHL(-1);setAddingTocat(null);}
                        }
                        else if(e.key==='Escape'){setAddTickerRes([]);setAddTickerHL(-1);}
                      }}
                      onBlur={()=>setTimeout(()=>{setAddTickerRes([]);setAddTickerQ('');setAddTickerHL(-1);setAddingTocat(null);},200)}
                      style={{fontSize:11,padding:'6px 10px',width:220}}/>
                    {(addTickerRes.length > 0 || false) && (
                      <div style={{position:'absolute',top:'110%',left:0,zIndex:999}}>
                        <TickerDropdown results={addTickerRes} searching={false} highlightIdx={addTickerHL}
                          onSelect={r=>{
                            addItemToCat(wl.categories[0]?.id, {symbol:r.symbol,name:r.name});
                            setAddTickerQ('');setAddTickerRes([]);setAddTickerHL(-1);setAddingTocat(null);
                          }}/>
                      </div>
                    )}
                  </div>
                  <button onClick={()=>{setAddingTocat(null);setAddTickerQ('');setAddTickerRes([]);}}
                    style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:14}}>✕</button>
                </div>
              ) : (
                <button onClick={()=>setAddingTocat('top')}
                  style={{padding:'7px 14px',borderRadius:6,border:'1px solid rgba(58,154,181,0.35)',
                    background:'var(--green-dim)',color:'var(--green)',cursor:'pointer',
                    fontSize:11,fontFamily:'IBM Plex Mono,monospace',letterSpacing:'0.04em'}}>
                  + Add Item
                </button>
              )}
            </div>
            {/* ── Add category ── */}
            {addingCat ? (
              <input className="inp mono" autoFocus placeholder="Category name…" value={newCatName}
                onChange={e=>setNewCatName(e.target.value)}
                onKeyDown={e=>{
                  if(e.key==='Enter'&&newCatName.trim()){addCategory(newCatName.trim());setNewCatName('');setAddingCat(false);}
                  if(e.key==='Escape'){setAddingCat(false);setNewCatName('');}
                }}
                style={{fontSize:11,padding:'6px 10px',width:150}}
                onBlur={()=>setTimeout(()=>{setAddingCat(false);setNewCatName('');},150)}/>
            ) : (
              <button onClick={()=>setAddingCat(true)}
                style={{padding:'7px 14px',borderRadius:6,border:'1px solid var(--border2)',
                  background:'transparent',color:'var(--text2)',cursor:'pointer',
                  fontSize:11,fontFamily:'IBM Plex Mono,monospace',letterSpacing:'0.04em'}}>
                + Category
              </button>
            )}
            {sortCol && (
              <button onClick={()=>setSortCol(null)}
                style={{padding:'5px 10px',borderRadius:5,border:'1px solid var(--border)',
                  background:'transparent',color:'var(--text3)',cursor:'pointer',
                  fontSize:9,fontFamily:'IBM Plex Mono,monospace',letterSpacing:'0.06em'}}>
                ✕ Clear sort
              </button>
            )}
          </div>
        </div>

        {/* ── Column headers ── */}
        <div style={{ display:'grid', gridTemplateColumns:'24px 2fr 1fr 1fr 1fr 1fr 1fr 0.9fr',
          padding:'7px 20px', borderBottom:'1px solid var(--border)',
          background:'var(--surface)', flexShrink:0, gap:8 }}>
          <div/>{/* drag handle col */}
          <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em'}}>ASSET</div>
          {[['price','PRICE'],['change','CHG %'],['mktcap','MKT CAP'],['eps','EPS YoY'],['sector','SECTOR'],['health','HEALTH']].map(([col,label])=>(
            <div key={col} className="mono" style={{...COL_HDR, justifyContent:'flex-end'}}
              onClick={()=>toggleSort(col)}
              onMouseEnter={e=>e.currentTarget.style.color='var(--text)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
              {sortCol===col ? <span style={{color:'var(--green)'}}>{label}</span> : label}
              <SortIcon col={col}/>
            </div>
          ))}
        </div>

        {/* ── Rows ── */}
        <div style={{ flex:1, overflow:'auto' }}>
          {allItems.length === 0 && (
            <div style={{padding:'60px 20px',textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:12}}>★</div>
              <div className="serif" style={{fontSize:18,color:'var(--text2)',marginBottom:8}}>Your watchlist is empty</div>
              <div className="mono" style={{fontSize:11,color:'var(--text3)'}}>Click "+ Add Item" to add stocks, ETFs or crypto</div>
            </div>
          )}

          {/* ── Sorted flat view (no categories shown) ── */}
          {isSorted && flatSortedItems.map(item => (
            <WLRow key={item.symbol} item={item} catId={null}
              fundamentals={fundamentals} loadingFund={loadingFund}
              getHealthScore={getHealthScore} getEPSGrowth={getEPSGrowth}
              getItemPrice={getItemPrice} fmtMktCap={fmtMktCap}
              dragState={dragState} dragOverSym={dragOverSym} dragOverCat={dragOverCat}
              handleDragStart={handleDragStart} handleDragOver={handleDragOver}
              handleDrop={handleDrop} handleDragEnd={handleDragEnd}
              setCtxMenu={setCtxMenu} onOpenChart={onOpenChart}/>
          ))}

          {/* ── Category grouped view ── */}
          {!isSorted && wl.categories.map((cat, catIdx) => (
            <div key={cat.id} onDragOver={e=>handleDragOver(e,cat.id,null)} onDrop={e=>handleDrop(e,cat.id,null)}>
              {/* Category header */}
              {wl.categories.length > 1 && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 20px 5px',
                  background:'var(--surface2)',
                  borderTop: catIdx>0?'1px solid var(--border)':'none',
                  borderBottom:'1px solid var(--border)' }}>
                  <CategoryLabel cat={cat} onRename={name=>setWatchlists(prev=>prev.map(w=>w.id!==activeWLId?w:{
                    ...w,categories:w.categories.map(c=>c.id===cat.id?{...c,name}:c)
                  }))}/>
                  <span className="mono" style={{fontSize:9,color:'var(--text3)',marginLeft:4}}>{cat.items.length}</span>
                  <div style={{flex:1}}/>
                  {/* Per-category add button */}
                  <div style={{position:'relative'}}>
                    {addingTocat===cat.id ? (
                      <div style={{display:'flex',gap:4,alignItems:'center'}}>
                        <input className="inp mono" autoFocus placeholder="Search…" value={addTickerQ}
                          onChange={e=>{setAddTickerQ(e.target.value);setAddTickerHL(-1);}}
                          onKeyDown={e=>{
                            if(e.key==='ArrowDown'){e.preventDefault();setAddTickerHL(h=>Math.min(h+1,addTickerRes.length-1));}
                            else if(e.key==='ArrowUp'){e.preventDefault();setAddTickerHL(h=>Math.max(h-1,-1));}
                            else if(e.key==='Enter'){
                              e.preventDefault();
                              const pick=addTickerHL>=0?addTickerRes[addTickerHL]:null;
                              const sym = pick?.symbol || addTickerQ.trim().toUpperCase();
                              const name = pick?.name || sym;
                              if(sym){addItemToCat(cat.id,{symbol:sym,name});setAddTickerQ('');setAddTickerRes([]);setAddTickerHL(-1);setAddingTocat(null);}
                            }
                            else if(e.key==='Escape'){setAddTickerRes([]);setAddTickerHL(-1);}
                          }}
                          onBlur={()=>setTimeout(()=>{setAddTickerRes([]);setAddTickerQ('');setAddTickerHL(-1);setAddingTocat(null);},200)}
                          style={{fontSize:10,padding:'3px 8px',width:140}}/>
                        {addTickerRes.length > 0 && (
                          <div style={{position:'absolute',top:'110%',left:0,zIndex:50}}>
                            <TickerDropdown results={addTickerRes} searching={false} highlightIdx={addTickerHL}
                              onSelect={r=>{addItemToCat(cat.id,{symbol:r.symbol,name:r.name});setAddTickerQ('');setAddTickerRes([]);setAddTickerHL(-1);setAddingTocat(null);}}/>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button onClick={()=>setAddingTocat(cat.id)} className="mono"
                        style={{fontSize:9,padding:'2px 7px',borderRadius:4,border:'1px solid var(--border)',
                          background:'transparent',color:'var(--text3)',cursor:'pointer'}}>
                        + Add
                      </button>
                    )}
                  </div>
                  {wl.categories.length>1 && (
                    <button onClick={()=>deleteCategory(cat.id)}
                      style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:11,opacity:0.5}}>✕</button>
                  )}
                </div>
              )}
              {cat.items.length===0 && (
                <div className="mono" style={{padding:'14px 20px',fontSize:10,color:'var(--text3)',fontStyle:'italic',
                  background:dragOverCat===cat.id?'rgba(58,154,181,0.04)':'transparent',
                  borderBottom:'1px solid var(--border)'}}>
                  Drop items here or click + Add
                </div>
              )}
              {cat.items.map(item => (
                <WLRow key={item.symbol} item={item} catId={cat.id}
                  fundamentals={fundamentals} loadingFund={loadingFund}
                  getHealthScore={getHealthScore} getEPSGrowth={getEPSGrowth}
                  getItemPrice={getItemPrice} fmtMktCap={fmtMktCap}
                  dragState={dragState} dragOverSym={dragOverSym} dragOverCat={dragOverCat}
                  handleDragStart={handleDragStart} handleDragOver={handleDragOver}
                  handleDrop={handleDrop} handleDragEnd={handleDragEnd}
                  setCtxMenu={setCtxMenu} onOpenChart={onOpenChart}/>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Context menu ── */}
      {ctxMenu && (
        <WLContextMenu x={ctxMenu.x} y={ctxMenu.y} item={ctxMenu.item}
          onFlag={(sym,flag)=>flagItem(sym,flag)}
          onOpenStock={()=>{
            const sym = ctxMenu.item.symbol;
            const pos = positions.find(p=>(p.fmpTicker||p.symbol)===sym)
              || { symbol: sym, fmpTicker: sym, name: ctxMenu.item.name||sym,
                   type:'stock', qty:0, avgPrice:0,
                   currentPrice: livePrices[sym]?.price||0,
                   dailyChange: livePrices[sym]?.change??null,
                   broker:'—', id: sym };
            onOpenStock(pos);
          }}
          onRemove={()=>removeItem(ctxMenu.item.symbol)}
          onClose={()=>setCtxMenu(null)}/>
      )}
    </div>
  );
}

// ── Shared WatchlistRow ───────────────────────────────────────────────────────
function WLRow({ item, catId, fundamentals, loadingFund, getHealthScore, getEPSGrowth,
  getItemPrice, fmtMktCap, dragState, dragOverSym, dragOverCat,
  handleDragStart, handleDragOver, handleDrop, handleDragEnd, setCtxMenu, onOpenChart }) {
  const fund = fundamentals[item.symbol];
  const loading = loadingFund[item.symbol];
  const priceData = getItemPrice(item.symbol);
  const score = getHealthScore(item.symbol);
  const epsGrowth = getEPSGrowth(item.symbol);
  const flagCol = item.flag ? FLAG_COLORS[item.flag] : null;
  const isDragging = dragState?.symbol === item.symbol;
  const isDropTarget = dragOverCat===catId && dragOverSym===item.symbol;
  const mktcap = fund?.marketCap ? fmtMktCap(fund.marketCap) : (priceData?.mktcap ? fmtMktCap(priceData.mktcap) : null);
  return (
    <div
      draggable={!!catId}
      onDragStart={catId ? e=>handleDragStart(e,item.symbol,catId) : undefined}
      onDragOver={catId ? e=>handleDragOver(e,catId,item.symbol) : undefined}
      onDrop={catId ? e=>handleDrop(e,catId,item.symbol) : undefined}
      onDragEnd={catId ? handleDragEnd : undefined}
      onContextMenu={e=>{e.preventDefault();setCtxMenu({x:e.clientX,y:e.clientY,item,catId});}}
      onClick={()=>onOpenChart(item.symbol)}
      style={{ display:'grid', gridTemplateColumns:'24px 2fr 1fr 1fr 1fr 1fr 1fr 0.9fr',
        padding:'10px 20px', borderBottom:'1px solid var(--border)', gap:8,
        cursor: catId ? 'grab' : 'pointer', transition:'background 0.1s, opacity 0.15s',
        opacity: isDragging ? 0.35 : 1,
        background: isDropTarget ? 'rgba(58,154,181,0.06)' : flagCol ? flagCol.bg : 'transparent',
        borderLeft: flagCol ? '3px solid '+flagCol.dot : '3px solid transparent' }}
      onMouseEnter={e=>{if(!isDragging)e.currentTarget.style.background=flagCol?flagCol.bg:'var(--surface2)';}}
      onMouseLeave={e=>{e.currentTarget.style.background=flagCol?flagCol.bg:'transparent';}}>

      {/* Drag handle */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',
        opacity:catId?0.3:0,fontSize:11,color:'var(--text3)',cursor:'grab'}}>⠿</div>

      {/* Asset */}
      <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
        {flagCol && <span style={{width:6,height:6,borderRadius:'50%',background:flagCol.dot,flexShrink:0}}/>}
        <div style={{minWidth:0}}>
          <div className="mono" style={{fontSize:12,fontWeight:600,color:'var(--text)'}}>{item.symbol}</div>
          <div style={{fontSize:10,color:'var(--text3)',overflow:'hidden',textOverflow:'ellipsis',
            whiteSpace:'nowrap',maxWidth:150}}>{item.name||fund?.companyName||'—'}</div>
        </div>
      </div>

      {/* Price */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        {loading ? <span className="mono shimmer" style={{fontSize:11,color:'var(--text3)'}}>…</span>
          : priceData?.price!=null
          ? <span className="mono" style={{fontSize:12,fontWeight:500}}>{priceData.price.toFixed(2)}</span>
          : <span className="mono" style={{fontSize:12,color:'var(--text3)'}}>—</span>}
      </div>

      {/* Chg % */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        {priceData?.change!=null
          ? <span className="mono" style={{fontSize:11,fontWeight:600,color:priceData.change>=0?'var(--green)':'var(--red)'}}>
              {priceData.change>=0?'+':''}{priceData.change.toFixed(2)}%
            </span>
          : <span className="mono" style={{fontSize:11,color:'var(--text3)'}}>—</span>}
      </div>

      {/* Mkt Cap */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        <span className="mono" style={{fontSize:11,color:'var(--text2)'}}>
          {mktcap || (loading?<span className="shimmer">…</span>:'—')}
        </span>
      </div>

      {/* EPS Growth */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        {epsGrowth!=null
          ? <span className="mono" style={{fontSize:11,fontWeight:600,color:epsGrowth>=0?'var(--green)':'var(--red)'}}>
              {epsGrowth>=0?'+':''}{epsGrowth.toFixed(1)}%
            </span>
          : <span className="mono" style={{fontSize:11,color:'var(--text3)'}}>{loading?<span className="shimmer">…</span>:'—'}</span>}
      </div>

      {/* Sector */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        {fund?.sector
          ? <span className="mono" style={{fontSize:9,padding:'2px 6px',borderRadius:4,
              background:'var(--surface2)',border:'1px solid var(--border)',color:'var(--text3)',
              whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:90}}>
              {fund.sector}
            </span>
          : <span style={{fontSize:11,color:'var(--text3)'}}>{loading?<span className="shimmer">…</span>:'—'}</span>}
      </div>

      {/* Health */}
      <div style={{textAlign:'right',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:5}}>
        {score!=null ? (<>
          <div style={{width:32,height:4,borderRadius:2,background:'var(--surface2)',overflow:'hidden'}}>
            <div style={{height:'100%',width:score+'%',borderRadius:2,
              background:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)',transition:'width 0.4s'}}/>
          </div>
          <span className="mono" style={{fontSize:10,fontWeight:600,
            color:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}}>
            {score}
          </span>
        </>) : <span className="mono" style={{fontSize:10,color:'var(--text3)'}}>{loading?<span className="shimmer">…</span>:'—'}</span>}
      </div>
    </div>
  );
}

// Inline-editable category label
function CategoryLabel({ cat, onRename }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(cat.name);
  if (editing) return (
    <input className="inp mono" autoFocus value={val}
      onChange={e=>setVal(e.target.value)}
      onKeyDown={e=>{if(e.key==='Enter'){onRename(val);setEditing(false);}if(e.key==='Escape')setEditing(false);}}
      onBlur={()=>{onRename(val);setEditing(false);}}
      style={{fontSize:10,padding:'2px 6px',width:120}}/>
  );
  return (
    <span className="mono" onDoubleClick={()=>setEditing(true)}
      style={{fontSize:9,letterSpacing:'0.12em',color:'var(--text2)',cursor:'text',padding:'2px 0',
        textTransform:'uppercase'}}>
      {cat.name}
    </span>
  );
}

// ── ChartsPage — 3e Full-screen chart with watchlist ──────────────────────────
// MA helpers (client-side, from OHLCV data already fetched)
function calcSMA(data, period) {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    return slice.reduce((s, d) => s + d.close, 0) / period;
  });
}
function calcEMA(data, period) {
  const k = 2 / (period + 1);
  const result = [];
  let ema = null;
  for (let i = 0; i < data.length; i++) {
    if (ema === null) {
      if (i >= period - 1) {
        ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
        result.push(ema);
      } else { result.push(null); }
    } else {
      ema = data[i].close * k + ema * (1 - k);
      result.push(ema);
    }
  }
  return result;
}

const MA_DEFS = [
  { key: 'sma20',  label: 'SMA 20',  color: '#d4c06a', calc: d => calcSMA(d, 20)  },
  { key: 'sma50',  label: 'SMA 50',  color: '#5ab8cc', calc: d => calcSMA(d, 50)  },
  { key: 'sma200', label: 'SMA 200', color: '#a78bfa', calc: d => calcSMA(d, 200) },
  { key: 'ema9',   label: 'EMA 9',   color: '#ff6b9d', calc: d => calcEMA(d, 9)   },
  { key: 'ema21',  label: 'EMA 21',  color: '#00d4ff', calc: d => calcEMA(d, 21)  },
];

const DRAW_TOOLS = [
  { key: 'none',       icon: '↖',  label: 'Pointer'     },
  { key: 'hline',      icon: '—',  label: 'Horiz. Line' },
  { key: 'trendline',  icon: '↗',  label: 'Trend Line'  },
  { key: 'rect',       icon: '▭',  label: 'Rectangle'   },
];

function ChartsPage({ positions, watchlists, setWatchlists, activeWLId, setActiveWLId, chartTicker, setChartTicker, onOpenStock }) {
  // Use shared state from App
  const ticker = chartTicker;
  const setTicker = setChartTicker;
  const activeWL = activeWLId;
  const setActiveWL = setActiveWLId;

  const [searchQ, setSearchQ]       = React.useState('');
  const [searchRes, setSearchRes]   = React.useState([]);
  const [searchHL, setSearchHL]     = React.useState(-1);
  const [searching, setSearching]   = React.useState(false);
  const searchRef                   = React.useRef(null);

  // ── Chart data ──
  const [allData, setAllData]       = React.useState(null);
  const [loading, setLoading]       = React.useState(false);
  const [error, setError]           = React.useState(null);

  // ── Chart controls ──
  const [range, setRange]           = React.useState('1Y');
  const [mode, setMode]             = React.useState('candle');
  const [activeMAs, setActiveMAs]   = React.useState({ sma20: true, sma50: true, sma200: false, ema9: false, ema21: false });
  const [drawTool, setDrawTool]     = React.useState('none');

  // ── TV chart refs ──
  const containerRef  = React.useRef(null);
  const chartRef      = React.useRef(null);
  const maSeriesRef   = React.useRef({});
  const drawingsRef   = React.useRef([]);
  const drawStateRef  = React.useRef({ active: false, firstPoint: null, tempSeries: null });

  // ── Watchlist UI state (local only) ──
  const [addingWL, setAddingWL]       = React.useState(false);
  const [newWLName, setNewWLName]     = React.useState('');
  const [addTickerQ, setAddTickerQ]   = React.useState('');
  const [addTickerRes, setAddTickerRes] = React.useState([]);
  const [addTickerHL, setAddTickerHL] = React.useState(-1);
  const [addingTicker, setAddingTicker] = React.useState(false);
  const [ctxMenu, setCtxMenu]         = React.useState(null);
  const [wlPrices, setWlPrices]       = React.useState({});
  const [wlSort, setWlSort]           = React.useState('default'); // 'default' | 'change_asc' | 'change_desc'

  const RANGES = [['1W',7],['1M',30],['3M',90],['6M',180],['1Y',365],['2Y',730],['ALL',3650]];

  // ── Fetch price data when ticker changes ──
  React.useEffect(() => {
    if (!ticker) return;
    setLoading(true); setError(null); setAllData(null);
    const to   = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 365 * 3 * 86400000).toISOString().slice(0, 10);
    fetch(`/api/fmp?path=/historical-price-eod/full?symbol=${ticker}&from=${from}&to=${to}`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.historical || []);
        if (!arr.length) throw new Error('No data for ' + ticker);
        const sorted = [...arr].filter(p => p.date && p.close != null).sort((a, b) => a.date.localeCompare(b.date));
        setAllData(sorted);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticker]);

  // ── Fetch live prices for watchlist items ──
  React.useEffect(() => {
    const wl = watchlists.find(w => w.id === activeWL);
    const items = wl?.categories?.flatMap(c => c.items) || [];
    if (!items.length) return;
    const syms = [...new Set(items.map(i => i.symbol))].filter(Boolean).join(',');
    if (!syms) return;
    const symArr = [...new Set(items.map(i => i.symbol))].filter(Boolean);
    Promise.all(symArr.map(sym =>
      fetch('/api/fmp?path=' + encodeURIComponent('/quote?symbol=' + sym))
        .then(r => r.json())
        .then(data => { const q = Array.isArray(data) ? data[0] : null; return q ? { sym, price: q.price, change: q.changePercentage ?? q.changesPercentage ?? null } : null; })
        .catch(() => null)
    )).then(results => {
      const pm = {};
      results.forEach(r => { if (r) pm[r.sym] = { price: r.price, change: r.change }; });
      setWlPrices(pm);
    });
  }, [watchlists, activeWL]);

  // ── Build TV chart ──
  React.useEffect(() => {
    if (!allData || !containerRef.current) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (RANGES.find(r => r[0] === range)?.[1] ?? 365));
    const cutStr = cutoff.toISOString().slice(0, 10);
    const filtered = allData.filter(p => p.date >= cutStr);
    if (!filtered.length) return;

    const isUp = filtered[filtered.length - 1].close >= filtered[0].close;
    const _tc2 = getTC();
    const GREEN = _tc2.green, RED = _tc2.red;
    const upColor = isUp ? GREEN : RED;

    loadTVLib().then(LW => {
      if (chartRef.current) { try { chartRef.current.remove(); } catch (e) { } chartRef.current = null; }
      maSeriesRef.current = {};
      drawingsRef.current = [];
      drawStateRef.current = { active: false, firstPoint: null, tempSeries: null };

      const chartHeight = Math.max(400, (containerRef.current?.clientHeight || 500) - 2);
      const chart = LW.createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: chartHeight,
        layout: { background: { color: 'transparent' }, textColor: getTC().text2 },
        grid: { vertLines: { color: getTC().gridLine }, horzLines: { color: getTC().gridLine } },
        crosshair: { mode: LW.CrosshairMode.Normal },
        rightPriceScale: { borderColor: getTC().gridLine, textColor: getTC().text2 },
        timeScale: { borderColor: getTC().gridLine, timeVisible: true, secondsVisible: false },
        handleScroll: drawTool === 'none',
        handleScale:  drawTool === 'none',
      });
      chartRef.current = chart;

      // ── Main series ──
      let mainSeries;
      if (mode === 'candle') {
        mainSeries = chart.addCandlestickSeries({ upColor: GREEN, downColor: RED, borderUpColor: GREEN, borderDownColor: RED, wickUpColor: GREEN, wickDownColor: RED });
        mainSeries.setData(filtered.map(p => ({ time: p.date, open: p.open ?? p.close, high: p.high ?? p.close, low: p.low ?? p.close, close: p.close })));
      } else if (mode === 'line') {
        mainSeries = chart.addLineSeries({ color: upColor, lineWidth: 2, priceLineVisible: false });
        mainSeries.setData(filtered.map(p => ({ time: p.date, value: p.close })));
      } else {
        mainSeries = chart.addAreaSeries({ lineColor: upColor, topColor: upColor + '28', bottomColor: upColor + '00', lineWidth: 2, priceLineVisible: false });
        mainSeries.setData(filtered.map(p => ({ time: p.date, value: p.close })));
      }

      // ── Moving Averages ──
      MA_DEFS.forEach(ma => {
        if (!activeMAs[ma.key]) return;
        const vals = ma.calc(filtered);
        const maData = filtered.map((d, i) => vals[i] != null ? { time: d.date, value: vals[i] } : null).filter(Boolean);
        if (!maData.length) return;
        const s = chart.addLineSeries({ color: ma.color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        s.setData(maData);
        maSeriesRef.current[ma.key] = s;
      });

      chart.timeScale().fitContent();

      // ── Drawing tool handler ──
      const handleClick = (param) => {
        if (drawTool === 'none' || !param.time) return;
        const price = mainSeries.coordinateToPrice(param.point.y);
        if (!price) return;

        if (drawTool === 'hline') {
          const hSeries = chart.addLineSeries({ color: 'rgba(255,255,255,0.5)', lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: true });
          // extend horizontal line across full data range
          hSeries.setData([
            { time: filtered[0].date, value: price },
            { time: filtered[filtered.length - 1].date, value: price },
          ]);
          drawingsRef.current.push(hSeries);
          return;
        }

        const ds = drawStateRef.current;
        if (drawTool === 'trendline' || drawTool === 'rect') {
          if (!ds.active) {
            ds.active = true;
            ds.firstPoint = { time: param.time, price };
          } else {
            ds.active = false;
            const p1 = ds.firstPoint;
            if (drawTool === 'trendline') {
              const times = filtered.map(d => d.date);
              const i1 = times.indexOf(p1.time) === -1 ? 0 : times.indexOf(p1.time);
              const i2 = times.indexOf(param.time) === -1 ? times.length - 1 : times.indexOf(param.time);
              const slope = i1 === i2 ? 0 : (price - p1.price) / (i2 - i1);
              const lineData = times.slice(Math.min(i1, i2), Math.max(i1, i2) + 1).map((t, idx) => ({
                time: t, value: p1.price + slope * (Math.min(i1, i2) === i1 ? idx : idx - (i2 - i1)),
              }));
              const tSeries = chart.addLineSeries({ color: 'rgba(255,255,255,0.7)', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
              if (lineData.length >= 2) tSeries.setData(lineData);
              drawingsRef.current.push(tSeries);
            } else {
              // Rectangle: draw 4 border lines
              const times = [p1.time, param.time].sort();
              const prices = [p1.price, price].sort((a, b) => a - b);
              [[prices[0], prices[1]], [prices[1], prices[0]]].forEach(([y1, y2]) => {
                const s = chart.addLineSeries({ color: 'rgba(42,117,141,0.5)', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
                s.setData([{ time: times[0], value: y1 }, { time: times[1], value: y1 }]);
                drawingsRef.current.push(s);
              });
            }
            ds.firstPoint = null;
          }
        }
      };
      chart.subscribeClick(handleClick);

      // ── Resize observer ──
      const ro = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth, height: Math.max(400, containerRef.current.clientHeight - 2) });
        }
      });
      ro.observe(containerRef.current);

      return () => { ro.disconnect(); chart.unsubscribeClick(handleClick); };
    }).catch(() => {});

    return () => { if (chartRef.current) { try { chartRef.current.remove(); } catch (e) { } chartRef.current = null; } };
  }, [allData, range, mode, activeMAs, drawTool]);

  // ── Ticker search (uses shared fetchTickerSearch) ──
  React.useEffect(() => {
    if (!searchQ) { setSearchRes([]); return; }
    setSearching(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetchTickerSearch(searchQ, 14, ctrl.signal)
        .then(r => { if (!ctrl.signal.aborted) { setSearchRes(r); setSearching(false); } })
        .catch(() => { if (!ctrl.signal.aborted) setSearching(false); });
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); setSearching(false); };
  }, [searchQ]);

  // ── Add ticker search (watchlist) ──
  React.useEffect(() => {
    if (!addTickerQ) { setAddTickerRes([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetchTickerSearch(addTickerQ, 10, ctrl.signal).then(r => { if (!ctrl.signal.aborted) setAddTickerRes(r); }).catch(() => {});
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [addTickerQ]);

  const clearDrawings = () => {
    if (!chartRef.current) return;
    drawingsRef.current.forEach(s => { try { chartRef.current.removeSeries(s); } catch (e) { } });
    drawingsRef.current = [];
    drawStateRef.current = { active: false, firstPoint: null, tempSeries: null };
  };

  const activeWLData = watchlists.find(w => w.id === activeWL);

  const cursorStyle = drawTool === 'none' ? 'default' : drawTool === 'hline' ? 'crosshair' : 'crosshair';

  return (
    <div style={{ display: 'flex', height: '100%', gap: 0, overflow: 'hidden' }}>

      {/* ══ LEFT: Chart Area ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', flexShrink: 0 }}>

          {/* Ticker search */}
          <div style={{ position: 'relative', minWidth: 200 }} ref={searchRef}>
            <input
              className="inp mono"
              placeholder="Search ticker or company…"
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); setSearchHL(-1); }}
              onFocus={() => { if (ticker && !searchQ) setSearchQ(ticker); setSearchHL(-1); }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSearchHL(h => Math.min(h+1, searchRes.length-1)); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setSearchHL(h => Math.max(h-1, -1)); }
                else if (e.key === 'Enter') {
                  e.preventDefault();
                  const pick = searchHL >= 0 ? searchRes[searchHL] : searchRes[0];
                  if (pick) { setTicker(pick.symbol); setSearchQ(''); setSearchRes([]); setSearchHL(-1); }
                  else if (searchQ.trim()) { setTicker(searchQ.trim().toUpperCase()); setSearchQ(''); setSearchRes([]); setSearchHL(-1); }
                }
                else if (e.key === 'Escape') { setSearchRes([]); setSearchHL(-1); }
              }}
              onBlur={() => setTimeout(() => { setSearchRes([]); setSearchQ(''); setSearching(false); setSearchHL(-1); }, 200)}
              style={{ fontSize: 12, padding: '5px 10px', width: 200 }}
            />
            <TickerDropdown results={searchRes} searching={searching} highlightIdx={searchHL}
              onSelect={r => { setTicker(r.symbol); setSearchQ(''); setSearchRes([]); setSearchHL(-1); }} />
          </div>

          {/* Current ticker badge */}
          {ticker && (
            <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', padding: '4px 10px', borderRadius: 6, background: 'var(--green-dim)', border: '1px solid rgba(58,154,181,0.2)', letterSpacing: '0.04em' }}>
              {ticker}
            </div>
          )}

          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

          {/* Chart mode */}
          {[['area', '▲ Area'], ['line', '― Line'], ['candle', '┤ Candle']].map(([m, lbl]) => (
            <button key={m} onClick={() => setMode(m)} className="mono"
              style={{ fontSize: 10, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', border: '1px solid', letterSpacing: '0.05em', transition: 'all 0.15s',
                borderColor: mode === m ? 'rgba(42,117,141,0.4)' : 'var(--border)',
                background: mode === m ? 'rgba(42,117,141,0.1)' : 'transparent',
                color: mode === m ? 'var(--blue)' : 'var(--text3)' }}>
              {lbl}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

          {/* MA toggles */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {MA_DEFS.map(ma => (
              <button key={ma.key} onClick={() => setActiveMAs(prev => ({ ...prev, [ma.key]: !prev[ma.key] }))} className="mono"
                style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, cursor: 'pointer', border: '1px solid', letterSpacing: '0.05em', transition: 'all 0.15s',
                  borderColor: activeMAs[ma.key] ? ma.color + '88' : 'var(--border)',
                  background: activeMAs[ma.key] ? ma.color + '18' : 'transparent',
                  color: activeMAs[ma.key] ? ma.color : 'var(--text3)' }}>
                {ma.label}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

          {/* Drawing tools */}
          <div style={{ display: 'flex', gap: 3 }}>
            {DRAW_TOOLS.map(dt => (
              <button key={dt.key} onClick={() => setDrawTool(dt.key === drawTool ? 'none' : dt.key)} title={dt.label} className="mono"
                style={{ fontSize: 12, width: 28, height: 28, borderRadius: 5, cursor: 'pointer', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  borderColor: drawTool === dt.key ? 'rgba(184,160,76,0.5)' : 'var(--border)',
                  background: drawTool === dt.key ? 'rgba(184,160,76,0.12)' : 'transparent',
                  color: drawTool === dt.key ? 'var(--gold)' : 'var(--text3)' }}>
                {dt.icon}
              </button>
            ))}
            {drawingsRef.current.length > 0 && (
              <button onClick={clearDrawings} title="Clear drawings" className="mono"
                style={{ fontSize: 9, padding: '3px 7px', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--red)', letterSpacing: '0.05em' }}>
                ✕ Clear
              </button>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {/* Range */}
            {RANGES.map(([lbl]) => (
              <button key={lbl} onClick={() => setRange(lbl)} className="mono"
                style={{ fontSize: 9, padding: '3px 7px', borderRadius: 4, cursor: 'pointer', border: '1px solid', letterSpacing: '0.06em', transition: 'all 0.15s',
                  borderColor: range === lbl ? 'rgba(58,154,181,0.4)' : 'var(--border)',
                  background: range === lbl ? 'rgba(58,154,181,0.1)' : 'transparent',
                  color: range === lbl ? 'var(--green)' : 'var(--text3)', fontWeight: range === lbl ? 700 : 400 }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* ── Draw mode hint ── */}
        {drawTool !== 'none' && (
          <div className="mono" style={{ padding: '5px 14px', fontSize: 10, color: 'var(--gold)', background: 'rgba(184,160,76,0.06)', borderBottom: '1px solid rgba(184,160,76,0.15)', flexShrink: 0 }}>
            {drawTool === 'hline' ? '⊕ Click on chart to place a horizontal line' :
              drawTool === 'trendline' ? (drawStateRef.current?.active ? '⊕ Click second point to complete trend line' : '⊕ Click first point of trend line') :
              drawTool === 'rect' ? (drawStateRef.current?.active ? '⊕ Click second corner to complete rectangle' : '⊕ Click first corner of rectangle') : ''}
          </div>
        )}

        {/* ── Chart container ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: cursorStyle }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <div className="mono shimmer" style={{ fontSize: 12, color: 'var(--text3)' }}>⟳ Loading {ticker}…</div>
            </div>
          )}
          {error && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 24 }}>📊</div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>No chart data for {ticker}</div>
            </div>
          )}
          {!ticker && !loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 40 }}>📈</div>
              <div className="serif" style={{ fontSize: 18, color: 'var(--text2)' }}>Select a stock to start charting</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text3)' }}>Search above or pick from your watchlist →</div>
            </div>
          )}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* ══ RIGHT: Watchlist Panel ══ */}
      {(() => {
        const activeWLData = watchlists.find(w => w.id === activeWL);
        const allWLItems = activeWLData?.categories?.flatMap(cat => cat.items) || [];
        return (
        <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden' }}>

          {/* Watchlist tabs */}
          <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 10px 0', flexShrink: 0 }}>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 8, paddingLeft: 4 }}>WATCHLISTS</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingBottom: 10 }}>
              {watchlists.map(wl => (
                <button key={wl.id} onClick={() => setActiveWL(wl.id)} className="mono"
                  style={{ fontSize: 10, padding: '4px 9px', borderRadius: 4, cursor: 'pointer', border: '1px solid', letterSpacing: '0.04em', transition: 'all 0.15s',
                    borderColor: activeWL === wl.id ? 'rgba(58,154,181,0.35)' : 'var(--border)',
                    background: activeWL === wl.id ? 'var(--green-dim)' : 'transparent',
                    color: activeWL === wl.id ? 'var(--green)' : 'var(--text3)' }}>
                  {wl.name}
                </button>
              ))}
              {!addingWL ? (
                <button onClick={() => setAddingWL(true)} className="mono"
                  style={{ fontSize: 10, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text3)', letterSpacing: '0.04em' }}>
                  + List
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 4, width: '100%', marginTop: 4 }}>
                  <input className="inp mono" autoFocus placeholder="List name…" value={newWLName} onChange={e => setNewWLName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newWLName.trim()) {
                        const id = 'wl_' + Date.now();
                        setWatchlists(prev => [...prev, { id, name: newWLName.trim(), categories: [{id:'cat_default',name:'Uncategorized',items:[]}] }]);
                        setActiveWL(id); setNewWLName(''); setAddingWL(false);
                      }
                      if (e.key === 'Escape') { setAddingWL(false); setNewWLName(''); }
                    }}
                    style={{ flex: 1, fontSize: 11, padding: '4px 8px' }} />
                  <button onClick={() => { setAddingWL(false); setNewWLName(''); }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Items by category */}
          <div style={{ borderBottom: '1px solid var(--border)', padding: '6px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text3)', letterSpacing: '0.1em' }}>STOCKS</div>
            <button onClick={() => setWlSort(s => s === 'change_desc' ? 'change_asc' : s === 'change_asc' ? 'default' : 'change_desc')}
              className="mono"
              style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, border: '1px solid', cursor: 'pointer',
                background: wlSort !== 'default' ? 'var(--green-dim)' : 'transparent',
                borderColor: wlSort !== 'default' ? 'rgba(58,154,181,0.35)' : 'var(--border)',
                color: wlSort !== 'default' ? 'var(--green)' : 'var(--text3)', letterSpacing: '0.04em' }}>
              {wlSort === 'change_desc' ? '↓ Change%' : wlSort === 'change_asc' ? '↑ Change%' : '⇅ Sort'}
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {allWLItems.length === 0 && (
              <div style={{ padding: '30px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
                  {activeWL === 'portfolio' ? 'Import your portfolio to auto-populate' : 'Add tickers to this watchlist'}
                </div>
              </div>
            )}
            {activeWLData?.categories?.map((cat, catIdx) => (
              <div key={cat.id}>
                {activeWLData.categories.length > 1 && (
                  <div className="mono" style={{ fontSize: 8, color: 'var(--text3)', letterSpacing: '0.1em',
                    padding: '6px 12px 4px', background: 'var(--surface2)',
                    borderTop: catIdx > 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>
                    {cat.name}
                  </div>
                )}
                {(wlSort === 'default' ? cat.items : [...cat.items].sort((a, b) => {
                  const ca = wlPrices[a.symbol]?.change ?? null;
                  const cb = wlPrices[b.symbol]?.change ?? null;
                  if (ca == null && cb == null) return 0;
                  if (ca == null) return 1;
                  if (cb == null) return -1;
                  return wlSort === 'change_desc' ? cb - ca : ca - cb;
                })).map((item) => {
                  const q = wlPrices[item.symbol];
                  const isActive = ticker === item.symbol;
                  const up = q?.change >= 0;
                  const flagCol = item.flag ? FLAG_COLORS[item.flag] : null;
                  return (
                    <div key={item.symbol}
                      onClick={() => setTicker(item.symbol)}
                      onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, item, catId: cat.id, wlId: activeWL }); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 12px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                        transition: 'background 0.12s',
                        background: isActive ? 'var(--green-dim)' : flagCol ? flagCol.bg : 'transparent',
                        borderLeft: isActive ? '2px solid var(--green)' : flagCol ? '2px solid '+flagCol.dot : '2px solid transparent' }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = flagCol ? flagCol.bg : 'var(--surface2)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = flagCol ? flagCol.bg : 'transparent'; }}>
                      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {flagCol && <span style={{ width: 6, height: 6, borderRadius: '50%', background: flagCol.dot, flexShrink: 0 }}/>}
                        <div style={{ minWidth: 0 }}>
                          <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: isActive ? 'var(--green)' : 'var(--text)' }}>{item.symbol}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{item.name}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {q ? (<>
                          <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{q.price?.toFixed(2)}</div>
                          <div className="mono" style={{ fontSize: 10, color: up ? 'var(--green)' : 'var(--red)' }}>{up ? '+' : ''}{q.change?.toFixed(2)}%</div>
                        </>) : <div className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>—</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Add ticker */}
          {activeWL !== 'portfolio' && (
            <div style={{ borderTop: '1px solid var(--border)', padding: 10, flexShrink: 0 }}>
              {!addingTicker ? (
                <button onClick={() => setAddingTicker(true)} className="mono"
                  style={{ width: '100%', padding: '7px', borderRadius: 6, border: '1px dashed var(--border2)', background: 'transparent', color: 'var(--text3)', cursor: 'pointer', fontSize: 10, letterSpacing: '0.06em' }}>
                  + Add ticker
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input className="inp mono" autoFocus placeholder="Search name or ticker…" value={addTickerQ}
                    onChange={e => { setAddTickerQ(e.target.value); setAddTickerHL(-1); }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') { e.preventDefault(); setAddTickerHL(h => Math.min(h+1, addTickerRes.length-1)); }
                      else if (e.key === 'ArrowUp') { e.preventDefault(); setAddTickerHL(h => Math.max(h-1, -1)); }
                      else if (e.key === 'Enter') {
                        e.preventDefault();
                        const pick = addTickerHL >= 0 ? addTickerRes[addTickerHL] : null;
                        const sym = pick?.symbol || addTickerQ.trim().toUpperCase();
                        const name = pick?.name || sym;
                        if (!sym) return;
                        setWatchlists(prev => prev.map(wl => wl.id === activeWL ? {
                          ...wl, categories: wl.categories.map((cat, i) => i === 0
                            ? { ...cat, items: [...cat.items.filter(t => t.symbol !== sym), { symbol: sym, name, flag: null }] }
                            : cat)
                        } : wl));
                        setAddTickerQ(''); setAddTickerRes([]); setAddTickerHL(-1); setAddingTicker(false);
                      }
                      else if (e.key === 'Escape') { setAddTickerRes([]); setAddTickerHL(-1); }
                    }}
                    onBlur={() => setTimeout(() => { setAddTickerRes([]); setAddTickerQ(''); setAddTickerHL(-1); setAddingTicker(false); }, 200)}
                    style={{ fontSize: 11, padding: '6px 10px', width: '100%' }} />
                  <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0 }}>
                    <TickerDropdown results={addTickerRes} searching={false} highlightIdx={addTickerHL}
                      onSelect={r => {
                        setWatchlists(prev => prev.map(wl => wl.id === activeWL ? {
                          ...wl, categories: wl.categories.map((cat, i) => i === 0
                            ? { ...cat, items: [...cat.items.filter(t => t.symbol !== r.symbol), { symbol: r.symbol, name: r.name, flag: null }] }
                            : cat)
                        } : wl));
                        setAddTickerQ(''); setAddTickerRes([]); setAddTickerHL(-1); setAddingTicker(false);
                      }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delete watchlist */}
          {activeWL !== 'portfolio' && activeWLData && (
            <div style={{ padding: '0 10px 10px', flexShrink: 0 }}>
              <button onClick={() => { setWatchlists(prev => prev.filter(w => w.id !== activeWL)); setActiveWL('portfolio'); }}
                className="mono" style={{ width: '100%', padding: '5px', borderRadius: 5, border: '1px solid var(--red-dim)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', fontSize: 9, letterSpacing: '0.06em', opacity: 0.6 }}>
                Delete "{activeWLData.name}"
              </button>
            </div>
          )}

          {/* Context menu */}
          {ctxMenu && (
            <WLContextMenu x={ctxMenu.x} y={ctxMenu.y} item={ctxMenu.item}
              onFlag={(sym, flag) => setWatchlists(prev => prev.map(wl => wl.id === activeWL ? {
                ...wl, categories: wl.categories.map(cat => ({
                  ...cat, items: cat.items.map(it => it.symbol === sym ? {...it, flag} : it)
                }))
              } : wl))}
              onOpenStock={() => {
                const sym = ctxMenu.item.symbol;
                const pos = positions.find(p => (p.fmpTicker||p.symbol)===sym)
                  || { symbol: sym, fmpTicker: sym, name: ctxMenu.item.name||sym,
                       type:'stock', qty:0, avgPrice:0,
                       currentPrice: wlPrices[sym]?.price||0,
                       dailyChange: wlPrices[sym]?.change??null,
                       broker:'—', id: sym };
                if (onOpenStock) onOpenStock(pos);
              }}
              onRemove={() => setWatchlists(prev => prev.map(wl => wl.id === activeWL ? {
                ...wl, categories: wl.categories.map(cat => ({...cat, items: cat.items.filter(it => it.symbol !== ctxMenu.item.symbol)}))
              } : wl))}
              onClose={() => setCtxMenu(null)}/>
          )}
        </div>
        );
      })()}
    </div>
  );
}

// ── CompareView — 3c Stock Comparison ─────────────────────────────────────────
const COMPARE_COLORS = ['#4aaec0','#5ab8cc','#d4c06a','#a78bfa'];

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
      if (good_) return '#4aaec0';
      if (bad_)  return '#e06060';
      return '#d4c06a';
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
                background: neg ? '#e0606044' : barColor(v, i)+'55',
                borderRight: `2px solid ${neg ? '#e06060' : barColor(v, i)}`,
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
  const [cmpSearchRes, setCmpSearchRes] = useState([]);
  const [cmpSearching, setCmpSearching] = useState(false);

  const [cmpHighlight, setCmpHighlight] = React.useState(-1);

  // Live autocomplete for compare input
  React.useEffect(() => {
    if (!input || input.length < 1) { setCmpSearchRes([]); setCmpHighlight(-1); return; }
    setCmpSearching(true);
    setCmpHighlight(-1);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetchTickerSearch(input, 12, ctrl.signal)
        .then(r => { if (!ctrl.signal.aborted) { setCmpSearchRes(r); setCmpSearching(false); } })
        .catch(() => { if (!ctrl.signal.aborted) setCmpSearching(false); });
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); setCmpSearching(false); };
  }, [input]);

  const addTicker = async (raw) => {
    const tk = (typeof raw === 'string' ? raw : raw?.symbol || '').trim().toUpperCase();
    if (!tk || tickers.includes(tk) || tickers.length >= 4) return;
    setTickers(prev => [...prev, tk]);
    setInput('');
    setCmpSearchRes([]);
    setStocks(prev => [...prev, { ticker: tk, data: null, loading: true, error: null }]);
    try {
      const res = await fetch('/api/fundamentals?symbol=' + tk.split('.')[0]);
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
        ntmEpsGrowth: s.data.ntmEpsGrowth,
        qtrEpsGrowthYoY: s.data.qtrEpsGrowthYoY,
        stackEpsGrowth: s.data.stackEpsGrowth,
        ttmRevGrowth: s.data.ttmRevGrowth,
        fy1RevGrowth: s.data.fy1RevGrowth,
        fy2RevGrowth: s.data.fy2RevGrowth,
        qtrRevGrowthYoY: s.data.qtrRevGrowthYoY,
        stackRevGrowth: s.data.stackRevGrowth,
        psRatio: s.data.psRatio,
        forwardPS: s.data.forwardPS,
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
            <div style={{display:'flex',alignItems:'center',gap:6,position:'relative'}}>
              <div style={{position:'relative'}}>
                <input
                  className="inp"
                  placeholder="Search ticker or company name…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setCmpHighlight(h => Math.min(h + 1, cmpSearchRes.length - 1)); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setCmpHighlight(h => Math.max(h - 1, -1)); }
                    else if (e.key === 'Enter') {
                      e.preventDefault();
                      const typed = input.trim().toUpperCase();
                      if (cmpHighlight >= 0 && cmpSearchRes[cmpHighlight]) { addTicker(cmpSearchRes[cmpHighlight]); }
                      else {
                        const exact = cmpSearchRes.find(r => r.symbol?.toUpperCase() === typed);
                        if (exact) addTicker(exact);
                        else addTicker(typed); // always trust what the user typed
                      }
                    }
                    else if (e.key === 'Escape') { setCmpSearchRes([]); setCmpHighlight(-1); }
                  }}
                  onBlur={() => setTimeout(() => { setCmpSearchRes([]); setCmpHighlight(-1); }, 200)}
                  style={{width:240,padding:'6px 10px',fontSize:12}}
                />
                <TickerDropdown results={cmpSearchRes} searching={cmpSearching} highlightIdx={cmpHighlight}
                  onSelect={r => addTicker(r)} />
              </div>
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


        {/* ── Metrics Grid Table (1000xstocks style) ── */}
        {(() => {
          const loaded = stocksWithMetrics.filter(s => s.data && !s.loading);
          if (!loaded.length) return null;

          const fmtPct  = v => v == null ? '—' : (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%';
          const fmtX    = v => v == null ? '—' : v.toFixed(1) + 'x';
          const fmtRaw  = v => v == null ? '—' : v.toFixed(2);

          const colorPct = (v, good, bad, invert=false) => {
            if (v == null) return 'var(--text3)';
            const isGood = invert ? v <= good : v >= good;
            const isBad  = invert ? v >= bad  : v <= bad;
            if (isGood) return '#4aaec0';
            if (isBad)  return '#e06060';
            return '#d4c06a';
          };
          const colorX = (v, good, bad) => colorPct(v, good, bad, true);

          const SECTIONS = [
            {
              label: 'VALUATION',
              rows: [
                { label: 'TTM P/E',           key: 'peRatio',         fmt: fmtX,   color: v => colorX(v, 17, 35) },
                { label: 'Forward P/E (FY1)',  key: 'forwardPE',       fmt: fmtX,   color: v => colorX(v, 15, 28) },
                { label: '2Y Forward P/E',     key: 'forward2PE',      fmt: fmtX,   color: v => colorX(v, 12, 22) },
                { label: 'TTM P/S',            key: 'psRatio',         fmt: fmtX,   color: v => colorX(v, 3, 10) },
                { label: 'Forward P/S',        key: 'forwardPS',       fmt: fmtX,   color: v => colorX(v, 2, 8) },
                { label: 'PEG Ratio',          key: 'pegRatio',        fmt: fmtRaw, color: v => colorX(v, 1, 2.5) },
                { label: 'EV / EBITDA',        key: 'evEbitda',        fmt: fmtX,   color: v => colorX(v, 10, 25) },
              ]
            },
            {
              label: 'EPS GROWTH',
              rows: [
                { label: 'TTM EPS Growth',           key: 'ttmEpsGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'FY1 EPS Growth (est)',      key: 'fy1EpsGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'FY2 EPS Growth (est)',      key: 'fy2EpsGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'TTM vs NTM EPS Growth',     key: 'ntmEpsGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'Qtr EPS Growth YoY',        key: 'qtrEpsGrowthYoY', fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: '2Y Stacked EPS Growth',     key: 'stackEpsGrowth',  fmt: fmtPct, color: v => colorPct(v, 0.15, 0.00) },
              ]
            },
            {
              label: 'REVENUE GROWTH',
              rows: [
                { label: 'TTM Revenue Growth',        key: 'ttmRevGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'FY1 Rev Growth (est)',       key: 'fy1RevGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'FY2 Rev Growth (est)',       key: 'fy2RevGrowth',    fmt: fmtPct, color: v => colorPct(v, 0.10, -0.05) },
                { label: 'Qtr Revenue Growth YoY',    key: 'qtrRevGrowthYoY', fmt: fmtPct, color: v => colorPct(v, 0.08, -0.05) },
                { label: '2Y Stacked Rev Growth',     key: 'stackRevGrowth',  fmt: fmtPct, color: v => colorPct(v, 0.12, 0.00) },
              ]
            },
            {
              label: 'PROFITABILITY',
              rows: [
                { label: 'Gross Margin',        key: 'grossMargin', fmt: fmtPct, color: v => colorPct(v, 0.40, 0.15) },
                { label: 'Net Margin',          key: 'netMargin',   fmt: fmtPct, color: v => colorPct(v, 0.10, 0.03) },
                { label: 'Operating Margin',    key: 'opMargin',    fmt: fmtPct, color: v => colorPct(v, 0.15, 0.03) },
                { label: 'ROE',                 key: 'roe',         fmt: fmtPct, color: v => colorPct(v, 0.15, 0.08) },
                { label: 'ROIC',                key: 'roic',        fmt: fmtPct, color: v => colorPct(v, 0.10, 0.05) },
              ]
            },
          ];

          const colW = `${Math.floor(160 / Math.max(loaded.length, 1))}px`;

          return (
            <div className="card" style={{marginBottom: 14, overflow: 'hidden'}}>
              {/* Table header */}
              <div style={{display:'grid', gridTemplateColumns:`1fr ${loaded.map(()=>colW).join(' ')}`,
                borderBottom:'1px solid var(--border2)', background:'var(--surface2)'}}>
                <div style={{padding:'10px 16px'}}/>
                {loaded.map((s, i) => (
                  <div key={s.ticker} style={{padding:'10px 8px', textAlign:'center', borderLeft:'1px solid var(--border)'}}>
                    <div className="mono" style={{fontSize:12,fontWeight:700,color:COMPARE_COLORS[i]}}>{s.ticker}</div>
                    <div style={{fontSize:9,color:'var(--text3)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {s.data?.name?.split(' ').slice(0,2).join(' ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              {SECTIONS.map(section => (
                <div key={section.label}>
                  {/* Section header */}
                  <div style={{display:'grid', gridTemplateColumns:`1fr ${loaded.map(()=>colW).join(' ')}`,
                    background:'var(--surface)', borderTop:'1px solid var(--border2)'}}>
                    <div className="mono" style={{padding:'7px 16px', fontSize:9, letterSpacing:'0.12em', color:'var(--text3)'}}>
                      {section.label}
                    </div>
                    {loaded.map((_, i) => (
                      <div key={i} style={{borderLeft:'1px solid var(--border)'}}/>
                    ))}
                  </div>
                  {/* Metric rows */}
                  {section.rows.map((row, ri) => (
                    <div key={row.key} style={{display:'grid', gridTemplateColumns:`1fr ${loaded.map(()=>colW).join(' ')}`,
                      borderTop:'1px solid var(--border)',
                      background: ri % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent'}}>
                      <div style={{padding:'8px 16px', display:'flex', alignItems:'center'}}>
                        <span style={{fontSize:11, color:'var(--text2)'}}>{row.label}</span>
                      </div>
                      {loaded.map((s, i) => {
                        const v = s.data?.[row.key] ?? null;
                        return (
                          <div key={i} style={{padding:'8px 8px', textAlign:'center',
                            borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <span className="mono" style={{fontSize:12, fontWeight:600, color: row.color(v)}}>
                              {row.fmt(v)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

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

        {/* Health Score comparison */}
        <CompareSection title="HEALTH SCORE" icon="🏥">
          <div style={{padding:'6px 0 10px'}}>
            <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
              {stocksWithMetrics.map((s, i) => {
                const score = calcCanonicalHealthScore(s.data);
                return (
                  <div key={s.ticker} style={{display:'flex',flexDirection:'column',gap:6,minWidth:90}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span className="mono" style={{fontSize:10,color:COMPARE_COLORS[i],fontWeight:600}}>{s.ticker}</span>
                      {score!=null && <span className="mono" style={{fontSize:16,fontWeight:700,
                        color:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}}>
                        {score}<span style={{fontSize:9,color:'var(--text3)'}}>/100</span>
                      </span>}
                    </div>
                    {score!=null && (
                      <div style={{width:120,height:5,borderRadius:3,background:'var(--surface2)',overflow:'hidden'}}>
                        <div style={{height:'100%',width:score+'%',borderRadius:3,
                          background:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)',
                          boxShadow:`0 0 6px ${score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}60`}}/>
                      </div>
                    )}
                    {score==null && s.loading && <span className="mono shimmer" style={{fontSize:9,color:'var(--text3)'}}>Loading…</span>}
                    {score==null && !s.loading && <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>No data</span>}
                    {score!=null && (
                      <div style={{display:'flex',gap:3,flexWrap:'wrap',maxWidth:130}}>
                        {['Profit','Growth','Moat','Balance','Cash','Val'].map((dim,di) => {
                          const dimColors = (() => {
                            if (!s.data) return [];
                            const d = s.data;
                            const yrs = d.byYear?.slice(-3)||[];
                            const last=yrs[yrs.length-1]||{};
                            const prev=yrs[yrs.length-2]||{};
                            const prev2=yrs[yrs.length-3]||{};
                            const sector=(d.sector||'').toLowerCase();
                            const isTech=/tech|software|semi|information/i.test(sector);
                            const isFinance=/financ|bank|insurance|reit/i.test(sector);
                            const isRetail=/retail|consumer staple|grocery/i.test(sector);
                            const isEnergy=/energy|oil|gas|util/i.test(sector);
                            const nmGood=isTech?0.15:isRetail?0.04:isEnergy?0.06:0.08;
                            const nmOk=isTech?0.06:isRetail?0.01:isEnergy?0.02:0.03;
                            const deGood=isFinance?8:isTech?0.5:1;
                            const deOk=isFinance?15:isTech?1.5:2;
                            const profitS=[last.netMargin!=null?(last.netMargin>=nmGood?2:last.netMargin>=nmOk?1:0):null,last.roe!=null?(last.roe>=0.15?2:last.roe>=0.08?1:0):null,last.roic!=null?(last.roic>=0.10?2:last.roic>=0.05?1:0):null,last.grossMargin!=null?(last.grossMargin>=(isTech?0.50:isRetail?0.25:0.35)?2:last.grossMargin>=(isTech?0.30:isRetail?0.15:0.20)?1:0):null].filter(s=>s!==null);
                            const profitC=profitS.length?(profitS.reduce((a,b)=>a+b)/profitS.length>=1.5?'green':profitS.reduce((a,b)=>a+b)/profitS.length>=0.8?'gold':'red'):'gray';
                            const g=(last.revenue&&prev.revenue&&prev.revenue>0)?(last.revenue/prev.revenue-1):null;
                            const growthC=g==null?'gray':g>(isTech?0.15:0.07)?'green':g>(isTech?0.05:0.02)?'gold':'red';
                            const rvY=(last.revenue&&prev.revenue&&prev.revenue>0)?last.revenue/prev.revenue-1:null;
                            const rvP=(prev.revenue&&prev2.revenue&&prev2.revenue>0)?prev.revenue/prev2.revenue-1:null;
                            const gc=rvY!=null&&rvP!=null&&rvY>0&&rvP>0;
                            const moatS=[last.grossMargin!=null?(last.grossMargin>=(isTech?0.55:isRetail?0.30:0.40)?2:last.grossMargin>=(isTech?0.35:isRetail?0.15:0.25)?1:0):null,last.roic!=null?(last.roic>=0.15?2:last.roic>=0.08?1:0):null,last.roe!=null?(last.roe>=0.20?2:last.roe>=0.12?1:0):null,gc?2:(rvY!=null?(rvY>0?1:0):null)].filter(s=>s!==null);
                            const moatC=moatS.length<2?'gray':(moatS.reduce((a,b)=>a+b)/moatS.length>=1.6?'green':moatS.reduce((a,b)=>a+b)/moatS.length>=0.9?'gold':'red');
                            const de=last.debtEquity,cr=last.currentRatio;
                            const balS=[de!=null?(de<=deGood?2:de<=deOk?1:0):null,cr!=null?(cr>=2.0?2:cr>=1.0?1:0):null].filter(s=>s!==null);
                            const balC=balS.length?(balS.reduce((a,b)=>a+b)/balS.length>=1.5?'green':balS.reduce((a,b)=>a+b)/balS.length>=0.8?'gold':'red'):'gray';
                            const fcf=last.freeCashFlow,fcfR=(fcf&&last.revenue)?fcf/last.revenue:null;
                            const cashS=[fcf!=null?(fcf>0?(fcfR>=0.10?2:1):0):null,last.operatingCF!=null?(last.operatingCF>0?2:0):null].filter(s=>s!==null);
                            const cashC=cashS.length?(cashS.reduce((a,b)=>a+b)/cashS.length>=1.5?'green':cashS.reduce((a,b)=>a+b)/cashS.length>=0.8?'gold':'red'):'gray';
                            const peFair=isTech?30:isFinance?15:20;const peOk=isTech?45:isFinance?20:30;
                            const pe=d.peRatio,ev=d.evEbitda,peg=d.pegRatio;
                            const valS=[pe!=null?(pe<=peFair?2:pe<=peOk?1:0):null,ev!=null?(ev<=10?2:ev<=18?1:0):null,peg!=null?(peg<=1?2:peg<=2?1:0):null].filter(s=>s!==null);
                            const valC=valS.length?(valS.reduce((a,b)=>a+b)/valS.length>=1.5?'green':valS.reduce((a,b)=>a+b)/valS.length>=0.8?'gold':'red'):'gray';
                            return [profitC,growthC,moatC,balC,cashC,valC];
                          })();
                          const col = dimColors[di];
                          return (
                            <div key={dim} title={dim} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                              <div style={{width:8,height:8,borderRadius:'50%',
                                background:col==='green'?'var(--green)':col==='gold'?'var(--gold)':col==='red'?'var(--red)':'var(--surface2)',
                                border:col==='gray'?'1px solid var(--border)':'none'}}/>
                              <span className="mono" style={{fontSize:5,color:'var(--text3)'}}>{dim.slice(0,3).toUpperCase()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
            <WeightBar key={i} name={c.name} weight={c.weight} maxWeight={maxCountry} color='#5ab8cc'/>
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

function CryptoOverview({ pos }) {
  const [mkt, setMkt] = useState(null);
  const coinId = pos.coinId || pos.symbol?.toLowerCase();

  useEffect(() => {
    if (!coinId) return;
    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`)
      .then(r => r.json())
      .then(d => setMkt(d))
      .catch(() => {});
  }, [coinId]);

  const fmt = (v, decimals=2) => v == null ? '—' : '€' + Number(v).toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  const fmtB = v => {
    if (v == null) return '—';
    if (v >= 1e12) return '€' + (v/1e12).toFixed(2) + 'T';
    if (v >= 1e9)  return '€' + (v/1e9).toFixed(2) + 'B';
    if (v >= 1e6)  return '€' + (v/1e6).toFixed(1) + 'M';
    return '€' + v.toFixed(0);
  };
  const fmtPct = v => v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
  const pctColor = v => v == null ? 'var(--text2)' : v >= 0 ? 'var(--green)' : 'var(--red)';

  const md = mkt?.market_data;
  const ath = md?.ath?.eur;
  const athPct = md?.ath_change_percentage?.eur;
  const atl = md?.atl?.eur;
  const rank = mkt?.market_cap_rank;
  const supply = md?.circulating_supply;
  const maxSupply = md?.max_supply;
  const vol24h = md?.total_volume?.eur;
  const mktCap = md?.market_cap?.eur;
  const change7d = md?.price_change_percentage_7d;
  const change30d = md?.price_change_percentage_30d;
  const change1y = md?.price_change_percentage_1y;

  return (
    <div>
      {/* Market stats grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
        {[
          {l:'MARKET CAP', v: fmtB(mktCap)},
          {l:'24H VOLUME',  v: fmtB(vol24h)},
          {l:'CMC RANK',    v: rank ? '#' + rank : '—'},
          {l:'7D CHANGE',   v: fmtPct(change7d),  c: pctColor(change7d)},
          {l:'30D CHANGE',  v: fmtPct(change30d), c: pctColor(change30d)},
          {l:'1Y CHANGE',   v: fmtPct(change1y),  c: pctColor(change1y)},
          {l:'ALL-TIME HIGH', v: fmt(ath)},
          {l:'FROM ATH',    v: fmtPct(athPct),    c: pctColor(athPct)},
          {l:'ALL-TIME LOW', v: fmt(atl)},
        ].map(({l,v,c}) => (
          <div key={l} className="card" style={{padding:'14px 16px'}}>
            <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>{l}</div>
            <div className="mono" style={{fontSize:13,fontWeight:600,color:c||'var(--text)'}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Supply info */}
      {supply != null && (
        <div className="card" style={{padding:'14px 16px',marginBottom:16}}>
          <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>SUPPLY</div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontSize:12,color:'var(--text2)'}}>Circulating</span>
            <span className="mono" style={{fontSize:12}}>{Number(supply).toLocaleString('de-DE',{maximumFractionDigits:0})}</span>
          </div>
          {maxSupply && <>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:12,color:'var(--text2)'}}>Max supply</span>
              <span className="mono" style={{fontSize:12}}>{Number(maxSupply).toLocaleString('de-DE',{maximumFractionDigits:0})}</span>
            </div>
            <div style={{background:'var(--surface2)',borderRadius:4,height:6,overflow:'hidden'}}>
              <div style={{height:'100%',background:'var(--green)',borderRadius:4,width:`${Math.min(100,(supply/maxSupply)*100).toFixed(1)}%`}}/>
            </div>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',marginTop:4,textAlign:'right'}}>
              {((supply/maxSupply)*100).toFixed(1)}% mined
            </div>
          </>}
        </div>
      )}

      {/* Description */}
      {mkt?.description?.en && (
        <div className="card" style={{padding:'14px 16px'}}>
          <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>ABOUT</div>
          <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.6}}>
            {mkt.description.en.replace(/<[^>]+>/g,'').slice(0, 400)}{mkt.description.en.length > 400 ? '…' : ''}
          </div>
        </div>
      )}

      {!mkt && coinId && (
        <div className="card" style={{padding:24,textAlign:'center'}}>
          <span className="mono shimmer" style={{fontSize:12,color:'var(--text3)'}}>⟳ Loading market data…</span>
        </div>
      )}
      {!coinId && (
        <div className="card" style={{padding:24,color:'var(--text3)',fontSize:12,textAlign:'center'}}>
          No CoinGecko ID set for this position. Add coinId to enable market data.
        </div>
      )}
    </div>
  );
}

function StockDetail({ pos, onBack, transactions, onTransfer, setManualResolvePos }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [tab, setTab]       = useState('overview');
  const [finPeriod, setFinPeriod] = useState('quarterly');

  const ticker = pos.fmpTicker || ISIN_MAP[pos.isin] || pos.symbol;

  useEffect(() => {
    if (pos.type === 'etf' || pos.type === 'crypto') { setData({}); setLoading(false); return; }
    setLoading(true); setError(null); setData(null);

    // If ticker is still a raw ISIN, resolve it first via FMP search-isin
    const resolveAndFetch = async () => {
      let baseTicker = ticker.split('.')[0];
      if (isISIN(baseTicker)) {
        try {
          const res = await fetch('/api/fmp?path=' + encodeURIComponent('/search-isin?isin=' + baseTicker));
          const results = await res.json();
          if (Array.isArray(results) && results.length) {
            const isUSIsin = baseTicker.startsWith('US');
            let pick;
            if (isUSIsin) {
              pick = results.filter(r=>!r.symbol?.includes('.')).sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0]
                || results.sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0] || results[0];
            } else {
              pick = results.find(r=>r.symbol?.endsWith('.DE'))
                || results.find(r=>r.symbol?.endsWith('.F'))
                || results.sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0] || results[0];
            }
            if (pick?.symbol) baseTicker = pick.symbol.split('.')[0];
          }
        } catch(e) { /* fallback to raw ticker */ }
      }
      const resp = await fetch('/api/fundamentals?symbol=' + baseTicker);
      const d = await resp.json();
      if (d.error) throw new Error(d.error);
      return d;
    };

    resolveAndFetch()
      .then(d => setData(d))
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
  const SCORE_COLOR = { green:'#4aaec0', gold:'#d4c06a', red:'#e06060', gray:'#3d5060' };
  const SCORE_BG    = { green:'rgba(58,154,181,0.08)', gold:'rgba(184,160,76,0.08)', red:'rgba(224,96,96,0.08)', gray:'rgba(61,79,94,0.08)' };
  const SCORE_LABEL = { green:'STRONG', gold:'OK', red:'WEAK', gray:'N/A' };

  // ── Sector-adjusted thresholds (Damodaran NYU Stern sector averages) ──────
  const sector = (data?.sector || '').toLowerCase();
  const isTech     = /tech|software|semiconductor|information/i.test(sector);
  const isFinance  = /financ|bank|insurance|reit/i.test(sector);
  const isRetail   = /retail|consumer staple|grocery/i.test(sector);
  const isEnergy   = /energy|oil|gas|util/i.test(sector);
  const isHealth   = /health|pharma|biotech|medical/i.test(sector);

  // Net margin thresholds: tech ~20%+ strong, retail ~3%+ ok (Damodaran medians)
  const nmGood = isTech ? 0.15 : isFinance ? 0.20 : isRetail ? 0.04 : isEnergy ? 0.08 : isHealth ? 0.12 : 0.10;
  const nmOk   = isTech ? 0.05 : isFinance ? 0.08 : isRetail ? 0.01 : isEnergy ? 0.03 : isHealth ? 0.03 : 0.03;
  // Revenue growth: tech expects more, utilities less
  const growthGood = isTech ? 0.10 : isFinance ? 0.05 : isRetail ? 0.03 : isEnergy ? 0.05 : 0.05;
  const growthOk   = isTech ? 0.02 : isFinance ? 0.00 : isRetail ? 0.00 : isEnergy ? 0.00 : 0.00;
  // D/E: utilities/banks carry more structural debt
  const deGood = isFinance ? 8 : isEnergy || isRetail ? 1.5 : 1.0;
  const deOk   = isFinance ? 15 : isEnergy || isRetail ? 3.0 : 2.0;

  const grade    = (val, good, ok) => val==null?'gray': val>=good?'green': val>=ok?'gold':'red';
  const gradeInv = (val, good, ok) => val==null?'gray': val<=good?'green': val<=ok?'gold':'red';
  const trendGrade = (cur, prv) => {
    if (cur==null||prv==null||prv===0) return 'gray';
    const g = cur/prv - 1;
    return g > growthGood ? 'green' : g > growthOk ? 'gold' : 'red';
  };

  const profitColor = (() => {
    const scores = [
      last.netMargin  != null ? (last.netMargin  >= nmGood ? 2 : last.netMargin  >= nmOk  ? 1 : 0) : null,
      last.roe        != null ? (last.roe        >= 0.15   ? 2 : last.roe        >= 0.08  ? 1 : 0) : null,
      last.roic       != null ? (last.roic       >= 0.10   ? 2 : last.roic       >= 0.05  ? 1 : 0) : null,
      last.grossMargin!= null ? (last.grossMargin>= (isTech?0.50:isRetail?0.25:0.35) ? 2
                                  : last.grossMargin>=(isTech?0.30:isRetail?0.15:0.20) ? 1 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();

  const balanceColor = (() => {
    const de = last.debtEquity;
    const cr = last.currentRatio;
    const scores = [
      de != null ? (de <= deGood ? 2 : de <= deOk ? 1 : 0) : null,
      cr != null ? (cr >= 2.0 ? 2 : cr >= 1.0 ? 1 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();

  const peRatio  = data?.peRatio;
  const evEbitda = data?.evEbitda ?? last.evEbitda;
  const pegRatio = data?.pegRatio;
  // Sector-adjusted P/E: tech trades at premium (Damodaran avg ~30x), value sectors ~15x
  const peFair = isTech ? 30 : isHealth ? 22 : isFinance ? 15 : 20;
  const peOk   = isTech ? 45 : isHealth ? 35 : isFinance ? 20 : 30;
  const valuationColor = (() => {
    const scores = [
      peRatio  != null ? (peRatio  <= peFair ? 2 : peRatio  <= peOk   ? 1 : 0) : null,
      evEbitda != null ? (evEbitda <= 10     ? 2 : evEbitda <= 18     ? 1 : 0) : null,
      pegRatio != null ? (pegRatio <=  1     ? 2 : pegRatio <=  2     ? 1 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();
  const pegColor = pegRatio == null ? 'var(--text2)'
    : pegRatio <= 1 ? '#4aaec0' : pegRatio <= 2 ? '#d4c06a' : '#e06060';

  // ── Economic Moat (proxy scoring — no AI yet) ─────────────────────────────
  // Based on Buffett/Morningstar framework: wide moat = durable competitive advantage
  // Proxy signals: high+stable gross margin (pricing power), high ROIC (capital efficiency),
  //               consistent ROE (brand/switching costs), revenue growth consistency
  const moatColor = (() => {
    const gm    = last.grossMargin;
    const roic  = last.roic;
    const roe   = last.roe;
    const revGrowthYoy = (last.revenue && prev.revenue && prev.revenue>0)
      ? last.revenue/prev.revenue - 1 : null;
    const prev2 = yrs[yrs.length - 3] || {};
    const revGrowthPrev = (prev.revenue && prev2.revenue && prev2.revenue>0)
      ? prev.revenue/prev2.revenue - 1 : null;
    const growthConsistent = revGrowthYoy != null && revGrowthPrev != null
      && revGrowthYoy > 0 && revGrowthPrev > 0;

    const scores = [
      // High gross margin = pricing power / brand moat
      gm   != null ? (gm   >= (isTech?0.55:isRetail?0.30:0.40) ? 2
                       : gm >= (isTech?0.35:isRetail?0.15:0.25) ? 1 : 0) : null,
      // High ROIC = capital allocation moat (Buffett standard: >15% wide moat)
      roic != null ? (roic >= 0.15 ? 2 : roic >= 0.08 ? 1 : 0) : null,
      // Sustained ROE = brand/switching cost moat
      roe  != null ? (roe  >= 0.20 ? 2 : roe  >= 0.12 ? 1 : 0) : null,
      // Consistent revenue growth = durable demand
      growthConsistent ? 2 : (revGrowthYoy != null ? (revGrowthYoy > 0 ? 1 : 0) : null),
    ].filter(s => s !== null);
    if (scores.length < 2) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.6 ? 'green' : avg >= 0.9 ? 'gold' : 'red';
  })();
  const moatLabel = { green:'WIDE', gold:'NARROW', red:'NONE', gray:'N/A' };
  const moatNote  = { green:'Strong durable advantage', gold:'Some competitive edge', red:'Limited differentiation', gray:'Insufficient data' };

  // ── Cash Generation color ──────────────────────────────────────────────────
  const cashColor = (() => {
    const fcf = last.freeCashFlow;
    const fcfRev = (fcf && last.revenue) ? fcf/last.revenue : null;
    const scores = [
      fcf    != null ? (fcf > 0 ? (fcfRev >= 0.10 ? 2 : 1) : 0) : null,
      last.operatingCF != null ? (last.operatingCF > 0 ? 2 : 0) : null,
    ].filter(s => s !== null);
    if (!scores.length) return 'gray';
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
    return avg >= 1.5 ? 'green' : avg >= 0.8 ? 'gold' : 'red';
  })();

  const scorecard = [
    { label:'Profitability',   icon:'💰', color: profitColor,
      metrics: [
        { l:'Gross Margin',    v: fmtPct(last.grossMargin) },
        { l:'Operating Margin',v: fmtPct(last.operatingMargin) },
        { l:'Net Margin',      v: fmtPct(last.netMargin) },
        { l:'ROE',             v: fmtPct(last.roe) },
        { l:'ROIC',            v: fmtPct(last.roic) },
      ]
    },
    { label:'Growth',          icon:'📈', color: trendGrade(last.revenue, prev.revenue),
      metrics: [
        { l:'Revenue',         v: fmtB(last.revenue) },
        { l:'YoY Growth',      v: last.revenue&&prev.revenue ? ((last.revenue/prev.revenue-1)*100).toFixed(1)+'%' : '—' },
        { l:'Gross Profit',    v: fmtB(last.grossProfit) },
        { l:'EBITDA',          v: fmtB(last.ebitda) },
        { l:'EPS',             v: fmtN(last.eps) },
      ]
    },
    { label:'Economic Moat',   icon:'🏰', color: moatColor,
      moatLabel: moatLabel[moatColor],
      metrics: [
        { l:'Gross Margin',    v: fmtPct(last.grossMargin) },
        { l:'ROIC',            v: fmtPct(last.roic) },
        { l:'ROE',             v: fmtPct(last.roe) },
        { l:'Rev. Consistency',v: (last.revenue&&prev.revenue&&prev.revenue>0) ? (last.revenue>prev.revenue?'Growing':'Declining') : '—' },
        { l:'Assessment',      v: moatNote[moatColor], note:true },
      ]
    },
    { label:'Balance Sheet',   icon:'🏛', color: balanceColor,
      metrics: [
        { l:'Total Debt',      v: fmtB(last.totalDebt) },
        { l:'Cash',            v: fmtB(last.cashAndEquiv) },
        { l:'Equity',          v: fmtB(last.equity) },
        { l:'Debt / Equity',   v: last.debtEquity!=null ? last.debtEquity.toFixed(2)+'x' : '—' },
        { l:'Current Ratio',   v: last.currentRatio!=null ? last.currentRatio.toFixed(2)+'x' : '—' },
      ]
    },
    { label:'Cash Generation', icon:'💵', color: cashColor,
      metrics: [
        { l:'Operating CF',    v: fmtB(last.operatingCF) },
        { l:'CapEx',           v: fmtB(last.capex) },
        { l:'Free Cash Flow',  v: fmtB(last.freeCashFlow) },
        { l:'FCF Yield',       v: fmtPct(last.fcfYield) },
        { l:'FCF / Revenue',   v: last.freeCashFlow&&last.revenue ? fmtPct(last.freeCashFlow/last.revenue) : '—' },
      ]
    },
    { label:'Valuation',       icon:'🎯', color: valuationColor,
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

  // ── Overall health score ───────────────────────────────────────────────────
  const colorScore = { green:2, gold:1, red:0, gray:null };
  const scoreDims = scorecard.map(s => colorScore[s.color]).filter(v => v !== null);
  const overallScore = scoreDims.length
    ? Math.round(scoreDims.reduce((a,b)=>a+b,0) / scoreDims.length * 50) : null; // 0-100
  const overallColor = overallScore == null ? 'gray'
    : overallScore >= 70 ? 'green' : overallScore >= 40 ? 'gold' : 'red';
  const overallLabel = overallScore == null ? 'No Data'
    : overallScore >= 70 ? 'Healthy' : overallScore >= 40 ? 'Mixed' : 'Weak';

  // ── Mini bar chart ──
  // Uses baseline from min value so small changes are visible between adjacent bars
  function BarChart({ data: bdata, getVal, color='#4aaec0', fmtFn=fmtB, labelKey }) {
    const vals = bdata.map(getVal).filter(v=>v!=null);
    const getXLabel = yr => labelKey ? labelKey(yr) : (yr.year?.slice(-2) ?? '');
    if (!vals.length) return <div style={{height:90,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:9,color:'var(--text3)'}}>—</span></div>;
    const hasNeg = vals.some(v=>v<0);
    const CHART_H = 72;
    // For all-positive data: use min-anchored baseline so small differences are visible
    // For mixed data: use zero baseline
    const minV = hasNeg ? 0 : Math.min(...vals);
    const maxV = Math.max(...vals.map(Math.abs), Math.abs(minV), 1);
    const range2 = hasNeg ? maxV * 2 : (maxV - minV * 0.8) || 1;
    return (
      <div style={{display:'flex', alignItems:'flex-end', gap:3, height:90}}>
        {bdata.map((yr, i) => {
          const v = getVal(yr);
          const isLast = i === bdata.length - 1;
          const isLatest = isLast;
          const prevV = i > 0 ? getVal(bdata[i-1]) : null;
          const trending = v != null && prevV != null ? (v > prevV ? 'up' : v < prevV ? 'down' : 'flat') : null;
          let h;
          if (v == null) { h = 2; }
          else if (hasNeg) { h = Math.max(Math.abs(v)/maxV*CHART_H, 3); }
          else { h = Math.max((v - minV * 0.8) / range2 * CHART_H, 4); }
          const col = v==null ? 'var(--border)' : v<0 ? 'var(--red)' : color;
          const opacity = isLatest ? 1 : 0.5 + (i / bdata.length) * 0.4;
          return (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,minWidth:0}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
                <div className="mono" style={{fontSize:6,color:isLatest?'var(--text2)':'var(--text3)',textAlign:'center',lineHeight:1.2,overflow:'hidden',whiteSpace:'nowrap',width:'100%',textOverflow:'ellipsis',fontWeight:isLatest?600:400}}>
                  {v==null?'—':fmtFn(v)}
                </div>
                {trending && <span style={{fontSize:5,color:trending==='up'?'var(--green)':trending==='down'?'var(--red)':'var(--text3)',lineHeight:1}}>{trending==='up'?'▲':trending==='down'?'▼':'–'}</span>}
              </div>
              <div style={{width:'100%',flex:1,display:'flex',alignItems:'flex-end'}}>
                <div style={{width:'100%',height:h,background:col,borderRadius:'2px 2px 0 0',opacity,
                  boxShadow:isLatest?`0 0 6px ${col}60`:undefined,minHeight:3,transition:'height 0.2s'}}/>
              </div>
              <div className="mono" style={{fontSize:6,color:isLatest?'var(--text2)':'var(--text3)',overflow:'hidden',whiteSpace:'nowrap',width:'100%',textAlign:'center'}}>{getXLabel(yr)}</div>
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
            <span className="mono" style={{fontSize:13,color:'var(--text3)',display:'inline-flex',alignItems:'center',gap:4}}>
              {ticker}
              {pos.type !== 'crypto' && setManualResolvePos && (
                <span title="Change ticker mapping" onClick={() => setManualResolvePos(pos)}
                  style={{cursor:'pointer',fontSize:12,opacity:0.5,transition:'opacity 0.15s'}}
                  onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0.5}>
                  ✏️
                </span>
              )}
            </span>
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

      {/* ── Transfer actions (crypto only) ── */}
      {pos.type === 'crypto' && onTransfer && (
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {!pos.walletId && (
            <button className="btn btn-ghost" style={{fontSize:11,padding:'5px 14px'}}
              onClick={() => onTransfer({ direction: 'to_cold', pos })}>
              🔒 Transfer to Cold Wallet
            </button>
          )}
          {pos.walletId && (
            <button className="btn btn-ghost" style={{fontSize:11,padding:'5px 14px'}}
              onClick={() => onTransfer({ direction: 'from_cold', pos })}>
              ↩ Transfer to Exchange
            </button>
          )}
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{display:'flex',gap:6,marginBottom:20}}>
        {(pos.type === 'crypto'
          ? [['overview','Overview'],['charts','Charts'],['transactions','Transactions']]
          : [['overview','Overview'],['charts','Charts'],['financials','Financials'],['ratios','Ratios'],['transactions','Transactions']]
        ).map(([id,label])=>(
          <button key={id} className="btn" onClick={()=>setTab(id)}
            style={{fontSize:11,padding:'5px 14px',
              ...(tab===id?{background:'var(--green-dim)',color:'var(--green)',borderColor:'rgba(58,154,181,0.3)'}:{})}}>
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
          {/* Crypto: show market data instead of fundamentals */}
          {pos.type === 'crypto' ? (
            <CryptoOverview pos={pos} />
          ) : pos.type === 'etf' ? (
            <EtfOverview pos={pos} />
          ) : (<>
          {/* ── Possible Deal badge ── */}
          {(() => {
            const dp = data?.currentPrice;
            const avg50 = data?.priceAvg50;
            const high  = data?.yearHigh;
            const priceTrendDown = dp != null
              && (avg50 != null && dp < avg50)
              && (high  != null && dp < high * 0.80);
            const fundStrong = overallScore != null && overallScore >= 55
              && isFundamentallyImproving({ byYear: data?.byYear, ttmRevGrowth: data?.ttmRevGrowth, ttmEpsGrowth: data?.ttmEpsGrowth, fy1RevGrowth: data?.fy1RevGrowth, fy1EpsGrowth: data?.fy1EpsGrowth });
            if (!priceTrendDown || !fundStrong) return null;
            return (
              <div className="card" style={{padding:'14px 18px',marginBottom:12,
                borderColor:'rgba(58,154,181,0.3)',background:'rgba(58,154,181,0.06)',
                display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>🎯</span>
                <div>
                  <div className="mono" style={{fontSize:11,fontWeight:700,color:'var(--green)',
                    letterSpacing:'0.08em',marginBottom:3}}>POSSIBLE DEAL</div>
                  <div style={{fontSize:11,color:'var(--text2)',lineHeight:1.5}}>
                    Fundamentals trending up while the stock is{' '}
                    <span className="mono" style={{color:'var(--gold)'}}>
                      {high ? Math.round((1 - dp/high)*100) : '—'}% below its 52w high
                    </span>
                    {avg50 ? <> and trading below its 50-day MA (${avg50.toFixed(2)})</> : ''}.
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Overall Health Score ── */}
          {overallScore != null && (
            <div className="card" style={{padding:'14px 18px',marginBottom:12,
              borderColor:SCORE_COLOR[overallColor]+'44',background:SCORE_BG[overallColor]}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:14}}>⚡</span>
                  <span className="mono" style={{fontSize:9,letterSpacing:'0.12em',color:'var(--text3)'}}>OVERALL HEALTH</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="mono" style={{fontSize:9,letterSpacing:'0.1em',color:'var(--text3)'}}>
                    {data?.sector && `${data.sector} · sector-adjusted`}
                  </span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',
                    color:SCORE_COLOR[overallColor],background:SCORE_COLOR[overallColor]+'22',
                    padding:'3px 10px',borderRadius:5}}>{overallLabel.toUpperCase()}</span>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{flex:1,height:6,background:'var(--surface2)',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${overallScore}%`,
                    background:SCORE_COLOR[overallColor],borderRadius:3,
                    transition:'width 0.6s ease'}}/>
                </div>
                <span className="mono" style={{fontSize:13,fontWeight:700,color:SCORE_COLOR[overallColor],minWidth:46,textAlign:'right'}}>
                  {overallScore}<span style={{fontSize:9,opacity:0.7,color:'var(--text3)'}}>/100</span>
                </span>
              </div>
              {/* Dimension pills */}
              <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>
                {scorecard.map(sc => (
                  <div key={sc.label} style={{display:'flex',alignItems:'center',gap:4,
                    background:SCORE_COLOR[sc.color]+'18',border:`1px solid ${SCORE_COLOR[sc.color]}33`,
                    borderRadius:5,padding:'3px 8px'}}>
                    <span style={{fontSize:10}}>{sc.icon}</span>
                    <span className="mono" style={{fontSize:8,color:SCORE_COLOR[sc.color],letterSpacing:'0.05em'}}>
                      {sc.label==='Valuation'?(sc.color==='green'?'CHEAP':sc.color==='gold'?'FAIR':sc.color==='red'?'EXPENSIVE':'N/A')
                        :sc.label==='Economic Moat'?(sc.moatLabel||SCORE_LABEL[sc.color])
                        :SCORE_LABEL[sc.color]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scorecard grid — 2 cols, 3 rows */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:12}}>
            {scorecard.slice(0,6).filter(sc=>sc.label!=='Valuation').map(sc => (
              <div key={sc.label} className="card" style={{padding:16,borderColor:SCORE_COLOR[sc.color]+'33',background:SCORE_BG[sc.color]}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:15}}>{sc.icon}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{sc.label}</span>
                  </div>
                  <span className="mono" style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',
                    color:SCORE_COLOR[sc.color],background:SCORE_COLOR[sc.color]+'22',padding:'2px 8px',borderRadius:4}}>
                    {sc.label==='Economic Moat' ? (sc.moatLabel||SCORE_LABEL[sc.color]) : SCORE_LABEL[sc.color]}
                  </span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {sc.metrics.map(m=>(
                    <div key={m.l} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:4}}>
                      <span style={{fontSize:11,color:'var(--text2)',flexShrink:0}}>{m.l}</span>
                      <div style={{textAlign:'right',maxWidth:'60%'}}>
                        <span className="mono" style={{fontSize:11,fontWeight:500,color:m.color||'var(--text)',
                          wordBreak:'break-word'}}>{m.v}</span>
                        {m.note && typeof m.note === 'string' && <div className="mono" style={{fontSize:8,color:'var(--text3)',marginTop:1}}>{m.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Valuation card full width */}
          {(() => { const sc = scorecard.find(s=>s.label==='Valuation'); if(!sc) return null; return (
            <div className="card" style={{padding:16,borderColor:SCORE_COLOR[sc.color]+'33',background:SCORE_BG[sc.color],marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:15}}>{sc.icon}</span>
                  <span style={{fontSize:13,fontWeight:500}}>{sc.label}</span>
                </div>
                <span className="mono" style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',
                  color:SCORE_COLOR[sc.color],background:SCORE_COLOR[sc.color]+'22',padding:'2px 8px',borderRadius:4}}>
                  {sc.color==='green'?'CHEAP':sc.color==='gold'?'FAIR':sc.color==='red'?'EXPENSIVE':'N/A'}
                </span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12}}>
                {sc.metrics.map(m=>(
                  <div key={m.l} style={{textAlign:'center'}}>
                    <div className="mono" style={{fontSize:15,fontWeight:600,marginBottom:3,color:m.color||'inherit'}}>{m.v}</div>
                    <div className="mono" style={{fontSize:9,color:'var(--text3)'}}>{m.l}</div>
                    {m.note && <div className="mono" style={{fontSize:7,color:'var(--text3)',marginTop:2}}>{m.note}</div>}
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
          </>)}  {/* end stock scorecard */}
          )}  {/* end crypto/etf/stock branch */}
        </>)}

        {/* ══ CHARTS TAB ══ */}
        {tab==='charts' && (() => {
          const chartTicker = (pos.fmpTicker?.split('.')[0]) || ISIN_MAP[pos.isin] || pos.symbol?.split('.')[0];
          const txs = (transactions||[])
            .filter(t => t.isin === pos.isin)
            .sort((a,b) => a.date.localeCompare(b.date));
          return (
            <div className="fu2">
              {/* Full TradingView chart with candlestick + range controls */}
              {chartTicker && !isISIN(chartTicker) && (
                <TVChart ticker={chartTicker} txs={txs} currentPrice={pos.currentPrice} compact={false}/>
              )}
              {(!chartTicker || isISIN(chartTicker)) && (
                <div className="card" style={{padding:40,textAlign:'center',color:'var(--text3)',fontSize:13}}>
                  Chart unavailable — ticker not yet resolved.
                </div>
              )}
              {/* Mini key stats below chart */}
              {data && yrs.length > 0 && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                  {[
                    {l:'52W HIGH',  v: (() => { const v=data?.yearHigh; return v?`$${v.toFixed(2)}`:'—'; })()},
                    {l:'52W LOW',   v: (() => { const v=data?.yearLow;  return v?`$${v.toFixed(2)}`:'—'; })()},
                    {l:'BETA',      v: data?.beta!=null?data.beta.toFixed(2)+'x':'—'},
                    {l:'MKT CAP',   v: (() => { const v=data?.marketCap; if(!v)return'—'; return v>=1e12?(v/1e12).toFixed(1)+'T':v>=1e9?(v/1e9).toFixed(1)+'B':(v/1e6).toFixed(0)+'M'; })()},
                  ].map(({l,v})=>(
                    <div key={l} className="card" style={{padding:'12px 14px'}}>
                      <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:4}}>{l}</div>
                      <div className="mono" style={{fontSize:13,fontWeight:600}}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ══ FINANCIALS TAB ══ */}
        {tab==='financials' && yrs.length>0 && (()=>{
          const qtrs = data?.byQuarter || [];
          const finData = finPeriod === 'quarterly' && qtrs.length ? qtrs : yrs;
          const getLabel = y => finPeriod === 'quarterly' && qtrs.length ? (y.label ?? y.year) : y.year;
          return (<>
            {/* Period toggle */}
            <div style={{display:'flex',gap:6,marginBottom:12}}>
              {['quarterly','annual'].map(p=>(
                <button key={p} onClick={()=>setFinPeriod(p)}
                  className="mono"
                  style={{fontSize:9,letterSpacing:'0.1em',padding:'5px 12px',borderRadius:6,cursor:'pointer',
                    border:'1px solid var(--border)',
                    background: finPeriod===p ? 'var(--green)' : 'var(--surface2)',
                    color: finPeriod===p ? '#000' : 'var(--text2)'}}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12,marginBottom:12}}>
              {[
                {label:'REVENUE',         getVal:y=>y.revenue,        color:'#5ab8cc'},
                {label:'GROSS PROFIT',    getVal:y=>y.grossProfit,    color:'#4aaec0'},
                {label:'OPERATING INCOME',getVal:y=>y.operatingIncome,color:'#a78bfa'},
                {label:'NET INCOME',      getVal:y=>y.netIncome,      color:'#4aaec0'},
                {label:'EPS',             getVal:y=>y.eps,            color:'#d4c06a', fmtFn:v=>v==null?'—':v.toFixed(2)},
                {label:'EBITDA',          getVal:y=>y.ebitda,         color:'#5ab8cc'},
              ].map(({label,getVal,color,fmtFn})=>(
                <div key={label} className="card" style={{padding:14}}>
                  <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:10}}>{label}</div>
                  <BarChart data={finData} getVal={getVal} color={color} fmtFn={fmtFn||fmtB} labelKey={getLabel}/>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12,marginBottom:12}}>
              {[
                {label:'OPERATING CASH FLOW', getVal:y=>y.operatingCF,  color:'#5ab8cc'},
                {label:'FREE CASH FLOW',      getVal:y=>y.freeCashFlow, color:'#d4c06a'},
                {label:'CAPEX',               getVal:y=>y.capex,        color:'#e06060'},
                ...(finPeriod==='annual' ? [{label:'TOTAL DEBT', getVal:y=>y.totalDebt, color:'#e06060'}] : []),
              ].map(({label,getVal,color})=>(
                <div key={label} className="card" style={{padding:14}}>
                  <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:10}}>{label}</div>
                  <BarChart data={finData} getVal={getVal} color={color} labelKey={getLabel}/>
                </div>
              ))}
            </div>
            {/* Margins */}
            <div className="card" style={{padding:14}}>
              <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:12}}>MARGIN TRENDS</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
                {[
                  {label:'GROSS MARGIN',    getVal:y=>y.grossMargin,    color:'#5ab8cc'},
                  {label:'OPERATING MARGIN',getVal:y=>y.operatingMargin,color:'#a78bfa'},
                  {label:'NET MARGIN',      getVal:y=>y.netMargin,      color:'#4aaec0'},
                ].map(({label,getVal,color})=>(
                  <div key={label}>
                    <div className="mono" style={{fontSize:8,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:8}}>{label}</div>
                    <BarChart data={finData} getVal={getVal} color={color} fmtFn={fmtPct} labelKey={getLabel}/>
                  </div>
                ))}
              </div>
            </div>
          </>);
        })()}

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
                {label:'TOTAL ASSETS', getVal:y=>y.totalAssets, color:'#5ab8cc'},
                {label:'EQUITY',       getVal:y=>y.equity,      color:'#4aaec0'},
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
            .filter(t => {
              const sym = (t.symbol||'').toUpperCase();
              const posSym = (pos.symbol||'').toUpperCase();
              // For crypto: match by symbol (isin is null for all crypto txs)
              if (pos.type === 'crypto') return sym === posSym;
              // For stocks/ETFs: match by isin when available, fall back to symbol
              if (pos.isin && t.isin) return t.isin === pos.isin;
              if (pos.isin && !t.isin) return sym === posSym;
              return sym === posSym;
            })
            .sort((a,b) => (b.date||'').localeCompare(a.date||''));

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
              {ticker && <TxPriceChart ticker={ticker.split('.')[0]} txs={txs} currentPrice={pos.currentPrice}/>}

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
                <div style={{display:'grid',gridTemplateColumns:'110px 1fr 1fr 1fr',
                  padding:'8px 16px',background:'var(--surface2)',borderBottom:'1px solid var(--border)'}}>
                  {['DATE','DETAILS','AMOUNT','P&L'].map(h=>(
                    <div key={h} className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',
                      textAlign: h==='DATE'?'left':'right'}}>{h}</div>
                  ))}
                </div>

                {txs.map((tx, i) => {
                  const isBuy      = tx.type === 'buy';
                  const isSell     = tx.type === 'sell';
                  const isTransOut = tx.type === 'transfer_out';
                  const isTransIn  = tx.type === 'transfer_in';
                  const isTransfer = isTransOut || isTransIn;
                  const pricePerShare = tx.qty > 0 ? (tx.amountEur || 0) / tx.qty : 0;
                  // P&L: only meaningful for buys/sells
                  const pnl = isBuy
                    ? (pos.currentPrice - pricePerShare) * tx.qty
                    : isSell
                      ? (pricePerShare - pos.avgPrice) * tx.qty
                      : null;
                  const pnlPct = (isBuy || isSell) && pricePerShare > 0
                    ? ((isBuy ? pos.currentPrice : pricePerShare) / pricePerShare - 1) * 100 * (isBuy ? 1 : -1) * (isBuy ? 1 : -1)
                    : null;
                  const pnlUp = pnl >= 0;

                  // Badge config per type
                  const badge = isBuy      ? { label: 'BUY',         bg: 'rgba(58,154,181,0.12)',  color: 'var(--green)' }
                              : isSell     ? { label: 'SELL',        bg: 'rgba(224,96,96,0.12)', color: 'var(--red)'   }
                              : isTransOut ? { label: 'TRANSFER OUT',bg: 'rgba(255,180,50,0.12)', color: '#d4c06a'      }
                              : isTransIn  ? { label: 'TRANSFER IN', bg: 'rgba(42,117,141,0.12)', color: 'var(--blue)'  }
                              :              { label: tx.type?.toUpperCase() || '—', bg: 'rgba(120,120,120,0.12)', color: 'var(--text3)' };

                  return (
                    <div key={i} style={{
                      display:'grid', gridTemplateColumns:'110px 1fr 1fr 1fr',
                      padding:'12px 16px', borderBottom: i<txs.length-1?'1px solid var(--border)':'none',
                      alignItems:'center',
                    }}>
                      {/* Date + type badge */}
                      <div>
                        <div style={{marginBottom:4}}>
                          <span style={{
                            fontSize:9, fontWeight:700, letterSpacing:'0.06em',
                            padding:'2px 7px', borderRadius:4,
                            background: badge.bg, color: badge.color,
                          }}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>{tx.date}</div>
                        {tx.note && <div className="mono" style={{fontSize:9,color:'var(--text3)',marginTop:2,fontStyle:'italic'}}>{tx.note}</div>}
                      </div>

                      {/* Qty × price */}
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:13,fontWeight:500}}>
                          {tx.qty % 1 === 0 ? tx.qty : tx.qty?.toFixed(4)} {isTransfer ? pos.symbol : ('× ' + fmtE(pricePerShare))}
                        </div>
                        {tx.fee > 0 && (
                          <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>fee: {fmtE(tx.fee)}</div>
                        )}
                      </div>

                      {/* Total amount */}
                      <div style={{textAlign:'right'}}>
                        <div className="mono" style={{fontSize:13,fontWeight:500}}>
                          {isTransfer ? '—' : fmtE(tx.amountEur)}
                        </div>
                      </div>

                      {/* P&L */}
                      <div style={{textAlign:'right'}}>
                        {pnl !== null ? (
                          <>
                            <div className="mono" style={{fontSize:13,fontWeight:600,
                              color: pnlUp?'var(--green)':'var(--red)'}}>
                              {pnlUp?'+':''}{fmtE(pnl)}
                            </div>
                            <div className="mono" style={{fontSize:10,
                              color: pnlUp?'var(--green)':'var(--red)'}}>
                              {isBuy ? 'unrealised' : 'realised'}
                            </div>
                          </>
                        ) : (
                          <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>—</div>
                        )}
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



// ════════════════════════════════════════════════════════════════════════════
// PortfolioPage — rich portfolio view with scorecards, CAGR, analysis charts
// ════════════════════════════════════════════════════════════════════════════
const EU_INFLATION = 2.6; // ECB target / recent avg %

// ── tiny helpers to avoid IIFEs in JSX (which can cause render artifacts) ──
function PortfolioOutlook({ positions }) {
  const totalVal = positions.reduce((s,p) => s + p.qty * (p.currentPrice||0), 0);
  const fmt = v => v >= 1e6 ? '€'+(v/1e6).toFixed(2)+'M' : '€'+(v/1000).toFixed(1)+'k';
  const fmtPct2 = v => (v>=0?'+':'')+v.toFixed(0)+'%';
  const scenarios = [
    { label:'BEAR', icon:'🐻', color:'#e06060', bg:'rgba(224,96,96,0.07)', border:'rgba(224,96,96,0.2)',
      desc:'Recession / rate shock / sector rotation',
      yr1: totalVal*0.70, yr5: totalVal*Math.pow(0.93,5), yr10: totalVal*Math.pow(0.95,10) },
    { label:'BASE', icon:'⚖️', color:'var(--gold)', bg:'rgba(184,160,76,0.07)', border:'rgba(184,160,76,0.2)',
      desc:'Moderate growth, historical avg returns',
      yr1: totalVal*1.08, yr5: totalVal*Math.pow(1.08,5), yr10: totalVal*Math.pow(1.08,10) },
    { label:'BULL', icon:'🐂', color:'var(--green)', bg:'rgba(58,154,181,0.07)', border:'rgba(58,154,181,0.2)',
      desc:'Strong growth, AI & tech cycle tailwind',
      yr1: totalVal*1.20, yr5: totalVal*Math.pow(1.15,5), yr10: totalVal*Math.pow(1.15,10) },
  ];
  return (
    <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
      <div className="mono" style={{fontSize:10,color:'var(--text2)',letterSpacing:'0.12em',marginBottom:14}}>◈ PORTFOLIO OUTLOOK</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {scenarios.map(s => (
          <div key={s.label} style={{borderRadius:8,background:s.bg,border:`1px solid ${s.border}`,padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <span>{s.icon}</span>
              <span className="mono" style={{fontSize:10,fontWeight:700,color:s.color,letterSpacing:'0.1em'}}>{s.label}</span>
            </div>
            <div style={{fontSize:10,color:'var(--text3)',marginBottom:10,lineHeight:1.4}}>{s.desc}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {[['1Y',s.yr1],['5Y',s.yr5],['10Y',s.yr10]].map(([period,val]) => {
                const pct = totalVal > 0 ? (val-totalVal)/totalVal*100 : 0;
                return (
                  <div key={period} style={{textAlign:'center'}}>
                    <div className="mono" style={{fontSize:8,color:'var(--text3)',marginBottom:3}}>{period}</div>
                    <div className="mono" style={{fontSize:11,fontWeight:700,color:s.color}}>{fmt(val)}</div>
                    <div className="mono" style={{fontSize:9,color:s.color,opacity:0.8}}>{fmtPct2(pct)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,fontSize:9,color:'var(--text3)',fontFamily:'IBM Plex Mono',lineHeight:1.5}}>
        ⚠ Illustrative projections only. Bear: −30% yr1, −7%/yr avg. Base: +8%/yr. Bull: +20% yr1, +15%/yr. Not financial advice.
      </div>
    </div>
  );
}

function CostBasisCell({ pos }) {
  const costBasis = pos.qty * pos.avgPrice;
  const currentVal = pos.qty * pos.currentPrice;
  const dist = costBasis > 0 ? ((currentVal - costBasis) / costBasis * 100) : null;
  const above = dist != null && dist >= 0;
  return (
    <div>
      <div className="mono" style={{fontSize:11,color:'var(--text2)'}}>
        {costBasis > 0 ? '€'+costBasis.toFixed(0) : '—'}
      </div>
      {dist!=null && (
        <div className="mono" style={{fontSize:9,color:above?'var(--green)':'var(--red)'}}>
          {above?'+':''}{dist.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
function GroupAllocBadge({ groupVal, positions }) {
  const totalPortVal = positions.reduce((s,p)=>s+p.qty*(p.currentPrice||0),0);
  const alloc = totalPortVal > 0 ? (groupVal/totalPortVal*100) : 0;
  return <span className="mono" style={{fontSize:9,color:'var(--green)',marginLeft:6,background:'rgba(58,154,181,0.1)',padding:'1px 6px',borderRadius:3}}>{alloc.toFixed(1)}%</span>;
}

function PortfolioPage({ positions, transactions, wallets, onOpenStock, priceLoading, chartData, investedChartData, chartLoading, chartError, chartProgress, activeBM, setActiveBM, range, setRange, BENCHMARKS, perfStats, setManualResolvePos, theme, tc }) {
  const [collapsedGroups, setCollapsedGroups] = useState(new Set(['stock','etf','etc','crypto','derivative'])); // all collapsed by default
  const [expandedAccounts, setExpandedAccounts] = useState(new Set()); // By Account: empty = all collapsed
  const [tab, setTab] = React.useState('positions'); // positions | analysis
  const [soldOpen, setSoldOpen] = React.useState(false); // sold positions collapsed by default
  const [analysisView, setAnalysisView] = React.useState('asset'); // asset|sector|region|cagr|volatility|alloc
  const [drillFilter, setDrillFilter] = React.useState(null); // {type, value} for click-through
  const [fundamentals, setFundamentals] = React.useState({});
  const [loadingFund, setLoadingFund] = React.useState({});
  const [sortBy, setSortBy] = React.useState('value');
  const [sortDir, setSortDir] = React.useState('desc');

  const vis = positions.filter(p => p.qty > 0);
  const totalVal = vis.reduce((s,p) => s + p.qty * p.currentPrice, 0);
  const totalCost = vis.reduce((s,p) => s + p.qty * p.avgPrice, 0);

  // Fetch fundamentals for all stocks
  React.useEffect(() => {
    const stocks = vis.filter(p => p.type === 'stock' || p.type === 'etf');
    const syms = stocks.map(p => p.fmpTicker || p.symbol).filter(s => s && !isISIN(s) && !loadingFund[s] && !fundamentals[s]);
    if (!syms.length) return;
    const BATCH = 3;
    (async () => {
      for (let i = 0; i < syms.length; i += BATCH) {
        const batch = syms.slice(i, i + BATCH);
        batch.forEach(s => setLoadingFund(p => ({...p, [s]: true})));
        await Promise.all(batch.map(async sym => {
          try {
            const r = await fetch('/api/fundamentals?symbol=' + sym.split('.')[0]);
            const d = await r.json();
            if (!d.error) setFundamentals(p => ({...p, [sym]: d}));
          } catch(e) {}
          finally { setLoadingFund(p => ({...p, [sym]: false})); }
        }));
        if (i + BATCH < syms.length) await new Promise(r => setTimeout(r, 400));
      }
    })();
  }, [positions.map(p=>p.symbol).join(',')]);

  // ── CAGR calculation per position ──
  const parseDate = (d) => {
    if (!d) return null;
    // Handle German format dd.mm.yyyy
    const german = d.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (german) return new Date(`${german[3]}-${german[2].padStart(2,'0')}-${german[1].padStart(2,'0')}`);
    // ISO or other parseable
    const dt = new Date(d);
    return isNaN(dt) ? null : dt;
  };
  const calcCAGR = (pos) => {
    const txns = transactions.filter(t => (t.symbol === pos.symbol || t.isin === pos.isin) && t.type?.toLowerCase() === 'buy');
    if (!txns.length) return null;
    // earliest buy date
    const earliest = txns.reduce((a,b) => {
      const da = parseDate(a.date), db = parseDate(b.date);
      return (da && db) ? (da < db ? a : b) : (da ? a : b);
    });
    const earlyDate = parseDate(earliest.date);
    if (!earlyDate) return null;
    const years = (Date.now() - earlyDate.getTime()) / (365.25 * 86400000);
    if (years < 0.1) return null;
    const cv = pos.qty * pos.currentPrice;
    const cc = pos.qty * pos.avgPrice;
    if (cc <= 0) return null;
    return (Math.pow(cv / cc, 1 / years) - 1) * 100;
  };

  const getFund = (pos) => fundamentals[pos.fmpTicker || pos.symbol];
  const getCurrency = (pos) => {
    const sym = pos.fmpTicker || pos.symbol || '';
    if (pos.type === 'crypto') return 'USD/Crypto';
    if (sym.endsWith('.DE') || sym.endsWith('.F')) return 'EUR';
    if (sym.endsWith('.AS') || sym.endsWith('.PA') || sym.endsWith('.MI')) return 'EUR';
    if (sym.endsWith('.L')) return 'GBP';
    if (sym.endsWith('.T')) return 'JPY';
    if (sym.endsWith('.HK')) return 'HKD';
    return 'USD';
  };
  const getScore = (pos) => calcCanonicalHealthScore(getFund(pos));
  const getSector = (pos) => getFund(pos)?.sector || (pos.type === 'crypto' ? 'Crypto' : pos.type === 'etf' ? 'ETF' : null);
  const getRegion = (pos) => {
    const sym = pos.fmpTicker || pos.symbol || '';
    if (sym.endsWith('.DE') || sym.endsWith('.F') || sym.endsWith('.AS') || sym.endsWith('.PA')) return 'Europe';
    if (pos.type === 'crypto') return 'Global';
    if (pos.type === 'etf') return 'Mixed';
    return 'North America';
  };

  const fmtE = v => v == null ? '—' : '€' + v.toLocaleString('de-DE', {minimumFractionDigits:2,maximumFractionDigits:2});
  const fmtPct = v => v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1) + '%';

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  // ── Sort positions ──
  const sorted = [...vis].sort((a, b) => {
    let va, vb;
    if (sortBy === 'value')   { va = a.qty*a.currentPrice; vb = b.qty*b.currentPrice; }
    else if (sortBy === 'pnl') { va = a.qty*(a.currentPrice-a.avgPrice); vb = b.qty*(b.currentPrice-b.avgPrice); }
    else if (sortBy === 'pnlpct') { va = (a.currentPrice-a.avgPrice)/a.avgPrice; vb = (b.currentPrice-b.avgPrice)/b.avgPrice; }
    else if (sortBy === 'daily') { va = a.dailyChange??-999; vb = b.dailyChange??-999; }
    else if (sortBy === 'health') { va = getScore(a)??-1; vb = getScore(b)??-1; }
    else if (sortBy === 'cagr') { va = calcCAGR(a)??-999; vb = calcCAGR(b)??-999; }
    else { va = a[sortBy]??0; vb = b[sortBy]??0; }
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  // Filter for drill-down
  const displayRows = drillFilter ? sorted.filter(p => {
    if (drillFilter.type === 'sector') return getSector(p) === drillFilter.value;
    if (drillFilter.type === 'region') return getRegion(p) === drillFilter.value;
    if (drillFilter.type === 'asset')  return (p.type || 'stock') === drillFilter.value;
    if (drillFilter.type === 'cagr') {
      const cagr = calcCAGR(p);
      if (drillFilter.value === 'high')   return cagr != null && cagr >= 15;
      if (drillFilter.value === 'medium') return cagr != null && cagr >= 5 && cagr < 15;
      if (drillFilter.value === 'low')    return cagr != null && cagr < 5;
      if (drillFilter.value === 'n/a')    return cagr == null;
    }
    if (drillFilter.type === 'volatility') {
      const beta = getFund(p)?.beta;
      if (drillFilter.value === 'high')   return beta != null && beta > 1.3;
      if (drillFilter.value === 'medium') return beta != null && beta >= 0.7 && beta <= 1.3;
      if (drillFilter.value === 'low')    return beta != null && beta < 0.7;
      if (drillFilter.value === 'n/a')    return beta == null;
    }
    if (drillFilter.type === 'currency') return getCurrency(p) === drillFilter.value;
    return true;
  }) : sorted;

  // ── Pie chart data builders ──
  const PIE_PALETTE   = ['#4aaec0','#5ab8cc','#d4c06a','#a78bfa','#ff6b9d','#00d4ff','#e06060','#7cfc00','#ff8c00','#9370db','#20b2aa','#dc143c'];
  const ASSET_COLORS  = { stock:'#4aaec0', etf:'#5ab8cc', crypto:'#d4c06a', derivative:'#e06060' };
  const REGION_COLORS = { 'North America':'#5ab8cc','Europe':'#4aaec0','Global':'#d4c06a','Mixed':'#a78bfa','Asia':'#ff6b9d' };

  const makePie = (groupFn, colorMap) => {
    const groups = {};
    vis.forEach(p => {
      const key = groupFn(p) || 'Other';
      groups[key] = (groups[key] || 0) + p.qty * p.currentPrice;
    });
    const total = Object.values(groups).reduce((a,b)=>a+b,0) || 1;
    return Object.entries(groups)
      .sort((a,b)=>b[1]-a[1])
      .map(([name, val], i) => ({
        name, value: Math.round(val/total*1000)/10,
        rawVal: val,
        color: colorMap?.[name] || PIE_PALETTE[i % PIE_PALETTE.length],
      }));
  };

  const assetPie     = makePie(p => p.type || 'stock', ASSET_COLORS);
  const sectorPie    = makePie(getSector, {});
  const regionPie    = makePie(getRegion, REGION_COLORS);
  const allocPie     = makePie(p => p.symbol || p.name, {});
  const currencyPie  = makePie(getCurrency, {'USD':'#5ab8cc','EUR':'#4aaec0','GBP':'#a78bfa','JPY':'#d4c06a','USD/Crypto':'#ff9f43','HKD':'#ff6b9d'});


  const cagrPie = (() => {
    const groups = { high: 0, medium: 0, low: 0, 'n/a': 0 };
    vis.forEach(p => {
      const cagr = calcCAGR(p);
      const val = p.qty * p.currentPrice;
      if (cagr == null)     groups['n/a'] += val;
      else if (cagr >= 15)  groups.high   += val;
      else if (cagr >= 5)   groups.medium += val;
      else                  groups.low    += val;
    });
    const total = Object.values(groups).reduce((a,b)=>a+b,0) || 1;
    const cols = {high:'#4aaec0',medium:'#d4c06a',low:'#e06060','n/a':'#3d5060'};
    return Object.entries(groups).filter(([,v])=>v>0).map(([name,val])=>({
      name, value: Math.round(val/total*1000)/10, rawVal: val, color: cols[name]
    }));
  })();

  const volPie = (() => {
    const groups = { high: 0, medium: 0, low: 0, 'n/a': 0 };
    vis.forEach(p => {
      const beta = getFund(p)?.beta;
      const val = p.qty * p.currentPrice;
      if (beta == null)   groups['n/a']  += val;
      else if (beta > 1.3) groups.high   += val;
      else if (beta < 0.7) groups.low    += val;
      else                 groups.medium += val;
    });
    const total = Object.values(groups).reduce((a,b)=>a+b,0) || 1;
    const cols = {high:'#e06060',medium:'#d4c06a',low:'#4aaec0','n/a':'#3d5060'};
    return Object.entries(groups).filter(([,v])=>v>0).map(([name,val])=>({
      name, value: Math.round(val/total*1000)/10, rawVal: val, color: cols[name]
    }));
  })();

  const PIE_VIEWS = [
    {id:'alloc',     label:'Allocation',   data: allocPie,  drillType: 'alloc'},
    {id:'asset',     label:'Asset Class',  data: assetPie,  drillType: 'asset'},
    {id:'sector',    label:'Sector',       data: sectorPie, drillType: 'sector'},
    {id:'region',    label:'Region',       data: regionPie, drillType: 'region'},
    {id:'cagr',      label:'CAGR Band',    data: cagrPie,   drillType: 'cagr'},
    {id:'volatility',label:'Volatility',   data: volPie,    drillType: 'volatility'},
    {id:'currency',  label:'Currency',    data: currencyPie, drillType: 'currency'},
  ];
  const currentPie = PIE_VIEWS.find(v => v.id === analysisView) || PIE_VIEWS[0];
  const [hoveredSlice, setHoveredSlice] = React.useState(null);

  const SCORECARD_LABELS = ['Profit','Growth','Moat','Balance','Cash','Valuation'];
  const SCORE_COL = {green:'var(--green)',gold:'var(--gold)',red:'var(--red)',gray:'var(--text3)'};

  // Compute per-position scorecard dims
  const getScoreDims = (pos) => {
    const d = getFund(pos);
    if (!d) return null;
    const yrs = d.byYear?.slice(-3)||[];
    const last = yrs[yrs.length-1]||{};
    const prev = yrs[yrs.length-2]||{};
    const prev2= yrs[yrs.length-3]||{};
    const s=(d.sector||'').toLowerCase();
    const isTech=/tech|software|semi/i.test(s);
    const isFinance=/financ|bank/i.test(s);
    const isRetail=/retail|consumer/i.test(s);
    const nmGood=isTech?0.15:isRetail?0.04:0.08, nmOk=isTech?0.06:isRetail?0.01:0.03;
    const deGood=isFinance?8:isTech?0.5:1, deOk=isFinance?15:isTech?1.5:2;
    const score2=(scores)=>{const f=scores.filter(s=>s!==null);return f.length?(f.reduce((a,b)=>a+b)/f.length>=1.5?'green':f.reduce((a,b)=>a+b)/f.length>=0.8?'gold':'red'):'gray';};
    const profitColor=score2([
      last.netMargin !=null?(last.netMargin >=nmGood?2:last.netMargin >=nmOk?1:0):null,
      last.roe       !=null?(last.roe       >=0.15  ?2:last.roe       >=0.08?1:0):null,
      last.grossMargin!=null?(last.grossMargin>=(isTech?0.50:0.35)?2:last.grossMargin>=(isTech?0.30:0.20)?1:0):null,
    ]);
    const g=(last.revenue&&prev.revenue&&prev.revenue>0)?(last.revenue/prev.revenue-1):null;
    const growthColor=g==null?'gray':g>(isTech?0.15:0.07)?'green':g>(isTech?0.05:0.02)?'gold':'red';
    const rvY=(last.revenue&&prev.revenue&&prev.revenue>0)?last.revenue/prev.revenue-1:null;
    const rvP=(prev.revenue&&prev2.revenue&&prev2.revenue>0)?prev.revenue/prev2.revenue-1:null;
    const moatColor=score2([
      last.grossMargin!=null?(last.grossMargin>=(isTech?0.55:0.40)?2:last.grossMargin>=(isTech?0.35:0.25)?1:0):null,
      last.roic!=null?(last.roic>=0.15?2:last.roic>=0.08?1:0):null,
      last.roe !=null?(last.roe >=0.20?2:last.roe >=0.12?1:0):null,
      (rvY!=null&&rvP!=null&&rvY>0&&rvP>0)?2:(rvY!=null?(rvY>0?1:0):null),
    ]);
    const balColor=score2([
      last.debtEquity!=null?(last.debtEquity<=deGood?2:last.debtEquity<=deOk?1:0):null,
      last.currentRatio!=null?(last.currentRatio>=2?2:last.currentRatio>=1?1:0):null,
    ]);
    const cashColor=score2([
      last.freeCashFlow!=null?(last.freeCashFlow>0?(last.freeCashFlow/last.revenue>=0.10?2:1):0):null,
      last.operatingCF !=null?(last.operatingCF >0?2:0):null,
    ]);
    const peFair=isTech?30:20, peOk=isTech?45:30;
    const valColor=score2([
      d.peRatio !=null?(d.peRatio <=peFair?2:d.peRatio <=peOk?1:0):null,
      d.evEbitda!=null?(d.evEbitda<=10    ?2:d.evEbitda<=18  ?1:0):null,
    ]);
    return [profitColor,growthColor,moatColor,balColor,cashColor,valColor];
  };

  const ScoreDot = ({color}) => (
    <div style={{width:10,height:10,borderRadius:'50%',flexShrink:0,
      background:color==='green'?'var(--green)':color==='gold'?'var(--gold)':color==='red'?'var(--red)':'var(--surface2)',
      border: color==='gray'?'1px solid var(--border)':'none'}}/>
  );

  // ── Portfolio-level CAGR ──
  const allCagrVals = vis.map(calcCAGR).filter(v => v != null);
  const portfolioCAGR = allCagrVals.length ? allCagrVals.reduce((a,b)=>a+b,0)/allCagrVals.length : null;
  const realCAGR = portfolioCAGR != null ? portfolioCAGR - EU_INFLATION : null;

  return (
    <div style={{padding:'26px 30px',overflow:'auto',height:'100%',boxSizing:'border-box'}}>

      {/* ── KPI Cards ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'PORTFOLIO VALUE', val:`€${totalVal.toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:0})}`, sub:`${vis.length} positions`, color:null},
          {label:'TOTAL P&L',       val:`${(totalVal-totalCost)>=0?'+':'-'}€${Math.abs(totalVal-totalCost).toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:0})}`, sub:`${totalCost>0?((totalVal-totalCost)/totalCost*100).toFixed(1):'—'}% total return`, color:(totalVal-totalCost)>=0?'var(--green)':'var(--red)'},
          {label:'INVESTED',        val:`€${totalCost.toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:0})}`, sub:'Cost basis', color:null},
          {label:'PORTFOLIO CAGR',  val:portfolioCAGR!=null?(portfolioCAGR>=0?'+':'')+portfolioCAGR.toFixed(1)+'% p.a.':'—', sub:'Avg compound annual growth', color:portfolioCAGR==null?null:portfolioCAGR>=10?'var(--green)':portfolioCAGR>=5?'var(--gold)':'var(--red)'},
          {label:'REAL RETURN',     val:realCAGR!=null?(realCAGR>=0?'+':'')+realCAGR.toFixed(1)+'% p.a.':'—', sub:`After ${EU_INFLATION}% EU inflation`, color:realCAGR==null?null:realCAGR>=5?'var(--green)':realCAGR>=0?'var(--gold)':'var(--red)'},
        ].map((k,i)=>(
          <div key={i} className="card fu" style={{padding:'16px 18px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:k.color||'var(--border2)'}}/>
            <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.12em',marginBottom:7}}>{k.label}</div>
            <div className="mono" style={{fontSize:18,fontWeight:600,letterSpacing:'-0.02em',color:k.color||'var(--text)'}}>{k.val}</div>
            <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Performance Chart ── */}
      {(chartData?.length > 0 || investedChartData?.length > 0) && (
        <div className="card fu2" style={{padding:'18px 20px 14px',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div className="mono" style={{fontSize:10,color:'var(--text2)',letterSpacing:'0.1em'}}>PERFORMANCE</div>
              {perfStats?.portfolio!=null&&<span className="mono" style={{fontSize:10,color:perfStats.portfolio>=0?'var(--green)':'var(--red)',fontWeight:600}}>{perfStats.portfolio>=0?'+':''}{perfStats.portfolio}%</span>}
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {BENCHMARKS?.map(b=>(
                <button key={b.id} onClick={()=>setActiveBM(a=>a.includes(b.id)?a.filter(x=>x!==b.id):[...a,b.id])}
                  className="btn" style={{fontSize:9,padding:'2px 8px',
                    borderColor:activeBM?.includes(b.id)?b.color:'var(--border)',
                    color:activeBM?.includes(b.id)?b.color:'var(--text3)',
                    background:activeBM?.includes(b.id)?'rgba(100,100,200,0.06)':'transparent'}}>
                  {b.label}
                </button>
              ))}
              <div style={{width:1,background:'var(--border)',margin:'0 2px'}}/>
              {["1M","3M","6M","YTD","1Y","ALL"].map(r=>(
                <button key={r} onClick={()=>setRange(r)} className="btn"
                  style={{fontSize:9,padding:'2px 8px',
                    borderColor:range===r?'var(--green)':'var(--border)',
                    color:range===r?'var(--green)':'var(--text3)',
                    background:range===r?'rgba(58,154,181,0.08)':'transparent'}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {chartLoading ? (
            <div style={{height:200,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
              <span className="mono shimmer" style={{fontSize:11,color:'var(--text3)'}}>⟳ Loading chart data…</span>
              {chartProgress && <span className="mono" style={{fontSize:9,color:'var(--text3)',opacity:0.7,maxWidth:400,textAlign:'center'}}>{chartProgress}</span>}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={chartData?.some(r => r.portfolio > 0)?chartData:investedChartData} margin={{top:4,right:4,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="gPort2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tc.green} stopOpacity={0.15}/><stop offset="95%" stopColor={tc.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={tc.gridLine} vertical={false}/>
                <XAxis dataKey="date" tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:tc.text3}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                <YAxis tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:tc.text3}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"} width={44}/>
                <Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:8,fontFamily:'IBM Plex Mono',fontSize:11}}/>
                {activeBM?.map(id=>{const b=BENCHMARKS?.find(x=>x.id===id);return b?<Line key={id} type="linear" dataKey={id} name={b.label} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.75} dot={false} connectNulls isAnimationActive={false}/>:null;})}
                <Area type="linear" dataKey="portfolio" name="Portfolio" stroke={tc.green} strokeWidth={2.5} fill="url(#gPort2)" dot={false}/>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── Bear / Base / Bull Outlook ── */}
      {positions.length > 0 && <PortfolioOutlook positions={positions}/>}

      {/* ── Tabs ── */}
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {[['positions','Positions'],['wallets','By Account'],['analysis','Analysis']].map(([id,label])=>(
          <button key={id} onClick={()=>{setTab(id);setDrillFilter(null);}} className="mono"
            style={{padding:'7px 16px',borderRadius:6,cursor:'pointer',fontSize:11,letterSpacing:'0.06em',
              border:'1px solid',transition:'all 0.15s',
              borderColor: tab===id?'rgba(58,154,181,0.35)':'var(--border)',
              background:  tab===id?'var(--green-dim)':'transparent',
              color:       tab===id?'var(--green)':'var(--text2)'}}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════ POSITIONS TAB ══════════ */}
      {tab==='positions' && (<>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          {/* Table header */}
          <div style={{display:'grid',
            gridTemplateColumns:'2fr 0.7fr 0.9fr 0.9fr 0.7fr 0.9fr 0.9fr 0.9fr 1.8fr',
            padding:'9px 18px',background:'var(--surface2)',borderBottom:'1px solid var(--border2)',gap:8}}>
            {[
              ['name','ASSET'],['qty','QTY'],['price','AVG €'],['value','VALUE'],
              ['daily','DAY%'],['pnl','P&L'],['pnlpct','P&L%'],
              ['breakeven','COST BASIS'],
              ['health','HEALTH'],
            ].map(([col,label])=>(
              <div key={col} className="mono" onClick={()=>toggleSort(col)}
                style={{fontSize:9,color:sortBy===col?'var(--green)':'var(--text3)',letterSpacing:'0.1em',
                  cursor:'pointer',userSelect:'none',display:'flex',alignItems:'center',gap:3}}>
                {label}
                <span style={{opacity:sortBy===col?1:0.3,fontSize:8}}>{sortBy===col&&sortDir==='asc'?'▲':'▼'}</span>
              </div>
            ))}
          </div>

          {/* Asset-class grouped rows */}
          {(()=> { const typeLabel = t => t==='etf'?'ETF':t==='etc'?'ETC':t==='crypto'?'Crypto':t==='derivative'?'Derivative':'Stock';
            const typeOrder = ['stock','etf','etc','crypto','derivative'];
            const groups = typeOrder.map(type => ({
              type, label: typeLabel(type),
              rows: displayRows.filter(p => (p.type||'stock') === type)
            })).filter(g => g.rows.length > 0);
            return groups.map(({ type, label, rows }) => {
              const expanded = !collapsedGroups.has(type);
              const groupVal = rows.reduce((s,p)=>s+p.qty*p.currentPrice,0);
              const groupCost = rows.reduce((s,p)=>s+p.qty*p.avgPrice,0);
              const groupPnl = groupVal - groupCost;
              const groupPct = groupCost > 0 ? groupPnl/groupCost*100 : 0;
              const groupUp = groupPnl >= 0;
              return (
                <React.Fragment key={type}>
                  {/* Group header row */}
                  <div onClick={()=>setCollapsedGroups(prev=>{const s=new Set(prev);s.has(type)?s.delete(type):s.add(type);return s;})}
                    style={{display:'grid',gridTemplateColumns:'2fr 0.7fr 0.9fr 0.9fr 0.7fr 0.9fr 0.9fr 0.9fr 1.8fr',
                      padding:'8px 18px',background:'var(--surface2)',borderBottom:'1px solid var(--border2)',
                      cursor:'pointer',gap:8,alignItems:'center',userSelect:'none'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--border)'}
                    onMouseLeave={e=>e.currentTarget.style.background='var(--surface2)'}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:10,color:'var(--text3)',transition:'transform 0.15s',
                        transform:expanded?'rotate(90deg)':'rotate(0deg)',display:'inline-block'}}>▶</span>
                      <span className="mono" style={{fontSize:10,fontWeight:700,color:'var(--text2)',letterSpacing:'0.08em'}}>{label.toUpperCase()}</span>
                      <span className="mono" style={{fontSize:9,color:'var(--text3)',marginLeft:4}}>{rows.length} position{rows.length!==1?'s':''}</span>
                      <GroupAllocBadge groupVal={groupVal} positions={positions}/>
                    </div>
                    <div/>
                    <div/>
                    <div className="mono" style={{fontSize:11,fontWeight:700}}>{fmtE(groupVal)}</div>
                    <div/>
                    <div className="mono" style={{fontSize:11,fontWeight:600,color:groupUp?'var(--green)':'var(--red)'}}>
                      {groupUp?'+':'-'}€{Math.abs(groupPnl).toFixed(0)}
                    </div>
                    <div className="mono" style={{fontSize:11,fontWeight:600,color:groupUp?'var(--green)':'var(--red)'}}>
                      {fmtPct(groupPct)}
                    </div>
                    <div className="mono" style={{fontSize:10,color:'var(--text3)'}}>€{groupCost.toFixed(0)}</div>
                    <div/>
                  </div>
                  {/* Position rows */}
                  {expanded && rows.map(pos => {
                    const val = pos.qty * pos.currentPrice;
                    const pnl = pos.qty * (pos.currentPrice - pos.avgPrice);
                    const pnlpct = pos.avgPrice > 0 ? ((pos.currentPrice - pos.avgPrice) / pos.avgPrice * 100) : 0;
                    const up = pnl >= 0;
                    const cagr = calcCAGR(pos);
                    const score = getScore(pos);
                    const dims = getScoreDims(pos);
                    const loading = loadingFund[pos.fmpTicker || pos.symbol];
                    return (
              <div key={pos.id} onClick={()=>onOpenStock(pos)}
                style={{display:'grid',
                  gridTemplateColumns:'2fr 0.7fr 0.9fr 0.9fr 0.7fr 0.9fr 0.9fr 0.9fr 1.8fr',
                  padding:'11px 18px',borderBottom:'1px solid var(--border)',
                  cursor:'pointer',transition:'background 0.12s',gap:8,alignItems:'center'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>

                {/* Asset */}
                <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                  <AssetLogo pos={pos}/>
                  <div style={{minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <span style={{fontSize:12,fontWeight:500}}>{displayTicker(pos)}</span>
                      {/* Manual resolve badge:
                           - No fmpTicker at all → show
                           - fmpTicker from name fallback + no price → show (possibly wrong resolution)
                           - fmpTicker from name fallback + price suspicious (>3× off CSV price) → show
                           - fmpTicker from ISIN/map/manual + no price → don't show (FMP plan limit, not wrong) */}
                      {pos.type !== 'derivative' && pos.type !== 'crypto' &&
                        (!pos.fmpTicker || (pos.tickerSource === 'name' && (pos.currentPrice === 0 || !pos.currentPrice)) || pos._priceSuspicious) && (
                        <span
                          title="Click to enter ticker symbol manually"
                          onClick={e => { e.stopPropagation(); setManualResolvePos(pos); }}
                          style={{fontSize:9,cursor:'pointer',color:'var(--gold)',fontWeight:700,
                            background:'rgba(245,200,66,0.12)',padding:'1px 5px',borderRadius:4,
                            border:'1px solid rgba(245,200,66,0.3)'}}>
                          ⚠ resolve
                        </span>
                      )}
                    </div>
                    <div style={{fontSize:10,color:'var(--text3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:110}}>{pos.name}</div>
                  </div>
                </div>

                {/* QTY */}
                <div className="mono" style={{fontSize:11,color:'var(--text2)'}}>
                  {pos.qty<1?pos.qty.toFixed(4):pos.qty.toFixed(pos.qty<10?3:1)}
                </div>

                {/* Avg price */}
                <div className="mono" style={{fontSize:11,color:'var(--text2)'}}>
                  {pos.avgPrice?.toFixed(2)}
                </div>

                {/* Value */}
                <div className="mono" style={{fontSize:12,fontWeight:600}}>{fmtE(val)}</div>

                {/* Daily */}
                <div className="mono" style={{fontSize:11,fontWeight:600,
                  color:pos.dailyChange==null?'var(--text3)':pos.dailyChange>=0?'var(--green)':'var(--red)'}}>
                  {pos.dailyChange!=null?(pos.dailyChange>=0?'+':'')+pos.dailyChange.toFixed(2)+'%':'—'}
                </div>

                {/* P&L € */}
                <div className="mono" style={{fontSize:11,color:up?'var(--green)':'var(--red)'}}>
                  {up?'+':'-'}€{Math.abs(pnl).toFixed(0)}
                </div>

                {/* P&L % */}
                <div className="mono" style={{fontSize:11,fontWeight:600,color:up?'var(--green)':'var(--red)'}}>
                  {fmtPct(pnlpct)}
                </div>

                {/* Break-even: total cost basis (qty × avgPrice) */}
                <CostBasisCell pos={pos}/>

                {/* HEALTH — scorecard dots + score bar in one cell */}
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <div style={{display:'flex',gap:3,alignItems:'center'}}>
                    {dims ? dims.map((col,i)=>(
                      <div key={i} title={SCORECARD_LABELS[i]}
                        style={{width:10,height:10,borderRadius:'50%',flexShrink:0,
                          background:col==='green'?'var(--green)':col==='gold'?'var(--gold)':col==='red'?'var(--red)':'var(--surface2)',
                          border:col==='gray'?'1px solid var(--border)':'none'}}/>
                    )) : loading ? <span className="mono shimmer" style={{fontSize:9,color:'var(--text3)'}}>…</span>
                    : <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>—</span>}
                    {score!=null && <span className="mono" style={{fontSize:10,fontWeight:700,marginLeft:4,
                      color:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}}>
                      {score}
                    </span>}
                  </div>
                  {score!=null && (
                    <div style={{width:'100%',maxWidth:80,height:3,borderRadius:2,background:'var(--surface2)',overflow:'hidden'}}>
                      <div style={{height:'100%',width:score+'%',borderRadius:2,
                        background:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}}/>
                    </div>
                  )}
                </div>
              </div>
            );
                  })}
                </React.Fragment>
              );
            });
          })()}

          {/* Scorecard legend */}
          <div style={{padding:'10px 18px',borderTop:'1px solid var(--border)',display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
            <span className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em'}}>SCORECARD:</span>
            {SCORECARD_LABELS.map((l,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:'var(--green)'}}/>
                <span className="mono" style={{fontSize:9,color:'var(--text3)'}}>{l}</span>
              </div>
            ))}
            <span className="mono" style={{fontSize:9,color:'var(--text3)',marginLeft:'auto'}}>
              🟢 Strong  🟡 Mixed  🔴 Weak  ⚫ No data
            </span>
          </div>
        </div>

        {/* ── Sold Positions (collapsible) ── */}
        {(() => {
          const soldPositions = positions.filter(p => p.sold && p.realizedPnL != null);
          if (!soldPositions.length) return null;
          const totalRealized = soldPositions.reduce((s, p) => s + (p.realizedPnL || 0), 0);
          const winners = soldPositions.filter(p => p.realizedPnL > 0).length;
          const losers = soldPositions.filter(p => p.realizedPnL < 0).length;
          return (
            <div className="card" style={{marginTop:12,overflow:'hidden'}}>
              <div
                onClick={() => setSoldOpen(prev => !prev)}
                style={{padding:'12px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,
                  borderBottom: soldOpen ? '1px solid var(--border)' : 'none',
                  transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span style={{fontSize:12,transition:'transform 0.2s',transform:soldOpen?'rotate(90deg)':'rotate(0deg)',display:'inline-block'}}>›</span>
                <span style={{fontSize:13,fontWeight:600}}>Sold Positions</span>
                <span className="mono" style={{fontSize:11,color:'var(--text2)'}}>
                  {soldPositions.length} positions
                </span>
                {winners > 0 && <span className="tag tag-green" style={{fontSize:9}}>↑ {winners}</span>}
                {losers > 0 && <span className="tag tag-red" style={{fontSize:9}}>↓ {losers}</span>}
                <span className="mono" style={{fontSize:12,fontWeight:600,marginLeft:'auto',
                  color:totalRealized>=0?'var(--green)':'var(--red)'}}>
                  {totalRealized>=0?'+':''}€{totalRealized.toFixed(0)}
                </span>
              </div>
              {soldOpen && (
                <div>
                  {/* Mini logo row */}
                  <div style={{padding:'8px 18px',display:'flex',gap:4,flexWrap:'wrap',borderBottom:'1px solid var(--border)'}}>
                    {soldPositions.slice(0, 20).map((p, i) => (
                      <AssetLogo key={i} pos={p} size={28}/>
                    ))}
                    {soldPositions.length > 20 && <span className="mono" style={{fontSize:10,color:'var(--text3)',alignSelf:'center'}}>+{soldPositions.length-20}</span>}
                  </div>
                  {/* Header */}
                  <div style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 1fr 1fr',padding:'8px 18px',
                    borderBottom:'1px solid var(--border)'}}>
                    {['NAME','BUY COST','SELL REVENUE','REALIZED P&L'].map(h=>(
                      <span key={h} className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em'}}>{h}</span>
                    ))}
                  </div>
                  {/* Rows */}
                  {soldPositions
                    .sort((a,b) => Math.abs(b.realizedPnL||0) - Math.abs(a.realizedPnL||0))
                    .map((p, i) => {
                      const up = (p.realizedPnL || 0) >= 0;
                      const pct = p.totalBuyCost > 0 ? ((p.realizedPnL / p.totalBuyCost) * 100) : 0;
                      return (
                        <div key={i} style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 1fr 1fr',padding:'10px 18px',
                          borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'background 0.12s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          onClick={() => onOpenStock({...p, qty: 0})}>
                          <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                            <AssetLogo pos={p}/>
                            <div style={{minWidth:0}}>
                              <div style={{fontSize:12,fontWeight:500}}>{displayTicker(p)}</div>
                              <div style={{fontSize:10,color:'var(--text3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{p.name}</div>
                            </div>
                          </div>
                          <div className="mono" style={{fontSize:11,color:'var(--text2)'}}>€{(p.totalBuyCost||0).toFixed(0)}</div>
                          <div className="mono" style={{fontSize:11,color:'var(--text2)'}}>€{(p.totalSellRevenue||0).toFixed(0)}</div>
                          <div>
                            <div className="mono" style={{fontSize:11,fontWeight:600,color:up?'var(--green)':'var(--red)'}}>
                              {up?'+':''}€{(p.realizedPnL||0).toFixed(0)}
                            </div>
                            <div className="mono" style={{fontSize:10,color:up?'var(--green)':'var(--red)',opacity:0.7}}>
                              {up?'↑':'↓'} {Math.abs(pct).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })()}
      </>)}

      {/* ══════════ ANALYSIS TAB ══════════ */}
      {tab==='wallets' && (() => {
        const allWallets = wallets || [];
        // Group positions by broker/wallet name
        const brokerGroups = {};
        positions.filter(p => p.qty > 0).forEach(p => {
          const key = p.broker || 'Unknown';
          if (!brokerGroups[key]) brokerGroups[key] = [];
          brokerGroups[key].push(p);
        });
        const sortedGroups = Object.entries(brokerGroups).sort((a,b) => {
          const aVal = a[1].reduce((s,p) => s + p.qty * p.currentPrice, 0);
          const bVal = b[1].reduce((s,p) => s + p.qty * p.currentPrice, 0);
          return bVal - aVal;
        });
        const grandTotal = positions.filter(p=>p.qty>0).reduce((s,p) => s + p.qty * p.currentPrice, 0);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sortedGroups.length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                No positions yet. Import a portfolio to get started.
              </div>
            )}
            {sortedGroups.map(([brokerName, poses]) => {
              const wallet = allWallets.find(w => w.name.toLowerCase() === brokerName.toLowerCase());
              const isCold = wallet?.type === 'cold_wallet';
              const groupVal = poses.reduce((s,p) => s + p.qty * p.currentPrice, 0);
              const groupCost = poses.reduce((s,p) => s + p.qty * p.avgPrice, 0);
              const groupPnl = groupVal - groupCost;
              const allocPct = grandTotal > 0 ? (groupVal / grandTotal * 100) : 0;
              const walletColor = wallet?.color || (isCold ? '#9945ff' : 'var(--green)');
              const isExpanded = expandedAccounts.has(brokerName);
              const toggleAcct = () => setExpandedAccounts(prev => {
                const s = new Set(prev);
                s.has(brokerName) ? s.delete(brokerName) : s.add(brokerName);
                return s;
              });
              return (
                <div key={brokerName} className="card" style={{ padding: 0, overflow: 'hidden',
                  borderColor: walletColor + '30' }}>
                  {/* Wallet header — clickable to expand/collapse */}
                  <div onClick={toggleAcct}
                    style={{ padding: '14px 20px', borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                    background: walletColor + '08', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', userSelect: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = walletColor + '14'}
                    onMouseLeave={e => e.currentTarget.style.background = walletColor + '08'}>
                    <span style={{ fontSize: 10, color: walletColor, transition: 'transform 0.15s',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>
                          {isCold ? '🔒 ' : ''}{brokerName}
                        </span>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--text3)', padding: '1px 6px',
                          background: 'var(--surface2)', borderRadius: 3, letterSpacing: '0.08em' }}>
                          {getAccountType(brokerName, isCold).label.toUpperCase()}
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
                          {poses.length} position{poses.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>
                        €{groupVal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 2 }}>
                        <span className="mono" style={{ fontSize: 10, color: groupPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {groupPnl >= 0 ? '+' : ''}€{groupPnl.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>{allocPct.toFixed(1)}% of portfolio</span>
                      </div>
                    </div>
                  </div>
                  {/* Positions list — only shown when expanded */}
                  {isExpanded && (
                  <div>
                    {poses.sort((a,b) => b.qty*b.currentPrice - a.qty*a.currentPrice).map((p, i) => {
                      const val = p.qty * p.currentPrice;
                      const pnl = p.qty * (p.currentPrice - p.avgPrice);
                      const pnlPct = p.avgPrice > 0 ? (p.currentPrice / p.avgPrice - 1) * 100 : 0;
                      return (
                        <div key={p.id || i} onClick={() => onOpenStock(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
                            borderBottom: i < poses.length - 1 ? '1px solid var(--border)' : 'none',
                            cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <AssetLogo pos={p} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{displayTicker(p)}</span>
                              <span style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                            </div>
                            <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                              {p.qty % 1 === 0 ? p.qty : p.qty.toFixed(4)} @ €{p.avgPrice > 0 ? p.avgPrice.toLocaleString('de-DE', { maximumFractionDigits: 2 }) : '—'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                              {val > 0
                                ? '€' + val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : <span className="shimmer" style={{color:'var(--text3)'}}>syncing…</span>}
                            </div>
                            {p.avgPrice > 0 && p.currentPrice > 0 && (
                              <div className="mono" style={{ fontSize: 10, color: pnl >= 0 ? 'var(--green)' : 'var(--red)', marginTop: 1 }}>
                                {pnl >= 0 ? '+' : ''}€{Math.abs(pnl).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {tab==='analysis' && (
        <div>
          {/* ── View selector tabs ── */}
          <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
            {PIE_VIEWS.map(v=>(
              <button key={v.id} onClick={()=>{setAnalysisView(v.id);setDrillFilter(null);}} className="mono"
                style={{padding:'6px 14px',borderRadius:6,cursor:'pointer',fontSize:10,letterSpacing:'0.06em',
                  border:'1px solid',transition:'all 0.15s',
                  borderColor:analysisView===v.id?'rgba(58,154,181,0.35)':'var(--border)',
                  background:analysisView===v.id?'var(--green-dim)':'transparent',
                  color:analysisView===v.id?'var(--green)':'var(--text2)'}}>
                {v.label}
              </button>
            ))}
          </div>

          {/* ── Single big pie + drill-down ── */}
          {(() => {
            const pv = currentPie;
            return (
              <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:16,alignItems:'start'}}>

                {/* Pie card */}
                <div className="card" style={{padding:24}}>
                  <div className="mono" style={{fontSize:10,color:'var(--text2)',letterSpacing:'0.12em',marginBottom:16}}>
                    {pv.label.toUpperCase()}
                  </div>

                  {/* Pie chart */}
                  <div style={{position:'relative',height:260}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pv.data}
                          cx="50%" cy="50%"
                          innerRadius={70} outerRadius={110}
                          dataKey="value" paddingAngle={2}
                          onClick={(entry, index, event) => {
                            event?.stopPropagation?.();
                            if (pv.id === 'alloc') return;
                            setDrillFilter(df =>
                              df?.value === entry.name ? null : {type: pv.drillType, value: entry.name}
                            );
                          }}>
                          {pv.data.map((entry, i) => (
                            <Cell key={i} fill={entry.color}
                              opacity={drillFilter ? (drillFilter.value === entry.name ? 1 : 0.35) : 1}
                              style={{cursor: pv.id==='alloc'?'default':'pointer', outline:'none',
                                filter: drillFilter?.value===entry.name?'brightness(1.2)':'none'}}/>
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:8,fontSize:11}}
                          formatter={(v, n) => [v + '%', n]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centre label */}
                    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                      alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                      <div className="mono" style={{fontSize:22,fontWeight:700,color:'var(--text)'}}>{pv.data.length}</div>
                      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.08em'}}>GROUPS</div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:16}}>
                    {pv.data.map(d => (
                      <div key={d.name}
                        onClick={() => {
                          if (pv.id === 'alloc') return;
                          setDrillFilter(df => df?.value === d.name ? null : {type: pv.drillType, value: d.name});
                        }}
                        style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',borderRadius:6,
                          cursor: pv.id==='alloc'?'default':'pointer', transition:'background 0.1s',
                          background: drillFilter?.value===d.name ? 'var(--green-dim)' : 'transparent',
                          border: '1px solid', borderColor: drillFilter?.value===d.name ? 'rgba(58,154,181,0.25)' : 'transparent'}}
                        onMouseEnter={e=>{if(pv.id!=='alloc')e.currentTarget.style.background='var(--surface2)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background=drillFilter?.value===d.name?'var(--green-dim)':'transparent';
                          e.currentTarget.style.borderColor=drillFilter?.value===d.name?'rgba(58,154,181,0.25)':'transparent';}}>
                        <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
                        <span className="mono" style={{fontSize:11,color:'var(--text2)',flex:1,
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name}</span>
                        <span className="mono" style={{fontSize:11,color:'var(--text)',fontWeight:600}}>{d.value}%</span>
                        <span className="mono" style={{fontSize:10,color:'var(--text3)'}}>€{(d.rawVal/1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                  {pv.id !== 'alloc' && !drillFilter && (
                    <div className="mono" style={{fontSize:9,color:'var(--text3)',marginTop:12,textAlign:'center',opacity:0.7}}>
                      ↑ Click a slice or item to filter
                    </div>
                  )}
                </div>

                {/* Drill-down panel */}
                <div className="card" style={{padding:0,overflow:'hidden',alignSelf:'start'}}>
                  {!drillFilter ? (
                    <div style={{padding:'48px 24px',textAlign:'center'}}>
                      <div style={{fontSize:32,marginBottom:12,opacity:0.4}}>◎</div>
                      <div className="mono" style={{fontSize:11,color:'var(--text3)'}}>
                        Click a slice to see positions
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',
                        display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:10,height:10,borderRadius:3,flexShrink:0,
                          background:pv.data.find(d=>d.name===drillFilter.value)?.color||'var(--green)'}}/>
                        <div>
                          <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em'}}>{pv.label.toUpperCase()}</div>
                          <div className="mono" style={{fontSize:13,color:'var(--text)',fontWeight:600}}>{drillFilter.value}</div>
                        </div>
                        <div className="mono" style={{fontSize:10,color:'var(--text3)',marginLeft:4}}>
                          {displayRows.length} position{displayRows.length!==1?'s':''}
                        </div>
                        <button onClick={()=>setDrillFilter(null)}
                          style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',
                            color:'var(--text3)',fontSize:16,lineHeight:1,padding:'2px 6px'}}>✕</button>
                      </div>
                      <div>
                        {displayRows.map(pos => {
                          const val = pos.qty * pos.currentPrice;
                          const pnlpct = pos.avgPrice > 0 ? ((pos.currentPrice - pos.avgPrice) / pos.avgPrice * 100) : null;
                          const score = getScore(pos);
                          return (
                            <div key={pos.id} onClick={()=>onOpenStock(pos)}
                              style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',
                                borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'background 0.1s'}}
                              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                              <AssetLogo pos={pos}/>
                              <div style={{flex:1,minWidth:0}}>
                                <div className="mono" style={{fontSize:12,fontWeight:600}}>{displayTicker(pos)}</div>
                                <div style={{fontSize:10,color:'var(--text3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pos.name}</div>
                              </div>
                              <div style={{textAlign:'right',flexShrink:0}}>
                                <div className="mono" style={{fontSize:12,fontWeight:600}}>€{(val/1000).toFixed(0)}k</div>
                                {pnlpct!=null&&<div className="mono" style={{fontSize:10,color:pnlpct>=0?'var(--green)':'var(--red)'}}>{pnlpct>=0?'+':''}{pnlpct.toFixed(1)}%</div>}
                              </div>
                              {score!=null&&(
                                <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
                                  <div style={{width:28,height:4,borderRadius:2,background:'var(--surface2)',overflow:'hidden'}}>
                                    <div style={{height:'100%',width:score+'%',background:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)',borderRadius:2}}/>
                                  </div>
                                  <span className="mono" style={{fontSize:10,fontWeight:700,
                                    color:score>=70?'var(--green)':score>=40?'var(--gold)':'var(--red)'}}>{score}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUPABASE AUTH + AES-256-GCM ENCRYPTION
//
// Design: the user's login password is used to derive the encryption key
// via PBKDF2 (100k iterations, SHA-256) → AES-256-GCM.
// AuthGate derives the key on login/signup and stores it in a module-level
// variable so App can use it without ever prompting the user again.
// Supabase only ever stores: salt (hex) + iv (hex) + ciphertext (base64).
// Neither the server, the DB admin, nor we can decrypt without the password.
// ─────────────────────────────────────────────

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || '';
const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

// ── Module-level key store — set by AuthGate, read by App ──
// The CryptoKey never leaves RAM and is never serialised.
let _sessionCryptoKey = null;
let _sessionSalt      = null; // hex string, persisted in DB (not secret)

// ── WebCrypto helpers (pure functions, no React) ──────────
// TextEncoder/Decoder instantiated inside each function to avoid
// Vite minifier temporal dead zone issues with module-level const.
async function _deriveCryptoKey(password, saltHex) {
  const enc       = new TextEncoder();
  const saltBytes = Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16)));
  const baseKey   = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

async function _encryptPayload(key, obj) {
  const enc       = new TextEncoder();
  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const plainBuf  = enc.encode(JSON.stringify(obj));
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBuf);
  const ivHex     = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  const ctB64     = btoa(String.fromCharCode(...new Uint8Array(cipherBuf)));
  return { iv: ivHex, ct: ctB64 };
}

async function _decryptPayload(key, ivHex, ctB64) {
  const dec      = new TextDecoder();
  const iv       = Uint8Array.from(ivHex.match(/../g).map(h => parseInt(h, 16)));
  const ctBytes  = Uint8Array.from(atob(ctB64), ch => ch.charCodeAt(0));
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ctBytes);
  return JSON.parse(dec.decode(plainBuf));
}

function _randomSaltHex() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Auth hook ──────────────────────────────────
function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = still checking
  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) { _sessionCryptoKey = null; _sessionSalt = null; sessionStorage.removeItem('folio_pw'); } // clear key on logout
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);
  return session;
}

// ── Auth Gate ─────────────────────────────────
export function AuthGate({ children }) {
  const session   = useAuth();
  const [mode,    setMode]    = useState('login');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [invite,  setInvite]  = useState('');
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState(null);
  const [keyReady, setKeyReady] = useState(false); // true once key is derived
  const [deriving, setDeriving] = useState(false); // true while auto-deriving from sessionStorage

  const INVITE_CODE = import.meta.env.VITE_INVITE_CODE || '';

  // ── Once session exists, derive or set up the crypto key ──
  useEffect(() => {
    if (!session || !supabase || _sessionCryptoKey) { if (session) setKeyReady(true); return; }
    // Try to restore key from sessionStorage (survives page refresh, not tab close)
    const stored = sessionStorage.getItem('folio_pw');
    if (stored) {
      setDeriving(true);
      (async () => {
        try {
          const userId = session.user.id;
          const { data: row } = await supabase.from('portfolios').select('salt,iv,ciphertext').eq('user_id', userId).single();
          if (row?.salt) {
            _sessionSalt = row.salt;
            _sessionCryptoKey = await _deriveCryptoKey(stored, row.salt);
            // Only verify if there's actual ciphertext to decrypt
            if (row.ciphertext && row.iv) {
              await _decryptPayload(_sessionCryptoKey, row.iv, row.ciphertext);
            }
            setKeyReady(true);
            setDeriving(false);
            return;
          }
          // No row yet — key can't be derived, show unlock screen
          sessionStorage.removeItem('folio_pw');
          setDeriving(false);
        } catch {
          _sessionCryptoKey = null;
          sessionStorage.removeItem('folio_pw');
          setDeriving(false);
          // fall through to unlock screen
        }
      })();
    } else {
      // No stored password — stay on unlock screen (keyReady=false already)
    }
  }, [session]);

  if (!supabase) return children;

  if (session === undefined || deriving) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
        background:'#0a0f14',fontFamily:"'IBM Plex Mono',monospace"}}>
        <span style={{color:'#3d5060',fontSize:12,letterSpacing:'0.1em'}}>LOADING…</span>
      </div>
    );
  }

  if (session && keyReady) return children;


  // ── Unlock screen (page refresh — session exists but no key in RAM) ──
  const handleUnlock = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const userId = session.user.id;
      const { data: row } = await supabase.from('portfolios').select('salt,iv,ciphertext').eq('user_id', userId).single();
      if (!row?.salt) throw new Error('No encrypted data found.');
      _sessionSalt = row.salt;
      _sessionCryptoKey = await _deriveCryptoKey(pw, row.salt);
      if (row.ciphertext) await _decryptPayload(_sessionCryptoKey, row.iv, row.ciphertext); // verify key
      sessionStorage.setItem('folio_pw', pw);
      setKeyReady(true);
    } catch {
      setMsg({ type: 'error', text: 'Wrong password.' });
      _sessionCryptoKey = null;
    } finally {
      setLoading(false);
    }
  };

  if (session && !keyReady) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'var(--bg)',fontFamily:"'IBM Plex Mono',monospace"}}>
      <div style={{width:380,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:32}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:'var(--text)',marginBottom:6}}>foliologic</div>
          <div style={{fontSize:11,color:'var(--text3)',letterSpacing:'0.08em'}}>ENTER PASSWORD TO UNLOCK</div>
        </div>
        {msg && <div style={{padding:'8px 12px',borderRadius:6,marginBottom:16,fontSize:12,
          background:msg.type==='error'?'var(--red-dim)':'var(--green-dim)',
          color:msg.type==='error'?'var(--red)':'var(--green)',border:`1px solid ${msg.type==='error'?'var(--red)':'var(--green)'}`}}>{msg.text}</div>}
        <form onSubmit={handleUnlock}>
          <div style={{fontSize:11,color:'var(--text2)',marginBottom:6}}>Password</div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"
            className="inp" style={{marginBottom:16}} autoFocus/>
          <button type="submit" disabled={loading||!pw}
            className="btn btn-primary"
            style={{width:'100%',padding:11,fontSize:12,fontWeight:700,letterSpacing:'0.06em',
              opacity:loading||!pw?0.5:1}}>
            {loading ? 'UNLOCKING…' : 'UNLOCK'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:16}}>
          <button onClick={async()=>{await supabase.auth.signOut();setPw('');setMsg(null);}}
            style={{background:'none',border:'none',color:'#3d5060',fontSize:11,cursor:'pointer'}}>
            Sign out instead
          </button>
        </div>
      </div>
    </div>
  );

  // ── Form submit ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error;
        setMsg({ type: 'success', text: 'Check your email for a reset link.' });
        return;
      }

      if (mode === 'signup') {
        if (INVITE_CODE && invite.trim().toUpperCase() !== INVITE_CODE.toUpperCase())
          throw new Error('Invalid invite code.');
        const { error } = await supabase.auth.signUp({ email, password: pw });
        if (error) throw error;
        // Derive key + generate salt for new user
        const salt = _randomSaltHex();
        const key  = await _deriveCryptoKey(pw, salt);
        _sessionCryptoKey = key;
        _sessionSalt      = salt;
        // Store the salt in DB immediately (empty ciphertext for now)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('portfolios').upsert(
            { user_id: user.id, salt, iv: '', ciphertext: '', updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        }
        setMsg({ type: 'success', text: 'Account created! Check your email to confirm.' });
        setKeyReady(true);
        return;
      }

      // Login — derive key from password + stored salt
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;

      // Fetch salt from DB — or generate one if this is a brand new user
      const userId = signInData.user.id;
      const { data: row } = await supabase.from('portfolios').select('salt').eq('user_id', userId).single();
      if (row?.salt) {
        _sessionSalt      = row.salt;
        _sessionCryptoKey = await _deriveCryptoKey(pw, row.salt);
      } else {
        // No row yet — generate salt now, derive key, create the row
        const newSalt = _randomSaltHex();
        _sessionSalt      = newSalt;
        _sessionCryptoKey = await _deriveCryptoKey(pw, newSalt);
        await supabase.from('portfolios').upsert(
          { user_id: userId, salt: newSalt, iv: '', ciphertext: '', updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      }
      sessionStorage.setItem('folio_pw', pw);
      setKeyReady(true);

    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inp = { style: {
    width:'100%', padding:'11px 14px', background:'#111c24',
    border:'1px solid #1e2d3d', borderRadius:6, color:'#e8f0f7',
    fontSize:13, fontFamily:"'IBM Plex Mono',monospace",
    outline:'none', boxSizing:'border-box',
  }};

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'#0a0f14',fontFamily:"'IBM Plex Mono',monospace",padding:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
        .auth-inp:focus { border-color:#4aaec0 !important; }
        .auth-btn { transition:opacity 0.15s,transform 0.1s; }
        .auth-btn:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
        .auth-link { color:#4aaec0; cursor:pointer; background:none; border:none; font:inherit; padding:0; }
        .auth-link:hover { text-decoration:underline; }
      `}</style>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <img src={FOLIOLOGIC_LOGO} width={56} height={56} alt="" style={{borderRadius:12,marginBottom:12}}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",
            fontSize:32,fontWeight:700,color:'#e0ddd6',letterSpacing:'-0.02em',marginBottom:4}}>foliologic</div>
          <div style={{fontSize:9,color:'#3d5060',letterSpacing:'0.18em'}}>INTELLIGENT WEALTH NAVIGATION</div>
        </div>
        <div style={{background:'#0d1821',border:'1px solid #1e2d3d',borderRadius:12,padding:32}}>
          <div style={{fontSize:11,color:'#7a9ab5',letterSpacing:'0.1em',marginBottom:24}}>
            {mode==='login'?'SIGN IN':mode==='signup'?'CREATE ACCOUNT':'RESET PASSWORD'}
          </div>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <input {...inp} className="auth-inp" type="email" placeholder="Email address"
              value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
            {mode !== 'forgot' && (
              <input {...inp} className="auth-inp" type="password"
                placeholder={mode==='signup'?'Choose a password (min 8 chars)':'Password'}
                value={pw} onChange={e=>setPw(e.target.value)} required
                minLength={mode==='signup'?8:undefined}
                autoComplete={mode==='signup'?'new-password':'current-password'}/>
            )}
            {mode==='signup' && INVITE_CODE && (
              <input {...inp} className="auth-inp" type="text" placeholder="Invite code"
                value={invite} onChange={e=>setInvite(e.target.value)} required/>
            )}
            {mode==='signup' && (
              <div style={{fontSize:9,color:'#3d5060',lineHeight:1.7,padding:'8px 0'}}>
                🔐 Your portfolio will be <strong style={{color:'#7a9ab5'}}>end-to-end encrypted</strong> using your password.
                If you forget it, your data cannot be recovered.
              </div>
            )}
            {msg && (
              <div style={{fontSize:11,padding:'10px 12px',borderRadius:6,
                background:msg.type==='error'?'rgba(224,96,96,0.12)':'rgba(58,154,181,0.1)',
                color:msg.type==='error'?'#e06060':'#4aaec0',
                border:`1px solid ${msg.type==='error'?'rgba(224,96,96,0.3)':'rgba(58,154,181,0.2)'}`}}>
                {msg.text}
              </div>
            )}
            <button type="submit" disabled={loading} className="auth-btn"
              style={{padding:'12px',background:'#4aaec0',color:'#0a0f14',border:'none',
                borderRadius:6,fontSize:12,fontWeight:600,fontFamily:'inherit',
                letterSpacing:'0.08em',cursor:loading?'not-allowed':'pointer',opacity:loading?0.6:1}}>
              {loading?'…':mode==='login'?'SIGN IN':mode==='signup'?'CREATE ACCOUNT':'SEND RESET LINK'}
            </button>
          </form>
          <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
            {mode==='login' && (<>
              <button className="auth-link" style={{fontSize:10}} onClick={()=>{setMode('forgot');setMsg(null);}}>Forgot password?</button>
              <div style={{fontSize:10,color:'#3d5060'}}>No account?{' '}
                <button className="auth-link" onClick={()=>{setMode('signup');setMsg(null);}}>Request access</button>
              </div>
            </>)}
            {mode==='signup' && <div style={{fontSize:10,color:'#3d5060'}}>Already have an account?{' '}
              <button className="auth-link" onClick={()=>{setMode('login');setMsg(null);}}>Sign in</button></div>}
            {mode==='forgot' && <button className="auth-link" style={{fontSize:10}}
              onClick={()=>{setMode('login');setMsg(null);}}>← Back to sign in</button>}
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:20,fontSize:9,color:'#1e2d3d',letterSpacing:'0.08em'}}>
          © 2025 FOLIOLOGIC — INVITE ONLY BETA
        </div>
      </div>
    </div>
  );
}


// Theme color palettes — used in JS where CSS variables can't be accessed directly (charts, canvas etc.)
const THEME_COLORS = {
  light: {
    bg: '#ffffff', surface: '#f7f4ee', surface2: '#f0ebe1',
    border: '#d4cbb5', border2: '#c4b9a0',
    text: '#1A314E', text2: '#5e7082', text3: '#94a3b4',
    green: '#2d8a5e', red: '#c92a2a', gold: '#b8a04c', blue: '#2A758D', violet: '#7c5cbf',
    gridLine: '#d4cbb5', shadow: 'rgba(0,0,0,0.12)',
  },
  dark: {
    bg: '#0f1a28', surface: '#162033', surface2: '#1a2d42',
    border: '#243548', border2: '#2e4158',
    text: '#e0ddd6', text2: '#7a8a98', text3: '#3d5060',
    green: '#4aaec0', red: '#e06060', gold: '#d4c06a', blue: '#5ab8cc', violet: '#a78bfa',
    gridLine: '#243548', shadow: 'rgba(0,0,0,0.6)',
  }
};

export default function App() {
  const [positions,    setPositions]    = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets,      setWallets]      = useState([
    { id: 'bitvavo',      name: 'Bitvavo',       type: 'broker',      color: '#1a73e8' },
    { id: 'smartbroker',  name: 'Smartbroker+',  type: 'broker',      color: '#4aaec0' },
    { id: 'trade_rep',    name: 'Trade Republic', type: 'broker',     color: '#00b386' },
  ]);
  const [showColdWalletModal, setShowColdWalletModal] = useState(null); // { transfers: [{symbol,qty,name}] }
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceStatus,  setPriceStatus]  = useState(null);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  // ── Theme ────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('folio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // System preference detection
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });
  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    localStorage.setItem('folio_theme', theme);
  }, [theme]);
  const tc = THEME_COLORS[theme]; // theme color palette for JS-only contexts (charts, canvas)

  const [nav,          setNav]          = useState("dashboard");
  const [prevNav,      setPrevNav]      = useState("dashboard");
  const [screenerTab,  setScreenerTab]  = useState('stock'); // 'stock' | 'etf'
  const [showModal,    setShowModal]    = useState(false); // legacy, keep for compat
  const [txModal,      setTxModal]      = useState(null);  // {mode:'buy'|'sell'|'cash'}
  const [transferModal, setTransferModal] = useState(null); // {direction:'to_cold'|'from_cold', pos}
  const [showAddMenu,  setShowAddMenu]  = useState(false); // dropdown
  const addMenuRef = React.useRef(null);
  React.useEffect(() => {
    if (!showAddMenu) return;
    const close = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    // Use setTimeout so this listener doesn't catch the opening click
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', close); };
  }, [showAddMenu]);
  const [showImport,   setShowImport]   = useState(false);
  const [range,        setRange]        = useState("1Y");
  const [activeBrokers,setActiveBrokers]= useState({"Bitvavo":true,"Smartbroker+":true,"Trade Republic":true,"Manual":true});
  const [activeBM,     setActiveBM]     = useState(["sp500"]);
  const [fBroker,      setFBroker]      = useState("All");
  const [fType,        setFType]        = useState("All");
  const [sortBy,       setSortBy]       = useState("value");
  const [sortDir,      setSortDir]      = useState("desc");
  const [newPos,       setNewPos]       = useState({symbol:"",name:"",type:"stock",qty:"",avgPrice:"",currentPrice:"",broker:"Smartbroker+"});
  const [txForm,       setTxForm]       = useState({symbol:"",name:"",qty:"",price:"",date:"",amount:"",cashType:"deposit"});
  const [txFormErr,    setTxFormErr]    = useState("");
  const [txSearch,     setTxSearch]     = useState([]);
  const [txSearchLoading, setTxSearchLoading] = useState(false);
  const [selectedPos,  setSelectedPos]  = useState(null);
  const [manualResolvePos, setManualResolvePos] = useState(null); // position needing manual ticker input

  // ── Shared Watchlist state ──
  const mkDefaultWL = () => ([{
    id: 'portfolio', name: 'Portfolio',
    categories: [{ id: 'cat_default', name: 'Uncategorized', items: [] }]
  }]);
  const [watchlists,  setWatchlists]  = useState(mkDefaultWL);
  const [activeWLId,  setActiveWLId]  = useState('portfolio');
  const [chartTicker, setChartTicker] = useState('');

  // Single ref that always holds latest state — updated in one effect after ALL state is declared.
  // This avoids Vite TDZ crashes from individual per-state ref effects.
  const positionsRef = React.useRef([]);
  const stateRef = React.useRef({ positions: [], transactions: [], watchlists: [], coldWallets: [] });
  React.useEffect(() => {
    positionsRef.current = positions;
    stateRef.current = {
      positions, transactions, watchlists,
      coldWallets: wallets.filter(w => w.type === 'cold_wallet'),
    };
  }); // no dependency array — runs after every render, always current

  // ─────────────────────────────────────────────
  // CLOUD SYNC — AES-256-GCM encrypted via Supabase
  // ─────────────────────────────────────────────
  const [cloudLoading, setCloudLoading] = React.useState(!!supabase);
  const [cloudSaving,  setCloudSaving]  = React.useState(false);
  const saveTimerRef  = React.useRef(null);
  const loadedRef     = React.useRef(false);

  // ── Save ──────────────────────────────────────
  const triggerSave = React.useCallback(async () => {
    if (!supabase || !_sessionCryptoKey) return;
    try {
      setCloudSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      if (!_sessionSalt) {
        const { data: row } = await supabase.from('portfolios').select('salt').eq('user_id', user.id).single();
        if (row?.salt) { _sessionSalt = row.salt; }
        else {
          _sessionSalt = _randomSaltHex();
          await supabase.from('portfolios').upsert(
            { user_id: user.id, salt: _sessionSalt, iv: '', ciphertext: '', updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        }
      }
      // Strip live price fields — always re-fetched on load, never persisted
      const { positions: rawPos, ...restState } = stateRef.current;
      const saveState = {
        ...restState,
        positions: rawPos.map(({ currentPrice, dailyChange, ...p }) => p),
      };
      const { iv, ct } = await _encryptPayload(_sessionCryptoKey, saveState);
      const { error } = await supabase.from('portfolios').upsert(
        { user_id: user.id, salt: _sessionSalt, iv, ciphertext: ct, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
    } catch (e) { console.warn('Cloud save error:', e.message); }
    finally { setCloudSaving(false); }
  }, []);

  // ── Load on mount ─────────────────────────────
  React.useEffect(() => {
    if (!supabase) { setCloudLoading(false); loadedRef.current = true; return; }
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setCloudLoading(false); loadedRef.current = true; return; }
        const { data, error } = await supabase
          .from('portfolios').select('salt, iv, ciphertext')
          .eq('user_id', user.id).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (data && data.ciphertext && data.ciphertext.length > 0 && _sessionCryptoKey) {
          const plain = await _decryptPayload(_sessionCryptoKey, data.iv, data.ciphertext);
          if (plain.positions && plain.positions.length) {
            // v108 migration: clear all fmpTicker values from previous versions that may have
            // stored wrong resolutions (e.g. v105 ISIN_MAP shortcuts, v106 name mismatch false positives).
            // The corrected pipeline (v108+) will re-resolve all positions from their ISINs on first fetchPrices.
            // This migration runs once — after re-resolution, correct fmpTicker values are saved back to Supabase.
            const MIGRATION_KEY = 'folio_migration_v113';
            const needsMigration = !localStorage.getItem(MIGRATION_KEY);
            const loaded = plain.positions.map(p => {
              if (needsMigration) {
                // Clear fmpTicker for clean re-resolution
                // Re-run inferType to reclassify derivatives that were previously tagged as "stock"
                const correctedType = inferType(p.fmpTicker || p.symbol, p.isin, p.name, null);
                const { fmpTicker, ...rest } = p;
                return { ...rest, type: correctedType, currentPrice: rest.currentPrice || rest.avgPrice || 0 };
              }
              return { ...p, currentPrice: p.currentPrice || p.avgPrice || 0 };
            });
            if (needsMigration) {
              console.log('[folio] v110 migration: cleared fmpTicker + re-ran inferType on all positions');
              localStorage.setItem(MIGRATION_KEY, Date.now().toString());
            }
            setPositions(loaded);
          }
          if (plain.transactions && plain.transactions.length) setTransactions(plain.transactions);
          if (plain.watchlists   && plain.watchlists.length)   setWatchlists(plain.watchlists);
          if (plain.coldWallets  && plain.coldWallets.length)  setWallets(prev => {
            const defaultBrokers = prev.filter(w => w.type !== 'cold_wallet');
            return [...defaultBrokers, ...plain.coldWallets];
          });
        }
      } catch (e) { console.warn('Cloud load error:', e.message); }
      finally { setCloudLoading(false); loadedRef.current = true; }
    })();
  }, []);

  // ── Auto-save (debounced 1.5s) ────────────────
  React.useEffect(() => {
    if (!supabase) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(triggerSave, 1500);
    return () => clearTimeout(saveTimerRef.current);
  }, [positions, transactions, watchlists, wallets, triggerSave]);

  // Keep Portfolio watchlist in sync with positions
  React.useEffect(() => {
    const pts = positions
      .filter(p => p.type !== 'crypto' && p.type !== 'derivative' && p.symbol && !isISIN(p.symbol))
      .map(p => ({ symbol: p.fmpTicker || p.symbol, name: p.name || p.symbol, flag: null, order: 0 }));
    setWatchlists(prev => prev.map(wl => {
      if (wl.id !== 'portfolio') return wl;
      // Merge: preserve flags/order for existing items, add new ones to Uncategorized
      const allItems = wl.categories.flatMap(cat => cat.items);
      const existingMap = Object.fromEntries(allItems.map(it => [it.symbol, it]));
      const newItems = pts.map(p => existingMap[p.symbol] ? existingMap[p.symbol] : p);
      // Put all back in first category (Uncategorized) if structure is empty
      const hasItems = wl.categories.some(cat => cat.items.length > 0);
      if (!hasItems) {
        return { ...wl, categories: [{ id: 'cat_default', name: 'Uncategorized', items: newItems }] };
      }
      // Add newly imported positions to Uncategorized that aren't already anywhere
      const everywhere = new Set(allItems.map(i => i.symbol));
      const brandNew = newItems.filter(i => !everywhere.has(i.symbol));
      if (!brandNew.length) return wl;
      return { ...wl, categories: wl.categories.map((cat, idx) =>
        idx === 0 ? { ...cat, items: [...cat.items, ...brandNew] } : cat
      )};
    }));
    if (!chartTicker && pts.length) setChartTicker(pts[0].symbol);
  }, [positions]);

  // ── Fetch live prices ──
  // ── Data fetching — powered by FMP (Financial Modeling Prep) ──
  // All calls go through /api/fmp Vercel proxy to keep key server-side
  const fmpGet = useCallback(async (path) => {
    const r = await fetch('/api/fmp?path=' + encodeURIComponent(path));
    if (!r.ok) throw new Error('fmp ' + r.status);
    const text = await r.text();
    if (text.startsWith('Premium') || text.includes('Premium Query')) throw new Error('Premium');
    let data;
    try { data = JSON.parse(text); } catch(e) { throw new Error('parse: ' + text.slice(0,80)); }
    if (data?.error === 'Premium' || data?.['Error Message']?.includes('Premium')) throw new Error('Premium');
    if (data?.['Error Message']) throw new Error(data['Error Message']);
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  // Fetch quotes for a list of tickers — returns map { symbol: {price, change, prevClose} }
  // Uses changePercentage from FMP stable API (v3 used changesPercentage); falls back to previousClose
  const fetchQuotes = useCallback(async (tickers) => {
    if (!tickers.length) return {};
    const map = {};
    let premiumErrors = 0;
    let emptyResults = 0;
    let networkErrors = 0;
    // FMP free plan: single ticker per request — run concurrently (max 5 at once)
    const CONCURRENCY = 5;
    for (let i = 0; i < tickers.length; i += CONCURRENCY) {
      const slice = tickers.slice(i, i + CONCURRENCY);
      setPriceStatus(`Fetching ${slice.join(', ')} (${i+1}–${Math.min(i+CONCURRENCY,tickers.length)} of ${tickers.length})`);
      await Promise.all(slice.map(async ticker => {
        try {
          const data = await fmpGet('/quote?symbol=' + encodeURIComponent(ticker));
          const arr = Array.isArray(data) ? data : (data ? [data] : []);
          if (arr.length === 0) { emptyResults++; return; }
          arr.forEach(q => {
            if (!q?.symbol) return;
            let chg = q.changePercentage ?? q.changesPercentage ?? q.changePercent ?? null;
            if (chg == null && q.previousClose > 0 && q.price != null) {
              chg = (q.price - q.previousClose) / q.previousClose * 100;
            }
            map[q.symbol] = { price: q.price, change: chg, mktcap: q.marketCap, prevClose: q.previousClose, exchange: q.exchange };
          });
        } catch(e) {
          if (e.message === 'Premium') premiumErrors++;
          else networkErrors++;
        }
      }));
    }
    if (premiumErrors > 0 || networkErrors > 0 || emptyResults > 0) {
      console.log(`[folio] fetchQuotes: ${Object.keys(map).length} OK, ${premiumErrors} Premium-blocked, ${emptyResults} empty, ${networkErrors} errors (of ${tickers.length} tickers)`);
    }
    return map;
  }, [fmpGet]);

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
      const cryptoPos = cur.filter(p=>p.type==='crypto'&&(p.coinId||p.symbol));
      if(cryptoPos.length){
        const ids=[...new Set(cryptoPos.map(p=>p.coinId||getCoinId(p.symbol)))].join(',');
        try {
          const cg = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=eur&include_24hr_change=true').then(r=>r.json());
          setPositions(prev=>prev.map(p=>p.type==='crypto'&&(p.coinId||p.symbol)&&cg[p.coinId||getCoinId(p.symbol)]?.eur?{
            ...p,
            currentPrice:cg[p.coinId||getCoinId(p.symbol)].eur,
            dailyChange:cg[p.coinId||getCoinId(p.symbol)]?.eur_24h_change??null
          }:p));
        } catch(e){}
      }

      // Stocks/ETFs: FMP
      const stockPos = cur.filter(p=>p.type!=='crypto'&&p.type!=='derivative');
      if(!stockPos.length){ setLastUpdated(new Date()); return; }
      // isRealTicker: true if symbol looks like an exchange ticker (1-5 letters, optional .XX suffix)
      // false for WKNs (6 alphanumeric chars like "858301", "A2QHKM") or raw ISINs
      const isRealTicker = s => s && /^[A-Z]{1,5}(\.[A-Z]{1,3})?$/.test(s);

      const getT = p => {
        if(p.fmpTicker) return p.fmpTicker;
        // Symbol is an ISIN or WKN (non-ticker) — needs resolution
        if(!isRealTicker(p.symbol)) return null;
        // Symbol looks like a real ticker — apply exchange suffix if needed
        if(p.isin?.startsWith('DE')||p.isin?.startsWith('LU')) return p.symbol+'.DE';
        if(p.isin?.startsWith('IE')) return p.symbol+'.AS';
        return p.symbol;
      };
      // ── TICKER RESOLUTION PIPELINE ───────────────────────────────────────────
      // Step 0: Supabase isin_ticker_map (shared, instant, crowd-sourced)
      // Step 1: FMP /search-isin (trust ISIN, no name validation)
      // Step 2: FMP /search-name progressive fallback
      // Every successful resolution saved to Supabase isin_ticker_map for all users.
      const resolvedTickerMap = {}; // isin → { ticker, type }

      const pickFromResults = (res, isin) => {
        if(!Array.isArray(res)||!res.length) return null;
        if(isin?.startsWith('US'))
          return res.filter(r=>!r.symbol?.includes('.')).sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0]
            || res.sort((a,b)=>(b.marketCap||0)-(a.marketCap||0))[0] || res[0];
        return res.find(r=>r.symbol?.endsWith('.DE'))
          || res.find(r=>r.symbol?.endsWith('.F'))
          || res.find(r=>r.symbol?.endsWith('.AS')||r.symbol?.endsWith('.PA'))
          || res.find(r=>r.marketCap>0) || res[0];
      };

      const nameMatches = (fmpName, posName) => {
        if (!fmpName || !posName) return true;
        const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
        const fmpN = normalize(fmpName);
        const posN = normalize(posName);
        return fmpN.startsWith(posN.slice(0, 4)) || posN.startsWith(fmpN.slice(0, 4));
      };

      const buildSearchQueries = (name) => {
        const cleaned = name
          .replace(/\s*\(.*?\)\s*/g, ' ')
          .replace(/U\.?ETF|ETF|ETC|ETP|UCITS/gi, '')
          .replace(/\s+(Inc\.?|Corp\.?|Ltd\.?|Group\.?|PLC|SE|AG|Co\.?|GmbH|B\.V\.|& Co\.?)$/i, '')
          .replace(/[^a-zA-Z0-9\s&-]/g, ' ')
          .replace(/\s+/g, ' ').trim();
        const words = cleaned.split(' ').filter(w => w.length > 1);
        const queries = [];
        if (words.length >= 3) queries.push(words.slice(0, 3).join(' '));
        if (words.length >= 2) queries.push(words.slice(0, 2).join(' '));
        if (words.length >= 1) queries.push(words[0]);
        return [...new Set(queries)];
      };

      // Collect positions needing resolution
      const allUnresolved = [...new Set(
        stockPos.filter(p => !p.fmpTicker && p.isin).map(p => p.isin)
      )];

      if (allUnresolved.length) {
        const BATCH2 = 5;
        const delay2 = ms => new Promise(r => setTimeout(r, ms));

        // Step 0: Supabase isin_ticker_map (shared across all users)
        const sharedMap = await batchLookupISINs(allUnresolved);
        const afterShared = [];
        for (const isin of allUnresolved) {
          if (sharedMap[isin]) {
            const rep = stockPos.find(p => p.isin === isin);
            resolvedTickerMap[isin] = { ticker: sharedMap[isin], type: inferType(sharedMap[isin].split('.')[0], isin, rep?.name, rep?.type), source: 'map' };
          } else {
            afterShared.push(isin);
          }
        }
        if (Object.keys(sharedMap).length) {
          console.log('[folio] isin_ticker_map hits:', Object.entries(sharedMap).map(([k,v])=>k+'→'+v).join(', '));
        }

        // Step 1: FMP /search-isin — trust the ISIN
        const needsNameFallback = [];
        if (afterShared.length) {
          console.log('[folio] resolving', afterShared.length, 'ISINs via FMP /search-isin');
          for (let i = 0; i < afterShared.length; i += BATCH2) {
            const batch = afterShared.slice(i, i + BATCH2);
            await Promise.all(batch.map(async isin => {
              try {
                const res = await fmpGet('/search-isin?isin=' + isin);
                const pick = pickFromResults(res, isin);
                if (pick?.symbol) {
                  const rep = stockPos.find(p => p.isin === isin);
                  const resolvedTk = pick.symbol.split('.')[0].toUpperCase();
                  const correctedType = inferType(resolvedTk, isin, rep?.name, rep?.type);
                  resolvedTickerMap[isin] = { ticker: pick.symbol, type: correctedType, source: 'isin' };
                  saveISINTicker(isin, pick.symbol, pick.name || rep?.name, 'auto');
                  saveISINTicker(isin, pick.symbol, pick.name || rep?.name, 'auto');
                } else {
                  needsNameFallback.push(isin);
                }
              } catch(e) { needsNameFallback.push(isin); }
            }));
            if (i + BATCH2 < afterShared.length) await delay2(300);
          }
        }

        // Step 2: Name-based fallback with progressive search
        if (needsNameFallback.length) {
          console.log('[folio] name fallback needed for', needsNameFallback.length, 'ISINs:', needsNameFallback.join(', '));
          for (let i = 0; i < needsNameFallback.length; i += BATCH2) {
            const batch = needsNameFallback.slice(i, i + BATCH2);
            await Promise.all(batch.map(async isin => {
              try {
                const rep = stockPos.find(p => p.isin === isin);
                if (!rep?.name) return;
                const queries = buildSearchQueries(rep.name);
                let searchRes = [];
                for (const q of queries) {
                  if (searchRes.length) break;
                  try { searchRes = await fmpGet('/search-name?query=' + encodeURIComponent(q) + '&limit=5'); } catch(e) {}
                  if (!Array.isArray(searchRes) || !searchRes.length) {
                    try { searchRes = await fmpGet('/search?query=' + encodeURIComponent(q) + '&limit=5'); } catch(e) {}
                  }
                  if (!Array.isArray(searchRes) || !searchRes.length) searchRes = [];
                }
                if (!searchRes.length) {
                  console.log('[folio] name fallback: no results for "' + rep.name + '" (tried: ' + queries.join(', ') + ')');
                  return;
                }
                const matchingResults = searchRes.filter(r => nameMatches(r.name, rep.name));
                const pick = pickFromResults(matchingResults.length ? matchingResults : searchRes, isin);
                if (pick?.symbol) {
                  const resolvedTk = pick.symbol.split('.')[0].toUpperCase();
                  const correctedType = inferType(resolvedTk, isin, rep.name, rep.type);
                  // Price sanity: if the resolved result has a price, compare to CSV avgPrice
                  // If >3× different, this is likely the wrong product (e.g. US ARKX $30 vs EU UCITS €4)
                  const csvPrice = rep.avgPrice || rep.currentPrice || 0;
                  const fmpPrice = pick.price || 0;
                  const priceSuspicious = csvPrice > 0 && fmpPrice > 0 &&
                    (fmpPrice / csvPrice > 3 || csvPrice / fmpPrice > 3);
                  resolvedTickerMap[isin] = { ticker: pick.symbol, type: correctedType, source: 'name', priceSuspicious };
                  if (priceSuspicious) {
                    console.log('[folio] name fallback WARNING: price mismatch for', rep.name, '→', pick.symbol,
                      '(CSV:', csvPrice.toFixed(2), 'FMP:', fmpPrice.toFixed(2), 'ratio:', (fmpPrice/csvPrice).toFixed(1) + '×)');
                  }
                  saveISINTicker(isin, pick.symbol, pick.name || rep.name, 'name');
                  console.log('[folio] name fallback resolved:', rep.name, '→', pick.symbol);
                } else {
                  console.log('[folio] name fallback: could not resolve "' + rep.name + '"');
                }
              } catch(e) {}
            }));
            if (i + BATCH2 < needsNameFallback.length) await delay2(300);
          }
        }

        // Apply resolved tickers to local position objects
        stockPos.forEach(p => {
          if (resolvedTickerMap[p.isin]) {
            p.fmpTicker = resolvedTickerMap[p.isin].ticker;
            p.tickerSource = resolvedTickerMap[p.isin].source;
            if (resolvedTickerMap[p.isin].priceSuspicious) p._priceSuspicious = true;
          }
        });
        const resolvedEntries = Object.entries(resolvedTickerMap);
        if (resolvedEntries.length) {
          console.log('[folio] resolved ISINs:', resolvedEntries.map(([k,v])=>k+'→'+v.ticker).join(', '));
        }
      }
      // Build ticker list using local objects (already mutated above, no stale state issue)
      const rawTickers = stockPos.map(getT).filter(Boolean);
      const baseTickers = rawTickers.map(t => t.split('.')[0]).filter(t => !rawTickers.includes(t));
      const tickerList = [...new Set([...rawTickers, ...baseTickers])];
      if(!tickerList.length){ setLastUpdated(new Date()); return; }
      const qmap = await fetchQuotes(tickerList);
      console.log('[folio] tickerList:', tickerList.join(','));
      const qmapEntries = Object.entries(qmap);
      console.log('[folio] qmap hits:', qmapEntries.length, '/', tickerList.length, 'tickers');
      if(qmapEntries.length > 0) {
        console.log('[folio] qmap sample:', qmapEntries.slice(0,5).map(([k,v])=>`${k}:price=${v.price?.toFixed(2)},chg=${v.change?.toFixed(2)}`).join(' | '));
      } else {
        console.warn('[folio] qmap is EMPTY - FMP returned nothing for these tickers. European tickers (.DE, .F, .MI) require FMP Premium plan. Positions will use CSV import prices as fallback.');
      }
      setPositions(prev=>prev.map(p=>{
        if(p.type==='crypto'||p.type==='derivative') return p;
        const resolvedTicker = resolvedTickerMap[p.isin]?.ticker;
        const t = resolvedTicker || p.fmpTicker || getT(p);
        const q = qmap[t] || qmap[t?.split('.')[0]] || qmap[p.symbol];
        if(!q?.price) {
          // FMP returned nothing (Premium-blocked or not in database)
          // Keep existing price, or fall back to avgPrice from CSV import
          const keepPrice = p.currentPrice > 0 ? p.currentPrice : (p.avgPrice || 0);
          const extra2 = resolvedTickerMap[p.isin]
            ? { fmpTicker: resolvedTickerMap[p.isin].ticker, type: resolvedTickerMap[p.isin].type, tickerSource: resolvedTickerMap[p.isin].source }
            : {};
          return {...p, ...extra2, currentPrice: keepPrice };
        }
        const rawPrice = (p.isin?.startsWith('US') || (!t?.includes('.') && p.type!=='etf'))
          ? q.price / eurUsd  // USD stocks → EUR
          : (q.exchange === 'NYSE' || q.exchange === 'NASDAQ' || q.exchange === 'AMEX')
            ? q.price / eurUsd  // US-listed ETF resolved from non-US ISIN → convert USD
            : q.price;          // EUR/other already in local currency
        // Sanity check: compare FMP price against BOTH currentPrice and avgPrice (CSV cost basis).
        // This catches cases where currentPrice was already overwritten in a prior session (e.g. ARKX $30).
        // Use stricter 3× threshold for name-fallback, standard 5× for other sources.
        const priorPrice = p.currentPrice;
        // Also apply any resolved ticker/type from this run
        const extra = resolvedTickerMap[p.isin]
          ? { fmpTicker: resolvedTickerMap[p.isin].ticker, type: resolvedTickerMap[p.isin].type, tickerSource: resolvedTickerMap[p.isin].source,
              ...(resolvedTickerMap[p.isin].priceSuspicious ? { _priceSuspicious: true } : {}) }
          : {};
        const source = extra.tickerSource || p.tickerSource;
        const sanityThreshold = (source === 'name') ? 3 : 5;
        // Check against currentPrice
        const priorSuspicious = priorPrice > 0 && rawPrice > 0 &&
          (rawPrice / priorPrice > sanityThreshold || priorPrice / rawPrice > sanityThreshold);
        // ALSO check against avgPrice — catches cases where currentPrice already equals the wrong FMP price
        const avgPrice = p.avgPrice || 0;
        const avgSuspicious = avgPrice > 0 && rawPrice > 0 &&
          (rawPrice / avgPrice > sanityThreshold || avgPrice / rawPrice > sanityThreshold);
        const priceSuspicious = priorSuspicious || avgSuspicious;
        const price = priceSuspicious ? (avgPrice > 0 ? avgPrice : (priorPrice > 0 ? priorPrice : rawPrice)) : rawPrice;
        // Mark for resolve badge if price is suspicious
        if (priceSuspicious) extra._priceSuspicious = true;
        // Preserve existing _priceSuspicious from resolution phase
        if (p._priceSuspicious && !extra._priceSuspicious) extra._priceSuspicious = true;
        return {...p, ...extra, currentPrice: price, dailyChange: q.change ?? null};
      }));
      setLastUpdated(new Date());
    } catch(e){ console.warn('fetchPrices error:',e); }
    finally{ setPriceLoading(false); setPriceStatus(null); }
  }, [fmpGet]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);
  // Also trigger when positions are first populated (e.g. after CSV import or localStorage restore)
  const prevLenRef = React.useRef(0);
  useEffect(() => {
    if (positions.length > 0 && prevLenRef.current === 0) {
      fetchPrices();
    }
    prevLenRef.current = positions.length;
  }, [positions.length, fetchPrices]);

  // Derived values
  // Ensure every unique broker/wallet in positions has an activeBrokers entry
  React.useEffect(() => {
    const brokers = [...new Set(positions.map(p => p.broker).filter(Boolean))];
    setActiveBrokers(prev => {
      const next = { ...prev };
      brokers.forEach(b => { if (next[b] === undefined) next[b] = true; });
      return next;
    });
  }, [positions.map(p=>p.broker).join(',')]);

  const vis = useMemo(()=>positions.filter(p=>p.qty>0&&(activeBrokers[p.broker]!==false)),[positions,activeBrokers]);
  const totalVal  = useMemo(()=>vis.reduce((s,p)=>s+p.qty*p.currentPrice,0),[vis]);
  const totalCost = useMemo(()=>vis.reduce((s,p)=>s+p.qty*p.avgPrice,0),[vis]);
  const pnl       = totalVal-totalCost;
  const pnlPct    = (pnl/totalCost)*100;

  // ── Real historical chart ──────────────────────────────────────
  const [chartData,    setChartData]    = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError,   setChartError]   = useState(null);
  const [chartProgress, setChartProgress] = useState(null); // e.g. "Loading AAPL (3/18)..."

  // Benchmark ticker map for FMP
  const BM_TICKERS = {sp500:'SPY',nasdaq:'QQQ',dax:'DAX',btc:'BTCUSD'};

  // Invested = net cash deployed to broker = cumulative buys - cumulative sells
  // This approximates "money wired in minus money taken out" since we don't
  // have explicit deposit/withdrawal records in the Smartbroker export
  const investedChartData = useMemo(()=>{
    if(!transactions.length) return [];
    const months = RANGE_MONTHS[range] ?? 12;
    const now    = new Date(); now.setHours(0,0,0,0);
    const sorted0 = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));
    const requestedFrom = new Date(now); requestedFrom.setMonth(requestedFrom.getMonth()-Math.min(months,120));
    const firstTx = sorted0[0]?.date;
    const from = (firstTx && new Date(firstTx) > requestedFrom) ? new Date(firstTx) : requestedFrom;
    const fromStr = from.toISOString().slice(0,10);
    const toStr   = now.toISOString().slice(0,10);
    const totalDays = Math.round((now-from)/86400000);
    const sorted = sorted0;

    // Cumulative net invested = buys - sells (net cash deployed)
    let cumInvested = 0;
    sorted.filter(t=>t.date<fromStr).forEach(t=>{
      if(t.type==='buy') cumInvested+=t.amountEur;
      else if(t.type==='sell') cumInvested-=t.amountEur;
    });

    const inWindow = sorted.filter(t=>t.date>=fromStr&&t.date<=toStr);
    const step = Math.max(1, Math.floor(totalDays/200));
    const rows = [];
    let ti=0;
    for(let i=0;i<=totalDays;i+=step){
      const d = new Date(from); d.setDate(d.getDate()+i);
      const ds = d.toISOString().slice(0,10);
      while(ti<inWindow.length && inWindow[ti].date<=ds){
        const t=inWindow[ti++];
        if(t.type==='buy') cumInvested+=t.amountEur;
        else if(t.type==='sell') cumInvested-=t.amountEur;
      }
      rows.push({
        date: d.toLocaleDateString('de-DE',{day:'2-digit',month:'short'}),
        invested: +Math.max(0,cumInvested).toFixed(0),
      });
    }
    return rows;
  }, [transactions, range]);

  const fetchChart = useCallback(async () => {
    if(!transactions.length || !positions.length) return;
    setChartLoading(true); setChartError(null); setChartProgress(null);
    try {
      const months = RANGE_MONTHS[range] ?? 12;
      const now    = new Date(); now.setHours(0,0,0,0);
      const toStr  = now.toISOString().slice(0,10);

      // ── Sort ALL transactions ──
      const sorted = [...transactions].sort((a,b)=>a.date.localeCompare(b.date));

      // Clamp window start to first transaction date
      const requestedFrom = new Date(now);
      requestedFrom.setMonth(requestedFrom.getMonth() - Math.min(months, 120));
      const firstTxDate = sorted[0]?.date;
      const from = firstTxDate && new Date(firstTxDate) > requestedFrom
        ? new Date(firstTxDate) : requestedFrom;
      const fromStr = from.toISOString().slice(0,10);
      const totalDays = Math.round((now - from) / 86400000);
      const step = Math.max(1, Math.floor(totalDays / 200));

      // ── Build a unified key per position: isin for stocks, SYMBOL for crypto ──
      // This makes the chart work regardless of import method
      const posKey = p => {
        if (p.type === 'crypto') return 'CRYPTO:' + (p.symbol||'').toUpperCase();
        return p.isin || ('SYM:' + (p.symbol||'').toUpperCase());
      };
      const txKey = t => {
        if (t.type === 'crypto' || (!t.isin && positions.find(p=>p.symbol===t.symbol&&p.type==='crypto')))
          return 'CRYPTO:' + (t.symbol||'').toUpperCase();
        return t.isin || ('SYM:' + (t.symbol||'').toUpperCase());
      };

      // ── All unique keys across positions + transactions ──
      const allKeys = [...new Set([
        ...positions.map(posKey),
        ...sorted.map(t => {
          const isCrypto = positions.find(p => (p.symbol||'').toUpperCase() === (t.symbol||'').toUpperCase() && p.type === 'crypto');
          if (isCrypto || (t.isin == null && t.symbol)) return 'CRYPTO:' + (t.symbol||'').toUpperCase();
          return t.isin || ('SYM:' + (t.symbol||'').toUpperCase());
        }).filter(Boolean),
      ])].filter(Boolean);

      // ── Qty reconstruction per key per day ──
      // Ground truth = current position qty, work backwards using transactions
      const depotQty = {};
      positions.forEach(p => { depotQty[posKey(p)] = p.qty || 0; });

      const qtyByDay = {};
      allKeys.forEach(key => {
        const txs = sorted.filter(t => {
          const isCrypto = positions.find(p => (p.symbol||'').toUpperCase() === (t.symbol||'').toUpperCase() && p.type === 'crypto');
          const k = (isCrypto || (t.isin == null && t.symbol)) 
            ? 'CRYPTO:' + (t.symbol||'').toUpperCase()
            : (t.isin || ('SYM:' + (t.symbol||'').toUpperCase()));
          return k === key;
        });
        qtyByDay[key] = new Float64Array(totalDays + 1);
        for (let i = 0; i <= totalDays; i++) {
          const d = new Date(from); d.setDate(d.getDate() + i);
          const ds = d.toISOString().slice(0, 10);
          let qty = depotQty[key] || 0;
          txs.filter(t => t.date > ds).forEach(t => {
            if (t.type === 'buy' || t.type === 'transfer_in' || t.type === 'reward') qty -= (t.qty || 0);
            else if (t.type === 'sell' || t.type === 'transfer_out') qty += (t.qty || 0);
          });
          qtyByDay[key][i] = Math.max(0, qty);
        }
      });

      // ── EUR/USD rate ──
      let eurUsd = 1.085;
      try {
        const fx = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR').then(r=>r.json());
        eurUsd = 1 / (fx?.rates?.EUR || 0.92);
      } catch(e) {}

      // ── Price history map: key → { date → price in EUR } ──
      const priceByKey = {};
      const skippedTickers = [];

      // ── Stocks/ETFs via FMP ──
      const stockKeys = allKeys.filter(k => !k.startsWith('CRYPTO:'));
      
      // Resolve ISIN → FMP ticker
      const keyToTicker = {};
      const pickTicker = (results, isin) => {
        if (!Array.isArray(results) || !results.length) return null;
        if (isin?.startsWith('US')) {
          return (results.find(r => !r.symbol?.includes('.'))
            || results.find(r => r.marketCap > 0)
            || results[0])?.symbol || null;
        }
        return (results.find(r => r.symbol?.endsWith('.DE'))
          || results.find(r => r.symbol?.endsWith('.F'))
          || results.find(r => r.symbol?.endsWith('.AS') || r.symbol?.endsWith('.PA'))
          || results.find(r => r.marketCap > 0)
          || results[0])?.symbol || null;
      };

      // Use already-resolved fmpTicker from positions
      positions.forEach(p => {
        if (p.type === 'crypto') return;
        const k = posKey(p);
        if (p.fmpTicker) { keyToTicker[k] = p.fmpTicker; return; }
        if (p.isin && ISIN_MAP[p.isin]) { keyToTicker[k] = ISIN_MAP[p.isin]; return; }
      });

      // Search FMP for unresolved ISINs
      const needsSearch = stockKeys.filter(k => !keyToTicker[k] && k.length > 4 && !k.startsWith('SYM:'));
      if (needsSearch.length > 0) {
        setChartProgress(`Resolving ${needsSearch.length} ticker(s)…`);
        await Promise.all(needsSearch.slice(0, 30).map(async isin => {
          try {
            const res = await fmpGet('/search-isin?isin=' + isin);
            const t = pickTicker(res, isin);
            if (t) keyToTicker[isin] = t;
          } catch(e) {}
        }));
      }

      // Fetch historical prices for stocks
      const uniqueTickers = [...new Set(Object.values(keyToTicker))];
      const CONCURRENCY = 3;
      for (let ci = 0; ci < uniqueTickers.length; ci += CONCURRENCY) {
        const batch = uniqueTickers.slice(ci, ci + CONCURRENCY);
        setChartProgress(`Loading ${batch.join(', ')} (${ci+1}–${Math.min(ci+CONCURRENCY, uniqueTickers.length)} of ${uniqueTickers.length})…`);
        await Promise.all(batch.map(async ticker => {
          try {
            const data = await fmpGet('/historical-price-eod/full?symbol=' + ticker + '&from=' + fromStr + '&to=' + toStr);
            const hist = Array.isArray(data) ? data : (data?.historical || []);
            if (!hist.length) { skippedTickers.push(ticker + '(no data)'); return; }
            const keys = Object.entries(keyToTicker).filter(([,t]) => t === ticker).map(([k]) => k);
            const isUsd = !ticker.endsWith('.DE') && !ticker.endsWith('.F') && !ticker.endsWith('.AS') && !ticker.endsWith('.PA') && !ticker.endsWith('.L');
            keys.forEach(k => {
              priceByKey[k] = {};
              hist.forEach(h => { priceByKey[k][h.date] = isUsd ? h.close / eurUsd : h.close; });
            });
          } catch(e) {
            if (e.message === 'Premium') skippedTickers.push(ticker + '(premium)');
            else skippedTickers.push(ticker + '(err)');
          }
        }));
      }

      // ── Crypto via CoinGecko (by symbol, no ISIN needed) ──
      const cryptoKeys = allKeys.filter(k => k.startsWith('CRYPTO:'));
      const cryptoPositions = positions.filter(p => p.type === 'crypto' && p.qty > 0);
      setChartProgress(`Loading ${cryptoKeys.length} crypto price histories…`);
      await Promise.all(cryptoPositions.map(async p => {
        const key = posKey(p);
        const coinId = p.coinId || getCoinId(p.symbol);
        if (!coinId) return;
        try {
          const days = Math.min(365, months * 30 + 5);
          const cg = await fetch(
            'https://api.coingecko.com/api/v3/coins/' + coinId + '/market_chart?vs_currency=eur&days=' + days
          ).then(r => r.json());
          priceByKey[key] = {};
          (cg.prices || []).forEach(([ts, pr]) => {
            priceByKey[key][new Date(ts).toISOString().slice(0, 10)] = pr;
          });
        } catch(e) { skippedTickers.push(p.symbol + '(cg-err)'); }
      }));

      // ── Benchmark history ──
      // SPY, QQQ, GBTC are USD-priced — divide by eurUsd to get EUR equivalent.
      // EWG (DAX proxy) is also USD-listed on NYSE — same conversion applies.
      const BM_FMP = { sp500: 'SPY', nasdaq: 'QQQ', dax: 'EWG', btc: 'GBTC' };
      const bmPrices = {};
      await Promise.all(activeBM.map(async id => {
        try {
          const data = await fmpGet('/historical-price-eod/full?symbol=' + encodeURIComponent(BM_FMP[id]) + '&from=' + fromStr + '&to=' + toStr);
          bmPrices[id] = {};
          const bmHist = Array.isArray(data) ? data : (data?.historical || []);
          // All benchmark ETFs are USD-listed — convert to EUR for apples-to-apples comparison
          bmHist.forEach(h => { bmPrices[id][h.date] = h.close / eurUsd; });
        } catch(e) {}
      }));

      // ── Build carry-forward price maps ──
      const lastPrice = {};
      const priceOnDay = {};
      allKeys.forEach(k => { priceOnDay[k] = new Float64Array(totalDays + 1); });

      const lastBmPrice = {};
      const bmPriceOnDay = {};
      activeBM.forEach(id => { bmPriceOnDay[id] = new Float64Array(totalDays + 1); });

      for (let i = 0; i <= totalDays; i++) {
        const d = new Date(from); d.setDate(d.getDate() + i);
        const ds = d.toISOString().slice(0, 10);
        allKeys.forEach(k => {
          const p = priceByKey[k]?.[ds];
          if (p != null) lastPrice[k] = p;
          priceOnDay[k][i] = lastPrice[k] || 0;
        });
        activeBM.forEach(id => {
          if (bmPrices[id]?.[ds]) lastBmPrice[id] = bmPrices[id][ds];
          bmPriceOnDay[id][i] = lastBmPrice[id] || 0;
        });
      }

      // ── Time-Weighted Return (TWR) ──
      // TWR removes the effect of cash flows (deposits/withdrawals) so the % shows
      // pure investment performance — identical to how Finanzfluss computes it.
      //
      // Algorithm:
      //   For each day i, portVal(i) = sum(qty * price) for all positions.
      //   On days with a cash flow (deposit or withdrawal of amount CF):
      //     sub-period return = (portVal_before_CF - portVal_prev) / portVal_prev
      //   On other days:
      //     sub-period return = (portVal(i) - portVal(i-1)) / portVal(i-1)
      //   TWR index = product of (1 + sub-period return) — starts at 1.0
      //   Chart % = (TWR_index - 1) * 100
      //
      // Same logic applied to benchmark (SPY/QQQ etc.) — benchmark TWR = its own price return
      // since it has no cash flows of its own. SPY TWR over any period = SPY price return. ✓

      // Find seedDay: first day with both portfolio value AND benchmark prices
      let seedDay = 0;
      for (let i = 0; i <= totalDays; i++) {
        let v = 0;
        allKeys.forEach(k => {
          const qty = qtyByDay[k]?.[i] || 0; if (qty <= 0) return;
          const p = priceOnDay[k][i]; if (!p) return;
          v += qty * p;
        });
        if (v <= 0) continue;
        if (activeBM.every(id => bmPriceOnDay[id][i] > 0)) { seedDay = i; break; }
      }

      // Build a date→totalCashFlow map for the portfolio (all buys/sells)
      const cashFlowByDate = {};
      sorted.forEach(t => {
        if (t.type === 'buy' && t.amountEur > 0) cashFlowByDate[t.date] = (cashFlowByDate[t.date] || 0) + t.amountEur;
        else if (t.type === 'sell' && t.amountEur > 0) cashFlowByDate[t.date] = (cashFlowByDate[t.date] || 0) - t.amountEur;
      });

      // Compute TWR index day-by-day (full resolution, not stepped)
      const twrPort = new Float64Array(totalDays + 1);
      const twrBM = {};
      activeBM.forEach(id => { twrBM[id] = new Float64Array(totalDays + 1); });

      let prevPortVal = 0;
      const prevBMPrice = {};
      activeBM.forEach(id => { prevBMPrice[id] = 0; });

      for (let i = 0; i <= totalDays; i++) {
        const d = new Date(from); d.setDate(d.getDate() + i);
        const ds = d.toISOString().slice(0, 10);

        // Portfolio value on this day
        let portVal = 0;
        allKeys.forEach(k => {
          const qty = qtyByDay[k]?.[i] || 0; if (qty <= 0) return;
          const p = priceOnDay[k][i]; if (!p) return;
          portVal += qty * p;
        });

        if (i < seedDay) {
          twrPort[i] = 1;
          activeBM.forEach(id => { twrBM[id][i] = 1; });
          if (portVal > 0) prevPortVal = portVal;
          activeBM.forEach(id => { if (bmPriceOnDay[id][i] > 0) prevBMPrice[id] = bmPriceOnDay[id][i]; });
          continue;
        }

        if (i === seedDay) {
          twrPort[i] = 1;
          activeBM.forEach(id => { twrBM[id][i] = 1; });
          prevPortVal = portVal;
          activeBM.forEach(id => { prevBMPrice[id] = bmPriceOnDay[id][i]; });
          continue;
        }

        // Portfolio TWR: on days with cash flow, evaluate return BEFORE the cash flow hits
        // portVal already includes the new cash (it's qty-based), so subtract today's CF
        const cf = cashFlowByDate[ds] || 0;
        const portValBeforeCF = portVal - cf; // remove deposit / add back withdrawal
        const portReturn = prevPortVal > 0 ? (portValBeforeCF - prevPortVal) / prevPortVal : 0;
        twrPort[i] = twrPort[i - 1] * (1 + portReturn);
        prevPortVal = portVal; // after CF, this is the new base

        // Benchmark TWR: pure price return (no cash flows)
        activeBM.forEach(id => {
          const p = bmPriceOnDay[id][i];
          const pp = prevBMPrice[id];
          const bmReturn = (p > 0 && pp > 0) ? (p - pp) / pp : 0;
          twrBM[id][i] = twrBM[id][i - 1] * (1 + bmReturn);
          if (p > 0) prevBMPrice[id] = p;
        });
      }

      // ── Assemble rows ──
      const rows = [];
      for (let i = 0; i <= totalDays; i += step) {
        const d = new Date(from); d.setDate(d.getDate() + i);
        const baseRow = investedChartData[Math.round(i / step)] || {};
        const row = {
          date: baseRow.date || d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }),
          invested: baseRow.invested || 0,
        };
        if (i >= seedDay) {
          row.portfolio = +((twrPort[i] - 1) * 100).toFixed(2);
          activeBM.forEach(id => {
            if (twrBM[id][i] > 0) row[id] = +((twrBM[id][i] - 1) * 100).toFixed(2);
          });
        }
        rows.push(row);
      }

      setChartData(rows);
      if (skippedTickers.length > 0) {
        const covered = allKeys.length - skippedTickers.length;
        setChartError(`Partial data — ${covered}/${allKeys.length} positions loaded. Missing: ${skippedTickers.join(', ')}`);
      }
    } catch(e) { console.error('fetchChart:', e); setChartError(e.message); }
    finally { setChartLoading(false); setChartProgress(null); }
  }, [transactions, positions, range, activeBM, fmpGet, investedChartData]);

  useEffect(()=>{ fetchChart(); }, [fetchChart]);

  const chartDomain = useMemo(()=>{
    if(!chartData.some(r => r.portfolio != null)) return ['auto','auto'];
    let mn=Infinity, mx=-Infinity;
    chartData.forEach(row=>{
      ['portfolio',...activeBM].forEach(k=>{
        if(row[k]!=null){ if(row[k]<mn)mn=row[k]; if(row[k]>mx)mx=row[k]; }
      });
    });
    if(!isFinite(mn)) return ['auto','auto'];
    const pad = Math.max((mx-mn)*0.12, 3);
    return [Math.floor(mn-pad), Math.ceil(mx+pad)];
  },[chartData,activeBM]);
  const perfStats = useMemo(()=>{
    if(!chartData.length) return {};
    // chartData values are already % returns — last row value IS the total return
    const l = chartData[chartData.length-1];
    const st = {};
    ["portfolio",...activeBM].forEach(k=>{
      if(l[k] != null) st[k] = l[k]; // already a % number
    });
    return st;
  },[chartData,activeBM]);

  const allocData = useMemo(()=>vis.map((p,i)=>({name:p.symbol,value:+((p.qty*p.currentPrice/totalVal)*100).toFixed(2),color:ALLOC_COLORS[i%ALLOC_COLORS.length]})),[vis,totalVal]);
  const byType    = useMemo(()=>["crypto","stock","etf","etc","derivative"].map(t=>({name:t==='etc'?'ETC':t==='etf'?'ETF':t.toUpperCase(),value:+((vis.filter(p=>p.type===t).reduce((s,p)=>s+p.qty*p.currentPrice,0)/totalVal*100).toFixed(1)),color:t==="crypto"?"#f7931a":t==="stock"?"#4aaec0":t==="etc"?"#b8a04c":t==="derivative"?"#e06060":"#627eea"})).filter(x=>x.value>0),[vis,totalVal]);
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
      if(sortBy==="daily")  return mul*((a.dailyChange??-Infinity)-(b.dailyChange??-Infinity));
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

  // ── New transaction modal helpers ──────────────────────────────────────────
  const resetTxForm = () => {
    setTxForm({symbol:"",name:"",qty:"",price:"",date:new Date().toISOString().slice(0,10),amount:"",cashType:"deposit"});
    setTxFormErr(""); setTxSearch([]);
  };
  const openTxModal = (mode) => { resetTxForm(); setTxModal({mode}); setShowAddMenu(false); };

  // Ticker search for tx modal
  const searchTxTicker = async (q) => {
    if (!q || q.length < 1) { setTxSearch([]); return; }
    setTxSearchLoading(true);
    try {
      const r = await fetch('/api/screener?limit=8&exchange=NASDAQ&marketCapMin=100000000');
      // Use the existing fetchTickerSearch approach via fmp proxy
      const res = await fetch('/api/fmp?path=' + encodeURIComponent('/search?query=' + q.toUpperCase() + '&limit=8'));
      const data = await res.json();
      setTxSearch(Array.isArray(data) ? data.slice(0,6) : []);
    } catch { setTxSearch([]); }
    setTxSearchLoading(false);
  };

  const submitBuy = () => {
    const { symbol, name, qty, price, date } = txForm;
    if (!symbol || !qty || !price || !date) { setTxFormErr('Please fill all fields'); return; }
    const q = parseFloat(qty), p = parseFloat(price);
    if (isNaN(q)||q<=0) { setTxFormErr('Invalid quantity'); return; }
    if (isNaN(p)||p<=0) { setTxFormErr('Invalid price'); return; }
    const amountEur = q * p;
    const sym = symbol.toUpperCase();
    const txDate = date;

    // Check cash balance sanity
    const cashBalance = transactions.reduce((sum, t) => {
      if (t.type === 'deposit') return sum + t.amountEur;
      if (t.type === 'withdraw') return sum - t.amountEur;
      if (t.type === 'buy') return sum - t.amountEur;
      if (t.type === 'sell') return sum + t.amountEur;
      return sum;
    }, 0);
    const warn = cashBalance > 0 && amountEur > cashBalance
      ? `⚠ Cash balance (€${cashBalance.toFixed(0)}) may be insufficient for this buy (€${amountEur.toFixed(0)})`
      : '';

    // Add or update position
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === sym || p.symbol === symbol);
      if (existing) {
        // Update avg price and qty (weighted average)
        const newQty = existing.qty + q;
        const newAvg = ((existing.avgPrice||p) * existing.qty + p * q) / newQty;
        return prev.map(pos => pos === existing ? {...pos, qty: newQty, avgPrice: newAvg} : pos);
      } else {
        return [...prev, {
          id: Date.now()+'', symbol: sym, name: name||sym,
          type: 'stock', qty: q, avgPrice: p, currentPrice: p,
          broker: 'Manual', color: ALLOC_COLORS[prev.length % ALLOC_COLORS.length]
        }];
      }
    });

    // Add transaction
    setTransactions(prev => [...prev, {
      id: Date.now()+'', date: txDate, type: 'buy',
      symbol: sym, name: name||sym, qty: q, price: p, amountEur
    }]);

    setTxModal(null);
    if (warn) setTimeout(() => alert(warn), 200);
    setTimeout(fetchPrices, 300);
  };

  const submitSell = () => {
    const { symbol, qty, price, date } = txForm;
    if (!symbol || !qty || !price || !date) { setTxFormErr('Please fill all fields'); return; }
    const q = parseFloat(qty), p = parseFloat(price);
    if (isNaN(q)||q<=0) { setTxFormErr('Invalid quantity'); return; }
    if (isNaN(p)||p<=0) { setTxFormErr('Invalid price'); return; }
    const sym = symbol.toUpperCase();

    // Check position exists and has enough qty
    const existing = positions.find(pos => pos.symbol === sym || pos.symbol === symbol);
    if (!existing) { setTxFormErr('Position not found in portfolio'); return; }
    if (existing.qty < q) { setTxFormErr('Can only sell up to ' + existing.qty + ' shares'); return; }

    const amountEur = q * p;
    const newQty = existing.qty - q;

    setPositions(prev => newQty <= 0.00001
      ? prev.filter(pos => pos !== existing)
      : prev.map(pos => pos === existing ? {...pos, qty: newQty} : pos)
    );

    setTransactions(prev => [...prev, {
      id: Date.now()+'', date, type: 'sell',
      symbol: sym, name: existing.name||sym, qty: q, price: p, amountEur
    }]);

    setTxModal(null);
  };

  const submitCash = () => {
    const { amount, date, cashType } = txForm;
    if (!amount || !date) { setTxFormErr('Please fill all fields'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt)||amt<=0) { setTxFormErr('Invalid amount'); return; }

    if (cashType === 'withdraw') {
      // Sanity: compute available cash
      const cashBalance = transactions.reduce((sum, t) => {
        if (t.type === 'deposit') return sum + t.amountEur;
        if (t.type === 'withdraw') return sum - t.amountEur;
        if (t.type === 'buy') return sum - t.amountEur;
        if (t.type === 'sell') return sum + t.amountEur;
        return sum;
      }, 0);
      if (amt > cashBalance + 0.01) {
        setTxFormErr('⚠ Insufficient cash balance. Available: €' + cashBalance.toFixed(2));
        return;
      }
    }

    setTransactions(prev => [...prev, {
      id: Date.now()+'', date, type: cashType, amountEur: amt,
      symbol: '_CASH_', name: cashType === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal'
    }]);
    setTxModal(null);
  };

  // Compute cash balance for display in modal
  const cashBalance = React.useMemo(() => transactions.reduce((sum, t) => {
    if (t.type === 'deposit') return sum + t.amountEur;
    if (t.type === 'withdraw') return sum - t.amountEur;
    if (t.type === 'buy') return sum - t.amountEur;
    if (t.type === 'sell') return sum + t.amountEur;
    return sum;
  }, 0), [transactions]);

  // While loading cloud data, show a minimal splash to avoid empty flash
  if (cloudLoading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'var(--bg)',fontFamily:"'IBM Plex Mono',monospace",flexDirection:'column',gap:12}}>
      <style>{FONTS}{CSS}</style>
      <img src={FOLIOLOGIC_LOGO} width={48} height={48} alt="" style={{borderRadius:10}}/>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:'var(--text)'}}>foliologic</div>
      <div style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.15em'}}>LOADING YOUR PORTFOLIO…</div>
    </div>
  );

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"var(--bg)"}}>

        {/* ── Sidebar ── */}
        <div className="sidebar" style={{width:220,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:"20px 12px"}}>
          <div style={{padding:"4px 14px 24px",display:"flex",alignItems:"center",gap:12}}>
            <img src={FOLIOLOGIC_LOGO} width={56} height={56} alt="foliologic" style={{borderRadius:12}}/>
            <div>
              <div className="serif" style={{fontSize:18,fontWeight:700,color:"var(--text)"}}>foliologic</div>
              <div className="mono" style={{fontSize:8,color:"var(--accent)",letterSpacing:"0.08em",opacity:0.7}}>v122f</div>
            </div>
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
              <div style={{background:"var(--accent-dim)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"8px 10px"}}>
                <div className="mono" style={{fontSize:9,color:"var(--accent)",letterSpacing:"0.1em"}}>PRO PLAN</div>
                <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>All features unlocked</div>
              </div>
            </div>
          </div>
          {/* Sign out */}
          {supabase && (
            <button onClick={()=>supabase.auth.signOut()}
              style={{width:"100%",marginTop:8,padding:"7px 0",background:"none",
                border:"1px solid #1e2d3d",borderRadius:6,color:"#3d5060",fontSize:10,
                fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",cursor:"pointer",
                transition:"color 0.15s,border-color 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#e06060";e.currentTarget.style.borderColor="#e06060";}}
              onMouseLeave={e=>{e.currentTarget.style.color="#3d5060";e.currentTarget.style.borderColor="#1e2d3d";}}
            >SIGN OUT</button>
          )}
        </div>

        {/* ── Main ── */}
        {nav==="charts" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
            <ChartsPage positions={positions}
              watchlists={watchlists} setWatchlists={setWatchlists}
              activeWLId={activeWLId} setActiveWLId={setActiveWLId}
              chartTicker={chartTicker} setChartTicker={setChartTicker}
              onOpenStock={pos=>{ setPrevNav('portfolio'); setSelectedPos(pos); setNav("stock"); }}/>
          </div>
        )}
        {nav==="watchlist" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
            <WatchlistPage
              watchlists={watchlists} setWatchlists={setWatchlists}
              activeWLId={activeWLId} setActiveWLId={setActiveWLId}
              onOpenStock={pos=>{ setPrevNav('watchlist'); setSelectedPos(pos); setNav("stock"); }}
              onOpenChart={sym=>{ setChartTicker(sym); setNav("charts"); }}
              positions={positions}/>
          </div>
        )}
        <div className="main-scroll" style={{flex:1,overflow:"auto",padding:"26px 30px",display:(nav==="charts"||nav==="watchlist")?"none":"block"}}>

          {/* Header */}
          <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
            <div>
              <div className="serif" style={{fontSize:24,letterSpacing:"-0.02em"}}>
                {nav==="dashboard"?"Overview":nav==="portfolio"?"Portfolio":nav==="charts"?"Charts":nav==="watchlist"?"Watchlist":nav==="stock"&&selectedPos?selectedPos.symbol:nav==="screener"?"Screener":nav==="news"?"News Feed":"Settings"}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
                <span className="ldot"/>
                <span className="mono" style={{fontSize:10,color:"var(--text2)"}}>
                  {cloudSaving ? '☁ Saving…' : priceLoading ? `Fetching live prices${priceStatus ? ` — ${priceStatus}` : '…'}` : `Updated ${lastUpdated?.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}`}
                </span>
                {!priceLoading && (
                  <button onClick={fetchPrices} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",fontSize:11,padding:"0 4px"}} title="Refresh prices">↻</button>
                )}
                <PriceBadge loading={priceLoading}/>
              </div>
            </div>
            <div ref={addMenuRef}>
              <button className="btn btn-primary"
                onClick={e => { e.stopPropagation(); setShowAddMenu(v => !v); }}>
                + ADD ▾
              </button>
              {showAddMenu && (() => {
                const rect = addMenuRef.current?.getBoundingClientRect();
                return ReactDOM.createPortal(
                  <div style={{position:'fixed',
                    right: rect ? window.innerWidth - rect.right : 16,
                    top: rect ? rect.bottom + 4 : 50,
                    background:'var(--surface)',border:'1px solid var(--border2)',
                    borderRadius:8,padding:6,zIndex:99999,minWidth:170,
                    boxShadow:'var(--popover-shadow)'}}>
                    {[
                      {icon:'📈', label:'Buy Position',  mode:'buy'},
                      {icon:'📉', label:'Sell Position', mode:'sell'},
                      {icon:'💵', label:'Cash Movement', mode:'cash'},
                      {icon:'✏️',  label:'Manual Entry',  mode:'manual'},
                    ].map(({icon,label,mode})=>(
                      <div key={mode}
                        onClick={e => { e.stopPropagation(); mode==='manual' ? (setShowModal(true),setShowAddMenu(false)) : openTxModal(mode); }}
                        style={{padding:'9px 14px',cursor:'pointer',borderRadius:6,fontSize:12,
                          color:'var(--text2)',display:'flex',alignItems:'center',gap:10}}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{fontSize:15}}>{icon}</span> {label}
                      </div>
                    ))}
                  </div>,
                  document.body
                );
              })()}
            </div>
          </div>

          {nav==="dashboard"&&(<>

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


            <div className="fu2 kpi-grid" style={{display:"grid",gridTemplateColumns:`repeat(${transactions.some(t=>t.type==='deposit'||t.type==='withdraw')?5:4},1fr)`,gap:12,marginBottom:16}}>
              {[
                {label:"PORTFOLIO VALUE", val: priceLoading?"Loading…":`€${fmt(totalVal,0)}`, sub:`${vis.length} positions`, bar:null},
                {label:"TOTAL P&L",       val: priceLoading?"…":`${pnl>=0?"+":"-"}€${fmt(Math.abs(pnl),0)}`, sub:`${pnl>=0?"▲":"▼"} ${fmt(Math.abs(pnlPct))}%`, bar:pnl>=0?"g":"r"},
                {label:"INVESTED",        val:`€${fmt(totalCost,0)}`, sub:"Cost basis", bar:"n"},
                {label:"LIVE PRICES",     val: priceLoading?"Syncing…":"Active", sub:"CoinGecko + FMP", bar:priceLoading?null:"g"},
                ...(transactions.some(t=>t.type==='deposit'||t.type==='withdraw')?[
                  {label:"CASH BALANCE", val:`€${cashBalance.toFixed(2)}`, sub: cashBalance<0?'⚠ Mismatch detected':'Available cash', bar: cashBalance<0?'r':'g'}
                ]:[]),
              ].map((k,i)=>(
                <div key={i} className="card" style={{padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:k.bar==="g"?"var(--green)":k.bar==="r"?"var(--red)":"var(--border2)"}}/>
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:7}}>{k.label}</div>
                  <div className="mono" style={{fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:k.bar==="g"?"var(--green)":k.bar==="r"?"var(--red)":"var(--text)"}}>{k.val}</div>
                  <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* ═══ Sanity warning if cash balance negative ═══ */}
            {cashBalance < -1 && transactions.some(t=>t.type==='deposit'||t.type==='withdraw') && (
              <div className="mono" style={{fontSize:11,color:'var(--gold)',padding:'10px 16px',
                background:'rgba(255,196,0,0.08)',border:'1px solid rgba(255,196,0,0.2)',
                borderRadius:8,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
                ⚠ Cash mismatch detected — your buy transactions exceed recorded deposits by €{Math.abs(cashBalance).toFixed(2)}.
                Add missing cash deposits via <strong>+ ADD → Cash Movement</strong> to keep your records accurate.
              </div>
            )}

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
                      style={{fontSize:10,padding:"3px 10px",borderColor:range===r?"var(--green)":"var(--border)",color:range===r?"var(--green)":"var(--text3)",background:range===r?"rgba(58,154,181,0.08)":"transparent"}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {chartError && (
                <div style={{padding:"8px 12px",marginBottom:8,
                  background:chartError.includes('Partial')?"rgba(184,160,76,0.08)":"rgba(224,96,96,0.1)",
                  border:"1px solid "+(chartError.includes('Partial')?"rgba(184,160,76,0.3)":"rgba(224,96,96,0.3)"),
                  borderRadius:6,fontSize:11,color:chartError.includes('Partial')?"var(--gold)":"var(--red)",fontFamily:"IBM Plex Mono"}}>
                  ⚠ {chartError}
                </div>
              )}

              <div style={{display:"flex",gap:20,alignItems:"stretch"}}>
                {/* ── Performance Chart ── */}
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
                            <stop offset="5%" stopColor={tc.green} stopOpacity={0.15}/><stop offset="95%" stopColor={tc.green} stopOpacity={0}/>
                          </linearGradient>
                          {BENCHMARKS.map(b=>(
                            <linearGradient key={b.id} id={"g_"+b.id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={b.color} stopOpacity={0.10}/><stop offset="95%" stopColor={b.color} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={tc.gridLine} vertical={false}/>
                        <XAxis dataKey="date" tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:tc.text3}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                        <YAxis tick={{fontFamily:"IBM Plex Mono",fontSize:9,fill:tc.text3}} axisLine={false} tickLine={false} tickFormatter={v=>v.toFixed(0)+"%"} width={38} domain={chartDomain}/>
                        <Tooltip content={<ChartTip/>}/>
                        {activeBM.map(id=>{
                          const b=BENCHMARKS.find(x=>x.id===id);
                          return <Line key={id} type="linear" dataKey={id} name={b.label} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.75} dot={false} connectNulls isAnimationActive={false}/>;
                        })}
                        <Area type="linear" dataKey="portfolio" name="Portfolio" stroke="#4aaec0" strokeWidth={2.5} fill="url(#gPort)" dot={false}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                  <div className="mono" style={{fontSize:9,color:"var(--text3)",marginTop:4,textAlign:"right"}}>
                    {chartData.length ? "● REAL DATA — FMP" : transactions.length ? "● loading price history…" : ""}
                  </div>
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
                      style={{padding:"3px 9px",fontSize:9,...(fBroker===b?{color:"var(--green)",background:"var(--green-dim)",borderColor:"rgba(58,154,181,0.3)"}:{})}}>{b}</button>
                  ))}
                  <div style={{width:1,background:"var(--border)",margin:"0 2px"}}/>
                  {["All","stock","etf","crypto"].map(t=>(
                    <button key={t} className="pill" onClick={()=>setFType(t)}
                      style={{padding:"3px 9px",fontSize:9,textTransform:"uppercase",...(fType===t?{color:"var(--green)",background:"var(--green-dim)",borderColor:"rgba(58,154,181,0.3)"}:{})}}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Table header — sortable */}
              <div className="trow" style={{padding:"9px 18px",borderBottom:"1px solid var(--border2)",borderTop:"1px solid var(--border)"}}>
                {[["name","ASSET"],["qty","QTY"],["price","AVG PRICE"],["value","LIVE PRICE"],["daily","DAY %"],["pnl","P&L"],["pnlpct","P&L %"]].map(([col,label])=>{
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
                  <div key={pos.id} className="trow" style={{cursor:"pointer"}} onClick={()=>{setPrevNav("dashboard");setSelectedPos(pos);setNav("stock")}}>
                    {/* Asset cell with logo */}
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <AssetLogo pos={pos}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{pos.fmpTicker?.split('.')[0] || pos.symbol}</div>
                        <div style={{fontSize:11,color:"var(--text2)"}}>{pos.name}</div>
                      </div>
                      <span className={`tag tag-${pos.type==="crypto"?"gold":pos.type==="etf"?"blue":pos.type==="etc"?"gold":pos.type==="derivative"?"red":"gray"}`}
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

                    {/* Daily change % */}
                    <div className="mono" style={{fontSize:12,fontWeight:600,
                      color:pos.dailyChange==null?"var(--text3)":pos.dailyChange>=0?"var(--green)":"var(--red)"}}>
                      {pos.dailyChange!=null?(pos.dailyChange>=0?"+":"")+pos.dailyChange.toFixed(2)+"%":"—"}
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

          {nav==="portfolio"&&<PortfolioPage positions={positions} transactions={transactions} wallets={wallets}
            onOpenStock={pos=>{setPrevNav('portfolio');setSelectedPos(pos);setNav("stock")}}
            priceLoading={priceLoading}
            chartData={chartData} investedChartData={investedChartData}
            chartLoading={chartLoading} chartError={chartError} chartProgress={chartProgress}
            activeBM={activeBM} setActiveBM={setActiveBM}
            range={range} setRange={setRange}
            BENCHMARKS={BENCHMARKS} perfStats={perfStats}
            setManualResolvePos={setManualResolvePos} theme={theme} tc={tc}/>}
          {/* Screener container — always mounted to preserve list state */}
          <div style={{display: nav==="screener" || (nav==="stock" && prevNav==="screener") ? 'block' : 'none'}}>
            {/* Tab bar */}
            <div style={{display: nav==="screener" ? 'flex' : 'none', gap:0, borderBottom:'1px solid var(--border)',
              margin:'-26px -30px 20px -30px', paddingLeft:30, paddingTop:4, paddingRight:30}}>
              {[{id:'stock',label:'📈 Stocks'},{id:'etf',label:'🏦 ETFs'}].map(t=>(
                <button key={t.id} onClick={()=>setScreenerTab(t.id)}
                  style={{padding:'10px 22px', fontSize:12, fontWeight:600, border:'none',
                    cursor:'pointer', background:'none',
                    color: screenerTab===t.id ? 'var(--green)' : 'var(--text3)',
                    borderBottom: screenerTab===t.id ? '2px solid var(--green)' : '2px solid transparent',
                    marginBottom:-1, letterSpacing:'0.04em', transition:'color 0.15s'}}>
                  {t.label}
                </button>
              ))}
            </div>
            {/* Screener list — hidden (not unmounted) when viewing a stock */}
            <div style={{display: nav==="stock" && prevNav==="screener" ? 'none' : 'block'}}>
              {screenerTab==='stock'
                ? <ScreenerPage onOpenStock={pos=>{setPrevNav('screener');setSelectedPos(pos);setNav('stock');}} watchlists={watchlists} setWatchlists={setWatchlists}/>
                : <ETFScreenerPage onOpenStock={pos=>{setPrevNav('screener');setSelectedPos(pos);setNav('stock');}} watchlists={watchlists} setWatchlists={setWatchlists}/>
              }
            </div>
            {/* StockDetail overlaid when coming from screener */}
            {nav==="stock" && prevNav==="screener" && selectedPos && (
              <StockDetail pos={selectedPos} onBack={()=>{setNav('screener');setSelectedPos(null);}} transactions={transactions} onTransfer={t=>setTransferModal(t)} setManualResolvePos={setManualResolvePos}/>
            )}
          </div>
          {/* StockDetail for all other navigation sources */}
          {nav==="stock" && prevNav!=="screener" && selectedPos && (
            <StockDetail pos={selectedPos} onBack={()=>{setNav(prevNav||'dashboard');setSelectedPos(null);}} transactions={transactions} onTransfer={t=>setTransferModal(t)} setManualResolvePos={setManualResolvePos}/>
          )}
          {nav==="compare"&&<CompareView/>}
          {nav==="news"&&<NewsFeed positions={positions}/> }
          {nav==="landing"&&(
            <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'12px 18px',background:'var(--surface)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:11,color:'var(--text3)'}}>🌐 Landing Page Preview (only visible to logged-in users)</span>
                <a href="/landing.html" target="_blank" style={{fontSize:11,color:'var(--accent)',textDecoration:'none',marginLeft:'auto'}}>Open in new tab ↗</a>
              </div>
              <iframe src="/landing.html" style={{flex:1,border:'none',width:'100%'}} title="Landing Page Preview"/>
            </div>
          )}
          {nav==="settings"&&(
            <div className="fu" style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Appearance */}
              <div className="card" style={{padding:28}}>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:18}}>APPEARANCE</div>
                <div style={{display:"flex",gap:10}}>
                  {[
                    {key:'light', label:'☀ Light', desc:'Clean & modern'},
                    {key:'dark', label:'🌙 Dark', desc:'Easy on the eyes'},
                  ].map(t=>(
                    <div key={t.key} onClick={()=>setTheme(t.key)}
                      style={{flex:1,padding:'16px 18px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                        border: theme===t.key ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: theme===t.key ? 'var(--accent-dim)' : 'var(--surface2)'}}>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{t.label}</div>
                      <div style={{fontSize:11,color:'var(--text2)'}}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
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
                    {broker:"Smartbroker+", steps:"Konto → Transaktionen → Export → CSV",                       native:true},
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
              {/* Broker connections — only show when Tink is live */}
              <div className="card" style={{padding:28}}>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:18}}>BANK SYNC</div>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 0"}}>
                  <span style={{fontSize:24}}>🏦</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Auto-sync coming soon</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>Connect your broker via PSD2 Open Banking for automatic portfolio updates.</div>
                  </div>
                </div>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",marginTop:8}}>For now, import your portfolio via CSV above.</div>
              </div>

              {/* Cold Wallets */}
              <div className="card" style={{padding:28}}>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.12em",marginBottom:18}}>COLD WALLETS</div>
                {wallets.filter(w=>w.type==='cold_wallet').length === 0 && (
                  <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>No cold wallets added yet. Import a crypto CSV to detect them automatically.</div>
                )}
                {wallets.filter(w=>w.type==='cold_wallet').map(w=>(
                  <div key={w.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>🔒</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{w.name}</div>
                        <div className="mono" style={{fontSize:9,color:"var(--text3)",marginTop:2}}>COLD WALLET · {positions.filter(p=>p.broker===w.name||p.walletId===w.id).length} positions</div>
                      </div>
                    </div>
                    <button onClick={()=>{
                      const newName = prompt(`Rename "${w.name}" to:`, w.name);
                      if (!newName || newName.trim()===w.name) return;
                      const trimmed = newName.trim();
                      setWallets(prev=>prev.map(x=>x.id===w.id?{...x,name:trimmed}:x));
                      setPositions(prev=>prev.map(p=>(p.broker===w.name||p.walletId===w.id)?{...p,broker:trimmed}:p));
                    }} style={{background:"none",border:"1px solid var(--border)",borderRadius:4,color:"var(--text3)",fontSize:10,padding:"3px 10px",cursor:"pointer",fontFamily:"IBM Plex Mono,monospace"}}>rename</button>
                  </div>
                ))}
                <div style={{marginTop:14}}>
                  <button className="btn btn-ghost" onClick={()=>{
                    const name = prompt("Cold wallet name (e.g. Ledger, Trezor, Tangem):");
                    if (!name?.trim()) return;
                    const COLD_COLORS = ['#9945ff','#f7931a','#627eea','#e84142','#00d395','#2775ca'];
                    const idx = wallets.filter(w=>w.type==='cold_wallet').length;
                    setWallets(prev=>[...prev,{id:`cold_${Date.now()}`,name:name.trim(),type:'cold_wallet',color:COLD_COLORS[idx%COLD_COLORS.length]}]);
                  }}>+ Add cold wallet</button>
                </div>
              </div>

              {/* Danger zone */}
              <DangerZone
                positions={positions} transactions={transactions} wallets={wallets}
                setPositions={setPositions} setTransactions={setTransactions} setWallets={setWallets}
                setNav={setNav} setChartData={setChartData}
              />
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

      {showImport&&<ImportModal
        onClose={()=>setShowImport(false)}
        existingPositions={positions}
        existingTransactions={transactions}
        onImport={(imported)=>{
        if(imported?.type==="transactions"){
          const incoming = imported.data;
          const mode = imported.mode || "replace";
          const txKey = t=>`${(t.date||"").slice(0,10)}|${t.isin||t.symbol||""}|${Math.round(Math.abs(t.amountEur||t.total||t.amount||0)*100)}`;
          let finalTxs;
          if(mode==="append"){
            const existingKeys = new Set(transactions.map(txKey));
            const newOnes = incoming.filter(t=>!existingKeys.has(txKey(t)));
            finalTxs = [...transactions, ...newOnes];
          } else {
            finalTxs = incoming;
          }
          setTransactions(finalTxs);

          // Apply derived crypto positions (from hardcoded parser or AI)
          if (imported.derivedPositions?.length > 0) {
            const incoming = imported.derivedPositions;
            const brokerName = incoming[0]?.broker || 'Bitvavo';
            // Keep: non-crypto positions (stocks/ETFs) + crypto on OTHER brokers/cold wallets
            // Replace: only crypto positions tagged to this broker
            const existingToKeep = positions.filter(p =>
              p.type !== 'crypto' || p.broker !== brokerName
            );
            // Merge incoming with existing to preserve currentPrice, color, coinId
            const newCrypto = incoming.map((p, i) => {
              const existing = positions.find(q => q.type === 'crypto' &&
                q.broker === brokerName &&
                (q.symbol||'').toUpperCase() === (p.symbol||'').toUpperCase());
              return {
                ...p,
                id: existing?.id || Date.now() + i,
                currentPrice: existing?.currentPrice || p.currentPrice || 0,
                color: existing?.color || p.color || ALLOC_COLORS_EXT[(existingToKeep.length + i) % ALLOC_COLORS_EXT.length],
                coinId: existing?.coinId || p.coinId || getCoinId(p.symbol),
              };
            });
            setPositions([...existingToKeep, ...newCrypto]);
            setTimeout(fetchPrices, 100);

            // Trigger cold wallet assignment modal if transfers were detected during parse
            if (imported.pendingTransfers?.length > 0) {
              const brokerName = imported.derivedPositions?.[0]?.broker || 'Bitvavo';
              setTimeout(() => setShowColdWalletModal({ transfers: imported.pendingTransfers, sourceBroker: brokerName }), 400);
            }
          }
        } else {
          const incoming = imported.data || imported;
          const mode = imported.mode || "replace";
          if(mode==="append" && positions.length>0){
            const merged=[...positions];
            incoming.forEach(p=>{
              const sym=(p.symbol||p.ticker||"").toUpperCase();
              const isin=p.isin||"";
              const idx=merged.findIndex(m=>(sym&&(m.symbol||m.ticker||"").toUpperCase()===sym)||(isin&&m.isin===isin));
              if(idx>=0){
                const ex=merged[idx];
                const totalQty=(ex.qty||0)+(p.qty||0);
                const weightedPrice=totalQty>0?((ex.qty||0)*(ex.avgPrice||0)+(p.qty||0)*(p.avgPrice||p.currentPrice||0))/totalQty:ex.avgPrice||0;
                merged[idx]={...ex,qty:totalQty,avgPrice:weightedPrice};
              } else {
                merged.push({...p,id:Date.now()+Math.random(),color:ALLOC_COLORS[merged.length%ALLOC_COLORS.length]});
              }
            });
            setPositions(merged);
          } else {
            setPositions(incoming);
          }
          setTimeout(fetchPrices,100);
        }
        setShowImport(false); setNav("dashboard");
      }}/>}

      {showColdWalletModal && (
        <ColdWalletErrorBoundary onClose={() => setShowColdWalletModal(null)}>
        <ColdWalletModal
          transfers={showColdWalletModal.transfers}
          existingWallets={wallets}
          existingPositions={positions}
          sourceBroker={showColdWalletModal.sourceBroker}
          onClose={() => setShowColdWalletModal(null)}
          onSave={({ newWallets, newPositions, sourceBroker }) => {
            // Merge new cold wallets into wallets list
            setWallets(prev => {
              const existingIds = new Set(prev.map(w => w.id));
              const toAdd = newWallets.filter(w => !existingIds.has(w.id));
              return [...prev, ...toAdd];
            });
            setPositions(prev => {
              const merged = [...prev];
              // derivePositionsFromTxs already accounts for transfer_out — exchange positions
              // are already correct (no cold wallet coins in them). Just add/replace cold wallet positions.
              newPositions.forEach(p => {
                const idx = merged.findIndex(m =>
                  (m.symbol||'').toUpperCase() === (p.symbol||'').toUpperCase() &&
                  m.broker === p.broker &&
                  m.type === 'crypto'
                );
                if (idx >= 0) {
                  merged[idx] = { ...merged[idx], qty: p.qty, avgPrice: p.avgPrice, walletId: p.walletId };
                } else {
                  merged.push(p);
                }
              });
              return merged;
            });
            setShowColdWalletModal(null);
            setTimeout(fetchPrices, 200);
          }}
        />
        </ColdWalletErrorBoundary>
      )}

      {/* ── Buy / Sell / Cash modals ── */}}
      {txModal && (() => {
        const mode = txModal.mode;
        const isBuy = mode==='buy', isSell=mode==='sell', isCash=mode==='cash';
        const title = isBuy?'Buy Position':isSell?'Sell Position':'Cash Movement';
        const setF = (k,v) => setTxForm(p=>({...p,[k]:v}));
        const submitFn = isBuy?submitBuy:isSell?submitSell:submitCash;

        return (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setTxModal(null)}>
            <div className="modal" style={{minWidth:380,maxWidth:460}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                <span style={{fontSize:22}}>{isBuy?'📈':isSell?'📉':'💵'}</span>
                <div>
                  <div className="serif" style={{fontSize:18}}>{title}</div>
                  <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:2}}>
                    {isCash ? `Cash balance: €${cashBalance.toFixed(2)}` : 'Auto-resolves name & current price'}
                  </div>
                </div>
              </div>

              {/* Ticker field for buy/sell */}
              {!isCash && (
                <div style={{marginBottom:12}}>
                  <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>
                    {isSell ? 'POSITION' : 'TICKER'}
                  </div>
                  {isSell ? (
                    <select className="inp" value={txForm.symbol}
                      onChange={e=>{
                        const pos = positions.find(p=>p.symbol===e.target.value);
                        setF('symbol',e.target.value);
                        setF('name', pos?.name||e.target.value);
                      }}>
                      <option value="">— select position —</option>
                      {positions.map(p=>(
                        <option key={p.id} value={p.symbol}>{p.symbol} — {p.name} ({p.qty} shares)</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{position:'relative'}}>
                      <input className="inp" placeholder="NVDA, AAPL…" value={txForm.symbol}
                        onChange={async e => {
                          const v = e.target.value.toUpperCase();
                          setF('symbol', v); setF('name','');
                          if (v.length >= 1) {
                            setTxSearchLoading(true);
                            try {
                              const res = await fetch('/api/fmp?path=' + encodeURIComponent('/search?query='+v+'&limit=6'));
                              const data = await res.json();
                              setTxSearch(Array.isArray(data)?data.slice(0,6):[]);
                            } catch { setTxSearch([]); }
                            setTxSearchLoading(false);
                          } else setTxSearch([]);
                        }}
                      />
                      {txSearch.length>0 && (
                        <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:99,
                          background:'var(--surface)',border:'1px solid var(--border2)',
                          borderRadius:6,boxShadow:'var(--popover-shadow)',overflow:'hidden'}}>
                          {txSearch.map(r=>(
                            <div key={r.symbol} onClick={()=>{
                              setF('symbol',r.symbol); setF('name',r.name||r.companyName||r.symbol);
                              setTxSearch([]);
                            }} style={{padding:'8px 12px',cursor:'pointer',display:'flex',gap:8,alignItems:'baseline'}}
                              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                              <span className="mono" style={{fontWeight:700,color:'var(--green)',fontSize:12}}>{r.symbol}</span>
                              <span style={{fontSize:11,color:'var(--text2)'}}>{r.name||r.companyName}</span>
                              <span className="mono" style={{fontSize:10,color:'var(--text3)',marginLeft:'auto'}}>{r.exchangeShortName||r.stockExchange}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {txForm.name && <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:4}}>{txForm.name}</div>}
                </div>
              )}

              {/* Qty + Price for buy/sell */}
              {!isCash && (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div>
                    <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>QUANTITY</div>
                    <input className="inp" type="number" min="0" step="any" placeholder="0.00"
                      value={txForm.qty} onChange={e=>setF('qty',e.target.value)}/>
                    {isSell && txForm.symbol && (() => {
                      const pos = positions.find(p=>p.symbol===txForm.symbol);
                      return pos ? <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:3}}>max: {pos.qty}</div> : null;
                    })()}
                  </div>
                  <div>
                    <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>PRICE PER SHARE (€)</div>
                    <input className="inp" type="number" min="0" step="any" placeholder="0.00"
                      value={txForm.price} onChange={e=>setF('price',e.target.value)}/>
                  </div>
                </div>
              )}

              {/* Total preview for buy/sell */}
              {!isCash && txForm.qty && txForm.price && (
                <div className="mono" style={{fontSize:11,color:'var(--text2)',marginBottom:12,
                  padding:'8px 12px',background:'var(--surface2)',borderRadius:6}}>
                  Total: <span style={{color: isBuy?'var(--red)':'var(--green)', fontWeight:700}}>
                    {isBuy?'−':'+'} €{(parseFloat(txForm.qty||0)*parseFloat(txForm.price||0)).toFixed(2)}
                  </span>
                  {isBuy && cashBalance > 0 && parseFloat(txForm.qty||0)*parseFloat(txForm.price||0) > cashBalance && (
                    <span style={{color:'var(--gold)',marginLeft:8}}>⚠ exceeds cash balance</span>
                  )}
                </div>
              )}

              {/* Cash amount + type */}
              {isCash && (
                <div style={{marginBottom:12}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                    <div>
                      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>TYPE</div>
                      <select className="inp" value={txForm.cashType} onChange={e=>setF('cashType',e.target.value)}>
                        <option value="deposit">💰 Deposit</option>
                        <option value="withdraw">🏧 Withdraw</option>
                      </select>
                    </div>
                    <div>
                      <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>AMOUNT (€)</div>
                      <input className="inp" type="number" min="0" step="any" placeholder="0.00"
                        value={txForm.amount} onChange={e=>setF('amount',e.target.value)}/>
                    </div>
                  </div>
                  {txForm.cashType==='withdraw' && txForm.amount && parseFloat(txForm.amount) > cashBalance && (
                    <div className="mono" style={{fontSize:11,color:'var(--red)',padding:'6px 10px',
                      background:'rgba(224,96,96,0.1)',borderRadius:6,marginBottom:8}}>
                      ⚠ Insufficient cash — balance is €{cashBalance.toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              {/* Date */}
              <div style={{marginBottom:18}}>
                <div className="mono" style={{fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',marginBottom:5}}>DATE</div>
                <input className="inp" type="date" value={txForm.date} onChange={e=>setF('date',e.target.value)}/>
              </div>

              {txFormErr && (
                <div className="mono" style={{fontSize:11,color:'var(--red)',marginBottom:12,
                  padding:'6px 10px',background:'rgba(224,96,96,0.1)',borderRadius:6}}>
                  {txFormErr}
                </div>
              )}

              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button className="btn btn-ghost" onClick={()=>setTxModal(null)}>CANCEL</button>
                <button className="btn btn-primary" onClick={submitFn}>
                  {isBuy?'BUY':isSell?'SELL':'CONFIRM'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ Transfer to/from Cold Wallet Modal ══ */}
      {transferModal && <TransferModal modal={transferModal} wallets={wallets} positions={positions}
        onClose={() => setTransferModal(null)}
        onSave={(fromPos, toPos, txRecord) => {
          // Update positions: adjust qty on source and dest
          setPositions(prev => {
            let updated = prev.map(p => {
              if (p.id === fromPos.id) return { ...p, qty: fromPos.newQty };
              if (p.id === toPos?.id) return { ...p, qty: toPos.newQty };
              return p;
            });
            // If dest is new position (cold wallet target that doesn't exist yet)
            if (toPos?.isNew) updated = [...updated, toPos];
            return updated.filter(p => p.qty > 0.000001);
          });
          // Record the transfer transaction
          if (txRecord) setTransactions(prev => [...(prev||[]), txRecord]);
          setTransferModal(null);
        }}
      />}

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

      {/* ── Manual Ticker Resolution Modal ── */}
      {manualResolvePos && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setManualResolvePos(null)}>
          <div className="modal" style={{minWidth:360,maxWidth:440}}>
            <div className="serif" style={{fontSize:18,marginBottom:4}}>Resolve Ticker</div>
            <div style={{fontSize:12,color:'var(--text3)',marginBottom:16}}>
              We couldn't automatically find the ticker for this position. Enter the correct ticker symbol.
            </div>
            <div className="card" style={{padding:'12px 14px',marginBottom:16}}>
              <div style={{fontSize:11,color:'var(--text3)'}}>Position</div>
              <div style={{fontSize:14,fontWeight:600,marginTop:2}}>{manualResolvePos.name}</div>
              <div className="mono" style={{fontSize:10,color:'var(--text3)',marginTop:2}}>
                ISIN: {manualResolvePos.isin || '—'} · WKN: {manualResolvePos.symbol || '—'}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:'var(--text3)',display:'block',marginBottom:4}}>Search by ticker or name (e.g. WSLV, WisdomTree Silver, PHAG)</label>
              <input
                id="manual-ticker-input"
                className="input mono"
                autoFocus
                placeholder="Type ticker or name and press Enter to search..."
                style={{width:'100%',fontSize:13,padding:'8px 12px'}}
                onKeyDown={async e => {
                  if (e.key !== 'Enter') return;
                  const query = e.target.value.trim();
                  if (!query) return;
                  const statusEl = document.getElementById('resolve-status');
                  const resultsEl = document.getElementById('resolve-results');
                  statusEl.textContent = 'Searching...';
                  statusEl.style.color = 'var(--text3)';
                  resultsEl.innerHTML = '';
                  try {
                    // Strategy: try /quote first, then /quote with exchange suffixes,
                    // then /search-name, then /search — collect all valid results
                    const candidates = [];
                    const tryQuote = async (sym) => {
                      try {
                        const res = await fetch('/api/fmp?path=' + encodeURIComponent('/quote?symbol=' + sym));
                        const data = await res.json();
                        const q = Array.isArray(data) ? data[0] : data;
                        if (q?.price || q?.previousClose) candidates.push({ symbol: sym, name: q.name || sym, price: q.price || q.previousClose, exchange: q.exchange });
                      } catch(e){}
                    };
                    const ticker = query.toUpperCase();
                    const isNameQuery = query.includes(' ') || query.length > 8;

                    // Only try /quote with suffixes if it looks like a ticker (no spaces, short)
                    if (!isNameQuery) {
                      const suffixes = ['', '.DE', '.L', '.F', '.AS', '.MI', '.PA', '.SW'];
                      await Promise.all(suffixes.map(s => tryQuote(ticker + s)));
                    }

                    // Search by name using /search-name and /search
                    // Try: user query, cleaned position name, first 2 words of position name
                    const searchQueries = [query];
                    if (manualResolvePos.name && manualResolvePos.name.toLowerCase() !== query.toLowerCase()) {
                      // Add cleaned position name as secondary search
                      const cleanPosName = manualResolvePos.name
                        .replace(/\s*\(.*?\)\s*/g, ' ')
                        .replace(/U\.?ETF|ETF|ETC|ETP|UCITS/gi, '')
                        .replace(/\s+(Inc\.?|Corp\.?|Ltd\.?|Group\.?|PLC|SE|AG|Co\.?|GmbH|B\.V\.)$/i, '')
                        .replace(/[^a-zA-Z0-9\s&-]/g, ' ')
                        .replace(/\s+/g, ' ').trim();
                      if (cleanPosName.length > 2) searchQueries.push(cleanPosName);
                      // Also try first 2 words of position name
                      const words = cleanPosName.split(' ').filter(w => w.length > 1);
                      if (words.length >= 2) searchQueries.push(words.slice(0, 2).join(' '));
                    }
                    let searchResults = [];
                    for (const sq of searchQueries) {
                      if (searchResults.length >= 3) break;
                      console.log('[folio] resolve search: trying "' + sq + '"');
                      try {
                        const res = await fetch('/api/fmp?path=' + encodeURIComponent('/search-name?query=' + encodeURIComponent(sq) + '&limit=8'));
                        const data = await res.json();
                        console.log('[folio] /search-name "' + sq + '" →', Array.isArray(data) ? data.length + ' results' : 'not array');
                        if (Array.isArray(data) && data.length) searchResults.push(...data);
                      } catch(e){ console.log('[folio] /search-name error:', e.message); }
                      if (!searchResults.length) {
                        try {
                          const res = await fetch('/api/fmp?path=' + encodeURIComponent('/search?query=' + encodeURIComponent(sq) + '&limit=8'));
                          const data = await res.json();
                          console.log('[folio] /search "' + sq + '" →', Array.isArray(data) ? data.length + ' results' : 'not array');
                          if (Array.isArray(data) && data.length) searchResults.push(...data);
                        } catch(e){ console.log('[folio] /search error:', e.message); }
                      }
                    }
                    // Add search results that aren't already in candidates
                    if (Array.isArray(searchResults)) {
                      const existing = new Set(candidates.map(c => c.symbol));
                      searchResults.forEach(r => {
                        if (r.symbol && !existing.has(r.symbol)) {
                          candidates.push({ symbol: r.symbol, name: r.name || r.symbol, price: null, exchange: r.exchange || r.exchangeFullName, currency: r.currency });
                        }
                      });
                    }

                    if (!candidates.length) {
                      statusEl.textContent = 'No results for "' + query + '". Try a different name or ticker.';
                      statusEl.style.color = 'var(--red)';
                      return;
                    }

                    // Deduplicate by symbol
                    const seen = new Set();
                    const unique = candidates.filter(c => { if (seen.has(c.symbol)) return false; seen.add(c.symbol); return true; });

                    // Sort: results with price first, then prefer .DE > .L > .F > no suffix > other
                    const exchangeRank = s => {
                      if (s.endsWith('.DE')) return 0;
                      if (s.endsWith('.L')) return 1;
                      if (s.endsWith('.F')) return 2;
                      if (!s.includes('.')) return 3; // US listing
                      return 4;
                    };
                    unique.sort((a, b) => {
                      if (a.price && !b.price) return -1;
                      if (!a.price && b.price) return 1;
                      return exchangeRank(a.symbol) - exchangeRank(b.symbol);
                    });

                    const isRecommended = (c, idx) => idx === 0; // top result after sorting

                    statusEl.textContent = unique.length + ' result(s) — click to select:';
                    statusEl.style.color = 'var(--text2)';

                    // Render clickable result rows
                    unique.slice(0, 8).forEach((c, idx) => {
                      const rec = isRecommended(c, idx);
                      const row = document.createElement('div');
                      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 10px;margin:4px 0;border-radius:6px;cursor:pointer;border:1px solid ' + (rec ? 'var(--green)' : 'var(--border)') + ';font-size:12px;transition:background 0.1s' + (rec ? ';background:rgba(58,154,181,0.06)' : '');
                      row.onmouseenter = () => row.style.background = rec ? 'rgba(58,154,181,0.12)' : 'var(--surface2)';
                      row.onmouseleave = () => row.style.background = rec ? 'rgba(58,154,181,0.06)' : 'transparent';
                      const exchangeLabel = (c.exchange || '').replace('Stock Exchange', 'SE');
                      const currLabel = c.currency ? ' · ' + c.currency : '';
                      const recBadge = rec ? '<span style="font-size:8px;background:var(--green);color:#000;padding:1px 5px;border-radius:3px;margin-left:6px;font-weight:700">RECOMMENDED</span>' : '';
                      row.innerHTML = '<div><span style="font-weight:600;font-family:monospace">' + c.symbol + '</span>' + recBadge + '<div style="font-size:10px;color:var(--text3);margin-top:1px">' + (c.name || '') + ' <span style="opacity:0.7">' + exchangeLabel + currLabel + '</span></div></div>' +
                        (c.price ? '<div style="font-family:monospace;font-weight:600;color:var(--green)">$' + c.price.toFixed(2) + '</div>' : '<div style="color:var(--text3);font-size:10px;text-align:right">no live price<br>on current plan</div>');
                      row.onclick = async () => {
                        // Apply this ticker to the position
                        setPositions(prev => prev.map(p =>
                          p.id === manualResolvePos.id
                            ? { ...p, fmpTicker: c.symbol, tickerSource: 'manual', currentPrice: c.price ? c.price / (manualResolvePos.isin?.startsWith('US') ? (1/0.92) : 1) : p.currentPrice }
                            : p
                        ));
                        if (manualResolvePos.isin) {
                          saveISINTicker(manualResolvePos.isin, c.symbol, c.name || manualResolvePos.name, 'manual');
                          console.log('[folio] manual resolve saved:', manualResolvePos.isin, '→', c.symbol);
                        }
                        statusEl.textContent = '✓ Saved ' + c.symbol + ' for all users';
                        statusEl.style.color = 'var(--green)';
                        resultsEl.innerHTML = '';
                        setTimeout(() => setManualResolvePos(null), 1000);
                      };
                      resultsEl.appendChild(row);
                    });
                  } catch(err) {
                    statusEl.textContent = 'Error searching. Try again.';
                    statusEl.style.color = 'var(--red)';
                  }
                }}
              />
              <div id="resolve-status" style={{fontSize:11,marginTop:6,minHeight:16}}></div>
              <div id="resolve-results" style={{maxHeight:280,overflowY:'auto'}}></div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button className="btn btn-ghost" onClick={() => setManualResolvePos(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
