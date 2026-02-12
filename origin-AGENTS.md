# Główny przewodnik dla agentów (Root Policy)

## PROJECT CONTEXT
<!-- AUTO-GENERATED from project.yaml – NIE EDYTUJ RĘCZNIE -->
| Parametr             | Wartość               |
|----------------------|-----------------------|
| Projekt              | `frontend-only`  |
| Język odpowiedzi     | `pl` |
| Struktura workspace  | `monorepo` |

### Komponenty (enabled)
| ID | Katalog | Stack / typ | Instrukcje |
|----|---------|-------------|------------|
| `gui` | `ut-angular` | angular x.y | `ut-angular/AGENTS.md` |


> **Wersja systemu:** 1.1.0 (2025-12-19)
> **Changelog (skrót):**
> - 1.1.0 – monorepo Nx + multi‑api + tools: filtry subdirów, marker_is_json, wsparcie tools w wizardzie i nowe szablony per‑subdir.
> - 1.0.0 – pierwsza wersja z pełnym multi‑agentem, HANDOFF, SESSION*.md i doprecyzowaną hierarchią `AGENTS*.md`.


## 0. Kim jesteś i jak masz się zachowywać

1. Jesteś technicznym asystentem / agentem programistycznym pracującym na tym repozytorium (np. `codex-cli`, Agent Cloud, inne CLI / narzędzia korzystające z tego samego zestawu instrukcji).
2. We wszystkich odpowiedziach dla właściciela repozytorium pisz **po polsku**, chyba że użytkownik wyraźnie poprosi o inny język.
3. Zawsze staraj się:
    - być konkretny i opierać się na kodzie / plikach z repo,
    - minimalizować halucynacje – jeśli czegoś nie wiesz, powiedz to wprost,
    - proponować małe, bezpieczne kroki zamiast ogromnych refaktoryzacji naraz.
    - unikać nadmiernego „kombinowania” – wybieraj najprostsze rozwiązanie zgodne z istniejącą architekturą i stylem kodu tego repozytorium.

### 0.A TL;DR dla nowej sesji (3 kroki)

1. **Język i rola** – odpowiadaj po polsku, bądź konkretny, opieraj się na plikach z repo, nie wymyślaj rzeczy, których nie widzisz w kodzie.
2. **Decyzja: ad‑hoc vs. system zadań**
    - jeśli użytkownik wprost pisze, że chodzi o jednorazową analizę / konsultację, pracujesz ad‑hoc i **nie** dotykasz `agents-tasks-knowledge/` (patrz też pkt 2.9),
    - w pozostałych przypadkach **domyślnie** korzystasz z systemu zadań: `agents-tasks-knowledge/AGENTS.md`, `SESSION*.md`, `tasks/`.
    - jeśli w repo istnieje `CONTINUITY.md`, to przy pytaniach o status łączysz go z `SESSION*.md` (o ile istnieją) i odpowiednim `tasks.md`.
3. **Brak zmian bez zadania** – każdą konkretną zmianę w repo (diffy, migracje, komendy modyfikujące stan) wiążesz z konkretnym katalogiem z `tasks/` i `ID-T` w jego `tasks.md` (chyba że jesteś w trybie jednorazowej analizy z pkt 2.9).

---

## Twarda bramka: decision-complete (Plan -> Implementacja)

Jesli pracujesz w workflow `agents-tasks-knowledge` (tj. masz aktywny `current-task` w `agents-tasks-knowledge/SESSION*.md`), to:

- **NIE WOLNO** wykonywac implementacji (zmian w kodzie/konfigach) dopoki plan nie jest **decision-complete**.

### Kiedy plan jest decision-complete
Wymagane dowody:

1) `tasks.md`: `ID-T = 01` ma `Status = done`.
2) W `additional-notes/` istnieja raporty audytu planu:
   - dwa pliki `*-plan-audit-subagent-*.md`
   - jeden plik `*-plan-audit-claude.md`
   - jeden plik `*-plan-audit-gemini.md`
3) Wszystkie audyty sa **bez zastrzezen** (P1/P0 blokuja; P2 po 3 rundach sa nieblokujace).
4) Jesli istnieje `*-audit-blockers.md` albo w `tasks.md` jest `[BLOCKER]` -> **STOP** i eskalacja do wlasciciela.
5) Dla taskow UI/przegladarkowych (`- [x] UI/UX`) wymagane sa: skrot danych kont testowych w `additional-contexts.md`, referencja do `/.env.test-accounts` i testy manualne `agent-browser` (dla pracy browserowej start od `agent-browser connect 9222`).

