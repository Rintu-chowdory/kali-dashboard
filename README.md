# 🐧 rintu@kali — Dev Environment & Dashboard

A containerised personal dev environment (Kali Linux base) with a hacker-style web dashboard that documents it.

- **Live dashboard:** https://rintu-chowdory.github.io/kali-dashboard/ (GitHub Pages, rebuilt by CI on every push)
- **Docker image:** `riinnttuu/dev-env:latest` — auto-built & pushed by GitHub Actions ([Docker Hub](https://hub.docker.com/r/riinnttuu/dev-env), 727 pulls)

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
docker pull riinnttuu/dev-env:latest
docker run -it --rm -v $(pwd):/home/kalidev/workspace riinnttuu/dev-env:latest
```

## 🖥️ The Dashboard (`dashboard/`)

A Vite + React single-page dashboard, rebuilt with a proper sidebar UI. Where the data
can be real, it is real:

| Page | What it shows |
|---|---|
| **Overview** | Real image size and pull count, latest CI result, live activity feed from GitHub Actions, plus three illustrative monitors |
| **Tools** | Searchable library of every tool in the image, filtered by category, one-click copy of install commands |
| **Terminal** | Emulated shell with boot banner, command history (↑/↓), `help`, `neofetch`, `tools`, `docker`, `aliases`, `ci`… |
| **Docker** | Layer breakdown measured from the registry (real sizes and digests, 0.69 GB compressed), copy-paste pull/run/build commands |
| **CI/CD** | Live workflow run history (status, duration, commit) read from the GitHub API |
| **Snippets** | Copy-paste quickstarts: docker run, docker-compose, VS Code devcontainer, bash aliases |

Keyboard shortcuts: `ctrl+1…6` switch pages.

### Where the numbers come from

| Data | Source | Freshness |
|---|---|---|
| Workflow runs, durations, activity feed | GitHub REST API, fetched in the browser (CORS `*`, 60 req/h unauthenticated) | live on page load |
| Image size, layers, digests, pull count, last push | Docker registry + Docker Hub at **build time** → `dashboard/public/image.json` | refreshed by CI on every push |
| CPU / memory / network sparklines | a random walk | illustrative only, labelled `illustrative` in the UI |

The registry and Docker Hub send no CORS headers, so a browser cannot read them directly;
`scripts/fetch-image-stats.mjs` bakes them into `image.json` instead. A failed upstream
fetch is shown as a failure — the dashboard never invents a green status.

### Develop locally

```bash
node scripts/fetch-image-stats.mjs   # optional: refresh image.json from the registry
cd dashboard
npm install
npm run dev      # vite dev server
npm run build    # production build → dashboard/dist
```

## 🔄 CI/CD

- **`docker-publish.yml`** — on push to `main`: buildx build → push to Docker Hub (`latest` + git sha tag), ~2m 54s
- **`static.yml`** — on push to `main`: refresh `image.json` from the registry → build with Vite → deploy `dashboard/dist` to GitHub Pages, ~31s
- **`dashboard-ci.yml`** — on push and pull request: `npm ci` → `eslint` → `vite build`, so a broken dashboard never reaches Pages

## 📁 Repo layout

```
.
├── Dockerfile                 # the dev environment image
├── scripts/
│   └── fetch-image-stats.mjs  # bakes real image size/layers into image.json
├── .github/workflows/         # docker-publish.yml · static.yml (Pages) · dashboard-ci.yml
└── dashboard/                 # Vite + React dashboard
    └── src/
        ├── App.jsx            # layout, sidebar, routing
        ├── components/        # Overview, Tools, Terminal, Docker, Pipeline, Snippets, ui
        ├── lib/               # github.js (live API) · imageStats.js (baked registry data)
        └── data/tools.js      # tool inventory (mirrors the Dockerfile)
```
