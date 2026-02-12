# 20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux_planning - Ulepszenia prezentacji MiniSearch

## 0. Karta zadania (wypelnij zawsze)
- Cel w 1 zdaniu: Rozszerzyc i dopracowac strone `minisearch` tak, aby atrakcyjnie pokazala 50 smaczkow biblioteki, miala bezkolizyjny skrot klawiszowy, live indexing i czytelne tooltipy dla wszystkich funkcji/akcji.
- Poziom specyfikacji: L
- Typ zadania (zaznacz):
    - [ ] Backend/API
    - [x] UI/UX
    - [ ] DB/migracje
    - [ ] Integracje
    - [x] Refactor/tech-debt
- Dotkniete systemy/moduly: `ut-angular/src/app/features/minisearch-page/`, `ut-angular/src/app/services/mini-search.service.ts`, testy `*.spec.ts`, ewentualnie `public/minisearch-docs.json`.
- Wlasciciel decyzji biznesowych: wlasciciel repo (human)
- Wlasciciel decyzji technicznych: `gui-1`
- Linki: poprzedni task: `agents-tasks-knowledge/tasks/20260212-1832-wypasiona-i-piekna-strona-minisearch_done`

## 1. Surowe dane / materialy wejsciowe
- 2026-02-12 (uzytkownik): "zamknij biezacy task jako done i otworz nowy na ulepszenia z wymaganiami w row data na te 50 punktow".
- 2026-02-12 (uzytkownik): "serwis byl w 100%".
- 2026-02-12 (uzytkownik): "dopisz rowniez zmiane skrotu klawiszowego bo koliduje z chrome".
- 2026-02-12 (uzytkownik): "jezeli nie ma to chce zaprezentowac tez indexowanie na zywo, dokladanie dokumentow w locie".
- 2026-02-12 (uzytkownik): "po najechaniu na kazda funkcje lub button wyswietlal sie ladny tooltip opisujacy do czego funkcja sluzy".
- 2026-02-12 (uzytkownik): "tooltipy maja byc proste do zrozumienia; wszystko tlumaczone prostym jezykiem dla laika, jako przyjemne wprowadzenie dla osob bez doswiadczenia z ES/wyszukiwarkami".
- 2026-02-12: Lista 50 smaczkow do pokazania (wymaganie prezentacyjne):
  1. Live search bez backendu
  2. Offline search
  3. Prefix search
  4. Prefix per-term
  5. Fuzzy search
  6. Fuzzy per-term
  7. maxFuzzy
  8. Exact+prefix+fuzzy mix
  9. Search po wybranych fields
  10. Field boost
  11. boostTerm
  12. boostDocument
  13. weights (fuzzy/prefix)
  14. bm25 tuning
  15. combineWith OR
  16. combineWith AND
  17. combineWith AND_NOT
  18. Query tree (nested)
  19. MiniSearch.wildcard
  20. Wildcard + filter
  21. filter callback
  22. Role-based filtering
  23. storeFields optimization
  24. match info explanation
  25. score explanation
  26. autoSuggest basic
  27. autoSuggest + fuzzy
  28. autoSuggest + filter
  29. autoSuggestOptions
  30. extractField nested
  31. extractField derived fields
  32. stringifyField
  33. custom tokenize
  34. tokenize split index/search
  35. processTerm normalization
  36. processTerm split index/search
  37. processTerm synonyms
  38. processTerm discard terms
  39. custom idField
  40. add runtime
  41. addAll batch
  42. addAllAsync chunking
  43. remove
  44. discard
  45. replace
  46. discardAll
  47. manual vacuum
  48. dirtCount/dirtFactor
  49. documentCount/termCount
  50. toJSON/loadJSON/loadJSONAsync

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)
Po pierwszej wersji showcase potrzebne jest domkniecie pod finalna prezentacje: pelne pokrycie listy smaczkow, bardziej czytelne prowadzenie uzytkownika i usuniecie UX tarc (kolizja skrotu z Chrome, brak uniwersalnych tooltipow, brak jawnej demonstracji live indexing). Dodatkowo tresci musza byc przyjazne dla osob poczatkujacych - bez zargonu wyszukiwarek, z prostymi analogiami i intuicyjnymi opisami. Zadanie ma przygotowac stabilna wersje demonstracyjna, ktora przechodzi wszystkie scenariusze demo bez potkniec.

