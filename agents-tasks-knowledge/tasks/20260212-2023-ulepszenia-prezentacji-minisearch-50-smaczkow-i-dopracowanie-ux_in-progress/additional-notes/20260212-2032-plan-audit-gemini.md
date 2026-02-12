Ledger Snapshot: Goal: dopracować `/minisearch` tak, by pokazywał 50 smaczków, live indexing, tooltipy i niekolidujący skrót, a audyt planu ID-T=01 przed startem implementacji; Now: Gemini audyt runda 20260212-2032 zakończony FAIL z potrzebą doprecyzowania kroków 02-07; Next: czekamy na decyzje właściciela po uzupełnieniu planu; Open Questions: UNCONFIRMED Czy katalog `gui/` ma być usunięty/porzucony na rzecz `ut-angular/`?

# Plan Audit Report - Gemini
Werdykt: FAIL
P0: 0
P1: 2
P2: 1
## Findings
- [P1] `ID-T=02` (macierz 50 smaczków) nie ma jeszcze żadnych mierzalnych kryteriów „done” – tabelka pokrycia nie istnieje, więc nie wiadomo, kiedy punkt można uznać za ukończony i jak przekłada się to na „serwis 100%”. Bez tej metodyki nie można udowodnić realizacji checklisty 50/50 i ryzykuje się uznaniem „serwisu 100%” mimo brakującej funkcji.
- [P1] `ID-T=07` („Stabilność i definicja 100%”) opisuje potrzebę dopięcia edge-case’ów i braku błędów, ale brak tam konkretnych kontroli (np. lista scenariuszy demo, kroki manualne, konsolowe wskaźniki, automatyczne testy potwierdzające brak `console.error`). W praktyce nie ma bramek, które mogłyby zostać sprawdzone przed zamknięciem ID-T=01, więc audyt nie ma dowodu, że „serwis 100%” jest rzeczywiście sprawdzony.
- [P2] `ID-T=06` wspomina tooltipy „hover/focus/touch”, ale nie rozbudowuje przypadków dla focus order/klawiatury, mobile (dotyk) oraz screen readerów. Brakuje planu na testy keyboard-only i na to, co się stanie przy dotyku, co może powodować regressy w dostępności nawet gdy tooltipy są renderowane.

## Strengths
- Lista 50 smaczków w `additional-contexts.md` oraz wczesne zadania `ID-T=02-09` kierują plan od razu w obsługę pełnego zestawu funkcji, tooltipów, live indexingu i testów manual/automatycznych.
- Kryteria „serwis w 100%”, nowy skrót `Alt+Shift+M` i copy dla laików zostały skonsolidowane w `additional-contexts.md`, co daje kontekst biznesowy dla każdego kroku UI/UX.
- Sekcja 9 w planie i wymóg audytów (2 subagenci + Claude + Gemini) zapewniają, że po poprawkach będzie wykonany pełny przegląd przed ustawieniem ID-T=01 na `done`.

## Required Fixes Before ID-T=01 done
- Do `ID-T=02` dopisać macierz 50 punktów z konkretnymi statusami (gotowe/demo-only/wyjaśnione), kryteriami „done” i sposobem weryfikacji (np. który tooltip/pole/copy reprezentuje dany smaczek), tak by można było zmierzyć osiągnięcie 100% pokrycia.
- Rozwinąć `ID-T=07` o konkretną checklistę „100%”, obejmującą scenariusze demo, `make -C ut-angular lint`/`test`, manualne `agent-browser` + brak `console.error`, oraz kryteria walidacyjne (dowód w `additional-notes/`), żeby audyt mógł potwierdzić, że usługa jest naprawdę „100%”.
- Uzupełnić `ID-T=06` o opis edge-case’ów dostępności: focus order, keyboard shortcut tooltipów/screen reader support, dotyk mobilny, fallbacky (np. skrót w UI), z przypisanymi testami manualnymi i automatycznymi przed zamknięciem planu.
