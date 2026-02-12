Ledger Snapshot
Goal: Zweryfikować, czy plan ID-T=01 dla `20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux_planning` zawiera konkretne wymagania UX dla laików, tooltipy/a11y, live-indexing oraz testowalność demo 50 smaczków.
Now/Next: Re-audyt Subagent-2 (runda 20260212-2038) zakończył się FAIL; czekamy na doprecyzowanie copy, tooltipów i scenariusza live-indexingu przed kolejną rundą planu.
Open Questions: UNCONFIRMED – czy katalog `gui/` zostanie ostatecznie wygaszony na rzecz `ut-angular/`?

# Plan Audit Report - Subagent 2
Werdykt: FAIL
P0: 0
P1: 0
P2: 3

## Findings
- [P2] `ID-T=03` („UX copywriting dla poczatkujacych”) jest tylko placeholderem i nie zawiera żadnych wymagań, przykładów prostego języka czy check-listy zakazanych skrótów. Bez konkretów nie można ocenić ani przetestować, czy tooltipy/etykiety faktycznie spełniają cel „przyjemnego wprowadzenia dla laika”.
- [P2] `ID-T=06` („Tooltipy dla wszystkich funkcji/buttonow”) opisuje tylko zakres (hover/focus/touch) i brak pliku z definicją a11y oraz scenariuszy testowych. Nie ma wskazania, jak sprawdzimy role/aria-describedby, keyboard navigation czy dowody w `agent-browser`, więc testowalność i zgodność z wymaganiem a11y pozostają nieudokumentowane.
- [P2] `ID-T=05` („Live indexing i dokladanie dokumentow w locie”) nie zawiera scenariusza demo (krok po kroku, timing, dane wejściowe) ani powiązanych testów manualnych/automatycznych, które potwierdzą działanie funkcji bez restartu. Brak też odniesienia do testowalnych dowodów, że dodanie dokumentu aktualizuje wyniki na żywo dla prezentacji 30-minutowej.

## Strengths
- `additional-contexts.md` zachowuje kompletną listę 50 „smaczków”, definicję „serwisu 100%”, nowe skróty i wymagania live-indexingu/tooltipów, co dostarcza kontekstu dla kolejnych kroków planu.
- `tasks.md` wyodrębnia dedykowane ID-T dla macierzy 50 smaczków, copy dla laików, tooltipów, live-indexingu oraz testów manualnych/automatycznych, co ułatwia uporządkowanie prac po akceptacji planu.
- Wymóg testów manualnych `agent-browser` i referencje do `/.env.test-accounts` pozostają w planie jako wyraźne źródło dowodów dla demo.

## Required Fixes Before ID-T=01 done
- Rozwinąć `ID-T=03` o rzeczywiste wskazówki: przykłady tekstów w „prostym języku”, zestaw zakazanych terminów (np. „BM25”), oraz punkt „weryfikacja przez osobę nietechniczną laika” jako kryterium akceptacji.
- Rozbudować `ID-T=06` o konkretne kryteria a11y (role, aria-describedby, obsługa klawiatury/screen readerów) i scenariusze testowe (unit/e2e/agent-browser), aby można było zweryfikować tooltipy w sposób powtarzalny.
- Dopisać do `ID-T=05` szczegółowy scenariusz live-indexingu (krok po kroku, dane przykładowe, timing, punkt w demo dla 30 minut) oraz powiązane dowody/testy (manualne w agent-browser + ewentualne testy komponentowe), tak by można było sprawdzić „serwis 100%” i ewentualnie zautomatyzować weryfikację wyników.
