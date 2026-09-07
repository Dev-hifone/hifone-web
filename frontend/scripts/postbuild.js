/**
 * react-snap sometimes exits with a non-zero code even after a fully
 * successful crawl (warnings like broken third-party images or a 404 page
 * title check can trip this). Chaining "react-snap && node fix-titles.js"
 * in package.json means the cleanup script silently never runs whenever
 * that happens. This wrapper runs react-snap, and runs the title cleanup
 * unconditionally afterward regardless of react-snap's own exit code.
 */
const { execSync } = require('child_process');

try {
  execSync('npx react-snap', { stdio: 'inherit' });
} catch (err) {
  console.warn('[postbuild] react-snap exited with a non-zero code — this can happen even on a fully successful crawl. Continuing to post-process the output.');
}

require('./fix-duplicate-titles.js');
