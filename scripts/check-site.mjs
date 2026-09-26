#!/usr/bin/env node
// Kvalitetssjekk av hele nettstedet. Ingen avhengigheter.
// Kjør: node scripts/check-site.mjs
// Sjekker: interne lenker og mediestier, H1/overskriftshierarki, alt-tekster og bildemål,
// title/description (unike, lengde), canonical, JSON-LD (parser + FAQ = synlig tekst) og sitemap.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, SITE, htmlFiles, urlPath } from './lib.mjs';

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };
const text = s => s
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<[^>]+>/g, '')
  .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ENT[e])
  .replace(/\s+/g, ' ')
  .trim();

const files = htmlFiles();
const pages = Object.fromEntries(files.map(f => [f, readFileSync(join(ROOT, f), 'utf8')]));

// Finn fil for en intern sti (/arbeid/ -> arbeid/index.html)
function resolve(path) {
  path = decodeURIComponent(path);
  if (path.endsWith('/')) {
    const f = path.slice(1) + 'index.html';
    return existsSync(join(ROOT, f)) ? f : null;
  }
  const f = path.slice(1);
  if (existsSync(join(ROOT, f))) return f;
  if (existsSync(join(ROOT, f + '.html'))) return f + '.html';
  return null;
}

const meta = [];
for (const [file, html] of Object.entries(pages)) {
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);

  // --- lenker og mediestier ---
  for (const m of html.matchAll(/\s(href|src|poster)="([^"]*)"/g)) {
    const [, attr, raw] = m;
    if (attr === 'srcset') {
      for (const part of raw.split(',')) {
        const u = part.trim().split(/\s+/)[0];
        if (!resolve(u)) err(file, `død sti i srcset: ${u}`);
      }
      continue;
    }
    const url = raw;
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(url)) continue;
    if (url.startsWith('#')) {
      const id = url.slice(1);
      if (id && !html.includes(`id="${id}"`)) err(file, `anker ${url} finnes ikke på siden`);
      continue;
    }
    if (!url.startsWith('/')) { err(file, `relativ sti ${attr}="${url}" (bruk absolutt /...)`); continue; }
    const [path, hash] = url.split('#');
    const target = resolve(path.split('?')[0]);
    if (!target) { err(file, `død lenke/sti ${attr}="${url}"`); continue; }
    if (attr === 'href' && target.endsWith('.html') && !path.endsWith('/') && path !== '/404.html')
      warn(file, `lenke uten skråstrek til slutt: ${url}`);
    if (hash && pages[target] && !pages[target].includes(`id="${hash}"`)) err(file, `anker #${hash} finnes ikke i ${target}`);
  }

  // --- overskrifter ---
  const body = html.replace(/<footer[\s\S]*<\/footer>/, '');
  const heads = [...body.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  const h1 = heads.filter(h => h === 1).length;
  if (h1 !== 1) err(file, `${h1} H1-er (skal være én)`);
  if (heads[0] !== 1) err(file, `første overskrift er H${heads[0]}, ikke H1`);
  for (let i = 1; i < heads.length; i++)
    if (heads[i] > heads[i - 1] + 1) err(file, `hopper fra H${heads[i - 1]} til H${heads[i]}`);

  // --- bilder ---
  const visible = html.replace(/<(ul|div)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, '');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) err(file, `img uten width/height: ${tag.slice(0, 80)}`);
    if (!/\salt="/.test(tag)) err(file, `img uten alt: ${tag.slice(0, 80)}`);
  }
  for (const m of visible.matchAll(/<img\b[^>]*>/g))
    if (/\salt=""/.test(m[0])) err(file, `tom alt på synlig bilde: ${m[0].slice(0, 80)}`);

  // --- head ---
  if (!/<html lang="nb">/.test(html)) err(file, 'mangler lang="nb"');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) err(file, 'mangler <title>');
  if (!desc) err(file, 'mangler meta description');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const path = urlPath(file);
  if (!noindex) {
    if (!canon) err(file, 'mangler canonical');
    else if (canon !== SITE + path) err(file, `canonical ${canon} ≠ ${SITE + path}`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url'])
      if (!html.includes(`property="${p}"`)) err(file, `mangler ${p}`);
  }
  meta.push({ file, title: title || '', desc: desc || '', noindex });

  // --- JSON-LD ---
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const types = [];
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b); } catch (e) { err(file, `JSON-LD parser ikke: ${e.message}`); continue; }
    types.push(data['@type']);
    if (/TODO/.test(b)) warn(file, `JSON-LD (${data['@type']}) inneholder TODO – fyll inn før lansering`);
    if (data['@type'] === 'FAQPage') {
      const shown = [...html.matchAll(/<details>[\s\S]*?<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
        .map(m => ({ q: text(m[1]), a: text(m[2]) }));
      const schema = data.mainEntity.map(q => ({ q: q.name, a: q.acceptedAnswer.text }));
      if (shown.length !== schema.length) err(file, `FAQ: ${shown.length} synlige spørsmål, ${schema.length} i schema`);
      schema.forEach((s, i) => {
        if (!shown[i]) return;
        if (s.q !== shown[i].q) err(file, `FAQ-spørsmål ${i + 1} avviker:\n    schema: ${s.q}\n    synlig: ${shown[i].q}`);
        if (s.a !== shown[i].a) err(file, `FAQ-svar ${i + 1} avviker:\n    schema: ${s.a}\n    synlig: ${shown[i].a}`);
      });
    }
  }
  if (html.includes('<details>') && !types.includes('FAQPage')) err(file, 'har FAQ men mangler FAQPage-schema');
  if (path && path !== '/' && !noindex) {
    if (!types.includes('BreadcrumbList')) err(file, 'mangler BreadcrumbList-schema');
    if (!html.includes('class="crumbs"')) err(file, 'mangler synlige brødsmuler');
  }
}

