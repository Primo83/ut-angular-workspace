# ID-T 07 - Definicja "serwis 100%"

Status: done
Owner: gui-1

## Definicja
"100%" = wszystkie ponizsze punkty sa PASS:
1. Pokrycie 50/50 smaczkow w macierzy (`02-macierz-50-smaczkow.md`).
2. `make -C ut-angular lint` PASS.
3. `make -C ut-angular test` PASS.
4. Sciezka demo 30 min przechodzi bez blokujacych bledow.
5. Brak `console.error` i uncaught errors na sciezce krytycznej demo.
6. Live indexing dziala bez restartu.
7. Tooltipy dzialaja i sa czytelne dla laika.

## Checklista walidacyjna
- [x] Macierz 50/50 kompletna. (dowod: `additional-notes/02-macierz-50-smaczkow.md`, 50/50 mapped)
- [x] Lint PASS. (dowod: `make -C ut-angular lint` = "All files pass linting.")
- [x] Test PASS. (dowod: `make -C ut-angular test` = 35/35 PASS)
- [ ] Manual demo PASS. (do wykonania w ID-T=09)
- [ ] Console clean PASS. (do weryfikacji w ID-T=09 przez agent-browser)
- [x] Live indexing PASS. (dowod: sekcja Live Indexing dodana z add/replace/vacuum + 35 testow PASS)
- [x] Tooltipy/a11y PASS. (dowod: tooltipy dodane na wszystkich interaktywnych elementach wg copy-guide)

## Dowody
- Automaty: `additional-notes/08-tests.md`
- Manual: `additional-notes/09-manual.md`

## Mapa dowodow (punkt -> dowod)
- Punkt 1 (50/50): `additional-notes/02-macierz-50-smaczkow.md`
- Punkt 2-3 (lint/test): `additional-notes/08-tests.md`
- Punkt 4-7 (demo, console clean, live indexing, tooltipy): `additional-notes/09-manual.md`

## Wnioski dla kolejnych krokow

[HANDOFF: 08, 09]

- **Dla ID-T 08** (testy): checklista automatyczna jest zielona (lint + test PASS). Testy manualne jeszcze nie odhaczone — to jest zakres ID-T=09.
- **Dla ID-T 09** (manual + audyty): pozostaje odhaczenie punktow 4 i 5 (manual demo PASS i console clean PASS) przez agent-browser. Po odhaczeniu — checklista 100% kompletna.
