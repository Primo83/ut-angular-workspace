# Przewodnik agents-tasks-knowledge (repo główne)

## TL;DR – jak agent ma pracować z zadaniami

1. Zawsze zaczynaj od katalogu `tasks/` i wybierz zadanie, które **nie ma** statusu `done` ani `on-hold`, **jeśli w tej rozmowie rzeczywiście pracujesz nad zadaniem** (planowanie lub wykonanie).
2. Na początku pracy nad zadaniem:
    - przeczytaj `additional-contexts.md`,
    - przejrzyj `tasks.md`,
    - w razie potrzeby zobacz pliki w `additional-notes/`.
3. Ustal, czy jesteś w **trybie planowania**, czy **trybie wykonawczym**:
    - w planowaniu – tworzysz / poprawiasz plan w `tasks.md`, nie „robisz kodu”,
    - w wykonawczym – realizujesz kroki planu i aktualizujesz `tasks.md` oraz notatki.
4. Zawsze aktualizuj:
    - `Status`,
    - `Co zrobiono do tej pory`,
    - `Zaktualizowano`.
5. **Nigdy** nie wybieraj do pracy katalogów `example1-task_done/`, `example2-task_in-progress/` ani `template-task_proposal/` – to tylko referencje / szablon do kopiowania.

6. Wyjątek: jeśli właściciel repozytorium **wprost mówi**, że chodzi tylko o jednorazową analizę /
   wyjaśnienie bez zmian w repo (zgodnie z głównym `GEMINI.md`), możesz potraktować ten plik
   wyłącznie jako referencję i **nie tworzyć / nie aktualizować** zadań w `tasks/`.

7. Jeśli w repo istnieje `CONTINUITY.md`, to przy pytaniach o status / wznowienie pracy łączysz go z `SESSION*.md`
   (o ile istnieją) i odpowiednim `tasks.md`.

> W tym pliku „właściciel zadania” = osoba, z którą prowadzisz rozmowę (użytkownik / właściciel repo).

---

## Struktura

`agents-tasks-knowledge/` jest repozytorium wiedzy operacyjnej agentów – trafiają tu materiały, które pomagają szybko zrozumieć kontekst działań i utrzymać ciągłość pracy między sesjami.

- `SESSION.md` – lekki wskaźnik bieżącej pracy agenta (ostatnio używane zadanie i `ID-T`), używany głównie przy restartach sesji / trybie autonomicznym.