### Petla
Jesli audyt ma uwagi:
- popraw plan (`additional-contexts.md` + `tasks.md`),
- zaktualizuj daty `Zaktualizowano`,
- uruchom audyty ponownie,
- powtarzaj az do braku zastrzezen (P2 po 3 rundach nie blokuja) albo fail-safe.

### Wyjatki (waiver)
Wyjatek od tej bramki wymaga **jawnej zgody wlasciciela** i wpisu w `additional-contexts.md` (kto zatwierdzil + zakres + ryzyko).
## 1. Jak Agent czyta instrukcje i jak interpretować konflikty

1. Agent buduje łańcuch instrukcji z plików user-owned (`AGENTS.md`, a dla innych klientów odpowiednio `CLAUDE.md` / `GEMINI.md`):
    - globalne (`~/.Agent/AGENTS.md`),
    - projektowe – od katalogu głównego repo do katalogu, w którym pracujesz.
   Pliki generowane przez generator służą jako źródło do odświeżenia user-owned; nie są czytane automatycznie przez agenta.
2. Na poziomie **tego repozytorium** przyjmij następującą logikę:

    1. Instrukcje systemowe / execpolicy / ustawienia Agent – poza Twoją kontrolą, ale zawsze obowiązują.
    2. Ten plik `AGENTS.md` w katalogu głównym repo – ogólne zasady, bezpieczeństwo, proces zadań.
    3. `agents-tasks-knowledge/AGENTS.md` – definicje statusów, ogólne zasady pracy na `tasks/` i `ideas/`.
    4. `agents-tasks-knowledge/tasks/AGENTS.md` – szczegółowy proces tworzenia nowych katalogów z zadaniami, rola właściciela (BA) oraz twarda zasada, że `ID-T = 01` służy doprecyzowaniu `additional-contexts.md` i przygotowaniu planu.
    5. Specyficzne pliki `AGENTS.md` w podkatalogach:

        - `ut-angular/AGENTS.md` – wytyczne dla komponentu `frontend (Angular)`,
        - ewentualne inne `AGENTS*.md` bliżej edytowanego pliku.
    6. Im bliżej katalogu z edytowanym plikiem, tym **ważniejsze** są te instrukcje.
    7. **Priorytet numeryczny w razie konfliktu (od najwyższego do najniższego):**
       1. Instrukcje systemowe / execpolicy / ustawienia Agenta (sandbox, bezpieczeństwo).
       2. Instrukcje użytkownika w bieżącej rozmowie – co do celu („co” ma być zrobione),
          o ile nie łamią zasad bezpieczeństwa z pkt 1.
       3. `AGENTS.md` w katalogu edytowanego pliku (np. `ut-angular/AGENTS.md`).
       4. `agents-tasks-knowledge/tasks/AGENTS.md` – proces dla katalogów w `tasks/`.
       5. `agents-tasks-knowledge/AGENTS.md` – definicje statusów, zasady `SESSION*.md`, HANDOFF.
       6. Ten plik (`AGENTS.md` w root repo).
       7. Globalne `~/.Agent/AGENTS.md` (poza kontrolą projektu, najniższy priorytet).

       Przy konfliktach **na tym samym poziomie priorytetu** stosuj zasadę
       „bliższy katalog wygrywa” z pkt 6 powyżej i opisz swój wybór w odpowiedzi.


3. Instrukcje użytkownika w bieżącej rozmowie:
    - traktuj jako nadrzędne co do celu („co” zrobić),
    - ale jeśli wprost proszą o złamanie lokalnych zasad (np. brak testów, destrukcyjna operacja na bazie), zrób trzy kroki:
        1. Wypunktuj konflikt (co z czym się gryzie).
        2. Zaproponuj bezpieczniejszą interpretację / wariant.
        3. Działaj dopiero po potwierdzeniu użytkownika.

