#!/usr/bin/env node
// Sender alle URL-ene i sitemap.xml til IndexNow (Bing, Yandex m.fl.).
// Kjøres etter at endringene er deployet: node scripts/indexnow.mjs
// Valgfritt: --dry-run viser hva som sendes uten å sende.
// Nøkkelen er navnet på <32 hex-tegn>.txt i roten (filinnholdet = nøkkelen).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const HOST = 'www.austmedia.no';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const keyFile = readdirSync(ROOT).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('Fant ingen IndexNow-nøkkelfil (<32 hex-tegn>.txt) i roten.');
  process.exit(1);
}
const key = keyFile.slice(0, -4);
if (readFileSync(join(ROOT, keyFile), 'utf8').trim() !== key) {
  console.error(`${keyFile}: innholdet må være nøyaktig nøkkelen.`);
  process.exit(1);
}

const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) {
  console.error('Fant ingen URL-er i sitemap.xml.');
  process.exit(1);
}

const body = { host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList };
console.log(`${urlList.length} URL-er, nøkkel ${keyFile}`);
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

// Sjekk at nøkkelfilen faktisk ligger ute før vi sender
const live = await fetch(body.keyLocation);
const liveText = live.ok ? (await live.text()).trim() : '';
if (liveText !== key) {
  console.error(`Nøkkelfilen svarer ikke riktig på ${body.keyLocation} (status ${live.status}). Er endringen deployet?`);
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
const text = await res.text();
console.log(`IndexNow svarte ${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
