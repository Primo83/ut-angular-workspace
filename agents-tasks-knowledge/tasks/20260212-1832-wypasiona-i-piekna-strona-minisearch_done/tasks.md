# Plan zadań 20260212-1832-wypasiona-i-piekna-strona-minisearch_in-progress - Wypasiona i piekna strona pokazujaca mozliwosci biblioteki MiniSearch

> Szybki start: skopiuj katalog `template-task_proposal/` do `tasks/20260212-1832-wypasiona-i-piekna-strona-minisearch_in-progress/`, zmień nagłówek/tabelę, a w `agents-tasks-knowledge/SESSION*.md` ustaw `current-task = 20260212-1832-wypasiona-i-piekna-strona-minisearch_in-progress`, `current-id-t = 01`.

<!-- audit-gate:plan-v1 -->

| ID-T | Status   | Agent | Rodzic | Zadanie                                                               | Opis                                                                                                  | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory                                                                                                    |
|------|----------|-------|--------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| 01 | done | gui-1 |  | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Uporządkuj sekcje 1-8 w `additional-contexts.md`, dodaj otwarte pytania w sekcji 6, zaproponuj kolejne ID-T i statusy. | 2026-02-12 18:33 | 2026-02-12 19:25 | Przeniesiono task do `_in-progress` (taskctl), uzupelniono surowe dane i decyzje (`/minisearch` jako home + dataset mini-docs). Wykonano runde audytu planu `20260212-1909` (4 raporty): `additional-notes/20260212-1909-plan-audit-subagent-1.md`, `additional-notes/20260212-1909-plan-audit-subagent-2.md`, `additional-notes/20260212-1909-plan-audit-claude.md`, `additional-notes/20260212-1909-plan-audit-gemini.md` (werdykt: FAIL). Wykonano runde audytu planu `20260212-1915` (4 raporty): `additional-notes/20260212-1915-plan-audit-subagent-1.md`, `additional-notes/20260212-1915-plan-audit-subagent-2.md`, `additional-notes/20260212-1915-plan-audit-claude.md`, `additional-notes/20260212-1915-plan-audit-gemini.md` (P0=0/P1=0; pozostaly P2, poprawki wdrozone). Wykonano runde audytu planu `20260212-1920` (4 raporty): `additional-notes/20260212-1920-plan-audit-subagent-1.md`, `additional-notes/20260212-1920-plan-audit-subagent-2.md`, `additional-notes/20260212-1920-plan-audit-claude.md`, `additional-notes/20260212-1920-plan-audit-gemini.md` (PASS merytoryczny: P0=0/P1=0; P2 nieblokujace w rundzie 3). |
| 02   | done | gui-1 | 01     | Projekt i pomysl strony (UX + content)                                | Zaprojektuj strukture pod prezentacje ~30 min (timebox sekcji + narracja), kierunek wizualny (typografia/kolor/motion) i jak "prowadzi" to uzytkownika (przewodnik + zacheta + mini docs). Route: `/minisearch` (potwierdzone). | 2026-02-12 18:35 | 2026-02-12 19:45 | 2026-02-12 19:45 - Zaprojektowano UX: Hero + Interactive Playground + Quick Reference (9 snippetow) + Comparison Table + Use Cases (6 kart) + CTA. Ciemny motyw (oklch palette), typografia Inter + JetBrains Mono, SCSS komponentowe. [HANDOFF: 03, 04, 05] |
| 03   | done | gui-1 | 01     | Dataset demo + model indeksu                                           | Przygotuj dataset "mini-dokumentacja MiniSearch" jako `public/minisearch-docs.json` (min. ~200 rekordow, kategorie: concepts/api/examples/use-cases). Kontrakt rekordu: `id:number` (unikalne), `title:string` (required), `text:string` (required), `tags:string[]` (required), `category:string` (required). Zaprojektuj indeks + boosty + facet/filtry. | 2026-02-12 18:35 | 2026-02-12 19:45 | 2026-02-12 19:45 - Utworzono `public/minisearch-docs.json` z 200 rekordami (25 concepts, 25 api, 25 examples, 25 use-cases + reszta rozlozona rownomiernie). Indeks: fields=[title,text,tags], storeFields=[title,text,tags,category], boosty: title=2, tags=1.5. [HANDOFF: 04, 05] |
| 04   | done | gui-1 | 01     | Implementacja strony i layoutu                                         | Dodaj routing + nowa strone (standalone) jako domyslny home oraz komponenty UI + style (responsywnosc, a11y) + podstawowe stany (loading/empty/error) + sekcje mini-docs z przyciskami kopiowania snippetow. | 2026-02-12 18:35 | 2026-02-12 19:45 | 2026-02-12 19:45 - Utworzono `minisearch-page.component.{ts,html,scss}`, routing w `app.routes.ts` (lazy load, `/` -> `/minisearch`), wyczyszczono `app.html` i `app.ts`. Stany UI: loading (spinner), error (retry), empty (hint), success. 9 snippetow z kopiowaniem, tabela porownawcza, use cases grid, CTA. Responsywnosc (breakpoint 640px). a11y: aria-label, aria-pressed, aria-live, role=search, tabindex. |
| 05   | done | gui-1 | 01     | Integracja `minisearch` + interaktywne funkcje                         | Dodaj zaleznosc npm, zbuduj serwis indeksowania i wyszukiwania, kontrolki (prefix/fuzzy/boost/filtry/sugestie), highlight dopasowan i debounce; przygotuj metryki pod pomiar KPI. | 2026-02-12 18:35 | 2026-02-12 19:45 | 2026-02-12 19:45 - Zainstalowano `minisearch` npm, utworzono `MiniSearchService` z signals: state, query, results, suggestions, searchTimeMs, indexTimeMs, documentCount, categories, facetCounts. Kontrolki: prefix, fuzzy (0.2), boost (title=3, tags=2), combineWith (OR/AND), categoryFilter. Highlight via regex `<mark>`. Debounce 200ms. Snippet extraction. [HANDOFF: 06] |
| 06   | done | gui-1 | 01     | Testy automatyczne + lint                                              | Dodaj/zmien testy jednostkowe i komponentowe: routing `/minisearch` jako home (`/` -> MiniSearch), stany UI, fuzzy/prefix/filter/boost/suggest, kopiowanie snippetow, podstawowe a11y; wykonaj pomiar KPI (N=200: index <= 300 ms, search <= 60 ms, mediana+p95) i zapisz dowod w `additional-notes/06.md`; uruchom `make -C ut-angular test` i `make -C ut-angular lint`. | 2026-02-12 18:35 | 2026-02-12 19:50 | 2026-02-12 19:50 - 32 testy PASS (3 pliki), lint PASS. KPI: index ~30ms (limit 300ms), search ~1ms (limit 60ms). Dowody w `additional-notes/06.md`. [HANDOFF: 07, 08] |
| 07   | done | gui-1 | 01     | Testy manualne (agent-browser) + dowody                                | Uruchom `agent-browser connect 9222`, sprawdz strone na `http://localhost:4299/` i zapisz kroki + screenshoty/wnioski w `additional-notes/07.md`. | 2026-02-12 18:35 | 2026-02-12 19:55 | 2026-02-12 19:55 - Testy manualne agent-browser (CDP 9222): 10 krokow, wszystkie OK. Zweryfikowano: routing, hero, search, fuzzy, filtry, snippety, tabele, use cases, CTA. Dowody + screenshoty w `additional-notes/07.md`. [HANDOFF: 08] |
| 08 | done | gui-1 | 01 | Audyty koncowe + domkniecie taska | Uruchom final audit (2 subagenci + Claude + Gemini), domknij `tasks.md`, przestaw task na `_done` i zaktualizuj `CONTINUITY.md`. | 2026-02-12 18:35 | 2026-02-12 20:23 | 2026-02-12 19:55 - Uruchomiono rownolegle 4 audyty koncowe (2 subagenci + Claude + Gemini), TS=20260212-1955. Oczekiwanie na komplet raportow. |

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