- `AGENT_PROFILES.md` – tabela z profilami agentów (`AGENT_ID` + meta subagentów: `agent_type`, `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `skills`, `hooks`); używana do interaktywnego wyboru roli na starcie sesji. `agent_type` jest opisowe (default/orchestrator/worker) i **nie** zastępuje `type` komponentu.

- `ideas/`  
  Miejsce na zalążki przyszłych inicjatyw, pomysły i obserwacje, które **nie są jeszcze zadaniami**.
    - `ideas/ideas.md` zawiera listę idei w formacie Markdown (szablon wpisu jest w tym pliku).
      Każdy wpis ma `Created` (co do minuty) oraz `Status` / checkbox, plus pola rozszerzone (Cel/Wartość, Zakres, Priorytet, Horyzont, Zależności, Ryzyka, Mierniki sukcesu, Owner).  
      Uzupełniaj ją, aby żadna myśl nie „uciekła”.

- `tasks/` – plany operacyjne.  
  Każde zadanie ma folder `<ID-Z>_<status>/` ([możliwe statusy](#files-statuses)) z:
    - `additional-contexts.md` – rozszerzony opis tła zadania (najczęściej opis zrobiony przez analityka biznesowego: oczekiwania klienta, opis funkcjonalności prozą; można tu wkleić opis np. z Jiry). **Kanoniczny szablon tego pliku, podział ról BA / agenta, zasady trybu „aktywnego dopytywania”  oraz rekomendacja, żeby `ID-T = 01` służył doprecyzowaniu `additional-contexts.md` i przygotowaniu planu, są opisane w** `agents-tasks-knowledge/tasks/GEMINI.md`, sekcja „3. Wypełnianie \`additional-contexts.md\` (opis biznesowy, forma BA)”.
    - `tasks.md` – plan wykonawczy rozbijający cel na kroki i pod‑kroki. Zawiera kolumny:
        1. `ID-T` – numer zadania lub pod‑zadania (krok w planie),
        2. `Status` – aktualny status zadania, z możliwymi wartościami [możliwe statusy](#files-statuses),
        3. `Agent` – identyfikator agenta / osoby odpowiedzialnej za wiersz (np. `api-1`, `gui-1`, `ba`, `human-pm`). W trybie multi‑agent jeden wiersz ma jednego głównego właściciela, a równoległość powstaje przez kilka wierszy `in-progress` z różnymi wartościami `Agent`.
        4. `Rodzic` – `ID-T` zadania nadrzędnego (jeśli dotyczy),
        5. `Zadanie` – krótki opis zadania,
        6. `Opis` – szerszy opis zadania,
        7. `Utworzono` – data utworzenia zadania wraz z godziną w formacie `YYYY-MM-DD HH:MM` (np. `2025-01-02 10:15`),
        8. `Zaktualizowano` – data ostatniej aktualizacji zadania wraz z godziną w tym samym formacie,
        9. `Co zrobiono do tej pory` – notatki z postępu prac (co było zrobione, jakie testy uruchomiono, gdzie są szczegółowe wnioski).

      - `additional-notes/` – dodatkowe pliki `<ID-T>.md` (np. `01-01.md`), które przechowują szczegółowe notatki, jeżeli:
          - zadanie jest bardziej złożone,
          - informacji jest za dużo dla kolumny `Opis` / `Co zrobiono do tej pory`,
          - chcesz dołączyć np. zrzuty ekranów lub inne binarki.

Bootstrap task generowany przy inicjalizacji workspace zawiera automatycznie wygenerowane subtaski audytu instrukcji (`AGENTS/CLAUDE/GEMINI.md`) dla oczekiwanych ścieżek.

Katalogi:

- `template-task_proposal/` – czysty szablon do kopiowania na nowe zadanie (`tasks/<ID-Z>_proposal/`),
- `example1-task_done/` – przykładowe, ukończone zadanie,
- `example2-task_in-progress/` – przykładowe zadanie w trakcie realizacji.

Katalog `template-task_proposal/` kopiujemy przy zakładaniu nowych zadań. Katalogów `example1-task_done/` i `example2-task_in-progress/` nie używamy jako aktywnych – służą jako referencje historyczne (można je podejrzeć lub skopiować, gdy potrzebny jest przykład wypełnienia, ale domyślnie korzystaj z `template-task_proposal/`).

## `taskctl` – preferowane operacje na taskach/SESSION

`taskctl` wykonuje atomowe operacje na `agents-tasks-knowledge/tasks/` i `SESSION*.md` i po każdej operacji uruchamia walidację `doctor.py`.

**Canonical path w workspace (zalecane wrappery):**
- `./taskctl --help`
- `./taskctl new --title "…"`
- `./taskctl set-session --task <ID-Z>_<status> --id-t <ID-T>`
- `./taskctl set-id-t-status --task <ID-Z>_<status> --id-t <ID-T> --to <status>`
- `./taskctl move-status --task <ID-Z>_<status> --to <status>`
- `./taskctl assign --task <ID-Z>_<status> --id-t <ID-T> --agent <AGENT_ID>`
- `./taskctl handoff add --task <ID-Z>_<status> --id-t <ID-T> --to "02, 03-01"`
- `./taskctl archive --task <ID-Z>_done`
- `./doctor --json`
Uwaga: `move-status` domyślnie **nie** zmienia wiersza ID‑T=01 w `tasks.md`. Dla zachowania legacy użyj `--touch-id-t-01`.

Jeśli wrapperów brak, użyj ścieżki bezpośredniej:
- `python3 agents-tasks-knowledge/.tooling/taskctl.py --root . ...`
- `python3 agents-tasks-knowledge/.tooling/doctor.py . --json`

### Kiedy `taskctl` jest uruchamiane?
- **Jawnie** przez człowieka lub agenta (deterministyczna operacja na taskach/SESSION),
- **Jawnie** w testach/harness (jako krok scenariusza),
- **Nie** „po cichu” przez `init-workspace.sh`, `sync-workspace.sh`, `init_wizard.py`, `render.py` ani `agent-run` (auto‑run to osobny follow‑up i wymaga policy/approval).

### Archiwizacja ukończonych zadań

Katalogi zadań `<ID-Z>_done/` starsze niż ~30 dni możesz przenieść do archiwum:

```text
agents-tasks-knowledge/tasks/
  _archive/
    250101-feature-reporting_done/
    250115-bug-fix_done/
  250201-current-task_in-progress/
```
 
Zasady:

* Agent **nie przenosi** katalogów sam – robi to właściciel albo skrypt CI.
* Agent **nie skanuje** `tasks/_archive/` przy wyborze zadania.
* Jeśli trzeba wznowić zarchiwizowane zadanie, właściciel przenosi katalog z powrotem
  z `_archive/` do `tasks/`.

---

## Plik `SESSION.md` – wskaźnik bieżącej sesji

Lokalizacja: `agents-tasks-knowledge/SESSION.md`.

Format:

```markdown
current-task: <ID-Z>_<status>
current-id-t: <ID-T>
last-updated: YYYY-MM-DD HH:MM
```

Ten plik jest lekki i techniczny – może być aktualizowany zarówno przez agenta, jak i przez właściciela zadania.
Traktuj go jako wskaźnik pomagający agentom wznawiać pracę między sesjami, a nie jako jedyne źródło prawdy
o stanie zadania (tym pozostają tasks.md i sufiksy katalogów).
Nie dopisuj tu innych linii ani komentarzy – format z trzema liniami musi pozostać stały.

> **Uwaga: single‑agent vs multi‑agent**
> - W prostym trybie single‑agent używamy wyłącznie `SESSION.md` jako wskaźnika sesji.
> - W trybie multi‑agent każdy profil (`AGENT_ID`, patrz `AGENT_PROFILES.md`) ma swój plik
    `SESSION_<AGENT_ID>.md` i to **on** jest głównym wskaźnikiem sesji dla danego agenta.
> - `SESSION.md` możesz traktować jako ogólny „bookmark” dla najważniejszego zadania (np. dla roli `ba`
  lub głównego właściciela), ale nie nadpisuj go z poziomu agentów technicznych, jeżeli korzystasz już
  z plików `SESSION_<AGENT_ID>.md`.


**Walidacja formatu:**

- `current-task` musi być **dokładną nazwą katalogu** z `tasks/`
  (np. `250101-feature-reporting_in-progress`), a nie samym `ID-Z` ani opisem.
- `current-id-t` musi być wartością z kolumny `ID-T` w `tasks.md` (np. `01`, `02-01`),
  a nie tytułem zadania.
- `last-updated` ma format `YYYY-MM-DD HH:MM` (np. `2025-12-03 14:30`).

Jeżeli którykolwiek z tych warunków nie jest spełniony albo wskazywany katalog/wiersz
nie istnieje, agent traktuje `SESSION.md` jak nieustawiony i używa zwykłego algorytmu
wyboru zadania z sekcji „Pierwsze wejście w sesji”.

Znaczenie pól:

- `current-task` – nazwa katalogu zadania w `tasks/` (dokładnie taka jak w systemie plików, np. `230101-feature-employee-reports_in-progress`).

- `current-id-t` – `ID-T` wiersza w `tasks.md`, nad którym agent aktualnie pracuje (np. `02-01`).

- `last-updated` – data i godzina ostatniej aktualizacji pliku, w tym samym formacie, co w `tasks.md` (`YYYY-MM-DD HH:MM`).

Wartości specjalne:

- jeśli `current-task` albo `current-id-t` ma wartość `none`, traktuj to tak, jakby wskaźnik nie był ustawiony.

Zasady:

1. Przy rozpoczęciu pracy nad konkretnym `ID-T` agent powinien zaktualizować `SESSION.md`:

- `current-task` = aktualny katalog `<ID-Z>_<status>` z `tasks/`,

- `current-id-t` = `ID-T`, nad którym będzie pracował w tej sesji,

- `last-updated` = bieżąca data i godzina.

2. Analogicznie ustaw `SESSION.md`, gdy tworzysz nowy katalog zadania, zmieniasz sufiks katalogu (np. na `_in-progress`) albo ustawiasz główny wiersz (`ID-T = 01`) w `tasks.md` na `in-progress` – `current-task` = ten katalog, `current-id-t` domyślnie `01`.

3. Jeżeli katalog lub `ID-T` wskazany w `SESSION.md`:

- nie istnieje,

- albo ma status `done` / `on-hold`,
  agent ignoruje `SESSION.md` w tej sesji i używa zwykłego algorytmu z sekcji „Pierwsze wejście w sesji”.

> **Ważne:** Nigdy nie zakładaj, że `SESSION.md` opisuje aktualny stan zadania.
> To tylko „bookmark” ostatniej pracy agenta. Jeżeli `SESSION` jest niespójny
> z `tasks.md` (brak katalogu, brak wiersza, status `done`/`on-hold`), agent
> **musi** polegać wyłącznie na `tasks.md` oraz aktualnej decyzji użytkownika.


## Multi‑agent: `AGENT_ID` i pliki `SESSION_<AGENT_ID>.md`

System obsługuje wielu równoległych agentów technicznych (np. osobny agent dla backendu, osobny dla GUI).  
Każdy taki agent ma stabilny identyfikator `AGENT_ID`, np.:

- `api-1`, `api-2` – backend,
- `gui-1` – frontend,
- ewentualnie inne (`ba`, `human-pm`) dla ludzi.

Zasady:

1. **Format pliku**

   Dla każdego agenta możesz utworzyć osobny wskaźnik sesji:

    - `agents-tasks-knowledge/SESSION_<AGENT_ID>.md`

   Format jest **identyczny** jak dla `SESSION.md`:

   ```markdown
   current-task: <ID-Z>_<status>
   current-id-t: <ID-T>
   last-updated: YYYY-MM-DD HH:MM
    ```

   Jeśli workspace był generowany narzędziem `framework/render.py`, pliki `SESSION_<AGENT_ID>.md` mogą być
   już utworzone jako stuby (wtedy tylko je aktualizuj, nie twórz od zera).

2. **Zastosowanie w praktyce**

    - Gdy na początku sesji wybierzesz profil (sekcja „Wybór profilu agenta (`AGENT_ID`) na początku sesji”),
      używaj tego `AGENT_ID` do:
        * odczytu ostatniego kontekstu z `SESSION_<AGENT_ID>.md` (jeśli plik istnieje),
        * zapisu nowych wartości `current-task` / `current-id-t` po wejściu w tryb wykonawczy.
    - W trybie multi‑agent **nie** nadpisuj globalnego `SESSION.md` z poziomu agenta technicznego –
      aktualizuj tylko `SESSION_<AGENT_ID>.md` przypisany do bieżącego profilu.

## Struktura plików `additional-notes/<ID-T>.md`

Żeby wiedza dobrze przepływała **między wierszami w `tasks.md`**, każdy plik `additional-notes/<ID-T>.md` powinien mieć spójną strukturę:

```markdown
# <ID-T> – Krótki tytuł

## Surowe notatki / logi (lokalne)
...debug, SQL-e, przebieg myślenia lokalnego...

## Wnioski dla kolejnych kroków
[HANDOFF: <lista ID-T, np. 02, 03-01>]
- Dla ID-T `02`: ...
- Dla ID-T `03-01`: ...
- Ogólne wnioski: ...

## Powiązane zadania
- Kolejne: 02, 03-01
- Ewentualne: 02-02 (gdy powstanie)

## Linki / referencje
- ...
```

Wyjaśnienie:

* Sekcja **„Surowe notatki / logi (lokalne)”** – wszystko, co dotyczy tylko tego zadania.
* Sekcja **„Wnioski dla kolejnych kroków”** – esencja, która ma być użyta przez **kolejne wiersze** w `tasks.md` (ta część jest kluczowa przy starcie przyszłych zadań).
* Marker `[HANDOFF: ...]` w tej sekcji określa, dla których `ID-T` te wnioski są szczególnie ważne.
* Sekcja **„Powiązane zadania”** – pomocnicza lista ID‑T; służy ludziom i agentom do szybkiego zorientowania się, kto ma z tego korzystać.
* Ogólna zasada: w `tasks.md` trzymaj tylko zwięzłe streszczenia (kilka punktów) i odwołania do `additional-notes/<ID-T>.md`. Dłuższe analizy, logi, SQL-e i „ciągi myślowe” trzymaj w sekcji „Surowe notatki / logi (lokalne)”, żeby oszczędzać kontekst i ułatwiać pracę kolejnym agentom.
* W odpowiedziach dla właściciela zadania streszczaj głównie sekcję „Wnioski dla kolejnych kroków” i podawaj ścieżkę do pliku. Nie wklejaj całych  sekcji „Surowe notatki / logi (lokalne)” do czatu – to oszczędza kontekst i ułatwia pracę kolejnym agentom (`project_doc_max_bytes` i kontekst modelu).
---

## Przepływ informacji między wierszami w `tasks.md` (HANDOFF)

### 1. Jak oznaczać w `tasks.md`, że wnioski są dla kolejnych wierszy

W kolumnie `Co zrobiono do tej pory` możesz (i powinieneś) używać markerów:

```markdown
`[HANDOFF: 02, 03-01]`
...
```

Przykład wiersza 01 (analiza):

```markdown
2025-01-05 12:00 – zakończono analizę wymagań raportów (szczegóły: `additional-notes/01.md`).

`[HANDOFF: 02, 03-01]`
- Implementacja backendu (02) i GUI (03-01) musi uwzględniać:
  - klasy: ReportGenerator, ReportQuery, VatCalculator,
  - nową konwencję statusów raportu (draft/ready/archived),
  - szczegóły: additional-notes/01.md, sekcja „Wnioski dla kolejnych kroków”.
```

Ten sam marker `[HANDOFF: 02, 03-01]` powinien się pojawić w `additional-notes/01.md` w sekcji „Wnioski dla kolejnych kroków”.

**Formalna składnia markera HANDOFF**

Marker ma postać:

`[HANDOFF: <ID-T>, <ID-T>, ...]`

Zasady:
- nawiasy kwadratowe `[` i `]` – obowiązkowe,
- słowo `HANDOFF` – wielkimi literami,
- dwukropek `:` bezpośrednio po `HANDOFF`,
- lista identyfikatorów `ID-T` oddzielona przecinkami i spacjami,
  np. `[HANDOFF: 02]`, `[HANDOFF: 02, 03-01]`.
- brak dodatkowych znaków (cudzysłowów, nawiasów w środku itp.).

Jeśli agent widzi inną formę (np. `HANDOFF: 02` bez nawiasów albo `[Handoff 02]`),
powinien ją poprawić do powyższego formatu przy najbliższej edycji.


### 2. Co robi agent, gdy KOŃCZY wiersz (np. 01 – analiza)

Jeśli wiesz, że z danego wiersza `ID-T = A` wynikają rzeczy potrzebne w kolejnych zadaniach (`ID-T = B`, `C` itd.):

1. Uporządkuj szczegóły w `additional-notes/A.md`:

    * w sekcji „Wnioski dla kolejnych kroków” opisz:

        * *dla których ID-T* są te wnioski (`[HANDOFF: B, C]`),
        * jakie są konkretne wnioski dla tych ID-T.
2. W `tasks.md` w wierszu A (kolumna `Co zrobiono do tej pory`) dopisz blok z `[HANDOFF: ...]`, który:

    * wskazuje na `additional-notes/A.md`,
    * streszcza najważniejsze wnioski.

Ten krok jest **obowiązkowy** zawsze, gdy z wiersza `ID-T = A` wynikają kolejne zadania (`ID-T = B`, `C` itd.). Dzięki temu każdy kolejny agent ma jasny HANDOFF i nie musi odgadywać, z których analiz powinien skorzystać.

Dzięki temu kolejny agent nie musi zgadywać „czy coś w 01 przyda się 02” – ma to **jawnie oznaczone**.

### 3. Co robi agent, gdy ZACZYNA nowy wiersz `ID-T = X`

Zanim zaczniesz pracę nad wierszem `ID-T = X` w `tasks.md`:

1. **Przeczytaj sam wiersz X**:

    * `Zadanie`,
    * `Opis`,
    * `Co zrobiono do tej pory`.
2. **Znajdź wiersze‑kontekst**:

    * wiersz o `ID-T` równym `Rodzic` (jeśli `Rodzic` nie jest pusty),
    * wiersz bezpośrednio poprzedzający X w tabeli (po sortowaniu po `ID-T`),
      zwłaszcza gdy:

        * dzieli z X prefiks (`01` z `01-01`, `02-01` z `02-02`),
        * lub X to kolejny krok po analizie (01 → 02 → 03).
    * wszystkie wcześniejsze wiersze, których kolumna `Co zrobiono do tej pory` zawiera marker `[HANDOFF: ...]` z Twoim `ID-T` (np. `[HANDOFF: 02, 03-01]` przy starcie 02).
3. **Dla każdego wiersza‑kontekstu (np. 01)**:

    * przeczytaj jego `Co zrobiono do tej pory` (szczególnie blok z `[HANDOFF: ...]`),
    * jeśli istnieje `additional-notes/<ID-T-kontekstu>.md`:

        * otwórz ten plik,
        * przeczytaj sekcję „Wnioski dla kolejnych kroków” i fragment z `[HANDOFF: X]` (jeśli istnieje).

Po zebraniu kontekstu z wcześniejszych wierszy i `additional-notes/<ID-T>.md`
**zawsze zapisz** w `Co zrobiono do tej pory` bieżącego wiersza:

* które `ID-T` były użyte jako kontekst,
* jakie pliki `additional-notes/...` przeczytałeś,
* z jakich sekcji („Wnioski dla kolejnych kroków”) pochodziły.

4. **Udokumentuj to na starcie pracy nad X** w `Co zrobiono do tej pory` bieżącego wiersza, np.:

   ```markdown
   2025-01-06 09:10 – start prac nad 02.
   Wykorzystano kontekst:
   - HANDOFF z 01 – additional-notes/01.md, sekcja „Wnioski dla kolejnych kroków / [HANDOFF: 02, 03-01]”.
   ```

Dzięki temu:

* kolejny agent widzi, z czego korzystałeś,
* Ty masz jednoznaczny algorytm, **gdzie szukać** wiedzy z poprzednich wierszy.

Traktuj ten przegląd HANDOFF-ów i `additional-notes/<ID-T>.md` jako obowiązkowy krok startowy dla każdego nowego `ID-T`; praca „na ślepo”, bez tego, jest błędem procesu.

---

## Ogólne wytyczne dla agentów – kroki obowiązkowe

### Wybór profilu agenta (`AGENT_ID`) na początku sesji

Zanim zastosujesz poniższe zasady „Pierwsze wejście w sesji” / „Kolejne wejścia w sesji”, ustal, **kim jesteś w tej sesji**.

1. Sprawdź, czy w kontekście rozmowy (system prompt / pierwsza wiadomość użytkownika) jest nagłówek w stylu:

   ```text
   [AGENT_ID: api-1]
   ```

Jeśli tak – przyjmij tę wartość `AGENT_ID` i przejdź do sekcji „Pierwsze wejście w sesji”.

2. W przeciwnym razie:
    1. Odczytaj `agents-tasks-knowledge/AGENT_PROFILES.md` i wypisz dostępne profile
       (Nr, `AGENT_ID`, opis).
    2. Spróbuj odczytać `agents-tasks-knowledge/SESSION_<AGENT_ID>.md` dla każdego profilu:
        - jeżeli plik istnieje, zanotuj `current-task` i `current-id-t` jako sugestię „ostatnio używanego kontekstu”.
    3. Zbuduj krótkie menu dla użytkownika, bez skanowania `tasks/`, np.:

       > „Dostępne profile:
       > 1. `ba` – Analityk / właściciel planu (ostatnio: 250101-feature-reporting_planned, ID-T 01).
       > 2. `api-1` – Backend (ostatnio: 250101-feature-reporting_in-progress, ID-T 02).
       > 3. `gui-1` – Frontend (ostatnio: brak aktywnej sesji).
       >
       > Podaj numer profilu (1–3) albo wpisz `AGENT_ID` ręcznie.”

    4. Ustalona wartość `AGENT_ID` obowiązuje przez całą sesję – używaj jej przy odczycie/zapisie
       `SESSION_<AGENT_ID>.md` oraz przy wyborze wierszy w `tasks.md`.

3. W kolejnych odpowiedziach nie pytaj ponownie o `AGENT_ID`, chyba że użytkownik wprost poprosi
   o zmianę roli („przełącz się na frontend” itp.).

### Pierwsze wejście w sesji
> Uwaga:
> - jeżeli korzystasz z wielu agentów (`AGENT_ID`), **zawsze** przejdź najpierw przez sekcję
    >   „Wybór profilu agenta (`AGENT_ID`) na początku sesji” i pracuj z plikiem `SESSION_<AGENT_ID>.md`.
> - w prostym trybie single‑agent możesz pominąć wybór profilu i używać tylko globalnego `SESSION.md`.

0. Jeżeli w pierwszej wiadomości w tej rozmowie użytkownik **prosi o założenie nowego zadania w `tasks/`**
   (np. „załóżmy nowe zadanie dla …”, „pomóż mi założyć nowe zadanie w `tasks/`”, „chcę nowy katalog zadania”):
    - **ignoruj w tej sesji** `SESSION.md` oraz algorytm wyboru istniejącego zadania,
    - potraktuj tę prośbę jako wejście w „happy path” z `agents-tasks-knowledge/tasks/GEMINI.md`, sekcja „9. Flow właściciel ↔ agent”,
    - poprowadź właściciela **krok po kroku w rozmowie** (kopiowanie katalogu, nazwa `<ID-Z>_proposal`, wypełnienie `additional-contexts.md`, ustawienie `tasks.md` i `SESSION.md`),
    - sam plik `agents-tasks-knowledge/tasks/GEMINI.md` traktuj jako referencję w tle, a nie coś, co użytkownik musi czytać, żeby ruszyć dalej.


1. Jeśli w tej rozmowie użytkownik **wprost zaznaczył**, że chodzi tylko o jednorazową analizę /
   wyjaśnienie bez zmian w repo (patrz TL;DR i główny `GEMINI.md`):

    - **nie** korzystaj z `SESSION.md`,
    - **nie** skanuj `tasks/`,
    - od razu przejdź do odpowiedzi ad‑hoc na pytanie użytkownika.

2. W przeciwnym razie, jeśli istnieje `agents-tasks-knowledge/SESSION.md`:

- Odczytaj wartości `current-task` i `current-id-t`.
- Jeśli `current-task` = `none` albo `current-id-t` = `none` – traktuj to tak, jakby wskaźnik nie był ustawiony
  i przejdź do kroku 1.
- Sprawdź, czy istnieje katalog `tasks/<current-task>/` i jego nazwa kończy się statusem innym niż `done` / `on-hold`.
- W tym katalogu sprawdź, czy w `tasks.md` istnieje wiersz z `ID-T = current-id-t` ze statusem innym niż `done` / `on-hold`.
- Jeśli wszystko jest spójne:
    - przyjmij ten katalog i to `ID-T` jako **domyślny punkt startu**,
    - przejdź od razu do kroku 4 (sprawdzenie kontekstu / HANDOFF).
- Jeśli cokolwiek się nie zgadza (brak katalogu, brak wiersza, statusy `done` / `on-hold`):
    - zignoruj `SESSION.md` w tej sesji,
    - przejdź do kroku 3.
3. Jeżeli użytkownik nie wskazał jawnie katalogu zadania:
    1. Spróbuj odczytać `SESSION_<AGENT_ID>.md` (lub `SESSION.md` w trybie single-agent).
        - jeśli `current-task` i `current-id-t` wskazują istniejący katalog i wiersz ze statusem
          innym niż `done` / `on-hold`, zaproponuj użytkownikowi powrót do tego miejsca:

          > „Ostatnio pracowaliśmy nad `<current-task>`, ID-T = `<current-id-t>`. Czy kontynuujemy? (tak/nie)”

        - jeśli użytkownik odpowie „tak” – kontynuuj tam,
        - jeśli „nie” – przejdź do punktu 2.

    2. Zamiast samodzielnie wybierać katalog po sufiksach (`_in-progress`, `_planned` itd.),
       wypisz listę kilku ostatnio używanych katalogów z `tasks/` (np. na podstawie daty modyfikacji katalogu lub `tasks.md`) i zapytaj:

       > „Widzę katalogi z aktywnymi zadaniami:
       > - 250101-feature-reporting_in-progress
       > - 241215-bug-timesheets_planned
       > - ...
       >
       > Napisz, nad którym chcesz pracować, albo podaj nazwę innego katalogu.”

    3. Dopiero po tym wyborze przystąp do czytania `additional-contexts.md` i `tasks.md`.
4. W wybranym katalogu przeczytaj `additional-contexts.md`, aby zrozumieć kontekst zadania.
5. Przejrzyj `tasks.md` i wybierz pierwszy z góry element, który nie jest `done` ani `on-hold`.

    * Tabela `tasks.md` powinna być posortowana rosnąco po `ID-T` (główne zadania 01, 02, 03…; pod‑zadania 01‑01, 01‑02…). Przy porównywaniu dat za „poprzedzające zadanie” uznajemy poprzedni wiersz w tej kolejności.
    * Zwracaj uwagę, czy daty w kolumnie `Zaktualizowano` są logiczne – jeśli któryś wiersz ma wyraźnie **starszą** datę niż poprzedni, potraktuj to jako sygnał, że plan może wymagać uporządkowania lub ponownej analizy (zapytaj o to właściciela zadania).
    * Jeżeli tabela jest pusta lub nie istnieje, lub wszystkie statusy są `done` / `on-hold`:

        * zgłoś to właścicielowi zadania,
        * wejdź w [tryb planowania](#tryb-planowania).
6. Przed wejściem w tryb wykonawczy dla konkretnego `ID-T` pamiętaj o [zasadach HANDOFF](#przepływ-informacji-między-wierszami-w-tasksmd-handoff) – sprawdź wiersze‑kontekst i odpowiednie `additional-notes/<ID-T>.md`.
7. Przejdź do [trybu wykonawczego](#tryb-wykonawczy), jeżeli właściciel Cię o to poprosi.
   Jeśli nie – opisz, na czym stoimy, co zostało wykonane i co logicznie należy zrobić w następnej kolejności.

### Kolejne wejścia w sesji

W kolejnych sesjach domyślnie wracasz do tego samego katalogu `<ID-Z>_<status>/`, który był używany poprzednio, chyba że właściciel wskaże inny katalog zadania.

- Jeżeli pracujesz w środowisku bez historii czatu (np. nowa, „czysta” sesja Agenta), traktuj plik `SESSION.md` jako źródło informacji o tym, który katalog zadania (`current-task`) i które `ID-T` (`current-id-t`) były ostatnio aktywne.
- Jeśli `SESSION.md` nie istnieje albo jest niespójny (brak katalogu / brak wiersza / statusy `done` / `on-hold`), wróć do algorytmu z sekcji „Pierwsze wejście w sesji” i wybierz zadanie po statusach.
1. W tym katalogu przejrzyj `tasks.md` i wybierz pierwszy z góry element, który nie jest `done` ani `on-hold`.
2. Zanim wejdziesz w wybrany wiersz, użyj zasad HANDOFF (sekcja powyżej), żeby odświeżyć kontekst z wcześniejszych wierszy i `additional-notes/`.
3. Jeżeli nie ma takich elementów:

    * zgłoś to właścicielowi zadania,
    * wejdź w [tryb planowania](#tryb-planowania).
4. Przejdź do [trybu wykonawczego](#tryb-wykonawczy), jeżeli właściciel Cię o to poprosi.
   Jeśli nie – zaproponuj logiczne dalsze kroki (np. które zadanie zacząć lub doprecyzować).

---

## Tryb planowania

1. Weź najbliższe zadanie (lub wskazane przez właściciela) ze statusem `to-do`, `planning` lub `proposal`.
2. Przyjrzyj się dokładnie:

    * `additional-contexts.md`,
    * kolumnom w `tasks.md`:

        * `Zadanie`,
        * `Opis`,
        * `Co zrobiono do tej pory`,
    * plikom w `additional-notes/` (jeśli istnieją) dla danego zadania.
3. Stwórz plan działania małymi krokami i **interaktywnie** ustalaj szczegóły z właścicielem zadania:

    * jeżeli plan tworzysz od zera, a w `tasks.md` nie ma jeszcze wiersza `ID-T = 01` opisującego
      „Doprecyzowanie i uzupełnienie additional-contexts.md + przygotowanie planu technicznego”,
      zaproponuj właścicielowi dodanie takiego wiersza jako **pierwszego kroku**,
   
    > Jeżeli właściciel zadania poprosi o tryb „aktywnego dopytywania”,
    > (np. wpisze to w sekcji 6 `additional-contexts.md` albo wprost w rozmowie),
    > najpierw zbuduj listę pytań do sekcji 6 zgodnie z zasadami z
    > `agents-tasks-knowledge/tasks/GEMINI.md`, sekcja „3.3. Tryb „aktywnego dopytywania” przez Agenta”,
    > a dopiero po odpowiedziach proponuj szczegółowy plan w `tasks.md`.

    * podziel zadanie na logiczne kroki, które prowadzą do realizacji celu – plan powinien być spójny i wynikać z poprzednich kroków i analiz,
    * każdy krok powinien być możliwy do wykonania w ciągu jednej sesji agenta,
    * każdy krok powinien mieć jasno określony cel i kryteria zakończenia,
    * każdy krok powinien być logicznie powiązany z poprzednim i następnym,
    * każdy krok powinien być opisany w sposób zrozumiały dla przyszłych agentów,
    * każdy krok powinien uwzględniać potencjalne ryzyka i sposoby ich łagodzenia,
    * każdy krok powinien być realistyczny (czas, zasoby, ograniczenia),
    * każdy krok powinien być mierzalny, aby można było ocenić postęp i sukces.

### Jak dopytywać, żeby nie zgadywać (2 fazy + typy niewiadomych)

W trybie planowania „rozmowa” ma doprowadzić do **decision-complete** specyfikacji i planu, zanim przejdziesz do implementacji.

- **Faza 1 - Intent (co naprawdę robimy):**
  dopóki nie umiesz jasno powiedzieć: **cel + kryteria sukcesu**, odbiorcy/użytkownicy, zakres in/out, ograniczenia, stan obecny oraz kluczowe preferencje/trade-offy.
  W każdej rundzie dodaj krótkie: „**Potwierdź proszę, czy dobrze rozumiem:** …?”.

- **Faza 2 - Implementation (jak to zrobimy):**
  dopóki spec jest „domknięty decyzyjnie”: podejście, interfejsy (API/schemy/I/O), przepływ danych, edge case’y i failure modes, testy + kryteria akceptacji, rollout/monitoring, migracje/kompatybilność.

- **Pytaj dużo, ale bez triviów:**
  każde pytanie ma albo (a) realnie zmienić plan/spec, albo (b) zablokować ryzykowne założenie, albo (c) wybrać między sensownymi trade-offami.
  Dla tempa zadawaj pytania w paczkach (np. 4–10).

- **Dwa typy niewiadomych (traktuj inaczej):**
  1) **Fakty do odkrycia w repo/systemie** → najpierw sprawdź repo (min. 2 wyszukania: dokładne + wariant) i typowe źródła prawdy (configi, schematy, typy, stałe, entrypointy). Pytaj dopiero, gdy nadal jest niejednoznacznie; jeśli pytasz - podaj kandydatów i rekomendację.
  2) **Preferencje/trade-offy (nie do odkrycia)** → pytaj wcześnie; dawaj 2–4 opcje + rekomendację. Jeśli brak odpowiedzi, idź rekomendacją i zapisz to jawnie jako **założenie**.

- **Reguła finalizacji:**
  finalizuj plan w `tasks.md` dopiero, gdy pozostałe niewiadome mają niski wpływ i są jawnie wpisane jako **założenia** / **otwarte pytania** (np. w `additional-contexts.md`).


### Checklista trybu planowania (wirtualna; zawsze przed wyjściem z planu)

- [ ] Cel + kryteria sukcesu + zakres in/out są jednoznaczne i wpisane w `additional-contexts.md`.
- [ ] Scenariusze GWT + kryteria akceptacji są kompletne i mierzalne.
- [ ] Otwarte pytania mają ownerów/terminy lub są jawnie wpisane jako założenia.
- [ ] Plan w `tasks.md` ma kompletne ID‑T z opisem, statusem i przypisanym Agentem.
- [ ] Zależności między krokami opisane; wymagane HANDOFF zaplanowane po analizach.
- [ ] Ryzyka + testy/DoD (oraz rollout/monitoring jeśli dotyczy) są opisane.
- [ ] Każdy krok mieści się w jednej sesji agenta.
- [ ] Dla tasków wieloserwisowych (np. `api` + `gui`) plan zawiera osobny krok kontraktu międzyserwisowego i gate: implementacja tych serwisów startuje dopiero po `done` dla tego kroku.
- [ ] Audyty planu zakończone bez zastrzeżeń: 2 niezależne subagenty + Claude + Gemini uruchomione **równolegle** (wspólny TS); synteza i decyzje dopiero po komplecie 4 raportów (fallback wymaga decyzji właściciela); P1/P0 blokują, P2 po 3 rundach nie blokują; raporty w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-*.md`.
- [ ] Jeśli task dotyka UI/przeglądarki (`- [x] UI/UX`), `additional-contexts.md` zawiera skrót danych kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) oraz referencję do `/.env.test-accounts`.
- [ ] `SESSION*.md` wskazuje aktualny ID‑T, a `Zaktualizowano` w `tasks.md` jest aktualne.

