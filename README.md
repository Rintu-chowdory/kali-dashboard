# 🐧 rintu@kali — Dev Environment & Dashboard

A containerised personal dev environment (Kali Linux base) with a hacker-style web dashboard that documents it.

- **Live dashboard:** https://kali-dashboard.vercel.app (also deployed to GitHub Pages via CI)
- **Docker image:** `riinntuu/dev-env:latest` — auto-built & pushed by GitHub Actions

---

## 📦 What's inside the image

| Category | Tools |
|---|---|
| **OS** | Kali Linux (rolling) · Ubuntu-style bash prompt |
| **Runtimes** | Node.js LTS (NodeSource) · Python 3 + pip/venv/dev headers |
| **VCS** | git · GitHub CLI (`gh`) |
| **CLI** | curl · wget · jq · ripgrep · fzf · bat · tree · htop · tmux · nano |
| **Security / network** | nmap · netcat · dnsutils (dig) · whois · net-tools |
| **JS tooling** | nodemon · typescript · ts-node · prettier (global npm) |
| **Python tooling** | ipython · black · ruff · httpx · requests |

Handy aliases baked into bash: `ll`, `gs`, `gl`, `py`, `ipy`, `cat`→`bat`, `dc`→`docker compose`, `serve`.

## 🚀 Quick start

```bash
docker pull riinntuu/dev-env:latest
docker run -it --rm -v $(pwd):/home/kalidev/workspace riinntuu/dev-env:latest
```

## 🖥️ The Dashboard (`dashboard/`)

A Vite + React single-page dashboard, rebuilt with a proper sidebar UI:

| Page | What it shows |
|---|---|
| **Overview** | Stat cards, live telemetry monitors (CPU/mem/net sparklines), activity feed |
| **Tools** | Searchable library of every tool in the image, filtered by category, one-click copy of install commands |
| **Terminal** | Emulated shell with boot banner, command history (↑/↓), `help`, `neofetch`, `tools`, `docker`, `aliases`, `ci`… |
| **Docker** | Image layers as an interactive stacked bar + per-layer breakdown, copy-paste pull/run/build commands |
| **CI/CD** | GitHub Actions pipeline visualisation with per-step status |
| **Snippets** | Copy-paste quickstarts: docker run, docker-compose, VS Code devcontainer, bash aliases |

Keyboard shortcuts: `ctrl+1…6` switch pages.

### Develop locally

```bash
cd dashboard
npm install
npm run dev      # vite dev server
npm run build    # production build → dashboard/dist
```

## 🔄 CI/CD

- **`docker-publish.yml`** — on push to `main`: buildx build → push to Docker Hub (`latest` + git sha tag)
- **`static.yml`** — on push to `main`: build the dashboard with Vite → deploy `dashboard/dist` to GitHub Pages

Vercel also auto-deploys the `dashboard/` directory on every push to `main`.

## 📁 Repo layout

```
.
├── Dockerfile                 # the dev environment image
├── .github/workflows/         # docker-publish.yml · static.yml (Pages)
└── dashboard/                 # Vite + React dashboard
    └── src/
        ├── App.jsx            # layout, sidebar, routing
        ├── components/        # Overview, Tools, Terminal, Docker, Pipeline, Snippets, ui
        └── data/tools.js      # tool inventory (mirrors the Dockerfile)
```
