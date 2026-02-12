# Przewodnik: jak tworzyć nowe zadania w `tasks/`

Ten plik opisuje **konkretny proces** tworzenia nowego zadania (`<ID-Z>_<status>/`) w `agents-tasks-knowledge/tasks/`.

Jeśli jesteś właścicielem zadania i chcesz, żeby agent CLI (np. `codex-cli`) poprowadził Cię **krok po kroku**, zacznij od:
 - sekcji `0. Szybki start dla właściciela zadania (BA)`,
 - oraz sekcji `9. Flow właściciel ↔ agent`.
 To jest Twój „happy path” od pomysłu do pierwszej sesji agenta dla nowego katalogu `<ID-Z>_proposal`.

## 0. Szybki start dla właściciela zadania (BA)

Jeżeli chcesz założyć nowe zadanie i nie chcesz czytać całego pliku:

1. Wymyśl identyfikator `<ID-Z>` (np. `250101-feature-reporting`).
2. Skopiuj katalog `tasks/template-task_proposal/` do `tasks/<ID-Z>_proposal/` i popraw nazwę oraz placeholdery.
3. W nowym katalogu:
    - otwórz `additional-contexts.md` i:
        - wypełnij **co najmniej** sekcję `1. Surowe dane`,
        - w miarę możliwości uzupełnij sekcje 2–5 według szablonu BA z sekcji 3.
    - otwórz `tasks.md` i upewnij się, że istnieje wiersz z `ID-T = 01` o mniej więcej takim znaczeniu:
        - `Zadanie`: „Doprecyzowanie i uzupełnienie additional-contexts.md + przygotowanie planu technicznego”
        - `Status`: `planning` (na czas doprecyzowywania; po zaakceptowaniu planu przez właściciela ustaw `done`),
        - `Rodzic`: puste,
        - `Co zrobiono do tej pory`: krótka notatka, że to krok doprecyzowania wymagań.
4. Ustaw `agents-tasks-knowledge/SESSION.md` tak, aby:
    - `current-task` = `<ID-Z>_proposal`,
    - `current-id-t` = `01`,
    - `last-updated` = bieżąca data i godzina.
5. W rozmowie z agentem napisz wprost, że:
    - jest nowe zadanie `<ID-Z>_proposal`,
    - `ID-T = 01` służy doprecyzowaniu `additional-contexts.md`,
    - prosisz o **tryb aktywnego dopytywania** (agent dopisze pytania do sekcji 6 w `additional-contexts.md` i pomoże przerobić surowe dane na plan).

Resztę szczegółów (jak numerować kolejne `ID-T`, jak robić HANDOFF itd.) znajdziesz w dalszych sekcjach tego pliku.

## 1. Kiedy tworzyć nowe zadanie

Nowy katalog zadania twórz, gdy:

- pojawia się nowy, wyraźny cel biznesowy (nowa funkcjonalność, większa refaktoryzacja, istotny bug),
- istniejące zadanie jest już `done`, a nowy temat nie jest logiczną kontynuacją poprzedniego,
- chcesz „odkleić” większy temat od `ideas/` i zacząć nad nim realnie pracować.

Jeżeli to tylko mały krok w ramach istniejącego celu, dodaj **pod‑zadanie** (`ID-T`) w istniejącym `tasks.md`, zamiast tworzyć nowy folder `<ID-Z>_<status>/`.

## 2. Szablon katalogu zadania

Najprostszy sposób: **skopiuj** `template-task_proposal/` i dostosuj go do nowego `<ID-Z>_proposal/`.

Katalog `template-task_proposal/` jest bazowym szablonem do kopiowania. Katalogów `example1-task_done/` i `example2-task_in-progress/` nie używamy jako aktywnych zadań – traktuj je jako referencje historyczne (można podejrzeć przykładowe wypełnienie, ale nowy katalog twórz na bazie `template-task_proposal/`).

Dodatkowo istnieją template’y:
- `template-workspace-bootstrap_proposal/` – „pierwszy task” po inicjalizacji workspace (używany automatycznie przez `render.py --mode init --create-bootstrap-task`). Zawiera automatycznie wygenerowane subtaski audytu instrukcji (`AGENTS/CLAUDE/GEMINI.md`).
- `template-workspace-sync-audit_proposal/` – task audytu instrukcji po `render.py --mode sync`, tworzony tylko gdy wykryto różnice `old-origin-*` vs `origin-*`; katalog taska ma status `_in-progress`.
Dla jasności: `template-workspace-bootstrap_proposal/` i `template-workspace-sync-audit_proposal/` **nie są kopiowane** do `agents-tasks-knowledge/tasks/`. Są źródłami w `framework/task-templates/` (upstream) i ich kopie trafiają do `agents-tasks-knowledge/.tooling/task-templates/`, skąd narzędzia tworzą realne taski w `tasks/`.
Dla zwykłych zadań produktowych nadal używaj `template-task_proposal/`.

Przykład nowego katalogu:

- `tasks/230101-feature-employee-reports_proposal/`

Nazwa katalogu:

