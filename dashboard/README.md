# Dashboard — rintu@kali

Hacker-style dashboard for the personal dev environment. Vite + React.

- `npm install` → `npm run dev` to develop
- `npm run build` → production build in `dist/`
- Pages: Overview · Tools (searchable library) · Terminal (emulated shell) · Docker (layers) · CI/CD · Snippets

Data: workflow runs come live from the GitHub API (`src/lib/github.js`); image size and
layer sizes come from `public/image.json`, which `scripts/fetch-image-stats.mjs` generates
from the Docker registry; the Overview sparklines are illustrative and labelled as such.

Deployed to GitHub Pages by `static.yml`.
