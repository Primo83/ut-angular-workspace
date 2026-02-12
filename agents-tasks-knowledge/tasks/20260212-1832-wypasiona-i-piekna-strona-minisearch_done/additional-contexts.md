# 20260212-1832-wypasiona-i-piekna-strona-minisearch_in-progress - Wypasiona i piekna strona pokazujaca mozliwosci biblioteki MiniSearch

## 0. Karta zadania (wypełnij zawsze)
- Cel w 1 zdaniu: Zbudowac w `ut-angular/` wypasiona strone demo/showcase pod prezentacje ~30 minut, ktora w praktyce pokazuje mozliwosci biblioteki `minisearch` (przewodnik + zacheta + mini dokumentacja) na przykladowym datasete, z interaktywnymi kontrolkami i czytelnymi wynikami.
- Poziom specyfikacji: M
- Typ zadania (zaznacz):
    - [ ] Backend/API
    - [x] UI/UX
    - [ ] DB/migracje
    - [ ] Integracje
    - [ ] Refactor/tech-debt
- Dotkniete systemy/moduly: `ut-angular/src/app/` (routing + nowe komponenty/strony + style)
- Wlasciciel decyzji biznesowych: wlasciciel repo (human)
- Wlasciciel decyzji technicznych: `gui-1`
- Linki:
  - MiniSearch README (source of truth): `https://github.com/lucaong/minisearch`