- `230101-feature-employee-reports` – dowolny identyfikator (np. data + krótki opis),
- `_proposal` – startowy status zadania (`proposal`, `to-do`, `planning`, `planned`, `in-progress`, `on-hold`, `done` – patrz definicje w `CLAUDE.md` w katalogu `agents-tasks-knowledge/`).

W nowym katalogu powinny być:

    <ID-Z>_<status>/
      additional-contexts.md
      tasks.md
      additional-notes/

Po skopiowaniu katalogu szablonu (np. `template-task_proposal/`):

- **od razu** zmień nazwę katalogu na nowe `<ID-Z>_<status>`,
- ustaw sufiks katalogu na bieżący stan całego workstreamu (`proposal`/`to-do`/`planning`/`planned`/`in-progress`/`on-hold`/`done`).

Nowa zasada spójności statusów katalogu i wierszy w `tasks.md`:

- Status katalogu odzwierciedla stan całego workstreamu i **nie musi** kopiować statusu wiersza `ID-T = 01`.
- Zmiana sufiksu na `_on-hold` nie wymusza zmian statusów w tabeli – wiersze zachowują dotychczasowe statusy; w `Co zrobiono do tej pory` dodaj krótką notatkę o pauzie.
- Gdy rozpoczynasz lub wznawiasz realne prace nad którymkolwiek wierszem (np. pierwsze zmiany w kodzie/planie), ustaw katalog na `_in-progress`.
- Po zakończeniu całości ustaw katalog na `_done`; wiersz `ID-T = 01` powinien być wtedy `done`, a pozostałe wiersze oddają faktyczny stan (done/on-hold itp.).

## 3. Wypełnianie `additional-contexts.md` (opis biznesowy, forma BA)

### 3.1. Kto wypełnia ten plik

`additional-contexts.md` jest przede wszystkim **dokumentem BA / właściciela zadania**.

- BA / właściciel wypełnia w pierwszej kolejności sekcje:
    - `1. Surowe dane`,
    - `2. Dlaczego robimy to zadanie?`,
    - `3. Co ma się zmienić dla użytkownika / biznesu?` (wraz z podsekcjami scenariuszy i kryteriów),
    - `4. Źródło zadania i interesariusze`,
    - `5. Ograniczenia i zakres`.
- Agent techniczny (agent CLI (np. codex-cli, Claude Code, Gemini CLI)) uzupełnia głównie:
    - `1. Otwarte pytania`,
    - `2. Ustalenia z rozmów`,
    - `3. Notatka dla tasks.md`,
    - ewentualne sekcje opcjonalne (założenia, ryzyka, słownik pojęć) – na podstawie rozmowy z właścicielem zadania.

Im lepiej BA wypełni sekcje 1–5, tym mniej agent będzie musiał zgadywać.

### 3.2. Kanoniczny szablon `additional-contexts.md`

Każdy katalog zadania `<ID-Z>_<status>/` powinien mieć plik `additional-contexts.md` zgodny z poniższym szablonem. Treść między nagłówkami możesz kopiować 1:1 i nadpisywać opisy.

```markdown
# <ID-Z> – kontekst zadania

## 1. Surowe dane / materiały wejściowe

_Tu właściciel wkleja wszystko 1:1, bez porządkowania:_
- opisy z systemów ticketowych / maili / notatek,
- cytaty z rozmów,
- inne materiały źródłowe.

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)

_Krótkie streszczenie (2–5 zdań):_
- Jaki problem rozwiązujemy?
- Dlaczego to jest ważne teraz?

## 3. Co ma się zmienić dla użytkownika / biznesu?

### 3.1 Użytkownicy / role
- Jakie role / persony mają korzystać z efektu zadania?

### 3.2 Scenariusze biznesowe / przypadki użycia
- Scenariusz 1 – happy path: ...
- Scenariusz 2 – wariant / edge case: ...
- Przypadki brzegowe: ...

### 3.3 Zasady biznesowe
- Reguła 1: ...
- Reguła 2: ...

### 3.4 Dane i wynik
- Jakie dane wchodzą? (pola, źródła)
- Jaki jest oczekiwany wynik? (ekran, raport, zmiana stanu)

### 3.5 Kryteria akceptacji (biznesowe)

- [ ] Użytkownik X może ...
- [ ] Raport / ekran zawiera pola ...
- [ ] Proces kończy się, gdy ...

## 4. Źródło zadania i interesariusze

- Źródło (ticket, mail, spotkanie): ...
- Właściciel zadania: ...
- Główni interesariusze: ...
- Systemy / moduły, których dotyczy: ...

## 5. Ograniczenia i zakres

### 5.1 Ograniczenia
- Czasowe (deadliny, releasy): ...
- Technologiczne / architektoniczne („czego nie ruszamy”): ...
- Organizacyjne / inne: ...

### 5.2 Zakres in / out
- **W zakresie**: ...
- **Poza zakresem**: ...

### 5.3 Założenia i ryzyka (opcjonalne)
- Założenia: ...
- Ryzyka: ...

## 6. Otwarte pytania (dla Agenta i właściciela)

Tę sekcję wypełnia w praktyce głównie agent. Po uzyskaniu odpowiedzi:
    - oznacz pytanie jako `[x]`,
    - skrót odpowiedzi przenieś do sekcji 7,
    - **nie usuwaj** pytań – historia Q&A ma być odtwarzalna.

    - [ ] **P1:** ...
    - [ ] **P2:** ...

## 7. Ustalenia z rozmów (podsumowanie Q&A)

_Tu lądują ważniejsze decyzje z historii czatu, w formie timeline'u._

- 2025-01-01 – ustalono, że ...
- 2025-01-02 – doprecyzowano, że ...

## 8. Notatka dla `tasks.md` (brief do planu technicznego)

_Zwięzłe podsumowanie, które jest mostem do `tasks.md`:_

- Backend (frontend-only-api): ...
- GUI (ut-angular): ...
- Dane / migracje: ...
- Testy / kryteria DONE: ...

## 9. Jak poznamy, że zadanie odniosło sukces? (KPI / miary) – opcjonalne

- Krótkie, mierzalne kryteria (np. „czas pracy PM skrócony o…”, „użytkownik może X bez kontaktu z działem Y”).

## 10. Słownik pojęć (opcjonalne)

- „Zlecenie” = ...
- „Projekt” = ...
```