Dodatkowo:
- **Gate kontraktu międzyserwisowego (obowiązkowy):** jeśli task obejmuje co najmniej dwa serwisy (np. `api` + `gui`), zanim ruszą ID-T implementacyjne tych serwisów musi istnieć `done` dla kroku kontraktowego (minimum: operacje/endpointy, payloady, błędy, kompatybilność).
- **Pre-flight gate check:** skrótowe komendy właściciela (np. `1`/`2`) nie omijają gate. Jeśli warunek gate nie jest spełniony, agent zatrzymuje implementację i wraca do planowania albo uzyskuje jawny waiver właściciela.
- **Gate UI/browser + konta testowe:** `agent-browser` jest obowiązkowy tylko dla tasków UI/przeglądarkowych; dla takich tasków wymagaj skrótu kont testowych w `additional-contexts.md` oraz referencji do globalnego `/.env.test-accounts`.
- **Równoległość (obowiązkowa):** uruchamiaj 2 subagentów + Claude + Gemini **równolegle** w każdej rundzie audytu planu.
- **Barrier:** synteza i decyzje (PASS/FAIL, przejście dalej) dopiero po komplecie 4 raportów; fallback nie znosi bariery bez decyzji właściciela.
- **Subagent review (obowiązkowe):** po ułożeniu większego planu poproś **dwóch niezależnych subagentów** o szczegółową recenzję. Muszą sprawdzić: kompletność planu vs DoR, obecność HANDOFF i zależności, poprawność statusów/Agentów oraz spójność AC/testów/ryzyk. Zapisz raporty w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-subagent-*.md`.
- **Claude review (obowiązkowe):** uruchom audyt planu przez Claude i zapisz raport w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-claude.md`.
- **Gemini review (obowiązkowe):** uruchom audyt planu przez Gemini (`gemini "<prompt>"`) i zapisz raport w `additional-notes/<YYYYMMDD-HHMM>-plan-audit-gemini.md` (np. copy/paste).
- **Monitoring:** brak twardego timeoutu; monitoruj co 1 minutę, a po 30 min bezczynności zatrzymaj proces i zastosuj fallback (raport braku + `*-audit-blockers.md` + decyzja właściciela), bez auto-PASS.
- **Pętla „bez zastrzeżeń”:** jeśli raport zawiera P1/P0 lub P2 przed 3 rundami, popraw plan i **powtarzaj** audyty; po 3 rundach P2 nie blokują.
- **Fallback (gdy pętla się nie domyka):** po 3 iteracjach **lub** 2h (jeśli nadal P1/P0 albo brak decyzji) utwórz `additional-notes/<YYYYMMDD-HHMM>-audit-blockers.md`, oznacz `[BLOCKER]` w `tasks.md` i poproś właściciela o decyzję.
- **Context7:** jeśli plan opiera się o zewnętrzne biblioteki/API, zweryfikuj aktualną dokumentację w Context7.