4. Gdy widzisz konflikt między plikami `AGENTS*.md`:
    1. Najpierw przyjmij zasadę „bliższy katalog wygrywa”.
    2. Jednocześnie poinformuj właściciela o rozjeździe i zaproponuj spójne zachowanie.
    3. Nie zakładaj, że Twój wybór jest oczywisty – opisz go w odpowiedzi.

---

## 2. Zasady pracy z zadaniami (`agents-tasks-knowledge`)

0. Jeśli jako właściciel chcesz **założyć nowe zadanie od zera** i być prowadzony „za rękę”, zacznij od pliku
   `agents-tasks-knowledge/tasks/AGENTS.md`, sekcje:
   - `0. Szybki start dla właściciela zadania (BA)`,
   - `9. Flow właściciel ↔ agent`.
   Tam jest opisany pełny „happy path” od pomysłu do pierwszej sesji agenta dla `<ID-Z>_proposal`.
   Jako agent, gdy w rozmowie użytkownik napisze coś w stylu „załóżmy nowe zadanie dla ...” albo „pomóż mi założyć nowe zadanie w `tasks/`”,
   traktuj to tak, jakby właśnie poprosił o przejście przez ten „happy path”.
   **Nie odsyłaj go tylko do pliku.** Zamiast tego, krok po kroku:
     - streszczaj mu, co ma fizycznie zrobić w repo (skopiowanie katalogu, nazwa `<ID-Z>_proposal`, wypełnienie `additional-contexts.md`, ustawienie `SESSION.md`),
     - podawaj dokładne ścieżki / komendy,
   - dopiero na końcu, jeśli chce szczegóły, wskaż odpowiednie sekcje `agents-tasks-knowledge/tasks/AGENTS.md` jako referencję.

1. Źródłem prawdy o stanie prac są katalogi w `agents-tasks-knowledge/tasks/` i powiązane pliki:
    - `additional-contexts.md`,
    - `tasks.md`,
    - pliki w `additional-notes/`.
2. Szczegółowe zasady i definicje statusów (`proposal`, `to-do`, `planning`, `planned`, `in-progress`, `on-hold`, `done`) znajdziesz w:
    - `agents-tasks-knowledge/AGENTS.md` (sekcja „Files statuses”),
    - `agents-tasks-knowledge/tasks/AGENTS.md` (proces tworzenia nowych zadań).
3. Struktura i sposób użycia `additional-contexts.md` (w tym szablon BA, tryb „aktywnego dopytywania”, w którym właściciel wypełnia głównie sekcję
   „Surowe dane”, a agent aktywnie dopytuje o resztę, **oraz zasada, że pierwsze zadanie `ID-T = 01`
   służy doprecyzowaniu `additional-contexts.md` i przygotowaniu planu**) są opisane kanonicznie w
   `agents-tasks-knowledge/tasks/AGENTS.md`, sekcja „3. Wypełnianie `additional-contexts.md`
   (opis biznesowy, forma BA)”.
4. Zanim zaproponujesz **konkretną zmianę plików w repozytorium**
   (np. w formie patcha/diffu, migracji, komendy, która modyfikuje bazę danych lub konfigurację):
   - znajdź aktywne zadanie (`<ID-Z>_<status>/` z `status` innym niż `done` / `on-hold`),
   - przeczytaj jego `additional-contexts.md` i `tasks.md`,
   - ustal, które `ID-T` jest **następnym logicznym krokiem** i pracuj w jego kontekście.

   Wyjątek: jeżeli w tej rozmowie pracujesz w trybie jednorazowej analizy opisanym w pkt 2.9
     (bez bezpośrednich zmian w repozytorium), możesz pominąć ten krok i po prostu odpowiedzieć
     na pytanie użytkownika.

5. W trakcie pracy nad zadaniem:
    - aktualizuj `tasks.md`:
        - kolumny `Status`, `Co zrobiono do tej pory`, `Zaktualizowano`,
    - przy większych analizach / logach / zrzutach SQL używaj plików w `additional-notes/<ID-T>.md`,
    - **nigdy nie zmieniaj istniejących `ID-T`** – historia musi być odtwarzalna.

6. **Preferuj `taskctl` do operacji na taskach/SESSION (zamiast ręcznej edycji plików)**  
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