### 3.3. Tryb „aktywnego dopytywania” przez Agenta

Jeżeli właściciel zadania:

* wypełni **co najmniej sekcję 1 („Surowe dane”)** oraz
* w rozmowie poprosi wprost o tryb „aktywnego dopytywania”
  (np. napisze „Przeczytaj `additional-contexts.md` i zadaj mi wszystkie potrzebne pytania”),

to agent ma obowiązek:

1. **Przeczytać `additional-contexts.md`**, szczególnie sekcję 1 i to, co już jest wpisane w sekcjach 2–5.
2. **Nie proponować od razu pełnego planu w `tasks.md`.**

**Best practices (spójne z trybem planowania / `$mode-plan`):**

- Dopytywanie prowadź w 2 fazach:
  1) **Intent** - cel + kryteria sukcesu, zakres in/out, ograniczenia, stan obecny, preferencje/trade-offy.
  2) **Implementation (decision-complete)** - podejście, interfejsy (API/schemy/I/O), przepływy danych, edge case’y, testy + akceptacja, rollout/monitoring, migracje/kompatybilność.

- W każdej rundzie dodaj krótkie pytanie „**Potwierdź proszę, czy dobrze rozumiem:** …?” - żeby właściciel mógł szybko skorygować kierunek.

- Pytaj dużo, ale bez triviów: pytania mają realnie wpływać na plan/spec lub domykać trade-off. Dla tempa grupuj je w paczki (np. 4–10).

- Dwa typy niewiadomych:
  1) **Fakty do odkrycia** → zanim zapytasz właściciela, sprawdź repo i źródła prawdy (min. 2 wyszukania). Jeśli pytasz - podaj kandydatów + rekomendację.
  2) **Preferencje/trade-offy** → pytaj wcześnie; dawaj 2–4 opcje + rekomendację. Jeśli brak odpowiedzi, przyjmij rekomendację i zapisz jako **założenie** w `additional-contexts.md`.

