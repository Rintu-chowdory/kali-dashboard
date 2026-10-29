import { useEffect, useState } from "react";
import { StatCard, Icon } from "./ui.jsx";
import { TOOL_COUNT } from "../data/tools.js";
import { fetchRuns, timeAgo, CONCLUSION_COLOR } from "../lib/github.js";
import { fetchImageStats, formatGB } from "../lib/imageStats.js";

// ── Sparkline ──────────────────────────────────────────────
function Sparkline({ data, color }) {
  const w = 220, h = 64, max = 100;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const points = data.map((v, i) => `${i * step},${h - (v / max) * (h - 6) - 3}`).join(" ");
  const area = `M0,${h} L${points.replace(/ /g, " L")} L${w},${h} Z`;
  const id = `g-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ── Illustrative monitor: a random walk, not host telemetry ───
// A static page cannot read the container it documents, so these series are fake on
// purpose and labelled as such in the UI.
function useSeries(len, seed) {
  const [data, setData] = useState(() =>
    Array.from({ length: len }, (_, i) => 40 + Math.sin(i / 3 + seed) * 25 + Math.random() * 15)
  );
  useEffect(() => {
    const t = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.min(95, Math.max(8, last + (Math.random() - 0.5) * 22));
        return [...prev.slice(1), next];
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return data;
}

function Monitor({ label, unit, data, color, seedLabel }) {
  const current = Math.round(data[data.length - 1]);
  return (
    <div className="panel monitor">
      <div className="monitor-label">
        <span>{label}</span>
        <span style={{ color }}>{seedLabel}</span>
      </div>
      <Sparkline data={data} color={color} />
      <div className="monitor-value" style={{ color }}>
        {current}
        <span style={{ fontSize: 11, color: "var(--muted)" }}> {unit}</span>
      </div>
    </div>
  );
}

// ── Fallback feed, used only when the GitHub API is unreachable ──
const FEED = [
  { color: "#00ff88", text: "CI/CD pipeline passed — image pushed to Docker Hub", time: "latest run" },
  { color: "#00ccff", text: "workflow: deploy dashboard to GitHub Pages (build + upload dist)", time: "latest run" },
  { color: "#ffcc00", text: "Dockerfile: added nmap, tmux, ripgrep, fzf, htop & more", time: "recent" },
  { color: "#9900ff", text: "dashboard redesign — sidebar, tools library, live monitors", time: "recent" },
  { color: "#00ff88", text: "hacker dashboard v1 — particles, terminal, docker layers", time: "earlier" },
  { color: "#00ccff", text: "initial commit: personal dev environment", time: "initial" },
];

export default function Overview({ uptime }) {
  const cpu = useSeries(40, 0);
  const mem = useSeries(40, 2);
  const net = useSeries(40, 4);

  const [runs, setRuns] = useState(null);
  const [runsError, setRunsError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchRuns()
      .then((d) => alive && setRuns(d.runs))
      .catch((err) => alive && setRunsError(err.message));
    fetchImageStats()
      .then((d) => alive && setImage(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const latest = runs?.[0];
  const ciValue = latest ? latest.conclusion || latest.status : runsError ? "unknown" : "…";
  const ciColor = latest ? CONCLUSION_COLOR[latest.conclusion] || "var(--amber)" : "var(--amber)";

  return (
    <div className="fade-in">
      <div className="grid stat-grid">
        <StatCard
          icon={<Icon name="docker" />}
          label="Docker Image"
          value={image ? formatGB(image.sizeBytes) : "—"}
          sub={image ? `compressed · ${image.pulls ?? "?"} pulls` : "measuring…"}
          accent="var(--cyan)"
        />
        <StatCard icon={<Icon name="grid" />} label="Tools Installed" value={`${TOOL_COUNT}`} sub="system · js · python · sec" />
        <StatCard icon={<Icon name="gauge" />} label="Session Uptime" value={uptime} sub="since page load" accent="var(--amber)" />
        <StatCard
          icon={<Icon name="pipeline" />}
          label="Last CI run"
          value={ciValue}
          sub={latest ? `${latest.file} · ${timeAgo(latest.createdAt)}` : "from the GitHub API"}
          accent={ciColor}
        />
      </div>

      <div className="grid monitor-grid">
        <Monitor label="CPU Load" unit="%" data={cpu} color="#00ff88" seedLabel="illustrative" />
        <Monitor label="Memory" unit="%" data={mem} color="#00ccff" seedLabel="illustrative" />
        <Monitor label="Network I/O" unit="mb/s" data={net} color="#ff0055" seedLabel="illustrative" />
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-title">
          <span>Activity Feed</span>
          <span style={{ letterSpacing: 1 }}>{runs ? "live · github actions" : runsError ? "offline fallback" : "loading…"}</span>
        </div>

        {runsError && (
          <div className="feed-row">
            <div className="feed-dot" style={{ background: "#ffcc00", boxShadow: "0 0 8px #ffcc00" }} />
            <div className="feed-text">GitHub API unavailable ({runsError}) — showing the last known summary.</div>
          </div>
        )}

        {(runs || FEED).map((f, i) =>
          runs ? (
            <a
              key={f.id}
              className="feed-row"
              href={f.url}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="feed-dot"
                style={{ background: CONCLUSION_COLOR[f.conclusion] || "#ffcc00", boxShadow: `0 0 8px ${CONCLUSION_COLOR[f.conclusion] || "#ffcc00"}` }}
              />
              <div className="feed-text">
                {f.workflow} {f.conclusion || f.status} on {f.branch} <span style={{ color: "var(--muted)" }}>· {f.sha}</span>
              </div>
              <div className="feed-time">{timeAgo(f.createdAt)}</div>
            </a>
          ) : (
            <div className="feed-row" key={i}>
              <div className="feed-dot" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
              <div className="feed-text">{f.text}</div>
              <div className="feed-time">{f.time}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
