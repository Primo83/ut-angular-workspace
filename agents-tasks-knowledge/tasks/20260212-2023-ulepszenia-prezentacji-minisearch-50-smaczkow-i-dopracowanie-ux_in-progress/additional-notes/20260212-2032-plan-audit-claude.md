Ledger Snapshot: Goal: Doprecyzować plan taska `20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux` tak, by przygotować demo MiniSearch z 50 smaczkami, live indexingiem, tooltipami i nowym skrótem; Now: Claude wykonał audyt planu runda 20260212-2032 i raport wskazuje, że ID-T=01 nie może jeszcze przejść bramki decision-complete z uwagi na niedoprecyzowane kroki 02‑07 oraz brak macierzy testowej; Next: dopracować szczegóły dla etapów 02‑07 (macierz 50 smaczków, copy, live indexing, tooltipy, stabilność) oraz zebrać komplet raportów (2 subagenty + Claude + Gemini) przed zamknięciem ID-T=01; Open Questions: UNCONFIRMED czy katalog `gui/` zostanie porzucony na rzecz `ut-angular/`.

# Plan Audit Report - Claude
Werdykt: FAIL
P0: 0
P1: 0
P2: 2
## Findings
- [P2] W tabeli `tasks.md` wszystkie kroki ID-T=02...07 są jedynie nazwane i nie zawierają konkretnych kryteriów akceptacji, mappingu 50 smaczków ani przypisanych testów, więc plan nie pozwala przejść od analizy do realizacji bez doprecyzowania zakresu i dowodów pokrycia tej listy w UI/testach.
- [P2] Brakuje opisanej macierzy 50/50 smaczków i powiązanych scenariuszy demo/testów (np. które elementy są powiązane z copy dla laików, live indexingiem czy tooltipami), co utrudnia ocenę kompletności „serwisu 100%” i spełnienia kryteriów w `additional-contexts.md`.

## Strengths
- Surowe dane zawierają kompletną listę 50 smaczków, definicję „serwisu 100%”, docelowy skrót `Alt+Shift+M` oraz wymagania UX (proste tooltipy dla laików), co daje solidną bazę do rozpisania zasad planu.
- Sekcja „MODUL UI/UX” zawiera wymagane dane kont testowych (`/.env.test-accounts`, `ATK_BROWSER_*`), więc gate UI/browser jest formalnie spełniony.
- Krótki brief techniczny odnosi się do live indexingu, tooltipów, stabilności i testów (lint/test/agent-browser), utrzymując zgodność z gate’em `plan-v1`.

## Required Fixes Before ID-T=01 done
- Rozbić kroki ID-T=02...07 na konkretne kryteria: sprecyzować, które z 50 smaczków realizuje każda sekcja, dodać traceability do UI/testów (np. macierz status/demo dla każdego smaczka) i dopisać sposób weryfikacji (komponenty, dane, testy `make -C ut-angular lint/test`, manual `agent-browser`).
- Doprecyzować dodatkowo, jak „serwis 100%” ma być potwierdzony (np. checklisty demo/testy stabilności, brak błędów konsoli) i wskazać konkretne dowody w `tasks.md`/`additional-notes/`.
- Uzupełnić wpisy 02-07 o HANDOFF-y/odniesienia do future ID-T (jeśli będzie 08+ w kolejnych rundach) oraz zaplanować kolejny audyt (2 subagentów + Claude + Gemini) po naniesieniu powyższych poprawek przed przejściem do statusu `done`.
