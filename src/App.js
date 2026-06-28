import { useState, useCallback, useEffect, useRef } from "react";

const BACKEND = "https://agent-empire-backend-production.up.railway.app";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const N = {
  black:   "#000508",
  dark:    "#020c10",
  panel:   "#040f14",
  border:  "#0a2a1f",
  green:   "#00ff88",
  cyan:    "#00e5ff",
  yellow:  "#ffe500",
  red:     "#ff2d55",
  purple:  "#b000ff",
  dim:     "#0a4a30",
  dimC:    "#003a4a",
  text:    "#a0ffcc",
  textDim: "#1a4a35",
  mono:    "'Courier New', monospace",
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${N.black}; color: ${N.text}; font-family: 'Share Tech Mono', monospace; }
  ::-webkit-scrollbar { width: 4px; } 
  ::-webkit-scrollbar-track { background: ${N.dark}; }
  ::-webkit-scrollbar-thumb { background: ${N.green}; border-radius: 2px; }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes flicker {
    0%,100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 95% { opacity: 1; } 97% { opacity: 0.9; }
  }
  @keyframes pulse-green {
    0%,100% { box-shadow: 0 0 4px ${N.green}44, inset 0 0 4px ${N.green}11; }
    50% { box-shadow: 0 0 12px ${N.green}88, inset 0 0 8px ${N.green}22; }
  }
  @keyframes pulse-cyan {
    0%,100% { box-shadow: 0 0 4px ${N.cyan}44; }
    50% { box-shadow: 0 0 16px ${N.cyan}99; }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes typing {
    from { width: 0; } to { width: 100%; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
  @keyframes data-flow {
    0% { opacity: 0; transform: translateY(8px); }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-8px); }
  }
  @keyframes glow-pulse {
    0%,100% { text-shadow: 0 0 4px ${N.green}, 0 0 8px ${N.green}66; }
    50% { text-shadow: 0 0 8px ${N.green}, 0 0 20px ${N.green}99, 0 0 40px ${N.green}44; }
  }
  @keyframes border-flow {
    0% { border-color: ${N.green}44; }
    50% { border-color: ${N.cyan}88; }
    100% { border-color: ${N.green}44; }
  }
  @keyframes progress-fill {
    from { width: 0%; } to { width: 100%; }
  }
  .agent-active { animation: pulse-green 2s infinite; }
  .glow-text { animation: glow-pulse 3s infinite; }
  .flicker { animation: flicker 8s infinite; }
  .blink { animation: blink 1s infinite; }
  .spin { animation: spin-slow 4s linear infinite; }
  .slide-in { animation: slide-in 0.3s ease forwards; }
  .border-flow { animation: border-flow 3s infinite; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "tiktok", label: "TIKTOK", icon: "◈" },
  { id: "youtube", label: "YT SHORTS", icon: "▶" },
  { id: "instagram", label: "INSTAGRAM", icon: "◉" },
  { id: "twitter", label: "X / TWITTER", icon: "✕" },
];
const CONTENT_TYPES = [
  { id: "hook", label: "VIRAL HOOK" },
  { id: "script", label: "FULL SCRIPT" },
  { id: "caption", label: "CAPTION+TAGS" },
  { id: "series", label: "SERIES" },
];
const TONES = [
  { id: "hype", label: "HYPE" },
  { id: "educational", label: "EDUCATE" },
  { id: "controversial", label: "PROVOKE" },
  { id: "story", label: "STORY" },
];
const TOPICS = [
  "AI Tools That Make You Money While You Sleep",
  "I Fired Myself — Revenue Went UP",
  "47 Posts a Week, Zero Manual Work",
  "Faceless AI Content Business",
  "UGC Freelancing with AI ($200/video)",
  "AI Affiliate Marketing Blueprint",
  "No-Code Automation Side Hustle",
  "AI Video Creation Business 2026",
];
const RESEARCH_CATS = [
  { id: "trending", label: "TRENDING NOW" },
  { id: "hooks", label: "HOOK FORMULAS" },
  { id: "competitors", label: "COMPETITOR INTEL" },
  { id: "monetization", label: "MONETIZATION" },
];
const SECOND_STYLES = [
  { id: "beginner", label: "BEGINNER MODE" },
  { id: "advanced", label: "ADVANCED MODE" },
  { id: "faceless", label: "FACELESS BRAND" },
  { id: "spanish", label: "ESPAÑOL" },
];
const AD_PLATFORMS = [
  { id: "tiktok", label: "TIKTOK ADS" },
  { id: "meta", label: "META ADS" },
  { id: "google", label: "GOOGLE ADS" },
  { id: "youtube", label: "YT ADS" },
];
const AGENTS_META = [
  { id: "content",    label: "CONTENT",    icon: "⚡", color: N.green,  num: "01" },
  { id: "publishing", label: "PUBLISH",    icon: "◈", color: N.cyan,   num: "02" },
  { id: "research",   label: "RESEARCH",   icon: "◎", color: N.yellow, num: "03" },
  { id: "scheduler",  label: "SCHEDULER",  icon: "◷", color: N.purple, num: "04" },
  { id: "revenue",    label: "REVENUE",    icon: "◆", color: N.red,    num: "05" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const r = await fetch(`${BACKEND}/api/content/generate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const d = await r.json();
  return d.content || "ERROR: No output received.";
}
async function saveToBackend(endpoint, data) {
  try { await fetch(`${BACKEND}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch (e) { }
}
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }, []);
  return [copied, copy];
}

