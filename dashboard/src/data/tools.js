// Central tool inventory — mirrors the Dockerfile.
// pkg: how it's installed · version: shown on the card

export const CATEGORIES = ["All", "System", "Node.js", "Python", "CLI", "Security"];

export const TOOLS = [
  // ── System ──────────────────────────────────────────────
  { name: "Node.js LTS", category: "Node.js", pkg: "apt (NodeSource)", version: "v22.x", desc: "JavaScript runtime, installed from the official NodeSource LTS channel.", install: "curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -" },
  { name: "npm", category: "Node.js", pkg: "global npm", version: "latest", desc: "Package manager for JavaScript, kept up to date on every image build.", install: "npm install -g npm@latest" },
  { name: "git", category: "System", pkg: "apt", version: "2.47+", desc: "Version control with a branch-aware bash prompt baked into the image.", install: "apt-get install -y git" },
  { name: "GitHub CLI", category: "System", pkg: "apt (cli.github.com)", version: "v2.x", desc: "gh — manage PRs, issues, actions and auth straight from the shell.", install: "apt-get install -y gh" },
  { name: "Python 3", category: "Python", pkg: "apt", version: "3.13", desc: "Full Python stack with pip, venv and headers for C-extension packages.", install: "apt-get install -y python3 python3-pip python3-venv python3-dev" },
  { name: "build-essential", category: "System", pkg: "apt", version: "—", desc: "gcc, make and friends — needed to compile native pip/npm modules.", install: "apt-get install -y build-essential" },

  // ── CLI productivity ────────────────────────────────────
  { name: "curl", category: "CLI", pkg: "apt", version: "8.x", desc: "The everything-HTTP tool. API checks, downloads, quick tests.", install: "apt-get install -y curl" },
  { name: "wget", category: "CLI", pkg: "apt", version: "1.24", desc: "Robust downloads with resume, recursion and mirroring.", install: "apt-get install -y wget" },
  { name: "jq", category: "CLI", pkg: "apt", version: "1.7", desc: "Sed/grep/awk for JSON — pipe, slice and transform API responses.", install: "apt-get install -y jq" },
  { name: "ripgrep", category: "CLI", pkg: "apt", version: "14.x", desc: "rg — absurdly fast recursive search that respects .gitignore.", install: "apt-get install -y ripgrep" },
  { name: "fzf", category: "CLI", pkg: "apt", version: "0.4x", desc: "Fuzzy finder for files, history and anything piped into it.", install: "apt-get install -y fzf" },
  { name: "htop", category: "CLI", pkg: "apt", version: "3.x", desc: "Interactive process viewer with trees, search and sorting.", install: "apt-get install -y htop" },
  { name: "tmux", category: "CLI", pkg: "apt", version: "3.4", desc: "Terminal multiplexer — sessions survive disconnects inside the container.", install: "apt-get install -y tmux" },
  { name: "tree", category: "CLI", pkg: "apt", version: "2.1", desc: "Directory structures as readable trees.", install: "apt-get install -y tree" },
  { name: "bat", category: "CLI", pkg: "apt", version: "0.24", desc: "cat with syntax highlighting and git gutter. Aliased as cat.", install: "apt-get install -y bat" },
  { name: "nano", category: "CLI", pkg: "apt", version: "8.x", desc: "The friendly editor, always there when you don't want vim keybinds.", install: "apt-get install -y nano" },

  // ── JS / TS tooling ─────────────────────────────────────
  { name: "TypeScript", category: "Node.js", pkg: "npm -g", version: "5.x", desc: "Typed JavaScript compiler, globally available as tsc.", install: "npm install -g typescript" },
  { name: "ts-node", category: "Node.js", pkg: "npm -g", version: "10.x", desc: "Run TypeScript files directly, no compile step.", install: "npm install -g ts-node" },
  { name: "nodemon", category: "Node.js", pkg: "npm -g", version: "3.x", desc: "Auto-restart node processes on file change. Dev servers love it.", install: "npm install -g nodemon" },
  { name: "prettier", category: "Node.js", pkg: "npm -g", version: "3.x", desc: "Opinionated code formatter for the whole JS/TS family.", install: "npm install -g prettier" },

  // ── Python tooling ──────────────────────────────────────
  { name: "IPython", category: "Python", pkg: "pip", version: "8.x", desc: "The interactive Python shell with completions and magic commands.", install: "pip3 install ipython" },
  { name: "black", category: "Python", pkg: "pip", version: "25.x", desc: "Uncompromising Python formatter. No config, no arguments.", install: "pip3 install black" },
  { name: "ruff", category: "Python", pkg: "pip", version: "0.x", desc: "Blazing-fast linter + formatter that replaces flake8 & isort.", install: "pip3 install ruff" },
  { name: "httpx", category: "Python", pkg: "pip", version: "0.28", desc: "Modern HTTP client with sync + async APIs and HTTP/2.", install: "pip3 install httpx" },
  { name: "requests", category: "Python", pkg: "pip", version: "2.x", desc: "HTTP for humans. Still the fastest way to poke an API.", install: "pip3 install requests" },

  // ── Security / network (Kali) ──────────────────────────
  { name: "nmap", category: "Security", pkg: "apt", version: "7.94+", desc: "Network discovery and port scanning — the classic Kali staple.", install: "apt-get install -y nmap" },
  { name: "netcat", category: "Security", pkg: "apt", version: "openbsd", desc: "TCP/UDP swiss-army knife for debugging and quick listeners.", install: "apt-get install -y netcat-openbsd" },
  { name: "dnsutils", category: "Security", pkg: "apt", version: "9.x", desc: "dig, nslookup, host — DNS troubleshooting essentials.", install: "apt-get install -y dnsutils" },
  { name: "whois", category: "Security", pkg: "apt", version: "5.5", desc: "Domain registration lookups from the shell.", install: "apt-get install -y whois" },
  { name: "net-tools", category: "Security", pkg: "apt", version: "2.10", desc: "ifconfig, netstat, route — the classic network toolbox.", install: "apt-get install -y net-tools" },
];

export const TOOL_COUNT = TOOLS.length;
