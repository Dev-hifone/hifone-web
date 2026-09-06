/**
 * react-snap (combined with react-helmet-async) leaves the static <title> from
 * index.html sitting in the captured HTML alongside the real, page-specific
 * title Helmet sets at runtime -- every crawled page ends up with two <title>
 * tags. This walks the build output after react-snap runs and keeps only the
 * first <title> tag per file (the correct, page-specific one), dropping any
 * others.
 *
 * Wired in as part of "postbuild" in package.json, after react-snap.
 */
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function dedupeTitles(html) {
  const titleTagRe = /<title[^>]*>[\s\S]*?<\/title>/gi;
  const matches = html.match(titleTagRe);
  if (!matches || matches.length < 2) return { html, changed: false };

  // Keep the first occurrence, drop the rest.
  let seenFirst = false;
  const result = html.replace(titleTagRe, (match) => {
    if (!seenFirst) {
      seenFirst = true;
      return match;
    }
    return '';
  });
  return { html: result, changed: true };
}

function main() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('[fix-duplicate-titles] No build directory found, skipping.');
    return;
  }

  const files = walk(BUILD_DIR);
  let fixedCount = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const { html, changed } = dedupeTitles(original);
    if (changed) {
      fs.writeFileSync(file, html, 'utf8');
      fixedCount++;
    }
  }

  console.log(`[fix-duplicate-titles] Checked ${files.length} files, fixed ${fixedCount} with duplicate <title> tags.`);
}

main();
