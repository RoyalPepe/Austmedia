# Aust Media – nettside

Statisk nettside. Ingen byggesteg: HTML-filer, `assets/` (CSS/JS) og `media/`.
Vercel deployer automatisk fra `main`. `vercel.json` gir rene URL-er med skråstrek til slutt.

## Struktur
- Hver side ligger i egen mappe: `/priser/index.html` vises som `/priser/`.
- Felles stil og skript: `assets/style.css` og `assets/main.js`.
- Header og footer er like på alle sider. Rediger dem i `scripts/partials/`, ikke i sidene.

## Skript (kjøres manuelt med Node, ingen npm-install)
- `node scripts/sync-partials.mjs`: kopierer header/footer inn i alle sider
  (mellom `<!-- HEADER:START -->`/`END` og `<!-- FOOTER:START -->`/`END`).
- `node scripts/build-sitemap.mjs`: lager `sitemap.xml` på nytt (hopper over noindex-sider).
- `node scripts/check-site.mjs --table`: sjekker lenker, H1, alt-tekster, title/description,
  canonical, JSON-LD og at FAQ-schema matcher den synlige FAQ-en.

Etter endringer: kjør alle tre før du pusher.

## Ny side
Kopier en eksisterende side til ny mappe, endre title, description, canonical, og:url,
brødsmuler og JSON-LD. Kjør så de tre skriptene.

Se `TODO-EIRIK.md` for alt som må fylles inn før lansering.

## Legg den ut (GitHub + Vercel)
1. Lag et nytt repo på github.com, f.eks. `austmedia`.
2. Dra inn `index.html`, `media/`-mappen og denne filen. Commit.
3. Gå til vercel.com → Add New → Project → importer repoet.
   Framework: Other. Build command: tom. Output directory: tom (root).
4. Deploy. Senere endringer: push til GitHub, Vercel deployer automatisk.
5. Domene: Vercel → Settings → Domains → legg til austmedia.no,
   og pek DNS hos Domeneshop dit (A/CNAME-verdiene Vercel oppgir).

## Før lansering
- Skjemaet: lag konto på formspree.io, bytt FORM_ID i index.html med din egen (se TODO-EIRIK.md).
- E-post: post@austmedia.no er satt inn – endre hvis adressen blir en annen.
- Sjekk at kundene er ok med å bli vist som referanser.

## Bytte ut video eller bilde
Legg den nye filen i media/ med samme navn, eller endre filnavnet i HTML-en.
Husk width/height på nye bilder (faktiske pikselmål).
Videoer bør være MP4 (H.264), under 10 MB. Loopene er uten lyd fordi
nettlesere bare tillater automatisk avspilling når lyden er av.
Hvert klipp har et stillbilde (poster) som vises før videoen laster.
