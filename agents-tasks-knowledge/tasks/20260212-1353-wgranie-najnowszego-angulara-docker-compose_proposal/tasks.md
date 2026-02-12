# Plan zadań 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal - Wgranie najnowszego Angulara (docker compose)

> Szybki start: skopiuj katalog `template-task_proposal/` do `tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/`, zmień nagłówek/tabelę, a w `agents-tasks-knowledge/SESSION*.md` ustaw `current-task = 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal`, `current-id-t = 01`.

<!-- UWAGA: Po skopiowaniu zmień daty 2026-02-12 13:53 na rzeczywiste! -->

<!-- audit-gate:plan-v1 -->

| ID-T | Status   | Agent | Rodzic | Zadanie                                                               | Opis                                                                                                  | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory                                                                                                    |
|------|----------|-------|--------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| 01 | planning | gui-1 |  | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Uporządkuj sekcje 1-8 w `additional-contexts.md`, dodaj otwarte pytania w sekcji 6, zaproponuj kolejne ID-T i statusy. | 2026-02-12 13:53 | 2026-02-12 13:56 | Dopisano surowe dane: projekt w `ut-angular/`, workspace jako root, jeden Git na całość. Ustawiono `Agent=gui-1` oraz `SESSION_gui-1.md` na ID-T=01. |

<!-- Dodawaj kolejne wiersze poniżej; dla nowych ID-T użyj statusów proposal/planning/planned w zależności od uzgodnień. -->

- Przy kolejnych wierszach ustaw `Agent` zgodnie z profilem (`api-1`, `gui-1`, `ba`, `human-pm`...).
- Jeśli zadanie obejmuje co najmniej dwa serwisy (np. `api` + `gui`), dodaj osobny krok „kontrakt międzyserwisowy” przed pierwszym krokiem implementacyjnym któregokolwiek z tych serwisów.
- Jeśli potrzebujesz dłuższych notatek, dodaj plik `additional-notes/<ID-T>.md` i wskaż go w kolumnie „Co zrobiono do tej pory".
- Po akceptacji planu ustaw `Status` wiersza `01` na `done` i, jeśli trzeba, zmień sufiks katalogu (np. `_planned`).

---

## Checklista przed zamknięciem `ID-T = 01`

Zanim ustawisz `Status` wiersza `01` na `done`, upewnij się że:

- [ ] Zmieniono tytuł pliku `additional-contexts.md` (usunięto „szablon do skopiowania")
- [ ] Usunięto podpowiedzi w kursywie (`_Tu wklej..._`) z `additional-contexts.md`
- [ ] Wypełniono co najmniej sekcje 1–5 w `additional-contexts.md`
- [ ] Jeśli zadanie obejmuje co najmniej 2 serwisy (np. API + GUI), plan zawiera osobny krok „kontrakt międzyserwisowy” (minimum: operacje/endpointy, payloady, błędy, kompatybilność) i ten krok ma status `done` zanim ruszą ID‑T implementacyjne tych serwisów.
- [ ] Audyt planu ukończony: 2 subagenci + Claude + Gemini uruchomione równolegle; synteza i decyzje dopiero po komplecie 4 raportów (fallback wymaga decyzji właściciela); P1/P0 blokują, P2 po 3 rundach nie blokują; raporty w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-*.md` (i wpisane w `Co zrobiono do tej pory` w wierszu `01`)
- [ ] Jeśli task dotyka UI/przeglądarki: plan wymaga skrótu kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) + referencji do `/.env.test-accounts`; dla tasków bez UI `agent-browser` nie jest wymagany.
- [ ] Zmieniono daty `2026-02-12 13:53` na rzeczywiste w tej tabeli
- [ ] Zmieniono tytuł tego pliku (usunięto „szablon do skopiowania")
- [ ] Rozpisano kolejne wiersze planu (`02`, `03`...) z właściwymi statusami
- [ ] Zaktualizowano `SESSION*.md` (`current-task`, `current-id-t`, `last-updated`)

---

## Checklista przed zamknięciem taska (`*_done`)

Zanim ustawisz status katalogu/zadania na `_done`, upewnij się że:

- [ ] Wszystkie ID‑T są `done` lub jawnie `on-hold` z uzasadnieniem.
- [ ] Wymagane testy/kwalifikowane kroki zostały wykonane i opisane.
- [ ] Audyty końcowe (2 subagenci + Claude + Gemini) uruchomione równolegle; synteza i decyzje dopiero po komplecie 4 raportów; bez zastrzeżeń; raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`.
- [ ] Jeśli task dotyka UI/przeglądarki, wykonano i opisano testy manualne `agent-browser` (start od `agent-browser connect 9222`) z użyciem danych z `/.env.test-accounts`.
- [ ] Brak aktywnych `[BLOCKER]`.
- [ ] `tasks.md` oraz `additional-notes/` zawierają komplet dowodów i notatek zamknięcia.