// ─── AGENT ACTIVITY LOG ──────────────────────────────────────────────────────
function useActivityLog() {
  const [log, setLog] = useState([]);
  const push = useCallback((agentId, msg) => {
    const color = AGENTS_META.find(a => a.id === agentId)?.color || N.green;
    setLog(l => [{ id: Date.now(), agentId, msg, color, time: new Date().toLocaleTimeString("en", { hour12: false }) }, ...l.slice(0, 49)]);
  }, []);
  return [log, push];
}

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
function Panel({ children, color, style, className }) {
  return (
    <div className={className} style={{
      border: `1px solid ${color || N.green}44`,
      background: N.panel,
      borderRadius: 2,
      position: "relative",
      ...style,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 6, borderTop: `1px solid ${color || N.green}`, borderLeft: `1px solid ${color || N.green}` }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 6, height: 6, borderTop: `1px solid ${color || N.green}`, borderRight: `1px solid ${color || N.green}` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 6, height: 6, borderBottom: `1px solid ${color || N.green}`, borderLeft: `1px solid ${color || N.green}` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 6, height: 6, borderBottom: `1px solid ${color || N.green}`, borderRight: `1px solid ${color || N.green}` }} />
      {children}
    </div>
  );
}

function CyberBtn({ children, onClick, disabled, color, style }) {
  const c = color || N.green;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "transparent" : `${c}11`,
      border: `1px solid ${disabled ? N.textDim : c}`,
      color: disabled ? N.textDim : c,
      padding: "10px 14px", borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: N.mono, fontSize: 12, fontWeight: 700, letterSpacing: 2,
      textTransform: "uppercase", width: "100%", transition: "all 0.15s",
      boxShadow: disabled ? "none" : `0 0 8px ${c}33`,
      ...style,
    }}>
      {children}
    </button>
  );
}

function CyberSelect({ options, value, onChange, color }) {
  const c = color || N.green;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: "6px 12px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono,
          fontSize: 10, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase",
          border: value === o.id ? `1px solid ${c}` : `1px solid ${N.border}`,
          background: value === o.id ? `${c}18` : "transparent",
          color: value === o.id ? c : N.textDim,
          boxShadow: value === o.id ? `0 0 6px ${c}44` : "none",
          transition: "all 0.15s",
        }}>{o.label || o.icon && `${o.icon} ${o.label}`}</button>
      ))}
    </div>
  );
}

function CyberInput({ value, onChange, placeholder, multiline }) {
  const props = { value, onChange: e => onChange(e.target.value), placeholder, style: {
    width: "100%", background: N.dark, border: `1px solid ${N.border}`,
    color: N.text, fontFamily: N.mono, fontSize: 12, padding: "10px 12px",
    borderRadius: 2, outline: "none", resize: multiline ? "vertical" : "none",
    minHeight: multiline ? 80 : "auto",
  }};
  return multiline ? <textarea {...props} /> : <input {...props} />;
}

function SectionLabel({ children, color }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, color: color || N.green, letterSpacing: 3,
      textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ height: 1, width: 16, background: color || N.green }} />
      {children}
      <div style={{ height: 1, flex: 1, background: `${color || N.green}33` }} />
    </div>
  );
}

// ─── AGENT STATUS DISPLAY ────────────────────────────────────────────────────
function AgentStatusBar({ agentId, loading, statusText }) {
  const meta = AGENTS_META.find(a => a.id === agentId);
  const [dots, setDots] = useState("");
  const [dataLines, setDataLines] = useState([]);

  useEffect(() => {
    if (!loading) { setDots(""); setDataLines([]); return; }
    const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    const lineInterval = setInterval(() => {
      const lines = [
        `> INITIALIZING ${meta?.label} PROTOCOL...`,
        `> CONNECTING TO ANTHROPIC API...`,
        `> PROCESSING REQUEST...`,
        `> GENERATING OUTPUT STREAM...`,
        `> COMPILING RESPONSE DATA...`,
        `> RUNNING NLP ANALYSIS...`,
        `> OPTIMIZING CONTENT VECTORS...`,
        `> CROSS-REFERENCING TREND DATA...`,
        `> FINALIZING OUTPUT...`,
      ];
      setDataLines(l => [lines[Math.floor(Math.random() * lines.length)], ...l.slice(0, 3)]);
    }, 600);
    return () => { clearInterval(dotInterval); clearInterval(lineInterval); };
  }, [loading, agentId]);

  if (!loading) return null;

  return (
    <Panel color={meta?.color} style={{ padding: 16, marginBottom: 16 }} className="agent-active">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div className="spin" style={{ fontSize: 20, color: meta?.color }}>{meta?.icon}</div>
        <div>
          <div style={{ fontSize: 11, color: meta?.color, letterSpacing: 2, fontWeight: 700 }}>
            AGENT {meta?.num} — {meta?.label} ACTIVE{dots}
          </div>
          <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginTop: 2 }}>{statusText}</div>
        </div>
        <div className="blink" style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: meta?.color }} />
      </div>
      <div style={{ borderTop: `1px solid ${meta?.color}22`, paddingTop: 10 }}>
        {dataLines.map((l, i) => (
          <div key={i} style={{ fontSize: 9, color: i === 0 ? meta?.color : N.textDim, letterSpacing: 1, marginBottom: 3,
            animation: "data-flow 2s ease forwards", opacity: 1 - i * 0.25 }}>{l}</div>
        ))}
      </div>
      <div style={{ marginTop: 10, height: 2, background: N.border, borderRadius: 1, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${meta?.color}, ${N.cyan})`,
          animation: "progress-fill 2s ease infinite", borderRadius: 1 }} />
      </div>
    </Panel>
  );
}

// ─── OUTPUT BOX ──────────────────────────────────────────────────────────────
function OutputBox({ text, label, color }) {
  const [copied, copy] = useCopy();
  const c = color || N.green;
  if (!text) return null;
  return (
    <Panel color={c} style={{ marginTop: 16 }} className="slide-in">
      <div style={{ padding: "8px 12px", borderBottom: `1px solid ${c}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: c, letterSpacing: 3 }}>◈ {label || "OUTPUT"}</span>
        <button onClick={() => copy(text)} style={{ fontSize: 9, color: copied ? N.green : N.textDim, background: "none", border: `1px solid ${copied ? N.green : N.border}`, padding: "3px 8px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, letterSpacing: 1 }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <div style={{ padding: 14, fontSize: 12, lineHeight: 1.9, color: N.text, whiteSpace: "pre-wrap" }}>{text}</div>
    </Panel>
  );
}

