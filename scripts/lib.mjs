// Felles hjelpefunksjoner for skriptene i scripts/. Ingen avhengigheter.
import { readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = 'https://www.austmedia.no';
const SKIP = new Set(['.git', '.vercel', 'node_modules', 'scripts']);

// Alle .html-filer i nettstedet (relativ sti med /)
export function htmlFiles(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name) || name.startsWith('_')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(relative(ROOT, p).split(sep).join('/'));
  }
  return out.sort();
}

// index.html -> /, arbeid/index.html -> /arbeid/, 404.html -> null
export function urlPath(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return '/' + file.slice(0, -'index.html'.length);
  return null;
}
