import { useState, useCallback, useEffect } from "react";

const BACKEND = "https://agent-empire-backend-production.up.railway.app";

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "twitter", label: "X / Twitter", icon: "𝕏" },
];

const CONTENT_TYPES = [
  { id: "hook", label: "🔥 Viral Hook" },
  { id: "script", label: "🎬 Full Script" },
  { id: "caption", label: "✍️ Caption + Hashtags" },
  { id: "series", label: "🧵 Content Series" },
];

const TONES = [
  { id: "hype", label: "🔥 Hype" },
  { id: "educational", label: "🎓 Educational" },
  { id: "controversial", label: "⚡ Controversial" },
  { id: "story", label: "📖 Story" },
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

const RESEARCH_CATEGORIES = [
  { id: "trending", label: "🔥 Trending Now", desc: "Viral topics this week" },
  { id: "hooks", label: "🎣 Hook Formulas", desc: "Proven scroll-stoppers" },
  { id: "competitors", label: "👀 Competitor Intel", desc: "What's working in niche" },
  { id: "monetization", label: "💰 Monetization Angles", desc: "Revenue-focused ideas" },
];

const SECOND_CHANNEL_STYLES = [
  { id: "beginner", label: "🟢 Beginner Friendly", desc: "Simpler, more explanation" },
  { id: "advanced", label: "🔵 Advanced / Pro", desc: "Deep tactics, no hand-holding" },
  { id: "faceless", label: "🎭 Faceless Brand", desc: "Anonymous, system-focused" },
  { id: "spanish", label: "🌎 Spanish Audience", desc: "Translate + culturally adapt" },
];

const AD_PLATFORMS = [
  { id: "tiktok", label: "TikTok Ads", icon: "🎵", color: "#a78bfa" },
  { id: "meta", label: "Meta Ads", icon: "📘", color: "#60a5fa" },
  { id: "google", label: "Google Ads", icon: "🔍", color: "#34d399" },
  { id: "youtube", label: "YouTube Ads", icon: "▶️", color: "#f87171" },
];

const AGENTS = [
  { id: "content", label: "⚡ Content", color: "#a78bfa" },
  { id: "publishing", label: "🔄 Publishing", color: "#60a5fa" },
  { id: "research", label: "🔍 Research", color: "#34d399" },
  { id: "scheduler", label: "📅 Scheduler", color: "#fbbf24" },
  { id: "revenue", label: "💰 Revenue", color: "#f87171" },
];

const C = {
  app: { minHeight: "100vh", background: "#060609", color: "#e5e7eb", fontFamily: "'Inter', sans-serif", padding: "20px 16px" },
  wrap: { maxWidth: 800, margin: "0 auto" },
  hrow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 4 },
  logo: { width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6d28d9, #0369a1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 },
  h1: { margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sub: { margin: 0, fontSize: 12, color: "#374151" },
  pipeline: { display: "flex", alignItems: "center", gap: 4, padding: "10px 14px", borderRadius: 10, background: "#0a0a12", border: "1px solid #111827", marginBottom: 24, overflowX: "auto", marginTop: 20 },
  pstep: (a) => ({ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, background: a ? "#1e1b4b" : "transparent", color: a ? "#a78bfa" : "#1f2937", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s" }),
  parr: { color: "#111827", fontSize: 12, flexShrink: 0 },
  tabs: { display: "flex", gap: 2, borderBottom: "1px solid #0f0f1a", marginBottom: 24 },
  tab: (a) => ({ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: a ? "#a78bfa" : "#374151", background: "none", border: "none", borderBottom: a ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s", marginBottom: -1, whiteSpace: "nowrap" }),
  card: { borderRadius: 12, border: "1px solid #0f0f1a", background: "#0a0a12", padding: 18, marginBottom: 14 },
  lbl: { fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 10 },
  g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  g4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 },
  chip: (a, col) => ({ padding: "9px 8px", borderRadius: 9, border: a ? `2px solid ${col || "#7c3aed"}` : "2px solid #0f0f1a", background: a ? "#12122a" : "#070710", color: a ? (col || "#a78bfa") : "#1f2937", cursor: "pointer", fontSize: 11, fontWeight: 600, textAlign: "center", transition: "all 0.15s" }),
  pill: (a) => ({ padding: "5px 11px", borderRadius: 20, border: a ? "1.5px solid #7c3aed" : "1.5px solid #0f0f1a", background: a ? "#12122a" : "#070710", color: a ? "#a78bfa" : "#1f2937", cursor: "pointer", fontSize: 11, fontWeight: 500, transition: "all 0.15s" }),
  inp: { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #0f0f1a", background: "#070710", color: "#e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" },
  ta: { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #0f0f1a", background: "#070710", color: "#e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 90, fontFamily: "inherit" },
  btn: (v) => ({ width: "100%", padding: "13px", borderRadius: 11, border: "none", background: v === "off" ? "#0f0f1a" : v === "green" ? "linear-gradient(135deg,#059669,#0d9488)" : v === "blue" ? "linear-gradient(135deg,#1d4ed8,#0891b2)" : v === "amber" ? "linear-gradient(135deg,#b45309,#d97706)" : v === "rose" ? "linear-gradient(135deg,#be123c,#9f1239)" : "linear-gradient(135deg,#7c3aed,#1d4ed8)", color: v === "off" ? "#1f2937" : "#fff", fontSize: 14, fontWeight: 700, cursor: v === "off" ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: 0.2 }),
  outbox: { borderRadius: 11, border: "1px solid #0f0f1a", background: "#040406", overflow: "hidden", marginTop: 14 },
  outh: { padding: "9px 14px", borderBottom: "1px solid #0f0f1a", display: "flex", justifyContent: "space-between", alignItems: "center" },
  outl: { fontSize: 10, fontWeight: 800, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1 },
  cpbtn: (c) => ({ padding: "4px 10px", borderRadius: 6, border: "1px solid #0f0f1a", background: c ? "#064e3b" : "#070710", color: c ? "#34d399" : "#374151", cursor: "pointer", fontSize: 11, fontWeight: 600 }),
  outb: { padding: 16, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.8, color: "#9ca3af" },
  badge: (col) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 5, background: col + "18", color: col, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }),
  statcard: (col) => ({ borderRadius: 12, border: `1px solid ${col}22`, background: col + "08", padding: "16px 18px", flex: 1 }),
  statnum: (col) => ({ fontSize: 26, fontWeight: 800, color: col, letterSpacing: "-1px", margin: "4px 0" }),
  statlbl: { fontSize: 11, color: "#374151", fontWeight: 600 },
  dayrow: (i) => ({ display: "grid", gridTemplateColumns: "90px 1fr", gap: 12, alignItems: "start", padding: "12px 0", borderBottom: i < 6 ? "1px solid #0a0a12" : "none" }),
  dayname: { fontSize: 12, fontWeight: 700, color: "#4b5563", paddingTop: 4 },
  postpill: (pl) => { const cols = { tiktok: "#a78bfa", youtube: "#f87171", instagram: "#f472b6", twitter: "#60a5fa" }; return { display: "inline-block", padding: "2px 8px", borderRadius: 5, background: (cols[pl] || "#6b7280") + "22", color: cols[pl] || "#6b7280", fontSize: 10, fontWeight: 700, marginRight: 4, marginBottom: 4 }; },
};

async function callClaude(prompt) {
  const r = await fetch(`${BACKEND}/api/content/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const d = await r.json();
  return d.content || "Error generating content.";
}

async function saveToBackend(endpoint, data) {
  try {
    await fetch(`${BACKEND}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  } catch (e) { console.error("Backend save failed:", e); }
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }, []);
  return [copied, copy];
}

function OutBox({ text, label, onCopy, copied }) {
  if (!text) return null;
  return (
    <div style={C.outbox}>
      <div style={C.outh}><span style={C.outl}>{label || "OUTPUT"}</span><button style={C.cpbtn(copied)} onClick={onCopy}>{copied ? "✓ Copied" : "Copy"}</button></div>
      <div style={C.outb}>{text}</div>
    </div>
  );
}

function ContentAgent({ onGenerated }) {
  const [platform, setPlatform] = useState("tiktok");
  const [type, setType] = useState("hook");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [custom, setCustom] = useState("");
  const [tone, setTone] = useState("hype");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [copied, copy] = useCopy();

  const generate = async () => {
    setLoading(true); setOut("");
    const t = custom.trim() || topic;
    const toneMap = { hype: "energetic and bold", educational: "clear and authoritative", controversial: "provocative and challenging", story: "personal and narrative" };
    const typeMap = { hook: `Write 3 viral opening hooks (1-2 sentences each, numbered) for ${platform} about "${t}".`, script: `Write a complete ${platform} video script about "${t}". Include [HOOK], [BODY], [CTA].`, caption: `Write a ${platform} caption about "${t}" with hook, value, CTA and 12 hashtags.`, series: `Write a 3-part content series (POST 1, 2, 3) about "${t}" for ${platform}.` };
    const prompt = `You are an elite social media content creator for AI & Make Money Online. Tone: ${toneMap[tone]}. ${typeMap[type]} Output ONLY the content.`;
    const result = await callClaude(prompt).catch(() => "Error. Try again.");
    setOut(result);
    onGenerated(result, t, platform);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={C.badge("#a78bfa")}>AGENT 1</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Content Creator</span>
      </div>
      <div style={C.card}><label style={C.lbl}>Platform</label><div style={C.g4}>{PLATFORMS.map(p => <button key={p.id} style={C.chip(platform === p.id)} onClick={() => setPlatform(p.id)}><div style={{ fontSize: 15, marginBottom: 2 }}>{p.icon}</div><div style={{ fontSize: 10 }}>{p.label}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Content Type</label><div style={C.g2}>{CONTENT_TYPES.map(c => <button key={c.id} style={{ ...C.chip(type === c.id), textAlign: "left", padding: "10px 12px" }} onClick={() => setType(c.id)}>{c.label}</button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Topic</label><div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>{TOPICS.map(t => <button key={t} style={C.pill(topic === t && !custom)} onClick={() => { setTopic(t); setCustom(""); }}>{t}</button>)}</div><input style={C.inp} value={custom} onChange={e => setCustom(e.target.value)} placeholder="Or type your own topic..." /></div>
      <div style={C.card}><label style={C.lbl}>Tone</label><div style={C.g4}>{TONES.map(t => <button key={t.id} style={C.chip(tone === t.id, "#059669")} onClick={() => setTone(t.id)}>{t.label}</button>)}</div></div>
      <button style={C.btn(loading ? "off" : "primary")} onClick={generate} disabled={loading}>{loading ? "⚡ Generating..." : "⚡ Generate Content"}</button>
      <OutBox text={out} copied={copied} onCopy={() => copy(out)} />
    </div>
  );
}

function PublishingAgent({ incoming, incomingTopic }) {
  const [manual, setManual] = useState("");
  const [style, setStyle] = useState("beginner");
  const [platform, setPlatform] = useState("tiktok");
  const [format, setFormat] = useState("hook");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [copied, copy] = useCopy();
  const content = incoming || manual;

  const transform = async () => {
    if (!content.trim()) return;
    setLoading(true); setOut("");
    const styleMap = { beginner: "beginner-friendly — simple words, assume viewer knows nothing", advanced: "advanced tactical — skip basics, speak to experienced creators", faceless: "faceless brand — no personal pronouns, anonymous authority, system-focused", spanish: "fluent natural Spanish for Latin American audience — translate AND culturally adapt" };
    const fmtMap = { hook: "3 viral hooks (numbered, 1-2 sentences each)", script: "full video script with [HOOK], [BODY], [CTA]", caption: "post caption with hook, value, CTA and 10 hashtags", series: "3-part content series (POST 1, POST 2, POST 3)" };
    const prompt = `You are a content repurposing expert. Take this content and completely rewrite AND reformat it for a second channel.\n\nORIGINAL:\n${content}\n\nRewrite in style: ${styleMap[style]}\nReformat as: ${fmtMap[format]} for ${platform}\nMake it feel like a completely different piece. Same idea, different angle, different words.\nOutput ONLY the transformed content.`;
    const result = await callClaude(prompt).catch(() => "Error. Try again.");
    setOut(result);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={C.badge("#60a5fa")}>AGENT 2</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Publishing Agent</span>
        <span style={{ fontSize: 11, color: "#1f2937" }}>— Channel 2 repurposer</span>
      </div>
      <div style={C.card}>
        <label style={C.lbl}>Input Content</label>
        {incoming ? <div style={{ padding: "10px 13px", borderRadius: 9, background: "#040d1a", border: "1px solid #1e3a5f", fontSize: 12, color: "#60a5fa", lineHeight: 1.6 }}><div style={{ fontSize: 10, fontWeight: 800, color: "#1d4ed8", marginBottom: 5 }}>✓ AUTO-RECEIVED FROM AGENT 1 · {incomingTopic}</div>{incoming.slice(0, 220)}{incoming.length > 220 ? "..." : ""}</div>
          : <textarea style={C.ta} value={manual} onChange={e => setManual(e.target.value)} placeholder="Paste content from Agent 1, or generate above and it'll auto-fill..." />}
      </div>
      <div style={C.card}><label style={C.lbl}>Second Channel Style</label><div style={C.g2}>{SECOND_CHANNEL_STYLES.map(s => <button key={s.id} style={{ ...C.chip(style === s.id, "#1d4ed8"), textAlign: "left", padding: "10px 12px" }} onClick={() => setStyle(s.id)}><div style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</div><div style={{ fontSize: 10, marginTop: 2, color: style === s.id ? "#93c5fd" : "#1f2937" }}>{s.desc}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Target Platform</label><div style={C.g4}>{PLATFORMS.map(p => <button key={p.id} style={C.chip(platform === p.id, "#1d4ed8")} onClick={() => setPlatform(p.id)}><div style={{ fontSize: 15, marginBottom: 2 }}>{p.icon}</div><div style={{ fontSize: 10 }}>{p.label}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Output Format</label><div style={C.g2}>{CONTENT_TYPES.map(c => <button key={c.id} style={{ ...C.chip(format === c.id, "#1d4ed8"), textAlign: "left", padding: "10px 12px" }} onClick={() => setFormat(c.id)}>{c.label}</button>)}</div></div>
      <button style={C.btn(loading ? "off" : "blue")} onClick={transform} disabled={loading || !content.trim()}>{loading ? "🔄 Transforming..." : "🔄 Rewrite & Reformat for Channel 2"}</button>
      <OutBox text={out} label="CHANNEL 2 OUTPUT" copied={copied} onCopy={() => copy(out)} />
    </div>
  );
}

function ResearchAgent() {
  const [cat, setCat] = useState("trending");
  const [niche, setNiche] = useState("AI & Make Money Online");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");
  const [copied, copy] = useCopy();

  const research = async () => {
    setLoading(true); setOut("");
    const prompts = {
      trending: `Generate 8 trending content topics RIGHT NOW in the "${niche}" niche for TikTok & YouTube Shorts 2026. For each: topic title, why it's trending, a viral hook example, engagement potential (Low/Medium/High/Explosive).`,
      hooks: `Generate 12 proven hook formulas for "${niche}" working on TikTok & YouTube Shorts in 2026. For each: the formula, an example, and the psychological trigger used.`,
      competitors: `Analyze winning content strategies for top creators in "${niche}" in 2026. Give: 5 winning content angles, posting patterns, topics getting most engagement, and 3 content gaps.`,
      monetization: `Generate 8 content ideas for "${niche}" optimized for REVENUE. For each: content angle, monetization method, estimated revenue potential, and a hook.`,
    };
    const result = await callClaude(prompts[cat]).catch(() => "Error. Try again.");
    setOut(result);
    await saveToBackend("/api/research/save", { report: result, category: cat });
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={C.badge("#34d399")}>AGENT 3</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Research Agent</span>
        <span style={{ fontSize: 11, color: "#1f2937" }}>— Trends, hooks & intel</span>
      </div>
      <div style={C.card}><label style={C.lbl}>Research Type</label><div style={C.g2}>{RESEARCH_CATEGORIES.map(c => <button key={c.id} style={{ ...C.chip(cat === c.id, "#059669"), textAlign: "left", padding: "10px 12px" }} onClick={() => setCat(c.id)}><div style={{ fontSize: 12, fontWeight: 700 }}>{c.label}</div><div style={{ fontSize: 10, marginTop: 2, color: cat === c.id ? "#6ee7b7" : "#1f2937" }}>{c.desc}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Your Niche</label><input style={C.inp} value={niche} onChange={e => setNiche(e.target.value)} /></div>
      <button style={C.btn(loading ? "off" : "green")} onClick={research} disabled={loading}>{loading ? "🔍 Researching..." : "🔍 Run Research"}</button>
      <OutBox text={out} label="RESEARCH REPORT" copied={copied} onCopy={() => copy(out)} />
    </div>
  );
}

function SchedulerAgent() {
  const [niche, setNiche] = useState("AI & Make Money Online");
  const [ch1Platforms, setCh1Platforms] = useState(["tiktok", "youtube"]);
  const [ch2Platforms, setCh2Platforms] = useState(["instagram", "twitter"]);
  const [postsPerDay, setPostsPerDay] = useState("3");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [copied, copy] = useCopy();

  const togglePlatform = (list, setList, id) => setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const generate = async () => {
    setLoading(true); setSchedule(null);
    const prompt = `Create a 7-day posting schedule for TWO channels in the "${niche}" niche.\nChannel 1: ${ch1Platforms.join(", ")}\nChannel 2: ${ch2Platforms.join(", ")}\nPosts per day per channel: ${postsPerDay}\n\nFor EACH day format EXACTLY like:\nDAY: Monday\nTHEME: [theme]\nCH1: [platform] | [time] | [type] | [topic]\nCH2: [platform] | [time] | [type] | [topic]\n\nOutput ONLY the schedule.`;
    const raw = await callClaude(prompt).catch(() => null);
    if (!raw) { setLoading(false); return; }
    const days = [];
    const dayBlocks = raw.split(/DAY:/i).filter(b => b.trim());
    for (const block of dayBlocks) {
      const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
      const dayName = lines[0]?.trim();
      const themeLine = lines.find(l => l.startsWith("THEME:"));
      const theme = themeLine ? themeLine.replace("THEME:", "").trim() : "";
      const ch1Posts = lines.filter(l => l.startsWith("CH1:")).map(l => l.replace("CH1:", "").trim());
      const ch2Posts = lines.filter(l => l.startsWith("CH2:")).map(l => l.replace("CH2:", "").trim());
      if (dayName) days.push({ day: dayName, theme, ch1Posts, ch2Posts });
    }
    const parsed = days.length > 0 ? days : [{ day: "Week", theme: "See output", ch1Posts: [raw], ch2Posts: [] }];
    setSchedule(parsed);
    await saveToBackend("/api/scheduler/save", { schedule: parsed });
    setLoading(false);
  };

  const rawSchedule = schedule ? schedule.map(d => `${d.day} — ${d.theme}\nCH1: ${d.ch1Posts.join(" | ")}\nCH2: ${d.ch2Posts.join(" | ")}`).join("\n\n") : "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={C.badge("#fbbf24")}>AGENT 4</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Scheduler Agent</span>
        <span style={{ fontSize: 11, color: "#1f2937" }}>— 7-day posting calendar</span>
      </div>
      <div style={C.card}><label style={C.lbl}>Niche</label><input style={C.inp} value={niche} onChange={e => setNiche(e.target.value)} /></div>
      <div style={C.card}><label style={C.lbl}>Channel 1 Platforms</label><div style={C.g4}>{PLATFORMS.map(p => <button key={p.id} style={C.chip(ch1Platforms.includes(p.id), "#fbbf24")} onClick={() => togglePlatform(ch1Platforms, setCh1Platforms, p.id)}><div style={{ fontSize: 15, marginBottom: 2 }}>{p.icon}</div><div style={{ fontSize: 10 }}>{p.label}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Channel 2 Platforms</label><div style={C.g4}>{PLATFORMS.map(p => <button key={p.id} style={C.chip(ch2Platforms.includes(p.id), "#f97316")} onClick={() => togglePlatform(ch2Platforms, setCh2Platforms, p.id)}><div style={{ fontSize: 15, marginBottom: 2 }}>{p.icon}</div><div style={{ fontSize: 10 }}>{p.label}</div></button>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Posts Per Day</label><div style={{ display: "flex", gap: 8 }}>{["2", "3", "4", "5"].map(n => <button key={n} style={{ ...C.chip(postsPerDay === n, "#fbbf24"), flex: 1 }} onClick={() => setPostsPerDay(n)}>{n}x / day</button>)}</div></div>
      <button style={C.btn(loading ? "off" : "amber")} onClick={generate} disabled={loading}>{loading ? "📅 Building..." : "📅 Generate 7-Day Schedule"}</button>
      {schedule && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ ...C.lbl, marginBottom: 0 }}>YOUR WEEK</span>
            <button style={C.cpbtn(copied)} onClick={() => copy(rawSchedule)}>{copied ? "✓ Copied" : "Copy All"}</button>
          </div>
          <div style={{ borderRadius: 12, border: "1px solid #0f0f1a", background: "#040406", overflow: "hidden" }}>
            {schedule.map((d, i) => (
              <div key={i} style={C.dayrow(i)}>
                <div style={C.dayname}>{d.day}</div>
                <div>
                  <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>📌 {d.theme}</div>
                  {d.ch1Posts.map((p, j) => { const parts = p.split("|").map(x => x.trim()); return <div key={j} style={{ marginBottom: 3 }}><span style={C.postpill(parts[0]?.toLowerCase())}>CH1 · {parts[0]}</span><span style={{ fontSize: 11, color: "#4b5563" }}>{parts[1]} · {parts[2]} · </span><span style={{ fontSize: 11, color: "#6b7280" }}>{parts[3]}</span></div>; })}
                  {d.ch2Posts.map((p, j) => { const parts = p.split("|").map(x => x.trim()); return <div key={j} style={{ marginBottom: 3 }}><span style={{ ...C.postpill(parts[0]?.toLowerCase()), opacity: 0.7 }}>CH2 · {parts[0]}</span><span style={{ fontSize: 11, color: "#4b5563" }}>{parts[1]} · {parts[2]} · </span><span style={{ fontSize: 11, color: "#374151" }}>{parts[3]}</span></div>; })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RevenueAgent() {
  const [revenue, setRevenue] = useState({ paypal: "", tiktok: "", meta: "", google: "", youtube: "", affiliate: "", ugc: "" });
  const [adBudget, setAdBudget] = useState({ tiktok: "", meta: "", google: "", youtube: "" });
  const [adGoal, setAdGoal] = useState("scale");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [copied, copy] = useCopy();

  const upd = (setter, key, val) => setter(prev => ({ ...prev, [key]: val }));
  const totalRevenue = Object.values(revenue).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalAdSpend = Object.values(adBudget).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const netProfit = totalRevenue - totalAdSpend;
  const roas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : "—";

  const analyze = async () => {
    setLoading(true); setAnalysis("");
    const goalMap = { scale: "scale revenue aggressively", optimize: "optimize ROAS and cut waste", diversify: "diversify revenue streams", conserve: "grow organically" };
    const prompt = `You are a revenue and advertising strategy agent.\n\nREVENUE: PayPal $${revenue.paypal||0}, TikTok $${revenue.tiktok||0}, Meta $${revenue.meta||0}, Google $${revenue.google||0}, YouTube $${revenue.youtube||0}, Affiliate $${revenue.affiliate||0}, UGC $${revenue.ugc||0}. TOTAL: $${totalRevenue.toFixed(2)}\n\nAD SPEND: TikTok $${adBudget.tiktok||0}, Meta $${adBudget.meta||0}, Google $${adBudget.google||0}, YouTube $${adBudget.youtube||0}. TOTAL: $${totalAdSpend.toFixed(2)}\n\nNET PROFIT: $${netProfit.toFixed(2)} | ROAS: ${roas}x | GOAL: ${goalMap[adGoal]}\n\nProvide: 1) PROFIT ANALYSIS 2) AD STRATEGY with specific budget moves 3) REVENUE GAPS 4) NEXT 30 DAYS action plan 5) PAYPAL SETUP TIP. Be specific with numbers.`;
    const result = await callClaude(prompt).catch(() => "Error. Try again.");
    setAnalysis(result);
    await saveToBackend("/api/revenue/save", { revenue, adSpend: adBudget });
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={C.badge("#f87171")}>AGENT 5</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Revenue Agent</span>
        <span style={{ fontSize: 11, color: "#1f2937" }}>— Profit tracker & ad controller</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={C.statcard("#34d399")}><div style={C.statlbl}>Revenue</div><div style={C.statnum("#34d399")}>${totalRevenue.toFixed(0)}</div></div>
        <div style={C.statcard("#f87171")}><div style={C.statlbl}>Ad Spend</div><div style={C.statnum("#f87171")}>${totalAdSpend.toFixed(0)}</div></div>
        <div style={C.statcard(netProfit >= 0 ? "#60a5fa" : "#f97316")}><div style={C.statlbl}>Net Profit</div><div style={C.statnum(netProfit >= 0 ? "#60a5fa" : "#f97316")}>${netProfit.toFixed(0)}</div></div>
        <div style={C.statcard("#fbbf24")}><div style={C.statlbl}>ROAS</div><div style={C.statnum("#fbbf24")}>{roas}x</div></div>
      </div>
      <div style={C.card}><label style={C.lbl}>Monthly Revenue ($)</label><div style={C.g2}>{[["paypal","💳 PayPal"],["tiktok","🎵 TikTok"],["meta","📘 Meta"],["google","🔍 Google"],["youtube","▶️ YouTube"],["affiliate","🔗 Affiliate"],["ugc","🎬 UGC"]].map(([k,l]) => <div key={k}><div style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>{l}</div><input style={C.inp} type="number" placeholder="0.00" value={revenue[k]} onChange={e => upd(setRevenue, k, e.target.value)} /></div>)}</div></div>
      <div style={C.card}><label style={C.lbl}>Monthly Ad Spend ($)</label><div style={C.g2}>{AD_PLATFORMS.map(p => <div key={p.id}><div style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>{p.icon} {p.label}</div><input style={C.inp} type="number" placeholder="0.00" value={adBudget[p.id]} onChange={e => upd(setAdBudget, p.id, e.target.value)} /></div>)}</div></div>
      <div style={C.card}><label style={C.lbl}>My Goal</label><div style={C.g2}>{[["scale","🚀 Scale Revenue"],["optimize","🎯 Optimize ROAS"],["diversify","🌐 Diversify"],["conserve","🛡️ Grow Organic"]].map(([id,lbl]) => <button key={id} style={{ ...C.chip(adGoal === id, "#f87171"), textAlign: "left", padding: "10px 12px" }} onClick={() => setAdGoal(id)}>{lbl}</button>)}</div></div>
      <button style={C.btn(loading ? "off" : "rose")} onClick={analyze} disabled={loading}>{loading ? "💰 Analyzing..." : "💰 Run Revenue Analysis"}</button>
      <OutBox text={analysis} label="REVENUE REPORT" copied={copied} onCopy={() => copy(analysis)} />
    </div>
  );
}

export default function AgentEmpire() {
  const [active, setActive] = useState("content");
  const [genContent, setGenContent] = useState("");
  const [genTopic, setGenTopic] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [fired, setFired] = useState({ content: false, publishing: false, research: false, scheduler: false, revenue: false });

  useEffect(() => {
    fetch(BACKEND)
      .then(r => r.json())
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  const handleGenerated = useCallback((content, topic) => {
    setGenContent(content);
    setGenTopic(topic);
    setFired(f => ({ ...f, content: true }));
  }, []);

  return (
    <div style={C.app}>
      <div style={C.wrap}>
        <div style={{ marginBottom: 20 }}>
          <div style={C.hrow}>
            <div style={C.logo}>🤖</div>
            <div>
              <h1 style={C.h1}>Agent Empire</h1>
              <p style={C.sub}>5 agents online · AI & Make Money Online</p>
              <p style={{ margin: 0, fontSize: 11, color: backendStatus === "online" ? "#34d399" : backendStatus === "offline" ? "#f87171" : "#fbbf24" }}>
                ⬤ Backend {backendStatus === "online" ? "Live on Railway 🚀" : backendStatus === "offline" ? "Offline — check Railway" : "Connecting..."}
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {AGENTS.map(a => <div key={a.id} style={{ width: 8, height: 8, borderRadius: "50%", background: fired[a.id] ? a.color : "#1f2937", transition: "background 0.3s" }} title={a.label} />)}
            </div>
          </div>
        </div>

        <div style={C.pipeline}>
          {AGENTS.map((a, i) => [
            <div key={a.id} style={C.pstep(active === a.id)} onClick={() => setActive(a.id)}>{a.label}</div>,
            i < AGENTS.length - 1 && <span key={`arr${i}`} style={C.parr}>→</span>
          ])}
          <span style={C.parr}>→</span>
          <div style={{ ...C.pstep(false), color: "#1f2937" }}>📱 Live Channels</div>
        </div>

        <div style={C.tabs}>
          {AGENTS.map(a => (
            <button key={a.id} style={C.tab(active === a.id)} onClick={() => setActive(a.id)}>
              {a.label}
              {a.id === "publishing" && genContent && active !== "publishing" && (
                <span style={{ marginLeft: 5, background: "#1d4ed8", color: "#fff", borderRadius: 4, padding: "1px 5px", fontSize: 9, fontWeight: 800 }}>NEW</span>
              )}
            </button>
          ))}
        </div>

        {active === "content" && <ContentAgent onGenerated={handleGenerated} />}
        {active === "publishing" && <PublishingAgent incoming={genContent} incomingTopic={genTopic} />}
        {active === "research" && <ResearchAgent />}
        {active === "scheduler" && <SchedulerAgent />}
        {active === "revenue" && <RevenueAgent />}

        <p style={{ textAlign: "center", fontSize: 10, color: "#111827", marginTop: 32 }}>Agent Empire · Built for scale · Running 24/7</p>
      </div>
    </div>
  );
}