## 1. Surowe dane / materiały wejściowe
- 2026-02-12: "zaluz nowew zadanie o id wypasiona i piekna strona pokazujaca mozliwosci biblioteki minisearch. projekt, pomysl, wykonanie"
- 2026-02-12: Cel prezentacyjny: zaprojektowac strone pod prezentacje ~30 minutowa; strona ma byc pokazem roznych mozliwosci MiniSearch, przewodnikiem, zacheta i mini dokumentacja. Ma byc czytelna, atrakcyjna i ma zachecac do samej biblioteki. Opcjonalnie mozna uzyc Tailwind CSS.
- Materialy: MiniSearch (wklejka)
```text
● MiniSearch

  MiniSearch to lekka biblioteka JavaScript/TypeScript do wyszukiwania pełnotekstowego (full-text search) działająca w całości po stronie klienta (in-memory). Nie wymaga żadnego serwera ani
  zewnętrznych usług.

  Kluczowe cechy

  - Zero zależności — bardzo mała paczka (~7 kB gzipped)
  - Działa w przeglądarce i Node.js
  - Wyszukiwanie pełnotekstowe z rankingiem trafności (TF-IDF)
  - Prefix search — wyszukiwanie po początkowych znakach (autocomplete)
  - Fuzzy search — tolerancja na literówki (edycja Levenshteina)
  - Filtrowanie i boosting — możliwość nadawania wag poszczególnym polom
  - Indeksowanie przyrostowe — dodawanie/usuwanie dokumentów z indeksu w runtime
  - Auto-suggest — gotowe API do podpowiedzi
  - Obsługa wielu pól — indeksowanie po kilku polach jednocześnie (np. title, description, tags)

  Podstawowe API

  import MiniSearch from 'minisearch'

  // Tworzenie indeksu
  const miniSearch = new MiniSearch({
    fields: ['title', 'text'],        // pola do indeksowania
    storeFields: ['title', 'category'] // pola zwracane w wynikach
  })

  // Indeksowanie dokumentów
  miniSearch.addAll([
    { id: 1, title: 'Angular', text: 'Framework frontendowy', category: 'frontend' },
    { id: 2, title: 'React', text: 'Biblioteka UI', category: 'frontend' },
    { id: 3, title: 'Node.js', text: 'Runtime JavaScript', category: 'backend' },
  ])

  // Wyszukiwanie
  const results = miniSearch.search('angular')
  // => [{ id: 1, title: 'Angular', category: 'frontend', score: ..., match: ... }]

  // Fuzzy search (tolerancja na literówki)
  miniSearch.search('anglar', { fuzzy: 0.2 })

  // Prefix search (autocomplete)
  miniSearch.search('ang', { prefix: true })

  // Boosting pól
  miniSearch.search('framework', {
    boost: { title: 2 }  // tytuł 2x ważniejszy
  })

  // Filtrowanie wyników
  miniSearch.search('framework', {
    filter: (result) => result.category === 'frontend'
  })

  Zaawansowane opcje

  - Tokenizer — możliwość podmiany domyślnego tokenizera
  - Procesowanie termów — custom stemming, lowercasing, usuwanie stop-words
  - Combine search — łączenie wyników z OR (domyślne) lub AND
  - Auto-suggest API — miniSearch.autoSuggest('ang') zwraca sugestie z wagami
  - Serializacja indeksu — JSON.stringify(miniSearch) + MiniSearch.loadJSON() pozwala zapisać/odtworzyć indeks (np. build-time indexing)
  - Operacje na indeksie — add(), remove(), discard(), replace()

  Typowe zastosowania

  1. Wyszukiwanie w dokumentacji (np. Docusaurus, VitePress używają MiniSearch)
  2. Autocomplete / typeahead w formularzach
  3. Filtrowanie tabel/list po stronie klienta
  4. Wyszukiwanie offline (PWA, aplikacje bez backendu)
  5. Szybkie prototypowanie — zamiast stawiać Elasticsearch

  Porównanie z alternatywami
  ┌────────────────────┬─────────────────┬───────────────┬─────────────┬────────────┐
  │       Cecha        │   MiniSearch    │    Lunr.js    │   Fuse.js   │ FlexSearch │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ Rozmiar            │ ~7 kB           │ ~8 kB         │ ~5 kB       │ ~6 kB      │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ Fuzzy search       │ tak             │ tak           │ tak (core)  │ tak        │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ Prefix search      │ tak             │ tak           │ nie         │ tak        │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ Indeks przyrostowy │ tak             │ nie (rebuild) │ n/a         │ tak        │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ Auto-suggest       │ tak (wbudowane) │ nie           │ nie         │ nie        │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ TF-IDF ranking     │ tak             │ tak           │ nie (Bitap) │ nie        │
  ├────────────────────┼─────────────────┼───────────────┼─────────────┼────────────┤
  │ TypeScript         │ tak (natywnie)  │ tak           │ tak         │ częściowo  │
  └────────────────────┴─────────────────┴───────────────┴─────────────┴────────────┘
  Instalacja

  npm install minisearch

  Repozytorium i docs

  - GitHub: lucaong/minisearch
  - Dokumentacja: dostępna na stronie projektu i w README

  ---
  Podsumowanie: MiniSearch to solidny wybór, gdy potrzebujesz lekkiego, pełnotekstowego wyszukiwania po stronie klienta z fuzzy search, autocomplete i rankingiem — bez zależności i bez serwera.
  Szczególnie popularny w narzędziach do dokumentacji (VitePress go używa domyślnie).
```
- Kontekst techniczny (fakty z repo):
  - Aplikacja Angular jest w `ut-angular/` (Docker-only dev, host: `http://localhost:4299/`).
  - Routing jest w `ut-angular/src/app/app.routes.ts` (obecnie puste `Routes = []`).
  - `minisearch` nie jest jeszcze zaleznoscia w `ut-angular/package.json` (stan na 2026-02-12).

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)
Potrzebujemy "ladnej i konkretnej" strony, ktora w ciagu kilku sekund pokazuje praktycznie, co potrafi MiniSearch (fuzzy, prefix, boosting, filtry, sugestie, itd.). To ma byc jednoczesnie demo techniczne (jak zintegrowac libke w Angular) i material "wow" do przegladania.

## 3. Efekt dla użytkownika / biznesu (wypełnij zawsze)
### 3.1 Użytkownicy / role
- Developer / osoba techniczna: szybko widzi, jak dziala MiniSearch i jak go uzyc.
- Wlasciciel repo: ma gotowa strone "showcase" do pokazywania.