7. **Kiedy `taskctl` jest uruchamiane?**
   - **Jawnie** przez człowieka lub agenta (deterministyczna operacja na taskach/SESSION),
   - **Jawnie** w testach/harness (jako krok scenariusza),
   - **Nie** „po cichu” przez `init-workspace.sh`, `sync-workspace.sh`, `init_wizard.py`, `render.py` ani `agent-run` (auto‑run to osobny follow‑up i wymaga policy/approval).

8. Nie wybieraj do pracy katalogów:
    - `template-task_proposal/` (to baza do kopiowania przy zakładaniu nowych zadań),
    - `example1-task_done/`,
    - `example2-task_in-progress/` – to są tylko przykłady / szablony.

9. Jeśli właściciel repozytorium prosi tylko o jednorazową analizę / wyjaśnienie **albo o przykładowy kod „na tablicy”, który nie jest proponowany jako bezpośrednia zmiana plików w repo**:
   - możesz odpowiedzieć ad‑hoc **bez** tworzenia nowego zadania,
   - jeśli z analizy wynika potrzeba dalszych prac – zaproponuj utworzenie zadania zgodnie z `agents-tasks-knowledge/tasks/AGENTS.md`.

10. System zadań jest przygotowany na pracę wielu agentów równolegle:
    - kolumna `Agent` w `tasks.md` wskazuje właściciela danego wiersza (np. `api-1`, `gui-1`, `ba`, `human-pm`),
    - dla każdego agenta technicznego możesz utrzymywać osobny wskaźnik sesji `SESSION_<AGENT_ID>.md` o tym samym formacie, co `SESSION.md`,
    - szczegółowe zasady są opisane w `agents-tasks-knowledge/AGENTS.md`, sekcja „Multi‑agent (AGENT_ID i kolumna `Agent`)” oraz „Multi‑agent: `AGENT_ID` i pliki `SESSION_<AGENT_ID>.md`”.

>Agenci techniczni (np. `api-1`, `gui-1`) w trybie multi‑agent **nie modyfikują**
>globalnego `agents-tasks-knowledge/SESSION.md`. Aktualizują wyłącznie swoje pliki
>`agents-tasks-knowledge/SESSION_<AGENT_ID>.md` zgodnie z zasadami z
>`agents-tasks-knowledge/AGENTS.md`.


Prośba o założenie nowego zadania traktuj jako **nowy nadrzędny cel** – nawet jeśli `SESSION.md` wskazuje inne zadanie, w tej sesji priorytet ma nowe `<ID-Z>_proposal` (opisz to właścicielowi i wpisz nową zawartość `SESSION.md`).

---

## 3. Styl pracy i minimalizowanie halucynacji

1. Zawsze opieraj się na realnych plikach:
    - cytuj ścieżki (`ut-angular/src/app/...`, `agents-tasks-knowledge/...`),
    - pokazuj krótkie fragmenty kodu zamiast wymyślać abstrakcyjne przykłady.
2. Jeśli czegoś **nie ma** w repo (brak pliku, brak skryptu, brak migracji):
    - powiedz to wprost,
    - zaproponuj, co trzeba dodać (nowy plik / nowy wpis w `composer.json` / `package.json` itp.).
3. Dbaj o kontekst:
    - nie wklejaj całych dużych plików do odpowiedzi,
    - cytuj tylko potrzebne fragmenty (kilka–kilkanaście linii),
    - przy większych zmianach używaj opisu + diffów zamiast przepisywać plik w całości,
    - przy powoływaniu się na `additional-contexts.md` i `additional-notes/<ID-T>.md`
      podawaj raczej streszczenie + ścieżkę pliku niż surową treść (to oszczędza kontekst i ułatwia pracę kolejnym agentom).
4. Rozbijaj duże tematy na mniejsze:
    - osobne `ID-T` na analizę, implementację backendu, GUI, testy,
    - osobne commity / propozycje zmian tam, gdzie to możliwe.
---

## 4. Zasady bezpieczeństwa technicznego

1. Przy destrukcyjnych operacjach (czyszczenie bazy, migracje, masowe kasowanie danych) zawsze:
    - zakładaj, że pracujesz na **ważnym środowisku**, dopóki nie ma jasnej informacji, że to test/dev,
    - jasno pisz, **jaką komendę** proponujesz i **na jakim środowisku** powinna zostać uruchomiona,
    - opisz spodziewany efekt i ryzyko.

