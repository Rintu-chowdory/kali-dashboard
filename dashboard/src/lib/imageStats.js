// Real Docker image metadata, baked at build time by scripts/fetch-image-stats.mjs.
// hub.docker.com and registry-1.docker.io send no CORS headers, so this cannot be
// fetched live from the browser.

let cached = null;

export function fetchImageStats() {
  if (!cached) {
    cached = fetch(`${import.meta.env.BASE_URL}image.json`, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`image.json responded ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}

export const formatMB = (bytes) => (bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "—");

export const formatGB = (bytes) =>
  bytes ? `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB` : "—";