### 3.2 Scenariusze (Given/When/Then) — minimum 2
- G1: Given otwieram strone demo MiniSearch, When wpisuje query, Then widze w czasie rzeczywistym liste wynikow z podswietleniami dopasowan i metrykami (np. score / trafienia).
- G2: Given wlaczam fuzzy i ustawiam parametr tolerancji literowek, When wpisuje query z literowka, Then nadal dostaje sensowne wyniki.
- G3: Given mam filtry (np. kategoria/tag), When zaznaczam filtr, Then wyniki sa ograniczone do wybranej grupy bez przejscia strony.

### 3.3 Zasady biznesowe (jeśli są)
- Brak (to strona showcase / demo).

### 3.4 Dane i wynik (najlepiej przykładami)
- Wejscie: tekst zapytania + przelaczniki (np. fuzzy/prefix) + filtry.
- Wynik: lista posortowanych wynikow (title + snippet + tagi/kategoria + score) + ewentualne sugestie.
- Przyklad:
  - input: `{ query: "angulr", fuzzy: true, prefix: true, category: "docs" }`
  - output: `{ total: 12, top: [{ title: "Angular routing basics", score: 1.23, ... }], suggestions: ["angular", "angular router"] }`

### 3.5 Kryteria akceptacji (biznesowe) — checklista
- [ ] Strona showcase jest dostepna pod `/minisearch` i zastępuje domyslna strone startowa aplikacji.
- [ ] Strona demonstruje min. 5 mozliwosci MiniSearch (np. prefix, fuzzy, field boosting, filtry/facety, sugestie/autocomplete, aktualizacja indeksu).
- [ ] Strona zawiera sekcje "mini dokumentacji" (API + przyklady + use-case'y), z ktorej da sie skopiowac snippet'y.
- [ ] UI ma stany: loading, empty (brak wynikow), error (np. blad indeksu/danych), success.
- [ ] UX jest responsywny i przyjazny klawiaturze (podstawowe a11y: focus, aria-label na inputach).
- [ ] Dziala w Docker dev: `make -C ut-angular up` i wejscie na `http://localhost:4299/`.
- [ ] Przechodzi `make -C ut-angular lint` i `make -C ut-angular test` (w kontenerze).
- [ ] Jeśli task dotyka UI/przeglądarki, testy manualne są planowane przez `agent-browser` (procedura startuje od `agent-browser connect 9222`).
- [ ] Jeśli task dotyka UI/przeglądarki, `additional-contexts.md` zawiera skrót danych kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) oraz referencję do `/.env.test-accounts`.

## 4. Referencje i wzorce (żeby agent nie zgadywał)
### 4.1 Bliźniacze taski / PR / commity (1–3)
- Task bazowy dla GUI/Docker: `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_done`
- Pliki startowe w Angular: `ut-angular/src/app/app.routes.ts`, `ut-angular/src/app/app.ts`, `ut-angular/src/app/app.html`, `ut-angular/src/app/app.config.ts`
### 4.2 Co kopiujemy ze wzorca
- [x] flow/architektura
- [ ] kontrakt API / event
- [ ] walidacje
- [x] testy
- [ ] migracje
- [ ] podobieństwa funkcjonalne np. akcja użytkownika, umiejscowienie, wygląd, itp.
### 4.3 Pułapki / “gotchas”
- `app.routes.ts` jest puste, wiec trzeba od razu zdefiniowac routing i sensowna strone startowa / nawigacje.
- Nie zostawiac w finalnej wersji starterowego, ogromnego HTML/CSS z template Angular.
- Wydajnosc: indeksowanie moze byc kosztowne przy wiekszym datasete; trzeba zaplanowac debounce i sensowny rozmiar danych.

