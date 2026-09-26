#!/usr/bin/env node
// Lager sitemap.xml fra mappestrukturen. Sider med <meta name="robots" content="noindex">
// og 404.html tas ikke med. Kjøres manuelt: node scripts/build-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, SITE, htmlFiles, urlPath } from './lib.mjs';

function lastmod(file) {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (d) return d;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

const urls = [];
for (const file of htmlFiles()) {
  const path = urlPath(file);
  if (!path) continue;
  const html = readFileSync(join(ROOT, file), 'utf8');
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) continue;
  urls.push({ loc: SITE + path, lastmod: lastmod(file) });
}
urls.sort((a, b) => (a.loc === SITE + '/' ? -1 : b.loc === SITE + '/' ? 1 : a.loc.localeCompare(b.loc)));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URL-er`);
urls.forEach(u => console.log('  ' + u.loc));
