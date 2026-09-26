# TODO for Eirik – før lansering

Alle plassholdere på nettstedet. I HTML er de merket med `<!-- TODO(eirik): … -->`
og vises på siden som gule `[TODO: …]`-merker. De må fjernes før nettstedet publiseres.

Finn alle med: `grep -rn "TODO(eirik)" --include=*.html .`

> **Viktig om FAQ:** Flere FAQ-svar er TODO. Når du fyller inn et FAQ-svar, må du
> oppdatere teksten **både** i `<details>` og i FAQPage-JSON-LD i `<head>` på samme
> side. Kjør `node scripts/check-site.mjs`. Den melder feil hvis de ikke er like.

---

## 1. Kritisk – må på plass før lansering

### Kontaktskjema (Formspree)
- [ ] **Formspree-ID.** Lag et skjema på formspree.io og bytt `FORM_ID` i `index.html`
      (`action="https://formspree.io/f/FORM_ID"`). Til det er gjort, **sender ikke
      skjemaet noe**. Besøkende ser da en feilmelding med e-post og telefon.
      Innsending går via AJAX og sender til `/takk/` ved suksess.

### Priser
- [ ] `/priser/`: pris for **Start** (engangs), **Synlig** (fra kr/mnd) og **Vekst** (fra kr/mnd)
- [ ] `/priser/`: antall reels og bilder i Start, antall reels og innlegg i Synlig
- [ ] `/priser/`: pris fra-beløp for **reklamefilm**, **bedriftsfoto** og **nettside**
- [ ] `/priser/`: er prisene inkl. eller eks. mva.?
- [ ] Forsiden (FAQ): «faste pakker fra [pris] kr i måneden» (laveste månedspakke)
- [ ] Samme priser gjentas på: `/sosiale-medier-bodo/` (Pakker), `/reklamefilm-bodo/` (teaser + FAQ),
      `/videoproduksjon-bodo/`, `/bedriftsfoto-bodo/`, `/annonsering-bodo/` (Vekst), `/nettsider-bodo/` (teaser + FAQ)

### Vilkår (juridisk viktig – ikke gjett)
- [ ] **Bindingstid**: forsiden (FAQ) og `/priser/` (FAQ)
- [ ] **Bruksrett** for bilder og video: forsiden (FAQ), `/bedriftsfoto-bodo/` (seksjon + FAQ),
      `/videoproduksjon-bodo/` (leveranser + FAQ)
- [ ] **Musikklisens** og bruksrett for reklamefilm: `/reklamefilm-bodo/` (FAQ)
- [ ] **Hvem eier annonsekontoen**: `/annonsering-bodo/` (FAQ)
- [ ] **Råmateriale** – får kunden det? `/videoproduksjon-bodo/` (FAQ)
- [ ] **Domene og hosting** for nettsider: `/nettsider-bodo/` (FAQ)

### Navn
- [ ] **Bekreft riktig klubbnavn**: «Bodø Golfklubb» er brukt overalt. Det gamle nettstedet
      skrev også «Ilstad Golfklubb». Gjelder `/`, `/arbeid/`, `/arbeid/bodo-golfklubb/`,
      `/reklamefilm-bodo/`, `/annonsering-bodo/`
- [ ] Sjekk at alle kundene er ok med å bli vist som referanser (logoer og caser)

## 2. Viktig – innhold som gir tillit og rangering

### Caser
- [ ] `/arbeid/bodo-golfklubb/`: utfordring, konkrete resultater (tall), sitat med navn og tillatelse
- [ ] `/arbeid/gundersons/`: ingress, periode, utfordring, hva vi lagde (antall reels, tema, format), resultat, sitat
- [ ] `/arbeid/blendzz/`: ingress, utfordring, hva vi lagde (antall og typer bilder), resultat, sitat
- [ ] Forsiden (Utvalgt arbeid): 2–3 setninger om **Gundersons** og om **Blendzz**
- [ ] `/sosiale-medier-bodo/`: 3–4 setninger om Gundersons (utgangspunkt, innhold, resultat)
- [ ] `/videoproduksjon-bodo/`: 1–2 setninger om Gundersons og om **Lykke Binderi**
- [ ] `/bedriftsfoto-bodo/`: 1–2 setninger om Blendzz og om **Hundefisk**
- [ ] `/nettsider-bodo/`: beskriv nettsidearbeidet for **Hundefisk**, og bekreft at dere faktisk har laget nettsiden deres.
      Hvis ikke, bytt eksempel eller fjern seksjonen.

### Om oss
- [ ] `/om-oss/`: kort personlig tekst fra Eirik (bakgrunn, hvorfor du startet, hva du brenner for)

## 3. Detaljer i tjenestene

- [ ] `/sosiale-medier-bodo/` (FAQ): svarer dere på kommentarer og meldinger?
- [ ] `/reklamefilm-bodo/` (FAQ): typisk tid fra oppstart til ferdig film
- [ ] `/reklamefilm-bodo/` (FAQ): er teksting inkludert i prisen?
- [ ] `/videoproduksjon-bodo/`: hvor lenge varer en opptaksdag, hva inngår, hvor mye tid må de ansatte sette av?
- [ ] `/videoproduksjon-bodo/` (leveranser): teksting inkludert? Typisk leveringstid?
- [ ] `/bedriftsfoto-bodo/`: antall bilder per fotografering, filformater og oppløsning, leveringstid, tid per ansatt
- [ ] `/annonsering-bodo/` (FAQ): anbefalt minste annonsebudsjett per måned
- [ ] `/nettsider-bodo/` (FAQ): typisk tid fra oppstart til ferdig side, og hvordan kunden oppdaterer innhold selv

## 4. Senere / valgfritt

- [ ] **Drone**: lag bare `/drone-bodo/` hvis du har drone og kompetansebevis fra Luftfartstilsynet.
- [ ] Legg til Google-bedriftsprofil og lenk den i `sameAs` i organisasjons-schemaet på forsiden.
- [ ] Hvis du får en fast adresse: legg til `streetAddress` og `postalCode` i schemaet på forsiden.
- [ ] Video-filene er store (golf-reel.mp4 9,9 MB). Komprimering til 2–4 MB gir raskere lasting.