2. Preferuj istniejące mechanizmy projektu:
    - frontend – komendy `make` / `npm` zdefiniowane w `ut-angular/`.
    - zanim zaproponujesz „gołe” `docker compose`, `phpunit`, `ng serve` itd. – sprawdź, czy nie ma odpowiedniego celu w `Makefile` / `package.json`.

3. Zanim zaproponujesz nową bibliotekę / framework:
    - sprawdź `composer.json` / `package.json`,
    - oceń, czy nie da się użyć czegoś, co już istnieje w projekcie,
    - jeśli potrzebna jest nowa zależność:
        - uzasadnij ją,
        - wskaż dokładne miejsce zmian,
        - poproś o akceptację.

4. Nigdy nie proponuj na ślepo:
    - `DROP DATABASE`,
    - masowych `DELETE FROM ...` bez precyzyjnego filtra,
    - zmian schematu bazy danych bez powiązanego zadania i jednoznacznego zaznaczenia, że chodzi o środowisko testowe.

5. Jeśli nie masz bezpośredniego dostępu do shella / repo (działasz tylko jako model tekstowy):
    - traktuj komendy (`make`, `npm`, `docker`, `phpunit` itd.) jako **propozycje dla właściciela repozytorium**,
    - wypisz je i poproś o uruchomienie,
    - nie udawaj, że komenda była wykonana, jeśli nie masz zwrotki z logów / wyników.

---

## 5. Jak proponować zmiany w kodzie

1. Zawsze wskazuj **konkretne ścieżki plików**:
    - frontend: `ut-angular/src/app/...`, `ut-angular/src/assets/...`,
    - zadania: `agents-tasks-knowledge/tasks/<ID-Z>_<status>/tasks.md` itp.

2. Preferowany format zmian:
    1. Krótkie streszczenie: *co* i *dlaczego* zmieniasz.
    2. Patch w formacie unified diff:

       ```diff
       --- a/src/Example.php
       +++ b/src/Example.php
       @@ -10,6 +10,9 @@
        final class Example
        {
       +    public function foo(): void
       +    {
       +    }
        }
       ```

    3. Jeśli diff byłby zbyt duży – opisz strukturę zmian (np. „dodajemy nową klasę X z metodami Y, Z”) i podaj tylko kluczowe fragmenty.

3. Po każdej propozycji zmian zaproponuj **konkretne testy** do odpalenia:
    - frontend:
        - odpowiednie skrypty `npm` (`npm test`, `npm run lint`, e2e), według `ut-angular/package.json`.

4. Przy zmianach wielowarstwowych (np. nowy feature od bazy po GUI):
    - rozbij to na kilka `ID-T` w `tasks.md`,
    - dla każdego wiersza opisz:
        - które pliki zostały dotknięte,
        - jakie testy były / powinny być uruchomione.

---

## 6. Checklista przed wysłaniem odpowiedzi

Przed każdą odpowiedzią upewnij się, że:

1. Odpowiedź jest po polsku, zrozumiała i konkretna.
2. Jeśli dotyczy konkretnego zadania:
    - podałeś **ID zadania** (`ID-Z` oraz `ID-T`),
    - napisałeś, które wiersze w `tasks.md` należy zaktualizować,
    - wskazałeś, czy potrzebny jest nowy plik w `additional-notes/`.
3. Jeśli proponujesz zmiany w kodzie:
    - wskazujesz konkretne ścieżki plików,
    - używasz diffów / fragmentów zamiast przepisywać całe pliki,
    - sugerujesz testy do odpalenia (konkretne komendy `make` / `npm` / `phpunit` / `behat`).
4. Jeśli czegoś nie wiesz albo czegoś brakuje w repo:
    - komunikujesz to wprost (bez wymyślania),
    - proponujesz najprostszy sensowny następny krok.
5. Jeśli zadanie jest większe:
    - upewniłeś się, że nie próbujesz „naprawić świata” w jednym przebiegu,
    - zaproponowałeś podział na mniejsze kroki (`ID-T`) z sensownymi punktami HANDOFF.
## 7. Struktura workspace'u i Git

1. Dla struktury `monorepo` zakładaj, że `.git` jest w katalogu głównym projektu (chyba że repo mówi inaczej).
2. Jeśli jednak w tym repo są pod‑repozytoria, używaj `git -C <katalog-repo> ...` analogicznie jak dla `multirepo`.
