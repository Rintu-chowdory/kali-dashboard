import { StatCard, Icon } from "./ui.jsx";

const STEPS = [
  { name: "Checkout", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 21h16" />
    </svg>
  ) },
  { name: "Login", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="12" r="4" /><path d="M16 8v8M19 11v2" />
    </svg>
  ) },
  { name: "Buildx", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a5 5 0 0 0-7 7l-3 3 2 2 3-3a5 5 0 0 0 7-7l-2-2z" /><path d="M5 5l3 3M19 19l-3-3" />
    </svg>
  ) },
  { name: "Build & Push", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V9" /><path d="M7 14l5-5 5 5" /><path d="M5 3h14" />
    </svg>
  ) },
  { name: "Deploy Pages", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </svg>
  ) },
];

export default function PipelineTab() {
  return (
    <div className="fade-in">
      <div className="grid stat-grid-3" style={{ marginBottom: 16 }}>
        <StatCard icon={<Icon name="pipeline" />} label="Trigger" value="git push" sub="on: push to main" />
        <StatCard icon={<Icon name="terminal" />} label="Runner" value="ubuntu-latest" accent="var(--cyan)" sub="4 vCPU · 16 GB" />
        <StatCard icon={<Icon name="gauge" />} label="Build Time" value="~155s" accent="var(--amber)" sub="with layer cache" />
      </div>

      <div className="panel">
        <div className="panel-title">
          <span>GitHub Actions Pipelines</span>
          <span style={{ letterSpacing: 1 }}>2 workflows · all green</span>
        </div>
        <div className="pipeline">
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", flex: 1, alignItems: "flex-start" }}>
              <div className="pipe-step">
                <div className="pipe-node">{s.icon}</div>
                <div className="pipe-label">{s.name}</div>
              </div>
              {i < STEPS.length - 1 && <div className="pipe-link" />}
            </div>
          ))}
        </div>
        <div className="total-row">
          <span style={{ color: "var(--muted)" }}>LAST RUN</span>
          <span style={{ color: "var(--green)" }}>✔ image → Docker Hub · dashboard → GitHub Pages</span>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-title">Workflow Runs</div>
        {[
          { w: "docker-publish.yml", status: "success", msg: "pushed riinnttuu/dev-env:latest + sha tag", color: "#00ff88" },
          { w: "static.yml (pages)", status: "success", msg: "dashboard built with vite → deployed to Pages", color: "#00ff88" },
        ].map((r, i) => (
          <div className="feed-row" key={i}>
            <div className="feed-dot" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
            <div className="feed-text">{r.w} — {r.msg}</div>
            <div className="feed-time">✔ {r.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
