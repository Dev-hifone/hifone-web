/**
 * prerender-seo.mjs
 * Deterministic prerender for the dynamic /:slug SEO pages.
 *
 * Why this exists: the SEO landing pages are served by a client-side /:slug
 * route that fetches its data from the backend. react-snap's headless crawl
 * does not reliably discover or snapshot them, so crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Googlebot without JS) saw the empty SPA shell.
 *
 * This script asks the backend which SEO pages exist (/api/seo-slugs), fetches
 * each page's data, and writes build/<slug>/index.html with a real <title>,
 * meta description, canonical/OG tags and crawlable body content.
 *
 * The app mounts with createRoot().render(), which WIPES #root on load, so the
 * injected static HTML is only ever seen by no-JS crawlers — real users always
 * get the full React app. That means there is zero hydration-mismatch risk.
 *
 * Run AFTER `vite build` (and after react-snap), from the frontend/ folder:
 *   node scripts/prerender-seo.mjs
 *
 * Env overrides (optional):
 *   PRERENDER_BACKEND_URL  (default https://hifone-web.onrender.com)
 *   VITE_SITE_URL          (default https://hifone.com.au) — used for canonical/OG
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = join(__dirname, '..', 'build');
const BACKEND_URL = (process.env.PRERENDER_BACKEND_URL || 'https://hifone-web.onrender.com').replace(/\/$/, '');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://hifone.com.au').replace(/\/$/, '');
const API = `${BACKEND_URL}/api`;
const CONCURRENCY = 8;

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function getJSON(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw lastErr;
}

function buildBody(d) {
  const { device, service, pricing, location, service_details, related_services, related_devices } = d;
  const deviceName = device.name;
  const serviceName = service.name;
  const loc = location.name;
  const h1 = `${deviceName} ${serviceName} in ${loc}`;
  const price = pricing?.price;
  const orig = pricing?.original_price;
  const repairTime = pricing?.repair_time || '30-60 min';
  const warranty = pricing?.warranty || '90 days';

  const includes = (service_details?.includes || []).map((i) => `<li>${esc(i)}</li>`).join('');
  const issues = (service_details?.common_issues || []).map((i) => `<li>${esc(i)}</li>`).join('');
  const areas = (location?.areas_served || []).map(esc).join(', ');

  const relS = (related_services || [])
    .filter((r) => r.seo_slug)
    .map((r) => `<li><a href="/${esc(r.seo_slug)}">${esc(r.service_name)}${r.price ? ` — from $${r.price}` : ''}</a></li>`)
    .join('');
  const relD = (related_devices || [])
    .filter((r) => r.seo_slug && r.device_slug)
    .map((r) => `<li><a href="/${esc(r.seo_slug)}">${esc(r.device_name)} ${esc(serviceName)}${r.price ? ` — from $${r.price}` : ''}</a></li>`)
    .join('');

  const priceLine =
    price != null
      ? `<p><strong>Price:</strong> $${esc(price)}${orig ? ` (was $${esc(orig)})` : ''} &middot; <strong>Turnaround:</strong> ${esc(repairTime)} &middot; <strong>Warranty:</strong> ${esc(warranty)}</p>`
      : '';

  return `
      <h1>${esc(h1)}</h1>
      <p>Same-day repair with warranty included. Affordable pricing, premium parts, and expert technicians at ${esc(location.full_name || loc)}.</p>
      ${priceLine}
      <h2>${esc(serviceName)} for ${esc(deviceName)}</h2>
      <p>${esc(service.description || '')}</p>
      ${includes ? `<h3>What's included</h3><ul>${includes}</ul>` : ''}
      ${issues ? `<h3>Common issues we fix</h3><ul>${issues}</ul>` : ''}
      <h3>Service area</h3>
      <p>${esc(location.description || '')}</p>
      ${areas ? `<p><strong>Areas served:</strong> ${areas}</p>` : ''}
      ${relS ? `<h3>Other ${esc(deviceName)} repairs in ${esc(loc)}</h3><ul>${relS}</ul>` : ''}
      ${relD ? `<h3>Other devices we repair in ${esc(loc)}</h3><ul>${relD}</ul>` : ''}
      <p><a href="/book">Book your ${esc(deviceName)} ${esc(serviceName.toLowerCase())}</a> or call <a href="tel:0432977092">0432 977 092</a>.</p>`;
}

function buildHtml(template, d, slug) {
  const deviceName = d.device.name;
  const serviceName = d.service.name;
  const loc = d.location.name;
  const pageTitle = `${deviceName} ${serviceName} in ${loc}`;
  const fullTitle = /hifone/i.test(pageTitle) ? pageTitle : `${pageTitle} | HiFone Mobile Repairs Adelaide`;
  const desc = `Get ${deviceName} ${serviceName.toLowerCase()} in ${loc} with same-day service and warranty. Premium parts, expert technicians, no fix no pay. Book now at HiFone.`;
  const url = `${SITE_URL}/${slug}`;

  let html = template;

  // NOTE: all replacements below use FUNCTION replacers so that any `$` in the
  // interpolated content (e.g. prices like "$199") is treated literally and not
  // as a `$1`/`$2` regex backreference.

  const titleTag = `<title>${esc(fullTitle)}</title>`;
  if (/<title>[\s\S]*?<\/title>/.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, () => titleTag);
  } else {
    html = html.replace('</head>', () => `${titleTag}\n</head>`);
  }

  // Meta description
  const descTag = `<meta name="description" content="${esc(desc)}" />`;
  if (/<meta\s+name="description"[^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name="description"[^>]*>/i, () => descTag);
  } else {
    html = html.replace('</head>', () => `${descTag}\n</head>`);
  }

  // Canonical + OpenGraph (append before </head>)
  const headTags =
    `<link rel="canonical" href="${esc(url)}" />` +
    `<meta property="og:title" content="${esc(fullTitle)}" />` +
    `<meta property="og:description" content="${esc(desc)}" />` +
    `<meta property="og:url" content="${esc(url)}" />` +
    `<meta property="og:type" content="website" />`;
  html = html.replace('</head>', () => `${headTags}\n</head>`);

  // Inject crawlable body into the empty #root
  const body = buildBody(d);
  const before = html;
  html = html.replace(/(<div id="root">)\s*(<\/div>)/, (m, open, close) => `${open}${body}${close}`);
  if (html === before) {
    // Fallback: root wasn't the empty pattern — inject right after the opening tag
    html = html.replace(/(<div id="root"[^>]*>)/, (m, open) => `${open}${body}`);
  }
  return html;
}

async function runPool(items, worker, concurrency) {
  let idx = 0;
  let ok = 0;
  let fail = 0;
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      try {
        await worker(items[i]);
        ok++;
      } catch (e) {
        fail++;
        console.warn(`[prerender-seo] FAIL ${items[i]?.slug}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return { ok, fail };
}

async function main() {
  console.log(`[prerender-seo] backend: ${BACKEND_URL}`);
  const template = await readFile(join(BUILD_DIR, '200.html'), 'utf8');

  const { slugs = [] } = await getJSON(`${API}/seo-slugs`);
  // Dedupe by slug; require the parts needed to fetch page data
  const unique = [...new Map(slugs.map((s) => [s.slug, s])).values()].filter(
    (s) => s.slug && s.device_slug && s.service_slug,
  );
  console.log(`[prerender-seo] ${unique.length} unique SEO pages to prerender`);

  const { ok, fail } = await runPool(
    unique,
    async (s) => {
      const d = await getJSON(
        `${API}/seo-page-data?device_slug=${encodeURIComponent(s.device_slug)}&service_slug=${encodeURIComponent(
          s.service_slug,
        )}&location=${encodeURIComponent(s.location || 'adelaide')}`,
      );
      if (!d?.device || !d?.service) throw new Error('no page data');
      const html = buildHtml(template, d, s.slug);
      const dir = join(BUILD_DIR, s.slug);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'index.html'), html, 'utf8');
    },
    CONCURRENCY,
  );

  console.log(`[prerender-seo] done: ${ok} written, ${fail} failed`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error('[prerender-seo] fatal:', e);
  process.exit(1);
});