W trybie planowania nie modyfikuj kodu (poza ewentualnymi drobnymi poprawkami dokumentacji); Twoim głównym wyjściem jest plan w `tasks.md` i ewentualne pliki w `additional-notes/`.

4. Uzupełnij `tasks.md` o szczegóły planu:

    * ustaw `Status` na `proposal` lub `planned` po uzgodnieniu z właścicielem,
    * ustaw `Rodzic` (jeśli dotyczy),
    * wpisz `Zadanie` i ewentualnie `Opis`,
    * jeśli `Utworzono` jest puste – ustaw dzisiejszą datę i godzinę (format `YYYY-MM-DD HH:MM`),
    * zawsze aktualizuj `Zaktualizowano` na bieżącą datę i godzinę w tym samym formacie,
    * dodaj nowe wiersze dla każdego kroku planu z unikalnym `ID-T`.
5. W razie potrzeby dodaj / uzupełnij pliki w `additional-notes/` (np. `01-01.md`) – gdy opis jest za obszerny na kolumnę `Opis` w `tasks.md`.
6. Jeśli wiesz już na etapie planowania, że wyniki z jednego kroku będą wejściem do kolejnego (np. 01 = analiza, 02 = implementacja backendu):

    * w `Opis` lub `Co zrobiono do tej pory` (po jego utworzeniu) zaznacz tę zależność,
    * po zakończeniu analiz dopisz konkretny HANDOFF (patrz: sekcja HANDOFF).
