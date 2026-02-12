Ledger Snapshot
- Goal: Zweryfikować rundę `20260212-2038` planu `20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux_planning` z naciskiem na definicję „serwis 100%”, traceability 50/50 i workflow UX (03/05/06).
- Now/Next: Now – plan nadal w statusie `planning`, brakuje konkretów w additional-notes dla 50 smaczków, tooltipów i live-indexingu; Next – właściciel musi uzupełnić notatki 02/03/05/06/07 i odświeżyć kolumny w `tasks.md`, potem ponowny audyt.
- Open Questions: UNCONFIRMED Czy właściciel uzna powyższe scope/traceability za wystarczające, by przejść do ID-T=02 po poprawkach?

# Plan Audit Report - Gemini
Werdykt: FAIL
P0: 0
P1: 0
P2: 3
## Findings
- [P2] „Serwis 100%” (wymóg biznesowy i ID-T=07) nie ma konkretnego checklistowego odniesienia; `additional-notes/07-definition-of-100.md` to placeholder bez scenariuszy demo/testów (`make -C ut-angular lint/test`, brak `console.error`), więc nie da się ocenić ani śledzić spełnienia 100% zanim ID-T=01 zakończone.
- [P2] Traceability listy 50 smaczków nie istnieje: `tasks.md` wskazuje macierz `additional-notes/02-macierz-50-smaczkow.md`, ale plik nadal zawiera tylko placeholder, brak mapowania smaczków → UI → akcje/dowody → status 50/50.
- [P2] Workflow kluczowych epików UX (ID-T=03 copy dla laików, ID-T=05 live indexing, ID-T=06 tooltipy/a11y) odwołuje się do placeholderów (`additional-notes/03-copy-guide.md`, `05-live-indexing.md`, `06-tooltips-a11y.md`) bez prostych przykładów, scenariuszy live-indexingu (dane, timing, demo), ani kryteriów a11y/keyboard navigation/testów manualnych, co blokuje planowanie implementacji i testów.

## Strengths
- Surowe dane w `additional-contexts.md` utrzymują pełną listę 50 smaczków, definicję „serwisu 100%”, nowy skrót `Alt+Shift+M` i wymagania UX, co zapewnia kontekst biznesowy dla dalszych etapów.
- `tasks.md` rozbił prace na konkretne ID-T (macierz 50, copy, shortcut, live indexing, tooltipy, definicja 100%, testy manualne/automatyczne), pokazując strukturę workflow i miejsca na dowody w `additional-notes/`.

## Required Fixes Before ID-T=01 done
- Uzupełnić `additional-notes/07-definition-of-100.md` check-listą scenariuszy demo/testów (`lint/test`, brak `console.error`, stabilność) i powiązać ją z kolumną „Co zrobiono do tej pory” dla ID-T=07, by definicja 100% była weryfikowalna.
- Wypełnić `additional-notes/02-macierz-50-smaczkow.md` tabelą 50 smaczków z kolumnami: sekcja UI, akcja demo, dowód testowy/agent-browser i status, aby zapewnić traceability 50/50 dla pokrycia.
- Rozbudować `additional-notes/03-copy-guide.md`, `05-live-indexing.md`, `06-tooltips-a11y.md` o konkretne przykłady prostego języka (zakazane terminy + proponowane frazy), krok-po-kroku scenariusz live-indexingu (dane/timing/dowody) oraz specyfikację a11y/tooltips (role, `aria-describedby`, keyboard/mobile) wraz ze scenariuszami testowymi, aby workflow etapów 03/05/06 był powtarzalny i mierzalny.