// ─── CONFIG DRAWER ───────────────────────────────────────────────────────────
function ConfigDrawer({ open, onClose, config, setConfig, activeAgent }) {
  const meta = AGENTS_META.find(a => a.id === activeAgent);
  if (!open) return null;

  const agentConfigs = {
    content: [
      { key: "maxTokens", label: "MAX OUTPUT TOKENS", type: "range", min: 200, max: 2000, step: 100 },
      { key: "temperature", label: "CREATIVITY LEVEL", type: "range", min: 0, max: 10, step: 1 },
      { key: "contentLang", label: "OUTPUT LANGUAGE", type: "select", options: ["English", "Spanish", "French", "Portuguese"] },
      { key: "hashtagCount", label: "HASHTAG COUNT", type: "range", min: 5, max: 30, step: 1 },
    ],
    publishing: [
      { key: "rewriteDepth", label: "REWRITE INTENSITY", type: "select", options: ["Light", "Medium", "Heavy", "Complete"] },
      { key: "addEmoji", label: "ADD EMOJIS", type: "toggle" },
      { key: "addCTA", label: "FORCE CTA", type: "toggle" },
    ],
    research: [
      { key: "researchDepth", label: "RESEARCH DEPTH", type: "select", options: ["Quick (5 topics)", "Standard (8 topics)", "Deep (15 topics)"] },
      { key: "includeStats", label: "INCLUDE STATISTICS", type: "toggle" },
      { key: "includeExamples", label: "INCLUDE EXAMPLES", type: "toggle" },
    ],
    scheduler: [
      { key: "timezone", label: "TIMEZONE", type: "select", options: ["EST", "CST", "PST", "GMT", "UTC"] },
      { key: "startTime", label: "FIRST POST TIME", type: "select", options: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"] },
      { key: "spacing", label: "POST SPACING", type: "select", options: ["2 hours", "3 hours", "4 hours", "6 hours"] },
    ],
    revenue: [
      { key: "currency", label: "CURRENCY", type: "select", options: ["USD", "EUR", "GBP", "CAD"] },
      { key: "taxRate", label: "TAX RATE %", type: "range", min: 0, max: 40, step: 1 },
      { key: "profitAlert", label: "PROFIT ALERT THRESHOLD $", type: "range", min: 100, max: 10000, step: 100 },
    ],
  };

  const fields = agentConfigs[activeAgent] || [];

  return (
    <div style={{ position: "fixed", top: 0, right: 0, width: 320, height: "100vh", background: N.dark,
      borderLeft: `1px solid ${meta?.color}44`, zIndex: 100, overflowY: "auto", animation: "slide-in 0.2s ease" }}>
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${meta?.color}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: meta?.color, letterSpacing: 3 }}>◈ AGENT {meta?.num} CONFIG</div>
          <div style={{ fontSize: 13, color: N.text, letterSpacing: 2, marginTop: 2 }}>{meta?.label} SETTINGS</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: `1px solid ${N.border}`, color: N.textDim,
          width: 28, height: 28, borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 12 }}>✕</button>
      </div>

      <div style={{ padding: 18 }}>
        {/* Global Settings */}
        <SectionLabel color={meta?.color}>GLOBAL</SectionLabel>
        <Panel color={N.border} style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 8 }}>NICHE / INDUSTRY</div>
          <CyberInput value={config.niche || "AI & Make Money Online"} onChange={v => setConfig(c => ({ ...c, niche: v }))} />
          <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 8, marginTop: 12 }}>BRAND VOICE</div>
          <CyberSelect value={config.brandVoice || "hype"} onChange={v => setConfig(c => ({ ...c, brandVoice: v }))}
            options={[{ id: "hype", label: "HYPE" }, { id: "pro", label: "PRO" }, { id: "casual", label: "CASUAL" }, { id: "authority", label: "AUTHORITY" }]} color={meta?.color} />
        </Panel>

        {/* Agent-specific settings */}
        <SectionLabel color={meta?.color}>AGENT {meta?.num} OPTIONS</SectionLabel>
        <Panel color={meta?.color} style={{ padding: 14, marginBottom: 16 }}>
          {fields.map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 6 }}>{field.label}</div>
              {field.type === "range" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min={field.min} max={field.max} step={field.step}
                    value={config[field.key] ?? field.min}
                    onChange={e => setConfig(c => ({ ...c, [field.key]: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: meta?.color }} />
                  <span style={{ fontSize: 11, color: meta?.color, minWidth: 36, textAlign: "right" }}>{config[field.key] ?? field.min}</span>
                </div>
              )}
              {field.type === "select" && (
                <CyberSelect value={config[field.key] || field.options[0]}
                  onChange={v => setConfig(c => ({ ...c, [field.key]: v }))}
                  options={field.options.map(o => ({ id: o, label: o }))} color={meta?.color} />
              )}
              {field.type === "toggle" && (
                <button onClick={() => setConfig(c => ({ ...c, [field.key]: !c[field.key] }))} style={{
                  padding: "5px 14px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono,
                  fontSize: 10, letterSpacing: 2, border: `1px solid ${config[field.key] ? meta?.color : N.border}`,
                  background: config[field.key] ? `${meta?.color}18` : "transparent",
                  color: config[field.key] ? meta?.color : N.textDim,
                }}>
                  {config[field.key] ? "■ ON" : "□ OFF"}
                </button>
              )}
            </div>
          ))}
        </Panel>

        {/* Backend status */}
        <SectionLabel color={N.cyan}>SYSTEM</SectionLabel>
        <Panel color={N.cyan} style={{ padding: 14 }}>
          <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 6 }}>BACKEND ENDPOINT</div>
          <div style={{ fontSize: 9, color: N.cyan, wordBreak: "break-all" }}>{BACKEND}</div>
          <div style={{ marginTop: 10, fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 6 }}>VERSION</div>
          <div style={{ fontSize: 9, color: N.cyan }}>AGENT EMPIRE v3.0 — CYBERPUNK</div>
        </Panel>
      </div>
    </div>
  );
}

