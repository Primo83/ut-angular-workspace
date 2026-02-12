# Plan zadań <ID-Z>_in-progress – sync-audit instrukcji po sync

Ten plan powstał automatycznie po `render.py --mode sync`, gdy wykryto różnice w instrukcjach `origin-*`.
Materiały:
- `additional-contexts.md` – metoda audytu + notatki/ryzyka
- `additional-notes/question-bank.md` – bank pytań (używaj tylko gdy nie da się wywnioskować)

> Jeśli to pierwszy raz z tym workflow: zajrzyj też do `agents-tasks-knowledge/tasks/AGENTS.md`.

---

| ID-T | Status   | Agent | Rodzic | Zadanie | Opis | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory |
|------|----------|-------|--------|---------|------|------------------|------------------|--------------------------|
| 01   | in-progress | ba    |        | Sync-audit: potwierdź zakres zmian i plan audytu | Sprawdź listę subtasków „Audyt instrukcji” poniżej, potwierdź zakres i priorytety. Jeśli lista jest niepełna, dodaj brakujące wpisy. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM | Start: celem jest szybkie potwierdzenie/naprawa zmian w instrukcjach. |
| 02   | to-do    |       |        | Audyt instrukcji: wykonaj subtaski                 | Zrealizuj wszystkie subtaski audytu i popraw instrukcje w miejscu. Auto-merge stosuj tylko wg reguł z `additional-contexts.md`; przy kolizji przygotuj plik konfliktu i zapytaj użytkownika. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM | <!-- AUTO-INSERT: instructions-tasks --> |
| 03   | to-do    |       |        | Notatki i ryzyka                                   | Jeśli coś jest niejasne lub ryzykowne, zapisz to w `additional-notes/<ID-T>.md` lub sekcji notatek w `additional-contexts.md`. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 04   | to-do    |       |        | Sync + doctor (jeśli były zmiany)                  | Po zmianach w instrukcjach uruchom sync i `doctor.py` (jeśli to dotyczy), upewnij się że jest „green”. Komendy: `<SYNC_COMMAND>` oraz `<DOCTOR_COMMAND>`. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 05   | to-do    |       |        | Quality gate: statusy i zamknięcie audytu          | Uzupełnij statusy w `tasks.md`, upewnij się że wszystkie subtaski audytu są `done`. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |

**Zasada sync-audit:** subtaski audytu są wstawiane automatycznie bezpośrednio pod ID-T=02 i mają `Rodzic=02`. Nie usuwaj markera AUTO-INSERT.

---

## Checklista przed zamknięciem ID-T=01
- [ ] Potwierdzono listę subtasków audytu (brak brakujących wpisów).
- [ ] „Metoda pracy (audyt instrukcji)” została przeczytana i stosowana.
- [ ] Zdefiniowano, kto wykonuje audyt i w jakiej kolejności.
