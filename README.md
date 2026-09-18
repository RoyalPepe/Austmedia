# Aust Media – nettside

Statisk nettside. Ingen byggesteg: index.html + mappen media/.

## Legg den ut (GitHub + Vercel)
1. Lag et nytt repo på github.com, f.eks. `austmedia`.
2. Dra inn `index.html`, `media/`-mappen og denne filen. Commit.
3. Gå til vercel.com → Add New → Project → importer repoet.
   Framework: Other. Build command: tom. Output directory: tom (root).
4. Deploy. Senere endringer: push til GitHub, Vercel deployer automatisk.
5. Domene: Vercel → Settings → Domains → legg til austmedia.no,
   og pek DNS hos Domeneshop dit (A/CNAME-verdiene Vercel oppgir).

## Før lansering
- Skjemaet: lag konto på formspree.io, bytt FORM_ID i index.html med din egen.
- E-post: post@austmedia.no er satt inn – endre hvis adressen blir en annen.
- Kundeliste: [Kunde 5] og [Kunde 6] må fylles inn eller fjernes.
- Sjekk at kundene er ok med å bli vist som referanser.

## Bytte ut video eller bilde
Legg den nye filen i media/ med samme navn, eller endre filnavnet i index.html.
Videoer bør være MP4 (H.264), under 10 MB. Loopene er uten lyd fordi
nettlesere bare tillater automatisk avspilling når lyden er av.
Hvert klipp har et stillbilde (poster) som vises før videoen laster.
