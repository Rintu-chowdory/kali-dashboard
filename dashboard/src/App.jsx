import { useEffect, useState, useCallback } from "react";
import { Icon } from "./components/ui.jsx";
import Overview from "./components/Overview.jsx";
import ToolsTab from "./components/ToolsTab.jsx";
import TerminalTab from "./components/TerminalTab.jsx";
import DockerTab from "./components/DockerTab.jsx";
import PipelineTab from "./components/PipelineTab.jsx";
import SnippetsTab from "./components/SnippetsTab.jsx";

const PAGES = [
  { id: "overview", label: "Overview", icon: "gauge" },
  { id: "tools", label: "Tools", icon: "grid" },
  { id: "terminal", label: "Terminal", icon: "terminal" },
  { id: "docker", label: "Docker", icon: "docker" },
  { id: "pipeline", label: "CI/CD", icon: "pipeline" },
  { id: "snippets", label: "Snippets", icon: "snippet" },
];

const TITLES = {
  overview: ["System Overview", "LIVE TELEMETRY · DOCKER IMAGE · PIPELINE"],
  tools: ["Tools Library", "EVERYTHING BAKED INTO THE IMAGE"],
  terminal: ["Terminal", "EMULATED SHELL · TYPE HELP"],
  docker: ["Docker Image", "LAYERS · SIZE · RUN COMMANDS"],
  pipeline: ["CI/CD Pipeline", "GITHUB ACTIONS WORKFLOWS"],
  snippets: ["Snippets", "COPY-PASTE QUICKSTARTS"],
};

function fmtUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`
    : `${m}m ${String(sec).padStart(2, "0")}s`;
}

export default function App() {
  const [page, setPage] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState("0m 00s");

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const now = new Date();
      setTime(now);
      setUptime(fmtUptime(now - start));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard navigation: ctrl+1..6
  const onKey = useCallback((e) => {
    if (e.ctrlKey && e.key >= "1" && e.key <= "6") {
      e.preventDefault();
      setPage(PAGES[Number(e.key) - 1].id);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const [title, subtitle] = TITLES[page];

  return (
    <div className="app">
      <div className="bg-glow" />
      <div className="bg-grid" />

      <div className="shell">
        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="sidebar">
          <div className="logo">
            <span style={{ color: "var(--green)" }}>rintu</span>
            <span style={{ color: "var(--muted-2)" }}>@</span>
            <span style={{ color: "var(--cyan)" }}>kali</span>
            <span style={{ color: "var(--muted-2)" }}>:~</span>
            <span style={{ color: "var(--green)" }} className="blink">█</span>
          </div>

          <nav className="nav">
            {PAGES.map((p, i) => (
              <button
                key={p.id}
                className={`nav-item${page === p.id ? " active" : ""}`}
                onClick={() => setPage(p.id)}
                title={`${p.label} · ctrl+${i + 1}`}
              >
                <Icon name={p.icon} />
                <span>{p.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="status-row">
              <div className="status-dot" />
              <span>ci: passing</span>
            </div>
            <div className="status-row" style={{ paddingLeft: 15 }}>
              <span>dev-env v3.0</span>
            </div>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────── */}
        <main className="main">
          <div className="topbar">
            <div>
              <h1>{title}</h1>
              <div className="subtitle">{subtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="badge">● BUILD PASSING</span>
              <div className="clock">
                <div className="time">{time.toLocaleTimeString("en-GB")}</div>
                <div className="date">
                  {time.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {page === "overview" && <Overview uptime={uptime} />}
          {page === "tools" && <ToolsTab />}
          {page === "terminal" && <TerminalTab />}
          {page === "docker" && <DockerTab />}
          {page === "pipeline" && <PipelineTab />}
          {page === "snippets" && <SnippetsTab />}
        </main>
      </div>
    </div>
  );
}
