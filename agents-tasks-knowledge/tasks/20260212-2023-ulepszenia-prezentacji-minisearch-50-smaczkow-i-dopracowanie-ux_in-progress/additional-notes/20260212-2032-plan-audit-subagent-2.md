Ledger Snapshot
- Goal: Dopracować plan ID-T=01 dla taska `20260212-2023-ulepszenia-prezentacji-minisearch-50-smaczkow-i-dopracowanie-ux_planning`, tak by w dokumentacji planu w pełni uwzględniał UX/copy dla laika, a11y, demo-flow 30 min, testowalność tooltipów i live-indexing, zanim startują kolejne ID-T.
- Now/Next: Now – raport audytu planu (subagent 2) przygotowany z perspektywy wskazanych obszarów; Next – właściciel planu naniesie poprawki (copy, tooltipy, live-indexing, scenariusz demo) i uruchomi kolejne audyty, doprowadzając ID-T=01 do stanu `done`.
- Open Questions: UNCONFIRMED – czy katalog `gui/` zostanie docelowo usunięty/porzucony na rzecz `ut-angular/` (wciąż niepotwierdzone).

# Plan Audit Report - Subagent 2
Werdykt: PASS  
P0: 0  
P1: 0  
P2: 3  

## Findings
- [P2] Sekcja „UX copywriting dla poczatkujacych” (ID-T=03) nie zawiera mierzalnych kryteriów „prostego języka” (np. przykładowego słownictwa, zatwierdzenia przez osobę nietechniczną ani listy zakazanych skrótów). Ryzykuje to powstaniem tekstów zbyt technicznych mimo zadeklarowanego celu „przyjemnego wprowadzenia dla laika”.
- [P2] Plan tooltipów (ID-T=06) wspomina o tooltipie dla hover/focus/touch, ale brak jest scenariuszy testowych (automatycznych lub manualnych) oraz wskazówek a11y (np. role, aria-describedby, obsługa klawiatury/screen readerów). Bez tego nie da się zweryfikować testowalności i zgodności z potrzebami użytkowników z ograniczeniami.
- [P2] Opis live-indexingu (ID-T=05) nie określa, jak zostanie udokumentowany 30-minutowy flow demo (`G3`) ani jakie dane/narzędzia potwierdzą, że dodanie dokumentu w locie aktualizuje widok bez restartu. Brakuje konkretnego scenariusza (krok po kroku) i związanych testów manualnych/automatycznych.

## Strengths
- `additional-contexts.md` zawiera kompletną listę 50 „smaczków”, cele demo i biznesowe kryteria „serwisu w 100%”, co pozwala dobrze uzasadnić kolejne ID-T (macierz, tooltipy, live-indexing).
- Plan zawiera dedykowane kroki dla UX copy, tooltipów, live-indexingu, testów i audytów, więc hierarchia prac jest czytelna i łatwo ustawić kolejne działania po akceptacji ID-T=01.
- Wymóg ręcznego testowania w `agent-browser` oraz referencje do `/.env.test-accounts` zapewniają punkt wyjścia do weryfikacji demo na rzeczywistym środowisku.

## Required Fixes Before ID-T=01 done
- Doprecyzować, jak „copy dla laika” będzie oceniane (np. przykładowe teksty, przegląd przez osobę nietechniczną, zakaz termów typu „BM25” bez wyjaśnienia). Dodaj w planie kryterium „proste zdanie + analogia” i punkt „weryfikacja przez laika”.
- Rozbudować punkt tooltipów o konkretne testy/audyty (np. sprawdzenie obecności `aria-describedby`, test keyboard navigation, potwierdzenie w `agent-browser` lub unit/testy e2e) oraz opisać, jak zachować a11y (role, focus trap) bez psucia UX.
- Dopisać scenariusz demo-live-indexingu (krok po kroku, czas trwania, momenty zachowania 30-minutowego flow) i powiązać go z testami/lintami, aby móc potwierdzić, że dodawanie dokumentu w locie aktualizuje wyniki w planie i manualnych testach.