7. Zapisz zmiany, zgłoś je właścicielowi zadania i poczekaj na reakcję.
8. Po reakcji właściciela:

    * zmodyfikuj zadania i opisy zgodnie z jego decyzjami,
    * wyraźnie zaznacz w `tasks.md`, co zostało zmienione,
    * ponownie zaktualizuj `Zaktualizowano`.

---

## Tryb wykonawczy

**Warunek wejścia:** plan przeszedł audyty (2 subagenci + Claude + Gemini uruchomione równolegle, synteza po komplecie 4 raportów) bez zastrzeżeń (P1/P0 blokują; P2 po 3 rundach nie blokują), `ID-T=01` ma status `done`, raporty są zapisane w `additional-notes/`, nie ma aktywnego `*-audit-blockers.md` ani `[BLOCKER]`, a dla tasków wieloserwisowych krok kontraktu międzyserwisowego ma status `done`. Jeśli nie — wróć do trybu planowania.

1. Weź najbliższe zadanie (lub wskazane przez właściciela) ze statusem `planned` lub `in-progress`.
2. Przyjrzyj się dokładnie:

    * `additional-contexts.md`,
    * kolumnom w `tasks.md`:

        * `Zadanie`,
        * `Opis`,
        * `Co zrobiono do tej pory`,
        * plikom przyporządkowanym do konkretnych `ID-T` w `additional-notes/`.