// ─── ACTIVITY LOG ────────────────────────────────────────────────────────────
function ActivityLog({ log }) {
  return (
    <Panel color={N.green} style={{ padding: 0, height: "100%" }}>
      <div style={{ padding: "8px 12px", borderBottom: `1px solid ${N.border}`, fontSize: 9, color: N.green, letterSpacing: 3 }}>
        ◈ SYSTEM LOG
      </div>
      <div style={{ padding: "8px 12px", overflowY: "auto", height: "calc(100% - 33px)" }}>
        {log.length === 0 && <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 1 }}>AWAITING AGENT ACTIVITY...</div>}
        {log.map(entry => (
          <div key={entry.id} style={{ marginBottom: 6, fontSize: 9, lineHeight: 1.5 }}>
            <span style={{ color: N.textDim }}>[{entry.time}] </span>
            <span style={{ color: entry.color }}>AG-{AGENTS_META.find(a => a.id === entry.agentId)?.num} </span>
            <span style={{ color: N.text }}>{entry.msg}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── AGENT PANELS ────────────────────────────────────────────────────────────

function ContentAgent({ onGenerated, config, log }) {
  const [platform, setPlatform] = useState("tiktok");
  const [type, setType] = useState("hook");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [custom, setCustom] = useState("");
  const [tone, setTone] = useState("hype");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const generate = async () => {
    setLoading(true); setOut("");
    log("content", `Generating ${type} for ${platform}...`);
    const t = custom.trim() || topic;
    const toneMap = { hype: "energetic and bold", educational: "clear and authoritative", controversial: "provocative and challenging", story: "personal and narrative" };
    const typeMap = {
      hook: `Write 3 viral opening hooks (1-2 sentences each, numbered) for ${platform} about "${t}".`,
      script: `Write a complete ${platform} video script about "${t}". Include [HOOK], [BODY], [CTA].`,
      caption: `Write a ${platform} caption about "${t}" with hook, value, CTA and ${config.hashtagCount || 12} hashtags.`,
      series: `Write a 3-part content series (POST 1, 2, 3) about "${t}" for ${platform}.`,
    };
    const niche = config.niche || "AI & Make Money Online";
    const result = await callClaude(`You are an elite social media content creator for ${niche}. Tone: ${toneMap[tone]}. ${typeMap[type]} Output ONLY the content.`).catch(() => "ERROR. Try again.");
    setOut(result);
    onGenerated(result, t, platform);
    log("content", `Content generated successfully — ${result.length} chars`);
    setLoading(false);
  };

  return (
    <div>
      <AgentStatusBar agentId="content" loading={loading} statusText="GENERATING CONTENT STREAM..." />
      <Panel color={N.green} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.green}>PLATFORM TARGET</SectionLabel>
        <CyberSelect options={PLATFORMS} value={platform} onChange={setPlatform} color={N.green} />
      </Panel>
      <Panel color={N.green} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.green}>CONTENT TYPE</SectionLabel>
        <CyberSelect options={CONTENT_TYPES} value={type} onChange={setType} color={N.green} />
      </Panel>
      <Panel color={N.green} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.green}>TOPIC VECTOR</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setTopic(t); setCustom(""); }} style={{
              padding: "4px 10px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 9,
              letterSpacing: 1, border: topic === t && !custom ? `1px solid ${N.green}` : `1px solid ${N.border}`,
              background: topic === t && !custom ? `${N.green}18` : "transparent",
              color: topic === t && !custom ? N.green : N.textDim,
            }}>{t}</button>
          ))}
        </div>
        <CyberInput value={custom} onChange={setCustom} placeholder="> ENTER CUSTOM TOPIC..." />
      </Panel>
      <Panel color={N.green} style={{ padding: 14, marginBottom: 14 }}>
        <SectionLabel color={N.green}>TONE MATRIX</SectionLabel>
        <CyberSelect options={TONES} value={tone} onChange={setTone} color={N.green} />
      </Panel>
      <CyberBtn onClick={generate} disabled={loading} color={N.green}>
        {loading ? "⚡ AGENT RUNNING..." : "⚡ EXECUTE CONTENT AGENT"}
      </CyberBtn>
      <OutputBox text={out} label="CONTENT OUTPUT" color={N.green} />
    </div>
  );
}

