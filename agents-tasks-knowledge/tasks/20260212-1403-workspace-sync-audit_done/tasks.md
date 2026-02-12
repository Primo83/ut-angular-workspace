# Plan zadań 20260212-1403-workspace-sync-audit_in-progress – sync-audit instrukcji po sync

Ten plan powstał automatycznie po `render.py --mode sync`, gdy wykryto różnice w instrukcjach `origin-*`.
Materiały:
- `additional-contexts.md` – metoda audytu + notatki/ryzyka
- `additional-notes/question-bank.md` – bank pytań (używaj tylko gdy nie da się wywnioskować)

> Jeśli to pierwszy raz z tym workflow: zajrzyj też do `agents-tasks-knowledge/tasks/AGENTS.md`.

---

| ID-T | Status   | Agent | Rodzic | Zadanie | Opis | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory |
|------|----------|-------|--------|---------|------|------------------|------------------|--------------------------|
| 01 | done | gui-1 |  | Sync-audit: potwierdź zakres zmian i plan audytu | Sprawdź listę subtasków „Audyt instrukcji” poniżej, potwierdź zakres i priorytety. Jeśli lista jest niepełna, dodaj brakujące wpisy. | 2026-02-12 14:03 | 2026-02-12 14:23 | Start: celem jest szybkie potwierdzenie/naprawa zmian w instrukcjach. |
| 02 | done |  |  | Audyt instrukcji: wykonaj subtaski | Zrealizuj wszystkie subtaski audytu i popraw instrukcje w miejscu. Auto-merge stosuj tylko wg reguł z `additional-contexts.md`; przy kolizji przygotuj plik konfliktu i zapytaj użytkownika. | 2026-02-12 14:03 | 2026-02-12 14:22 | <!-- AUTO-INSERT: instructions-tasks --> |
| 06 | done |  | 02 | Audyt instrukcji: `AGENTS.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 07 | done |  | 02 | Audyt instrukcji: `CLAUDE.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 08 | done |  | 02 | Audyt instrukcji: `GEMINI.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 09 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/AGENTS.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 10 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/CLAUDE.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 11 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/GEMINI.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 12 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/tasks/AGENTS.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 13 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/tasks/CLAUDE.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 14 | done |  | 02 | Audyt instrukcji: `agents-tasks-knowledge/tasks/GEMINI.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 15 | done |  | 02 | Audyt instrukcji: `ut-angular/AGENTS.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 16 | done |  | 02 | Audyt instrukcji: `ut-angular/CLAUDE.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 17 | done |  | 02 | Audyt instrukcji: `ut-angular/GEMINI.md` | Sprawdź spójność ścieżek/komend/przykładów/linków z repo; popraw instrukcję w miejscu. Patrz: additional-contexts.md -> Metoda pracy (audyt instrukcji). | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 03 | done |  |  | Notatki i ryzyka | Jeśli coś jest niejasne lub ryzykowne, zapisz to w `additional-notes/<ID-T>.md` lub sekcji notatek w `additional-contexts.md`. | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 04 | done |  |  | Sync + doctor (jeśli były zmiany) | Po zmianach w instrukcjach uruchom sync i `doctor.py` (jeśli to dotyczy), upewnij się że jest „green”. Komendy: `python3 /home/primo/projects/pgmpi/agents-templates-workspace/agents-templates/framework/render.py /home/primo/projects/ut-angular-workspace/project.yaml /home/primo/projects/ut-angular-workspace --mode sync` oraz `python3 /home/primo/projects/pgmpi/agents-templates-workspace/agents-templates/framework/doctor.py /home/primo/projects/ut-angular-workspace`. | 2026-02-12 14:03 | 2026-02-12 14:22 |  |
| 05 | done |  |  | Quality gate: statusy i zamknięcie audytu | Uzupełnij statusy w `tasks.md`, upewnij się że wszystkie subtaski audytu są `done`. | 2026-02-12 14:03 | 2026-02-12 14:22 |  |

**Zasada sync-audit:** subtaski audytu są wstawiane automatycznie bezpośrednio pod ID-T=02 i mają `Rodzic=02`. Nie usuwaj markera AUTO-INSERT.

---

## Checklista przed zamknięciem ID-T=01
- [ ] Potwierdzono listę subtasków audytu (brak brakujących wpisów).
- [ ] „Metoda pracy (audyt instrukcji)” została przeczytana i stosowana.
- [ ] Zdefiniowano, kto wykonuje audyt i w jakiej kolejności.
