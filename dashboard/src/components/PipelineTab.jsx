import { useEffect, useState } from "react";
import { StatCard, Icon } from "./ui.jsx";
import { fetchRuns, timeAgo, duration, CONCLUSION_COLOR, REPO } from "../lib/github.js";

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
  const [state, setState] = useState({ loading: true, runs: [], error: null });

  useEffect(() => {
    let alive = true;
    fetchRuns()
      .then((data) => alive && setState({ loading: false, runs: data.runs, error: null }))
      .catch((err) => alive && setState({ loading: false, runs: [], error: err.message }));
    return () => {
      alive = false;
    };
  }, []);

  const { loading, runs, error } = state;
  const latest = runs[0];
  const done = runs.filter((r) => r.status === "completed");
  const passing = done.length ? done.filter((r) => r.conclusion === "success").length : 0;
  const slowest = done.reduce((max, r) => Math.max(max, r.durationMs || 0), 0);

  return (
    <div className="fade-in">
      <div className="grid stat-grid-3" style={{ marginBottom: 16 }}>
        <StatCard icon={<Icon name="pipeline" />} label="Trigger" value="git push" sub="on: push to main" />
        <StatCard icon={<Icon name="terminal" />} label="Runner" value="ubuntu-latest" accent="var(--cyan)" sub="GitHub-hosted" />
        <StatCard
          icon={<Icon name="gauge" />}
          label="Slowest recent run"
          value={slowest ? duration(slowest) : "—"}
          accent="var(--amber)"
          sub={done.length ? `across ${done.length} completed runs` : "no data yet"}
        />
      </div>

      <div className="panel">
        <div className="panel-title">
          <span>GitHub Actions Pipelines</span>
          <span style={{ letterSpacing: 1 }}>
            {loading ? "loading…" : error ? "live data unavailable" : `2 workflows · ${passing}/${done.length} green`}
          </span>
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
          <span style={{ color: "var(--muted)" }}>LATEST</span>
          <span style={{ color: latest ? CONCLUSION_COLOR[latest.conclusion] || "var(--muted)" : "var(--muted)" }}>
            {latest
              ? `${latest.workflow} — ${latest.conclusion || latest.status} · ${timeAgo(latest.createdAt)}`
              : "waiting for GitHub…"}
          </span>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-title">
          <span>Workflow Runs</span>
          <span style={{ letterSpacing: 1 }}>{REPO}</span>
        </div>

        {error && (
          <div className="feed-row">
            <div className="feed-dot" style={{ background: "#ffcc00", boxShadow: "0 0 8px #ffcc00" }} />
            <div className="feed-text">
              Could not read the GitHub API: {error}. The panel shows nothing rather than inventing a status.
            </div>
          </div>
        )}

        {!error && loading && <div className="feed-row"><div className="feed-text">Fetching workflow runs…</div></div>}

        {!error &&
          runs.map((r) => {
            const color = CONCLUSION_COLOR[r.conclusion] || "#ffcc00";
            return (
              <a
                className="feed-row"
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="feed-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                <div className="feed-text">
                  {r.file || r.workflow} <span style={{ color: "var(--muted)" }}>on {r.branch} · {r.sha}</span>
                </div>
                <div className="feed-time" style={{ color }}>
                  {r.conclusion || r.status} · {duration(r.durationMs)} · {timeAgo(r.createdAt)}
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
}
