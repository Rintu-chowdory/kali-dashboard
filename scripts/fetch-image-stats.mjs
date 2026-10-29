#!/usr/bin/env node
/**
 * Bakes real Docker image stats into dashboard/public/image.json.
 *
 * hub.docker.com and registry-1.docker.io do not send CORS headers, so the browser
 * cannot read them directly. This runs at build time (locally or in CI) instead, which
 * keeps the dashboard honest without needing a backend.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = process.env.IMAGE_REPO || 'riinnttuu/dev-env';
const TAG = process.env.IMAGE_TAG || 'latest';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../dashboard/public/image.json');

const json = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};

async function registryToken() {
  const { token } = await json(
    `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${REPO}:pull`,
  );
  return token;
}

function humanArch(platform) {
  if (!platform) return 'unknown';
  const { os, architecture, variant } = platform;
  return [os, architecture, variant].filter(Boolean).join('/');
}

/** Trims a Dockerfile build command out of the config history entry. */
function stepLabel(createdBy = '') {
  const cleaned = createdBy
    .replace(/^\/bin\/sh -c #\(nop\)\s*/, '')
    .replace(/^\/bin\/sh -c\s*/, '')
    // buildkit prefixes ARG expansions as |1 NAME=value; drop them for readability
    .replace(/^\|\d+\s+[A-Z_]+=\S*\s*/g, '')
    .replace(/\|\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 90 ? `${cleaned.slice(0, 88)}…` : cleaned || 'layer';
}

async function main() {
  const token = await registryToken();
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const accept = [
    'application/vnd.oci.image.index.v1+json',
    'application/vnd.docker.distribution.manifest.list.v2+json',
    'application/vnd.oci.image.manifest.v1+json',
    'application/vnd.docker.distribution.manifest.v2+json',
  ].join(',');

  const index = await json(`https://registry-1.docker.io/v2/${REPO}/manifests/${TAG}`, {
    ...auth,
    headers: { ...auth.headers, Accept: accept },
  });

  const manifests = index.manifests || [];
  // attestation manifests carry no architecture; they are not runnable platforms
  const platforms = manifests
    .filter((m) => m.platform?.architecture && m.platform.architecture !== 'unknown')
    .map((m) => humanArch(m.platform));

  const pick =
    manifests.find((m) => m.platform?.architecture === 'amd64' && m.platform?.os === 'linux') ||
    manifests[0];

  let layers = [];
  let sizeBytes = 0;
  let configDigest = '';

  if (pick) {
    const manifest = await json(`https://registry-1.docker.io/v2/${REPO}/manifests/${pick.digest}`, {
      ...auth,
      headers: { ...auth.headers, Accept: accept },
    });
    const rawLayers = manifest.layers || [];
    sizeBytes = rawLayers.reduce((sum, l) => sum + (l.size || 0), 0);
    configDigest = manifest.config?.digest || '';

    let history = [];
    if (configDigest) {
      const config = await json(`https://registry-1.docker.io/v2/${REPO}/blobs/${configDigest}`, auth);
      history = (config.history || []).filter((h) => !h.empty_layer);
    }

    layers = rawLayers.map((layer, i) => ({
      digest: layer.digest?.replace('sha256:', '').slice(0, 12) || '',
      sizeBytes: layer.size || 0,
      step: history[i] ? stepLabel(history[i].created_by) : `layer ${i + 1}`,
    }));
  }

  let pulls = null;
  let lastPushed = null;
  try {
    const hub = await json(`https://hub.docker.com/v2/repositories/${REPO}/`);
    pulls = hub.pull_count ?? null;
    lastPushed = hub.last_updated ?? null;
  } catch {
    // The Hub API is optional: registry data alone is enough for the size breakdown.
  }

  const payload = {
    name: REPO,
    tag: TAG,
    generatedAt: new Date().toISOString(),
    sizeBytes,
    compressedSizeBytes: sizeBytes,
    pulls,
    lastPushed,
    platforms,
    configDigest,
    layers,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  const mb = (sizeBytes / 1024 / 1024).toFixed(1);
  console.log(`image.json written: ${REPO}:${TAG} ${mb} MB compressed, ${layers.length} layers, ${platforms.length} platforms`);
}

main().catch((err) => {
  console.error(`fetch-image-stats failed: ${err.message}`);
  process.exit(1);
});
