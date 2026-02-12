# example2-task_in-progress – kontekst zadania (widget dostępności zespołu)

## 1. Surowe dane / materiały wejściowe

- Ticket OPS-198: support prosi o wizualizację dostępności zespołów w tygodniu, bazując na kalendarzu projektowym.
- Zgłoszenia na czacie: brak jasnej informacji, kiedy członkowie zespołu są częściowo dostępni.

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)

- PM i support chcą szybciej planować dyżury i spotkania.
- Brak widoku dostępności powoduje rezerwacje osób na urlopach.

## 3. Co ma się zmienić dla użytkownika / biznesu?

### 3.1 Użytkownicy / role

- PM, support, liderzy zespołów.

### 3.2 Scenariusze biznesowe / przypadki użycia

- Happy path: PM wybiera zespół i tydzień, widzi statusy dostępności w siatce godzinowej, klika dzień aby zobaczyć szczegóły.
- Edge: brak wpisów w kalendarzu → cała kolumna jest oznaczona jako „off”.

### 3.3 Zasady biznesowe

- Statusy: `available`, `partial`, `off`; `partial` wymaga podania godzin.
- Dane źródłowe pochodzą z kalendarza projektowego; brak ręcznego nadpisywania w GUI.

### 3.4 Dane i wynik

- Wejście: `teamId`, `week` (ISO week), dane z kalendarza per osoba.
- Wynik: sloty godzinowe z `status` + `hours` dla `partial`.

### 3.5 Kryteria akceptacji (biznesowe)

- [ ] Widok tygodnia pokazuje status na poziomie dnia (GUI).
- [ ] API zwraca komplet slotów godzinowych dla wybranego tygodnia.
- [ ] Tooltip pokazuje godziny dla `partial`.

## 4. Źródło zadania i interesariusze

- Źródło: OPS-198 + zgłoszenia supportu.
- Właściciel zadania: `ba` (Kasia).
- Interesariusze: liderzy zespołów, PM.

## 5. Ograniczenia i zakres

### 5.1 Ograniczenia

- Termin dema: 2025-11-28.
- Brak zmian w kalendarzu projektowym – tylko odczyt danych.

### 5.2 Zakres in / out

- **W zakresie**: odczyt dostępności, widget tygodnia, tooltipy.
- **Poza zakresem**: edycja kalendarza, powiadomienia.

### 5.3 Założenia i ryzyka (opcjonalne)

- Założenie: endpoint kalendarza zwraca komplet zdarzeń na tydzień.
- Ryzyko: niejednolite dane w kalendarzu mogą wymagać fallbacku „off”.

## 6. Otwarte pytania (dla Agenta i właściciela)

- [x] Czy `partial` ma oznaczać 4h czy dowolny zakres? (dowolny zakres, zwracamy godziny)
- [ ] Czy pokazujemy różne strefy czasowe? (do decyzji PM)

## 7. Ustalenia z rozmów (podsumowanie Q&A)

- 2025-11-14 – statusy dostępności ograniczone do `available/partial/off`.

## 8. Notatka dla `tasks.md` (brief do planu technicznego)

- Backend (`api-1`): kontrakt `GET /availability?teamId=&week=`, statusy `available/partial/off`, sloty godzinowe dla `partial`.
- GUI (`gui-1`): siatka tygodnia, badge statusów, tooltip z godzinami.
- Testy: kontraktowy test `GET /availability`, e2e dla widgetu tygodnia.

## 9. Jak poznamy, że zadanie odniosło sukces? (KPI / miary) – opcjonalne

- PM tworzy plan dyżurów w < 5 min z nowym widgetem.
- Zero zgłoszeń supportu o podwójnych rezerwacjach w ciągu 2 tygodni po wdrożeniu.
