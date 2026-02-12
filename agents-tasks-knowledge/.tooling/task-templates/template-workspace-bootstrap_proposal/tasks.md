# Plan zadań <ID-Z>_proposal – bootstrap workspace

Ten plan ma zrobić z tego workspace **przewidywalne środowisko dla agentów**.  
Materiały:
- `additional-contexts.md` – runbook + decyzje + blokery
- `additional-notes/question-bank.md` – bank pytań (używaj tylko gdy czegoś nie da się wywnioskować)

> Jeśli to pierwszy raz z tym workflow: zajrzyj też do `agents-tasks-knowledge/tasks/AGENTS.md`.

---

| ID-T | Status   | Agent | Rodzic | Zadanie | Opis | Utworzono        | Zaktualizowano   | Co zrobiono do tej pory |
|------|----------|-------|--------|---------|------|------------------|------------------|--------------------------|
| 01   | planning | ba    |        | Bootstrap: potwierdź snapshot + zrób minimalny runbook + plan | Wypełnij `additional-contexts.md`: sekcje 0–6 (bez lania wody). Najpierw wywnioskuj z `project.yaml`/repo, dopiero potem pytaj. Pytania tylko blokujące/wysokiego ryzyka, reszta do `question-bank.md`. Zapisz decyzje w sekcji 7 i rozpisz realistyczny plan w kolejnych ID-T. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM | Start: celem jest szybkie dopięcie konfiguracji i zasad pracy agentowej dla tego projektu. |
| 02   | to-do    |       |        | Komendy (dev/build/test/lint): AUTO → weryfikacja → zapis | Nie przepisuj z głowy. Weź AUTO-INSERT + `project.yaml`, zweryfikuj w repo (Makefile/package.json/composer.json), oznacz rzeczy destrukcyjne, dopisz braki. Wynik: zaktualizowane sekcje 3–4 w `additional-contexts.md` + ewentualna korekta `project.yaml` (jeśli był rozjazd). | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 03   | to-do    |       |        | Tooling i MCP: minimalny zestaw + zasady dostępu          | Weź AUTO-INSERT + realia projektu. Zdefiniuj minimalny zestaw (DB/browser/devtools), ograniczenia (VPN/proxy/środowiska) i “bezpieczne zasady”. Wynik: zaktualizowana sekcja 5 w `additional-contexts.md` + (jeśli dotyczy) wpisane wymagania/nazwy serwerów MCP. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 04   | to-do    |       |        | Mapa repo i komponentów: potwierdź granice i “happy path” | Nie pytaj “czy to mono/multi” jeśli AUTO-INSERT już to sugeruje — potwierdź albo popraw. Wynik: dopracowana sekcja 2 w `additional-contexts.md` (komponenty, katalogi, granice) + decyzje w sekcji 7. Jeśli wykrycie komponentów było błędne → popraw `project.yaml`. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM |  |
| 05   | to-do    |       |        | Quality gate: sync + `doctor` + porządek w workspace      | Wykonaj finalny sync (render) i uruchom `doctor` aż będzie “green”. Usuń/archiwizuj tylko to, co faktycznie jest śmieciem w tym projekcie (nie kasuj template’ów referencyjnych bez powodu). Wynik: brak błędów `doctor` + uzupełnione `SESSION*.md` + statusy w `tasks.md` aktualne. | YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM | <!-- AUTO-INSERT: instructions-tasks --> |

**Zasada bootstrapu:** 02–04 nie służą do “wymyślania od nowa”, tylko do potwierdzenia i korekty tego, co jest w `project.yaml` i w AUTO-INSERT. Jeśli coś jest pewne → oznacz jako potwierdzone i zamknij task bez dopytywania.

---

## Checklista przed zamknięciem ID-T=01
- [ ] Sekcja 0 (snapshot) przeczytana i potwierdzona; błędy poprawione w `project.yaml`.
- [ ] W `additional-contexts.md` jest:
    - [ ] DoD (sekcja 1),
    - [ ] zasady bezpieczeństwa + klasyfikacja komend (sekcja 2),
    - [ ] layout repo (sekcja 3),
    - [ ] minimalny happy path (sekcja 4),
    - [ ] MCP/dostępy (sekcja 5),
    - [ ] tylko realne blokery (sekcja 6).
- [ ] Zadane pytania są minimalne (reszta została w banku pytań).
- [ ] Rozpisano plan w tasks.md (kolejne ID-T mają sens i mają właścicieli/agentów).
