# Wytyczne dla repozytorium (GUI / Angular)

## Komunikacja z właścicielem

- Wszystkie odpowiedzi w tym katalogu formułuj **po polsku**, chyba że właściciel wyraźnie poprosi o inny język.
- Fragmenty kodu, komunikaty UI, nazwy klas itp. mogą być po angielsku, ale **wytłumaczenie i kontekst** zawsze po polsku.

## Powiązanie z agents-tasks-knowledge

- Zanim zaczniesz modyfikować GUI (`gui/`):
    - zidentyfikuj aktywne zadanie w `agents-tasks-knowledge/tasks/` (katalog `<ID-Z>_<status>/`),
    - przeczytaj jego `additional-contexts.md` i `tasks.md`,
    - sprawdź aktualne `Status`, `ID-T` oraz `Co zrobiono do tej pory`.
- Zanim wejdziesz w tryb wykonawczy dla konkretnego `ID-T`, zastosuj zasady HANDOFF z `agents-tasks-knowledge/AGENTS.md`:
    - sprawdź wiersze‑kontekst i `[HANDOFF: <Twoje ID-T>]` w `tasks.md`,
    - przeczytaj odpowiednie `additional-notes/<ID-T>.md`, sekcję „Wnioski dla kolejnych kroków”.
- Podczas pracy:
    - opisuj postęp w kolumnie `Co zrobiono do tej pory`,
    - aktualizuj `Zaktualizowano` dla zadań, których dotyczyła praca,
    - jeśli wykonujesz większą zmianę w GUI (nowy widok, większa refaktoryzacja) – dopisz krótkie podsumowanie i, w razie potrzeby, odsyłacz do `additional-notes/<ID-T>.md`.

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
### Multi‑agent / AGENT_ID (frontend)

Jeżeli agent GUI działa w trybie multi‑agent:

- Konfiguruj go z `AGENT_ID` (np. `gui-1`).
- Przy pracy w trybie zadań z `agents-tasks-knowledge/tasks/`:
    - agent frontendowy bierze wiersze w `tasks.md` tylko z `Agent = jego AGENT_ID` albo z pustym `Agent`,
    - przy pierwszym wejściu w wiersz z pustym `Agent` ustawia:
        - `Agent = jego AGENT_ID`,
        - `Status = in-progress` (jeśli wcześniej był inny).
- Wskaźnik sesji:
    - GUI używa pliku `agents-tasks-knowledge/SESSION_<AGENT_ID>.md` (np. `SESSION_gui-1.md`) o formacie opisanym w `agents-tasks-knowledge/AGENTS.md`,
    - nie dotyka `SESSION.md` ani plików sesji innych agentów.

Efekt:
- backend (`api-1`) i frontend (`gui-1`) mogą niezależnie trzymać swój kontekst (`current-task`, `current-id-t`),
- w `tasks.md` z jednego zadania widzisz jawnie, kto odpowiada za które kroki.


## Struktura projektu i organizacja modułów

Źródła Angular znajdują się w `src/app`, zorganizowane domenowo (`login`, `main`, `shared`, `core`). Nowe funkcje twórz w `src/app/<feature>` i podpinaj je w `app-routing.module.ts`.
Statyczne zasoby trzymaj w `src/assets`, a konfiguracje środowisk w `src/environments`; sekrety umieszczaj w plikach `.env` Dockera lub w ustawieniach Cloud Run.
Artefakty end-to-end trzymamy w `e2e/`, a konteneryzację i automatyzację buildów w katalogu `docker/` oraz w głównym `Makefile`.

## Komendy: build, testy i development

Zanim uruchomisz konkretną komendę `make` lub `npm`:

1. Otwórz `Makefile` i sprawdź, jakie cele są zdefiniowane.
2. Otwórz `package.json` i sprawdź dostępne skrypty `npm`.

Typowe nazwy (jeśli istnieją w projekcie):

- dev‑serwer: skrypt zbliżony do `npm start` / `npm run dev`,
- testy jednostkowe: np. `npm test` / `npm run test`,
- linting: np. `npm run lint` / `npm run lint:fix`,
- testy e2e: skrypt zawierający w nazwie `e2e`.

Używaj **dokładnie tych skryptów, które istnieją w `package.json`** – nie zakładaj z góry nazw.

### Uruchomienie środowiska developerskiego

Jżeli wywołujesz `make` z innego katalogu niż ten z `Makefile`, pamiętaj o dodaniu `-C <ścieżka do katalogu z Makefile>`, np.: `make -C gui up`.

- `make up` – uruchamia cały stack dla GUI (kontener z Angular, reverse proxy itd.).
- `make stop` – zatrzymuje kontenery związane z GUI.
- `make logs` – podgląd logów kontenerów GUI (przydatne przy debugowaniu).

