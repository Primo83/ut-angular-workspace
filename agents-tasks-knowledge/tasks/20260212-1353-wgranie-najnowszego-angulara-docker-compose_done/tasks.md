# Plan zadań 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal - Wgranie najnowszego Angulara (docker compose)

> Szybki start: skopiuj katalog `template-task_proposal/` do `tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/`, zmień nagłówek/tabelę, a w `agents-tasks-knowledge/SESSION*.md` ustaw `current-task = 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal`, `current-id-t = 01`.

<!-- UWAGA: Daty w tabeli muszą odzwierciedlać faktyczny czas pracy. -->

<!-- audit-gate:plan-v1 -->

| ID-T | Status   | Agent | Rodzic | Zadanie                                                               | Opis                                                                                                  | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory                                                                                                    |
|------|----------|-------|--------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| 01 | done | gui-1 |  | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Uporządkuj sekcje 1-8 w `additional-contexts.md`, dodaj otwarte pytania w sekcji 6, zaproponuj kolejne ID-T i statusy. | 2026-02-12 13:53 | 2026-02-12 16:14 | Uzupełniono `additional-contexts.md` (Docker-only, host port `4299`, decyzje P1–P9 domknięte; vitest; `make up` zapewnia deps; lint przez `angular-eslint`; fix perms dla named volume `/app/node_modules` przez wymaganie zapisywalnego mountpointu, np. `chmod 0777`). Audyty (kompletna runda `20260212-1557`, P0=0/P1=0): Claude PASS (`additional-notes/20260212-1557-plan-audit-claude.md`), Gemini PASS (`additional-notes/20260212-1557-plan-audit-gemini.md`), subagent PASS (`additional-notes/20260212-1557-plan-audit-subagent-6.md`), subagent PASS (`additional-notes/20260212-1557-plan-audit-subagent-7.md`). |
| 02 | done | gui-1 | 01 | Finalizacja toolchainu (Node/Angular) + spisanie w README | Zweryfikuj wersje: Angular/CLI (latest stable na moment implementacji) i kompatybilny Node; zapisz w `ut-angular/README.md` i w Dockerfile. Ustal docelową nazwę pliku compose (`compose.yaml` vs `docker-compose.yml`). | 2026-02-12 14:34 | 2026-02-12 16:55 | Zweryfikowano latest stable na npm: `@angular/cli@21.1.4` (engines: `node ^20.19.0` lub `^22.12.0` lub `>=24.0.0`). Wybrano dev image `node:22.22.0-bookworm-slim` i plik compose: `ut-angular/compose.yaml`. Zaktualizowano `ut-angular/README.md` (toolchain + port `4299`) oraz przypięto Node w `ut-angular/docker/Dockerfile.dev`. |
| 03 | done | gui-1 | 01 | Bootstrap Angular „latest stable” w `ut-angular/` (bez lokalnego Node) | Wygeneruj projekt Angular w istniejącym (niepustym) `ut-angular/` tak, aby nie nadpisać plików instrukcji (`AGENTS/CLAUDE/GEMINI.md`). Wykonaj bootstrap w kontenerze generując do katalogu tymczasowego i przenosząc do `ut-angular/`. Wymagane flagi (powtarzalność + brak nested git): `--skip-git --interactive=false --defaults --package-manager=npm --test-runner=vitest` + jawne ustawienie `--style=scss` i `--routing` (żeby uniknąć promptów). Utrwal wersje w lockfile, a lint skonfiguruj przez `ng add angular-eslint --skip-confirmation --interactive=false --defaults` (tak, aby `ng lint` działało). | 2026-02-12 14:34 | 2026-02-12 16:55 | Bootstrap wykonany w Dockerze (Angular CLI `21.1.4`) do katalogu tymczasowego i przeniesiony do `ut-angular/` bez nadpisania plików instrukcji. Wykonano instalację deps w kontenerze (`make -C ut-angular deps`) i wygenerowano `ut-angular/package-lock.json`. Skonfigurowano lint przez `ng add angular-eslint` + dodano `ut-angular/eslint.config.js` tak, aby `ng lint` działało. |
| 04 | done | gui-1 | 01 | Docker: `docker compose` + Dockerfile dla dev (port 4299) | Dodaj plik compose (`ut-angular/compose.yaml` lub `ut-angular/docker-compose.yml`) + `ut-angular/docker/Dockerfile.dev` + `.dockerignore`. Wymagania: `ng serve --host 0.0.0.0`, mapowanie host port `4299`, `user: ${UID}:${GID}` (brak root-owned), bind mount kodu + named volume dla `/app/node_modules` (+ opcjonalnie `.angular/cache`), oraz mountpoint `/app/node_modules` przygotowany w obrazie jako zapisywalny (np. `chmod 0777`) żeby uniknąć `EACCES` przy `npm ci`. Toggle dla watcherów (polling). `make test` (`ng test --watch=false`, vitest) i `make lint` (`ng lint`) bez lokalnego Node. | 2026-02-12 14:34 | 2026-02-12 16:55 | Dodano `ut-angular/compose.yaml` (port host `4299:4200`, `user: \"${UID}:${GID}\"`, `HOME=/tmp`, `NPM_CONFIG_CACHE=/tmp/.npm`, named volume `node_modules`, `ng serve --host 0.0.0.0`). Dodano `ut-angular/docker/Dockerfile.dev` (mountpoint `/app/node_modules` zapisywalny: `chmod 0777`) + `ut-angular/.dockerignore`. |
| 05 | done | gui-1 | 01 | Makefile + README + aktualizacja instrukcji `ut-angular/AGENTS.md` | Dodaj `ut-angular/Makefile` (cele min.: `deps`, `up`, `down`, `logs`, `test`, `lint`, `clean` (down -v)) oraz `ut-angular/README.md` (happy path). Wymóg: `make -C ut-angular up` na świeżym checkout ma najpierw zapewnić zależności w named volume (`npm ci` w kontenerze), a dopiero potem uruchomić dev‑serwer. Zaktualizuj `ut-angular/AGENTS.md`, aby komendy i ścieżki odzwierciedlały realny stan po bootstrapie. | 2026-02-12 14:34 | 2026-02-12 16:55 | Dodano `ut-angular/Makefile` (targets: `prepare/deps/up/up-d/down/clean/logs/sh/test/lint`) oraz zaktualizowano `ut-angular/README.md` (Docker-only, port `4299`, polling toggle). Zaktualizowano `ut-angular/AGENTS.md` pod realne ścieżki i komendy po bootstrapie. |
| 06 | done | gui-1 | 01 | Weryfikacja end-to-end na clean state | Zweryfikuj: `make -C ut-angular up` (apka na `http://localhost:4299/`), hot reload, `make -C ut-angular test` (non-watch), `make -C ut-angular lint`, brak root-owned plików. Dodaj wariant clean (np. `docker compose down -v` pod Makefile targetem). Napraw problemy z watcherem/volumes/uprawnieniami. | 2026-02-12 14:34 | 2026-02-12 16:56 | Clean state: `make -C ut-angular clean` -> `make -C ut-angular deps` -> `make -C ut-angular up-d` (HTTP 200 na `http://localhost:4299/`). Następnie: `make -C ut-angular test` PASS, `make -C ut-angular lint` PASS. Zweryfikowano brak root-owned plików w `ut-angular/` (po resecie volume `node_modules` po incydencie z EACCES). |
| 07 | on-hold | gui-1 | 02 | (Opcjonalnie) Profil prod (zależne od P2) | Out-of-scope w tym tasku (decyzja P2=dev-only). | 2026-02-12 14:56 | 2026-02-12 15:39 |  |
| 08 | done | gui-1 | 06 | Final audit + zamknięcie taska | Wykonaj audyty końcowe: 2x subagent + Claude + Gemini (raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`). Jeśli brak P0/P1 i brak blockerów: ustaw status taska na `_done` (`./taskctl move-status --to done`) i zaktualizuj `SESSION_gui-1.md`. | 2026-02-12 16:56 | 2026-02-12 17:16 | Final audit runda `20260212-1656`: subagent-1 PASS (`additional-notes/20260212-1656-final-audit-subagent-1.md`), subagent-2 PASS (`additional-notes/20260212-1656-final-audit-subagent-2.md`), Claude PASS (`additional-notes/20260212-1656-final-audit-claude.md`), Gemini PASS (`additional-notes/20260212-1656-final-audit-gemini.md`). P0=0, P1=0 (P2 nieblokujące). |

<!-- Dodawaj kolejne wiersze poniżej; dla nowych ID-T użyj statusów proposal/planning/planned w zależności od uzgodnień. -->

- Przy kolejnych wierszach ustaw `Agent` zgodnie z profilem (`api-1`, `gui-1`, `ba`, `human-pm`...).
- Jeśli zadanie obejmuje co najmniej dwa serwisy (np. `api` + `gui`), dodaj osobny krok „kontrakt międzyserwisowy” przed pierwszym krokiem implementacyjnym któregokolwiek z tych serwisów.
- Jeśli potrzebujesz dłuższych notatek, dodaj plik `additional-notes/<ID-T>.md` i wskaż go w kolumnie „Co zrobiono do tej pory".
- Po akceptacji planu ustaw `Status` wiersza `01` na `done` i, jeśli trzeba, zmień sufiks katalogu (np. `_planned`).

---

## Checklista przed zamknięciem `ID-T = 01`

Zanim ustawisz `Status` wiersza `01` na `done`, upewnij się że:

- [x] Zmieniono tytuł pliku `additional-contexts.md` (usunięto „szablon do skopiowania")
- [x] Usunięto podpowiedzi w kursywie (`_Tu wklej..._`) z `additional-contexts.md`
- [x] Wypełniono co najmniej sekcje 1–5 w `additional-contexts.md`
- [ ] Jeśli zadanie obejmuje co najmniej 2 serwisy (np. API + GUI), plan zawiera osobny krok „kontrakt międzyserwisowy” (minimum: operacje/endpointy, payloady, błędy, kompatybilność) i ten krok ma status `done` zanim ruszą ID‑T implementacyjne tych serwisów.
- [ ] Audyt planu ukończony: 2 subagenci + Claude + Gemini uruchomione równolegle; synteza i decyzje dopiero po komplecie 4 raportów (fallback wymaga decyzji właściciela); P1/P0 blokują, P2 po 3 rundach nie blokują; raporty w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-*.md` (i wpisane w `Co zrobiono do tej pory` w wierszu `01`)
- [ ] Jeśli task dotyka UI/przeglądarki: plan wymaga skrótu kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) + referencji do `/.env.test-accounts`; dla tasków bez UI `agent-browser` nie jest wymagany.
- [ ] Zmieniono daty `2026-02-12 13:53` na rzeczywiste w tej tabeli
- [x] Zmieniono tytuł tego pliku (usunięto „szablon do skopiowania")
- [x] Rozpisano kolejne wiersze planu (`02`, `03`...) z właściwymi statusami
- [x] Zaktualizowano `SESSION*.md` (`current-task`, `current-id-t`, `last-updated`)

---

## Checklista przed zamknięciem taska (`*_done`)

Zanim ustawisz status katalogu/zadania na `_done`, upewnij się że:

- [ ] Wszystkie ID‑T są `done` lub jawnie `on-hold` z uzasadnieniem.
- [ ] Wymagane testy/kwalifikowane kroki zostały wykonane i opisane.
- [ ] Audyty końcowe (2 subagenci + Claude + Gemini) uruchomione równolegle; synteza i decyzje dopiero po komplecie 4 raportów; bez zastrzeżeń; raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`.
- [ ] Jeśli task dotyka UI/przeglądarki, wykonano i opisano testy manualne `agent-browser` (start od `agent-browser connect 9222`) z użyciem danych z `/.env.test-accounts`.
- [ ] Brak aktywnych `[BLOCKER]`.
- [ ] `tasks.md` oraz `additional-notes/` zawierają komplet dowodów i notatek zamknięcia.
