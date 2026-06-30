import { useState, useCallback, useEffect, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BACKEND = "https://agent-empire-backend-production.up.railway.app";
const SUPABASE_URL = "https://ewahhppqyoqaewoxwspj.supabase.co";
const SUPABASE_KEY = "sb_publishable_dskneAba0v6z-PXVao4iNQ_M_WLz5VJ";
const ALLOWED_EMAIL = ""; // Set your email here after first login

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const light = {
  bg:       "#ffffff",
  bg2:      "#f8f9fa",
  bg3:      "#f1f3f5",
  border:   "#e9ecef",
  border2:  "#dee2e6",
  text:     "#1a1a2e",
  text2:    "#6c757d",
  text3:    "#adb5bd",
  accent:   "#6366f1",
  accent2:  "#818cf8",
  accentBg: "#eef2ff",
  green:    "#10b981",
  greenBg:  "#d1fae5",
  red:      "#ef4444",
  redBg:    "#fee2e2",
  yellow:   "#f59e0b",
  yellowBg: "#fef3c7",
  blue:     "#3b82f6",
  blueBg:   "#dbeafe",
  purple:   "#8b5cf6",
  purpleBg: "#ede9fe",
  orange:   "#f97316",
  orangeBg: "#ffedd5",
  emerald:  "#059669",
  emeraldBg:"#d1fae5",
  shadow:   "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadow2:  "0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
  shadow3:  "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
};
const dark = {
  bg:       "#0f0f13",
  bg2:      "#161620",
  bg3:      "#1e1e2e",
  border:   "#2a2a3e",
  border2:  "#363650",
  text:     "#e2e8f0",
  text2:    "#94a3b8",
  text3:    "#475569",
  accent:   "#818cf8",
  accent2:  "#a5b4fc",
  accentBg: "#1e1b4b",
  green:    "#34d399",
  greenBg:  "#064e3b",
  red:      "#f87171",
  redBg:    "#450a0a",
  yellow:   "#fbbf24",
  yellowBg: "#451a03",
  blue:     "#60a5fa",
  blueBg:   "#1e3a5f",
  purple:   "#a78bfa",
  purpleBg: "#2e1065",
  orange:   "#fb923c",
  orangeBg: "#431407",
  emerald:  "#34d399",
  emeraldBg:"#064e3b",
  shadow:   "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
  shadow2:  "0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
  shadow3:  "0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.3)",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "tiktok",    label: "TikTok",         icon: "🎵" },
  { id: "youtube",   label: "YouTube Shorts",  icon: "▶️" },
  { id: "instagram", label: "Instagram",       icon: "📸" },
  { id: "twitter",   label: "X / Twitter",     icon: "𝕏" },
];
const CONTENT_TYPES = [
  { id: "hook",    label: "Viral Hook" },
  { id: "script",  label: "Full Script" },
  { id: "caption", label: "Caption + Tags" },
  { id: "series",  label: "Content Series" },
];
const TONES = [
  { id: "hype",          label: "Hype" },
  { id: "educational",   label: "Educational" },
  { id: "controversial", label: "Controversial" },
  { id: "story",         label: "Storytelling" },
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
  { id: "trending",     label: "Trending Now",       desc: "Viral topics this week" },
  { id: "hooks",        label: "Hook Formulas",       desc: "Proven scroll-stoppers" },
  { id: "competitors",  label: "Competitor Intel",    desc: "What's working in niche" },
  { id: "monetization", label: "Monetization Angles", desc: "Revenue-focused ideas" },
];
const SECOND_STYLES = [
  { id: "beginner",  label: "Beginner Friendly" },
  { id: "advanced",  label: "Advanced / Pro" },
  { id: "faceless",  label: "Faceless Brand" },
  { id: "spanish",   label: "Spanish Audience" },
];
const AD_PLATFORMS = [
  { id: "tiktok",   label: "TikTok Ads" },
  { id: "meta",     label: "Meta Ads" },
  { id: "google",   label: "Google Ads" },
  { id: "youtube",  label: "YouTube Ads" },
];
const AGENTS_META = [
  { id: "cmd",        label: "Command",    icon: "⌘",  color: "accent",   num: "00" },
  { id: "content",    label: "Content",    icon: "⚡",  color: "purple",   num: "01" },
  { id: "publishing", label: "Publish",    icon: "◈",  color: "blue",     num: "02" },
  { id: "research",   label: "Research",   icon: "◎",  color: "yellow",   num: "03" },
  { id: "scheduler",  label: "Scheduler",  icon: "📅",  color: "green",    num: "04" },
  { id: "revenue",    label: "Revenue",    icon: "💰",  color: "red",      num: "05" },
  { id: "etsy",       label: "Etsy",       icon: "🛍",  color: "orange",   num: "06" },
  { id: "fiverr",     label: "Fiverr",     icon: "💼",  color: "emerald",  num: "07" },
  { id: "shopify",    label: "Products",   icon: "🛒",  color: "green",    num: "08" },
  { id: "dropship",   label: "Dropship",   icon: "📦",  color: "blue",     num: "09" },
  { id: "storecopy",  label: "Store Copy", icon: "✍",  color: "purple",   num: "10" },
  { id: "shopify_mgr", label: "Shopify",   icon: "🏪",  color: "green",    num: "11" },
  { id: "logs",       label: "Logs",       icon: "📋",  color: "accent",   num: "—"  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const r = await fetch(`${BACKEND}/api/content/generate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const d = await r.json();
  return d.content || "No output received.";
}
async function saveToBackend(endpoint, data) {
  try { await fetch(`${BACKEND}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch (e) {}
}
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }, []);
  return [copied, copy];
}
async function saveLog(agentId, msg, detail = "", inputData = "", outputData = "", status = "success", startTime = null) {
  try {
    const duration_ms = startTime ? Date.now() - startTime : null;
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify({ 
        agent_id: agentId, 
        message: msg,
        detail: detail || msg,
        input_data: inputData ? inputData.slice(0, 2000) : "",
        output_data: outputData ? outputData.slice(0, 2000) : "",
        duration_ms,
        status,
      }),
    });
  } catch (e) {}
}
async function loadLogs() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/activity_logs?order=created_at.desc&limit=200`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
    });
    const data = await r.json();
    return Array.isArray(data) ? data.map(d => ({ 
      id: d.id, 
      agentId: d.agent_id, 
      msg: d.message,
      detail: d.detail || d.message,
      inputData: d.input_data || "",
      outputData: d.output_data || "",
      durationMs: d.duration_ms,
      status: d.status || "success",
      time: new Date(d.created_at).toLocaleTimeString("en", { hour12: false }),
      date: new Date(d.created_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: d.created_at,
    })) : [];
  } catch (e) { return []; }
}
function useActivityLog() {
  const [log, setLog] = useState([]);
  useEffect(() => { loadLogs().then(setLog); }, []);
  const push = useCallback((agentId, msg, detail = "", inputData = "", outputData = "", status = "success", startTime = null) => {
    const entry = { 
      id: Date.now(), agentId, msg, detail: detail || msg,
      inputData, outputData, status,
      time: new Date().toLocaleTimeString("en", { hour12: false }),
      date: new Date().toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: new Date().toISOString(),
      durationMs: startTime ? Date.now() - startTime : null,
    };
    setLog(l => [entry, ...l.slice(0, 199)]);
    saveLog(agentId, msg, detail, inputData, outputData, status, startTime);
  }, []);
  return [log, push];
}


// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
function Card({ children, T, style }) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 20, marginBottom: 12,
      boxShadow: T.shadow, ...style,
    }}>{children}</div>
  );
}

function Label({ children, T }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>{children}</div>;
}

function Chip({ label, active, onClick, color, T }) {
  const c = T[color] || T.accent;
  const bg = T[color + "Bg"] || T.accentBg;
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
      border: `1px solid ${active ? c : T.border}`,
      background: active ? bg : "transparent",
      color: active ? c : T.text2,
      transition: "all 0.15s",
    }}>{label}</button>
  );
}

function Input({ value, onChange, placeholder, multiline, T }) {
  const s = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1px solid ${T.border2}`, background: T.bg,
    color: T.text, fontSize: 14, outline: "none",
    fontFamily: "inherit", resize: multiline ? "vertical" : "none",
    minHeight: multiline ? 90 : "auto", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />;
}

function Btn({ children, onClick, disabled, variant, T, style }) {
  const variants = {
    primary:  { bg: T.accent,   color: "#fff", border: T.accent },
    success:  { bg: T.green,    color: "#fff", border: T.green },
    danger:   { bg: T.red,      color: "#fff", border: T.red },
    warning:  { bg: T.yellow,   color: "#fff", border: T.yellow },
    ghost:    { bg: "transparent", color: T.text2, border: T.border2 },
    purple:   { bg: T.purple,   color: "#fff", border: T.purple },
    blue:     { bg: T.blue,     color: "#fff", border: T.blue },
    orange:   { bg: T.orange,   color: "#fff", border: T.orange },
    emerald:  { bg: T.emerald,  color: "#fff", border: T.emerald },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "11px 20px", borderRadius: 10,
      border: `1px solid ${disabled ? T.border : v.border}`,
      background: disabled ? T.bg3 : v.bg,
      color: disabled ? T.text3 : v.color,
      fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s", fontFamily: "inherit", ...style,
    }}>{children}</button>
  );
}

