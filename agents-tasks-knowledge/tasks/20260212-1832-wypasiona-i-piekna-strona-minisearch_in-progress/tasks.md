# Plan zadań 20260212-1832-wypasiona-i-piekna-strona-minisearch_proposal - Wypasiona i piekna strona pokazujaca mozliwosci biblioteki MiniSearch

> Szybki start: skopiuj katalog `template-task_proposal/` do `tasks/20260212-1832-wypasiona-i-piekna-strona-minisearch_proposal/`, zmień nagłówek/tabelę, a w `agents-tasks-knowledge/SESSION*.md` ustaw `current-task = 20260212-1832-wypasiona-i-piekna-strona-minisearch_proposal`, `current-id-t = 01`.

<!-- audit-gate:plan-v1 -->

| ID-T | Status   | Agent | Rodzic | Zadanie                                                               | Opis                                                                                                  | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory                                                                                                    |
|------|----------|-------|--------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| 01 | in-progress | gui-1 |  | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Uporządkuj sekcje 1-8 w `additional-contexts.md`, dodaj otwarte pytania w sekcji 6, zaproponuj kolejne ID-T i statusy. | 2026-02-12 18:33 | 2026-02-12 18:56 | Przeniesiono task do `_in-progress` (taskctl) i uzupelniono "Surowe dane" o materialy MiniSearch + cel prezentacji ~30 min. Potwierdzono decyzje: route `/minisearch` i dataset = mini-dokumentacja MiniSearch. Dopuszczono Tailwind jako opcje. Dodano `additional-notes/07.md` (placeholder dla testow manualnych). |
| 02   | proposal | gui-1 | 01     | Projekt i pomysl strony (UX + content)                                | Zaprojektuj strukture pod prezentacje ~30 min (spis sekcji + narracja), kierunek wizualny (typografia/kolor/motion) i jak "prowadzi" to uzytkownika (przewodnik + zacheta + mini docs). Route: `/minisearch` (potwierdzone). | 2026-02-12 18:35 | 2026-02-12 18:56 | - |
| 03   | proposal | gui-1 | 01     | Dataset demo + model indeksu                                           | Przygotuj dataset "mini-dokumentacja MiniSearch" (min. ~200 rekordow, kategorie: concepts/api/examples/use-cases) i zaprojektuj pola indeksu (np. title/text/tags/category) + boosty + facet/filtry. | 2026-02-12 18:35 | 2026-02-12 18:56 | - |
| 04   | proposal | gui-1 | 01     | Implementacja strony i layoutu                                         | Dodaj routing + nowa strone (standalone) + komponenty UI + style (responsywnosc, a11y) + podstawowe stany (loading/empty/error). | 2026-02-12 18:35 | 2026-02-12 18:35 | - |
| 05   | proposal | gui-1 | 01     | Integracja `minisearch` + interaktywne funkcje                         | Dodaj zaleznosc npm, zbuduj serwis indeksowania i wyszukiwania, kontrolki (prefix/fuzzy/boost/filtry/sugestie), highlight dopasowan, debounce i podstawowe profile wydajnosci. | 2026-02-12 18:35 | 2026-02-12 18:35 | - |
| 06   | proposal | gui-1 | 01     | Testy automatyczne + lint                                              | Dodaj/zmien testy jednostkowe (min. serwis search), uruchom `make -C ut-angular test` i `make -C ut-angular lint`. | 2026-02-12 18:35 | 2026-02-12 18:35 | - |
| 07   | proposal | gui-1 | 01     | Testy manualne (agent-browser) + dowody                                | Uruchom `agent-browser connect 9222`, sprawdz strone na `http://localhost:4299/` i zapisz kroki + screenshoty/wnioski w `additional-notes/07.md`. | 2026-02-12 18:35 | 2026-02-12 18:35 | - |
| 08   | proposal | gui-1 | 01     | Audyty koncowe + domkniecie taska                                      | Uruchom final audit (2 subagenci + Claude + Gemini), domknij `tasks.md`, przestaw task na `_done` i zaktualizuj `CONTINUITY.md`. | 2026-02-12 18:35 | 2026-02-12 18:35 | - |

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
- [ ] Zmieniono daty `2026-02-12 18:33` na rzeczywiste w tej tabeli
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