// --- unikhet og lengde ---
const indexable = meta.filter(m => !m.noindex);
for (const key of ['title', 'desc']) {
  const seen = {};
  for (const m of indexable) (seen[m[key]] ||= []).push(m.file);
  for (const [v, fs] of Object.entries(seen)) if (fs.length > 1) err(fs.join(', '), `duplisert ${key}: ${v}`);
}
for (const m of indexable) {
  if (m.title.length > 60) warn(m.file, `title er ${m.title.length} tegn (> 60)`);
  if (m.desc.length > 160) warn(m.file, `description er ${m.desc.length} tegn (> 160)`);
}

// --- sitemap ---
const sm = existsSync(join(ROOT, 'sitemap.xml')) ? readFileSync(join(ROOT, 'sitemap.xml'), 'utf8') : '';
const inSitemap = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
const expected = new Set(indexable.map(m => urlPath(m.file)).filter(Boolean).map(p => SITE + p));
for (const u of expected) if (!inSitemap.has(u)) err('sitemap.xml', `mangler ${u}`);
for (const u of inSitemap) if (!expected.has(u)) err('sitemap.xml', `skal ikke være med: ${u}`);

// --- rapport ---
if (process.argv.includes('--table')) {
  console.log('\n| Side | Title (tegn) | Description (tegn) |\n|---|---|---|');
  for (const m of meta) console.log(`| ${urlPath(m.file) || m.file}${m.noindex ? ' (noindex)' : ''} | ${m.title} (${m.title.length}) | ${m.desc.length} |`);
  console.log();
}
console.log(`Sjekket ${files.length} sider.`);
warnings.forEach(w => console.log('  ADVARSEL ' + w));
errors.forEach(e => console.log('  FEIL     ' + e));
console.log(errors.length ? `${errors.length} feil.` : 'Ingen feil.');
process.exit(errors.length ? 1 : 0);