## 5. Zakres i ograniczenia (wypełnij zawsze)
### 5.1 Zakres in/out
- **W zakresie**: strona showcase (Angular) + przykladowy dataset + integracja `minisearch` + interaktywne opcje + testy i manual QA + ustawienie strony jako domyslnej strony startowej.
- **Poza zakresem**: globalny search calej aplikacji, backend/API, logowanie, trwale zapisywanie ustawien uzytkownika.

### 5.2 Ograniczenia i zależności
- Termin/release: brak (UNCONFIRMED).
- Technologiczne/architektoniczne: Angular `ut-angular/` (standalone + router), uruchamianie i testy przez `Makefile` w Dockerze.
- Zaleznosci: npm package `minisearch` (do dodania do `ut-angular/package.json`).

### 5.3 Założenia i ryzyka (krótko, jeśli są)
- Zalozenia: demo jest publiczne w kontekscie lokalnego dev (bez auth).
- Ryzyka: zbyt duzy dataset (lag), rozrost bundle size, "wypasiony" design moze potrzebowac wiecej iteracji.
- Budzety wydajnosci (v1, N=200 rekordow): indeksowanie <= 300 ms, pojedyncze zapytanie <= 60 ms na dev maszynie.

## 6. Otwarte pytania (blokery + decyzje)
> Zasada: każde pytanie ma właściciela i “deadline decyzji”.
- [x] **P1:** Docelowa sciezka routingu: `/minisearch`. | owner: wlasciciel repo | decyzja: 2026-02-12
- [x] **P2:** Motyw datasetu demo: mini-dokumentacja MiniSearch (concepts/API/examples/use-cases). | owner: wlasciciel repo | decyzja: 2026-02-12
- [x] **P3:** V1 bez Web Workera. Follow-up tylko gdy: dataset > 1000 rekordow lub przekroczone KPI (index > 300 ms / search > 60 ms). | owner: `gui-1` | decyzja: 2026-02-12
- [x] **P4:** Strona MiniSearch ma zastapic domyslny home. | owner: wlasciciel repo | decyzja: 2026-02-12

## 7. Ustalenia z rozmów (log decyzji)
- 2026-02-12: Utworzyc nowy task i przygotowac plan dla "wypasionej i pieknej" strony pokazujacej MiniSearch.
- 2026-02-12: Potwierdzono route: `/minisearch` oraz temat datasetu: mini-dokumentacja MiniSearch; Tailwind CSS dopuszczony jako opcja.
- 2026-02-12: Potwierdzono, ze `/minisearch` zastępuje domyslna strone startowa.
- 2026-02-12: Decyzja techniczna: V1 bez Web Workera (progi aktywacji follow-up: >1000 rekordow albo przekroczone KPI wydajnosci).
- 2026-02-12: Decyzja techniczna: V1 bez Tailwind; warstwa UI realizowana przez SCSS komponentowe (ta decyzja nadpisuje wcześniejszą opcję „Tailwind opcjonalny”).

