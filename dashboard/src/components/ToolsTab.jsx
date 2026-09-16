import { useState } from "react";
import { CATEGORIES, TOOLS } from "../data/tools.js";
import { CopyButton } from "./ui.jsx";

const CATEGORY_COLORS = {
  System: "#00ccff",
  "Node.js": "#ffcc00",
  Python: "#9900ff",
  CLI: "#00ff88",
  Security: "#ff0055",
};

export default function ToolsTab() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = TOOLS.filter((t) => {
    const q = query.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    const matchC = cat === "All" || t.category === cat;
    return matchQ && matchC;
  });

  return (
    <div className="fade-in">
      <div className="toolbar">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`search ${TOOLS.length} tools…`}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>×</button>
          )}
        </div>
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid tools-grid">
        {filtered.map((t) => (
          <div className="tool-card" key={t.name}>
            <div className="tool-head">
              <span className="tool-name" style={{ color: CATEGORY_COLORS[t.category] || "var(--green)" }}>{t.name}</span>
              <span className="tool-pkg">{t.category}</span>
            </div>
            <div className="tool-desc">{t.desc}</div>
            <div className="tool-meta">
              <span className="tool-version">{t.version} · {t.pkg}</span>
              <CopyButton text={t.install} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="panel" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
          no tools match "{query}" — try another search
        </div>
      )}
    </div>
  );
}
