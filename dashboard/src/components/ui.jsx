import { useState } from "react";

// Inline SVG icon set (stroke-based, inherits currentColor)
const icons = {
  gauge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15l3.5-3.5" /><path d="M20.3 18a10 10 0 1 0-16.6 0" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17l6-5-6-5" /><path d="M12 19h8" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h15a6 6 0 0 1 6-3 6 6 0 0 1-4 7H5a2 2 0 0 1-2-2v-2z" />
      <path d="M6 14V10h3v4M10 14V10h3v4M10 8V5h3v3M14 14V10h.01" />
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" /><path d="M7.5 6h9M6.8 8.2L10.5 15.8M17.2 8.2L13.5 15.8" />
    </svg>
  ),
  snippet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6l-5 6 5 6" /><path d="M16 6l5 6-5 6" />
    </svg>
  ),
};

export function Icon({ name }) {
  return icons[name] || null;
}

// Copy-to-clipboard button with "copied" feedback
export function CopyButton({ text, label = "copy" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button className={`copy-btn${copied ? " copied" : ""}`} onClick={copy}>
      {copied ? "copied ✓" : label}
    </button>
  );
}

// Small reusable stat card
export function StatCard({ icon, label, value, sub, accent = "var(--green)" }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color: accent, background: "rgba(255,255,255,0.03)" }}>
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