## 8. Brief do planu technicznego (`tasks.md`) — 8–15 linijek max
- Backend/API: brak.
- UI: nowy route i strona showcase (przewodnik do prezentacji): hero + quickstart + interaktywny playground (query + toggles/filtry) + sekcja mini dokumentacji (API + use-case'y) + call-to-action; layout z wyrazna typografia, kolorystyka i lekkimi animacjami.
- Dane/migracje: brak DB; dataset w `public/minisearch-docs.json` i budowa indeksu po stronie klienta.
- Testy: unit + komponentowe (routing `/` i `/minisearch`, stany UI, fuzzy/prefix/filter/boost/suggest, kopiowanie snippetow, podstawowe a11y) + smoke; `make -C ut-angular lint` i `make -C ut-angular test`.
- Ryzyka/rollout: utrzymac dobry UX przy indeksowaniu; ograniczyc rozmiar datasetu lub zrobic lazy/index w tle.
- Kontrakt rekordu datasetu (`public/minisearch-docs.json`):
  - `id:number` (required, unique),
  - `title:string` (required),
  - `text:string` (required),
  - `tags:string[]` (required),
  - `category:string` (required, enum: `concepts|api|examples|use-cases`).
- Timebox prezentacji 30 min:
  - 0-4 min: problem i intro biblioteki
  - 4-15 min: live playground (core feature tour)
  - 15-23 min: mini dokumentacja i API snippets
  - 23-28 min: porownanie i use-case'y
  - 28-30 min: podsumowanie i CTA
- Protokol pomiaru KPI (v1):
  - dla N=200 rekordow wykonaj 10 pomiarow `index` i 20 pomiarow `search` (warm cache),
  - raportuj mediane i p95,
  - dowod zapisz w `additional-notes/06.md`.
  - owner wykonania pomiaru: `ID-T=06`.
- Mapa kryterium -> test -> dowod:
  - `/minisearch` jako home: test komponentowy routingu (`/` i `/minisearch`) -> wynik w `additional-notes/06.md`,
  - min. 5 funkcji MiniSearch (prefix/fuzzy/filter/boost/suggest): testy serwisu + komponentowe -> wynik w `additional-notes/06.md`,
  - kopiowanie snippetow w mini-docs: test komponentowy akcji copy + manual smoke -> dowod w `additional-notes/06.md` i `additional-notes/07.md`,
  - KPI wydajnosci: pomiar wg protokolu -> wynik w `additional-notes/06.md`.

---

# MODUŁY (wypełnij TYLKO te, które dotyczą zadania)

## MODUŁ UI/UX (jeśli dotykasz UI)
- Link do Figma / makiet: brak (UNCONFIRMED).
- Stany ekranu:
    - [x] loading
    - [x] empty
    - [x] error
    - [x] success
- Copy/teksty uzytkownika: prosto i technicznie (np. "Tryb fuzzy", "Prefix", "Boost title", "Wyniki", "Score").
- Warstwa UI: klasyczny Angular + SCSS komponentowe (v1 bez Tailwind).
- Uprawnienia/widocznosc: brak.
- Analityka/zdarzenia: brak (UNCONFIRMED).
- Dane kont testowych (dla UI/przeglądarki):
    - env_file: `/.env.test-accounts`
    - base_url_var: `ATK_BROWSER_BASE_URL`
    - user_var: `ATK_BROWSER_TEST_USER`
    - pass_var: `ATK_BROWSER_TEST_PASS`
    - base_url: `http://localhost:4299/`
    - test_user: N/A (brak logowania)
    - test_pass: N/A (brak logowania)

---

## 9. Definition of Ready (agent może startować dopiero gdy)
- [x] Jest cel w 1 zdaniu i zakres in/out
- [x] Są min. 2 scenariusze Given/When/Then
- [x] Są kryteria akceptacji (checkboxy)
- [x] Otwarte pytania mają ownerów (albo “brak blokerów”)
- [x] Jeśli API/UI/DB dotyczy — wypełniony odpowiedni moduł
- [x] Jeśli task dotyka UI/przeglądarki — wpisany skrót kont testowych + referencja do `/.env.test-accounts`
- [x] Jest choć 1 referencja/wzorzec albo wpis “brak, bo ...”

## 10. Definition of Done (żeby nie było niedomówień)
- [ ] Testy dodane/zmienione
- [ ] Migracje wykonane + bezpieczne (jeśli dotyczy)
- [ ] Komunikaty błędów i edge-case’y obsłużone
- [ ] Monitoring/logi uzupełnione (jeśli dotyczy)
- [ ] Kryteria akceptacji spełnione i odhaczone
- [ ] Audyty końcowe (2 subagenci + Claude + Gemini) bez zastrzeżeń; raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`
- [ ] Jeśli task dotyka UI/przeglądarki, wykonane i opisane testy manualne `agent-browser` (start od `agent-browser connect 9222`) z użyciem danych z `/.env.test-accounts`