3. Gdy wybierzesz konkretny wiersz `ID-T`, nad którym będziesz pracować w tej sesji:

    - zaktualizuj **odpowiedni plik sesji** tak, aby:
        - w trybie multi‑agent: `agents-tasks-knowledge/SESSION_<AGENT_ID>.md`,
        - w prostym trybie single‑agent: `agents-tasks-knowledge/SESSION.md`,
          zawierał:
        - `current-task` = nazwę katalogu `<ID-Z>_<status>` z `tasks/`, w którym aktualnie pracujesz,
        - `current-id-t` = wybrane `ID-T`,
        - `last-updated` = bieżącą datę i godzinę (`YYYY-MM-DD HH:MM`).

4. Zastosuj zasady HANDOFF:

    * znajdź wiersze‑kontekst (Rodzic, poprzedni wiersz, wcześniejsze wiersze z `[HANDOFF: <Twoje ID-T>]`),
    * przeczytaj odpowiednie `additional-notes/<ID-T>.md`, sekcję „Wnioski dla kolejnych kroków”.
5. Jeśli zadanie jest rozpoczynane po raz pierwszy:

    * zaktualizuj `Status` na `in-progress` w `tasks.md`.
6. Jeżeli zadanie jest głównym zadaniem technicznym (kolumna `Rodzic` jest pusta), to przy **pierwszym wejściu w tryb wykonawczy dla tego zadania**:

    * uruchom środowisko zgodnie z instrukcjami projektu (np. `make -C <katalog z Makefile> up`) i zaczekaj na start usług,

