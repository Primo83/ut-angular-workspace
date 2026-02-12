# example1-task_done – kontekst zadania (raporty projektowe)

## 1. Surowe dane / materiały wejściowe

- Ticket OPS-142: brak filtra zakresu dat w raportach projektowych, potrzeba statusu archiwum.
- PM prosi o gotowe raporty przed zamknięciem miesiąca (deadline 2025-11-10).

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)

- Finanse muszą generować raporty za dowolny okres bez ręcznego eksportu.
- Archiwum raportów redukuje obciążenie produkcji i porządkuje listę wyników.

## 3. Co ma się zmienić dla użytkownika / biznesu?

### 3.1 Użytkownicy / role

- Kierownik projektu, kontroler finansowy.

### 3.2 Scenariusze biznesowe / przypadki użycia

- Happy path: użytkownik wybiera projekt, zakres dat i pobiera raport PDF/CSV.
- Edge: brak danych w okresie → komunikat „Brak raportów w wybranym okresie”.

### 3.3 Zasady biznesowe

- Statusy: `draft`, `ready`, `archived`; archiwum nie pozwala na edycję.

### 3.4 Dane i wynik

- Wejście: `projectId`, `dateRange` (od/do).
- Wynik: lista raportów z polami `status`, `createdAt`, `totalHours`.

### 3.5 Kryteria akceptacji (biznesowe)

- [x] Filtrowanie po zakresie dat.
- [x] Widoczne statusy `draft/ready/archived`.
- [x] Eksport do CSV respektuje filtr.

## 4. Źródło zadania i interesariusze

- Źródło: OPS-142 + spotkanie z finansami.
- Właściciel zadania: `ba` (Kasia).
- Interesariusze: PM projektów, dział finansów.

## 5. Ograniczenia i zakres

### 5.1 Ograniczenia

- Termin: 2025-11-10.
- Nie zmieniamy schematu uprawnień.

### 5.2 Zakres in / out

- **W zakresie**: filtr dat, status archiwum, GUI listy.
- **Poza zakresem**: nowe formaty eksportu.

### 5.3 Założenia i ryzyka (opcjonalne)

- Założenie: API ma już paginację.
- Ryzyko: długi czas generowania raportów przy dużych zakresach.

## 6. Otwarte pytania (dla Agenta i właściciela)

- [x] Czy archiwalne raporty mają być dostępne do pobrania? (tak, tylko do odczytu)
- [x] Czy CSV ma zawierać dane o fakturowaniu? (nie, wyłącznie dane czasu pracy)

## 7. Ustalenia z rozmów (podsumowanie Q&A)

- 2025-11-01 – potwierdzono status `archived` i obowiązkowy filtr dat.

## 8. Notatka dla `tasks.md` (brief do planu technicznego)

- Backend (`api-1`): parametr `dateRange`, status `archived`, kontrakt `GET /reports`.
- GUI (`gui-1`): filtr zakresu dat, badge statusów, zgodność z kontraktem 02-01.
- Testy: regresja e2e na liście raportów + kontraktowy test `GET /reports`.

## 9. Jak poznamy, że zadanie odniosło sukces? (KPI / miary) – opcjonalne

- Generowanie raportu w < 2s dla zakresu 3 miesięcy.
- Brak zgłoszeń o brakującym filtrze dat w ciągu 2 sprintów.