function PublishingAgent({ incoming, incomingTopic, config, log }) {
  const [manual, setManual] = useState("");
  const [style, setStyle] = useState("beginner");
  const [platform, setPlatform] = useState("tiktok");
  const [format, setFormat] = useState("hook");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const content = incoming || manual;

  const transform = async () => {
    if (!content.trim()) return;
    setLoading(true); setOut("");
    log("publishing", `Repurposing content for ${platform} in ${style} style...`);
    const styleMap = { beginner: "beginner-friendly — simple words, assume viewer knows nothing", advanced: "advanced tactical — skip basics, speak to experienced creators", faceless: "faceless brand — no personal pronouns, anonymous authority", spanish: "fluent natural Spanish for Latin American audience" };
    const fmtMap = { hook: "3 viral hooks (numbered)", script: "full video script with [HOOK],[BODY],[CTA]", caption: "caption with hook, value, CTA and 10 hashtags", series: "3-part content series" };
    const result = await callClaude(`Repurpose this content for a second channel.\nORIGINAL:\n${content}\nStyle: ${styleMap[style]}\nFormat: ${fmtMap[format]} for ${platform}\nOutput ONLY the content.`).catch(() => "ERROR.");
    setOut(result);
    log("publishing", `Channel 2 content ready — ${style} style`);
    setLoading(false);
  };

  return (
    <div>
      <AgentStatusBar agentId="publishing" loading={loading} statusText="REPURPOSING CONTENT FOR CHANNEL 2..." />
      {incoming ? (
        <Panel color={N.cyan} style={{ padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: N.cyan, letterSpacing: 2, marginBottom: 6 }}>✓ AUTO-RECEIVED FROM AGENT 01</div>
          <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 1, marginBottom: 6 }}>TOPIC: {incomingTopic}</div>
          <div style={{ fontSize: 11, color: N.text, lineHeight: 1.6 }}>{incoming.slice(0, 200)}{incoming.length > 200 ? "..." : ""}</div>
        </Panel>
      ) : (
        <Panel color={N.cyan} style={{ padding: 14, marginBottom: 10 }}>
          <SectionLabel color={N.cyan}>MANUAL INPUT</SectionLabel>
          <CyberInput value={manual} onChange={setManual} placeholder="> PASTE CONTENT FROM AGENT 01..." multiline />
        </Panel>
      )}
      <Panel color={N.cyan} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.cyan}>CHANNEL 2 STYLE</SectionLabel>
        <CyberSelect options={SECOND_STYLES} value={style} onChange={setStyle} color={N.cyan} />
      </Panel>
      <Panel color={N.cyan} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.cyan}>TARGET PLATFORM</SectionLabel>
        <CyberSelect options={PLATFORMS} value={platform} onChange={setPlatform} color={N.cyan} />
      </Panel>
      <Panel color={N.cyan} style={{ padding: 14, marginBottom: 14 }}>
        <SectionLabel color={N.cyan}>OUTPUT FORMAT</SectionLabel>
        <CyberSelect options={CONTENT_TYPES} value={format} onChange={setFormat} color={N.cyan} />
      </Panel>
      <CyberBtn onClick={transform} disabled={loading || !content.trim()} color={N.cyan}>
        {loading ? "◈ AGENT RUNNING..." : "◈ EXECUTE PUBLISHING AGENT"}
      </CyberBtn>
      <OutputBox text={out} label="CHANNEL 2 OUTPUT" color={N.cyan} />
    </div>
  );
}

function ResearchAgent({ config, log }) {
  const [cat, setCat] = useState("trending");
  const [niche, setNiche] = useState(config.niche || "AI & Make Money Online");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const research = async () => {
    setLoading(true); setOut("");
    log("research", `Running ${cat} research for "${niche}"...`);
    const depth = config.researchDepth?.includes("15") ? 15 : config.researchDepth?.includes("5") ? 5 : 8;
    const prompts = {
      trending: `Generate ${depth} trending content topics in "${niche}" for TikTok & YouTube Shorts 2026. For each: title, why trending, viral hook, engagement potential.`,
      hooks: `Generate ${depth} proven hook formulas for "${niche}" in 2026. For each: formula, example, psychological trigger.`,
      competitors: `Analyze winning strategies for top creators in "${niche}" 2026. Give: winning angles, posting patterns, high-engagement topics, content gaps.`,
      monetization: `Generate ${depth} revenue-optimized content ideas for "${niche}". For each: angle, monetization method, revenue potential, hook.`,
    };
    const result = await callClaude(prompts[cat]).catch(() => "ERROR.");
    setOut(result);
    await saveToBackend("/api/research/save", { report: result, category: cat });
    log("research", `Research complete — ${result.length} chars saved to database`);
    setLoading(false);
  };

  return (
    <div>
      <AgentStatusBar agentId="research" loading={loading} statusText="SCANNING TREND DATABASE..." />
      <Panel color={N.yellow} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.yellow}>RESEARCH MODE</SectionLabel>
        <CyberSelect options={RESEARCH_CATS} value={cat} onChange={setCat} color={N.yellow} />
      </Panel>
      <Panel color={N.yellow} style={{ padding: 14, marginBottom: 14 }}>
        <SectionLabel color={N.yellow}>NICHE TARGET</SectionLabel>
        <CyberInput value={niche} onChange={setNiche} placeholder="> ENTER NICHE..." />
      </Panel>
      <CyberBtn onClick={research} disabled={loading} color={N.yellow}>
        {loading ? "◎ AGENT RUNNING..." : "◎ EXECUTE RESEARCH AGENT"}
      </CyberBtn>
      <OutputBox text={out} label="INTELLIGENCE REPORT" color={N.yellow} />
    </div>
  );
}

