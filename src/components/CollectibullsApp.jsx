"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePersistedState } from "@/lib/usePersistedState";
import { c, catColors, defaultVaultCards, defaultTradeTx, trendData, achievementData, categories, gradeOptions, sortOptions, formatDate, formatDateLong } from "@/lib/constants";

/* ═══════════════════════════════════════════
   SHARED: Colors, Data, Icons, Components
   ═══════════════════════════════════════════ */

// ─── Shared SVG Icons ───
const TrendArrow = ({ up, size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    {up ? <path d="M3 11L8 5L13 11" stroke={c.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="M3 5L8 11L13 5" stroke={c.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
  </svg>
);
const BuyIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12L12 5L19 12" stroke={c.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SellIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12L12 19L19 12" stroke={c.magenta} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={c.text2} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SearchIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="7" stroke={c.text3} strokeWidth="2"/>
    <path d="M16.5 16.5L20 20" stroke={c.text3} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke={c.darkest} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const ChevronDown = ({ color = c.text3 }) => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SettingsChevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 4L10 8L6 12" stroke={c.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GridIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
    <rect x="10" y="1" width="7" height="7" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
    <rect x="1" y="10" width="7" height="7" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
    <rect x="10" y="10" width="7" height="7" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
  </svg>
);
const ListIconSvg = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="2" width="16" height="3" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
    <rect x="1" y="7.5" width="16" height="3" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
    <rect x="1" y="13" width="16" height="3" rx="1" stroke={active ? c.gold : c.text3} strokeWidth="1.5" fill={active ? `${c.gold}15` : "none"}/>
  </svg>
);

const TabIcon = ({ id, active }) => {
  const s = active ? c.gold : c.text3; const w = 1.8;
  const p = {
    home: <><path d="M4 11L12 4L20 11" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 9.5V19C6 19.5 6.5 20 7 20H10V15C10 14.5 10.5 14 11 14H13C13.5 14 14 14.5 14 15V20H17C17.5 20 18 19.5 18 19V9.5" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    collection: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke={s} strokeWidth={w} fill="none"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke={s} strokeWidth={w} fill="none"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={s} strokeWidth={w} fill="none"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={s} strokeWidth={w} fill="none"/></>,
    trade: <><path d="M7 17L4 14L7 11" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14H16" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round"/><path d="M17 7L20 10L17 13" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 10H8" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round"/></>,
    search: <><circle cx="11" cy="11" r="7" stroke={s} strokeWidth={w} fill="none"/><path d="M16.5 16.5L20 20" stroke={s} strokeWidth={w} strokeLinecap="round"/></>,
    comps: <><path d="M3 3V21H21" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14L11 8L15 12L20 5" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="14" r="1.5" fill={s}/><circle cx="11" cy="8" r="1.5" fill={s}/><circle cx="15" cy="12" r="1.5" fill={s}/><circle cx="20" cy="5" r="1.5" fill={s}/></>,
    profile: <><circle cx="12" cy="9" r="4" stroke={s} strokeWidth={w} fill="none"/><path d="M5 20C5 17 8 14.5 12 14.5C16 14.5 19 17 19 20" stroke={s} strokeWidth={w} fill="none" strokeLinecap="round"/></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24">{p[id]}</svg>;
};

const ToggleSwitch = ({ on, onToggle }) => (
  <button onClick={onToggle} style={{
    width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
    background: on ? `${c.gold}40` : c.border, position: "relative", transition: "background 0.2s ease", padding: 0,
  }}>
    <div style={{
      width: "16px", height: "16px", borderRadius: "50%",
      background: on ? c.gold : c.text3, position: "absolute", top: "3px",
      left: on ? "21px" : "3px", transition: "all 0.2s ease",
      boxShadow: on ? `0 0 8px ${c.gold}40` : "none",
    }}/>
  </button>
);

const CardPlaceholder = ({ category }) => {
  const color = catColors[category] || c.text3;
  return (
    <div style={{
      width: "100%", aspectRatio: "2.5/3.5", borderRadius: "3px",
      background: `linear-gradient(145deg, ${color}12, ${c.dark} 50%, ${color}06)`,
      border: `1px solid ${color}20`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(135deg, transparent, transparent 8px, ${color}04 8px, ${color}04 9px)`,
      }}/>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, position: "relative" }}>
        <rect x="3" y="2" width="18" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
        <path d="M8 7h8M8 11h5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="2" stroke={color} strokeWidth="1.2"/>
      </svg>
      <span style={{ fontSize: "7px", letterSpacing: "2px", color: `${color}50`, marginTop: "6px", fontWeight: 600, position: "relative" }}>
        {category.toUpperCase()}
      </span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: c.surfaceAlt, border: `1px solid ${c.borderLight}`, borderRadius: "10px",
        padding: "10px 14px", boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${c.gold}15`,
      }}>
        <p style={{ margin: 0, fontSize: "9px", letterSpacing: "2px", color: c.text3, fontFamily: "'Chakra Petch', sans-serif" }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700, fontFamily: "'Chakra Petch', sans-serif", color: c.goldLight }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const AchievementIcon = ({ icon, unlocked, size = 20 }) => {
  const col = unlocked ? c.gold : c.text3;
  const o = unlocked ? 1 : 0.3;
  const fill = unlocked ? `${c.gold}20` : "none";
  const m = { star:<path d="M12 2L14.9 8.6L22 9.3L16.7 14L18.2 21L12 17.3L5.8 21L7.3 14L2 9.3L9.1 8.6L12 2Z" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/>,
    shield:<><path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke={col} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    diamond:<><path d="M6 3H18L22 9L12 21L2 9L6 3Z" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/><path d="M2 9H22" stroke={col} strokeWidth="1.2" strokeLinecap="round"/></>,
    grid:<><rect x="3" y="3" width="7" height="7" rx="1" stroke={col} strokeWidth="1.8" fill={fill}/><rect x="14" y="3" width="7" height="7" rx="1" stroke={col} strokeWidth="1.8" fill={fill}/><rect x="3" y="14" width="7" height="7" rx="1" stroke={col} strokeWidth="1.8" fill={fill}/><rect x="14" y="14" width="7" height="7" rx="1" stroke={col} strokeWidth="1.8" fill={fill}/></>,
    trophy:<><path d="M8 21H16" stroke={col} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 17V21" stroke={col} strokeWidth="1.8" strokeLinecap="round"/><path d="M7 4H17V10C17 13.3 14.8 16 12 16C9.2 16 7 13.3 7 10V4Z" stroke={col} strokeWidth="1.8" fill={fill}/><path d="M7 7H4C4 10 5.5 11 7 11" stroke={col} strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M17 7H20C20 10 18.5 11 17 11" stroke={col} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    flame:<path d="M12 22C16 22 19 19 19 15C19 11 16 9 15 6C14.5 7.5 13 9 12 9C11 9 10 7.5 10 6C9 8 8 9 7 11C5.5 13 5 15 5 15C5 19 8 22 12 22Z" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/>,
    bolt:<path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/>,
    crown:<><path d="M3 18H21V20H3V18Z" stroke={col} strokeWidth="1.8" fill={fill}/><path d="M3 18L5 8L9 12L12 6L15 12L19 8L21 18" stroke={col} strokeWidth="1.8" fill={fill} strokeLinejoin="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: o }}>{m[icon]}</svg>;
};

// ─── Bull Logo Mark ───
const BullLogo = ({ size = 40 }) => {
  const scale = size / 240;
  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 240 200" aria-label="Collectibulls logo" role="img">
      <defs>
        <linearGradient id="blg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.goldLight}/>
          <stop offset="50%" stopColor={c.gold}/>
          <stop offset="100%" stopColor={c.goldDim}/>
        </linearGradient>
        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Left horn */}
      <path d="M72 78 C62 58, 38 20, 18 8 C14 5, 12 8, 16 14 C30 38, 48 62, 65 80" fill="url(#blg)" stroke={`${c.goldDim}`} strokeWidth="0.5"/>
      {/* Right horn */}
      <path d="M168 78 C178 58, 202 20, 222 8 C226 5, 228 8, 224 14 C210 38, 192 62, 175 80" fill="url(#blg)" stroke={`${c.goldDim}`} strokeWidth="0.5"/>
      {/* Head shield */}
      <path d="M72 80 C72 68, 88 55, 120 55 C152 55, 168 68, 168 80 L168 115 C168 125, 162 140, 148 150 C140 156, 132 162, 120 168 C108 162, 100 156, 92 150 C78 140, 72 125, 72 115 Z" fill="url(#blg)" stroke={`${c.goldLight}40`} strokeWidth="0.5"/>
      {/* Inner face */}
      <path d="M82 84 C82 75, 94 65, 120 65 C146 65, 158 75, 158 84 L158 112 C158 120, 153 133, 142 142 C136 147, 129 152, 120 157 C111 152, 104 147, 98 142 C87 133, 82 120, 82 112 Z" fill={c.dark}/>
      {/* Left ear */}
      <path d="M72 82 C65 75, 58 72, 54 76 C50 80, 55 88, 62 90 C66 91, 70 88, 72 85" fill="url(#blg)"/>
      {/* Right ear */}
      <path d="M168 82 C175 75, 182 72, 186 76 C190 80, 185 88, 178 90 C174 91, 170 88, 168 85" fill="url(#blg)"/>
      {/* Left eye */}
      <path d="M96 95 L106 90 L110 98 L104 104 Z" fill={c.cyan} filter="url(#eyeGlow)"/>
      {/* Right eye */}
      <path d="M144 95 L134 90 L130 98 L136 104 Z" fill={c.cyan} filter="url(#eyeGlow)"/>
      {/* Nose bridge */}
      <path d="M114 108 L120 105 L126 108" fill="none" stroke={`${c.gold}60`} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Nostrils */}
      <ellipse cx="108" cy="125" rx="5" ry="3.5" fill={`${c.gold}30`} stroke={`${c.gold}50`} strokeWidth="1"/>
      <ellipse cx="132" cy="125" rx="5" ry="3.5" fill={`${c.gold}30`} stroke={`${c.gold}50`} strokeWidth="1"/>
      {/* Nose ring */}
      <path d="M112 130 C112 140, 120 146, 120 146 C120 146, 128 140, 128 130" fill="none" stroke="url(#blg)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="120" cy="146" r="2" fill={c.goldLight}/>
      {/* Forehead diamond */}
      <path d="M120 72 L124 78 L120 84 L116 78 Z" fill={`${c.cyan}40`} stroke={`${c.cyan}60`} strokeWidth="0.5"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════
   HOME SCREEN
   ═══════════════════════════════════════════ */

function HomeScreen({ vaultData, tradeData, onNavigate }) {
  const [trendPeriod, setTrendPeriod] = useState("6M");
  const totalCards = vaultData.length;
  const portfolioValue = vaultData.reduce((s, cd) => s + cd.value, 0);
  const avgValue = totalCards > 0 ? Math.round(portfolioValue / totalCards) : 0;
  const topCard = vaultData.length > 0 ? [...vaultData].sort((a,b) => b.value - a.value)[0] : null;
  const recentTx = [...tradeData].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const movers = [...vaultData].filter(cd => cd.change != null).sort((a,b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5).map(cd => ({ card: cd.name, category: cd.category, change: cd.change, value: cd.value, direction: cd.change >= 0 ? "up" : "down" }));
  return (
    <div>
      {/* Header */}
      <div className="slide-up d1" style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BullLogo size={44}/>
            <div>
              <div style={{ lineHeight: 1 }}>
                <span className="gold-shimmer" style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'Anybody', sans-serif", letterSpacing: "1px" }}>COLLECTI</span>
                <span style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'Anybody', sans-serif", letterSpacing: "1px", color: c.cyan, textShadow: `0 0 20px ${c.cyan}30` }}>BULLS</span>
              </div>
              <p style={{ margin: 0, fontSize: "7px", letterSpacing: "5px", color: c.text3, fontWeight: 500, marginTop: "2px" }}>TRACK {"\u00B7"} TRADE {"\u00B7"} TRIUMPH</p>
            </div>
          </div>
          <div style={{ width: "38px", height: "38px", borderRadius: "4px", background: c.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke={c.text2} strokeWidth="1.8" strokeLinecap="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke={c.text2} strokeWidth="1.8" strokeLinecap="round"/></svg>
            <div style={{ position: "absolute", top: "6px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: c.magenta, boxShadow: `0 0 6px ${c.magenta}80` }}/>
          </div>
        </div>
      </div>

      {/* Portfolio Card */}
      <div className="slide-up d2" style={{ padding: "20px" }}>
        <div className="panel-clipped" style={{ padding: "28px 24px 24px", background: `linear-gradient(165deg, ${c.surfaceAlt} 0%, ${c.dark} 60%, ${c.surface} 100%)`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: "14px", width: "1px", height: "40px", background: `linear-gradient(180deg, ${c.gold}60, transparent)` }}/>
          <div style={{ position: "absolute", top: "14px", right: 0, width: "40px", height: "1px", background: `linear-gradient(270deg, ${c.gold}60, transparent)` }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.green, boxShadow: `0 0 8px ${c.green}60`, animation: "pulse 2s infinite" }}/>
            <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>PORTFOLIO VALUE</p>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <div><span style={{ fontSize: "14px", fontWeight: 500, color: c.goldDim, verticalAlign: "top", position: "relative", top: "6px" }}>$</span><span style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "-1px", color: c.goldLight, textShadow: `0 0 40px ${c.gold}15` }}>{portfolioValue.toLocaleString()}</span></div>
            {portfolioValue > 0 && <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px 3px 6px", background: `${c.cyan}08`, border: `1px solid ${c.cyan}20`, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: c.cyan }}>LIVE</span>
            </div>}
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: c.text3, fontWeight: 500 }}>{totalCards} cards in vault</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: 0, marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${c.border}60` }}>
            {[{ label:"CARDS",value:totalCards.toString(),sub:"in vault" },null,{ label:"AVG VALUE",value:`$${avgValue.toLocaleString()}`,sub:"per card" },null,{ label:"TOP CARD",value:topCard?`$${topCard.value>=1000?(topCard.value/1000).toFixed(1)+"K":topCard.value.toLocaleString()}`:"--",sub:topCard?topCard.name.split(" ").slice(0,2).join(" "):"--" }].map((s,i) =>
              s===null ? <div key={i} style={{ background: `linear-gradient(180deg, ${c.border}80, transparent)` }}/> :
              <div key={i} style={{ textAlign: "center" }}><p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{s.label}</p><p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700, color: c.text1 }}>{s.value}</p><p style={{ margin: "2px 0 0", fontSize: "9px", color: c.text3, fontWeight: 500 }}>{s.sub}</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="slide-up d3" style={{ padding: "0 20px 20px" }}>
        <div className="panel" style={{ padding: "22px 20px 16px", background: `linear-gradient(180deg, ${c.surface}, ${c.dark})` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "3px", height: "16px", background: c.cyan, borderRadius: "2px", boxShadow: `0 0 8px ${c.cyan}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>TREND</p></div>
            <div style={{ display: "flex", gap: "2px", background: `${c.darkest}80`, borderRadius: "2px", padding: "2px" }}>
              {["1M","3M","6M","1Y"].map(p=>(
                <button key={p} onClick={()=>setTrendPeriod(p)} style={{ padding: "4px 10px", borderRadius: "1px", border: "none", cursor: "pointer", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", fontFamily: "'Chakra Petch', sans-serif", background: trendPeriod===p ? c.surface : "transparent", color: trendPeriod===p ? c.gold : c.text3, boxShadow: trendPeriod===p ? `inset 0 0 0 1px ${c.gold}25` : "none", transition: "all 0.15s ease" }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ height: "150px" }}>
            {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.cyan} stopOpacity={0.15}/><stop offset="100%" stopColor={c.cyan} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: c.text3, fontFamily: "'Chakra Petch'" }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: c.text3, fontFamily: "'Chakra Petch'" }} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="value" stroke={c.cyan} strokeWidth={2} fill="url(#cf)" dot={false} activeDot={{ r: 4, fill: c.cyan, stroke: c.dark, strokeWidth: 2 }}/>
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "11px", color: c.text3, fontWeight: 500 }}>Add cards to your vault to see trends</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movers */}
      <div className="slide-up d4" style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "3px", height: "16px", background: c.green, borderRadius: "2px", boxShadow: `0 0 8px ${c.green}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>TOP MOVERS</p>
        </div>
        <div className="hide-sb" style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
          {movers.length === 0 && <p style={{ fontSize: "11px", color: c.text3, fontWeight: 500, padding: "16px 0" }}>Add cards to see top movers</p>}
          {movers.map((card,i)=>{
            const isUp=card.direction==="up"; const ac=isUp?c.green:c.red; const cc=catColors[card.category]||c.text3;
            return (
              <div key={i} className="mover-card" style={{ minWidth: "140px", flexShrink: 0, background: c.surface, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: "10px", height: "1px", background: `linear-gradient(90deg, ${ac}60, transparent)` }}/>
                <div style={{ padding: "14px" }}>
                  <div style={{ display: "inline-block", padding: "2px 8px", marginBottom: "8px", fontSize: "8px", fontWeight: 600, letterSpacing: "1.5px", color: cc, background: `${cc}10`, border: `1px solid ${cc}20` }}>{card.category.toUpperCase()}</div>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>{card.card}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "10px" }}>
                    <TrendArrow up={isUp}/><span style={{ fontSize: "18px", fontWeight: 700, color: ac, textShadow: `0 0 16px ${ac}25` }}>{Math.abs(card.change)}%</span>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: c.text2 }}>${card.value.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tx */}
      <div className="slide-up d4" style={{ padding: "0 20px 20px" }}>
        <div className="panel" style={{ padding: "22px 20px 12px", background: `linear-gradient(180deg, ${c.surface}, ${c.dark})` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "3px", height: "16px", background: c.magenta, borderRadius: "2px", boxShadow: `0 0 8px ${c.magenta}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>TRANSACTIONS</p></div>
            <span onClick={() => onNavigate && onNavigate("trade")} style={{ fontSize: "10px", color: c.cyan, cursor: "pointer", fontWeight: 600, letterSpacing: "1px", borderBottom: `1px solid ${c.cyan}30`, paddingBottom: "1px" }}>VIEW ALL</span>
          </div>
          {recentTx.length === 0 && <p style={{ fontSize: "11px", color: c.text3, fontWeight: 500, padding: "12px 0", textAlign: "center" }}>No transactions yet. Log your first trade.</p>}
          {recentTx.map((tx,i)=>{
            const isBuy=tx.type==="buy"; const cc=catColors[tx.category]||c.text3;
            const txDate = typeof tx.date === "string" && tx.date.includes("-") ? formatDate(tx.date) : tx.date;
            return (
              <div key={i} className="tx-row" style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: i<recentTx.length-1?`1px solid ${c.border}30`:"none" }}>
                <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: isBuy?`${c.green}06`:`${c.magenta}06`, border: `1px solid ${isBuy?c.green:c.magenta}15`, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))", flexShrink: 0 }}>
                  {isBuy?<BuyIcon/>:<SellIcon/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.card}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                    <span style={{ fontSize: "7px", fontWeight: 700, letterSpacing: "1px", padding: "1px 5px", color: cc, background: `${cc}10`, border: `1px solid ${cc}18` }}>{tx.category.toUpperCase()}</span>
                    <span style={{ fontSize: "9px", color: c.text3, fontWeight: 500 }}>{tx.grade}</span>
                    <span style={{ fontSize: "9px", color: c.text3 }}>{"\u00B7"}</span>
                    <span style={{ fontSize: "9px", color: c.text3 }}>{txDate}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: isBuy?c.text1:c.green }}>{isBuy?"-":"+"}${tx.price.toLocaleString()}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", color: isBuy?`${c.green}80`:`${c.magenta}80`, textTransform: "uppercase" }}>{tx.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VAULT SCREEN
   ═══════════════════════════════════════════ */

function VaultScreen({ sharedCards, setSharedCards }) {
  const [viewMode, setViewMode] = useState("grid");
  const [activeCat, setActiveCat] = useState("All");
  const [activeGrade, setActiveGrade] = useState("All Grades");
  const [sortBy, setSortBy] = useState("valueDesc");
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("Football");
  const [addGrade, setAddGrade] = useState("");
  const [addGradeCompany, setAddGradeCompany] = useState("");
  const [addValue, setAddValue] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addImage, setAddImage] = useState(null);
  const [addCert, setAddCert] = useState("");
  const [certLoading, setCertLoading] = useState(false);
  const [certError, setCertError] = useState("");
  const [addSuggestions, setAddSuggestions] = useState([]);
  const [addSugLoading, setAddSugLoading] = useState(false);
  const [showAddSuggestions, setShowAddSuggestions] = useState(false);
  const addDebounceRef = useRef(null);
  const addFileRef = useRef(null);
  const cards = sharedCards;

  const allCategories = ["Pokemon","Football","Basketball","Baseball","Soccer","Hockey","UFC/MMA","Tennis","MTG","Yu-Gi-Oh"];

  // Typeahead for add card
  const handleAddNameChange = (val) => {
    setAddName(val);
    setShowAddSuggestions(true);
    if (addDebounceRef.current) clearTimeout(addDebounceRef.current);
    if (val.trim().length < 3) { setAddSuggestions([]); setAddSugLoading(false); return; }
    setAddSugLoading(true);
    addDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ebay?q=${encodeURIComponent(val.trim())}&limit=6&sort=relevance&category=all_cards`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAddSuggestions(data.items || []);
      } catch { setAddSuggestions([]); }
      finally { setAddSugLoading(false); }
    }, 400);
  };

  const selectAddSuggestion = (item) => {
    setAddName(item.title);
    setAddImage(item.imageUrl || null);
    if (item.price?.value) setAddValue(item.price.value.toString());
    // Auto-detect category from title
    const title = item.title.toLowerCase();
    if (/pokemon|pikachu|charizard/i.test(title)) setAddCategory("Pokemon");
    else if (/mtg|magic|planeswalker/i.test(title)) setAddCategory("MTG");
    else if (/yu-gi-oh|yugioh|dark magician|blue.eyes/i.test(title)) setAddCategory("Yu-Gi-Oh");
    else if (/nfl|football|quarterback|touchdown|panini prizm|donruss|mosaic/i.test(title)) setAddCategory("Football");
    else if (/nba|basketball|dunk|hoops/i.test(title)) setAddCategory("Basketball");
    else if (/mlb|baseball|topps chrome|bowman/i.test(title)) setAddCategory("Baseball");
    else if (/soccer|premier league|fifa|mls/i.test(title)) setAddCategory("Soccer");
    else if (/nhl|hockey|upper deck/i.test(title)) setAddCategory("Hockey");
    else if (/ufc|mma|fighter/i.test(title)) setAddCategory("UFC/MMA");
    else if (/tennis|atp|wta/i.test(title)) setAddCategory("Tennis");
    // Auto-detect grade from title
    const gradePatterns = [
      [/PSA\s*(?:GEM\s*(?:MT|MINT))?\s*10/i, "PSA", "PSA GEM MT 10"],
      [/PSA\s*(?:MINT)?\s*9\b/i, "PSA", "PSA MINT 9"],
      [/PSA\s*(?:NM-MT)?\s*8\b/i, "PSA", "PSA NM-MT 8"],
      [/PSA\s*(?:NM)?\s*7\b/i, "PSA", "PSA NM 7"],
      [/PSA\s*(?:EX-MT)?\s*6\b/i, "PSA", "PSA EX-MT 6"],
      [/PSA\s*(?:EX)?\s*5\b/i, "PSA", "PSA EX 5"],
      [/BGS\s*(?:PRISTINE)?\s*10/i, "BGS", "BGS PRISTINE 10"],
      [/BGS\s*(?:GEM\s*MINT)?\s*9\.5/i, "BGS", "BGS GEM MINT 9.5"],
      [/BGS\s*(?:MINT)?\s*9\b/i, "BGS", "BGS MINT 9"],
      [/BGS\s*8\.5/i, "BGS", "BGS NM-MT+ 8.5"],
      [/BGS\s*8\b/i, "BGS", "BGS NM-MT 8"],
      [/CGC\s*(?:PRISTINE)?\s*10/i, "CGC", "CGC PRISTINE 10"],
      [/CGC\s*(?:GEM\s*MINT)?\s*9\.5/i, "CGC", "CGC GEM MINT 9.5"],
      [/CGC\s*(?:MINT)?\s*9\b/i, "CGC", "CGC MINT 9"],
      [/CGC\s*8/i, "CGC", "CGC NM/MT 8"],
      [/CGC\s*7/i, "CGC", "CGC NM 7"],
      [/SGC\s*10/i, "SGC", "SGC PRISTINE 10"],
      [/SGC\s*9\.5/i, "SGC", "SGC GEM MINT 9.5"],
      [/SGC\s*9\b/i, "SGC", "SGC MINT 9"],
      [/SGC\s*8/i, "SGC", "SGC NM/MT 8"],
    ];
    for (const [pattern, company, value] of gradePatterns) {
      if (pattern.test(item.title)) { setAddGradeCompany(company); setAddGrade(value); break; }
    }
    setShowAddSuggestions(false);
    setAddSuggestions([]);
  };

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setAddImage(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // PSA Cert Lookup
  const handleCertLookup = async () => {
    if (!addCert.trim() || !/^\d+$/.test(addCert.trim())) { setCertError("Enter a valid cert number"); return; }
    setCertLoading(true); setCertError("");
    try {
      const res = await fetch(`/api/psa?cert=${addCert.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cert not found");
      // Auto-populate fields from PSA data
      const title = [data.year, data.brand, data.subject, data.cardNumber ? `#${data.cardNumber}` : ""].filter(Boolean).join(" ");
      if (title) setAddName(title);
      // PSA doesn't expose images via API - search eBay for an image
      try {
        const imgRes = await fetch(`/api/ebay?q=${encodeURIComponent(title)}&limit=3&sort=relevance&category=all_cards`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const firstWithImage = (imgData.items || []).find(i => i.imageUrl);
          if (firstWithImage?.imageUrl) setAddImage(firstWithImage.imageUrl);
        }
      } catch {}

      if (data.grade) {
        const gradeNum = data.grade.match(/[\d.]+/)?.[0] || "";
        const gradeLabel = data.grade;
        setAddGradeCompany("PSA");
        // Map PSA grade text to our dropdown values
        const psaMap = { "10": "PSA GEM MT 10", "9": "PSA MINT 9", "8": "PSA NM-MT 8", "7": "PSA NM 7", "6": "PSA EX-MT 6", "5": "PSA EX 5", "4": "PSA VG-EX 4", "3": "PSA VG 3", "2": "PSA GOOD 2", "1": "PSA PR 1" };
        setAddGrade(psaMap[gradeNum] || `PSA ${gradeLabel}`);
      }
      if (data.psaEstimate) setAddValue(data.psaEstimate.toString());
      // Auto-detect category from PSA category field
      const cat = (data.category || "").toLowerCase();
      if (/baseball/i.test(cat)) setAddCategory("Baseball");
      else if (/basketball/i.test(cat)) setAddCategory("Basketball");
      else if (/football/i.test(cat)) setAddCategory("Football");
      else if (/hockey/i.test(cat)) setAddCategory("Hockey");
      else if (/soccer/i.test(cat)) setAddCategory("Soccer");
      else if (/tennis/i.test(cat)) setAddCategory("Tennis");
      else if (/ufc|mma|boxing/i.test(cat)) setAddCategory("UFC/MMA");
      else if (/pokemon/i.test(cat)) setAddCategory("Pokemon");
      else if (/magic/i.test(cat)) setAddCategory("MTG");
      else if (/yu-gi-oh/i.test(cat)) setAddCategory("Yu-Gi-Oh");
      setAddNotes(`PSA Cert #${addCert.trim()}${data.variety ? ` | ${data.variety}` : ""}${data.population ? ` | Pop: ${data.population}` : ""}`);
    } catch (e) {
      setCertError(e.message);
    } finally { setCertLoading(false); }
  };

  const handleAddCard = () => {
    if (!addName.trim() || !addValue) return;
    const newCard = {
      id: Date.now(),
      name: addName.replace(/[<>"'&]/g, "").trim().slice(0, 150),
      category: addCategory,
      grade: addGrade || "Ungraded",
      condition: "Unknown",
      value: parseFloat(addValue),
      change: 0,
      dateAdded: new Date().toISOString().split("T")[0],
      set: "",
      year: new Date().getFullYear(),
      rarity: "",
      notes: addNotes.replace(/[<>"'&]/g, "").trim().slice(0, 300),
      image: addImage || null,
    };
    setSharedCards(prev => [newCard, ...prev]);
    setAddName(""); setAddCategory("Football"); setAddGrade(""); setAddGradeCompany(""); setAddValue(""); setAddNotes(""); setAddImage(null); setAddCert(""); setCertError("");
    setShowAddCard(false);
  };

  const filtered = useMemo(() => {
    let list = [...cards];
    if (activeCat !== "All") list = list.filter(cd => cd.category === activeCat);
    if (activeGrade !== "All Grades") list = list.filter(cd => cd.grade === activeGrade);
    if (search) list = list.filter(cd => cd.name.toLowerCase().includes(search.toLowerCase()));
    switch (sortBy) {
      case "valueDesc": list.sort((a,b)=>b.value-a.value); break;
      case "valueAsc": list.sort((a,b)=>a.value-b.value); break;
      case "dateDesc": list.sort((a,b)=>new Date(b.dateAdded)-new Date(a.dateAdded)); break;
      case "nameAsc": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [cards, activeCat, activeGrade, sortBy, search]);

  const totalValue = filtered.reduce((s, cd) => s + cd.value, 0);

  return (
    <div>
      <div className="slide-up d1" style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>YOUR COLLECTION</p><p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, fontFamily: "'Anybody', sans-serif", color: c.text1, letterSpacing: "0.5px" }}>THE VAULT</p></div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button onClick={() => setShowAddCard(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px 8px 10px", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))", boxShadow: `0 0 16px ${c.gold}15` }}>
              <PlusIcon/><span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", color: c.darkest }}>ADD</span>
            </button>
            {[["grid",GridIcon],["list",ListIconSvg]].map(([mode,Icon])=>(
              <button key={mode} onClick={()=>setViewMode(mode)} style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", background: viewMode===mode?`${c.gold}10`:c.surface, border: viewMode===mode?`1px solid ${c.gold}30`:`1px solid ${c.border}`, cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                <Icon active={viewMode===mode}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="slide-up d2" style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: c.surface, border: `1px solid ${c.border}`, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
          <SearchIconSvg/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your vault..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: c.text1, fontSize: "12px", fontFamily: "'Chakra Petch'", fontWeight: 500, letterSpacing: "0.5px" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}><CloseIcon/></button>}
        </div>
      </div>

      {/* Cats */}
      <div className="slide-up d2 hide-sb" style={{ padding: "14px 20px 0", display: "flex", gap: "6px", overflowX: "auto" }}>
        {categories.map(cat=>{
          const isA=activeCat===cat; const cc=cat==="All"?c.gold:catColors[cat];
          return <button key={cat} className="chip" onClick={()=>setActiveCat(cat)} style={{ padding: "6px 14px", fontSize: "9px", fontWeight: 600, letterSpacing: "1.5px", background: isA?`${cc}15`:c.surface, color: isA?cc:c.text3, border: `1px solid ${isA?cc+"35":c.border}`, whiteSpace: "nowrap", clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>{cat.toUpperCase()}</button>;
        })}
      </div>

      {/* Sort + Grade */}
      <div className="slide-up d3" style={{ padding: "10px 20px 0", display: "flex", gap: "6px", justifyContent: "space-between", alignItems: "center" }}>
        <div className="hide-sb" style={{ display: "flex", gap: "4px", overflowX: "auto", flex: 1 }}>
          {sortOptions.map(opt=>(
            <button key={opt.key} className="chip" onClick={()=>setSortBy(opt.key)} style={{ padding: "4px 10px", fontSize: "8px", fontWeight: 600, letterSpacing: "1px", background: sortBy===opt.key?`${c.cyan}10`:"transparent", color: sortBy===opt.key?c.cyan:c.text3, border: `1px solid ${sortBy===opt.key?c.cyan+"30":c.border+"60"}`, whiteSpace: "nowrap", borderRadius: "1px" }}>{opt.label.toUpperCase()}</button>
          ))}
        </div>
        <button className="chip" onClick={()=>setShowFilters(!showFilters)} style={{ padding: "4px 10px", fontSize: "8px", fontWeight: 600, letterSpacing: "1px", background: showFilters?`${c.magenta}10`:"transparent", color: showFilters?c.magenta:c.text3, border: `1px solid ${showFilters?c.magenta+"30":c.border+"60"}`, borderRadius: "1px", whiteSpace: "nowrap" }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ marginRight: "4px", verticalAlign: "middle" }}><path d="M2 4h12M4 8h8M6 12h4" stroke={showFilters?c.magenta:c.text3} strokeWidth="1.5" strokeLinecap="round"/></svg>GRADE
        </button>
      </div>

      {showFilters && (
        <div style={{ padding: "8px 20px 0", animation: "fadeIn 0.15s ease" }}>
          <div className="hide-sb" style={{ display: "flex", gap: "4px", overflowX: "auto" }}>
            {gradeOptions.map(g=>(
              <button key={g} className="chip" onClick={()=>setActiveGrade(g)} style={{ padding: "4px 10px", fontSize: "8px", fontWeight: 600, letterSpacing: "1px", background: activeGrade===g?`${c.magenta}10`:"transparent", color: activeGrade===g?c.magenta:c.text3, border: `1px solid ${activeGrade===g?c.magenta+"30":c.border+"60"}`, borderRadius: "1px", whiteSpace: "nowrap" }}>{g.toUpperCase()}</button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="slide-up d3" style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: c.text3, fontWeight: 500, letterSpacing: "1px" }}>{filtered.length} CARD{filtered.length!==1?"S":""}</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: c.goldLight }}>${totalValue.toLocaleString()}</span>
        </div>
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${c.gold}30, ${c.border}40, transparent)`, marginTop: "10px" }}/>
      </div>

      {/* Grid */}
      {viewMode==="grid" && (
        <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
          {filtered.map((card,i)=>{
            const cc=catColors[card.category]||c.text3; const isUp=card.change>=0;
            return (
              <div key={card.id} className="card-tile" onClick={()=>setSelectedCard(card)} style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark})`, animation: `slideUp 0.35s ease-out ${i*0.04}s forwards`, opacity: 0 }}>
                <div style={{ padding: "3px 3px 0" }}>{card.image ? <div style={{ width: "100%", aspectRatio: "2.5/3.5", borderRadius: "3px", overflow: "hidden" }}><img src={card.image} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: c.darkest }}/></div> : <CardPlaceholder category={card.category}/>}</div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ display: "inline-block", padding: "1px 6px", marginBottom: "5px", fontSize: "7px", fontWeight: 700, letterSpacing: "1.5px", color: cc, background: `${cc}10`, border: `1px solid ${cc}18` }}>{card.category.toUpperCase()}</div>
                  <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: c.text1, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{card.name}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "9px", color: c.text3, fontWeight: 500 }}>{card.grade}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: c.goldLight }}>${card.value.toLocaleString()}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}><TrendArrow up={isUp} size={10}/><span style={{ fontSize: "10px", fontWeight: 600, color: isUp?c.green:c.red }}>{Math.abs(card.change)}%</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      {viewMode==="list" && (
        <div style={{ padding: "10px 20px" }}>
          {filtered.map((card,i)=>{
            const cc=catColors[card.category]||c.text3; const isUp=card.change>=0;
            return (
              <div key={card.id} className="list-row" onClick={()=>setSelectedCard(card)} style={{ display: "flex", alignItems: "center", gap: "14px", borderBottom: i<filtered.length-1?`1px solid ${c.border}25`:"none", animation: `slideUp 0.3s ease-out ${i*0.03}s forwards`, opacity: 0, cursor: "pointer", borderRadius: "2px", padding: "12px 10px", margin: "0 -10px" }}>
                <div style={{ width: "44px", height: "60px", flexShrink: 0 }}>{card.image ? <div style={{ width: "100%", height: "100%", borderRadius: "2px", overflow: "hidden" }}><img src={card.image} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: c.darkest }}/></div> : <CardPlaceholder category={card.category}/>}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: c.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1px", padding: "2px 6px", color: cc, background: `${cc}10`, border: `1px solid ${cc}18` }}>{card.category.toUpperCase()}</span>
                    <span style={{ fontSize: "10px", color: c.text3, fontWeight: 500 }}>{card.grade}</span>
                    <span style={{ fontSize: "10px", color: c.text3 }}>{card.set} ({card.year})</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <TrendArrow up={isUp} size={10}/>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: isUp?c.green:c.red, minWidth: "40px" }}>{isUp?"+":""}{card.change}%</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: "80px" }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: c.goldLight }}>${card.value.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length===0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: c.text3, fontWeight: 500 }}>No cards match your filters</p>
          <button onClick={()=>{setActiveCat("All");setActiveGrade("All Grades");setSearch("");}} style={{ marginTop: "12px", padding: "8px 20px", border: `1px solid ${c.cyan}40`, background: `${c.cyan}08`, color: c.cyan, fontSize: "10px", fontWeight: 600, letterSpacing: "1px", cursor: "pointer", fontFamily: "'Chakra Petch'", borderRadius: "1px" }}>RESET FILTERS</button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={()=>setSelectedCard(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", maxHeight: "85vh", overflowY: "auto", background: `linear-gradient(180deg, ${c.surfaceAlt}, ${c.dark})`, borderTop: `1px solid ${c.borderLight}40`, animation: "modalIn 0.3s ease forwards", clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "12px", right: "12px", height: "1px", background: `linear-gradient(90deg, transparent, ${c.gold}50, transparent)` }}/>
            <button onClick={()=>setSelectedCard(null)} style={{ position: "absolute", top: "16px", right: "16px", background: `${c.darkest}80`, border: `1px solid ${c.border}`, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, borderRadius: "2px" }}><CloseIcon/></button>
            <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "140px", position: "relative", cursor: "pointer" }} onClick={() => document.getElementById("detail-img-upload")?.click()}>
                {selectedCard.image ? (
                  <div style={{ width: "100%", aspectRatio: "2.5/3.5", borderRadius: "4px", overflow: "hidden", border: `1px solid ${c.border}30` }}>
                    <img src={selectedCard.image} alt={selectedCard.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: c.darkest }}/>
                  </div>
                ) : <CardPlaceholder category={selectedCard.category}/>}
                <div style={{ position: "absolute", bottom: selectedCard.image ? "4px" : "4px", left: "50%", transform: "translateX(-50%)", padding: "4px 12px", background: `${c.darkest}DD`, border: `1px solid ${c.gold}40`, borderRadius: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={c.gold} strokeWidth="1.8" fill="none"/><circle cx="12" cy="13" r="4" stroke={c.gold} strokeWidth="1.8" fill="none"/></svg>
                  <span style={{ fontSize: "7px", letterSpacing: "1px", color: c.gold, fontWeight: 600 }}>{selectedCard.image ? "CHANGE" : "ADD PHOTO"}</span>
                </div>
              </div>
              <input id="detail-img-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file || !file.type.startsWith("image/")) return;
                if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxDim = 400;
                    const scale = Math.min(maxDim / img.width, maxDim / img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                    setSharedCards(prev => prev.map(cd => cd.id === selectedCard.id ? { ...cd, image: dataUrl } : cd));
                    setSelectedCard(prev => ({ ...prev, image: dataUrl }));
                  };
                  img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
                e.target.value = "";
              }}/>
            </div>
            <div style={{ padding: "20px 24px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1.5px", padding: "2px 8px", color: catColors[selectedCard.category], background: `${catColors[selectedCard.category]}12`, border: `1px solid ${catColors[selectedCard.category]}20` }}>{selectedCard.category.toUpperCase()}</span>
                <span style={{ fontSize: "9px", color: c.text3, fontWeight: 500 }}>{selectedCard.set} ({selectedCard.year})</span>
              </div>
              <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, fontFamily: "'Anybody'", color: c.text1, lineHeight: 1.2 }}>{selectedCard.name}</h2>
              <p style={{ margin: 0, fontSize: "11px", color: c.text3, fontWeight: 500 }}>{selectedCard.rarity}</p>
              <div style={{ marginTop: "20px", padding: "18px", background: c.surface, border: `1px solid ${c.border}`, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>CURRENT VALUE</p><p style={{ margin: "4px 0 0", fontSize: "32px", fontWeight: 700, color: c.goldLight }}>${selectedCard.value.toLocaleString()}</p></div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px 4px 6px", background: `${selectedCard.change>=0?c.green:c.red}08`, border: `1px solid ${selectedCard.change>=0?c.green:c.red}20` }}>
                    <TrendArrow up={selectedCard.change>=0}/><span style={{ fontSize: "13px", fontWeight: 700, color: selectedCard.change>=0?c.green:c.red }}>{Math.abs(selectedCard.change)}%</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", marginTop: "16px", background: `${c.border}30` }}>
                {[{l:"GRADE",v:selectedCard.grade},{l:"CONDITION",v:selectedCard.condition},{l:"DATE ADDED",v:formatDateLong(selectedCard.dateAdded)},{l:"YEAR",v:selectedCard.year}].map((d,i)=>(
                  <div key={i} style={{ padding: "14px 16px", background: c.surface }}><p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{d.l}</p><p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 600, color: c.text1 }}>{d.v}</p></div>
                ))}
              </div>
              {selectedCard.notes && (
                <div style={{ marginTop: "16px", padding: "14px 16px", background: c.surface, border: `1px solid ${c.border}30` }}>
                  <p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>NOTES</p>
                  <p style={{ margin: "6px 0 0", fontSize: "12px", color: c.text2, lineHeight: 1.6, fontWeight: 400 }}>{selectedCard.notes}</p>
                </div>
              )}
              {/* Delete Card */}
              <button onClick={() => { if (window.confirm(`Remove "${selectedCard.name}" from your vault?`)) { setSharedCards(prev => prev.filter(cd => cd.id !== selectedCard.id)); setSelectedCard(null); } }} style={{ marginTop: "20px", width: "100%", padding: "12px", border: `1px solid ${c.red}25`, background: `${c.red}06`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke={c.red} strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: c.red, fontFamily: "'Chakra Petch'" }}>REMOVE FROM VAULT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setShowAddCard(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", background: `linear-gradient(180deg, ${c.surfaceAlt}, ${c.dark})`, borderTop: `1px solid ${c.borderLight}40`, animation: "modalIn 0.3s ease forwards", clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "12px", right: "12px", height: "1px", background: `linear-gradient(90deg, transparent, ${c.gold}50, transparent)` }}/>
            <div style={{ padding: "24px 24px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div><p style={{ margin: 0, fontSize: "9px", letterSpacing: "3px", color: c.text3 }}>NEW CARD</p><p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1 }}>ADD TO VAULT</p></div>
                <button onClick={() => setShowAddCard(false)} style={{ background: `${c.darkest}80`, border: `1px solid ${c.border}`, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}><CloseIcon/></button>
              </div>

              {/* PSA Cert Lookup */}
              <div style={{ marginBottom: "16px", padding: "14px", background: `${c.gold}06`, border: `1px solid ${c.gold}15`, borderRadius: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.97 12 22 12 22C12 22 3 16.97 3 12C3 7.03 7.03 2 12 2C16.97 2 21 7.03 21 12Z" stroke={c.gold} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: "9px", letterSpacing: "2px", color: c.gold, fontWeight: 600 }}>PSA CERT LOOKUP</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={addCert} onChange={e => { setAddCert(e.target.value.replace(/\D/g, "")); setCertError(""); }} placeholder="Enter PSA cert number" style={{ flex: 1, padding: "10px 12px", background: c.surface, border: `1px solid ${certError ? c.red : c.border}`, color: c.text1, fontSize: "13px", fontWeight: 600, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", borderRadius: "2px", letterSpacing: "1px" }}/>
                  <button onClick={handleCertLookup} disabled={certLoading || !addCert.trim()} style={{ padding: "10px 16px", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, borderRadius: "2px", opacity: certLoading || !addCert.trim() ? 0.4 : 1 }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1px", color: c.darkest }}>{certLoading ? "..." : "LOOKUP"}</span>
                  </button>
                </div>
                {certError && <p style={{ margin: "6px 0 0", fontSize: "9px", color: c.red }}>{certError}</p>}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px" }}>
                <div style={{ flex: 1, height: "1px", background: c.border }}/>
                <span style={{ fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 500 }}>OR SEARCH</span>
                <div style={{ flex: 1, height: "1px", background: c.border }}/>
              </div>

              {/* Card image preview + upload */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div onClick={() => addFileRef.current?.click()} style={{ width: "80px", height: "112px", flexShrink: 0, borderRadius: "4px", overflow: "hidden", border: `1px solid ${c.border}40`, cursor: "pointer", background: c.darkest, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {addImage ? (
                    <img src={addImage} alt="Card" style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke={c.text3} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <p style={{ margin: "4px 0 0", fontSize: "6px", letterSpacing: "1px", color: c.text3 }}>ADD PHOTO</p>
                    </div>
                  )}
                  {addImage && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2px", background: `${c.darkest}CC`, textAlign: "center" }}><span style={{ fontSize: "5px", letterSpacing: "1px", color: c.gold }}>CHANGE</span></div>}
                </div>
                <input ref={addFileRef} type="file" accept="image/*" onChange={handleAddImage} style={{ display: "none" }}/>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>SEARCH OR TYPE CARD NAME</p>
                  <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: c.surface, border: `1px solid ${showAddSuggestions && addSuggestions.length > 0 ? c.gold + "40" : c.border}`, borderRadius: "2px" }}>
                      <SearchIconSvg/>
                      <input value={addName} onChange={e => handleAddNameChange(e.target.value)} onKeyDown={e => { if (e.key === "Escape") setShowAddSuggestions(false); }} placeholder="e.g. Jahmyr Gibbs Prizm" style={{ flex: 1, background: "none", border: "none", outline: "none", color: c.text1, fontSize: "12px", fontFamily: "'Chakra Petch'", fontWeight: 500 }}/>
                      {addSugLoading && <div style={{ width: "12px", height: "12px", border: `2px solid ${c.border}`, borderTop: `2px solid ${c.gold}`, borderRadius: "50%", animation: "spin 0.6s linear infinite", flexShrink: 0 }}/>}
                    </div>
                    {showAddSuggestions && addSuggestions.length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", background: c.dark, border: `1px solid ${c.gold}25`, zIndex: 9999, maxHeight: "200px", overflowY: "auto", boxShadow: `0 8px 32px rgba(0,0,0,0.8)`, borderRadius: "4px" }}>
                        {addSuggestions.map((item, i) => (
                          <div key={i} onClick={() => selectAddSuggestion(item)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", cursor: "pointer", borderBottom: i < addSuggestions.length - 1 ? `1px solid ${c.border}20` : "none" }} onMouseEnter={e => e.currentTarget.style.background = `${c.gold}08`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            {item.imageUrl && <div style={{ width: "28px", height: "28px", flexShrink: 0, borderRadius: "2px", overflow: "hidden" }}><img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>}
                            <p style={{ margin: 0, fontSize: "10px", fontWeight: 500, color: c.text1, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: c.goldLight, flexShrink: 0 }}>${item.price?.value?.toLocaleString() || ""}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" }}>CATEGORY</label>
                  <select value={addCategory} onChange={e => setAddCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "11px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", cursor: "pointer", appearance: "none", borderRadius: "2px" }}>
                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Grading */}
                <div>
                  <label style={{ display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" }}>GRADING</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <select value={addGradeCompany} onChange={e => { setAddGradeCompany(e.target.value); setAddGrade(""); }} style={{ width: "100%", padding: "10px 12px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "11px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", borderRadius: "2px", cursor: "pointer", appearance: "none" }}>
                      <option value="">Ungraded</option>
                      <option value="PSA">PSA</option>
                      <option value="BGS">BGS</option>
                      <option value="CGC">CGC</option>
                      <option value="SGC">SGC</option>
                    </select>
                    {addGradeCompany && (
                      <select value={addGrade} onChange={e => setAddGrade(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "11px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", borderRadius: "2px", cursor: "pointer", appearance: "none" }}>
                        <option value="">Select score</option>
                        {(addGradeCompany === "PSA" ? [
                          ["GEM MT 10","10"],["MINT 9","9"],["NM-MT 8","8"],["NM 7","7"],["EX-MT 6","6"],["EX 5","5"],["VG-EX 4","4"],["VG 3","3"],["GOOD 2","2"],["PR 1","1"]
                        ] : addGradeCompany === "BGS" ? [
                          ["PRISTINE 10","10"],["GEM MINT 9.5","9.5"],["MINT 9","9"],["NM-MT+ 8.5","8.5"],["NM-MT 8","8"],["NM+ 7.5","7.5"],["NM 7","7"],["EX/NM+ 6.5","6.5"],["EX/NM 6","6"]
                        ] : addGradeCompany === "CGC" ? [
                          ["PRISTINE 10","10"],["GEM MINT 9.5","9.5"],["MINT 9","9"],["NM/MT+ 8.5","8.5"],["NM/MT 8","8"],["NM+ 7.5","7.5"],["NM 7","7"],["EX/NM+ 6.5","6.5"],["EX/NM 6","6"]
                        ] : [
                          ["PRISTINE 10","10"],["GEM MINT 9.5","9.5"],["MINT 9","9"],["NM/MT+ 8.5","8.5"],["NM/MT 8","8"],["NM+ 7.5","7.5"],["NM 7","7"]
                        ]).map(([label, val]) => (
                          <option key={val} value={`${addGradeCompany} ${label}`}>{label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* Value */}
                <div>
                  <label style={{ display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" }}>ESTIMATED VALUE</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: c.text3, fontWeight: 600 }}>$</span>
                    <input value={addValue} onChange={e => setAddValue(e.target.value)} type="number" placeholder="0.00" style={{ width: "100%", padding: "10px 12px 10px 26px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "13px", fontWeight: 600, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", borderRadius: "2px" }}/>
                  </div>
                </div>
                {/* Notes */}
                <div>
                  <label style={{ display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" }}>NOTES (OPTIONAL)</label>
                  <input value={addNotes} onChange={e => setAddNotes(e.target.value)} placeholder="Set, variant, condition details..." style={{ width: "100%", padding: "10px 12px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "11px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", borderRadius: "2px" }}/>
                </div>
                {/* Submit */}
                <button onClick={handleAddCard} style={{ width: "100%", padding: "14px", border: "none", cursor: "pointer", marginTop: "4px", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))", opacity: !addName.trim() || !addValue ? 0.4 : 1 }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: c.darkest, fontFamily: "'Chakra Petch'" }}>ADD TO VAULT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRADE LOG SCREEN
   ═══════════════════════════════════════════ */

function TradeScreen({ sharedTrades, setSharedTrades }) {
  const transactions = sharedTrades;
  const setTransactions = setSharedTrades;
  const [typeFilter, setTypeFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formType,setFormType]=useState("buy"); const [formCard,setFormCard]=useState(""); const [formCategory,setFormCategory]=useState("Pokemon");
  const [formPrice,setFormPrice]=useState(""); const [formGrade,setFormGrade]=useState(""); const [formDate,setFormDate]=useState(new Date().toISOString().split("T")[0]);
  const [formCostBasis,setFormCostBasis]=useState("");

  const filtered = useMemo(() => {
    let tx = [...transactions];
    if (typeFilter!=="All") tx = tx.filter(t=>t.type===typeFilter.toLowerCase());
    if (catFilter!=="All") tx = tx.filter(t=>t.category===catFilter);
    tx.sort((a,b)=>new Date(b.date)-new Date(a.date));
    return tx;
  }, [transactions, typeFilter, catFilter]);

  const stats = useMemo(() => {
    const buys=transactions.filter(t=>t.type==="buy"); const sells=transactions.filter(t=>t.type==="sell");
    return { totalSpent: buys.reduce((s,t)=>s+t.price,0), totalRevenue: sells.reduce((s,t)=>s+t.price,0), totalProfit: sells.reduce((s,t)=>s+(t.price-(t.costBasis||0)),0), buyCount: buys.length, sellCount: sells.length };
  }, [transactions]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(tx => { const d=new Date(tx.date); const k=`${d.toLocaleString("en-US",{month:"long"})} ${d.getFullYear()}`; if(!g[k])g[k]=[]; g[k].push(tx); });
    return Object.entries(g);
  }, [filtered]);

  const resetForm = () => { setFormType("buy");setFormCard("");setFormCategory("Pokemon");setFormPrice("");setFormGrade("");setFormDate(new Date().toISOString().split("T")[0]);setFormCostBasis(""); };
  const handleSubmit = () => {
    if(!formCard||!formPrice) return;
    setTransactions(prev=>[{ id:Date.now(),type:formType,card:formCard,category:formCategory,price:parseFloat(formPrice),date:formDate,grade:formGrade||"Ungraded",...(formType==="sell"&&formCostBasis?{costBasis:parseFloat(formCostBasis)}:{}) },...prev]);
    resetForm(); setShowForm(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "12px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
  const labelStyle = { display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" };

  return (
    <div>
      <div className="slide-up d1" style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>ACTIVITY</p><p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1, letterSpacing: "0.5px" }}>TRADE LOG</p></div>
          <button onClick={()=>{resetForm();setShowForm(true);}} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px 8px 12px", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", boxShadow: `0 0 20px ${c.gold}20` }}>
            <PlusIcon/><span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: c.darkest }}>ADD</span>
          </button>
        </div>
      </div>

      {/* P&L */}
      <div className="slide-up d2" style={{ padding: "20px" }}>
        <div className="panel-clipped" style={{ padding: "22px 20px", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark} 60%, ${c.surface})`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: "14px", width: "1px", height: "30px", background: `linear-gradient(180deg, ${c.gold}60, transparent)` }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.green, boxShadow: `0 0 8px ${c.green}60`, animation: "pulse 2s infinite" }}/>
            <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>P&L SUMMARY</p>
          </div>
          <p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>REALIZED PROFIT</p>
          <span style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", color: stats.totalProfit>=0?c.green:c.red, textShadow: `0 0 30px ${stats.totalProfit>=0?c.green:c.red}15` }}>
            {stats.totalProfit>=0?"+":"-"}${Math.abs(stats.totalProfit).toLocaleString()}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: 0, marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${c.border}60` }}>
            {[{l:"TOTAL SPENT",v:`$${stats.totalSpent.toLocaleString()}`,s:`${stats.buyCount} buys`},null,{l:"TOTAL REVENUE",v:`$${stats.totalRevenue.toLocaleString()}`,s:`${stats.sellCount} sells`},null,{l:"TRANSACTIONS",v:transactions.length.toString(),s:"all time"}].map((s,i)=>
              s===null?<div key={i} style={{ background: `linear-gradient(180deg, ${c.border}80, transparent)` }}/>:
              <div key={i} style={{ textAlign: "center" }}><p style={{ margin: 0, fontSize: "7px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{s.l}</p><p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: 700, color: c.text1 }}>{s.v}</p><p style={{ margin: "2px 0 0", fontSize: "8px", color: c.text3, fontWeight: 500 }}>{s.s}</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="slide-up d3" style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          {["All","Buy","Sell"].map(t=>{
            const isA=typeFilter===t; const cc=t==="Buy"?c.green:t==="Sell"?c.magenta:c.gold;
            return <button key={t} className="chip" onClick={()=>setTypeFilter(t)} style={{ padding: "6px 14px", fontSize: "9px", fontWeight: 600, letterSpacing: "1.5px", background: isA?`${cc}12`:c.surface, color: isA?cc:c.text3, border: `1px solid ${isA?cc+"30":c.border}`, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>{t.toUpperCase()}</button>;
          })}
        </div>
        <div className="hide-sb" style={{ display: "flex", gap: "4px", overflowX: "auto" }}>
          {categories.map(cat=>{
            const isA=catFilter===cat; const cc=cat==="All"?c.cyan:catColors[cat];
            return <button key={cat} className="chip" onClick={()=>setCatFilter(cat)} style={{ padding: "4px 10px", fontSize: "8px", fontWeight: 600, letterSpacing: "1px", background: isA?`${cc}10`:"transparent", color: isA?cc:c.text3, border: `1px solid ${isA?cc+"30":c.border+"60"}`, borderRadius: "1px", whiteSpace: "nowrap" }}>{cat.toUpperCase()}</button>;
          })}
        </div>
      </div>

      <div style={{ padding: "12px 20px 0" }}><div style={{ height: "1px", background: `linear-gradient(90deg, ${c.gold}30, ${c.border}40, transparent)` }}/></div>

      {/* Grouped List */}
      <div className="slide-up d4" style={{ padding: "8px 20px" }}>
        {grouped.map(([ml,txs])=>(
          <div key={ml} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 0 6px" }}>
              <p style={{ margin: 0, fontSize: "9px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{ml.toUpperCase()}</p>
              <div style={{ flex: 1, height: "1px", background: `${c.border}40` }}/><span style={{ fontSize: "9px", color: c.text3, fontWeight: 500 }}>{txs.length}</span>
            </div>
            {txs.map((tx,i)=>{
              const isBuy=tx.type==="buy"; const cc=catColors[tx.category]||c.text3; const isExp=expandedId===tx.id;
              const profit=tx.type==="sell"&&tx.costBasis!=null?tx.price-tx.costBasis:null;
              return (
                <div key={tx.id}>
                  <div className="tx-row" onClick={()=>setExpandedId(isExp?null:tx.id)} style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: !isExp&&i<txs.length-1?`1px solid ${c.border}20`:"none", cursor: "pointer", borderRadius: "2px", padding: "14px 8px", margin: "0 -8px" }}>
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: isBuy?`${c.green}06`:`${c.magenta}06`, border: `1px solid ${isBuy?c.green:c.magenta}15`, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))", flexShrink: 0 }}>{isBuy?<BuyIcon/>:<SellIcon/>}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.card}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                        <span style={{ fontSize: "7px", fontWeight: 700, letterSpacing: "1px", padding: "1px 5px", color: cc, background: `${cc}10`, border: `1px solid ${cc}18` }}>{tx.category.toUpperCase()}</span>
                        <span style={{ fontSize: "9px", color: c.text3, fontWeight: 500 }}>{tx.grade}</span><span style={{ fontSize: "9px", color: c.text3 }}>{"\u00B7"}</span><span style={{ fontSize: "9px", color: c.text3 }}>{formatDate(tx.date)}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: isBuy?c.text1:c.green }}>{isBuy?"-":"+"}${tx.price.toLocaleString()}</p>
                      {profit!=null&&<p style={{ margin: "1px 0 0", fontSize: "9px", fontWeight: 600, color: profit>=0?c.green:c.red }}>{profit>=0?"+":""}{profit.toLocaleString()} profit</p>}
                      {profit==null&&<p style={{ margin: "1px 0 0", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", color: isBuy?`${c.green}80`:`${c.magenta}80`, textTransform: "uppercase" }}>{tx.type}</p>}
                    </div>
                  </div>
                  {isExp&&(
                    <div style={{ margin: "0 -8px 8px", padding: "14px 16px", background: c.surface, border: `1px solid ${c.border}30`, animation: "fadeIn 0.15s ease", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {[{l:"DATE",v:formatDateLong(tx.date)},{l:"GRADE",v:tx.grade},{l:"PRICE",v:`$${tx.price.toLocaleString()}`},...(tx.costBasis!=null?[{l:"COST BASIS",v:`$${tx.costBasis.toLocaleString()}`}]:[])].map((d,i)=>(
                          <div key={i}><p style={{ margin: 0, fontSize: "7px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{d.l}</p><p style={{ margin: "3px 0 0", fontSize: "12px", fontWeight: 600, color: c.text1 }}>{d.v}</p></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length===0&&(
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: c.text3, fontWeight: 500 }}>No transactions match your filters</p>
            <button onClick={()=>{setTypeFilter("All");setCatFilter("All");}} style={{ marginTop: "10px", padding: "8px 20px", border: `1px solid ${c.cyan}40`, background: `${c.cyan}08`, color: c.cyan, fontSize: "10px", fontWeight: 600, letterSpacing: "1px", cursor: "pointer", fontFamily: "'Chakra Petch'", borderRadius: "1px" }}>RESET FILTERS</button>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm&&(
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={()=>setShowForm(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", background: `linear-gradient(180deg, ${c.surfaceAlt}, ${c.dark})`, borderTop: `1px solid ${c.borderLight}40`, animation: "modalIn 0.3s ease forwards", clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "12px", right: "12px", height: "1px", background: `linear-gradient(90deg, transparent, ${c.gold}50, transparent)` }}/>
            <div style={{ padding: "24px 24px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div><p style={{ margin: 0, fontSize: "9px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>NEW ENTRY</p><p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1 }}>ADD TRANSACTION</p></div>
                <button onClick={()=>setShowForm(false)} style={{ background: `${c.darkest}80`, border: `1px solid ${c.border}`, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}><CloseIcon/></button>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {["buy","sell"].map(t=>{
                  const isA=formType===t; const col=t==="buy"?c.green:c.magenta;
                  return <button key={t} onClick={()=>setFormType(t)} style={{ flex: 1, padding: "12px", border: `1px solid ${isA?col+"40":c.border}`, background: isA?`${col}10`:c.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                    {t==="buy"?<BuyIcon/>:<SellIcon/>}<span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: isA?col:c.text3, fontFamily: "'Chakra Petch'" }}>{t.toUpperCase()}</span>
                  </button>;
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div><label style={labelStyle}>CARD NAME</label><input value={formCard} onChange={e=>setFormCard(e.target.value)} placeholder="e.g. Charizard 1st Edition" style={{...inputStyle,fontSize:"13px"}}/></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div><label style={labelStyle}>CATEGORY</label><div style={{ position: "relative" }}><select value={formCategory} onChange={e=>setFormCategory(e.target.value)} style={{...inputStyle,cursor:"pointer"}}>{["Pokemon","Sports","MTG","Yu-Gi-Oh"].map(cat=><option key={cat} value={cat}>{cat}</option>)}</select><div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><ChevronDown/></div></div></div>
                  <div><label style={labelStyle}>GRADE</label><input value={formGrade} onChange={e=>setFormGrade(e.target.value)} placeholder="e.g. PSA 9" style={inputStyle}/></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div><label style={labelStyle}>{formType==="buy"?"PURCHASE PRICE":"SALE PRICE"}</label><div style={{ position: "relative" }}><span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: c.text3, fontWeight: 600 }}>$</span><input value={formPrice} onChange={e=>setFormPrice(e.target.value)} type="number" placeholder="0.00" style={{...inputStyle,paddingLeft:"28px",fontSize:"13px",fontWeight:600}}/></div></div>
                  <div><label style={labelStyle}>DATE</label><input value={formDate} onChange={e=>setFormDate(e.target.value)} type="date" style={{...inputStyle,colorScheme:"dark"}}/></div>
                </div>
                {formType==="sell"&&(<div><label style={labelStyle}>COST BASIS (OPTIONAL)</label><div style={{ position: "relative" }}><span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: c.text3, fontWeight: 600 }}>$</span><input value={formCostBasis} onChange={e=>setFormCostBasis(e.target.value)} type="number" placeholder="Original purchase price" style={{...inputStyle,paddingLeft:"28px"}}/></div></div>)}
                <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", border: "none", cursor: "pointer", marginTop: "6px", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))", boxShadow: `0 0 24px ${c.gold}20`, opacity: !formCard||!formPrice?0.4:1 }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: c.darkest, fontFamily: "'Chakra Petch'" }}>LOG {formType.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE SCREEN
   ═══════════════════════════════════════════ */

function ProfileScreen({ vaultData, tradeData }) {
  const [settings, setSettings, settingsLoaded] = usePersistedState("collectibulls:settings", {
    notifications: true, priceAlerts: true, darkMode: true
  });
  const [profile, setProfile, profileLoaded] = usePersistedState("collectibulls:profile", {
    username: "Collector", bio: "", since: new Date().getFullYear().toString(), pfp: null
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editPfp, setEditPfp] = useState(profile.pfp);
  const [usernameError, setUsernameError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const RESERVED_NAMES = ["admin","collectibulls","system","moderator","support","help","null","undefined","test","root"];

  const validateUsername = (name) => {
    const safe = name.replace(/[<>"'&]/g, "").trim();
    if (!safe) return "Username is required";
    if (safe.length < 3) return "Username must be at least 3 characters";
    if (safe.length > 30) return "Username must be 30 characters or less";
    if (!/^[a-zA-Z0-9_.\- ]+$/.test(safe)) return "Only letters, numbers, underscores, hyphens, and dots";
    if (RESERVED_NAMES.includes(safe.toLowerCase())) return "That username is reserved";
    return "";
  };

  const handlePfpUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setEditPfp(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const notifications = settings.notifications;
  const priceAlerts = settings.priceAlerts;
  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const unlockedCount = achievementData.filter(a=>a.unlocked).length;
  const portfolioValue = vaultData.reduce((s, cd) => s + cd.value, 0);
  const totalTrades = tradeData.length;
  const totalProfit = tradeData.filter(t=>t.type==="sell").reduce((s,t)=>s+(t.price-(t.costBasis||0)),0);
  const categoryCount = new Set(vaultData.map(cd=>cd.category)).size;

  const handleSaveProfile = () => {
    const safeName = editUsername.replace(/[<>"'&]/g, "").trim().slice(0, 30);
    const safeBio = editBio.replace(/[<>"'&]/g, "").trim().slice(0, 200);
    const err = validateUsername(safeName);
    if (err) { setUsernameError(err); return; }
    setUsernameError("");
    setProfile(prev => ({ ...prev, username: safeName, bio: safeBio, pfp: editPfp }));
    setShowEditProfile(false);
  };

  const handleResetData = () => {
    if (typeof window !== "undefined") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("collectibulls:")) keys.push(key);
      }
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = { vault: vaultData, trades: tradeData, profile, settings, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `collectibulls-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "13px", fontWeight: 500, outline: "none", boxSizing: "border-box", fontFamily: "'Chakra Petch'", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
  const labelStyle = { display: "block", fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600, marginBottom: "6px" };

  return (
    <div>
      <div className="slide-up d1" style={{ padding: "20px 20px 0" }}>
        <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>ACCOUNT</p>
        <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1, letterSpacing: "0.5px" }}>PROFILE</p>
      </div>

      {/* Profile Card */}
      <div className="slide-up d2" style={{ padding: "20px" }}>
        <div className="panel-clipped" style={{ padding: "28px 24px", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark} 60%, ${c.surface})`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: "14px", width: "1px", height: "30px", background: `linear-gradient(180deg, ${c.gold}60, transparent)` }}/>
          <div style={{ position: "absolute", top: "14px", right: 0, width: "30px", height: "1px", background: `linear-gradient(270deg, ${c.gold}60, transparent)` }}/>
          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            <div style={{ width: "72px", height: "72px", flexShrink: 0, clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))", background: `linear-gradient(135deg, ${c.gold}25, ${c.surface})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              {profile.pfp ? (
                <img src={profile.pfp} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="4.5" stroke={c.gold} strokeWidth="1.8" fill={`${c.gold}15`}/><path d="M4 21C4 17.5 7.5 14.5 12 14.5C16.5 14.5 20 17.5 20 21" stroke={c.gold} strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
              )}
              <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "10px", height: "10px", borderRadius: "50%", background: c.green, border: `2px solid ${c.dark}`, boxShadow: `0 0 6px ${c.green}80` }}/>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, fontFamily: "'Anybody'", color: c.text1 }}>{profile.username}</p>
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: c.text2, fontWeight: 400 }}>Collecting since {profile.since}</p>
              <p style={{ margin: "6px 0 0", fontSize: "10px", color: c.text3, lineHeight: 1.5, fontWeight: 400 }}>{profile.bio}</p>
            </div>
          </div>
          <button onClick={() => { setEditUsername(profile.username); setEditBio(profile.bio); setEditPfp(profile.pfp); setUsernameError(""); setShowEditProfile(true); }} style={{ marginTop: "18px", width: "100%", padding: "10px", border: `1px solid ${c.cyan}35`, background: `${c.cyan}06`, cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z" stroke={c.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: c.cyan, fontFamily: "'Chakra Petch'" }}>EDIT PROFILE</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="slide-up d3" style={{ padding: "0 20px 20px" }}>
        <div className="panel" style={{ padding: "20px", background: `linear-gradient(180deg, ${c.surface}, ${c.dark})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}><div style={{ width: "3px", height: "16px", background: c.gold, borderRadius: "2px", boxShadow: `0 0 8px ${c.gold}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>STATS</p></div>
          {[[{l:"TOTAL CARDS",v:vaultData.length.toString(),a:c.text1},{l:"PORTFOLIO",v:`$${portfolioValue>=1000?(portfolioValue/1000).toFixed(1)+"K":portfolioValue.toLocaleString()}`,a:c.goldLight},{l:"CATEGORIES",v:categoryCount.toString(),a:c.cyan}],[{l:"TRADES",v:totalTrades.toString(),a:c.text1},{l:"PROFIT",v:`${totalProfit>=0?"+":""}$${Math.abs(totalProfit)>=1000?(Math.abs(totalProfit)/1000).toFixed(1)+"K":Math.abs(totalProfit).toLocaleString()}`,a:totalProfit>=0?c.green:c.red},{l:"MEMBER",v:`SINCE ${profile.since}`,a:c.text2}]].map((row,ri)=>(
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: `${c.border}30`, marginTop: ri?"1px":0 }}>
              {row.map((s,i)=>(<div key={i} style={{ padding: "16px 12px", background: c.surface, textAlign: "center" }}><p style={{ margin: 0, fontSize: "7px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{s.l}</p><p style={{ margin: "6px 0 0", fontSize: "22px", fontWeight: 700, color: s.a }}>{s.v}</p></div>))}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="slide-up d4" style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "3px", height: "16px", background: c.magenta, borderRadius: "2px", boxShadow: `0 0 8px ${c.magenta}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>ACHIEVEMENTS</p></div>
          <span style={{ fontSize: "10px", color: c.goldLight, fontWeight: 600 }}>{unlockedCount}/{achievementData.length}</span>
        </div>
        <div style={{ height: "3px", background: c.border, marginBottom: "14px", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(unlockedCount/achievementData.length)*100}%`, background: `linear-gradient(90deg, ${c.gold}, ${c.goldLight})`, boxShadow: `0 0 8px ${c.gold}40`, borderRadius: "2px" }}/>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {achievementData.map(b=>(
            <div key={b.id} className="badge-tile" style={{ padding: "16px 14px", background: b.unlocked?`linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark})`:c.surface, clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", position: "relative", overflow: "hidden", opacity: b.unlocked?1:0.5, cursor: "pointer", transition: "transform 0.2s ease" }}>
              {b.unlocked&&<div style={{ position: "absolute", top: 0, left: 0, right: "8px", height: "1px", background: `linear-gradient(90deg, ${c.gold}50, transparent)` }}/>}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: b.unlocked?`${c.gold}08`:`${c.border}30`, border: `1px solid ${b.unlocked?c.gold+"20":c.border}`, borderRadius: "2px" }}><AchievementIcon icon={b.icon} unlocked={b.unlocked}/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", color: b.unlocked?c.goldLight:c.text3 }}>{b.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "9px", color: c.text3, fontWeight: 400, lineHeight: 1.3 }}>{b.desc}</p>
                  {b.unlocked&&b.date&&<p style={{ margin: "4px 0 0", fontSize: "8px", color: c.text3, fontWeight: 500 }}>{b.date}</p>}
                  {!b.unlocked&&<div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}><svg width="8" height="8" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="1.5" stroke={c.text3} strokeWidth="1.5" fill="none"/><path d="M5.5 7V5C5.5 3.1 6.6 2 8 2C9.4 2 10.5 3.1 10.5 5V7" stroke={c.text3} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg><span style={{ fontSize: "8px", color: c.text3, fontWeight: 500 }}>LOCKED</span></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="slide-up d5" style={{ padding: "0 20px 20px" }}>
        <div className="panel" style={{ padding: "20px", background: `linear-gradient(180deg, ${c.surface}, ${c.dark})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}><div style={{ width: "3px", height: "16px", background: c.cyan, borderRadius: "2px", boxShadow: `0 0 8px ${c.cyan}40` }}/><p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>SETTINGS</p></div>
          {[{l:"Push Notifications",d:"Trade alerts and updates",v:notifications,t:()=>toggleSetting("notifications"),icon:<path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke={c.text2} strokeWidth="1.8" fill="none" strokeLinecap="round"/>},
            {l:"Price Alerts",d:"Notify when cards hit targets",v:priceAlerts,t:()=>toggleSetting("priceAlerts"),icon:<path d="M12 2L14.4 8.2L21 9L16 13.5L17.5 20L12 16.8L6.5 20L8 13.5L3 9L9.6 8.2L12 2Z" stroke={c.text2} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>}
          ].map((s,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: `1px solid ${c.border}25`, cursor: "pointer" }}>
              <div style={{ width: "34px", height: "34px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.border}20`, borderRadius: "2px" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none">{s.icon}</svg></div>
              <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1 }}>{s.l}</p><p style={{ margin: "1px 0 0", fontSize: "10px", color: c.text3, fontWeight: 400 }}>{s.d}</p></div>
              <ToggleSwitch on={s.v} onToggle={s.t}/>
            </div>
          ))}
          {/* Export Data */}
          <div onClick={handleExportData} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: `1px solid ${c.border}25`, cursor: "pointer" }}>
            <div style={{ width: "34px", height: "34px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.border}20`, borderRadius: "2px" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c.text2} strokeWidth="1.8" fill="none"/><path d="M14 2v6h6" stroke={c.text2} strokeWidth="1.8" fill="none"/></svg></div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1 }}>Export Data</p><p style={{ margin: "1px 0 0", fontSize: "10px", color: c.text3, fontWeight: 400 }}>Download JSON backup</p></div>
            <SettingsChevron/>
          </div>
          {/* Reset Data */}
          <div onClick={() => setShowResetConfirm(true)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: `1px solid ${c.border}25`, cursor: "pointer" }}>
            <div style={{ width: "34px", height: "34px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.border}20`, borderRadius: "2px" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke={c.red} strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg></div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.red }}>Reset All Data</p><p style={{ margin: "1px 0 0", fontSize: "10px", color: c.text3, fontWeight: 400 }}>Clear vault, trades, and settings</p></div>
            <SettingsChevron/>
          </div>
          {/* Help */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", cursor: "pointer" }}>
            <div style={{ width: "34px", height: "34px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.border}20`, borderRadius: "2px" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c.text2} strokeWidth="1.8" fill="none"/><path d="M9 9a3 3 0 015.1 1.7C14.1 12 12 12 12 14" stroke={c.text2} strokeWidth="1.8" fill="none" strokeLinecap="round"/><circle cx="12" cy="17" r="0.5" fill={c.text2}/></svg></div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1 }}>Help & Support</p><p style={{ margin: "1px 0 0", fontSize: "10px", color: c.text3, fontWeight: 400 }}>FAQ and contact</p></div>
            <SettingsChevron/>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 20px 20px" }}><p style={{ margin: 0, fontSize: "9px", letterSpacing: "2px", color: c.text3 }}>COLLECTIBULLS v1.0.0</p></div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setShowEditProfile(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", background: `linear-gradient(180deg, ${c.surfaceAlt}, ${c.dark})`, borderTop: `1px solid ${c.borderLight}40`, animation: "modalIn 0.3s ease forwards", clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "12px", right: "12px", height: "1px", background: `linear-gradient(90deg, transparent, ${c.gold}50, transparent)` }}/>
            <div style={{ padding: "24px 24px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div><p style={{ margin: 0, fontSize: "9px", letterSpacing: "3px", color: c.text3 }}>ACCOUNT</p><p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1 }}>EDIT PROFILE</p></div>
                <button onClick={() => setShowEditProfile(false)} style={{ background: `${c.darkest}80`, border: `1px solid ${c.border}`, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}><CloseIcon/></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* PFP Upload */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div onClick={() => fileInputRef.current?.click()} style={{ width: "72px", height: "72px", flexShrink: 0, clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))", background: `linear-gradient(135deg, ${c.gold}25, ${c.surface})`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden", border: `1px solid ${c.gold}30` }}>
                    {editPfp ? (
                      <img src={editPfp} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke={c.gold} strokeWidth="2" strokeLinecap="round"/></svg>
                    )}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px", background: `${c.darkest}CC`, textAlign: "center" }}>
                      <span style={{ fontSize: "6px", letterSpacing: "1px", color: c.gold, fontWeight: 600 }}>{editPfp ? "CHANGE" : "UPLOAD"}</span>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePfpUpload} style={{ display: "none" }}/>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "11px", color: c.text2, fontWeight: 500 }}>Profile Photo</p>
                    <p style={{ margin: "3px 0 0", fontSize: "9px", color: c.text3 }}>JPG or PNG, max 2MB. Will be cropped to square.</p>
                    {editPfp && <button onClick={() => setEditPfp(null)} style={{ marginTop: "6px", padding: "3px 10px", background: "none", border: `1px solid ${c.red}30`, color: c.red, fontSize: "8px", fontWeight: 600, letterSpacing: "1px", cursor: "pointer", fontFamily: "'Chakra Petch'" }}>REMOVE</button>}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>USERNAME</label>
                  <input value={editUsername} onChange={e => { setEditUsername(e.target.value); setUsernameError(""); }} maxLength={30} style={{ ...inputStyle, border: usernameError ? `1px solid ${c.red}` : `1px solid ${c.border}` }}/>
                  {usernameError && <p style={{ margin: "4px 0 0", fontSize: "9px", color: c.red, fontWeight: 500 }}>{usernameError}</p>}
                </div>
                <div><label style={labelStyle}>BIO</label><textarea value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={200} rows={3} style={{ ...inputStyle, resize: "none", minHeight: "72px" }}/><p style={{ margin: "4px 0 0", fontSize: "8px", color: c.text3, textAlign: "right" }}>{editBio.length}/200</p></div>
                <button onClick={handleSaveProfile} style={{ width: "100%", padding: "14px", border: "none", cursor: "pointer", marginTop: "6px", background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: c.darkest, fontFamily: "'Chakra Petch'" }}>SAVE PROFILE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setShowResetConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "360px", width: "90%", background: `linear-gradient(180deg, ${c.surfaceAlt}, ${c.dark})`, border: `1px solid ${c.border}`, padding: "28px 24px", textAlign: "center", clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 16px", display: "block" }}><path d="M10.3 3.2L3.2 18.4C2.8 19.3 3.5 20 4.4 20H19.6C20.5 20 21.2 19.3 20.8 18.4L13.7 3.2C13.3 2.3 12.7 2 12 2C11.3 2 10.7 2.3 10.3 3.2Z" stroke={c.red} strokeWidth="1.8" fill="none"/><path d="M12 9V13" stroke={c.red} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill={c.red}/></svg>
            <p style={{ fontSize: "16px", fontWeight: 700, color: c.text1, marginBottom: "8px" }}>Reset all data?</p>
            <p style={{ fontSize: "12px", color: c.text3, lineHeight: 1.6, marginBottom: "24px" }}>This will permanently delete your vault, trade log, saved comps, profile, and all settings. This cannot be undone.</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: "12px", border: `1px solid ${c.border}`, background: c.surface, cursor: "pointer", color: c.text2, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", fontFamily: "'Chakra Petch'" }}>CANCEL</button>
              <button onClick={handleResetData} style={{ flex: 1, padding: "12px", border: `1px solid ${c.red}40`, background: `${c.red}12`, cursor: "pointer", color: c.red, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", fontFamily: "'Chakra Petch'" }}>RESET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPS TOOL
   ═══════════════════════════════════════════ */

const VERDICTS = [
  { key: "steal", label: "STEAL", sub: "CHARGE!", color: c.green, bg: `${c.green}12`, border: `${c.green}30`, desc: "This is significantly below market value. Don't hesitate." },
  { key: "good", label: "GOOD BUY", sub: "BULLISH", color: c.goldLight, bg: `${c.gold}12`, border: `${c.gold}30`, desc: "Solid price below market average. You're in good shape." },
  { key: "fair", label: "FAIR PRICE", sub: "HOLD STEADY", color: c.cyan, bg: `${c.cyan}08`, border: `${c.cyan}25`, desc: "Right around market value. Not a steal, not a ripoff." },
  { key: "over", label: "OVERPRICED", sub: "THINK TWICE", color: "#FF9500", bg: "rgba(255,149,0,0.08)", border: "rgba(255,149,0,0.25)", desc: "Above market value. You might find it cheaper elsewhere." },
  { key: "walk", label: "WALK AWAY", sub: "NO BULL", color: c.red, bg: `${c.red}10`, border: `${c.red}25`, desc: "Way above market. Save your money for a better deal." },
];

function getVerdict(askingPrice, marketAvg) {
  if (!askingPrice || !marketAvg || marketAvg === 0) return null;
  const diff = ((askingPrice - marketAvg) / marketAvg) * 100;
  if (diff <= -30) return VERDICTS[0]; // steal
  if (diff <= -10) return VERDICTS[1]; // good buy
  if (diff <= 10) return VERDICTS[2]; // fair
  if (diff <= 25) return VERDICTS[3]; // overpriced
  return VERDICTS[4]; // walk away
}

const VerdictIcon = ({ verdict, size = 48 }) => {
  const col = verdict?.color || c.text3;
  const icons = {
    steal: <><path d="M12 4C8 4 4 7 4 12C4 17 8 20 12 20C16 20 20 17 20 12" stroke={col} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M20 4L12 12" stroke={col} strokeWidth="2.5" strokeLinecap="round"/><path d="M15 4H20V9" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    good: <><path d="M12 3L14.5 8.5L20.5 9.2L16 13.5L17.2 19.5L12 16.5L6.8 19.5L8 13.5L3.5 9.2L9.5 8.5L12 3Z" stroke={col} strokeWidth="1.8" fill={`${col}20`} strokeLinejoin="round"/></>,
    fair: <><path d="M5 12H19" stroke={col} strokeWidth="2" strokeLinecap="round"/><path d="M12 5V19" stroke={col} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.8" fill="none"/></>,
    over: <><path d="M12 9V13" stroke={col} strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="17" r="1.5" fill={col}/><path d="M10.3 3.2L3.2 18.4C2.8 19.3 3.5 20 4.4 20H19.6C20.5 20 21.2 19.3 20.8 18.4L13.7 3.2C13.3 2.3 12.7 2 12 2C11.3 2 10.7 2.3 10.3 3.2Z" stroke={col} strokeWidth="1.8" fill="none" strokeLinejoin="round"/></>,
    walk: <><path d="M18 6L6 18M6 6L18 18" stroke={col} strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke={col} strokeWidth="1.8" fill="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{icons[verdict?.key] || null}</svg>;
};

function CompsScreen() {
  const [query, setQuery] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [condition, setCondition] = useState("ungraded");
  const [dealCheckMode, setDealCheckMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [savedComps, setSavedComps, savedLoaded] = usePersistedState("collectibulls:saved-comps", []);

  // Live search / autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced typeahead — fires after 400ms of no typing
  const handleQueryChange = (val) => {
    setQuery(val);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 3) { setSuggestions([]); setSugLoading(false); return; }
    setSugLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ebay?q=${encodeURIComponent(val.trim())}&limit=8&sort=relevance&category=all_cards`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSuggestions(data.items || []);
      } catch { setSuggestions([]); }
      finally { setSugLoading(false); }
    }, 400);
  };

  // Selected card image for display
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  // Simplify a listing title for searching — strip noise but keep key identifiers
  const simplifyTitle = (title) => {
    return title
      .replace(/[#️🔥⭐💎✨🏆]/g, "") // remove emojis
      .replace(/#\w+/g, " ") // remove hashtag-style card numbers
      .replace(/\b(free shipping|ships free|fast shipping|look|wow|hot|rare find|must see|invest)\b/gi, " ")
      .replace(/\b(lot of|complete your set|you pick|u pick|pick your)\b/gi, " ")
      .replace(/[!()[\]{}]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 10) // keep first 10 meaningful words
      .join(" ");
  };

  // Select a suggestion — store its image, search for comps with simplified query
  const selectSuggestion = (item) => {
    setQuery(item.title);
    setSelectedImage(item.imageUrl);
    setSelectedTitle(item.title);
    setShowSuggestions(false);
    setSuggestions([]);
    // Simplify the title for comp search — keep key identifying words
    const simplified = simplifyTitle(item.title);
    runFullSearch(simplified, true);
  };

  const runFullSearch = async (searchText, noAppend) => {
    const q = searchText || query;
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setShowSuggestions(false);
    if (!searchText) { setSelectedImage(null); setSelectedTitle(""); }
    try {
      const searchQuery = `${q.trim()} ${condition !== "ungraded" ? condition : ""}`.trim();
      const appendParam = noAppend ? "&noAppend=1" : "";
      // Use relevance sort for better matching, not price
      const res = await fetch(`/api/ebay?q=${encodeURIComponent(searchQuery)}&limit=30&sort=relevance&category=all_cards${appendParam}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Search failed");

      const allPrices = data.items.map(i => i.price?.value).filter(p => p > 0);
      const gradedItems = data.items.filter(i => /psa|bgs|cgc|gem|mint/i.test(i.title));
      const ungradedItems = data.items.filter(i => !/psa|bgs|cgc|gem|mint/i.test(i.title));
      const gradedPrices = gradedItems.map(i => i.price?.value).filter(p => p > 0);
      const ungradedPrices = ungradedItems.map(i => i.price?.value).filter(p => p > 0);

      const calcStats = (prices) => {
        if (!prices.length) return { avg: 0, min: 0, max: 0, median: 0, count: 0 };
        const sorted = [...prices].sort((a,b) => a - b);
        return {
          avg: Math.round(sorted.reduce((s,p) => s+p, 0) / sorted.length),
          min: sorted[0],
          max: sorted[sorted.length - 1],
          median: sorted[Math.floor(sorted.length / 2)],
          count: sorted.length,
        };
      };

      setResults({
        query: data.query,
        total: data.total,
        items: data.items.slice(0, 8),
        allStats: calcStats(allPrices),
        gradedStats: calcStats(gradedPrices),
        ungradedStats: calcStats(ungradedPrices),
      });
    } catch (e) {
      setError(e.message || "Failed to fetch comps. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => runFullSearch();

  const verdict = dealCheckMode && results && askingPrice
    ? getVerdict(parseFloat(askingPrice), condition === "ungraded" ? results.ungradedStats.avg || results.allStats.avg : results.gradedStats.avg || results.allStats.avg)
    : null;

  const saveComp = () => {
    if (!results) return;
    const comp = { id: Date.now(), query, askingPrice: askingPrice ? parseFloat(askingPrice) : null, condition, verdict: verdict?.key || null, marketAvg: results.allStats.avg, date: new Date().toISOString() };
    setSavedComps(prev => [comp, ...prev].slice(0, 50));
  };

  const relevantStats = condition === "ungraded" && results?.ungradedStats?.count > 0
    ? results.ungradedStats
    : condition !== "ungraded" && results?.gradedStats?.count > 0
    ? results.gradedStats
    : results?.allStats;

  return (
    <div>
      {/* Header */}
      <div className="slide-up d1" style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>MARKET INTELLIGENCE</p>
            <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, fontFamily: "'Anybody'", color: c.text1, letterSpacing: "0.5px" }}>COMPS</p>
          </div>
          {savedComps.length > 0 && (
            <div style={{ padding: "4px 10px", background: `${c.gold}10`, border: `1px solid ${c.gold}20`, fontSize: "9px", fontWeight: 600, color: c.gold, letterSpacing: "1px" }}>
              {savedComps.length} SAVED
            </div>
          )}
        </div>
      </div>

      {/* Search + Deal Check */}
      <div className="slide-up d2" style={{ padding: "16px 20px 0", position: "relative", zIndex: 200 }}>
        {/* Search bar with autocomplete */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, position: "relative", zIndex: 201 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: c.surface, border: `1px solid ${showSuggestions && suggestions.length > 0 ? c.gold + "40" : c.border}`, borderRadius: "2px", transition: "border 0.2s ease" }}>
              <SearchIconSvg/>
              <input ref={searchInputRef} value={query} onChange={e => handleQueryChange(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { setShowSuggestions(false); handleSearch(); } if (e.key === "Escape") setShowSuggestions(false); }} onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }} placeholder="Search any card..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: c.text1, fontSize: "13px", fontFamily: "'Chakra Petch'", fontWeight: 500 }}/>
              {sugLoading && <div style={{ width: "14px", height: "14px", border: `2px solid ${c.border}`, borderTop: `2px solid ${c.gold}`, borderRadius: "50%", animation: "spin 0.6s linear infinite", flexShrink: 0 }}/>}
              {query && !sugLoading && <button onClick={() => { setQuery(""); setResults(null); setSuggestions([]); setShowSuggestions(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}><CloseIcon/></button>}
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", background: c.dark, border: `1px solid ${c.gold}25`, zIndex: 9999, maxHeight: "320px", overflowY: "auto", boxShadow: `0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px ${c.border}`, borderRadius: "4px" }}>
                <div style={{ padding: "8px 12px 4px" }}>
                  <p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>LIVE RESULTS</p>
                </div>
                {suggestions.map((item, i) => (
                  <div key={i} onClick={() => selectSuggestion(item)} style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                    cursor: "pointer", borderBottom: i < suggestions.length - 1 ? `1px solid ${c.border}20` : "none",
                    transition: "background 0.1s ease",
                  }} onMouseEnter={e => e.currentTarget.style.background = `${c.gold}08`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {item.imageUrl ? (
                      <div style={{ width: "36px", height: "36px", flexShrink: 0, borderRadius: "2px", overflow: "hidden", border: `1px solid ${c.border}30` }}>
                        <img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                      </div>
                    ) : (
                      <div style={{ width: "36px", height: "36px", flexShrink: 0, background: c.surface, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${c.border}30` }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" rx="2" stroke={c.text3} strokeWidth="1.5"/></svg>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: c.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "9px", color: c.text3 }}>{item.condition || "Unknown condition"}</p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: c.goldLight }}>${item.price?.value?.toLocaleString() || "—"}</p>
                      {item.shippingCost != null && item.shippingCost > 0 && <p style={{ margin: "1px 0 0", fontSize: "8px", color: c.text3 }}>+${item.shippingCost} ship</p>}
                    </div>
                  </div>
                ))}
                <div onClick={() => { setShowSuggestions(false); handleSearch(); }} style={{ padding: "10px 12px", cursor: "pointer", borderTop: `1px solid ${c.border}30`, textAlign: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: c.cyan }}>SEARCH ALL FOR "{query.toUpperCase()}"</span>
                </div>
              </div>
            )}
          </div>
          <button onClick={handleSearch} disabled={!query.trim() || loading} style={{
            padding: "12px 20px", border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            opacity: !query.trim() || loading ? 0.4 : 1, transition: "opacity 0.2s",
          }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: c.darkest, fontFamily: "'Chakra Petch'" }}>{loading ? "..." : "COMPS"}</span>
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Deal Check Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", padding: "12px 16px", background: dealCheckMode ? `${c.magenta}06` : c.surface, border: `1px solid ${dealCheckMode ? c.magenta + "25" : c.border}`, transition: "all 0.2s ease", borderRadius: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L15 8.5L22 9.3L17 14L18.2 21L12 17.5L5.8 21L7 14L2 9.3L9 8.5L12 2Z" stroke={dealCheckMode ? c.magenta : c.text3} strokeWidth="1.8" fill={dealCheckMode ? `${c.magenta}20` : "none"} strokeLinejoin="round"/></svg>
            <div>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: dealCheckMode ? c.text1 : c.text2 }}>Deal Check Mode</p>
              <p style={{ margin: "1px 0 0", fontSize: "9px", color: c.text3 }}>Enter asking price for a buy verdict</p>
            </div>
          </div>
          <ToggleSwitch on={dealCheckMode} onToggle={() => setDealCheckMode(!dealCheckMode)}/>
        </div>

        {/* Deal Check Inputs */}
        {dealCheckMode && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: c.text3, fontWeight: 600 }}>$</span>
              <input value={askingPrice} onChange={e => setAskingPrice(e.target.value)} type="number" placeholder="Asking price" style={{ width: "100%", padding: "12px 14px 12px 28px", background: c.surface, border: `1px solid ${c.border}`, color: c.text1, fontSize: "14px", fontWeight: 600, outline: "none", fontFamily: "'Chakra Petch'", boxSizing: "border-box", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}/>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {["ungraded", "PSA 9", "PSA 10"].map(cond => (
                <button key={cond} className="chip" onClick={() => setCondition(cond)} style={{
                  padding: "8px 12px", fontSize: "8px", fontWeight: 600, letterSpacing: "1px", whiteSpace: "nowrap",
                  background: condition === cond ? `${c.cyan}12` : c.surface,
                  color: condition === cond ? c.cyan : c.text3,
                  border: `1px solid ${condition === cond ? c.cyan + "30" : c.border}`,
                  borderRadius: "1px",
                }}>{cond.toUpperCase()}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ padding: "12px 16px", background: `${c.red}08`, border: `1px solid ${c.red}20`, borderRadius: "2px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: c.red, fontWeight: 500 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: `2px solid ${c.border}`, borderTop: `2px solid ${c.gold}`, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }}/>
          <p style={{ fontSize: "11px", color: c.text3, letterSpacing: "1px" }}>PULLING COMPS...</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div style={{ padding: "16px 20px" }}>

          {/* Hero Card Display */}
          {(selectedImage || results.items?.[0]?.imageUrl) && (
            <div className="slide-up d1" style={{ marginBottom: "16px" }}>
              <div className="panel" style={{ padding: "20px", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark})`, display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ width: "100px", height: "140px", flexShrink: 0, borderRadius: "4px", overflow: "hidden", border: `1px solid ${c.border}40`, boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
                  <img src={selectedImage || results.items[0]?.imageUrl} alt={selectedTitle || query} style={{ width: "100%", height: "100%", objectFit: "contain", background: c.darkest }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.gold, fontWeight: 600 }}>COMP RESULTS FOR</p>
                  <p style={{ margin: "6px 0 0", fontSize: "16px", fontWeight: 700, fontFamily: "'Anybody'", color: c.text1, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{selectedTitle || query}</p>
                  <p style={{ margin: "6px 0 0", fontSize: "11px", color: c.text3 }}>{results.total.toLocaleString()} listings found on eBay</p>
                </div>
              </div>
            </div>
          )}
          {/* Verdict Card (Deal Check Mode) */}
          {verdict && (
            <div className="slide-up d1" style={{ marginBottom: "16px" }}>
              <div className="panel-clipped" style={{ padding: "24px 20px", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark})`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: "14px", height: "2px", background: `linear-gradient(90deg, ${verdict.color}60, transparent)` }}/>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", background: verdict.bg, border: `1px solid ${verdict.border}`, borderRadius: "4px", flexShrink: 0 }}>
                    <VerdictIcon verdict={verdict} size={32}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'Anybody'", color: verdict.color, letterSpacing: "1px" }}>{verdict.label}</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", color: `${verdict.color}80` }}>{verdict.sub}</span>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: "11px", color: c.text2, lineHeight: 1.5 }}>{verdict.desc}</p>
                    <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                      <div><span style={{ fontSize: "8px", letterSpacing: "1.5px", color: c.text3, fontWeight: 600 }}>ASKING</span><p style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 700, color: c.text1 }}>${parseFloat(askingPrice).toLocaleString()}</p></div>
                      <div><span style={{ fontSize: "8px", letterSpacing: "1.5px", color: c.text3, fontWeight: 600 }}>MARKET AVG</span><p style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 700, color: c.goldLight }}>${relevantStats?.avg?.toLocaleString() || "—"}</p></div>
                      <div><span style={{ fontSize: "8px", letterSpacing: "1.5px", color: c.text3, fontWeight: 600 }}>DIFF</span><p style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 700, color: verdict.color }}>{relevantStats?.avg ? `${askingPrice < relevantStats.avg ? "-" : "+"}${Math.abs(Math.round(((parseFloat(askingPrice) - relevantStats.avg) / relevantStats.avg) * 100))}%` : "—"}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Summary */}
          <div className="slide-up d2">
            <div className="panel" style={{ padding: "20px", background: `linear-gradient(180deg, ${c.surface}, ${c.dark})`, marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "3px", height: "16px", background: c.cyan, borderRadius: "2px" }}/>
                  <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>ACTIVE LISTING PRICES</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.green, boxShadow: `0 0 6px ${c.green}60` }}/>
                  <span style={{ fontSize: "9px", color: c.text3 }}>LIVE</span>
                  <span style={{ fontSize: "9px", color: c.text3 }}>{"\u00B7"}</span>
                  <span style={{ fontSize: "9px", color: c.text3 }}>{results.total.toLocaleString()} listings</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr 1px 1fr", gap: 0 }}>
                {[{ l: "AVG", v: relevantStats?.avg },null,{ l: "MEDIAN", v: relevantStats?.median },null,{ l: "LOW", v: relevantStats?.min },null,{ l: "HIGH", v: relevantStats?.max }].map((s, i) =>
                  s === null ? <div key={i} style={{ background: `linear-gradient(180deg, ${c.border}60, transparent)` }}/> :
                  <div key={i} style={{ textAlign: "center", padding: "8px 4px" }}>
                    <p style={{ margin: 0, fontSize: "7px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{s.l}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700, color: i === 0 ? c.goldLight : c.text1 }}>${s.v?.toLocaleString() || "—"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Graded vs Ungraded Breakdown */}
          <div className="slide-up d3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {[
              { label: "GRADED", stats: results.gradedStats, accent: c.gold },
              { label: "UNGRADED", stats: results.ungradedStats, accent: c.cyan },
            ].map((tier, i) => (
              <div key={i} className="panel" style={{ padding: "16px", background: `linear-gradient(165deg, ${c.surfaceAlt}, ${c.dark})` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <div style={{ width: "3px", height: "12px", background: tier.accent, borderRadius: "2px" }}/>
                  <p style={{ margin: 0, fontSize: "8px", letterSpacing: "2px", color: c.text3, fontWeight: 600 }}>{tier.label}</p>
                  <span style={{ fontSize: "8px", color: c.text3, marginLeft: "auto" }}>{tier.stats.count} found</span>
                </div>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: tier.accent }}>${tier.stats.avg?.toLocaleString() || "—"}</p>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: c.text3 }}>avg price</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${c.border}30` }}>
                  <div><p style={{ margin: 0, fontSize: "7px", color: c.text3, letterSpacing: "1px" }}>LOW</p><p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 600, color: c.text1 }}>${tier.stats.min?.toLocaleString() || "—"}</p></div>
                  <div style={{ textAlign: "right" }}><p style={{ margin: 0, fontSize: "7px", color: c.text3, letterSpacing: "1px" }}>HIGH</p><p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 600, color: c.text1 }}>${tier.stats.max?.toLocaleString() || "—"}</p></div>
                </div>
              </div>
            ))}
          </div>

          {/* Sold Data Placeholder */}
          <div className="slide-up d4" style={{ marginBottom: "12px" }}>
            <div className="panel" style={{ padding: "20px", background: `linear-gradient(165deg, ${c.surface}, ${c.dark})`, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12 6.5 22 12 22Z" stroke={c.gold} strokeWidth="1.8" fill="none"/><path d="M12 6V12L16 14" stroke={c.gold} strokeWidth="1.8" strokeLinecap="round"/></svg>
                <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.gold, fontWeight: 600 }}>SOLD DATA</p>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: c.text3, lineHeight: 1.6 }}>
                Completed sale prices coming soon.
                <br/>
                <span style={{ fontSize: "10px", color: c.text3 }}>This will show actual prices paid in the last 90 days.</span>
              </p>
            </div>
          </div>

          {/* Active Listings */}
          <div className="slide-up d5">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "3px", height: "16px", background: c.magenta, borderRadius: "2px" }}/>
                <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>ACTIVE LISTINGS</p>
              </div>
              <button onClick={saveComp} style={{ padding: "4px 12px", background: `${c.gold}10`, border: `1px solid ${c.gold}25`, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", borderRadius: "2px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke={c.gold} strokeWidth="1.8" fill="none"/></svg>
                <span style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "1px", color: c.gold }}>SAVE COMP</span>
              </button>
            </div>
            <div className="hide-sb" style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {results.items.map((item, i) => (
                <a key={i} href={item.itemUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", minWidth: "180px", maxWidth: "180px", flexShrink: 0 }}>
                  <div className="mover-card" style={{ background: c.surface, borderRadius: "4px", overflow: "hidden", border: `1px solid ${c.border}30` }}>
                    {item.imageUrl ? (
                      <div style={{ width: "100%", height: "160px", background: c.darkest, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${c.border}30` }}>
                        <img src={item.imageUrl} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                      </div>
                    ) : (
                      <div style={{ width: "100%", height: "160px", background: c.darkest, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${c.border}30` }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}><rect x="3" y="2" width="18" height="20" rx="2" stroke={c.text3} strokeWidth="1.5"/></svg>
                      </div>
                    )}
                    <div style={{ padding: "12px" }}>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color: c.text1, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "28px" }}>{item.title}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "8px" }}>
                        <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: c.goldLight }}>${item.price?.value?.toLocaleString() || "—"}</p>
                        {item.shippingCost != null && item.shippingCost > 0 && <p style={{ margin: 0, fontSize: "8px", color: c.text3 }}>+${item.shippingCost} ship</p>}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "8px", color: c.text3, letterSpacing: "0.5px" }}>{item.condition || ""}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Saved Comps */}
          {savedComps.length > 0 && (
            <div className="slide-up d5" style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "3px", height: "16px", background: c.gold, borderRadius: "2px" }}/>
                <p style={{ margin: 0, fontSize: "10px", letterSpacing: "3px", color: c.text3, fontWeight: 600 }}>SAVED COMPS</p>
              </div>
              {savedComps.slice(0, 5).map((comp, i) => {
                const v = VERDICTS.find(vd => vd.key === comp.verdict);
                return (
                  <div key={comp.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < Math.min(savedComps.length, 5) - 1 ? `1px solid ${c.border}20` : "none" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: c.text1 }}>{comp.query}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "9px", color: c.text3 }}>{formatDate(comp.date)} {"\u00B7"} {comp.condition}</p>
                    </div>
                    {comp.askingPrice && <span style={{ fontSize: "12px", fontWeight: 600, color: c.text2 }}>${comp.askingPrice.toLocaleString()}</span>}
                    {v && <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1px", padding: "3px 8px", color: v.color, background: v.bg, border: `1px solid ${v.border}` }}>{v.label}</span>}
                    <span style={{ fontSize: "11px", fontWeight: 600, color: c.goldLight }}>${comp.marketAvg?.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.15, margin: "0 auto 20px", display: "block" }}>
            <path d="M3 3V21H21" stroke={c.text3} strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M7 14L11 8L15 12L20 5" stroke={c.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontSize: "15px", color: c.text2, fontWeight: 600 }}>Pull real-time comps</p>
          <p style={{ fontSize: "12px", color: c.text3, fontWeight: 400, marginTop: "6px", maxWidth: "280px", margin: "6px auto 0", lineHeight: 1.6 }}>
            Search any trading card to see current market pricing. Turn on Deal Check to get a buy verdict.
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

const tabList = [
  { id: "home", label: "Home" }, { id: "collection", label: "Vault" },
  { id: "trade", label: "Trade" }, { id: "comps", label: "Comps" }, { id: "profile", label: "Profile" },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

function DesktopSidebar({ activeTab, setActiveTab }) {
  return (
    <nav aria-label="Main navigation" style={{
      width: "220px", minHeight: "100vh", position: "fixed", left: 0, top: 0,
      background: `linear-gradient(180deg, ${c.dark}, ${c.darkest})`,
      borderRight: `1px solid ${c.border}40`,
      padding: "28px 0", display: "flex", flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 24px 28px", borderBottom: `1px solid ${c.border}30` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BullLogo size={36}/>
          <div>
            <div style={{ lineHeight: 1 }}>
              <span className="gold-shimmer" style={{ fontSize: "15px", fontWeight: 800, fontFamily: "'Anybody', sans-serif", letterSpacing: "0.5px" }}>COLLECTI</span>
              <span style={{ fontSize: "15px", fontWeight: 800, fontFamily: "'Anybody', sans-serif", letterSpacing: "0.5px", color: c.cyan }}>BULLS</span>
            </div>
            <p style={{ margin: 0, fontSize: "6px", letterSpacing: "4px", color: c.text3, fontWeight: 500, marginTop: "2px" }}>TRACK {"\u00B7"} TRADE {"\u00B7"} TRIUMPH</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {tabList.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={isActive} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", border: "none", cursor: "pointer",
              background: isActive ? `${c.gold}10` : "transparent",
              borderLeft: isActive ? `2px solid ${c.gold}` : "2px solid transparent",
              borderRadius: "0 4px 4px 0", transition: "all 0.15s ease",
              position: "relative",
            }}>
              {isActive && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${c.gold}08, transparent)`, borderRadius: "0 4px 4px 0", pointerEvents: "none" }}/>}
              <TabIcon id={tab.id} active={isActive}/>
              <span style={{
                fontSize: "11px", fontWeight: isActive ? 700 : 500, letterSpacing: "1.5px",
                color: isActive ? c.gold : c.text3, fontFamily: "'Chakra Petch', sans-serif",
                position: "relative",
              }}>{tab.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${c.border}30` }}>
        <p style={{ margin: 0, fontSize: "8px", letterSpacing: "1.5px", color: c.text3 }}>COLLECTIBULLS v1.0.0</p>
      </div>
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab, tabLoaded] = usePersistedState("collectibulls:active-tab", "home");
  const [sharedVault, setSharedVault, vaultLoaded] = usePersistedState("collectibulls:vault-cards", defaultVaultCards);
  const [sharedTrades, setSharedTrades, tradesLoaded] = usePersistedState("collectibulls:trade-log", defaultTradeTx);
  const isDesktop = useIsDesktop();

  const dataReady = vaultLoaded && tradesLoaded;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Anybody:wght@700;800;900&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .slide-up{animation:slideUp 0.4s ease-out forwards;opacity:0}
        .d1{animation-delay:0.05s}.d2{animation-delay:0.1s}.d3{animation-delay:0.15s}.d4{animation-delay:0.2s}.d5{animation-delay:0.25s}
        .gold-shimmer{background:linear-gradient(90deg,${c.goldDim},${c.goldLight},${c.gold},${c.goldLight},${c.goldDim});background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite}
        .panel{position:relative;border-radius:2px;overflow:hidden}
        .panel::before{content:'';position:absolute;inset:0;border-radius:2px;padding:1px;background:linear-gradient(160deg,${c.borderLight}80,${c.border}40,transparent,${c.border}20);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
        .panel-clipped{position:relative;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));overflow:hidden}
        .panel-clipped::before{content:'';position:absolute;inset:0;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));padding:1px;background:linear-gradient(160deg,${c.gold}40,${c.border}60,transparent);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:1}
        .card-tile{cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease;position:relative}
        .card-tile:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.4)}
        .card-tile::before{content:'';position:absolute;inset:0;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));padding:1px;background:linear-gradient(160deg,${c.borderLight}60,${c.border}30,transparent);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:1}
        .mover-card{position:relative;transition:transform 0.2s ease;cursor:pointer}.mover-card:hover{transform:translateY(-2px)}
        .tx-row:hover{background:${c.goldFaint}}
        .chip{cursor:pointer;transition:all 0.15s ease;border:none;font-family:'Chakra Petch',sans-serif}.chip:hover{opacity:0.85}
        .badge-tile:hover{transform:scale(1.04)}
        .hide-sb::-webkit-scrollbar{display:none}.hide-sb{-ms-overflow-style:none;scrollbar-width:none}
        input::placeholder,textarea::placeholder{color:${c.text3}}
        select{appearance:none;-webkit-appearance:none}

        /* Desktop grid helpers */
        @media (min-width: 768px) {
          .desktop-grid-2 { display: grid !important; grid-template-columns: 1fr 1fr; gap: 20px; }
          .desktop-grid-3 { display: grid !important; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
          .desktop-grid-4 { display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 12px; }
          .vault-grid-desktop { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: c.darkest, color: c.text1,
        fontFamily: "'Chakra Petch', sans-serif",
        display: "flex",
      }}>
        {/* Desktop Sidebar */}
        {isDesktop && <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: isDesktop ? "220px" : "auto",
          marginRight: isDesktop ? "0" : "auto",
          maxWidth: isDesktop ? "none" : "480px",
          position: "relative",
          paddingBottom: isDesktop ? "0" : "84px",
          minHeight: "100vh",
          overflow: isDesktop ? "auto" : undefined,
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "400px", height: "300px", background: `radial-gradient(ellipse, ${c.gold}06 0%, transparent 70%)`, pointerEvents: "none" }}/>

          {/* Desktop top bar */}
          {isDesktop && (
            <div style={{
              position: "sticky", top: 0, zIndex: 50,
              padding: "16px 32px",
              background: `${c.darkest}EE`, backdropFilter: "blur(16px)",
              borderBottom: `1px solid ${c.border}30`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "9px", letterSpacing: "3px", color: c.text3, fontWeight: 500 }}>
                  {tabList.find(t => t.id === activeTab)?.label.toUpperCase() || ""}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: c.surface, cursor: "pointer", borderRadius: "4px",
                  border: `1px solid ${c.border}40`,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke={c.text2} strokeWidth="1.8" strokeLinecap="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke={c.text2} strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <div style={{
                  width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${c.gold}15`, borderRadius: "4px", border: `1px solid ${c.gold}20`,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="4" stroke={c.gold} strokeWidth="1.8" fill="none"/><path d="M5 20C5 17 8 14.5 12 14.5C16 14.5 19 17 19 20" stroke={c.gold} strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div style={{ padding: isDesktop ? "24px 32px" : "0" }}>
            {activeTab === "home" && <HomeScreen vaultData={sharedVault} tradeData={sharedTrades} onNavigate={setActiveTab} />}
            {activeTab === "collection" && <VaultScreen sharedCards={sharedVault} setSharedCards={setSharedVault} />}
            {activeTab === "trade" && <TradeScreen sharedTrades={sharedTrades} setSharedTrades={setSharedTrades} />}
            {activeTab === "comps" && <CompsScreen />}
            {activeTab === "profile" && <ProfileScreen vaultData={sharedVault} tradeData={sharedTrades} />}
          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        {!isDesktop && (
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: "480px",
            background: `${c.darkest}EE`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            borderTop: `1px solid ${c.border}40`,
            padding: "6px 4px 22px", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100,
          }}>
            {tabList.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                  background: "none", border: "none", cursor: "pointer", padding: "6px 14px", position: "relative",
                }}>
                  {isActive && <div style={{ position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%)", width: "24px", height: "2px", background: c.gold, boxShadow: `0 0 10px ${c.gold}60` }}/>}
                  <TabIcon id={tab.id} active={isActive}/>
                  <span style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "1.5px", color: isActive ? c.gold : c.text3, textShadow: isActive ? `0 0 8px ${c.gold}30` : "none" }}>{tab.label.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