Jeżeli katalog lub nazwy celów są inne, zaktualizuj je tutaj, ale zachowaj intencję:

> **zawsze korzystaj z komend z `Makefile`, zamiast ręcznie klepać `docker compose`**.

Zanim uruchomisz konkretną komendę `make`, upewnij się, że taki cel istnieje w `Makefile` (np. przeczytaj plik lub użyj celu typu `help`, jeśli jest dostępny).

### Komendy `npm` (lokalnie / wewnątrz kontenera)

Przykładowa konwencja (DO ZMIANY, jeśli masz inne nazwy w `package.json`):

- `npm start` – uruchamia dev‑serwer Angular (`ng serve`).
- `npm test` – uruchamia testy jednostkowe.
- `npm run lint` – uruchamia linting.
- `npm run lint_fix` – lint + automatyczne poprawki.
- `npm run e2e` – uruchamia testy end‑to‑end.

Agent:

1. Zawsze najpierw sprawdza w `package.json`, jakie są dokładne nazwy skryptów.
2. Używa ich **dokładnie** tak, jak są zdefiniowane (bez zgadywania).
3. Jeśli komenda z przykładowej listy (np. `npm run e2e`) nie istnieje w `package.json` / `Makefile`, **nie uruchamiaj jej** – zamiast tego:
    - wypisz, jakie skrypty i cele `make` są faktycznie dostępne,
    - zaproponuj aktualizację tego pliku `AGENTS.md`, aby odzwierciedlał realny stan projektu.

### Typowe flow dla agenta

1. Upewnij się, że środowisko stoi:
    - `make -C gui up`
2. Przed zmianami (lub na początku pracy nad zadaniem, jeżeli dotykasz kodu Angulara):
    - uruchom co najmniej `npm test`,
    - jeśli dotykasz istotnej logiki UI – także `npm run e2e` (lub równoważną komendę).
    - Jeżeli zadanie ma charakter wyłącznie analityczny / dotyczy dokumentacji i **nie zmieniasz kodu**, możesz pominąć uruchamianie testów, ale zapisz to wyraźnie w `Co zrobiono do tej pory` w `tasks.md`.
3. Wprowadź zmiany w kodzie w `src/app/...`.
4. Uruchom:
    - `npm run lint` (lub `lint_fix`, jeśli chcesz od razu poprawić formatowanie),
    - testy jednostkowe i – jeśli istnieje – konkretne testy e2e związane z Twoją zmianą.
5. W przypadku błędów:
    - przeanalizuj logi (terminal, przeglądarka, raporty),
    - opisz problem i wnioski w `agents-tasks-knowledge/tasks/.../tasks.md` (`Co zrobiono do tej pory`) oraz, jeśli trzeba, w `additional-notes/<ID-T>.md`.
6. Po zakończeniu pracy nad zadaniem:
    - zrób krótkie podsumowanie efektów w `tasks.md`,
    - wypisz dokładne komendy (`make` / `npm`), które kolejny agent powinien uruchomić, żeby odtworzyć sytuację.

### Narzędzia MCP przy debugowaniu

Przy debugowaniu UI możesz użyć serwerów MCP `playwright` i `chrome-devtools` (np. do odczytu logów konsoli, network itp.).

## Styl kodu i konwencje nazewnicze

Stosuj wcięcia 2‑spacjowe w TypeScript, HTML i SCSS. Trzymaj się angulowych wzorców nazw, takich jak:

- `feature-name.component.ts`,
- `*.service.ts`.

Elementy wielokrotnego użytku trzymaj w `shared/`, a usługi przekrojowe w `core/`.
Logikę widoku przenoś do komponentów, a cięższą logikę do serwisów, żeby zwiększyć testowalność.

Przed pushem:

- uruchom `npm run lint_fix`, aby `@angular-eslint`:
    - wymusił kolejność importów,
    - wykrył nieużywane elementy,
    - sprawdził reguły szablonów.

SCSS:

- trzymaj obok odpowiedniego komponentu,
- preferuj klasy w stylu BEM, żeby zapobiegać przeciekom styli.

## Główne konteksty

Moduł `main` jest podzielony na kilka głównych kontekstów:

- `admin`
- `employees`
- `projects`
- `reports`
- `services`
- `shared`

W tych kontekstach znajdują się główne kategorie funkcjonalne, najczęściej odpowiadające konkretnym stronom lub zakładkom GUI.
Jeśli któryś z modułów nie istnieje jeszcze w kodzie lub ma inną nazwę – traktuj tę listę jako docelowy kierunek organizacji, a nie dokładny opis bieżącego stanu.