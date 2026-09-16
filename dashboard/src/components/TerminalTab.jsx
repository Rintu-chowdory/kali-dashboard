import { useEffect, useRef, useState } from "react";
import { TOOLS, TOOL_COUNT } from "../data/tools.js";

const G = "#00ff88", C = "#00ccff", M = "#ff0055", DIM = "#888", TXT = "#fff";

const BANNER = [
  { text: "        ,..--::====--..          ", color: G },
  { text: "   ..=+*#%%@@@@@@@@%%#*+-.      ", color: G },
  { text: "rintu@kali · dev-env v3.0", color: C },
  { text: "──────────────────────────────", color: "#333" },
  { text: "OS      : Kali Linux (rolling) · dockerized", color: DIM },
  { text: "Kernel  : Linux x86_64 (container)", color: DIM },
  { text: "Shell   : bash 5.2 · custom prompt + aliases", color: DIM },
  { text: "Runtime : Node.js LTS · Python 3.13", color: DIM },
  { text: `Tools   : ${TOOL_COUNT} installed (type 'tools')`, color: DIM },
  { text: "──────────────────────────────", color: "#333" },
  { text: "Welcome back, rintu. Type 'help' for commands.", color: TXT },
];

export default function TerminalTab() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    BANNER.forEach((l, i) => setTimeout(() => setLines((p) => [...p, l]), 90 * i));
    setTimeout(() => setBooted(true), 90 * BANNER.length + 100);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim();
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    let out = [];

    switch (name) {
      case "":
        break;
      case "help":
        out = [
          { text: "commands:", color: G },
          { text: "  help      — this list", color: DIM },
          { text: "  neofetch  — system banner", color: DIM },
          { text: "  whoami    — session info", color: DIM },
          { text: "  tools     — installed tools by category", color: DIM },
          { text: "  docker    — image info", color: DIM },
          { text: "  aliases   — bash aliases from the image", color: DIM },
          { text: "  run       — copy-paste docker run command", color: DIM },
          { text: "  ci        — pipeline status", color: DIM },
          { text: "  uptime    — time since boot", color: DIM },
          { text: "  date      — current date/time", color: DIM },
          { text: "  echo <x>  — print text", color: DIM },
          { text: "  history   — your command history", color: DIM },
          { text: "  clear     — clear screen", color: DIM },
        ];
        break;
      case "neofetch":
        out = BANNER;
        break;
      case "whoami":
        out = [
          { text: "user    : rintu (uid 1000, non-root)", color: C },
          { text: "host    : kali-dev-env", color: C },
          { text: "image   : riinnttuu/dev-env:latest", color: C },
          { text: "shell   : bash 5.2.x", color: C },
          { text: "mode    : interactive session", color: C },
        ];
        break;
      case "tools": {
        const cats = [...new Set(TOOLS.map((t) => t.category))];
        out = [{ text: `${TOOL_COUNT} tools installed:`, color: G }];
        cats.forEach((c) => {
          const list = TOOLS.filter((t) => t.category === c).map((t) => t.name).join(" · ");
          out.push({ text: `  [${c}]`, color: C });
          out.push({ text: `    ${list}`, color: DIM });
        });
        break;
      }
      case "docker":
        out = [
          { text: "IMAGE   : riinnttuu/dev-env:latest", color: G },
          { text: "SIZE    : 1.12 GB (7 layers)", color: DIM },
          { text: "BASE    : kalilinux/kali-rolling", color: DIM },
          { text: "STATUS  : pushed to Docker Hub ✓", color: G },
        ];
        break;
      case "aliases":
        out = [
          { text: "ll → ls -lah --color=auto      gs → git status", color: DIM },
          { text: "gl → git log --oneline --graph py → python3", color: DIM },
          { text: "ipy → ipython                 cat → bat (syntax hl)", color: DIM },
        ];
        break;
      case "run":
        out = [
          { text: "docker run -it --rm \\", color: G },
          { text: "  -v $(pwd):/home/kalidev/workspace \\", color: G },
          { text: "  riinnttuu/dev-env:latest", color: G },
        ];
        break;
      case "ci":
        out = [
          { text: "✔ build   — docker buildx (155s, cached)", color: G },
          { text: "✔ push    — riinnttuu/dev-env:latest", color: G },
          { text: "✔ pages   — dashboard deployed to GitHub Pages", color: G },
          { text: "trigger  : push to main", color: DIM },
        ];
        break;
      case "uptime":
        out = [{ text: `up ${Math.floor(performance.now() / 1000)}s, 1 user, load average: 0.24 0.31 0.19`, color: C }];
        break;
      case "date":
        out = [{ text: new Date().toString(), color: C }];
        break;
      case "echo":
        out = [{ text: args.join(" "), color: TXT }];
        break;
      case "history":
        out = history.map((h, i) => ({ text: `  ${i + 1}  ${h}`, color: DIM }));
        break;
      case "clear":
        setLines([]);
        return;
      case "sudo":
        out = [{ text: "rintu is not in the sudoers file. This incident has been reported. 🙂", color: M }];
        break;
      default:
        out = [{ text: `command not found: ${cmd} — try 'help'`, color: M }];
    }

    setLines((p) => [
      ...p,
      { text: `┌──(rintu㉿kali)-[~]`, color: G },
      { text: `└─$ ${cmd}`, color: TXT },
      ...out,
    ]);
  };

  const submit = () => {
    const cmd = input;
    if (cmd.trim()) {
      setHistory((h) => [...h, cmd.trim()]);
      setHIdx(-1);
    }
    setInput("");
    run(cmd);
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const idx = hIdx + 1;
      if (idx >= history.length) { setHIdx(-1); setInput(""); }
      else { setHIdx(idx); setInput(history[idx]); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="fade-in">
      <div className="terminal" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-bar">
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
          <span className="t-title">bash — rintu@kali:~</span>
        </div>
        <div className="terminal-body">
          {lines.map((l, i) => (
            <div key={i} style={{ color: l.color }}>{l.text}</div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="terminal-input">
          <span style={{ color: G, fontSize: 11, whiteSpace: "nowrap" }}>└─$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={!booted}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <span style={{ color: G }} className="blink">█</span>
        </div>
      </div>
      <div className="terminal-hint">
        type <code>help</code> — <span className="kbd">↑</span> <span className="kbd">↓</span> history · <span className="kbd">ctrl+l</span> clear
      </div>
    </div>
  );
}
