# TODO for Eirik – før lansering

Gjenstående plassholdere er merket med `<!-- TODO(eirik): … -->` i HTML.

Finn alle med: `grep -rn "TODO(eirik)" --include=*.html .`

> **Viktig om FAQ:** Når du legger til eller endrer et FAQ-svar, må du oppdatere teksten
> **både** i `<details>` og i FAQPage-JSON-LD i `<head>` på samme side. Kjør
> `node scripts/check-site.mjs`. Den melder feil hvis de ikke er like.

---

## 1. Kritisk – må på plass før lansering

### Vilkår
- [ ] **Musikklisens** for reklamefilm: avklar hvordan musikk lisensieres. FAQ-spørsmålet
      «Hva med musikk og rettigheter?» er fjernet fra `/reklamefilm-bodo/` – legg inn igjen når det er avklart.

### Referanser
- [ ] Sjekk at alle kundene er ok med å bli vist som referanser (logoer og caser)

## 2. Innhold som er fjernet til du har det

Disse feltene var tomme og er fjernet fra sidene. Legg dem inn igjen når du har innholdet
(husk FAQ-schema for FAQ-spørsmål).

### Caser
- `/arbeid/bodo-golfklubb/`: seksjonen «Utfordringen» (hva klubben ville oppnå), tall/resultater og kundesitat
- `/arbeid/gundersons/`: «Resultat» (tall) og kundesitat – legges inn mellom «Hva vi lagde» og «Tjenester brukt»
- `/arbeid/blendzz/`: «Resultat» og kundesitat
- Valgfritt: periode for Gundersons-jobben

### Tjenestesider
- `/annonsering-bodo/` (FAQ): «Hvor stort annonsebudsjett trenger vi?» (anbefalt minste budsjett per måned)
- `/bedriftsfoto-bodo/` (FAQ): «Hvor lang tid tar det per ansatt?»
- `/nettsider-bodo/` (FAQ): «Hvor lang tid tar det å lage en nettside?», «Kan jeg oppdatere siden selv?», «Hva med domene og hosting?»
- `/reklamefilm-bodo/` (FAQ): «Hvor lang tid tar det å lage en reklamefilm?»
- `/sosiale-medier-bodo/` (FAQ): «Svarer dere på kommentarer og meldinger?»
- `/videoproduksjon-bodo/`: lengde på opptaksdag og hva som inngår; teksting og leveringstid i «Leveranser»;
  1–2 setninger om Lykke Binderi; FAQ «Hvor mye tid må vi sette av til en opptaksdag?» og «Får vi råmaterialet?»

### Om oss
- `/om-oss/`: kort personlig tekst fra Eirik (bakgrunn, hvorfor du startet, hva du brenner for)

## 3. Senere / valgfritt

- [ ] **Drone**: lag bare `/drone-bodo/` hvis du har drone og kompetansebevis fra Luftfartstilsynet.
- [ ] Legg til Google-bedriftsprofil og lenk den i `sameAs` i organisasjons-schemaet på forsiden.
- [ ] Hvis du får en fast adresse: legg til `streetAddress` og `postalCode` i schemaet på forsiden.
- [ ] Video-filene er store (golf-reel.mp4 9,9 MB). Komprimering til 2–4 MB gir raskere lasting.
