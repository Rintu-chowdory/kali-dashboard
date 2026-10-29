import { useEffect, useState } from "react";
import { StatCard, Icon, CopyButton } from "./ui.jsx";
import { fetchImageStats, formatMB, formatGB } from "../lib/imageStats.js";

const PALETTE = ["#ff0055", "#ff6600", "#00ccff", "#9900ff", "#00ff88", "#ffcc00", "#00ffcc", "#ff3399"];

const IMAGE = "riinnttuu/dev-env:latest";
const RUN = "docker run -it --rm -v $(pwd):/home/kalidev/workspace riinnttuu/dev-env:latest";
const BUILD = "git clone https://github.com/Rintu-chowdory/kali-dashboard.git\ncd kali-dashboard\ndocker build -t dev-env .";

const shortStep = (step = "") => {
  const s = step.replace(/^RUN\s+/, "").replace(/^\/bin\/sh -c\s+/, "");
  return s.length > 84 ? `${s.slice(0, 82)}…` : s || "layer";
};

export default function DockerTab() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchImageStats()
      .then((data) => alive && setImage(data))
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, []);

  const layers = (image?.layers || [])
    .map((l) => ({ ...l }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes);
  const total = image?.sizeBytes || layers.reduce((sum, l) => sum + l.sizeBytes, 0);

  return (
    <div className="fade-in">
      <div className="grid stat-grid-3" style={{ marginBottom: 16 }}>
        <StatCard icon={<Icon name="docker" />} label="Base Image" value="kali-rolling" accent="var(--magenta)" />
        <StatCard
          icon={<Icon name="snippet" />}
          label="Registry"
          value="Docker Hub"
          accent="var(--cyan)"
          sub={image?.pulls != null ? `${image.pulls} pulls` : "riinnttuu/dev-env"}
        />
        <StatCard
          icon={<Icon name="gauge" />}
          label="Compressed Size"
          value={image ? formatGB(total) : "—"}
          sub={image ? `${formatMB(total)} · ${image.platforms?.join(", ")}` : "measuring…"}
        />
      </div>

      <div className="panel">
        <div className="panel-title">
          <span>Image Layers</span>
          <span style={{ letterSpacing: 1 }}>
            {image ? `${layers.length} layers · measured from the registry` : error ? "registry data unavailable" : "loading…"}
          </span>
        </div>

        {error && (
          <div className="feed-row">
            <div className="feed-dot" style={{ background: "#ffcc00", boxShadow: "0 0 8px #ffcc00" }} />
            <div className="feed-text">
              No image.json ({error}). Run <code>node scripts/fetch-image-stats.mjs</code> to bake it.
            </div>
          </div>
        )}

        {image && (
          <>
            <div className="stack-bar">
              {layers.map((l, i) => (
                <div
                  key={l.digest + i}
                  className="stack-seg"
                  style={{ width: `${(l.sizeBytes / total) * 100}%`, background: PALETTE[i % PALETTE.length] }}
                  title={`${shortStep(l.step)} — ${formatMB(l.sizeBytes)}`}
                />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {layers.map((l, i) => (
                <div className="layer-row" key={l.digest + i}>
                  <div style={{ width: 3, height: 32, background: PALETTE[i % PALETTE.length], borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#ddd", fontSize: 12 }}>LAYER {i} · {l.digest}</div>
                    <div style={{ color: "var(--muted)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {shortStep(l.step)}
                    </div>
                  </div>
                  <div style={{ color: PALETTE[i % PALETTE.length], fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {formatMB(l.sizeBytes)}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-row">
              <span style={{ color: "var(--muted)" }}>
                COMPRESSED TOTAL · pushed {image.lastPushed ? new Date(image.lastPushed).toISOString().slice(0, 10) : "—"}
              </span>
              <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 700 }}>{formatGB(total)}</span>
            </div>
          </>
        )}
      </div>

      <div className="grid stat-grid-3" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-title">Pull</div>
          <div style={{ fontSize: 11, color: "#b8c8bf", marginBottom: 12, whiteSpace: "pre-wrap" }}>
            {`docker pull ${image ? `${image.name}:${image.tag}` : IMAGE}`}
          </div>
          <CopyButton text={`docker pull ${image ? `${image.name}:${image.tag}` : IMAGE}`} label="copy pull" />
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
