"use client";

import { useState, useEffect, useRef } from "react";

const c = {
  darkest: "#06060C", dark: "#0C0D16", surface: "#131520", surfaceAlt: "#181B28",
  border: "#252840", borderLight: "#323660", gold: "#D4A843", goldLight: "#F0D078",
  goldDim: "#9A7B2F", cyan: "#00F0FF", magenta: "#FF2E97", green: "#39FF14",
  text1: "#F0ECE2", text2: "#8B8DA3", text3: "#6B6E8A",
};

export default function LandingPage({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Anybody:wght@400;700;800;900&display=swap');

        @keyframes logoReveal {
          0% { opacity:0; transform:scale(0.7); filter:blur(20px); }
          60% { opacity:1; transform:scale(1.05); filter:blur(0); }
          100% { opacity:1; transform:scale(1); filter:blur(0); }
        }
        @keyframes wordReveal {
          0% { opacity:0; transform:translateY(30px); letter-spacing:20px; }
          100% { opacity:1; transform:translateY(0); letter-spacing:3px; }
        }
        @keyframes tagReveal {
          0% { opacity:0; width:0; }
          100% { opacity:1; width:300px; }
        }
        @keyframes fadeUp {
          0% { opacity:0; transform:translateY(40px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulseGlow {
          0%,100% { box-shadow:0 0 30px rgba(212,168,67,0.15), 0 0 60px rgba(212,168,67,0.05); }
          50% { box-shadow:0 0 50px rgba(212,168,67,0.35), 0 0 100px rgba(212,168,67,0.12); }
        }
        @keyframes shimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-8px); }
        }
        @keyframes scanline {
          0% { top:-2px; }
          100% { top:100%; }
        }
        @keyframes breathe {
          0%,100% { opacity:0.03; }
          50% { opacity:0.08; }
        }
        @keyframes chevronBounce {
          0%,100% { transform:translateY(0); opacity:0.3; }
          50% { transform:translateY(6px); opacity:0.8; }
        }
        @keyframes ctaPulse {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.015); }
        }
        @keyframes ringRotate {
          0% { transform:rotate(0deg); }
          100% { transform:rotate(360deg); }
        }
        @keyframes gridFade {
          0% { opacity:0; }
          50% { opacity:0.03; }
          100% { opacity:0; }
        }

        .lp-wrap {
          height:100vh; overflow-y:auto; overflow-x:hidden;
          scroll-behavior:smooth; scroll-snap-type:y proximity;
        }
        .lp-wrap::-webkit-scrollbar { width:3px; }
        .lp-wrap::-webkit-scrollbar-track { background:transparent; }
        .lp-wrap::-webkit-scrollbar-thumb { background:${c.gold}30; border-radius:2px; }

        .lp-section { scroll-snap-align:start; }

        .cta-btn {
          position:relative; display:inline-flex; align-items:center; gap:14px;
          padding:22px 52px 22px 40px; border:none; cursor:pointer;
          font-family:'Anybody',sans-serif; font-size:18px; font-weight:800;
          letter-spacing:4px; color:${c.darkest};
          background:linear-gradient(135deg,${c.goldLight},${c.gold},${c.goldDim});
          clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));
          transition:all 0.3s ease; animation:ctaPulse 3s ease-in-out infinite;
          text-transform:uppercase;
        }
        .cta-btn:hover {
          animation:none; transform:translateY(-3px);
          box-shadow:0 12px 40px rgba(212,168,67,0.4), 0 0 80px rgba(212,168,67,0.15);
          letter-spacing:6px;
        }
        .cta-btn:active { transform:translateY(0); }
        .cta-btn:focus-visible { outline:2px solid ${c.cyan}; outline-offset:4px; }

        .cta-btn-sm {
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 36px 16px 28px; border:none; cursor:pointer;
          font-family:'Anybody',sans-serif; font-size:14px; font-weight:800;
          letter-spacing:3px; color:${c.darkest};
          background:linear-gradient(135deg,${c.goldLight},${c.gold},${c.goldDim});
          clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition:all 0.3s ease; text-transform:uppercase;
        }
        .cta-btn-sm:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 32px rgba(212,168,67,0.35);
          letter-spacing:5px;
        }
        .cta-btn-sm:focus-visible { outline:2px solid ${c.cyan}; outline-offset:4px; }

        .feat-card {
          padding:32px 24px; background:linear-gradient(165deg,${c.surfaceAlt},${c.dark});
          clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
          position:relative; transition:transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feat-card:hover { transform:translateY(-6px); box-shadow:0 16px 48px rgba(0,0,0,0.5); }
        .feat-card::before {
          content:''; position:absolute; inset:0;
          clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
          padding:1px; background:linear-gradient(160deg,${c.gold}40,${c.border}60,transparent);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none;
        }

        .stat-num {
          font-family:'Anybody',sans-serif; font-weight:900; font-size:48px; line-height:1;
          background:linear-gradient(135deg,${c.goldLight},${c.gold});
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }

        @media (prefers-reduced-motion:reduce) {
          *,*::before,*::after {
            animation-duration:0.01ms!important; animation-iteration-count:1!important;
            transition-duration:0.01ms!important;
          }
        }
        @media (max-width:600px) {
          .stat-row { flex-direction:column!important; gap:32px!important; }
          .feat-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      <div className="lp-wrap" style={{
        background:c.darkest, color:c.text1, fontFamily:"'Chakra Petch',sans-serif", position:"relative",
      }}>

        {/* Noise overlay */}
        <div aria-hidden="true" style={{
          position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:0.35, mixBlendMode:"overlay",
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}/>

        {/* Ambient orbs */}
        <div aria-hidden="true" style={{ position:"fixed", top:"-20%", right:"-10%", width:"600px", height:"600px", background:`radial-gradient(circle,${c.cyan}06 0%,transparent 70%)`, pointerEvents:"none", zIndex:0, animation:"breathe 8s ease-in-out infinite" }}/>
        <div aria-hidden="true" style={{ position:"fixed", bottom:"-20%", left:"-10%", width:"500px", height:"500px", background:`radial-gradient(circle,${c.magenta}04 0%,transparent 70%)`, pointerEvents:"none", zIndex:0, animation:"breathe 10s ease-in-out infinite 2s" }}/>
        <div aria-hidden="true" style={{ position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"800px", height:"800px", background:`radial-gradient(circle,${c.gold}03 0%,transparent 60%)`, pointerEvents:"none", zIndex:0, animation:"breathe 12s ease-in-out infinite 4s" }}/>

        {/* ═══════ HERO ═══════ */}
        <section className="lp-section" aria-label="Hero" style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          position:"relative", zIndex:2, padding:"40px 24px",
        }}>
          {/* Scanline */}
          <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
            <div style={{ position:"absolute", left:0, right:0, height:"2px", background:`linear-gradient(90deg,transparent,${c.cyan}08,transparent)`, animation:"scanline 8s linear infinite" }}/>
          </div>

          {/* Corner accents */}
          {[{t:"24px",l:"24px",bt:`1px solid ${c.gold}25`,bl:`1px solid ${c.gold}25`},{t:"24px",r:"24px",bt:`1px solid ${c.gold}25`,br:`1px solid ${c.gold}25`},{b:"24px",l:"24px",bb:`1px solid ${c.gold}25`,bl:`1px solid ${c.gold}25`},{b:"24px",r:"24px",bb:`1px solid ${c.gold}25`,br:`1px solid ${c.gold}25`}].map((_,i)=>(
            <div key={i} aria-hidden="true" style={{
              position:"absolute", width:"50px", height:"50px",
              top:i<2?"24px":undefined, bottom:i>=2?"24px":undefined,
              left:i%2===0?"24px":undefined, right:i%2===1?"24px":undefined,
              borderTop:i<2?`1px solid ${c.gold}25`:undefined,
              borderBottom:i>=2?`1px solid ${c.gold}25`:undefined,
              borderLeft:i%2===0?`1px solid ${c.gold}25`:undefined,
              borderRight:i%2===1?`1px solid ${c.gold}25`:undefined,
              opacity:phase>=2?1:0, transition:`opacity 1s ease ${0.5+i*0.1}s`,
            }}/>
          ))}

          {/* Rotating ring behind logo */}
          <div aria-hidden="true" style={{
            position:"absolute", width:"280px", height:"280px",
            border:`1px solid ${c.gold}08`,
            borderTop:`1px solid ${c.gold}25`,
            borderRadius:"50%", animation:"ringRotate 20s linear infinite",
            opacity:phase>=2?1:0, transition:"opacity 2s ease",
          }}/>
          <div aria-hidden="true" style={{
            position:"absolute", width:"340px", height:"340px",
            border:`1px solid ${c.cyan}05`,
            borderBottom:`1px solid ${c.cyan}15`,
            borderRadius:"50%", animation:"ringRotate 30s linear infinite reverse",
            opacity:phase>=2?1:0, transition:"opacity 2s ease 0.3s",
          }}/>

          {/* BULL LOGO */}
          <div style={{
            animation:phase>=1?"logoReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards":"none",
            opacity:phase>=1?undefined:0, marginBottom:"36px",
            filter:`drop-shadow(0 0 80px ${c.gold}20)`,
          }}>
            <svg width="160" height="133" viewBox="0 0 240 200" aria-label="Collectibulls bull logo" role="img">
              <defs>
                <linearGradient id="hlg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={c.goldLight}/><stop offset="50%" stopColor={c.gold}/><stop offset="100%" stopColor={c.goldDim}/>
                </linearGradient>
                <filter id="hglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M72 78 C62 58,38 20,18 8 C14 5,12 8,16 14 C30 38,48 62,65 80" fill="url(#hlg)" stroke={c.goldDim} strokeWidth="0.5"/>
              <path d="M168 78 C178 58,202 20,222 8 C226 5,228 8,224 14 C210 38,192 62,175 80" fill="url(#hlg)" stroke={c.goldDim} strokeWidth="0.5"/>
              <path d="M72 80 C72 68,88 55,120 55 C152 55,168 68,168 80 L168 115 C168 125,162 140,148 150 C140 156,132 162,120 168 C108 162,100 156,92 150 C78 140,72 125,72 115 Z" fill="url(#hlg)" stroke={`${c.goldLight}40`} strokeWidth="0.5"/>
              <path d="M82 84 C82 75,94 65,120 65 C146 65,158 75,158 84 L158 112 C158 120,153 133,142 142 C136 147,129 152,120 157 C111 152,104 147,98 142 C87 133,82 120,82 112 Z" fill={c.dark}/>
              <path d="M72 82 C65 75,58 72,54 76 C50 80,55 88,62 90 C66 91,70 88,72 85" fill="url(#hlg)"/>
              <path d="M168 82 C175 75,182 72,186 76 C190 80,185 88,178 90 C174 91,170 88,168 85" fill="url(#hlg)"/>
              <path d="M96 95 L106 90 L110 98 L104 104 Z" fill={c.cyan} filter="url(#hglow)"/>
              <path d="M144 95 L134 90 L130 98 L136 104 Z" fill={c.cyan} filter="url(#hglow)"/>
              <path d="M114 108 L120 105 L126 108" fill="none" stroke={`${c.gold}60`} strokeWidth="1.5" strokeLinecap="round"/>
              <ellipse cx="108" cy="125" rx="5" ry="3.5" fill={`${c.gold}30`} stroke={`${c.gold}50`} strokeWidth="1"/>
              <ellipse cx="132" cy="125" rx="5" ry="3.5" fill={`${c.gold}30`} stroke={`${c.gold}50`} strokeWidth="1"/>
              <path d="M112 130 C112 140,120 146,120 146 C120 146,128 140,128 130" fill="none" stroke="url(#hlg)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="120" cy="146" r="2" fill={c.goldLight}/>
              <path d="M120 72 L124 78 L120 84 L116 78 Z" fill={`${c.cyan}40`} stroke={`${c.cyan}60`} strokeWidth="0.5"/>
            </svg>
          </div>

          {/* WORDMARK */}
          <div style={{ animation:phase>=1?"wordReveal 1s cubic-bezier(0.16,1,0.3,1) 0.4s forwards":"none", opacity:0, textAlign:"center" }}>
            <h1 style={{ fontSize:"clamp(34px,9vw,58px)", fontWeight:900, fontFamily:"'Anybody',sans-serif", lineHeight:1, margin:0 }}>
              <span style={{ background:`linear-gradient(135deg,${c.goldLight},${c.gold},${c.goldDim})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>COLLECTI</span>
              <span style={{ background:`linear-gradient(135deg,${c.cyan},${c.cyan}CC)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>BULLS</span>
            </h1>
          </div>

          {/* TAGLINE */}
          <div style={{ animation:phase>=2?"tagReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards":"none", opacity:0, overflow:"hidden", marginTop:"16px", display:"flex", alignItems:"center", gap:"16px" }}>
            <div aria-hidden="true" style={{ flex:1, height:"1px", background:`linear-gradient(270deg,${c.gold}50,transparent)` }}/>
            <span style={{ fontSize:"11px", letterSpacing:"6px", color:c.text2, fontWeight:500, textAlign:"center", display:"block" }}>TRACK {"\u00B7"} TRADE {"\u00B7"} TRIUMPH</span>
            <div aria-hidden="true" style={{ flex:1, height:"1px", background:`linear-gradient(90deg,${c.gold}50,transparent)` }}/>
          </div>

          {/* SUBTITLE */}
          <p style={{ animation:phase>=2?"fadeUp 0.8s ease 0.3s forwards":"none", opacity:0, marginTop:"32px", fontSize:"clamp(14px,3.5vw,18px)", color:c.text2, fontWeight:400, textAlign:"center", maxWidth:"480px", lineHeight:1.7, letterSpacing:"0.5px" }}>
            The premium portfolio tracker for serious collectors.
            <br/><span style={{ color:c.text3 }}>Pokemon. Sports. MTG. Yu-Gi-Oh.</span>
          </p>

          {/* CTA */}
          <div style={{ animation:phase>=2?"fadeUp 0.8s ease 0.6s forwards":"none", opacity:0, marginTop:"48px" }}>
            <button className="cta-btn" onClick={onEnter} onMouseEnter={()=>setHovering(true)} onMouseLeave={()=>setHovering(false)} aria-label="Enter the Collectibulls app">
              BE BULLISH
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transition:"transform 0.3s ease", transform:hovering?"translateX(4px)":"translateX(0)" }}>
                <path d="M5 12H19M13 6L19 12L13 18" stroke={c.darkest} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Scroll indicator */}
          <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", animation:phase>=2?"fadeIn 1s ease 1.5s forwards":"none", opacity:0 }}>
            <span style={{ fontSize:"8px", letterSpacing:"3px", color:c.text3, fontWeight:500 }}>SCROLL</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ animation:"chevronBounce 2s ease-in-out infinite" }}>
              <path d="M4 6L8 10L12 6" stroke={c.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* ═══════ WHAT IS COLLECTIBULLS ═══════ */}
        <section className="lp-section" aria-label="Features" style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          position:"relative", zIndex:2, padding:"80px 24px",
        }}>
          <div style={{ maxWidth:"720px", width:"100%", textAlign:"center" }}>
            <p style={{ fontSize:"10px", letterSpacing:"5px", color:c.cyan, fontWeight:600, marginBottom:"16px" }}>THE PLATFORM</p>
            <h2 style={{ fontSize:"clamp(26px,6vw,44px)", fontWeight:800, fontFamily:"'Anybody',sans-serif", lineHeight:1.15, marginBottom:"24px", background:`linear-gradient(180deg,${c.text1},${c.text2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Your collection deserves<br/>better than a spreadsheet.
            </h2>
            <p style={{ fontSize:"15px", color:c.text2, lineHeight:1.8, maxWidth:"520px", margin:"0 auto", fontWeight:400 }}>
              Real-time portfolio tracking, trade logging with P&L analytics,
              and market pricing powered by eBay. Built by collectors, for collectors.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"16px", maxWidth:"720px", width:"100%", marginTop:"56px" }}>
            {[
              { icon:<><path d="M3 3V21H21" stroke={c.cyan} strokeWidth="2" strokeLinecap="round"/><path d="M7 16L11 10L15 13L20 6" stroke={c.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
                title:"LIVE PRICING", desc:"Real market data from eBay. Know what your cards are worth right now, not last month.", accent:c.cyan },
              { icon:<><path d="M7 17L4 14L7 11" stroke={c.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14H16" stroke={c.gold} strokeWidth="2" strokeLinecap="round"/><path d="M17 7L20 10L17 13" stroke={c.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 10H8" stroke={c.gold} strokeWidth="2" strokeLinecap="round"/></>,
                title:"TRADE LOG", desc:"Log every buy and sell. Track cost basis, realized profit, and your win rate over time.", accent:c.gold },
              { icon:<><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c.magenta} strokeWidth="2" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={c.magenta} strokeWidth="2" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c.magenta} strokeWidth="2" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={c.magenta} strokeWidth="2" fill="none"/></>,
                title:"THE VAULT", desc:"Your entire collection in one place. Filter by category, grade, value. See everything.", accent:c.magenta },
            ].map((f,i)=>(
              <div key={i} className="feat-card">
                <div style={{ position:"absolute", top:0, left:0, right:"14px", height:"1px", background:`linear-gradient(90deg,${f.accent}40,transparent)` }}/>
                <div style={{ width:"48px", height:"48px", display:"flex", alignItems:"center", justifyContent:"center", background:`${c.darkest}80`, border:`1px solid ${c.border}`, clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))", marginBottom:"20px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">{f.icon}</svg>
                </div>
                <h3 style={{ fontSize:"13px", letterSpacing:"2px", fontWeight:700, color:c.text1, marginBottom:"10px", fontFamily:"'Anybody',sans-serif" }}>{f.title}</h3>
                <p style={{ fontSize:"12px", color:c.text3, lineHeight:1.7, fontWeight:400 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ STATS + FINAL CTA ═══════ */}
        <section className="lp-section" aria-label="Stats and call to action" style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          position:"relative", zIndex:2, padding:"80px 24px",
        }}>
          {/* Stats */}
          <div className="stat-row" style={{ display:"flex", gap:"56px", justifyContent:"center", flexWrap:"wrap", marginBottom:"72px" }}>
            {[
              { num:"4", label:"CARD CATEGORIES", sub:"Pokemon \u00B7 Sports \u00B7 MTG \u00B7 Yu-Gi-Oh" },
              { num:"\u221E", label:"CARDS TRACKED", sub:"No limits on your vault" },
              { num:"$0", label:"FOREVER FREE", sub:"No subscriptions, no paywalls" },
            ].map((s,i)=>(
              <div key={i} style={{ textAlign:"center", minWidth:"150px" }}>
                <div className="stat-num">{s.num}</div>
                <p style={{ fontSize:"9px", letterSpacing:"3px", color:c.text2, fontWeight:600, marginTop:"10px" }}>{s.label}</p>
                <p style={{ fontSize:"10px", color:c.text3, fontWeight:400, marginTop:"4px" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div aria-hidden="true" style={{ width:"80px", height:"1px", margin:"0 auto 64px", background:`linear-gradient(90deg,transparent,${c.gold},transparent)` }}/>

          {/* Final CTA */}
          <div style={{ textAlign:"center", maxWidth:"500px" }}>
            <p style={{ fontSize:"10px", letterSpacing:"5px", color:c.gold, fontWeight:600, marginBottom:"16px" }}>READY?</p>
            <h2 style={{ fontSize:"clamp(26px,6vw,40px)", fontWeight:800, fontFamily:"'Anybody',sans-serif", lineHeight:1.2, marginBottom:"20px", color:c.text1 }}>
              Stop guessing.<br/>Start tracking.
            </h2>
            <p style={{ fontSize:"14px", color:c.text3, lineHeight:1.7, marginBottom:"44px" }}>
              Your cards are worth more than you think.<br/>Know exactly how much.
            </p>
            <button className="cta-btn-sm" onClick={onEnter} aria-label="Enter the Collectibulls app">
              ENTER THE VAULT
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M13 6L19 12L13 18" stroke={c.darkest} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
            <p style={{ margin:0, fontSize:"9px", letterSpacing:"2px", color:c.text3 }}>COLLECTIBULLS {"\u00A9"} 2026</p>
          </div>
        </section>

      </div>
    </>
  );
}