function Badge({ children, color, T }) {
  const c = T[color] || T.accent;
  const bg = T[(color || "accent") + "Bg"] || T.accentBg;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, background: bg, color: c, fontSize: 11, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function OutputBox({ text, label, color, T }) {
  const [copied, copy] = useCopy();
  const c = T[color] || T.accent;
  if (!text) return null;
  return (
    <div style={{ marginTop: 16, borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg2, overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{label || "Output"}</span>
        <button onClick={() => copy(text)} style={{ fontSize: 12, color: copied ? T.green : T.text2, background: "none", border: `1px solid ${T.border2}`, padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div style={{ padding: 16, fontSize: 14, lineHeight: 1.8, color: T.text, whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}

function LoadingBar({ loading, color, T }) {
  if (!loading) return null;
  const c = T[color] || T.accent;
  return (
    <div style={{ marginBottom: 12, padding: 16, borderRadius: 10, background: T[color + "Bg"] || T.accentBg, border: `1px solid ${c}33`, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, animation: "pulse 1.5s infinite" }} />
      <span style={{ fontSize: 13, color: c, fontWeight: 500 }}>Agent running...</span>
      <div style={{ flex: 1, height: 3, background: T.border, borderRadius: 2, overflow: "hidden", marginLeft: "auto" }}>
        <div style={{ height: "100%", background: c, borderRadius: 2, animation: "progress 2s ease infinite", width: "60%" }} />
      </div>
    </div>
  );
}

// ─── SUPABASE AUTH ───────────────────────────────────────────────────────────
async function supabaseSignIn(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
    body: JSON.stringify({ email, password }),
  });
  return r.json();
}
async function supabaseSignUp(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
    body: JSON.stringify({ email, password }),
  });
  return r.json();
}
async function supabaseGetUser(token) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { "Authorization": `Bearer ${token}`, "apikey": SUPABASE_KEY },
  });
  return r.json();
}
async function supabaseSignOut(token) {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
    });
  } catch (e) {}
}

// ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
function LoginPage({ T, darkMode, setDarkMode, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const handleAuth = async () => {
    if (!email || !password) { setError("Enter your email and password."); return; }
    setLoading(true); setError("");
    try {
      const result = mode === "login"
        ? await supabaseSignIn(email, password)
        : await supabaseSignUp(email, password);
      if (result.access_token) {
        localStorage.setItem("ae_token", result.access_token);
        localStorage.setItem("ae_email", email);
        onLogin(result.access_token, email);
      } else {
        setError(result.error_description || result.msg || "Authentication failed.");
      }
    } catch (e) { setError("Connection error. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: T.accentBg, border: `1px solid ${T.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⌘</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0, letterSpacing: -0.5 }}>Agent Empire</h1>
          <p style={{ fontSize: 14, color: T.text2, marginTop: 6 }}>Your AI content business command center</p>
        </div>

        {/* Card */}
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, boxShadow: T.shadow3 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: T.bg3, borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
                border: "none", background: mode === m ? T.bg2 : "transparent",
                color: mode === m ? T.text : T.text2, boxShadow: mode === m ? T.shadow : "none",
                transition: "all 0.15s", fontFamily: "inherit",
              }}>{m === "login" ? "Sign in" : "Create account"}</button>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: T.text2, display: "block", marginBottom: 6 }}>Email</label>
            <Input value={email} onChange={setEmail} placeholder="you@example.com" T={T} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: T.text2, display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAuth()}
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg, color: T.text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>

          {error && <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: T.redBg, color: T.red, fontSize: 13 }}>{error}</div>}

          <Btn onClick={handleAuth} disabled={loading} T={T}>
            {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
          </Btn>
        </div>

        {/* Dark mode toggle */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", color: T.text2, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AGENT PANELS ────────────────────────────────────────────────────────────

function ContentAgent({ T, config, log, onGenerated }) {
  const [platform, setPlatform] = useState("tiktok");
  const [type, setType] = useState("hook");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [custom, setCustom] = useState("");
  const [tone, setTone] = useState("hype");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const generate = async () => {
    setLoading(true); setOut("");
    log("content", `Generating ${type} for ${platform}`);
    const t = custom.trim() || topic;
    const toneMap = { hype: "energetic and bold", educational: "clear and authoritative", controversial: "provocative", story: "personal and narrative" };
    const typeMap = {
      hook: `Write 3 viral opening hooks (1-2 sentences each, numbered) for ${platform} about "${t}".`,
      script: `Write a complete ${platform} video script about "${t}". Include [HOOK], [BODY], [CTA].`,
      caption: `Write a ${platform} caption about "${t}" with hook, value, CTA and 12 hashtags.`,
      series: `Write a 3-part content series (POST 1, 2, 3) about "${t}" for ${platform}.`,
    };
    const result = await callClaude(`You are an elite social media content creator for ${config.niche || "AI & Make Money Online"}. Tone: ${toneMap[tone]}. ${typeMap[type]} Output ONLY the content.`).catch(() => "Error. Try again.");
    setOut(result);
    onGenerated(result, t, platform);
    log("content", `Content generated — ${result.length} chars`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="purple" T={T} />
      <Card T={T}><Label T={T}>Platform</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{PLATFORMS.map(p => <Chip key={p.id} label={`${p.icon} ${p.label}`} active={platform === p.id} onClick={() => setPlatform(p.id)} color="purple" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Content Type</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{CONTENT_TYPES.map(c => <Chip key={c.id} label={c.label} active={type === c.id} onClick={() => setType(c.id)} color="purple" T={T} />)}</div></Card>
      <Card T={T}>
        <Label T={T}>Topic</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{TOPICS.map(t => <Chip key={t} label={t} active={topic === t && !custom} onClick={() => { setTopic(t); setCustom(""); }} color="purple" T={T} />)}</div>
        <Input value={custom} onChange={setCustom} placeholder="Or type your own topic..." T={T} />
      </Card>
      <Card T={T}><Label T={T}>Tone</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{TONES.map(t => <Chip key={t.id} label={t.label} active={tone === t.id} onClick={() => setTone(t.id)} color="purple" T={T} />)}</div></Card>
      <Btn onClick={generate} disabled={loading} variant="purple" T={T}>{loading ? "Generating..." : "⚡ Generate Content"}</Btn>
      <OutputBox text={out} label="Content Output" color="purple" T={T} />
    </div>
  );
}

function PublishingAgent({ T, config, log, incoming, incomingTopic }) {
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
    log("publishing", `Repurposing for ${platform} in ${style} style`);
    const styleMap = { beginner: "beginner-friendly, simple words", advanced: "advanced tactical, no hand-holding", faceless: "faceless brand, no personal pronouns", spanish: "fluent natural Spanish for Latin America" };
    const fmtMap = { hook: "3 viral hooks (numbered)", script: "full video script [HOOK],[BODY],[CTA]", caption: "caption with hook, value, CTA and 10 hashtags", series: "3-part series (POST 1, 2, 3)" };
    const result = await callClaude(`Repurpose this content for a second channel.\nORIGINAL:\n${content}\nStyle: ${styleMap[style]}\nFormat: ${fmtMap[format]} for ${platform}\nOutput ONLY the content.`).catch(() => "Error.");
    setOut(result);
    log("publishing", `Channel 2 content ready`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="blue" T={T} />
      {incoming ? (
        <Card T={T} style={{ border: `1px solid ${T.blue}33`, background: T.blueBg }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue, marginBottom: 6 }}>✓ Auto-received from Content Agent</div>
          <div style={{ fontSize: 13, color: T.text2 }}>{incomingTopic}</div>
          <div style={{ fontSize: 13, color: T.text, marginTop: 8, lineHeight: 1.6 }}>{incoming.slice(0, 200)}{incoming.length > 200 ? "..." : ""}</div>
        </Card>
      ) : (
        <Card T={T}><Label T={T}>Paste Content</Label><Input value={manual} onChange={setManual} placeholder="Paste content from the Content Agent..." multiline T={T} /></Card>
      )}
      <Card T={T}><Label T={T}>Channel 2 Style</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{SECOND_STYLES.map(s => <Chip key={s.id} label={s.label} active={style === s.id} onClick={() => setStyle(s.id)} color="blue" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Target Platform</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{PLATFORMS.map(p => <Chip key={p.id} label={`${p.icon} ${p.label}`} active={platform === p.id} onClick={() => setPlatform(p.id)} color="blue" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Output Format</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{CONTENT_TYPES.map(c => <Chip key={c.id} label={c.label} active={format === c.id} onClick={() => setFormat(c.id)} color="blue" T={T} />)}</div></Card>
      <Btn onClick={transform} disabled={loading || !content.trim()} variant="blue" T={T}>{loading ? "Transforming..." : "◈ Rewrite & Reformat for Channel 2"}</Btn>
      <OutputBox text={out} label="Channel 2 Output" color="blue" T={T} />
    </div>
  );
}

function ResearchAgent({ T, config, log }) {
  const [cat, setCat] = useState("trending");
  const [niche, setNiche] = useState(config.niche || "AI & Make Money Online");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const research = async () => {
    setLoading(true); setOut("");
    log("research", `Running ${cat} research for "${niche}"`);
    const prompts = {
      trending: `Generate 8 trending content topics in "${niche}" for TikTok & YouTube Shorts 2026. For each: title, why trending, viral hook, engagement potential.`,
      hooks: `Generate 12 proven hook formulas for "${niche}" in 2026. For each: formula, example, psychological trigger.`,
      competitors: `Analyze winning strategies for top creators in "${niche}" 2026. Give: winning angles, posting patterns, high-engagement topics, content gaps.`,
      monetization: `Generate 8 revenue-optimized content ideas for "${niche}". For each: angle, monetization method, revenue potential, hook.`,
    };
    const result = await callClaude(prompts[cat]).catch(() => "Error.");
    setOut(result);
    await saveToBackend("/api/research/save", { report: result, category: cat });
    log("research", `Research complete — saved to database`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="yellow" T={T} />
      <Card T={T}>
        <Label T={T}>Research Type</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {RESEARCH_CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: "12px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
              border: `1px solid ${cat === c.id ? T.yellow : T.border}`,
              background: cat === c.id ? T.yellowBg : T.bg,
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: cat === c.id ? T.yellow : T.text }}>{c.label}</div>
              <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      </Card>
      <Card T={T}><Label T={T}>Niche</Label><Input value={niche} onChange={setNiche} T={T} /></Card>
      <Btn onClick={research} disabled={loading} variant="warning" T={T}>{loading ? "Researching..." : "◎ Run Research"}</Btn>
      <OutputBox text={out} label="Research Report" color="yellow" T={T} />
    </div>
  );
}

function SchedulerAgent({ T, config, log }) {
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
    log("scheduler", `Building 7-day schedule for ${niche}`);
    const prompt = `Create a 7-day posting schedule for TWO channels in "${niche}".\nChannel 1: ${ch1.join(", ")}\nChannel 2: ${ch2.join(", ")}\nPosts/day: ${ppd}\n\nFormat EXACTLY:\nDAY: Monday\nTHEME: [theme]\nCH1: [platform] | [time] | [type] | [topic]\nCH2: [platform] | [time] | [type] | [topic]\n\nOutput ONLY the schedule.`;
    const raw = await callClaude(prompt).catch(() => null);
    if (!raw) { setLoading(false); return; }
    const days = raw.split(/DAY:/i).filter(b => b.trim()).map(block => {
      const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
      return { day: lines[0]?.trim(), theme: lines.find(l => l.startsWith("THEME:"))?.replace("THEME:", "").trim() || "", ch1Posts: lines.filter(l => l.startsWith("CH1:")).map(l => l.replace("CH1:", "").trim()), ch2Posts: lines.filter(l => l.startsWith("CH2:")).map(l => l.replace("CH2:", "").trim()) };
    }).filter(d => d.day);
    setSchedule(days);
    await saveToBackend("/api/scheduler/save", { schedule: days });
    log("scheduler", `7-day schedule generated`);
    setLoading(false);
  };

  const raw = schedule ? schedule.map(d => `${d.day} — ${d.theme}\n${d.ch1Posts.map(p => `CH1: ${p}`).join("\n")}\n${d.ch2Posts.map(p => `CH2: ${p}`).join("\n")}`).join("\n\n") : "";

  return (
    <div>
      <LoadingBar loading={loading} color="green" T={T} />
      <Card T={T}><Label T={T}>Niche</Label><Input value={niche} onChange={setNiche} T={T} /></Card>
      <Card T={T}>
        <Label T={T}>Channel 1 Platforms</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{PLATFORMS.map(p => <Chip key={p.id} label={`${p.icon} ${p.label}`} active={ch1.includes(p.id)} onClick={() => toggle(ch1, setCh1, p.id)} color="green" T={T} />)}</div>
      </Card>
      <Card T={T}>
        <Label T={T}>Channel 2 Platforms</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{PLATFORMS.map(p => <Chip key={p.id} label={`${p.icon} ${p.label}`} active={ch2.includes(p.id)} onClick={() => toggle(ch2, setCh2, p.id)} color="green" T={T} />)}</div>
      </Card>
      <Card T={T}>
        <Label T={T}>Posts Per Day</Label>
        <div style={{ display: "flex", gap: 8 }}>{["2","3","4","5"].map(n => <Chip key={n} label={`${n}×`} active={ppd === n} onClick={() => setPpd(n)} color="green" T={T} />)}</div>
      </Card>
      <Btn onClick={generate} disabled={loading} variant="success" T={T}>{loading ? "Building schedule..." : "📅 Generate 7-Day Schedule"}</Btn>
      {schedule && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Your Week</span>
            <button onClick={() => copy(raw)} style={{ fontSize: 12, color: copied ? T.green : T.text2, background: "none", border: `1px solid ${T.border2}`, padding: "4px 12px", borderRadius: 6, cursor: "pointer" }}>{copied ? "✓ Copied" : "Copy All"}</button>
          </div>
          <div style={{ borderRadius: 10, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {schedule.map((d, i) => (
              <div key={i} style={{ padding: "14px 16px", borderBottom: i < schedule.length - 1 ? `1px solid ${T.border}` : "none", background: i % 2 === 0 ? T.bg2 : T.bg }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{d.day}</span>
                  <span style={{ fontSize: 12, color: T.text2 }}>{d.theme}</span>
                </div>
                {d.ch1Posts.map((p, j) => <div key={j} style={{ fontSize: 12, color: T.text2, marginBottom: 2 }}><Badge color="green" T={T}>CH1</Badge> {p}</div>)}
                {d.ch2Posts.map((p, j) => <div key={j} style={{ fontSize: 12, color: T.text2, marginBottom: 2, marginTop: 2 }}><Badge color="blue" T={T}>CH2</Badge> {p}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RevenueAgent({ T, config, log }) {
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

  const analyze = async () => {
    setLoading(true); setOut("");
    log("revenue", `Analyzing revenue — $${totalRev.toFixed(0)} total`);
    const goalMap = { scale: "scale aggressively", optimize: "optimize ROAS", diversify: "diversify streams", conserve: "grow organically" };
    const result = await callClaude(`Revenue analysis for AI content business.\nREVENUE: PayPal $${rev.paypal||0}, TikTok $${rev.tiktok||0}, Meta $${rev.meta||0}, Google $${rev.google||0}, YouTube $${rev.youtube||0}, Affiliate $${rev.affiliate||0}, UGC $${rev.ugc||0}. TOTAL: $${totalRev.toFixed(2)}\nAD SPEND: TikTok $${spend.tiktok||0}, Meta $${spend.meta||0}, Google $${spend.google||0}, YouTube $${spend.youtube||0}. TOTAL: $${totalSpend.toFixed(2)}\nNET: $${net.toFixed(2)} | ROAS: ${roas}x | GOAL: ${goalMap[goal]}\nGive: 1)PROFIT ANALYSIS 2)AD STRATEGY 3)REVENUE GAPS 4)30-DAY PLAN 5)PAYPAL TIP`).catch(() => "Error.");
    setOut(result);
    await saveToBackend("/api/revenue/save", { revenue: rev, adSpend: spend });
    log("revenue", `Analysis complete — net: $${net.toFixed(0)}`);
    setLoading(false);
  };

  const StatBox = ({ label, value, color }) => (
    <div style={{ flex: 1, padding: "16px", borderRadius: 10, background: T[color + "Bg"] || T.bg2, border: `1px solid ${T[color] || T.border}22` }}>
      <div style={{ fontSize: 11, color: T.text2, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T[color] || T.text }}>{value}</div>
    </div>
  );

  return (
    <div>
      <LoadingBar loading={loading} color="red" T={T} />
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <StatBox label="Revenue" value={`$${totalRev.toFixed(0)}`} color="green" />
        <StatBox label="Ad Spend" value={`$${totalSpend.toFixed(0)}`} color="red" />
        <StatBox label="Net Profit" value={`$${net.toFixed(0)}`} color={net >= 0 ? "blue" : "yellow"} />
        <StatBox label="ROAS" value={`${roas}x`} color="purple" />
      </div>
      <Card T={T}>
        <Label T={T}>Monthly Revenue ($)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["paypal","💳 PayPal"],["tiktok","🎵 TikTok"],["meta","📘 Meta"],["google","🔍 Google"],["youtube","▶️ YouTube"],["affiliate","🔗 Affiliate"],["ugc","🎬 UGC"]].map(([k,l]) => (
            <div key={k}><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>{l}</div><input type="number" placeholder="0.00" value={rev[k]} onChange={e => upd(setRev, k, e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg, color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} /></div>
          ))}
        </div>
      </Card>
      <Card T={T}>
        <Label T={T}>Monthly Ad Spend ($)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {AD_PLATFORMS.map(p => (
            <div key={p.id}><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>{p.label}</div><input type="number" placeholder="0.00" value={spend[p.id]} onChange={e => upd(setSpend, p.id, e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg, color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} /></div>
          ))}
        </div>
      </Card>
      <Card T={T}>
        <Label T={T}>Goal</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[["scale","🚀 Scale Revenue"],["optimize","🎯 Optimize ROAS"],["diversify","🌐 Diversify"],["conserve","🛡 Organic Growth"]].map(([id,lbl]) => <Chip key={id} label={lbl} active={goal === id} onClick={() => setGoal(id)} color="red" T={T} />)}
        </div>
      </Card>
      <Btn onClick={analyze} disabled={loading} variant="danger" T={T}>{loading ? "Analyzing..." : "💰 Run Revenue Analysis"}</Btn>
      <OutputBox text={out} label="Revenue Report" color="red" T={T} />
    </div>
  );
}

function EtsyAgent({ T, config, log }) {
  const ETSY_PRODUCTS = [
    { id: "prompts", label: "AI Prompt Pack" }, { id: "templates", label: "Content Templates" },
    { id: "calendar", label: "Content Calendar" }, { id: "guide", label: "Monetization Guide" },
    { id: "scripts", label: "Video Script Pack" }, { id: "bundle", label: "Full Bundle" },
  ];
  const [productType, setProductType] = useState("prompts");
  const [priceRange, setPriceRange] = useState("mid");
  const [niche, setNiche] = useState(config.niche || "AI & Make Money Online");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const generate = async () => {
    setLoading(true); setOut("");
    log("etsy", `Generating Etsy listing for ${productType}`);
    const priceMap = { budget: "$5-$15", mid: "$15-$35", premium: "$35-$75", high: "$75-$150" };
    const productMap = { prompts: "AI prompt pack (50-100 prompts)", templates: "social media content templates", calendar: "30-day content calendar", guide: "step-by-step monetization guide PDF", scripts: "viral video script pack (20 scripts)", bundle: "complete digital bundle" };
    const result = await callClaude(`Create a complete Etsy listing for a ${productMap[productType]} in "${niche}" priced at ${priceMap[priceRange]}.\n\nFormat:\nTITLE: [SEO title, max 140 chars]\nPRICE: [specific price + reasoning]\nDESCRIPTION:\n[5 paragraphs: hook, what's included, who it's for, results, CTA]\nTAGS: [13 comma-separated tags]\nWHAT TO INCLUDE IN FILE:\n[bullet list of content to create]\nUPSELL IDEAS:\n[3 related products to create next]`).catch(() => "Error.");
    setOut(result);
    log("etsy", `Etsy listing generated`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="orange" T={T} />
      <Card T={T}><Label T={T}>Product Type</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{ETSY_PRODUCTS.map(p => <Chip key={p.id} label={p.label} active={productType === p.id} onClick={() => setProductType(p.id)} color="orange" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Price Range</Label><div style={{ display: "flex", gap: 8 }}>{[["budget","$5-$15"],["mid","$15-$35"],["premium","$35-$75"],["high","$75+"]].map(([id,lbl]) => <Chip key={id} label={lbl} active={priceRange === id} onClick={() => setPriceRange(id)} color="orange" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Niche</Label><Input value={niche} onChange={setNiche} T={T} /></Card>
      <Btn onClick={generate} disabled={loading} variant="orange" T={T}>{loading ? "Generating listing..." : "🛍 Generate Etsy Listing"}</Btn>
      <OutputBox text={out} label="Etsy Listing" color="orange" T={T} />
    </div>
  );
}

function FiverrAgent({ T, config, log }) {
  const GIG_TYPES = [
    { id: "content", label: "Content Creation" }, { id: "scripts", label: "Video Scripts" },
    { id: "strategy", label: "Content Strategy" }, { id: "ugc", label: "UGC Content" },
    { id: "ghostwrite", label: "Ghostwriting" }, { id: "audit", label: "Social Audit" },
  ];
  const OUTPUT_TYPES = [{ id: "gig", label: "New Gig" }, { id: "message", label: "Buyer Message" }, { id: "faq", label: "FAQs" }, { id: "upsell", label: "Upsell Script" }];
  const [gigType, setGigType] = useState("content");
  const [outputType, setOutputType] = useState("gig");
  const [niche, setNiche] = useState(config.niche || "AI & Make Money Online");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const generate = async () => {
    setLoading(true); setOut("");
    log("fiverr", `Generating Fiverr ${outputType} for ${gigType}`);
    const gigMap = { content: "AI-powered social media content creation", scripts: "viral video scripts for TikTok, YouTube, Reels", strategy: "complete content strategy for creators", ugc: "UGC-style content scripts for brands", ghostwrite: "ghostwriting for creators — posts, captions, newsletters", audit: "social media audit with growth recommendations" };
    const prompts = {
      gig: `Create a complete Fiverr gig for "${gigMap[gigType]}" in "${niche}".\n\nGIG TITLE: [max 80 chars]\nCATEGORY: [path]\nSEARCH TAGS: [5 tags]\nDESCRIPTION: [400-500 words, hook, process, deliverables, CTA]\nPACKAGES:\nBASIC ($25) — [details, 2-day delivery]\nSTANDARD ($50) — [details, 1-day delivery]\nPREMIUM ($100) — [details, same-day]\nREQUIREMENTS: [3-5 questions for buyer]`,
      message: `Write a Fiverr welcome message for "${gigMap[gigType]}" buyers. Thank them, explain what you need, set expectations. Max 150 words. Warm but professional.`,
      faq: `Write 6 FAQ questions and answers for a Fiverr "${gigMap[gigType]}" gig. Make answers specific and convert skeptical buyers. Format: Q: / A:`,
      upsell: `Write a natural Fiverr upsell message after delivering "${gigMap[gigType]}". Offer a related upgrade. Not pushy. Include specific offer with price. Max 100 words.`,
    };
    const result = await callClaude(prompts[outputType]).catch(() => "Error.");
    setOut(result);
    log("fiverr", `Fiverr ${outputType} ready`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="emerald" T={T} />
      <Card T={T}><Label T={T}>Service Type</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{GIG_TYPES.map(g => <Chip key={g.id} label={g.label} active={gigType === g.id} onClick={() => setGigType(g.id)} color="emerald" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Generate</Label><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{OUTPUT_TYPES.map(o => <Chip key={o.id} label={o.label} active={outputType === o.id} onClick={() => setOutputType(o.id)} color="emerald" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Niche</Label><Input value={niche} onChange={setNiche} T={T} /></Card>
      <Btn onClick={generate} disabled={loading} variant="emerald" T={T}>{loading ? "Generating..." : "💼 Execute Fiverr Agent"}</Btn>
      <OutputBox text={out} label="Fiverr Output" color="emerald" T={T} />
    </div>
  );
}

function CommandAgent({ T, config, log, allAgents }) {
  const AGENT_TASKS = {
    content: ["Generate viral hook", "Write full script", "Create caption pack"], publishing: ["Repurpose for channel 2", "Translate to Spanish"],
    research: ["Find trending topics", "Analyze competitors"], scheduler: ["Build 7-day calendar", "Plan weekly themes"],
    revenue: ["Run profit analysis", "Audit ad spend"], etsy: ["Generate prompt pack listing", "Create template listing"],
    fiverr: ["Create new gig", "Write buyer message"],
  };
  const SOCIAL_PLATFORMS = [
    { id: "tiktok", label: "TikTok", color: "purple" }, { id: "instagram", label: "Instagram", color: "red" },
    { id: "youtube", label: "YouTube", color: "red" }, { id: "twitter", label: "X / Twitter", color: "blue" },
    { id: "fiverr", label: "Fiverr", color: "emerald" }, { id: "etsy", label: "Etsy", color: "orange" },
  ];

  const [tab, setTab] = useState("terminal");
  const [termInput, setTermInput] = useState("");
  const [termLog, setTermLog] = useState([
    { type: "system", text: "Command Agent initialized — all 7 subordinate agents online." },
    { type: "system", text: 'Type "help" for available commands.' },
  ]);
  const [taskQueue, setTaskQueue] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [activeProfile, setActiveProfile] = useState("tiktok");
  const [profiles, setProfiles] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileOut, setProfileOut] = useState("");
  const termRef = useRef(null);

  const pushTerm = useCallback((text, type = "output") => {
    setTermLog(l => [...l, { id: Date.now(), text, type }]);
    setTimeout(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, 50);
  }, []);

  const addTask = useCallback((agentId, task) => {
    const t = { id: Date.now(), agentId, task, status: "queued", time: new Date().toLocaleTimeString("en", { hour12: false }) };
    setTaskQueue(q => [...q, t]);
  }, []);

  const handleCommand = useCallback(async (input) => {
    const cmd = input.trim().toLowerCase();
    pushTerm(`> ${input}`, "input");
    if (cmd === "help") { pushTerm(`Commands:\n  status      — show all agents\n  run all     — queue all agents\n  run [agent] — trigger specific agent\n  brief       — generate daily briefing\n  queue       — show task queue\n  report      — performance report\n  auto on/off — toggle autonomous mode\n  clear       — clear terminal`); return; }
    if (cmd === "status") { allAgents.filter(a => a.id !== "cmd").forEach(a => pushTerm(`  AG-${a.num} ${a.label.padEnd(12)} ✓ Online — Ready`)); return; }
    if (cmd === "clear") { setTermLog([]); return; }
    if (cmd === "queue") { taskQueue.length === 0 ? pushTerm("Task queue is empty.") : taskQueue.forEach(t => pushTerm(`  [${t.status}] AG-${allAgents.find(a=>a.id===t.agentId)?.num} → ${t.task}`)); return; }
    if (cmd === "auto on") { setAutoMode(true); pushTerm("Autonomous mode activated."); Object.entries(AGENT_TASKS).forEach(([id, tasks]) => addTask(id, tasks[0])); return; }
    if (cmd === "auto off") { setAutoMode(false); pushTerm("Autonomous mode deactivated."); return; }
    if (cmd === "run all") { pushTerm("Queuing all agents..."); allAgents.filter(a => a.id !== "cmd").forEach(a => { const task = AGENT_TASKS[a.id]?.[0]; if (task) { addTask(a.id, task); pushTerm(`  AG-${a.num} ${a.label} → ${task}`); } }); return; }
    if (cmd.startsWith("run ")) { const name = cmd.replace("run ", ""); const agent = allAgents.find(a => a.id === name || a.label.toLowerCase() === name); if (!agent) { pushTerm(`Agent "${name}" not found.`, "error"); return; } const task = AGENT_TASKS[agent.id]?.[0] || "Execute directive"; addTask(agent.id, task); pushTerm(`AG-${agent.num} ${agent.label} tasked: ${task}`); log("cmd", `Commanded AG-${agent.num}`); return; }
    if (cmd === "report") { pushTerm(`Empire Report\n  Agents online: ${allAgents.length - 1}\n  Tasks completed: ${completedTasks.length}\n  Queue: ${taskQueue.length}\n  Auto mode: ${autoMode ? "Active" : "Inactive"}`); return; }
    if (cmd === "brief") { setBriefingLoading(true); pushTerm("Generating briefing..."); const result = await callClaude(`You are the Command Agent — AI GM of a content empire in "${config.niche||"AI & MMO"}". ${completedTasks.length} tasks completed, ${taskQueue.length} in queue.\n\nGenerate a sharp daily briefing:\n1. OPERATIONS SUMMARY\n2. CONTENT PIPELINE — 3 specific pieces to create today\n3. REVENUE FOCUS — top 2 monetization actions\n4. AGENT DIRECTIVES — specific orders for each agent\n5. THREAT ANALYSIS — 2 risks/opportunities\n6. COMMANDER'S ORDER — single most important action right now\n\nBe direct, tactical, specific.`).catch(() => "Error."); setBriefing(result); setBriefingLoading(false); pushTerm("Briefing generated. View in Briefing tab."); setTab("briefing"); return; }
    pushTerm("Processing...");
    const result = await callClaude(`You are the Command Agent GM of an AI content empire. User command: "${input}". Respond with a brief tactical action plan in under 80 words.`).catch(() => "Error.");
    pushTerm(result);
    log("cmd", `Command: ${input}`);
  }, [taskQueue, completedTasks, autoMode, config, allAgents, pushTerm, addTask, log]);

  const handleKeyDown = (e) => { if (e.key === "Enter" && termInput.trim()) { handleCommand(termInput); setTermInput(""); } };

  const generateProfile = async () => {
    setProfileLoading(true); setProfileOut("");
    const platform = SOCIAL_PLATFORMS.find(p => p.id === activeProfile);
    log("cmd", `Optimizing ${platform.label} profile`);
    const result = await callClaude(`Optimize a ${platform.label} profile for "${config.niche||"AI & MMO"}" niche.\nCurrent data: ${JSON.stringify(profiles[activeProfile] || {})}\n\nGenerate:\nDISPLAY NAME: [catchy, niche-relevant]\nBIO: [optimized for ${platform.label}, includes keywords]\nLINK STRATEGY: [what URL to use and why]\nCONTENT PILLARS: [3 pillars for this account]\nPOSTING STRATEGY: [best times, frequency, mix]\nGROWTH HACK: [one tactic to get first 1000 followers on ${platform.label}]`).catch(() => "Error.");
    setProfileOut(result);
    setProfileLoading(false);
    log("cmd", `${platform.label} profile optimized`);
  };

  const tabs = [["terminal","⌘ Terminal"],["queue","Tasks"],["social","Social Profiles"],["briefing","Briefing"]];
  const termColors = { system: T.accent, input: T.green, output: T.text, error: T.red };

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: T.bg3, borderRadius: 10, padding: 4 }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: "none", background: tab === id ? T.bg2 : "transparent",
            color: tab === id ? T.text : T.text2, boxShadow: tab === id ? T.shadow : "none",
            transition: "all 0.15s", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      {tab === "terminal" && (
        <div>
          <Card T={T} style={{ padding: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Command Terminal</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: autoMode ? T.green : T.text2 }}>Auto: {autoMode ? "On" : "Off"}</span>
                <button onClick={() => handleCommand(autoMode ? "auto off" : "auto on")} style={{ fontSize: 12, color: T.text2, background: T.bg3, border: `1px solid ${T.border2}`, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>{autoMode ? "Deactivate" : "Activate"}</button>
              </div>
            </div>
            <div ref={termRef} style={{ height: 300, overflowY: "auto", padding: 16, fontFamily: "monospace", background: T.bg }}>
              {termLog.map((entry, i) => (
                <div key={entry.id || i} style={{ fontSize: 13, lineHeight: 1.7, color: termColors[entry.type] || T.text, marginBottom: 2, whiteSpace: "pre-wrap" }}>{entry.text}</div>
              ))}
            </div>
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, background: T.bg2 }}>
              <span style={{ fontSize: 14, color: T.green, fontFamily: "monospace" }}>{">"}</span>
              <input value={termInput} onChange={e => setTermInput(e.target.value)} onKeyDown={handleKeyDown} placeholder='Type a command or "help"...' style={{ flex: 1, background: "none", border: "none", color: T.text, fontSize: 14, outline: "none", fontFamily: "monospace" }} />
            </div>
          </Card>
          <Card T={T}>
            <Label T={T}>Quick Commands</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["status","run all","brief","queue","report","auto on","run content","run research","run scheduler"].map(cmd => (
                <button key={cmd} onClick={() => handleCommand(cmd)} style={{ padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, border: `1px solid ${T.border2}`, background: T.bg3, color: T.text2, fontFamily: "inherit" }}>{cmd}</button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "queue" && (
        <div>
          <Card T={T} style={{ padding: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Active Tasks ({taskQueue.length})</span>
              <button onClick={() => setTaskQueue([])} style={{ fontSize: 12, color: T.text2, background: "none", border: `1px solid ${T.border2}`, padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
            </div>
            {taskQueue.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: T.text2, fontSize: 14 }}>No tasks queued — type "run all" to start</div>
              : taskQueue.map(task => {
                const agent = allAgents.find(a => a.id === task.agentId);
                return (
                  <div key={task.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 16 }}>{agent?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: T[agent?.color] || T.accent, fontWeight: 600 }}>AG-{agent?.num} {agent?.label}</div>
                      <div style={{ fontSize: 13, color: T.text }}>{task.task}</div>
                    </div>
                    <span style={{ fontSize: 11, color: T.text2 }}>{task.time}</span>
                    <button onClick={() => { setTaskQueue(q => q.filter(t => t.id !== task.id)); setCompletedTasks(c => [task, ...c.slice(0,19)]); }} style={{ fontSize: 12, color: T.green, background: T.greenBg, border: `1px solid ${T.green}33`, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
                  </div>
                );
              })}
          </Card>
          {completedTasks.length > 0 && (
            <Card T={T} style={{ padding: 0 }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>Completed ({completedTasks.length})</span>
              </div>
              {completedTasks.slice(0, 10).map((t, i) => (
                <div key={t.id} style={{ padding: "10px 16px", borderBottom: i < 9 ? `1px solid ${T.border}` : "none", fontSize: 13, color: T.text2 }}>✓ {allAgents.find(a=>a.id===t.agentId)?.label} — {t.task}</div>
              ))}
            </Card>
          )}
        </div>
      )}

      {tab === "social" && (
        <div>
          <Card T={T}>
            <Label T={T}>Platform</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 0 }}>
              {SOCIAL_PLATFORMS.map(p => <Chip key={p.id} label={p.label} active={activeProfile === p.id} onClick={() => { setActiveProfile(p.id); setProfileOut(""); }} color={p.color} T={T} />)}
            </div>
          </Card>
          {(() => {
            const platform = SOCIAL_PLATFORMS.find(p => p.id === activeProfile);
            const fields = { tiktok: ["displayName","bio","link","category"], instagram: ["displayName","bio","link","category"], youtube: ["channelName","description","link","category"], twitter: ["displayName","bio","link","pinnedPost"], fiverr: ["displayName","tagline","skills","responseTime"], etsy: ["shopName","announcement","aboutShop","policies"] }[activeProfile] || [];
            return (
              <div>
                <Card T={T}>
                  <Label T={T}>{platform.label} Profile Data</Label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {fields.map(field => (
                      <div key={field}>
                        <div style={{ fontSize: 12, color: T.text2, marginBottom: 5, textTransform: "capitalize" }}>{field.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <Input value={profiles[activeProfile]?.[field] || ""} onChange={v => setProfiles(p => ({ ...p, [activeProfile]: { ...p[activeProfile], [field]: v } }))} placeholder={`Enter ${field}...`} T={T} />
                      </div>
                    ))}
                  </div>
                </Card>
                <LoadingBar loading={profileLoading} color={platform.color} T={T} />
                <Btn onClick={generateProfile} disabled={profileLoading} variant={platform.color} T={T}>{profileLoading ? "Optimizing..." : `Optimize ${platform.label} Profile`}</Btn>
                <OutputBox text={profileOut} label={`${platform.label} Profile`} color={platform.color} T={T} />
              </div>
            );
          })()}
        </div>
      )}

      {tab === "briefing" && (
        <div>
          <LoadingBar loading={briefingLoading} color="accent" T={T} />
          <Btn onClick={() => handleCommand("brief")} disabled={briefingLoading} T={T} style={{ marginBottom: 16 }}>
            {briefingLoading ? "Generating briefing..." : "⌘ Generate Today's Briefing"}
          </Btn>
          {briefing ? <OutputBox text={briefing} label="Daily Empire Briefing" color="accent" T={T} />
            : <Card T={T} style={{ textAlign: "center", padding: 40 }}><div style={{ color: T.text2, fontSize: 14 }}>No briefing yet — click Generate or type "brief" in the terminal</div></Card>}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

// ─── AGENT 08: PRODUCT RESEARCH ──────────────────────────────────────────────
function ShopifyProductAgent({ T, config, log }) {
  const CATEGORIES = [
    { id: "trending", label: "Trending Now" }, { id: "evergreen", label: "Evergreen Winners" },
    { id: "seasonal", label: "Seasonal Picks" }, { id: "ai", label: "AI & Tech Products" },
    { id: "home", label: "Home & Living" }, { id: "fitness", label: "Health & Fitness" },
  ];
  const MARGINS = [
    { id: "any", label: "Any Margin" }, { id: "30", label: "30%+ Margin" },
    { id: "50", label: "50%+ Margin" }, { id: "70", label: "70%+ Margin" },
  ];
  const [category, setCategory] = useState("trending");
  const [margin, setMargin] = useState("50");
  const [budget, setBudget] = useState("low");
  const [niche, setNiche] = useState(config.niche || "AI & Tech");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const research = async () => {
    setLoading(true); setOut("");
    log("shopify", `Researching ${category} products with ${margin}% margin...`);
    const budgetMap = { low: "under $20 sourcing cost", mid: "$20-$50 sourcing cost", high: "$50-$100 sourcing cost" };
    const result = await callClaude(`You are a dropshipping product research expert. Find 8 winning dropshipping products for a ${category} store in the "${niche}" space.

Requirements:
- Sourcing cost: ${budgetMap[budget]}
- Minimum profit margin: ${margin}%
- Must be shippable via AliExpress or CJ Dropshipping

For EACH product provide:
PRODUCT: [name]
SOURCING PRICE: [$X from AliExpress/CJ]
SELL PRICE: [$X recommended retail]
PROFIT MARGIN: [X%]
PROFIT PER SALE: [$X]
WHY IT WINS: [2 sentences — why this product sells]
TARGET AUDIENCE: [who buys this]
BEST AD PLATFORM: [TikTok/Instagram/Facebook/Google]
SUPPLIER SEARCH TERM: [exact term to search on AliExpress]
COMPETITION LEVEL: [Low/Medium/High]
PRODUCT SCORE: [X/10]

Sort by Product Score highest to lowest. Be specific with real product examples.`).catch(() => "Error.");
    setOut(result);
    log("shopify", `Product research complete — 8 products analyzed`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="green" T={T} />
      <Card T={T}><Label T={T}>Product Category</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{CATEGORIES.map(c => <Chip key={c.id} label={c.label} active={category === c.id} onClick={() => setCategory(c.id)} color="green" T={T} />)}</div></Card>
      <Card T={T}><Label T={T}>Minimum Profit Margin</Label><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{MARGINS.map(m => <Chip key={m.id} label={m.label} active={margin === m.id} onClick={() => setMargin(m.id)} color="green" T={T} />)}</div></Card>
      <Card T={T}>
        <Label T={T}>Sourcing Budget</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {[["low","Low (under $20)"],["mid","Mid ($20-$50)"],["high","High ($50-$100)"]].map(([id,lbl]) => <Chip key={id} label={lbl} active={budget === id} onClick={() => setBudget(id)} color="green" T={T} />)}
        </div>
      </Card>
      <Card T={T}><Label T={T}>Niche / Focus</Label><Input value={niche} onChange={setNiche} placeholder="e.g. AI & Tech, Home Office, Fitness..." T={T} /></Card>
      <Btn onClick={research} disabled={loading} variant="success" T={T}>{loading ? "Researching products..." : "🛒 Find Winning Products"}</Btn>
      <OutputBox text={out} label="Product Research Report" color="green" T={T} />
    </div>
  );
}

// ─── AGENT 09: DROPSHIP OPERATIONS ───────────────────────────────────────────
function DropshipAgent({ T, config, log }) {
  const OUTPUT_TYPES = [
    { id: "supplier", label: "Find Supplier" }, { id: "margins", label: "Calculate Margins" },
    { id: "outreach", label: "Supplier Outreach" }, { id: "fulfillment", label: "Fulfillment Plan" },
  ];
  const [outputType, setOutputType] = useState("supplier");
  const [productName, setProductName] = useState("");
  const [sourcePrice, setSourcePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const run = async () => {
    if (!productName.trim()) return;
    setLoading(true); setOut("");
    log("dropship", `Running ${outputType} for "${productName}"...`);

    const prompts = {
      supplier: `You are a dropshipping sourcing expert. Find the best suppliers for "${productName}" for a Shopify dropshipping store.\n\nProvide:\n1. TOP 3 ALIEXPRESS SUPPLIERS — search terms, what to look for, red flags to avoid\n2. CJ DROPSHIPPING — how to find this product, what to look for\n3. ZENDROP — is this product available, alternatives\n4. QUALITY CHECKLIST — 5 things to verify before ordering samples\n5. SAMPLE ORDER STRATEGY — how to test before scaling\n6. NEGOTIATION TIPS — how to get better pricing at volume`,
      margins: `Calculate complete profit margins for a Shopify dropshipping store selling "${productName}".\n\nSource price: $${sourcePrice || "unknown — estimate"}\nSell price: $${sellPrice || "unknown — recommend"}\n\nCalculate:\n1. RECOMMENDED SELL PRICE — based on market research\n2. GROSS MARGIN — after product cost\n3. SHOPIFY FEES — transaction + subscription per unit\n4. SHIPPING COST — estimate for US delivery\n5. AD COST ESTIMATE — typical CAC for this product type\n6. NET PROFIT PER SALE — real take-home\n7. BREAK EVEN POINT — units needed per month\n8. MONTHLY REVENUE TARGETS — at 10, 50, 100 sales/day\n9. VERDICT — is this worth selling? Why?`,
      outreach: `Write a professional supplier outreach message for "${productName}" on AliExpress/Alibaba.\n\nWrite 2 versions:\n\nVERSION 1 — INITIAL CONTACT:\n[Professional message introducing yourself, asking about MOQ, pricing tiers, shipping times, customization options, and sample policy. 150 words max.]\n\nVERSION 2 — NEGOTIATION (after initial contact):\n[Follow-up message negotiating better pricing, faster shipping, or custom packaging. Reference being a serious buyer. 100 words max.]`,
      fulfillment: `Create a complete fulfillment operations plan for a Shopify dropshipping store selling "${productName}".\n\nInclude:\n1. ORDER PROCESSING FLOW — step by step from customer order to delivery\n2. SHIPPING TIMELINE — realistic expectations for US customers\n3. TRACKING SETUP — how to provide tracking to customers\n4. RETURN POLICY — recommended policy for dropshipping\n5. CUSTOMER SERVICE TEMPLATES — 3 email templates (order confirm, shipping update, delivery confirm)\n6. PROBLEM SCENARIOS — what to do when: item lost, customer unhappy, wrong item sent\n7. AUTOMATION TOOLS — apps to automate fulfillment on Shopify`,
    };

    const result = await callClaude(prompts[outputType]).catch(() => "Error.");
    setOut(result);
    log("dropship", `${outputType} complete for "${productName}"`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="blue" T={T} />
      <Card T={T}><Label T={T}>Operation Type</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{OUTPUT_TYPES.map(o => <Chip key={o.id} label={o.label} active={outputType === o.id} onClick={() => setOutputType(o.id)} color="blue" T={T} />)}</div></Card>
      <Card T={T}>
        <Label T={T}>Product Name</Label>
        <Input value={productName} onChange={setProductName} placeholder="e.g. LED Desk Lamp with Wireless Charger" T={T} />
        {outputType === "margins" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Source Price ($)</div><Input value={sourcePrice} onChange={setSourcePrice} placeholder="e.g. 8.50" T={T} /></div>
            <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Sell Price ($)</div><Input value={sellPrice} onChange={setSellPrice} placeholder="e.g. 34.99" T={T} /></div>
          </div>
        )}
      </Card>
      <Btn onClick={run} disabled={loading || !productName.trim()} variant="blue" T={T}>{loading ? "Running..." : "📦 Execute Dropship Agent"}</Btn>
      <OutputBox text={out} label="Dropship Operations" color="blue" T={T} />
    </div>
  );
}

// ─── AGENT 10: STORE COPY ────────────────────────────────────────────────────
function StoreCopyAgent({ T, config, log }) {
  const COPY_TYPES = [
    { id: "product", label: "Product Listing" }, { id: "ads", label: "Ad Copy" },
    { id: "email", label: "Email Sequence" }, { id: "homepage", label: "Homepage Copy" },
    { id: "collection", label: "Collection Page" }, { id: "abandon", label: "Abandoned Cart" },
  ];
  const [copyType, setCopyType] = useState("product");
  const [productName, setProductName] = useState("");
  const [productBenefits, setProductBenefits] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  const generate = async () => {
    if (!productName.trim()) return;
    setLoading(true); setOut("");
    log("storecopy", `Generating ${copyType} copy for "${productName}"...`);

    const prompts = {
      product: `Write a complete Shopify product listing for "${productName}" priced at $${price || "TBD"}.\n\nTarget audience: ${targetAudience || "general consumer"}\nKey benefits: ${productBenefits || "not specified — infer from product name"}\n\nProvide:\nPRODUCT TITLE: [SEO-optimized, benefit-driven, max 70 chars]\nSHORT DESCRIPTION: [2-sentence hook for above the fold, benefit-focused]\nFULL DESCRIPTION:\n[HTML-friendly description with: hook paragraph, 5 bullet benefits, how it works, who it's for, guarantee/risk reversal, CTA]\nSEO META TITLE: [max 60 chars]\nSEO META DESCRIPTION: [max 160 chars]\nALT TEXT: [for product image]\nTAGS: [10 Shopify tags]`,

      ads: `Write complete ad copy for "${productName}" priced at $${price || "TBD"} for a Shopify dropshipping store.\n\nTarget: ${targetAudience || "general consumer"}\nBenefits: ${productBenefits || "infer from product"}\n\nWrite:\nTIKTOK AD SCRIPT (30 seconds):\n[Hook + Problem + Solution + CTA]\n\nFACEBOOK/INSTAGRAM AD:\nHeadline: [max 40 chars]\nPrimary text: [125 chars]\nDescription: [max 30 chars]\n\nGOOGLE AD:\nHeadline 1-3: [30 chars each]\nDescription 1-2: [90 chars each]\n\nEMAIL SUBJECT LINES: [5 options for promotional email]`,

      email: `Write a 3-email welcome sequence for customers who buy "${productName}" from a Shopify store.\n\nEMAIL 1 — ORDER CONFIRMATION (sent immediately):\nSubject: [exciting, confirms order]\nBody: [thank you, order details, what to expect, support info]\n\nEMAIL 2 — SHIPPING UPDATE (sent when shipped):\nSubject: [creates excitement]\nBody: [shipping confirmed, tracking, build anticipation]\n\nEMAIL 3 — DELIVERY + UPSELL (sent after delivery):\nSubject: [check-in]\nBody: [hope they love it, ask for review, suggest related product, discount code for next order]`,

      homepage: `Write complete homepage copy for a Shopify dropshipping store selling "${productName}" and similar products.\n\nHERO SECTION:\nHeadline: [bold, benefit-driven, max 8 words]\nSubheadline: [expands on headline, max 15 words]\nCTA Button: [action text]\n\nTRUST BAR: [5 trust signals — shipping, returns, guarantee, reviews, security]\n\nFEATURED SECTION HEADLINE: [for product showcase]\n\nABOUT US: [3 sentences — brand story, mission, why choose us]\n\nFAQ SECTION: [5 common questions and answers]\n\nFOOTER TAGLINE: [memorable, max 10 words]`,

      collection: `Write collection page copy for a Shopify store. Collection: "${productName || "Best Sellers"}"\n\nCOLLECTION TITLE: [SEO friendly]\nCOLLECTION DESCRIPTION: [150 words — what's in this collection, who it's for, key benefits, buying guide]\nSEO META TITLE: [max 60 chars]\nSEO META DESCRIPTION: [max 160 chars]\nFILTER SUGGESTIONS: [5 filter options to add]\nSORTING RECOMMENDATION: [default sort order and why]`,

      abandon: `Write a 3-message abandoned cart recovery sequence for a Shopify store selling "${productName}" at $${price || "TBD"}.\n\nMESSAGE 1 — EMAIL (1 hour after abandon):\nSubject: [gentle reminder, no discount]\nBody: [friendly reminder, what they left, easy return to cart]\n\nMESSAGE 2 — EMAIL (24 hours after abandon):\nSubject: [create urgency]\nBody: [remind of benefits, add social proof, offer 10% discount]\n\nMESSAGE 3 — SMS (48 hours after abandon):\n[Short, punchy, include link, max 160 chars, include 15% final offer]`,
    };

    const result = await callClaude(prompts[copyType]).catch(() => "Error.");
    setOut(result);
    log("storecopy", `${copyType} copy generated for "${productName}"`);
    setLoading(false);
  };

  return (
    <div>
      <LoadingBar loading={loading} color="purple" T={T} />
      <Card T={T}><Label T={T}>Copy Type</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{COPY_TYPES.map(c => <Chip key={c.id} label={c.label} active={copyType === c.id} onClick={() => setCopyType(c.id)} color="purple" T={T} />)}</div></Card>
      <Card T={T}>
        <Label T={T}>Product Details</Label>
        <div style={{ display: "grid", gap: 10 }}>
          <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Product Name *</div><Input value={productName} onChange={setProductName} placeholder="e.g. Magnetic Phone Mount with Wireless Charging" T={T} /></div>
          {["product","ads","email","abandon"].includes(copyType) && <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Price ($)</div><Input value={price} onChange={setPrice} placeholder="e.g. 29.99" T={T} /></div>}
          <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Target Audience</div><Input value={targetAudience} onChange={setTargetAudience} placeholder="e.g. Remote workers, car enthusiasts, busy moms..." T={T} /></div>
          <div><div style={{ fontSize: 12, color: T.text2, marginBottom: 5 }}>Key Benefits</div><Input value={productBenefits} onChange={setProductBenefits} placeholder="e.g. saves time, wireless, fast charging, universal fit..." T={T} /></div>
        </div>
      </Card>
      <Btn onClick={generate} disabled={loading || !productName.trim()} variant="purple" T={T}>{loading ? "Writing copy..." : "✍ Generate Store Copy"}</Btn>
      <OutputBox text={out} label="Store Copy Output" color="purple" T={T} />
    </div>
  );
}


// ─── LOGS PAGE ───────────────────────────────────────────────────────────────
function LogsPage({ T, allAgents }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [agentMemory, setAgentMemory] = useState("");
  const [memoryLoading, setMemoryLoading] = useState(false);
  const PER_PAGE = 20;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/activity_logs?order=created_at.desc&limit=200`,
        { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await r.json();
      setLogs(Array.isArray(data) ? data.map(d => ({
        id: d.id,
        agentId: d.agent_id,
        msg: d.message,
        detail: d.detail || d.message,
        inputData: d.input_data || "",
        outputData: d.output_data || "",
        durationMs: d.duration_ms,
        status: d.status || "success",
        time: new Date(d.created_at).toLocaleTimeString("en", { hour12: false }),
        date: new Date(d.created_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }),
        timestamp: d.created_at,
      })) : []);
    } catch (e) { setLogs([]); }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter(l => {
    const matchAgent = filter === "all" || l.agentId === filter;
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSearch = !search || l.msg?.toLowerCase().includes(search.toLowerCase()) || l.detail?.toLowerCase().includes(search.toLowerCase()) || l.agentId?.toLowerCase().includes(search.toLowerCase());
    return matchAgent && matchStatus && matchSearch;
  });

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const generateMemory = async (log) => {
    setMemoryLoading(true);
    const agent = allAgents.find(a => a.id === log.agentId);
    const result = await callClaude(`You are analyzing a task log entry for an AI agent system called Apex Empire.

Agent: ${agent?.label || log.agentId}
Task: ${log.msg}
Detail: ${log.detail}
Input: ${log.inputData || "not recorded"}
Output preview: ${log.outputData || "not recorded"}
Status: ${log.status}
Duration: ${log.durationMs ? `${(log.durationMs/1000).toFixed(1)}s` : "not recorded"}
Timestamp: ${log.timestamp}

Provide a structured analysis:

WHAT WAS DONE:
[2-3 sentences describing exactly what the agent did]

WHAT WAS LEARNED:
[Key insights or patterns from this task that could help future runs]

WHAT WORKED WELL:
[What succeeded in this task]

RECOMMENDATIONS FOR NEXT TIME:
[Specific improvements the agent should make next time it runs a similar task]

RELATED TASKS TO RUN NEXT:
[2-3 suggested follow-up tasks that would build on this work]`).catch(() => "Error generating memory.");
    setAgentMemory(result);
    setMemoryLoading(false);
  };

  const clearLogs = async () => {
    if (!window.confirm("Clear all logs? This cannot be undone.")) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/activity_logs?id=gte.0`, {
        method: "DELETE",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
      });
      setLogs([]);
      setSelectedLog(null);
    } catch (e) {}
  };

  const todayCount = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
  const successCount = logs.filter(l => l.status === "success").length;
  const errorCount = logs.filter(l => l.status === "error").length;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Total Logs", value: logs.length, color: "accent" },
          { label: "Today", value: todayCount, color: "green" },
          { label: "Successful", value: successCount, color: "blue" },
          { label: "Errors", value: errorCount, color: "red" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 80, padding: "14px 16px", borderRadius: 10, background: T[(s.color) + "Bg"] || T.bg2, border: `1px solid ${T[s.color]}22` }}>
            <div style={{ fontSize: 11, color: T.text2, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T[s.color] }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedLog ? "1fr 380px" : "1fr", gap: 16 }}>
        {/* LEFT — log list */}
        <div>
          {/* Filters */}
          <Card T={T} style={{ padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search logs..."
                style={{ flex: 1, minWidth: 140, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg, color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
              <button onClick={fetchLogs} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg3, color: T.text2, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↻</button>
              <button onClick={clearLogs} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.red}44`, background: T.redBg, color: T.red, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Clear</button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {["all","success","error"].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${statusFilter === s ? T.accent : T.border}`, background: statusFilter === s ? T.accentBg : "transparent", color: statusFilter === s ? T.accent : T.text2, cursor: "pointer", fontSize: 11, fontFamily: "inherit", textTransform: "capitalize" }}>{s}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => { setFilter("all"); setPage(0); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${filter === "all" ? T.accent : T.border}`, background: filter === "all" ? T.accentBg : "transparent", color: filter === "all" ? T.accent : T.text2, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>All Agents</button>
              {allAgents.filter(a => a.id !== "logs").map(a => {
                const c = T[a.color] || T.accent;
                const count = logs.filter(l => l.agentId === a.id).length;
                if (count === 0) return null;
                return (
                  <button key={a.id} onClick={() => { setFilter(a.id); setPage(0); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${filter === a.id ? c : T.border}`, background: filter === a.id ? T[(a.color)+"Bg"] || T.accentBg : "transparent", color: filter === a.id ? c : T.text2, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
                    {a.icon} {a.label} ({count})
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Log list */}
          <div style={{ borderRadius: 10, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 70px 1fr 60px", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.bg3 }}>
              {["Timestamp","Agent","Activity","Duration"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</span>
              ))}
            </div>
            {loading && <div style={{ padding: 32, textAlign: "center", color: T.text2 }}>Loading logs...</div>}
            {!loading && paginated.length === 0 && <div style={{ padding: 32, textAlign: "center", color: T.text2 }}>No logs found{search ? ` for "${search}"` : ""}</div>}
            {!loading && paginated.map((log, i) => {
              const agent = allAgents.find(a => a.id === log.agentId);
              const c = T[agent?.color] || T.text2;
              const isSelected = selectedLog?.id === log.id;
              const isError = log.status === "error";
              return (
                <div key={log.id} onClick={() => { setSelectedLog(isSelected ? null : log); setAgentMemory(""); }}
                  style={{ display: "grid", gridTemplateColumns: "140px 70px 1fr 60px", padding: "12px 16px", borderBottom: i < paginated.length - 1 ? `1px solid ${T.border}` : "none", background: isSelected ? T.accentBg : isError ? T.redBg : i % 2 === 0 ? T.bg2 : T.bg, cursor: "pointer", transition: "background 0.15s", alignItems: "center", borderLeft: isSelected ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                  <div>
                    <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{log.time}</div>
                    <div style={{ fontSize: 10, color: T.text3 }}>{log.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 13 }}>{agent?.icon || "◈"}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: c }}>{agent?.label || log.agentId}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: isError ? T.red : T.text, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.msg}</div>
                    {log.detail && log.detail !== log.msg && <div style={{ fontSize: 11, color: T.text2, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.detail}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: T.text3, textAlign: "right" }}>
                    {log.durationMs ? `${(log.durationMs/1000).toFixed(1)}s` : "—"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, alignItems: "center" }}>
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg2, color: page===0?T.text3:T.text, cursor: page===0?"not-allowed":"pointer", fontFamily: "inherit", fontSize: 13 }}>← Prev</button>
              <span style={{ fontSize: 13, color: T.text2 }}>Page {page+1} of {totalPages} ({filtered.length} entries)</span>
              <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page>=totalPages-1} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border2}`, background: T.bg2, color: page>=totalPages-1?T.text3:T.text, cursor: page>=totalPages-1?"not-allowed":"pointer", fontFamily: "inherit", fontSize: 13 }}>Next →</button>
            </div>
          )}
        </div>

        {/* RIGHT — detail panel */}
        {selectedLog && (() => {
          const agent = allAgents.find(a => a.id === selectedLog.agentId);
          const c = T[agent?.color] || T.accent;
          return (
            <div>
              <Card T={T} style={{ position: "sticky", top: 80, padding: 0, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, background: T[(agent?.color)+"Bg"] || T.accentBg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{agent?.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{agent?.label} Agent</div>
                      <div style={{ fontSize: 10, color: T.text2 }}>{selectedLog.date} at {selectedLog.time}</div>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedLog(null); setAgentMemory(""); }} style={{ background: "none", border: "none", color: T.text2, cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>

                <div style={{ padding: 16, overflowY: "auto", maxHeight: "70vh" }}>
                  {/* Status + Duration */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <Badge color={selectedLog.status === "success" ? "green" : "red"} T={T}>{selectedLog.status === "success" ? "✓ Success" : "✗ Error"}</Badge>
                    {selectedLog.durationMs && <Badge color="blue" T={T}>⏱ {(selectedLog.durationMs/1000).toFixed(1)}s</Badge>}
                  </div>

                  {/* Task */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Task</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.5 }}>{selectedLog.msg}</div>
                  </div>

                  {/* Detail */}
                  {selectedLog.detail && selectedLog.detail !== selectedLog.msg && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Description</div>
                      <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.6 }}>{selectedLog.detail}</div>
                    </div>
                  )}

                  {/* Input */}
                  {selectedLog.inputData && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Input</div>
                      <div style={{ fontSize: 12, color: T.text2, background: T.bg3, padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, maxHeight: 120, overflowY: "auto" }}>{selectedLog.inputData}</div>
                    </div>
                  )}

                  {/* Output preview */}
                  {selectedLog.outputData && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Output Preview</div>
                      <div style={{ fontSize: 12, color: T.text, background: T.bg3, padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, maxHeight: 150, overflowY: "auto" }}>{selectedLog.outputData}</div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Full Timestamp</div>
                    <div style={{ fontSize: 12, color: T.text3, fontFamily: "monospace" }}>{selectedLog.timestamp}</div>
                  </div>

                  {/* Agent Memory button */}
                  <button onClick={() => generateMemory(selectedLog)} disabled={memoryLoading} style={{
                    width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${c}`,
                    background: T[(agent?.color)+"Bg"] || T.accentBg, color: c,
                    fontSize: 13, fontWeight: 600, cursor: memoryLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit", marginBottom: 12, transition: "all 0.15s",
                  }}>
                    {memoryLoading ? "🧠 Analyzing..." : "🧠 Generate Agent Memory"}
                  </button>

                  {/* Memory output */}
                  {agentMemory && (
                    <div style={{ borderRadius: 8, border: `1px solid ${c}33`, background: T.bg3, overflow: "hidden" }}>
                      <div style={{ padding: "8px 12px", borderBottom: `1px solid ${c}22`, fontSize: 11, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: 1 }}>🧠 Agent Memory Analysis</div>
                      <div style={{ padding: 12, fontSize: 12, color: T.text2, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>{agentMemory}</div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function AgentEmpire() {
  const [darkMode, setDarkMode] = useState(true);
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [active, setActive] = useState("cmd");
  const [genContent, setGenContent] = useState("");
  const [genTopic, setGenTopic] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [config, setConfig] = useState({ niche: "AI & Make Money Online", brandVoice: "hype" });
  const [activityLog, pushLog] = useActivityLog();
  const [showLog, setShowLog] = useState(false);

  const T = darkMode ? dark : light;

  useEffect(() => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      input::placeholder, textarea::placeholder { color: ${T.text3}; }
      input:focus, textarea:focus { border-color: ${T.accent} !important; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 4px; }
      .mobile-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
      @media (max-width: 768px) {
        .desktop-only { display: none !important; }
        .mobile-bottom-nav { display: flex !important; }
      }
      @media (min-width: 769px) {
        .mobile-bottom-nav { display: none !important; }
      }
    `;
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [darkMode]);

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem("ae_token");
    const email = localStorage.getItem("ae_email");
    if (token && email) {
      supabaseGetUser(token).then(user => {
        if (user.id) { setSession(token); setUserEmail(email); }
        else { localStorage.removeItem("ae_token"); localStorage.removeItem("ae_email"); }
      });
    }
  }, []);

  // Backend status
  useEffect(() => {
    fetch(BACKEND).then(r => r.json()).then(() => setBackendStatus("online")).catch(() => setBackendStatus("offline"));
  }, []);

  const handleLogin = (token, email) => { setSession(token); setUserEmail(email); };
  const handleLogout = async () => {
    const token = session;
    localStorage.removeItem("ae_token");
    localStorage.removeItem("ae_email");
    setSession(null);
    setUserEmail("");
    await supabaseSignOut(token);
  };
  const handleGenerated = useCallback((content, topic) => { setGenContent(content); setGenTopic(topic); }, []);

  if (!session) return <LoginPage T={T} darkMode={darkMode} setDarkMode={setDarkMode} onLogin={handleLogin} />;

  const activeMeta = AGENTS_META.find(a => a.id === active);
  const accentColor = T[activeMeta?.color] || T.accent;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", paddingBottom: isMobile ? 64 : 0 }}>

      {/* TOP NAV */}
      <div style={{ height: 56, borderBottom: `1px solid ${T.border}`, background: T.bg2, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, position: "sticky", top: 0, zIndex: 50, boxShadow: T.shadow }}>
        {/* Hamburger */}
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", color: T.text2, cursor: "pointer", fontSize: 18, padding: 4, flexShrink: 0 }}>☰</button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⌘</div>
          {!isMobile && <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Agent Empire</span>}
        </div>

        {/* Desktop agent tabs */}
        {!isMobile && (
          <div style={{ flex: 1, display: "flex", gap: 2, overflowX: "auto", padding: "0 4px" }}>
            {AGENTS_META.map(a => {
              const c = T[a.color] || T.accent;
              return (
                <button key={a.id} onClick={() => setActive(a.id)} style={{
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500,
                  border: "none", background: active === a.id ? T[a.color + "Bg"] || T.accentBg : "transparent",
                  color: active === a.id ? c : T.text2, whiteSpace: "nowrap",
                  transition: "all 0.15s", fontFamily: "inherit",
                }}>
                  {a.icon} {a.label}
                  {a.id === "publishing" && genContent && active !== "publishing" && (
                    <span style={{ marginLeft: 5, background: T.blue, color: "#fff", borderRadius: 10, padding: "1px 5px", fontSize: 9 }}>New</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile: current agent name */}
        {isMobile && (
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{activeMeta?.icon} {activeMeta?.label}</span>
          </div>
        )}

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: backendStatus === "online" ? T.green : T.red }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: backendStatus === "online" ? T.green : T.red }} />
            {!isMobile && (backendStatus === "online" ? "Live" : "Offline")}
          </div>
          {!isMobile && <button onClick={() => setShowLog(s => !s)} style={{ padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, border: `1px solid ${T.border2}`, background: showLog ? T.accentBg : "transparent", color: showLog ? T.accent : T.text2, fontFamily: "inherit" }}>Log</button>}
          <button onClick={() => setDarkMode(d => !d)} style={{ padding: "5px 8px", borderRadius: 8, cursor: "pointer", fontSize: 14, border: `1px solid ${T.border2}`, background: "transparent", color: T.text2 }}>{darkMode ? "☀️" : "🌙"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 8, borderLeft: `1px solid ${T.border}` }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.accent, fontWeight: 700 }}>{userEmail[0]?.toUpperCase()}</div>
            {!isMobile && <button onClick={handleLogout} style={{ fontSize: 12, color: T.text2, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {/* SIDEBAR OVERLAY on mobile */}
        {sidebarOpen && isMobile && (
          <div className="mobile-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div style={{
            width: 220, borderRight: `1px solid ${T.border}`, background: T.bg2,
            padding: "16px 12px", flexShrink: 0, overflowY: "auto",
            position: isMobile ? "fixed" : "relative",
            top: isMobile ? 56 : 0, left: 0,
            height: isMobile ? "calc(100vh - 56px)" : "auto",
            zIndex: isMobile ? 45 : 1,
            boxShadow: isMobile ? T.shadow3 : "none",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, padding: "0 8px" }}>Agents</div>
            {AGENTS_META.map(a => {
              const c = T[a.color] || T.accent;
              return (
                <button key={a.id} onClick={() => { setActive(a.id); if (isMobile) setSidebarOpen(false); }} style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                  border: "none", background: active === a.id ? T[a.color + "Bg"] || T.accentBg : "transparent",
                  color: active === a.id ? c : T.text2, marginBottom: 2, display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s", fontFamily: "inherit", fontSize: 14, fontWeight: active === a.id ? 600 : 400,
                }}>
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <span>{a.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: T.text3 }}>{a.num}</span>
                </button>
              );
            })}
            <div style={{ height: 1, background: T.border, margin: "16px 8px" }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, padding: "0 8px" }}>Settings</div>
            <div style={{ padding: "4px 8px" }}>
              <div style={{ fontSize: 12, color: T.text2, marginBottom: 6 }}>Niche</div>
              <Input value={config.niche} onChange={v => setConfig(c => ({ ...c, niche: v }))} T={T} />
            </div>
            {isMobile && (
              <div style={{ padding: "16px 8px 0" }}>
                <button onClick={handleLogout} style={{ fontSize: 13, color: T.red, background: T.redBg, border: `1px solid ${T.red}33`, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Sign out</button>
              </div>
            )}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", minWidth: 0 }}>
          <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px" }}>
            {/* Agent header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 16 : 24 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: T[(activeMeta?.color || "accent") + "Bg"] || T.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{activeMeta?.icon}</div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: T.text, margin: 0 }}>{activeMeta?.label} Agent</h1>
                <p style={{ fontSize: 12, color: T.text2, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Agent {activeMeta?.num} — {config.niche}</p>
              </div>
              <Badge color={activeMeta?.color} T={T}>{activeMeta?.num}</Badge>
            </div>

            {active === "cmd"        && <CommandAgent T={T} config={config} log={pushLog} allAgents={AGENTS_META} isMobile={isMobile} />}
            {active === "content"    && <ContentAgent T={T} config={config} log={pushLog} onGenerated={handleGenerated} />}
            {active === "publishing" && <PublishingAgent T={T} config={config} log={pushLog} incoming={genContent} incomingTopic={genTopic} />}
            {active === "research"   && <ResearchAgent T={T} config={config} log={pushLog} />}
            {active === "scheduler"  && <SchedulerAgent T={T} config={config} log={pushLog} />}
            {active === "revenue"    && <RevenueAgent T={T} config={config} log={pushLog} />}
            {active === "etsy"       && <EtsyAgent T={T} config={config} log={pushLog} />}
            {active === "fiverr"     && <FiverrAgent T={T} config={config} log={pushLog} />}
            {active === "shopify"    && <ShopifyProductAgent T={T} config={config} log={pushLog} />}
            {active === "dropship"   && <DropshipAgent T={T} config={config} log={pushLog} />}
            {active === "storecopy"  && <StoreCopyAgent T={T} config={config} log={pushLog} />}
            {active === "shopify_mgr" && <ShopifyManagerAgent T={T} config={config} log={pushLog} />}
            {active === "logs"       && <LogsPage T={T} allAgents={AGENTS_META} />}
          </div>

          {/* Activity log panel — desktop only */}
          {showLog && !isMobile && (
            <div style={{ width: 260, borderLeft: `1px solid ${T.border}`, background: T.bg2, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 13, fontWeight: 600, color: T.text }}>Activity Log</div>
              <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                {activityLog.length === 0 && <div style={{ fontSize: 13, color: T.text2, textAlign: "center", marginTop: 20 }}>No activity yet</div>}
                {activityLog.map(entry => {
                  const agent = AGENTS_META.find(a => a.id === entry.agentId);
                  return (
                    <div key={entry.id} style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: T[agent?.color] || T.accent }}>{agent?.icon} {agent?.label}</span>
                        <span style={{ fontSize: 10, color: T.text3 }}>{entry.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.4 }}>{entry.msg}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
          background: T.bg2, borderTop: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-around",
          padding: "0 4px", zIndex: 50, boxShadow: `0 -4px 12px rgba(0,0,0,0.1)`,
        }}>
          {AGENTS_META.slice(0, 5).map(a => {
            const c = T[a.color] || T.accent;
            const isActive = active === a.id;
            return (
              <button key={a.id} onClick={() => setActive(a.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "6px 8px", borderRadius: 10, border: "none", background: "transparent",
                color: isActive ? c : T.text3, cursor: "pointer", minWidth: 48, flex: 1,
                fontFamily: "inherit",
              }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, color: isActive ? c : T.text3 }}>{a.label}</span>
                {isActive && <div style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />}
              </button>
            );
          })}
          {/* More button for remaining agents */}
          <button onClick={() => setSidebarOpen(s => !s)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 8px", borderRadius: 10, border: "none", background: "transparent",
            color: T.text3, cursor: "pointer", minWidth: 48, flex: 1, fontFamily: "inherit",
          }}>
            <span style={{ fontSize: 18 }}>⋯</span>
            <span style={{ fontSize: 9, fontWeight: 400 }}>More</span>
          </button>
        </div>
      )}
    </div>
  );
}
