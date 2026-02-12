Ledger Snapshot
- Goal: Zweryfikować audyt rundy `20260212-2047` dla taska `20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux_planning`, koncentrując się na definicji „serwis 100%”, traceability 50/50 oraz workflow ID-T=03/05/06.
- Now/Next: Now – ID-T=01 pozostaje w `planning`, dokumentacja 02/03/05/06/07 nie zawiera jeszcze statusów/dowodów pozwalających ocenić gotowość; Next – po uzupełnieniu macierzy 50 smaczków (statusy + dowody testowe), precyzyjnym opisaniu workflow UX i zmapowaniu dowodów 100% można wykonać kolejną rundę audytów planu (2 subagentów + Claude + Gemini).
- Open Questions: UNCONFIRMED Czy dopracowanie opisanych dokumentów umożliwi uruchomienie kolejnej rundy audytowej i przesunięcie ID-T=01 na `done`?

# Plan Audit Report - Gemini
Werdykt: FAIL
P0: 0
P1: 0
P2: 3
## Findings
- [P2] `additional-notes/07-definition-of-100.md` definiuje „100%” jako checklistę, ale brak tam planu dowodów (np. które testy i logi weryfikują brak `console.error`, jak mierzyć 30-minutowy scenariusz demo czy live indexing). Bez konkretnej mapy dowodów/testów nie da się stwierdzić, kiedy 100% jest osiągnięte ani powiązać tego wymogu z innymi ID-T.
- [P2] `additional-notes/02-macierz-50-smaczkow.md` wymienia 50 smaczków i ogólne akcje/testy, ale nie zawiera kolumny `Status`/`Evidence` ani powiązania z konkretnymi krokami w `additional-notes/08-tests.md` lub manualem. Tabela w obecnej formie nie pozwala śledzić pokrycia 50/50 ani ustalić kolejnych kroków, co blokuje przejście od planowania do implementacji.
- [P2] Workflow UX (ID-T=03 copy dla laików, 05 live indexing, 06 tooltipy) w `additional-notes/03-copy-guide.md`, `05-live-indexing.md`, `06-tooltips-a11y.md` zawiera tylko ogólne zasady/checklisty, brakuje planu krok po kroku, mapowania na elementy/komponenty oraz dokładnych kryteriów testowych. Bez tych szczegółów nie można zaplanować prac implementacyjnych/testowych i zamknąć ID-T=01.
## Strengths
- Surowe dane i „50 smaczków” w `additional-contexts.md` pozostają kompletne, co pomaga utrzymać kontekst biznesowy podczas kolejnych rund audytów.
- `tasks.md` rozbija prace na dedykowane ID-T (macierz 50, copy, live indexing, tooltipy, definicja „100%”, testy manualne/automatyczne), co ujawnia strukturę workflow i miejsca na dowody w `additional-notes/`.
## Required Fixes Before ID-T=01 done
- Rozszerzyć `additional-notes/07-definition-of-100.md` o konkretne dowody/testy dla każdego punktu (np. odniesienia do `make -C ut-angular lint/test`, monitorowania `console.error`, scenariusza Demo 30 min z określonymi warunkami). Powiązać checklistę z konkretnymi ID-T (08/09) lub dowolnymi testami, aby można było walidować „100%”.
- Rozbudować `additional-notes/02-macierz-50-smaczkow.md` o kolumny `Status` (np. `mapped`, `in progress`, `blocked`) oraz szczegółowe `Dowody testu` z odwołaniami do konkretnych testów/manuali (np. `additional-notes/08-tests.md` + `09-manual.md`), aby jasno śledzić, które smaczki są pokryte i które są jeszcze do wykonania.
- Uzupełnić workflow ID-T=03/05/06 o szczegółowe scenariusze wykonania: wskazać konkretne elementy (tooltipy dla `search controls`, `add document`, `live indexing panel` itd.), dane wejściowe i oczekiwane warunki live-indexingu oraz listę tooltipów w języku dla laików wraz z macierzą testów keyboard/mobile, żeby implementujący i testerzy wiedzieli, co dokładnie zrobić i jakie dowody zebrać.