Dodatkowo:
- **Gate kontraktu międzyserwisowego (obowiązkowy):** jeśli task obejmuje co najmniej dwa serwisy (np. `api` + `gui`), zanim ruszą ID-T implementacyjne tych serwisów musi istnieć `done` dla kroku kontraktowego (minimum: operacje/endpointy, payloady, błędy, kompatybilność).
- **Pre-flight gate check:** skrótowe komendy właściciela (np. `1`/`2`) nie omijają gate. Jeśli warunek gate nie jest spełniony, agent zatrzymuje implementację i wraca do planowania albo uzyskuje jawny waiver właściciela.
- **Gate UI/browser + konta testowe:** `agent-browser` jest obowiązkowy tylko dla tasków UI/przeglądarkowych; dla takich tasków wymagaj skrótu kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) w `additional-contexts.md` i referencji do `/.env.test-accounts`.
- **Równoległość (obowiązkowa):** uruchom 2 subagentów + Claude + Gemini **równolegle** (wspólny `<TS>` dla całej rundy).
- **Barrier:** syntezę i decyzje (PASS/FAIL, kolejny krok) wykonuj **dopiero po komplecie 4 raportów**; przy fallbacku wymagaj decyzji właściciela.
- **Subagent review (obowiązkowe):** po ułożeniu większego planu poproś dwóch niezależnych subagentów o szczegółową recenzję, zapisz raporty w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-subagent-*.md` i wprowadź poprawki, jeśli są uwagi.
- **Claude review (obowiązkowe):** uruchom audyt planu przez Claude i zapisz raport w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-claude.md`.
- **Gemini review (obowiązkowe):** uruchom audyt planu przez Gemini (`gemini "<prompt>"`) i zapisz raport w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-gemini.md` (np. copy/paste).
- **Fallback Gemini:** jeśli Gemini niedostępny/timeout -> utwórz `additional-notes/<YYYYMMDD-HHMM>-plan-audit-gemini.md` z informacją o braku oraz `additional-notes/<YYYYMMDD-HHMM>-audit-blockers.md`; **nie zamykaj** `ID-T=01` bez decyzji właściciela.
- **Pętla „bez zastrzeżeń”:** iteruj audyty i poprawki aż do braku uwag (P1/P0 blokują; P2 po 3 rundach nie blokują); w razie problemu po 3 iteracjach lub 2h utwórz `additional-notes/<YYYYMMDD-HHMM>-audit-blockers.md` i poproś właściciela o decyzję.
- **Dowody w `tasks.md`:** po każdej rundzie audytu dopisz w wierszu `01` (kolumna `Co zrobiono do tej pory`) nazwy plików raportów audytu.
- **Algorytm pętli (procedura, bez interpretacji):**
  1) Jeśli istnieje P1/P0 lub P2 przed 3 rundami -> **nie zamykaj** `ID-T=01` i **nie przechodź** do `ID-T=02+`.
  2) Każdą uwagę z audytu mapuj na konkretną zmianę w `additional-contexts.md` / `tasks.md`.
  3) Po poprawkach zaktualizuj daty `Zaktualizowano` i uruchom audyty ponownie.
  4) Po 3 iteracjach lub 2h (jeśli nadal P1/P0 lub brak decyzji) -> `*-audit-blockers.md` + `[BLOCKER]` w `tasks.md` + eskalacja do właściciela.
- **Context7:** jeśli plan opiera się o zewnętrzne biblioteki/API, zweryfikuj aktualną dokumentację w Context7.

3. Najpierw zbudować listę pytań do sekcji 6, pogrupowanych tematycznie, np.:

    * Użytkownicy / role – kto dokładnie i w jakich sytuacjach?
    * Zakres / poza zakresem – czego na pewno nie robimy w tym zadaniu?
    * Proces / scenariusze – jak wygląda „happy path”, a jak scenariusze wyjątkowe?
    * Dane – jakie pola są wymagane, skąd pochodzą, gdzie są zapisywane?
    * Ograniczenia / ryzyka – co może zablokować wdrożenie, na czym nie możemy eksperymentować?
    * Definicja sukcesu / DONE – po czym poznamy, że biznesowo zadanie jest zakończone?
4. Wpisać te pytania do sekcji 6 w formie checklisty:

    * `- [ ] P1: ...`,
    * `- [ ] P2: ...`.
5. Dopiero po uzyskaniu odpowiedzi od właściciela:

    * zaproponować uzupełnienie lub korektę sekcji 2–5 oraz 7–8,
    * na tej podstawie zaproponować plan w `tasks.md` (ID‑T, statusy, HANDOFFy).

Agent powinien wprost komunikować w odpowiedzi, że pracuje w trybie „aktywnego dopytywania”.

### 3.3. Audyt końcowy (final-audit) przed `done`

Final‑audit to **symetryczny** proces do plan‑audit, uruchamiany **przed** zamknięciem taska. Różnica dotyczy etapu (zamknięcie) i nazewnictwa raportów.

**Zasady (symetria z plan‑audit):**
- 2 niezależni subagenci + Claude + Gemini, uruchamiani **równolegle** (wspólny `<TS>`).
- Synteza i decyzja PASS/FAIL dopiero po komplecie 4 raportów (albo po fallbacku i decyzji właściciela).
- Pętla „bez zastrzeżeń” (P1/P0 blokują; P2 po 3 rundach nie blokują; jeśli są uwagi → popraw i powtórz).
- Fallback po 3 iteracjach lub 2h: `*-audit-blockers.md` + `[BLOCKER]` w `tasks.md` + eskalacja do właściciela.
- Jeśli task dotyka UI/przeglądarki: obowiązkowe testy manualne `agent-browser` (start od `agent-browser connect 9222`) z użyciem danych z `/.env.test-accounts`.
- Nazwy raportów: `additional-notes/<TS>-final-audit-*.md`.

**Procedura final‑audit:**
- Upewnij się, że wszystkie ID‑T są `done` lub jawnie `on-hold` z uzasadnieniem.
- Zbierz dowody testów/weryfikacji (jeśli dotyczy) i aktualne `tasks.md`.
- Uruchom **równolegle** (wspólny `<TS>`): 2 subagenty, Claude i Gemini; syntezę wykonaj dopiero po komplecie 4 raportów.
- Uruchom **2 subagentów** z tym samym promptem; raporty zapisz jako:
  - `additional-notes/<TS>-final-audit-subagent-1.md`
  - `additional-notes/<TS>-final-audit-subagent-2.md`
- Uruchom Claude **bezpośrednio** (nie używaj `script`/`tee`/`nohup`/`&`):
  `claude -p "$(cat /tmp/final_audit_prompt.txt)"`
  *W treści promptu wskaż docelowy plik: `additional-notes/<TS>-final-audit-claude.md` (wynik ma być gotowy do wklejenia).*
- Uruchom Gemini **bezpośrednio** (nie używaj `script`/`tee`/`nohup`/`&`):
  `gemini --yolo "$(cat /tmp/final_audit_prompt.txt)"`  
  i zapisz raport w `additional-notes/<TS>-final-audit-gemini.md` (np. copy/paste).
  *W treści promptu wskaż docelowy plik: `additional-notes/<TS>-final-audit-gemini.md` (wynik ma być gotowy do wklejenia).*
- **Fallback Gemini:** jeśli Gemini niedostępny/timeout -> utwórz `additional-notes/<TS>-final-audit-gemini.md` z informacją o braku oraz `additional-notes/<TS>-audit-blockers.md`; **nie zamykaj** `ID-T` bez decyzji właściciela.
- **Brak timeoutu:** nie ustawiaj twardego limitu czasu procesu.
- **Monitoring:** co 1 minutę sprawdzaj status/PID i czy przybywa outputu.
- **Bezczynność:** jeśli przez 30 min brak nowego outputu -> zatrzymaj proces i zastosuj fallback (raport braku + `*-audit-blockers.md` + decyzja właściciela); bez auto-PASS.
- Jeśli **jakiekolwiek uwagi** → popraw realizację/artefakty i **powtórz** audyt.
- Po PASS: wpisz nazwy raportów w `tasks.md` i odhacz checklistę „przed done”.

**Minimalny format raportu:**
- Nagłówek (data/czas, zakres, audytor),
- Findings P0/P1/P2 + rekomendacje,
- Werdykt PASS/FAIL + next steps.

### 3.4. Audyt template'ow `.j2` (zakres i procedura)

Gdy zadanie dotyczy audytu template'ow `.j2`, stosuj ponizszy **zakres etapowy**, checklisty i procedure audytu subagentow + Claude.

**Zakres etapowy:**
- **Etap 1 (podzbior kluczowy):** instrukcje/README/AGENT_PROFILES oraz kategorie `agents-tasks-knowledge/`, `repo/`, `root/`, `backend/`, `frontend/`, `nx/`, `scripts/`, warianty `legacy-*`.
- **Etap 2 (reszta):** tylko po decyzji wlasciciela **lub** jesli etap 1 ujawni rozbieznosci wymagajace weryfikacji snippetow.

**Checklisty audytu `.j2` (skrot):**
1) Zakres i mapowanie: plik jest w etapie 1/2, wiadomo gdzie jest renderowany, brak „sierot” bez opisu.  
2) Spojnosc tresci: brak sprzecznosci z root/`agents-tasks-knowledge`, legacy vs new bez konfliktow.  
3) Placeholdery/konfiguracja: brak niezdefiniowanych zmiennych Jinja; nowe pola maja `|default(...)` lub walidacje.  
4) Bezpieczenstwo: brak destrukcyjnych komend bez ostrzezen i zakresu srodowiska.  
5) Workflow + HANDOFF: zgodnosc statusow/kolumn/daty/SESSION; wymagane markery HANDOFF obecne w `tasks.md`.  
6) Linki i format: poprawne linki wzgledne, spójny format i jezyk.  

**Procedura subagentow + Claude + Gemini:**
- Uruchom **równolegle** (wspólny `<TS>`) 2 subagentów + Claude + Gemini; syntezę wykonaj dopiero po komplecie 4 raportów.
- Uruchom **2 niezalezne subagenty** z tym samym promptem audytu; raporty zapisz w `additional-notes/<TS>-plan-audit-subagent-*.md`.
- Uruchom Claude **bezpośrednio** (nie używaj `script`/`tee`/`nohup`/`&`):  
  `claude -p "$(cat /tmp/final_audit_prompt.txt)"`  
  *W treści promptu wskaż docelowy plik: `additional-notes/<TS>-plan-audit-claude.md` (wynik ma być gotowy do wklejenia).*  
  i **monitoruj co 1 minute** (status subagentow + proces Claude).
- Uruchom Gemini:
  `gemini --yolo "$(cat /tmp/final_audit_prompt.txt)"` (bez `script`/`tee`/`nohup`/`&`)  
  i zapisz raport w `additional-notes/<TS>-plan-audit-gemini.md` (np. copy/paste).
  *W treści promptu wskaż docelowy plik: `additional-notes/<TS>-plan-audit-gemini.md` (wynik ma być gotowy do wklejenia).*
- **Brak timeoutu:** nie ustawiaj twardego limitu czasu procesu.
- **Monitoring:** co 1 minutę sprawdzaj status/PID i czy przybywa outputu.
- **Bezczynność:** jeśli przez 30 min brak nowego outputu -> zatrzymaj proces i zastosuj fallback (raport braku + `*-audit-blockers.md` + decyzja właściciela); bez auto-PASS.
- **Fallback Claude:** jesli niedostepny/timeout -> utworz `additional-notes/<TS>-plan-audit-claude.md` z informacja o braku oraz `additional-notes/<TS>-audit-blockers.md`; **nie zamykaj** `ID-T=01` bez decyzji wlasciciela.
- **Fallback Gemini:** jesli niedostepny/timeout -> utworz `additional-notes/<TS>-plan-audit-gemini.md` z informacja o braku oraz `additional-notes/<TS>-audit-blockers.md`; **nie zamykaj** `ID-T=01` bez decyzji wlasciciela.
- **Tryb automatyczny/autonomiczny:** minimalne interakcje, wybory „pro” bez przerostu.

**Format raportu (minimalny):**
- Naglowek: data/czas, zakres, lista audytowanych `.j2`.
- Findings: P0/P1/P2 z plikami i rekomendacjami.
- Ryzyka/uwagi + Werdykt PASS/FAIL + Nastepne kroki.

`<TS>` = `YYYYMMDD-HHMM` (czas lokalny).

## 4. Wypełnianie `tasks.md` – pierwszy szkic planu

W `tasks.md` tworzysz **tabelę kroków**. Każdy wiersz to zadanie (`ID-T`).

### 4.1. Minimalne kolumny (przypomnienie)

- `ID-T` – numer zadania / pod‑zadania (np. `01`, `01-01`, `01-02`),
- `Status` – wg sekcji „Files statuses” w `CLAUDE.md` w katalogu `agents-tasks-knowledge/`,
- `Agent` – identyfikator agenta lub osoby, która jest „właścicielem” wiersza (np. `api-1`, `gui-1`, `ba`, `human-pm`). W trybie multi‑agent techniczne agenty biorą **tylko** wiersze z `Agent = ich AGENT_ID` lub z pustym `Agent` (który przy starcie pracy uzupełniają).
- `Rodzic` – `ID-T` zadania nadrzędnego (dla pod‑zadań),
- `Zadanie` – krótki, konkretny opis,
- `Opis` – rozszerzenie, jeśli potrzebne,
- `Utworzono` – data + godzina stworzenia wiersza, w formacie `YYYY-MM-DD HH:MM` (np. `2025-01-02 10:15`),
- `Zaktualizowano` – data + godzina ostatniej zmiany, w tym samym formacie,
- `Co zrobiono do tej pory` – notatki z postępu.

Przykładowy nagłówek tabeli w `tasks.md` (Markdown):

| ID-T | Status   | Agent | Rodzic | Zadanie                 | Opis                  | Utworzono           | Zaktualizowano       | Co zrobiono do tej pory |
|------|----------|-------|--------|-------------------------|------------------------|---------------------|----------------------|--------------------------|
| 01   | planning | ba    |        | Ogólny opis zadania     | Opcjonalne rozwinięcie | 2025-01-02 10:15    | 2025-01-02 10:15     | —                        |


> **Uwaga:** kolejność kolumn w nagłówku tabeli `tasks.md` powinna być
> identyczna we wszystkich katalogach zadań (`ID-T`, `Status`, `Agent`,
> `Rodzic`, `Zadanie`, `Opis`, `Utworzono`, `Zaktualizowano`,
> `Co zrobiono do tej pory`). Przy kopiowaniu szablonu upewnij się,
> że nagłówek nie został zmodyfikowany.


> Uwaga (multi‑agent):
> - W nowych zadaniach kolumna `Agent` powinna być uzupełniona od razu na etapie planowania (np. `api-1` dla backendu, `gui-1` dla frontu, `ba` dla analityka).
> - W starszych zadaniach, gdzie kolumny `Agent` brak, traktuj to tak, jakby `Agent` był pusty – dowolny agent może przejąć wiersz i uzupełnić tę kolumnę przy pierwszej realnej pracy nad danym `ID-T`.


### 4.2. Jak numerować `ID-T`

**Twarda zasada:** `ID-T = 01` jest **zawsze** „Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego” dla danego zadania.

Uwaga dla starszych zadań: w niektórych istniejących katalogach możesz spotkać `ID-T = 01`
o innej nazwie (np. „Analiza raportów VAT”) – to zadania sprzed wprowadzenia tej zasady.
**Nie zmieniaj im numerów** (historia ma pozostać odtwarzalna); traktuj je jak odpowiednik `01-01`
w nowym schemacie.
Nowe zadania zakładaj już zgodnie z powyższą zasadą (`01` = doprecyzowanie `additional-contexts.md` + plan).

Przykład:

- `01` – „Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego”.
    - `01-01` – analiza wymagań biznesowych raportów.
    - `01-02` – zaproponowanie struktury danych / API dla raportów.
- `02` – „Implementacja backendu”.
    - `02-01` – dodanie encji / migracji.
    - `02-02` – dodanie endpointu API.
- `03` – „Implementacja GUI”.
    - `03-01` – widok listy raportów.
    - `03-02` – widok szczegółów raportu.

Najważniejsze, żeby struktura była **czytelna dla kolejnego agenta**.

Po nadaniu `ID-T` nigdy go nie zmieniaj – nowe pomysły / zmiany planu = nowe wiersze, nie nadpisywanie historii.

### 4.3. Statusy na starcie

Zasada podstawowa dla `ID-T = 01`:

- `ID-T = 01` **zawsze** służy doprecyzowaniu i uzupełnieniu `additional-contexts.md` oraz przygotowaniu planu technicznego w `tasks.md`.
- Na starcie ma `Status` = `planning`.
- Po zakończeniu doprecyzowania i zaakceptowaniu planu przez właściciela – ustaw `Status` = `done`.
- Jeśli zadanie obejmuje co najmniej dwa serwisy (np. `api` + `gui`), w planie musi istnieć osobny krok kontraktu międzyserwisowego; kroki implementacyjne tych serwisów nie mogą wystartować przed `done` dla tego kroku.

Dla pozostałych zadań:

- główne kroki techniczne (`02`, `03`, `04`… – kolumna `Rodzic` pusta):
    - `Status` = `planned`, jeśli plan został już uzgodniony z właścicielem,
    - `Status` = `proposal`, jeśli to tylko wstępny pomysł / szkic planu.
- pod‑zadania (`01-01`, `02-01`, ... – kolumna `Rodzic` ustawiona):
    - mogą mieć `Status` = `planning` lub `planned` zgodnie z tym, czy są dopiero rozpisywane, czy gotowe do realizacji,
    - po wejściu w realną realizację ustawiaj `Status` = `in-progress`.

Gdy właściciel zaakceptuje plan całościowy zadania, główne kroki techniczne (`02`, `03`, `04`…) powinny mieć co najmniej `planned`.

## 5. `additional-notes/` – kiedy i jak używać

Twórz pliki `additional-notes/<ID-T>.md`, np.:

- `additional-notes/02-01.md` – szczegółowe notatki do zadania `02-01`.

W takich plikach możesz trzymać:

- szczegółowe analizy (zrzuty SQL, logi, rozpisane przypadki brzegowe),
- wklejone fragmenty maili, dłuższe decyzje architektoniczne,
- listy TODO powiązane z jednym pod‑zadaniem.

Zasada:

jeśli coś jest za długie, żeby sensownie zmieściło się w `Opis` lub `Co zrobiono do tej pory`, przenieś to do `additional-notes/<ID-T>.md` i w tabeli zostaw skrót + odwołanie.

## 6. Powiązanie z `ideas/`

Jeżeli nowe zadanie powstało z wpisu w `ideas/ideas.md`:

1. W `ideas/ideas.md` uzupełnij wpis idei:
    - ustaw `Status` na `in-progress` (albo `done`, jeśli pomysł został zrealizowany),
    - dopisz `Task: <ID-Z>_<status>` (żeby było wiadomo, gdzie przeniesiono pomysł).
2. W `additional-contexts.md` nowego zadania dopisz:
    - „Źródło: `ideas/ideas.md` — <tytuł idei> (Created: YYYY-MM-DD HH:MM)”.

Dzięki temu ścieżka „pomysł → zadanie” jest odtwarzalna.

## 7. Checklista przy tworzeniu nowego zadania

Przed uznaniem, że nowe zadanie jest poprawnie utworzone, sprawdź:

- [ ] **KRYTYCZNE:** nowy katalog nie nazywa się już `template-task_proposal/`
  ani `example2-task_in-progress/`. Nazwa musi mieć postać
  `tasks/<ID-Z>_proposal/` (np. `250101-feature-reporting_proposal/`).
  Jeśli katalog wciąż zaczyna się od `template-` lub `example`, popraw nazwę
  zanim pójdziesz dalej.
- [ ] nadałem nowe, niepowtarzalne `ID-Z`,
- [ ] utworzyłem folder `tasks/<ID-Z>_<status>/` z plikami:
    - [ ] `additional-contexts.md`,
    - [ ] `tasks.md`,
    - [ ] `additional-notes/`,
- [ ] w `additional-contexts.md` opisałem:
    - powód istnienia zadania,
    - oczekiwany efekt,
    - ograniczenia,
- [ ] w `tasks.md` istnieje tabela z kolumnami (`ID-T`, `Status`, `Agent`, `Rodzic`, `Zadanie`, `Opis`, `Utworzono`, `Zaktualizowano`, `Co zrobiono do tej pory`) w formacie dat `YYYY-MM-DD HH:MM`,
- [ ] dodałem wiersz dla głównego zadania (`ID-T = 01`), którego celem jest **doprecyzowanie i uzupełnienie `additional-contexts.md` oraz stworzenie wstępnego planu w `tasks.md` (bez bezpośredniego dłubania w kodzie)**; na starcie ma on `Status = planning`, a po akceptacji planu przez właściciela zadania – `Status = done`,
- [ ] jeśli spodziewam się większej analizy – utworzyłem `additional-notes/01-01.md`,
- [ ] jeśli zadanie pochodzi z `ideas/`, zlinkowałem to w obie strony,
- [ ] status katalogu (`<ID-Z>_<status>`) odzwierciedla stan całego workstreamu (proposal/to-do/planning/planned/in-progress/on-hold/done) zgodnie z zasadą: `_on-hold` nie zmienia statusów w tabeli, start prac -> `_in-progress`, zakończenie całości -> `_done` (wtedy `ID-T = 01` powinno być `done`).
- [ ] po utworzeniu katalogu ustawiłem `agents-tasks-knowledge/SESSION.md` (`current-task` = nowy katalog, `current-id-t` domyślnie `01`).
- [ ] Jeśli któryś krok ma służyć jako analiza/podkład pod kolejne – zaznacz to w jego opisie i przygotuj miejsce na HANDOFF.


## 8. Planowanie zależności między wierszami (HANDOFF)

Przy tworzeniu pierwszego szkicu `tasks.md`:

- jeżeli wiesz, że wynik kroku `ID-T = 01` będzie wejściem do kolejnych kroków (`02`, `03`, `01-01` itd.):
    - zaznacz to w kolumnie `Opis` (np. „02: implementacja backendu wg analizy z 01”),
    - po zakończeniu 01 dopisz w jego `Co zrobiono do tej pory` blok z `[HANDOFF: 02, 03]` i przenieś szczegóły do `additional-notes/01.md` (sekcja „Wnioski dla kolejnych kroków”).

Agent, który będzie realizował później krok `02` albo `03-01`, ma obowiązek:

- sprawdzić wcześniejsze wiersze w `tasks.md` pod kątem `[HANDOFF: <jego ID-T>]`,
- przeczytać odpowiednie sekcje w `additional-notes/<ID-T-kontekstu>.md` zgodnie z głównym `CLAUDE.md`.

## 9. Flow właściciel ↔ agent (agent CLI – np. codex-cli, Claude Code, Gemini CLI)

Ten flow opisuje krok po kroku, jak współpracują właściciel zadania (BA / PM) i agent (Codex CLI) przy zakładaniu nowego zadania w `tasks/`.

### 9.1. Kroki właściciela zadania

1. Wymień identyfikator `<ID-Z>` (np. `250101-feature-reporting`).
2. Skopiuj katalog `tasks/template-task_proposal/` do `tasks/<ID-Z>_proposal/` i popraw nazwę katalogu oraz placeholdery.
3. W nowym katalogu:
    - uzupełnij `additional-contexts.md` (minimum sekcja `1. Surowe dane`),
    - upewnij się, że w `tasks.md` istnieje wiersz `ID-T = 01`:
        - `Zadanie`: „Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego”,
        - `Status`: `planning`,
        - `Rodzic`: puste.
4. Ustaw `agents-tasks-knowledge/SESSION.md`:
    - `current-task` = `<ID-Z>_proposal`,
    - `current-id-t` = `01`,
    - `last-updated` = bieżąca data i godzina (`YYYY-MM-DD HH:MM`).
5. W rozmowie z agentem napisz wprost, że:
    - jest nowe zadanie `<ID-Z>_proposal`,
    - `ID-T = 01` służy doprecyzowaniu `additional-contexts.md` i planu,
    - prosisz o **tryb aktywnego dopytywania**.

### 9.2. Kroki agenta (agent CLI – np. codex-cli, Claude Code, Gemini CLI)

1. Odczytaj `agents-tasks-knowledge/SESSION.md` i potwierdź, że:
    - `current-task` = `<ID-Z>_proposal`,
    - `current-id-t` = `01`.
 Jeżeli w rozmowie właściciel zadania wskazuje inny katalog (np. inne `<ID-Z>_proposal`)
 niż ten z `SESSION.md`, opisz ten rozjazd w odpowiedzi i zaproponuj aktualizację `SESSION.md`
 tak, aby `current-task` odpowiadał nowemu katalogowi zadania oraz `current-id-t = 01`.
2. Otwórz `tasks/<ID-Z>_proposal/additional-contexts.md`:
    - przeczytaj sekcję `1. Surowe dane` i to, co jest w sekcjach 2–5.
3. Wejdź w tryb „aktywnego dopytywania”:
    - zbuduj listę pytań do sekcji 6 (`Otwarte pytania`) jako checklistę `- [ ] P1: ...`,
    - zadawaj te pytania właścicielowi w rozmowie.
4. Po uzyskaniu odpowiedzi:
    - uzupełnij sekcje 2–5, 7–8 w `additional-contexts.md`,
    - doprecyzuj wiersz `ID-T = 01` (jeśli trzeba),
    - rozpisz główne kroki techniczne (`02`, `03`, `04`…) w `tasks.md`:
        - `Status` = `planned` dla uzgodnionych kroków,
        - `Status` = `proposal` dla pomysłów do dopracowania.
5. Gdy plan jest uzgodniony z właścicielem:
    - ustaw `Status` wiersza `01` na `done`,
    - jeśli to ma sens, zmień sufiks katalogu na `_planned`.
6. Zaktualizuj `agents-tasks-knowledge/SESSION.md`, jeśli:
    - zmieniłeś sufiks katalogu (`_proposal` → `_planning` / `_planned` / `_in-progress`),
    - kolejnym aktywnym krokiem ma być `ID-T` inny niż `01`.