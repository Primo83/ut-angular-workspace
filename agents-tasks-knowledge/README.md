# System zadań & współpraca z agentem – przewodnik dla człowieka

## 1. Po co jest ten katalog

W `agents-tasks-knowledge/`:

- zbierasz pomysły (`ideas/`),
- definiujesz zadania (`tasks/`),
- trzymasz „zakładki” z ostatnim miejscem pracy agenta (`SESSION*.md`).

Agent (np. ChatGPT podpięty do repo) czyta najpierw **to miejsce**, a dopiero potem zagląda w kod.

---

## 2. Kiedy w ogóle ruszać `agents-tasks-knowledge`

Masz trzy typowe sytuacje:

1. **Chcę tylko szybką odpowiedź / konsultację, bez zmian w repo.**  
   → piszesz do agenta normalnie. Nie musisz dotykać `agents-tasks-knowledge/`.

2. **Mam pomysł „na kiedyś”.**  
   → mówisz o nim agentowi albo dopisujesz go do `ideas/ideas.md`
     (agent też może to zrobić za Ciebie).

3. **Chcę realne zadanie, które agent ma prowadzić jak mini‑projekt.**  
   → opisujesz je agentowi w rozmowie i prosisz, żeby **sam założył** zadanie w `tasks/`
     według swojej dokumentacji.

Ty nie musisz ręcznie tworzyć katalogów, kopiować szablonów ani uzupełniać plików –
od tego jest agent.

Jeśli workspace był tworzony generatorem (`render.py --mode init` / init wizard), w `tasks/` może już istnieć bootstrap task (`<YYYYMMDD-HHMM>-workspace-bootstrap*_proposal/`) i ustawiony `SESSION.md` – w takim wypadku zacznij od niego. Ten bootstrap zawiera też subtaski audytu instrukcji (`AGENTS/CLAUDE/GEMINI.md`) dla oczekiwanych ścieżek. Po `render.py --mode sync` generator może dodatkowo utworzyć task `<YYYYMMDD-HHMM>-workspace-sync-audit*_in-progress/`, jeśli wykryje różnice w `origin-*` instrukcji, oraz ustawić `SESSION_<agent_id>.md` na `ID‑T=01` (pierwszy nie‑BA agent z configu).
W sync-audit agent może zastosować auto-merge zmian upstream tylko wtedy, gdy spełnione są reguły z `additional-contexts.md`; przy kolizjach lub wątpliwościach pyta użytkownika i przygotowuje plik konfliktu.
Przy `init` i `sync` generator utrzymuje też globalny plik `/.env.test-accounts` (tworzy go lub dodaje, jeśli brak). Ten plik służy wyłącznie taskom UI/przeglądarkowym; w takich taskach `additional-contexts.md` musi zawierać skrót danych kont testowych (`ATK_BROWSER_BASE_URL`, `ATK_BROWSER_TEST_USER`, `ATK_BROWSER_TEST_PASS`) oraz referencję do `/.env.test-accounts`.

---

## 3. Gdzie co jest (dla człowieka)

W katalogu `agents-tasks-knowledge/` znajdziesz:

- `README.md` – **ten plik** – Twoje instrukcje jako właściciela.
- `AGENTS.md` – skrócony podręcznik dla agenta (domyślnie pełny wariant inline jest w `GEMINI.md`, można to nadpisać przez `client_variants`).
- `AGENT_PROFILES.md` – lista ról (BA, backend, frontend...) + meta subagentów (`agent_type`, `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `skills`, `hooks`), żeby agent wiedział, w jakim kapeluszu pracuje.
- `SESSION.md` + `SESSION_<AGENT_ID>.md` – proste „zakładki”, gdzie agent ostatnio przerwał pracę.
- `ideas/` – luźne pomysły (jeszcze nie zadania).
- `tasks/` – właściwe zadania, każde w katalogu `<ID-Z>_<status>/`.

W katalogu mogą istnieć też pliki `origin-*` (generowane przez generator) oraz `CLAUDE.md` / `GEMINI.md` dla innych klientów – narzędzia czytają pliki user-owned.

`<ID-Z>` to skrót zadania, np. `250101-feature-reporting`.  
Agent może Ci zaproponować taki skrót albo przyjąć ten, który mu podasz.

---

## 4. Jak uruchomić **nowe zadanie** (flow dla człowieka)

### 4.1. Co robisz Ty w rozmowie

Gdy chcesz z czegoś zrobić „pełne zadanie”:

1. **Opisz problem / cel w rozmowie z agentem.**  
   Powiedz po ludzku: co chcesz osiągnąć, dla kogo, jakie są ograniczenia.

2. **Powiedz wprost, że to ma być nowe zadanie.**  
   Np.:

   > „Traktuj to jako nowe zadanie w `agents-tasks-knowledge/tasks/`.
   > Proszę, żebyś sam założył katalog zadania i wstępny plan, zgodnie z Twoją dokumentacją.”

3. (Opcjonalnie) Zaproponuj skrót zadania `<ID-Z>`, np.:

   > „Proponuję ID-Z = `250101-feature-reporting`, ale jeśli masz lepszą propozycję – daj znać.”

4. Zgódź się lub skoryguj propozycję agenta (ID, zakres, priorytet).

### 4.2. Co powinien zrobić agent (w tle)

Agent, zgodnie z własnym `AGENTS.md` / `tasks/AGENTS.md`, powinien:

1. Ustalić z Tobą `<ID-Z>` i status początkowy (`_proposal`).
2. Założyć w `tasks/` katalog:

   ```text
   <ID-Z>_proposal/
   ```

   na bazie szablonu (`template-task_proposal/` kopiowany do `tasks/<ID-Z>_proposal/`), a następnie dopasować jego zawartość.

3. Wypełnić w tym katalogu:

    * `additional-contexts.md` – zebrać i uporządkować informacje z rozmowy,
    * `tasks.md` – utworzyć pierwszy wiersz `ID-T = 01` z zadaniem:
      „doprecyzowanie kontekstu + przygotowanie planu”.

4. (Opcjonalnie) ustawić `SESSION*.md`, aby:

   ```text
   current-task: <ID-Z>_proposal
   current-id-t: 01
   last-updated: RRRR-MM-DD GG:MM
   ```

5. Zasygnalizować Ci w rozmowie:

    * jaki dokładnie katalog utworzył,
    * gdzie są najważniejsze pliki,
    * co proponuje jako kolejne kroki.

Twoja rola: **zaakceptować / poprawić** to, co agent wpisał do `additional-contexts.md` i `tasks.md`.

---

## 5. Co robisz Ty, a co robi agent

### Ty (właściciel zadania)

* decydujesz, **które tematy** zasługują na pełne zadanie,
* opisujesz cel, kontekst biznesowy i ważne ograniczenia,
* ustalasz (razem z agentem) skrót `<ID-Z>` i priorytet,
* akceptujesz lub modyfikujesz plan z `tasks.md`,
* podejmujesz decyzje o zmianie statusu katalogu (`_proposal`, `_to-do`, `_planning`, `_planned`, `_in-progress`, `_on-hold`, `_done`),
* ewentualnie ręcznie poprawiasz `SESSION*.md`, gdy chcesz „przestawić uwagę” agenta na inne zadanie.

Nie musisz ręcznie zakładać katalogów ani dopisywać tabel – od tego jest agent.

### Agent (np. ChatGPT z dostępem do repo)

* dopytuje o brakujące informacje (tryb aktywnego dopytywania),
* tworzy i aktualizuje katalog zadania `<ID-Z>_<status>/` w `tasks/`,
* rozbija cel na kroki (`ID-T`) w `tasks.md`,
* w czasie pracy dopisuje w kolumnie „Co zrobiono do tej pory”:

    * co zrobił,
    * jakie komendy / zapytania uruchomił,
    * jakie były wyniki,
* przy większych analizach / logach / SQL przerzuca szczegóły do `additional-notes/<ID-T>.md`,
* pilnuje statusów `Status` i dat `Utworzono` / `Zaktualizowano`,
* dla tasków UI/przeglądarkowych pilnuje reguły testów manualnych (`agent-browser`, start od `agent-browser connect 9222`) i użycia danych kont testowych z `/.env.test-accounts`,
* aktualizuje odpowiedni `SESSION*.md`, żeby można było łatwo wznowić pracę.

---

## 6. Jak wznawiać pracę po przerwie

### 6.1. Najprostszy sposób (rozmowa)

1. Powiedz agentowi:

   > „Chcę wznowić pracę nad zadaniem `<ID-Z>_<status>`.
   > Proszę, żebyś sam dobrał odpowiedni `ID-T` na podstawie `tasks.md` i swoich `SESSION*.md`.”

2. Agent:

    * odczyta `SESSION*.md` (jeśli jest ustawiony),
    * zajrzy do `tasks/<ID-Z>_<status>/tasks.md`,
    * zaproponuje, od którego kroku (`ID-T`) wznowić pracę.

Ty tylko potwierdzasz lub korygujesz.

### 6.2. Ręczna korekta (gdy bardzo chcesz)

Jeśli chcesz samemu „przestawić zakładkę”, możesz:

1. W `agents-tasks-knowledge/tasks/` znaleźć katalog `<ID-Z>_<status>/`.

2. W odpowiednim pliku sesji (single‑agent: `SESSION.md`, multi‑agent: `SESSION_<AGENT_ID>.md`) ustawić:

   ```text
   current-task: <ID-Z>_<status>
   current-id-t: <ID-T>, od którego chcesz zacząć
   last-updated: RRRR-MM-DD GG:MM
   ```

3. Powiedzieć agentowi:

   > „Zaktualizowałem `SESSION*.md`. Kontynuuj od tego, co tam jest ustawione.”

To jest tryb „manual override” – standardowo wystarczy rozmowa z punktu 6.1.

---

## 7. Tryb multi‑agent (BA, backend, frontend...)

Jeśli korzystasz z kilku ról (np. `ba`, `api-1`, `gui-1`):

* profile są opisane w `AGENT_PROFILES.md`,
* każdy agent może mieć własny plik sesji:

    * `SESSION_api-1.md`
    * `SESSION_gui-1.md`
    * itd.

Dzięki temu backend i frontend nie nadpisują sobie nawzajem zakładek.

Typowy flow:

1. W UI / rozmowie wybierasz odpowiedni profil (np. `api-1` dla backendu).

2. Mówisz agentowi:

   > „Jako `api-1` wznowienie pracy nad `<ID-Z>_<status>` – dobierz odpowiedni `ID-T` z `tasks.md`.”

3. Agent dopasowuje `SESSION_api-1.md` i pracuje tylko w swoim kontekście.

---

## 8. Statusy – co one mniej więcej znaczą

Status pojawia się:

* w nazwie katalogu zadania `<ID-Z>_<status>/`,
* w kolumnie `Status` tabeli `tasks.md`.

Najważniejsze statusy:

* `proposal` – jest zalążek, doprecyzowujemy, o co w ogóle chodzi.
* `to-do` – pomysł zaakceptowany, ale plan jeszcze nie rozpisany.
* `planning` – trwa rozbijanie na kroki / analiza.
* `planned` – plan gotowy, czeka na wykonanie.
* `in-progress` – prace w toku.
* `on-hold` – wstrzymane (czekamy na decyzję, dane, inne zadanie).
* `done` – zadanie zamknięte.

Dokładniejsze, „enterprise’owe” definicje znajdziesz w `agents-tasks-knowledge/AGENTS.md`
w sekcji „Files statuses”.

---

## 9. Kiedy NIE musisz zakładać zadania

Nie potrzebujesz wpisu w `tasks/`, jeśli:

* prosisz tylko o wyjaśnienie fragmentu kodu / SQL / konfiguracji,
* zadajesz krótkie pytania („jak odpalić testy”, „czemu ten docker się nie podnosi”),
* prosisz o przykładowy snippet „na tablicy”, bez zamiaru wrzucania tego od razu do repo.

Jeżeli w trakcie takiej rozmowy zobaczysz, że temat urósł do mini‑projektu, po prostu powiedz:

> „To już wygląda jak osobne zadanie.
> Proszę, załóż nowe zadanie w `agents-tasks-knowledge/tasks/` i zrób plan,
> zgodnie z Twoją dokumentacją.”

Agent sam:

* założy katalog zadania,
* wypełni podstawowe pliki,
* zaproponuje Ci plan dalszych kroków.
