#!/usr/bin/env node
// Setter inn felles header og footer i alle HTML-sider.
// Kjøres manuelt etter endring i scripts/partials/: node scripts/sync-partials.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, htmlFiles } from './lib.mjs';

const parts = {
  HEADER: readFileSync(join(ROOT, 'scripts/partials/header.html'), 'utf8').trim(),
  FOOTER: readFileSync(join(ROOT, 'scripts/partials/footer.html'), 'utf8').trim(),
};

let changed = 0;
for (const file of htmlFiles()) {
  const path = join(ROOT, file);
  const before = readFileSync(path, 'utf8');
  let html = before;
  for (const [name, content] of Object.entries(parts)) {
    const re = new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`);
    if (!re.test(html)) {
      console.warn(`  ${file}: mangler <!-- ${name}:START/END --> (hoppet over)`);
      continue;
    }
    html = html.replace(re, () => `<!-- ${name}:START -->\n${content}\n<!-- ${name}:END -->`);
  }
  if (html !== before) {
    writeFileSync(path, html);
    changed++;
    console.log(`  oppdatert ${file}`);
  }
}
console.log(`Ferdig. ${changed} fil(er) endret.`);
