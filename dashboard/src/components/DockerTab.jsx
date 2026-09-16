import { StatCard, Icon, CopyButton } from "./ui.jsx";

const LAYERS = [
  { name: "kalilinux/kali-rolling", size: 52, color: "#ff0055" },
  { name: "apt packages + build tools", size: 380, color: "#ff6600" },
  { name: "Node.js LTS", size: 120, color: "#00ccff" },
  { name: "GitHub CLI", size: 45, color: "#9900ff" },
  { name: "npm global packages", size: 85, color: "#00ff88" },
  { name: "Python packages", size: 210, color: "#ffcc00" },
  { name: "user + bash config", size: 2, color: "#00ff88" },
];

const TOTAL = LAYERS.reduce((a, l) => a + l.size, 0);

const PULL = "docker pull riinnttuu/dev-env:latest";
const RUN = "docker run -it --rm -v $(pwd):/home/kalidev/workspace riinnttuu/dev-env:latest";
const BUILD = "git clone https://github.com/Rintu-chowdory/kali-dashboard.git\ncd kali-dashboard\ndocker build -t dev-env .";

export default function DockerTab() {
  return (
    <div className="fade-in">
      <div className="grid stat-grid-3" style={{ marginBottom: 16 }}>
        <StatCard icon={<Icon name="docker" />} label="Base Image" value="kali-rolling" accent="var(--magenta)" />
        <StatCard icon={<Icon name="snippet" />} label="Registry" value="Docker Hub" accent="var(--cyan)" sub="riinnttuu/dev-env" />
        <StatCard icon={<Icon name="gauge" />} label="Total Size" value={`${(TOTAL / 1024).toFixed(2)} GB`} sub={`${LAYERS.length} layers`} />
      </div>

      <div className="panel">
        <div className="panel-title">
          <span>Image Layers</span>
          <span style={{ letterSpacing: 1 }}>{LAYERS.length} layers · stacked by size</span>
        </div>

        <div className="stack-bar">
          {LAYERS.map((l) => (
            <div
              key={l.name}
              className="stack-seg"
              style={{ width: `${(l.size / TOTAL) * 100}%`, background: l.color }}
              title={`${l.name} — ${l.size}MB`}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LAYERS.map((l, i) => (
            <div className="layer-row" key={i}>
              <div style={{ width: 3, height: 32, background: l.color, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#ddd", fontSize: 12 }}>LAYER {i}</div>
                <div style={{ color: "var(--muted)", fontSize: 11 }}>{l.name}</div>
              </div>
              <div style={{ color: l.color, fontSize: 12, fontWeight: 700 }}>{l.size} MB</div>
            </div>
          ))}
        </div>

        <div className="total-row">
          <span style={{ color: "var(--muted)" }}>TOTAL SIZE</span>
          <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 700 }}>{(TOTAL / 1024).toFixed(2)} GB</span>
        </div>
      </div>

      <div className="grid stat-grid-3" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-title">Pull</div>
          <div style={{ fontSize: 11, color: "#b8c8bf", marginBottom: 12, whiteSpace: "pre-wrap" }}>{PULL}</div>
          <CopyButton text={PULL} label="copy pull" />
        </div>
        <div className="panel">
          <div className="panel-title">Run (interactive)</div>
          <div style={{ fontSize: 11, color: "#b8c8bf", marginBottom: 12, whiteSpace: "pre-wrap" }}>{RUN}</div>
          <CopyButton text={RUN} label="copy run" />
        </div>
        <div className="panel">
          <div className="panel-title">Build locally</div>
          <div style={{ fontSize: 11, color: "#b8c8bf", marginBottom: 12, whiteSpace: "pre-wrap" }}>{BUILD}</div>
          <CopyButton text={BUILD} label="copy build" />
        </div>
      </div>
    </div>
  );
}