Jeśli zadanie ma charakter wyłącznie analityczny (np. doprecyzowanie wymagań, zmiany w dokumentacji), możesz ten krok pominąć i zapisać to w `Co zrobiono do tej pory`.

7. Przeanalizuj wyniki testów (np. `../var/test-reports/latest-summary.log`) i zaproponuj konkretne kroki naprawcze, jeśli coś nie przeszło:

    * jeśli naprawiasz konkretny test, uruchamiaj w pierwszej kolejności **ten** test przy pomocy `make -C <katalog z Makefile> ...`.
8. Jeżeli testy przechodzą pomyślnie – zacznij realizować zadanie zgodnie z planem.
9. Podczas realizacji zadania:

    * dziel zadanie na mniejsze kroki (pod‑zadania w `tasks.md`), jeśli jest zbyt duże lub skomplikowane,
    * regularnie zapisuj postęp w `Co zrobiono do tej pory` i każdorazowo aktualizuj `Zaktualizowano`,
    * uruchamiaj odpowiednie testy przez `make` (szczegóły w lokalnych `GEMINI.md` dla komponentów, jeśli istnieją); jeśli test nie istnieje, zaproponuj jego dopisanie,
    * jeśli napotkasz problemy – analizuj je i proponuj rozwiązania właścicielowi zadania,
    * konsultuj się z właścicielem zadania, gdy potrzebujesz decyzji lub priorytetyzacji.

### Audyt końcowy (final-audit) przed `done`

Final‑audit jest **symetryczny** do plan‑audit i jest obowiązkowy **przed** zamknięciem taska:

- 2 niezależne subagenty + Claude + Gemini uruchamiane równolegle (wspólny TS),
- synteza i decyzja PASS/FAIL dopiero po komplecie 4 raportów (fallback wymaga decyzji właściciela),
- pętla „bez zastrzeżeń” (P1/P0 blokują; P2 po 3 rundach nie blokują; uwagi → poprawki → ponowny audyt),
- fallback po 3 iteracjach lub 2h: `*-audit-blockers.md` + `[BLOCKER]` w `tasks.md` + eskalacja,
- brak twardego timeoutu; monitoring co 1 minutę; po 30 min bezczynności zatrzymanie procesu i fallback (raport braku + `*-audit-blockers.md` + decyzja właściciela),
- jeśli task dotyka UI/przeglądarki: obowiązkowe testy manualne `agent-browser` (start od `agent-browser connect 9222`) z użyciem danych z `/.env.test-accounts`,
- raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`.

Po PASS wpisz nazwy raportów w `tasks.md` i odhacz checklistę „przed done”.

### Obsługa błędów w trybie wykonawczym

1. **Testy nie przechodzą po kilku próbach naprawy:**
    - jeśli po sensownej liczbie iteracji (np. 3) nadal nie udaje się uzyskać zielonych testów,
      ustaw `Status` wiersza na `on-hold`,
    - w `Co zrobiono do tej pory` dopisz `[BLOCKER] Testy nie przechodzą po kilku próbach`
      i przenieś szczegóły do `additional-notes/<ID-T>.md`,
    - jasno poproś właściciela zadania o decyzję co dalej.

2. **Środowisko nie startuje (np. `make up` / `make -C <repo> up` pada):**
    - **nie** kontynuuj pracy na kodzie „w ciemno”,
    - w odpowiedzi dla właściciela wypisz dokładny błąd i zaproponuj kroki debugowania,
    - w `Co zrobiono do tej pory` dopisz `[BLOCKER] Środowisko nie startuje: <krótki opis>`.

3. **Konflikt agentów (ten sam wiersz `in-progress` przez >1 agenta):**
    - jeśli wykryjesz, że inny agent już ma `Status = in-progress` dla danego `ID-T`,
      nie zaczynaj pracy nad tym wierszem,
    - poinformuj właściciela zadania o konflikcie i zaproponuj inny wiersz albo rozdzielenie pracy,
    - dopiero po decyzji właściciela zmieniaj `Status`/`Agent` w tabeli.

4. **Audyty końcowe nie domykają się:**
    - jeśli po 3 iteracjach lub 2h nadal są zastrzeżenia, nie ustawiaj `done`,
    - utwórz `additional-notes/<YYYYMMDD-HHMM>-audit-blockers.md` i opisz blokery,
    - oznacz `[BLOCKER]` w `tasks.md` i poproś właściciela o decyzję.


---

## Files statuses

* `proposal` – wstępna propozycja / szkic zadania lub kroku. Pomysł jest zapisany, ale plan nie jest jeszcze dopracowany ani uzgodniony z właścicielem zadania.
* `to-do` – zadanie zaakceptowane biznesowo („chcemy to robić”), ale nie ma jeszcze rozpisanego szczegółowego planu w `tasks.md`. Wymaga wejścia w **tryb planowania**.
* `planning` – trwa aktywne dopracowywanie planu (tworzenie / poprawianie wpisów w `tasks.md`, dyskusja z właścicielem). Jeszcze **nie** przechodzimy do pełnego trybu wykonawczego.
* `planned` – plan jest uzgodniony i kompletny na tyle, że kolejny agent może wejść w **tryb wykonawczy** i realizować kroki. To domyślny status przed `in-progress`.
* `in-progress` – zadanie / pod‑zadanie jest aktualnie realizowane; agent **musi** na bieżąco aktualizować `Co zrobiono do tej pory` i `Zaktualizowano`.
* `on-hold` – praca wstrzymana (brak decyzji, dane, blokada innego typu). W `Co zrobiono do tej pory` zapisz, *dlaczego* jest blokada i *co musi się wydarzyć, żeby wrócić do pracy*.
* `done` – zadanie zakończone:
    * cel biznesowy osiągnięty,
    * kluczowe testy przechodzą (tam, gdzie ma to sens),
    * wykonano audyty końcowe (2 subagenci + Claude + Gemini) bez zastrzeżeń; raporty w `additional-notes/<YYYYMMDD-HHMM>-final-audit-*.md`,
    * `tasks.md` i ewentualne pliki w `additional-notes/` jasno dokumentują, co zostało zrobione.

**Typowy przepływ statusów („happy‑path”)**

`proposal` → `to-do` → `planning` → `planned` → `in-progress` → `done`

- `on-hold` pojawia się wtedy, gdy praca musi zostać czasowo zatrzymana
  (blokada, brak danych, decyzji itp.).
- Po zdjęciu blokady zwykle wracasz do `planned` lub `in-progress` – w zależności od tego,
  czy plan wymaga korekt, czy można od razu kontynuować wykonanie.

---

## Narzędzia, z których możesz korzystać podczas realizacji (w pierwszej kolejności)

* `Makefile` w repozytoriach komponentów (np. `ut-angular`),
* serwer MCP `playwright` – szczególnie przy pracy z GUI,
* serwer MCP `chrome-devtools` – logi przeglądarki / network dla GUI.

---

## Checklista dla agenta przy pracy z zadaniem

Przed zakończeniem sesji nad zadaniem z `tasks/` sprawdź:

1. Czy pracowałeś na poprawnym katalogu `<ID-Z>_<status>/` (nie na przykładach)?
2. Czy przeczytałeś `additional-contexts.md`, `tasks.md` i (w razie potrzeby) `additional-notes/`?
3. Czy ustaliłeś, w jakim trybie pracujesz (planowanie vs wykonanie) i trzymałeś się zasad tego trybu?
4. Czy zaktualizowałeś:

    * `Status`,
    * `Co zrobiono do tej pory`,
    * `Zaktualizowano`
      dla wszystkich zadań / pod‑zadań, których dotyczyła praca?
5. Czy zastosowałeś zasady HANDOFF:

    * dla kończonych wierszy – dopisałeś `Wnioski dla kolejnych kroków` i (w razie potrzeby) `[HANDOFF: ...]`,
    * dla nowych wierszy – skorzystałeś z wcześniejszych `[HANDOFF: ...]` i odpowiednich `additional-notes/<ID-T>.md`?
6. Czy wyniki testów i kluczowe decyzje są zapisane w sposób pozwalający innemu agentowi łatwo kontynuować pracę?
7. Czy wszystkie zmiany, które proponujesz w repo, są powiązane z konkretnym zadaniem (`ID-Z` / `ID-T`)?
8. Jeśli w tej sesji wchodziłeś w tryb wykonawczy dla konkretnego `ID-T` albo zmieniałeś
   sufiks/status katalogu zadania:
    - czy zaktualizowałeś **odpowiedni plik sesji** tak, aby:
        - w trybie multi‑agent: `agents-tasks-knowledge/SESSION_<AGENT_ID>.md`,
        - w prostym trybie single‑agent: `agents-tasks-knowledge/SESSION.md`,
          wskazywał:
        - `current-task` = katalog zadania `<ID-Z>_<status>`, nad którym faktycznie pracowałeś
          lub który właśnie przestawiłeś,
        - `current-id-t` = ostatnie `ID-T`, które było w tej sesji aktywne (domyślnie `01`
          przy zakładaniu/wznawianiu zadania)?

## Przykład `tasks.md` + `additional-notes/01.md` – PRZED i PO

Ten przykład pokazuje **tylko** różnicę w sposobie użycia HANDOFF i `additional-notes/`.  
Zakładamy już, że zadanie zostało założone zgodnie z zasadą, że `ID-T = 01` służy
doprecyzowaniu `additional-contexts.md` i przygotowaniu planu technicznego
(patrz `agents-tasks-knowledge/tasks/GEMINI.md`, sekcja „4.2. Jak numerować `ID-T`”).

### „PRZED” (obecny stan – brak jasnego flow)

**`tasks.md` (fragment)**

```markdown
| ID-T | Status   | Rodzic | Zadanie                                                   | Opis                                | Utworzono           | Zaktualizowano       | Co zrobiono do tej pory                                          |
|------|----------|--------|-----------------------------------------------------------|--------------------------------------|---------------------|----------------------|-------------------------------------------------------------------|
| 01   | done     |        | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Obejmuje analizę wymagań raportów VAT | 2025-01-05 10:00    | 2025-01-05 12:00     | Przeprowadzono analizę raportów VAT. Szczegóły: additional-notes/01.md |
| 02   | planned  |        | Implementacja backendu raportów VAT                      | Zmiany w API raportów               | 2025-01-05 12:10    | 2025-01-05 12:10     |                                                                   |
| 03   | planned  |        | Implementacja GUI raportów VAT                           | Widok listy raportów i szczegół     | 2025-01-05 12:15    | 2025-01-05 12:15     |                                                                   |

