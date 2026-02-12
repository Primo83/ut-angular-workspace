# Plan Audit Report - Claude
Werdykt: FAIL
P0: 0
P1: 2
P2: 2
## Findings
- [P1] `ID-T=02` („Macierz pokrycia 50 smaczków”) w `tasks.md` istnieje tylko jako opis zamiaru; nie ma tabeli 50/50, statusów, ani wskazanych dowodów/testów, więc nie można zweryfikować, kiedy zestaw „smaczków” spełnia kryterium zaakceptowania 100% prezentacji.
- [P1] `ID-T=07` („Stabilność i definicja ‘100%’”) nie zawiera mierzalnych kroków (lista scenariuszy demo, `make -C ut-angular lint/test`, kontrola `console.error`), zatem bramka nie ma dowodu, że „serwis 100%” jest sprawdzony przed zamknięciem ID-T=01.
- [P2] Plan nie mapuje 50 smaczków z listy w `additional-contexts.md` na konkretne elementy UI i powiązane dowody (copy dla laików, testy manualne/automatyczne, sekcje tooltipów), co utrudnia wykazanie traceability i zagrożone jest pominięciem punktów w prezentacji.
- [P2] `ID-T=05` i `ID-T=06` omawiają live indexing i tooltipy, ale brak szczegółowych scenariuszy (dodanie dokumentu w locie, krok po kroku w `agent-browser`) oraz brak planu testów a11y/klawiaturowych/dotykowych dla tooltipów, więc nie sposób potwierdzić, że UI spełnia wymagania demo i dostępności.

## Strengths
- `additional-contexts.md` zawiera kompletną listę 50 smaczków, definicję „serwisu 100%”, docelowy skrót `Alt+Shift+M` oraz dane `/.env.test-accounts`, co daje solidną bazę dla dalszego planowania i testów manualnych.
- `tasks.md` już rozbija prace na kroki 02‑09 obejmujące macierz smaczków, copy dla laików, live indexing, tooltipy, testy i audyty, więc struktura jest przygotowana na dopisanie miar i dowodów.
## Required Fixes Before ID-T=01 done
- Rozbudować `ID-T=02` o konkretną macierz (np. kolumny `#`, `Smaczek`, `Sekcja UI`, `Akcja demo`, `Status`, `Dowód testu`) i przypisać dla każdego elementu konkretny test/manualny scenariusz, by móc udowodnić 50/50 coverage.
- Uzupełnić `ID-T=07` o checklistę „100%” z konkretnymi krokami (`lint`, `test`, `agent-browser`, obserwacja `console.error`, stabilne flow prezentacji) i przypisać dowody do `additional-notes`, dzięki czemu gate ma mierzalne kryteria dla zamknięcia ID-T=01.
- W `ID-T=05` opisać scenariusz live indexingu (kroki w demo, dane, oczekiwane odświeżenie wyników) i powiązać go z konkretnym testem/manualnym dowodem, a w `ID-T=06` dodać listę testów tooltipów (keyboard focus order, touch fallback, aria-describedby/screen reader) wraz z linkami do dowodów, żeby cały UX/tooltip był weryfikowalny.
