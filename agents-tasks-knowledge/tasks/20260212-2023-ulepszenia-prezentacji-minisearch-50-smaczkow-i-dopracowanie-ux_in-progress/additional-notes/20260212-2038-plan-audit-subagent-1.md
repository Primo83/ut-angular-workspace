# Plan Audit Report - Subagent 1
Werdykt: FAIL
P0: 0
P1: 0
P2: 3
## Findings
- [P2] `ID-T=02` i powiązane notatki (`additional-notes/02-macierz-50-smaczkow.md`) wciąż są placeholders, nie ma tabeli 50/50 smaczków z przypisaniem do sekcji UI i dowodów testowych, więc nie da się zweryfikować pokrycia wymaganej listy z `additional-contexts.md`.
- [P2] `ID-T=03`/`ID-T=06` (`additional-notes/03-copy-guide.md`, `06-tooltips-a11y.md`) nie zawierają przykładów prostych opisów, zakazanych terminów ani scenariuszy A11y (role/`aria-describedby`, obsługa klawiatury/mobile), więc nie ma kryteriów akceptacji ani testowalności tooltipów dla laików.
- [P2] `ID-T=05` (`additional-notes/05-live-indexing.md`) nie opisuje scenariuszy live-indexingu (kroki, dane, timing, dowody w `agent-browser`), więc nie można udowodnić działania “serwisu 100%” live idexingu bez restartu.

## Strengths
- `additional-contexts.md` zawiera kompletną listę 50 smaczków, definicję „serwisu 100%”, nowy skrót `Alt+Shift+M`, live indexing i UX/tooltipowe wymagania, co daje jasny kontekst dla planu.
- `tasks.md` rozdziela pracę na dedykowane ID-T (macierz, copy, tooltipy, live indexing, definicja 100%, testy), co ułatwia dopisywanie dowodów w `additional-notes`.
- Plan zawiera odniesienie do testów (`make -C ut-angular lint/test`) oraz manualnych testów `agent-browser` z `/.env.test-accounts`, więc wymagania QA są jasno zdefiniowane.

## Required Fixes Before ID-T=01 done
- Uzupełnić `additional-notes/02-macierz-50-smaczkow.md` tabelą 50 smaczków z kolumnami `Smaczek`, `Sekcja UI`, `Akcja demo`, `Dowód testu` i obecnym statusem, tak aby weryfikacja pokrycia odbywała się przez traceability 50/50.
- Rozwinąć `additional-notes/03-copy-guide.md` i `06-tooltips-a11y.md` o konkretne przykłady prostego języka (zakazane terminy + wzory „co robi / po co / kiedy”), scenariusze testowe A11y (role/`aria-describedby`, keyboard, mobile) i checklistę akceptacji tooltipów, aby laik mógł ocenić teksty przed implementacją.
- Rozbudować `additional-notes/05-live-indexing.md` o szczegółowy scenariusz live-indexingu (krok po kroku, dane, timing, miejsce w demo 30 min), dowody manualne (`agent-browser`) i ewentualne testy komponentowe, tak by „serwis 100%” dla dodawania dokumentów w locie miał mierzalną weryfikację (wyniki aktualizują się bez restartu).