```
**`additional-notes/01.md` – PRZED**

```markdown
# 01 – Doprecyzowanie kontekstu raportów VAT

- Raporty VAT muszą obsługiwać statusy draft/ready/archived.
- Zmieniane klasy: ReportGenerator, ReportQuery, VatCalculator.
- Trzeba zmienić endpoint GET /reports, żeby przyjmował dateRange.
```

Problem: agent startujący w 02/03 **nie ma mechanicznego sygnału**, że ma to przeczytać, ani które fragmenty są dla niego.

---

### „PO” (z HANDOFF i ustandaryzowanym `additional-notes/01.md`)

**`tasks.md` (fragment, po poprawkach)**

```markdown
| ID-T | Status   | Rodzic | Zadanie                                                   | Opis                                | Utworzono           | Zaktualizowano       | Co zrobiono do tej pory                                                                                                      |
|------|----------|--------|-----------------------------------------------------------|--------------------------------------|---------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| 01   | done     |        | Doprecyzowanie i uzupełnienie `additional-contexts.md` + przygotowanie planu technicznego | Obejmuje analizę wymagań raportów VAT | 2025-01-05 10:00    | 2025-01-05 12:00     | 2025-01-05 12:00 – zakończono doprecyzowanie kontekstu i analizę raportów VAT (szczegóły: additional-notes/01.md).          |
|      |          |        |                                                           |                                      |                     |                      | [HANDOFF: 02, 03]                                                                                                           |
|      |          |        |                                                           |                                      |                     |                      | - Implementacja backendu (02) i GUI (03) musi uwzględniać nowe statusy draft/ready/archived oraz zmianę `GET /reports`.    |
|      |          |        |                                                           |                                      |                     |                      | - Szczegóły: additional-notes/01.md, sekcja „Wnioski dla kolejnych kroków”.                                                |
| 02   | planned  |        | Implementacja backendu raportów VAT                      | Zmiany w API raportów wg analizy z 01 | 2025-01-05 12:10    | 2025-01-06 09:10     | 2025-01-06 09:10 – start 02. Wykorzystano HANDOFF z 01 (additional-notes/01.md, „Wnioski dla kolejnych kroków”).           |
| 03   | planned  |        | Implementacja GUI raportów VAT                           | Widok listy raportów i szczegół     | 2025-01-05 12:15    | 2025-01-07 09:05     | 2025-01-07 09:05 – start 03. Wykorzystano HANDOFF z 01 (additional-notes/01.md, „Wnioski dla kolejnych kroków”).           |
```

**`additional-notes/01.md` – PO**

```markdown
# 01 – Doprecyzowanie kontekstu raportów VAT

## Surowe notatki / logi (lokalne)

- Rozpoznano istniejące typy raportów...
- Wersja bazy: ...
- Testowe SQL-e: ...

## Wnioski dla kolejnych kroków

[HANDOFF: 02, 03]

- Dla ID-T `02` (implementacja backendu):
    - Raporty VAT muszą obsługiwać statusy `draft`, `ready`, `archived`.
    - Trzeba zmienić endpoint `GET /reports`, żeby przyjmował parametr `dateRange`.
    - Zmieniane klasy: `ReportGenerator`, `ReportQuery`, `VatCalculator`.

- Dla ID-T `03` (GUI raportów):
    - Na liście raportów trzeba pokazać status (`draft/ready/archived`).
    - Filtry w GUI muszą obsługiwać zakres dat (`dateRange`).

## Powiązane zadania

- Kolejne: `02` – backend, `03` – GUI.

## Linki / referencje

- ...
```

Teraz:

* 02 i 03 mają **obowiązek**:

    * znaleźć `[HANDOFF: 02, 03]` przy 01 w `tasks.md`,
    * przeczytać sekcję „Wnioski dla kolejnych kroków” w `additional-notes/01.md`.
* Agent startujący w 02/03 **loguje wprost** w `Co zrobiono do tej pory`, że korzystał z HANDOFF‑u z 01.
* Przykład jest w pełni spójny z zasadą `ID-T = 01` z pliku `tasks/GEMINI.md`.
