// Live repo data straight from the GitHub REST API.
// It sends `access-control-allow-origin: *`, so the browser can read it without a proxy.
// Unauthenticated rate limit is 60 requests/hour per IP, so the whole app shares one
// memoised request instead of each component fetching on its own.

export const REPO = "Rintu-chowdory/kali-dashboard";

let runsPromise = null;

export function fetchRuns() {
  if (!runsPromise) {
    runsPromise = (async () => {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/actions/runs?per_page=8`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (res.status === 403 || res.status === 429) {
        throw new Error("GitHub API rate limit reached (60/hour, unauthenticated)");
      }
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

      const data = await res.json();
      const runs = (data.workflow_runs || []).map((r) => ({
        id: r.id,
        workflow: r.name,
        file: r.path?.split("/").pop() || "",
        branch: r.head_branch,
        event: r.event,
        status: r.status,
        conclusion: r.conclusion,
        createdAt: r.created_at,
        durationMs:
          r.run_started_at && r.updated_at
            ? new Date(r.updated_at) - new Date(r.run_started_at)
            : null,
        url: r.html_url,
        sha: r.head_sha?.slice(0, 7) || "",
      }));
      return { runs, fetchedAt: Date.now() };
    })().catch((err) => {
      runsPromise = null; // allow a later retry
      throw err;
    });
  }
  return runsPromise;
}

export function timeAgo(iso) {
  if (!iso) return "—";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function duration(ms) {
  if (!ms || ms < 0) return "—";
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export const CONCLUSION_COLOR = {
  success: "#00ff88",
  failure: "#ff0055",
  cancelled: "#8b9bb4",
  skipped: "#8b9bb4",
  neutral: "#ffcc00",
};
