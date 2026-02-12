# Plan zadań <ID-Z>_proposal – sync-audit configów po sync

Ten plan powstał automatycznie po uruchomieniu synchronizatora configów, gdy wykryto różnice między `origin-*` i `old-origin-*`.
Materiały:
- `additional-contexts.md` – lista różnic i ścieżek
- `additional-notes/` – notatki uzupełniające (opcjonalnie)

| ID-T | Status   | Agent | Rodzic | Zadanie | Opis | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory |
|------|----------|-------|--------|---------|------|------------------|------------------|--------------------------|
| 01   | planning | ba    |        | Potwierdź zakres różnic i decyzje | Sprawdź listę różnic w `additional-contexts.md`, zdecyduj o dalszych krokach (aktualizacja user file / akceptacja / odroczenie). | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM | Start: wykryto różnice w configach po sync. |
| 02   | to-do    |       |        | Reconcylacja configów | Wprowadź decyzje dotyczące configów (np. ręczna aktualizacja user file, akceptacja zmian). | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 03   | to-do    |       |        | Zamknięcie i dokumentacja | Uzupełnij statusy w `tasks.md`, dopisz notatki (jeśli potrzebne) i zamknij task. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |

---

## Checklista przed zamknięciem ID-T=01
- [ ] Sprawdzono listę różnic i ścieżki plików.
- [ ] Ustalono, czy różnice dotyczą user file czy tylko origin.
- [ ] Ustalono priorytet i właściciela decyzji.
