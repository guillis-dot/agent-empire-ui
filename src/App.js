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