## 3. Efekt dla uzytkownika / biznesu (wypelnij zawsze)
### 3.1 Uzytkownicy / role
- Prezenter (wlasciciel repo): ma gotowa, efektowna i przewidywalna sciezke demo.
- Odbiorca techniczny prezentacji: szybko rozumie, co MiniSearch potrafi i jak to zaimplementowac.
- Odbiorca nietechniczny/poczatkujacy: rozumie funkcje dzieki prostym opisom i tooltipom.

### 3.2 Scenariusze (Given/When/Then) — minimum 2
- G1: Given otwarta strona `/minisearch`, When prezentuje kolejne funkcje, Then widac kompletna mape 50/50 smaczkow i dzialajace interakcje.
- G2: Given aktywny fokus strony i skrot klawiszowy, When uzywam skrotu, Then nie uruchamia sie kolidujaca akcja Chrome i dziala tylko akcja aplikacji.
- G3: Given formularz dodawania dokumentu live, When dodam dokument w locie, Then pojawia sie on w wynikach bez restartu aplikacji.
- G4: Given najezdzam myszka na kazdy button/funkcje, When hover jest aktywny, Then widze estetyczny tooltip z opisem celu funkcji.
- G5: Given nie znam terminologii full-text/ES, When czytam tooltip i opis funkcji, Then rozumiem dzialanie bez slownika i bez zargonu.

### 3.3 Zasady biznesowe (jesli sa)
- Wersja prezentacyjna ma byc "100%" dla uzgodnionych scenariuszy demo (brak bledow funkcjonalnych podczas prezentacji).

### 3.4 Dane i wynik (najlepiej przykladami)
- Wejscie: query + kontrolki search + akcje UI (skrot, hover, live add document).
- Wynik: stabilne wyniki wyszukiwania, sugestie, tooltipy i potwierdzenie pokrycia 50 smaczkow.
- Przyklad:
  - input: `{ query: "anglar", fuzzy: 0.2, prefix: true, addDoc: { id: 9999, title: "Angular keyboard shortcuts", text: "...", tags: ["ui"], category: "examples" } }`
  - output: `{ total: >0, containsAddedDoc: true, shortcutConflict: false, tooltipVisibleOnHover: true }`

### 3.5 Kryteria akceptacji (biznesowe) — checklista
- [ ] Strona ma jawna macierz pokrycia 50/50 smaczkow (widoczna i zweryfikowana).
- [ ] Wszystkie 50 punktow z listy jest obslugiwane: implementacja lub czytelne demo/fake data uzasadnione w UI.
- [ ] Definicja "serwis w 100%" jest spelniona: 100% PASS dla zdefiniowanych scenariuszy demo + brak bledow konsoli w krytycznej sciezce.
- [ ] Skrot klawiszowy uzywany w demo nie koliduje z Chrome.
- [ ] Jest sekcja live indexing (dokladanie dokumentow w locie) i dziala bez restartu.
- [ ] Kazdy interaktywny element (przycisk/funkcja) ma tooltip z opisem i jest czytelny na desktop oraz mobile.
- [ ] Tooltipy i opisy funkcji sa napisane prostym jezykiem dla laika (bez zargonu typu ES/BM25 bez wyjasnienia).
- [ ] Przewodnik po funkcjach buduje mile, „step-by-step” wprowadzenie dla poczatkujacych.
- [ ] Przechodzi `make -C ut-angular lint` i `make -C ut-angular test`.
- [ ] Testy manualne UI sa wykonane przez `agent-browser` (start od `agent-browser connect 9222`).
- [ ] `additional-contexts.md` zawiera skrot danych kont testowych + referencje do `/.env.test-accounts`.

## 4. Referencje i wzorce (zeby agent nie zgadywal)
### 4.1 Blizniacze taski / PR / commity (1-3)
- `agents-tasks-knowledge/tasks/20260212-1832-wypasiona-i-piekna-strona-minisearch_done`

### 4.2 Co kopiujemy ze wzorca
- [x] flow/architektura
- [ ] kontrakt API / event
- [x] walidacje
- [x] testy
- [ ] migracje
- [x] podobienstwa funkcjonalne np. akcja uzytkownika, umiejscowienie, wyglad, itp.

### 4.3 Pulapki / gotchas
- Niektore punkty z listy 50 sa niskopoziomowe (np. `vacuum`, `bm25`) i wymagaja czytelnego sposobu "pokazania" bez przeinzenia API.
- Skrot klawiszowy musi byc sprawdzony na realnej przegladarce Chrome.
- Tooltipy nie moga pogorszyc a11y i focus-flow.
- Ryzyko nadmiaru tekstu: opisy musza byc proste i krotkie, aby nie przytloczyc odbiorcy.