function SchedulerAgent({ config, log }) {
  const [niche, setNiche] = useState(config.niche || "AI & Make Money Online");
  const [ch1, setCh1] = useState(["tiktok", "youtube"]);
  const [ch2, setCh2] = useState(["instagram", "twitter"]);
  const [ppd, setPpd] = useState("3");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [copied, copy] = useCopy();
  const toggle = (list, set, id) => set(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const generate = async () => {
    setLoading(true); setSchedule(null);
    log("scheduler", `Building 7-day schedule for ${niche}...`);
    const tz = config.timezone || "EST";
    const start = config.startTime || "8:00 AM";
    const prompt = `Create a 7-day posting schedule for TWO channels in "${niche}".\nChannel 1: ${ch1.join(", ")}\nChannel 2: ${ch2.join(", ")}\nPosts/day: ${ppd}\nTimezone: ${tz}, First post: ${start}\n\nFormat EXACTLY:\nDAY: Monday\nTHEME: [theme]\nCH1: [platform] | [time] | [type] | [topic]\nCH2: [platform] | [time] | [type] | [topic]\n\nOutput ONLY the schedule.`;
    const raw = await callClaude(prompt).catch(() => null);
    if (!raw) { setLoading(false); return; }
    const days = raw.split(/DAY:/i).filter(b => b.trim()).map(block => {
      const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
      return {
        day: lines[0]?.trim(),
        theme: lines.find(l => l.startsWith("THEME:"))?.replace("THEME:", "").trim() || "",
        ch1Posts: lines.filter(l => l.startsWith("CH1:")).map(l => l.replace("CH1:", "").trim()),
        ch2Posts: lines.filter(l => l.startsWith("CH2:")).map(l => l.replace("CH2:", "").trim()),
      };
    }).filter(d => d.day);
    setSchedule(days);
    await saveToBackend("/api/scheduler/save", { schedule: days });
    log("scheduler", `7-day schedule generated and saved — ${days.length} days`);
    setLoading(false);
  };

  const raw = schedule ? schedule.map(d => `${d.day} — ${d.theme}\n${d.ch1Posts.map(p => `CH1: ${p}`).join("\n")}\n${d.ch2Posts.map(p => `CH2: ${p}`).join("\n")}`).join("\n\n") : "";

  const plColors = { tiktok: N.green, youtube: N.red, instagram: N.purple, twitter: N.cyan };

  return (
    <div>
      <AgentStatusBar agentId="scheduler" loading={loading} statusText="COMPUTING OPTIMAL POST SCHEDULE..." />
      <Panel color={N.purple} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.purple}>NICHE</SectionLabel>
        <CyberInput value={niche} onChange={setNiche} />
      </Panel>
      <Panel color={N.purple} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.purple}>CHANNEL 1 PLATFORMS</SectionLabel>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => <button key={p.id} onClick={() => toggle(ch1, setCh1, p.id)} style={{ padding: "6px 12px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 10, letterSpacing: 1, border: ch1.includes(p.id) ? `1px solid ${N.purple}` : `1px solid ${N.border}`, background: ch1.includes(p.id) ? `${N.purple}18` : "transparent", color: ch1.includes(p.id) ? N.purple : N.textDim }}>{p.icon} {p.label}</button>)}
        </div>
      </Panel>
      <Panel color={N.purple} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.purple}>CHANNEL 2 PLATFORMS</SectionLabel>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PLATFORMS.map(p => <button key={p.id} onClick={() => toggle(ch2, setCh2, p.id)} style={{ padding: "6px 12px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 10, letterSpacing: 1, border: ch2.includes(p.id) ? `1px solid ${N.purple}` : `1px solid ${N.border}`, background: ch2.includes(p.id) ? `${N.purple}18` : "transparent", color: ch2.includes(p.id) ? N.purple : N.textDim }}>{p.icon} {p.label}</button>)}
        </div>
      </Panel>
      <Panel color={N.purple} style={{ padding: 14, marginBottom: 14 }}>
        <SectionLabel color={N.purple}>POSTS PER DAY</SectionLabel>
        <div style={{ display: "flex", gap: 6 }}>
          {["2","3","4","5"].map(n => <button key={n} onClick={() => setPpd(n)} style={{ flex: 1, padding: "8px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 11, letterSpacing: 2, border: ppd === n ? `1px solid ${N.purple}` : `1px solid ${N.border}`, background: ppd === n ? `${N.purple}18` : "transparent", color: ppd === n ? N.purple : N.textDim }}>{n}×</button>)}
        </div>
      </Panel>
      <CyberBtn onClick={generate} disabled={loading} color={N.purple}>
        {loading ? "◷ AGENT RUNNING..." : "◷ EXECUTE SCHEDULER AGENT"}
      </CyberBtn>
      {schedule && (
        <Panel color={N.purple} style={{ marginTop: 16, padding: 0 }}>
          <div style={{ padding: "8px 12px", borderBottom: `1px solid ${N.purple}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: N.purple, letterSpacing: 3 }}>◈ 7-DAY SCHEDULE</span>
            <button onClick={() => copy(raw)} style={{ fontSize: 9, color: copied ? N.green : N.textDim, background: "none", border: `1px solid ${copied ? N.green : N.border}`, padding: "3px 8px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, letterSpacing: 1 }}>{copied ? "✓ COPIED" : "COPY ALL"}</button>
          </div>
          {schedule.map((d, i) => (
            <div key={i} style={{ padding: "12px 14px", borderBottom: i < schedule.length - 1 ? `1px solid ${N.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: N.purple, fontWeight: 700, letterSpacing: 2 }}>{d.day?.toUpperCase()}</span>
                <span style={{ fontSize: 9, color: N.textDim }}>// {d.theme}</span>
              </div>
              {d.ch1Posts.map((p, j) => { const parts = p.split("|").map(x => x.trim()); const plId = parts[0]?.toLowerCase().replace(" ", ""); return <div key={j} style={{ fontSize: 9, marginBottom: 3, color: N.textDim }}><span style={{ color: plColors[plId] || N.green }}>CH1 </span>{parts.join(" · ")}</div>; })}
              {d.ch2Posts.map((p, j) => { const parts = p.split("|").map(x => x.trim()); const plId = parts[0]?.toLowerCase().replace(" ", ""); return <div key={j} style={{ fontSize: 9, marginBottom: 3, color: N.textDim }}><span style={{ color: (plColors[plId] || N.cyan) + "aa" }}>CH2 </span>{parts.join(" · ")}</div>; })}
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}

function RevenueAgent({ config, log }) {
  const [rev, setRev] = useState({ paypal: "", tiktok: "", meta: "", google: "", youtube: "", affiliate: "", ugc: "" });
  const [spend, setSpend] = useState({ tiktok: "", meta: "", google: "", youtube: "" });
  const [goal, setGoal] = useState("scale");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const upd = (s, k, v) => s(p => ({ ...p, [k]: v }));
  const totalRev = Object.values(rev).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalSpend = Object.values(spend).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const net = totalRev - totalSpend;
  const roas = totalSpend > 0 ? (totalRev / totalSpend).toFixed(2) : "—";
  const cur = config.currency || "USD";

  const analyze = async () => {
    setLoading(true); setOut("");
    log("revenue", `Running revenue analysis — Total: $${totalRev.toFixed(0)}, Spend: $${totalSpend.toFixed(0)}...`);
    const goalMap = { scale: "scale aggressively", optimize: "optimize ROAS", diversify: "diversify streams", conserve: "grow organically" };
    const result = await callClaude(`Revenue agent analysis.\nREVENUE: PayPal $${rev.paypal||0}, TikTok $${rev.tiktok||0}, Meta $${rev.meta||0}, Google $${rev.google||0}, YouTube $${rev.youtube||0}, Affiliate $${rev.affiliate||0}, UGC $${rev.ugc||0}. TOTAL: $${totalRev.toFixed(2)}\nAD SPEND: TikTok $${spend.tiktok||0}, Meta $${spend.meta||0}, Google $${spend.google||0}, YouTube $${spend.youtube||0}. TOTAL: $${totalSpend.toFixed(2)}\nNET: $${net.toFixed(2)} | ROAS: ${roas}x | GOAL: ${goalMap[goal]} | CURRENCY: ${cur}\nGive: 1)PROFIT ANALYSIS 2)AD STRATEGY with specific moves 3)REVENUE GAPS 4)30-DAY ACTION PLAN 5)PAYPAL SETUP TIP`).catch(() => "ERROR.");
    setOut(result);
    await saveToBackend("/api/revenue/save", { revenue: rev, adSpend: spend });
    log("revenue", `Analysis complete — Net profit: ${cur} ${net.toFixed(0)}`);
    setLoading(false);
  };

  const StatBox = ({ label, value, color }) => (
    <Panel color={color} style={{ padding: "12px 14px", flex: 1 }}>
      <div style={{ fontSize: 8, color: N.textDim, letterSpacing: 2 }}>{label}</div>
      <div style={{ fontSize: 20, color, fontWeight: 700, letterSpacing: -1, marginTop: 4 }}>{value}</div>
    </Panel>
  );

  return (
    <div>
      <AgentStatusBar agentId="revenue" loading={loading} statusText="PROCESSING FINANCIAL DATA..." />
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <StatBox label="REVENUE" value={`$${totalRev.toFixed(0)}`} color={N.green} />
        <StatBox label="AD SPEND" value={`$${totalSpend.toFixed(0)}`} color={N.red} />
        <StatBox label="NET PROFIT" value={`$${net.toFixed(0)}`} color={net >= 0 ? N.cyan : N.yellow} />
        <StatBox label="ROAS" value={`${roas}x`} color={N.purple} />
      </div>
      <Panel color={N.red} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.red}>REVENUE STREAMS ({cur})</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["paypal","PAYPAL"],["tiktok","TIKTOK"],["meta","META"],["google","GOOGLE"],["youtube","YOUTUBE"],["affiliate","AFFILIATE"],["ugc","UGC DEALS"]].map(([k,l]) => (
            <div key={k}>
              <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 1, marginBottom: 4 }}>{l}</div>
              <input type="number" placeholder="0.00" value={rev[k]} onChange={e => upd(setRev, k, e.target.value)} style={{ width: "100%", background: N.dark, border: `1px solid ${N.border}`, color: N.text, fontFamily: N.mono, fontSize: 12, padding: "8px 10px", borderRadius: 2, outline: "none" }} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel color={N.red} style={{ padding: 14, marginBottom: 10 }}>
        <SectionLabel color={N.red}>AD SPEND ({cur})</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {AD_PLATFORMS.map(p => (
            <div key={p.id}>
              <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 1, marginBottom: 4 }}>{p.label}</div>
              <input type="number" placeholder="0.00" value={spend[p.id]} onChange={e => upd(setSpend, p.id, e.target.value)} style={{ width: "100%", background: N.dark, border: `1px solid ${N.border}`, color: N.text, fontFamily: N.mono, fontSize: 12, padding: "8px 10px", borderRadius: 2, outline: "none" }} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel color={N.red} style={{ padding: 14, marginBottom: 14 }}>
        <SectionLabel color={N.red}>OBJECTIVE</SectionLabel>
        <CyberSelect value={goal} onChange={setGoal} color={N.red}
          options={[{ id: "scale", label: "SCALE REVENUE" }, { id: "optimize", label: "OPTIMIZE ROAS" }, { id: "diversify", label: "DIVERSIFY" }, { id: "conserve", label: "ORGANIC GROWTH" }]} />
      </Panel>
      <CyberBtn onClick={analyze} disabled={loading} color={N.red}>
        {loading ? "◆ AGENT RUNNING..." : "◆ EXECUTE REVENUE AGENT"}
      </CyberBtn>
      <OutputBox text={out} label="FINANCIAL INTELLIGENCE" color={N.red} />
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AgentEmpire() {
  const [active, setActive] = useState("content");
  const [genContent, setGenContent] = useState("");
  const [genTopic, setGenTopic] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState({ niche: "AI & Make Money Online", brandVoice: "hype", hashtagCount: 12, timezone: "EST" });
  const [backendStatus, setBackendStatus] = useState("checking");
  const [activityLog, pushLog] = useActivityLog();
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = globalCSS;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    fetch(BACKEND).then(r => r.json()).then(() => setBackendStatus("online")).catch(() => setBackendStatus("offline"));
  }, []);

  const handleGenerated = useCallback((content, topic) => {
    setGenContent(content);
    setGenTopic(topic);
  }, []);

  const meta = AGENTS_META.find(a => a.id === active);

  return (
    <div className="flicker" style={{ minHeight: "100vh", background: N.black, position: "relative", overflow: "hidden" }}>
      {/* Scanline overlay */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)" }} />

      {/* Grid background */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${N.green}08 1px, transparent 1px), linear-gradient(90deg, ${N.green}08 1px, transparent 1px)`,
        backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "16px" }}>

        {/* TOP MENUBAR */}
        <Panel color={N.green} style={{ padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo */}
          <div className="glow-text" style={{ fontSize: 14, color: N.green, letterSpacing: 4, fontWeight: 700, whiteSpace: "nowrap" }}>
            ◈ AGENT EMPIRE
          </div>
          <div style={{ width: 1, height: 20, background: N.border }} />

          {/* Agent tabs in menubar */}
          <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
            {AGENTS_META.map(a => (
              <button key={a.id} onClick={() => setActive(a.id)} style={{
                padding: "5px 12px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono,
                fontSize: 10, letterSpacing: 1.5, fontWeight: 700, whiteSpace: "nowrap",
                border: active === a.id ? `1px solid ${a.color}` : `1px solid transparent`,
                background: active === a.id ? `${a.color}15` : "transparent",
                color: active === a.id ? a.color : N.textDim,
                boxShadow: active === a.id ? `0 0 8px ${a.color}33` : "none",
                transition: "all 0.15s",
              }}>
                {a.icon} {a.num}:{a.label}
                {a.id === "publishing" && genContent && active !== "publishing" && (
                  <span style={{ marginLeft: 6, background: N.cyan, color: N.black, borderRadius: 2, padding: "1px 4px", fontSize: 8 }}>NEW</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 20, background: N.border }} />

          {/* Right side controls */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* Backend status */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, letterSpacing: 1,
              color: backendStatus === "online" ? N.green : backendStatus === "offline" ? N.red : N.yellow }}>
              <div className={backendStatus === "online" ? "blink" : ""} style={{ width: 6, height: 6, borderRadius: "50%", background: backendStatus === "online" ? N.green : backendStatus === "offline" ? N.red : N.yellow }} />
              {backendStatus === "online" ? "ONLINE" : backendStatus === "offline" ? "OFFLINE" : "..."}
            </div>

            {/* Log toggle */}
            <button onClick={() => setShowLog(s => !s)} style={{
              padding: "5px 10px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 9,
              letterSpacing: 1, border: `1px solid ${showLog ? N.cyan : N.border}`,
              background: showLog ? `${N.cyan}15` : "transparent", color: showLog ? N.cyan : N.textDim,
            }}>LOG</button>

            {/* Config button */}
            <button onClick={() => setConfigOpen(o => !o)} style={{
              padding: "5px 10px", borderRadius: 2, cursor: "pointer", fontFamily: N.mono, fontSize: 9,
              letterSpacing: 1, border: `1px solid ${configOpen ? meta?.color : N.border}`,
              background: configOpen ? `${meta?.color}15` : "transparent", color: configOpen ? meta?.color : N.textDim,
            }}>⚙ CONFIG</button>
          </div>
        </Panel>

        {/* PIPELINE BAR */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, overflowX: "auto" }}>
          {AGENTS_META.map((a, i) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div onClick={() => setActive(a.id)} style={{
                flex: 1, padding: "6px 10px", cursor: "pointer", textAlign: "center",
                background: active === a.id ? `${a.color}15` : N.panel,
                border: `1px solid ${active === a.id ? a.color : N.border}`,
                borderRight: i < 4 ? "none" : undefined,
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 9, color: active === a.id ? a.color : N.textDim, letterSpacing: 2 }}>{a.icon} {a.label}</div>
              </div>
              {i < 4 && <div style={{ fontSize: 10, color: N.border, padding: "0 4px" }}>→</div>}
            </div>
          ))}
          <div style={{ fontSize: 10, color: N.border, padding: "0 6px" }}>→</div>
          <div style={{ padding: "6px 12px", border: `1px solid ${N.border}`, background: N.panel }}>
            <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 2 }}>📱 LIVE</div>
          </div>
        </div>

        {/* MAIN CONTENT + LOG */}
        <div style={{ display: "grid", gridTemplateColumns: showLog ? "1fr 260px" : "1fr", gap: 12 }}>
          {/* Agent panel */}
          <div>
            {/* Agent header */}
            <Panel color={meta?.color} style={{ padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18, color: meta?.color }}>{meta?.icon}</span>
                <div>
                  <div style={{ fontSize: 9, color: N.textDim, letterSpacing: 3 }}>AGENT {meta?.num}</div>
                  <div style={{ fontSize: 14, color: meta?.color, letterSpacing: 3, fontWeight: 700 }}>{meta?.label} MODULE</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 9, color: N.textDim, letterSpacing: 1 }}>
                  NICHE: <span style={{ color: meta?.color }}>{config.niche}</span>
                </div>
              </div>
            </Panel>

            {active === "content"    && <ContentAgent onGenerated={handleGenerated} config={config} log={pushLog} />}
            {active === "publishing" && <PublishingAgent incoming={genContent} incomingTopic={genTopic} config={config} log={pushLog} />}
            {active === "research"   && <ResearchAgent config={config} log={pushLog} />}
            {active === "scheduler"  && <SchedulerAgent config={config} log={pushLog} />}
            {active === "revenue"    && <RevenueAgent config={config} log={pushLog} />}
          </div>

          {/* Activity log sidebar */}
          {showLog && (
            <div style={{ height: "calc(100vh - 160px)", position: "sticky", top: 16 }}>
              <ActivityLog log={activityLog} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 9, color: N.textDim, letterSpacing: 3 }}>
          AGENT EMPIRE v3.0 · 5 AGENTS ONLINE · RUNNING 24/7 ON RAILWAY
        </div>
      </div>

      {/* Config drawer */}
      <ConfigDrawer open={configOpen} onClose={() => setConfigOpen(false)} config={config} setConfig={setConfig} activeAgent={active} />
    </div>
  );
}