## 5. Zakres i ograniczenia (wypelnij zawsze)
### 5.1 Zakres in/out
- **W zakresie**: poprawki UX/content/feature dla finalnej prezentacji MiniSearch, mapa 50 punktow, skrot klawiszowy, live indexing, tooltipy, testy i dowody.
- **Poza zakresem**: backend, autoryzacja, nowe serwisy zewnetrzne.

### 5.2 Ograniczenia i zaleznosci
- Termin/release: ASAP pod prezentacje (dokladna data UNCONFIRMED).
- Technologiczne/architektoniczne: Angular app w `ut-angular/`, uruchamianie docker-only.
- Zaleznosci: `minisearch` + istniejaca implementacja z poprzedniego taska.

### 5.3 Zalozenia i ryzyka (krotko, jesli sa)
- Zalozenie: mozemy rozszerzyc obecny UI bez przepisywania calej strony od zera.
- Ryzyko: "100%" bez definicji metryki moze byc niejednoznaczne; na potrzeby taska mapujemy je na 100% PASS scenariuszy demo i testow.

## 6. Otwarte pytania (blokery + decyzje)
- [x] **P1:** Definicja "serwis w 100%": 100% PASS checklisty demo + PASS `lint/test` + brak `console.error`/uncaught errors na krytycznej sciezce prezentacji. | owner: wlasciciel repo | decyzja: 2026-02-12 (przyjeto roboczo do planu)
- [x] **P2:** Docelowy nowy skrot klawiszowy: `Alt+Shift+M` (desktop), z fallbackiem w UI jako przycisk widoczny bez skrotu. | owner: wlasciciel repo | decyzja: 2026-02-12 (przyjeto roboczo do planu)

## 7. Ustalenia z rozmow (log decyzji)
- 2026-02-12: Zamknac stary task MiniSearch i zalozyc nowy task ulepszen.
- 2026-02-12: Nowy task ma zawierac w surowych danych komplet 50 smaczkow prezentacyjnych.
- 2026-02-12: Wymagane: "serwis 100%", zmiana skrotu kolidujacego z Chrome, live indexing i tooltipy dla wszystkich funkcji/buttonow.
- 2026-02-12: Wymagane copywritingowe doprecyzowanie: tooltipy i opisy dla laika, prosty jezyk, brak zargonu bez wyjasnienia.
- 2026-02-12: Do planu przyjeto roboczo definicje "100%" i skrot `Alt+Shift+M`, aby odblokowac audyt planu i przejscie do `ID-T=02`.

## 8. Brief do planu technicznego (`tasks.md`) — 8-15 linijek max
- UI: rozszerzyc strone `minisearch` o mape 50 punktow (status + demo trigger + opis dla poczatkujacego).
- Funkcje: dodac lub dopiac brakujace elementy API MiniSearch, w tym live indexing (add/addAll/replace/discard), telemetry i serializacja.
- UX: wymienic kolidujacy skrot klawiszowy na bezpieczny, plus widoczne wskazowki klawiaturowe.
- UX: tooltip na kazdym interaktywnym controlu (buttony, toggles, selecty, quick actions), napisany prostym jezykiem i z wyjasnieniem „co to daje”.
- Stabilnosc: dopracowac bledy, fallbacki i edge-case tak, by demo bylo powtarzalne i stabilne.
- Testy: zaktualizowac unit/component, dodac scenariusze skrotu, tooltipow i live indexing.
- QA manual: pelna sciezka prezentacyjna w `agent-browser` + dowody w `additional-notes/`.
- Gate: finalne audyty 2x subagent + Claude + Gemini przed zamknieciem taska.

---

# MODULY (wypelnij TYLKO te, ktore dotycza zadania)

## MODUL UI/UX (jesli dotykasz UI)
- Link do Figma / makiet: brak (UNCONFIRMED).
- Stany ekranu:
    - [x] loading
    - [x] empty
    - [x] error
    - [x] success
- Copy/teksty uzytkownika: proste i przyjazne dla laika (krotkie opisy funkcji + tooltipy bez zargonu).
- Uprawnienia/widocznosc: brak auth.
- Analityka/zdarzenia: opcjonalny licznik przejsc przez smaczki (UNCONFIRMED).
- Dane kont testowych (dla UI/przegladarki):
    - env_file: `/.env.test-accounts`
    - base_url_var: `ATK_BROWSER_BASE_URL`
    - user_var: `ATK_BROWSER_TEST_USER`
    - pass_var: `ATK_BROWSER_TEST_PASS`
    - base_url: `http://localhost:4299/`
    - test_user: N/A (brak logowania)
    - test_pass: N/A (brak logowania)
