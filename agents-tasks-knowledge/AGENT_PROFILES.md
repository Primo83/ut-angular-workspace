# Profile agentów (AGENT_ID + meta subagentów)

Ten plik definiuje profile agentów technicznych i biznesowych używane przy wyborze roli na początku sesji (`AGENT_ID`).

| Nr | AGENT_ID | agent_type | Name | Domyślny katalog        | Typ repo | Opis / description (kiedy delegować) | Tools | DisallowedTools | Model | PermissionMode | Skills | Hooks |
|----|----------|------------|------|-------------------------|----------|---------------------------------------|-------|-----------------|-------|----------------|--------|-------|
| 1 | ba | orchestrator | ba | agents-tasks-knowledge | meta | Analityk / właściciel planu (BA) | inherit |  | inherit | default |  |  |
| 2 | gui-1 | worker | gui-1 | gui | frontend | Agent frontendowy | inherit |  | gpt-5.2-codex | default |  |  |

Zasady:

- Kolumna `Nr` służy tylko do prezentacji listy wyboru (1, 2, 3...) – nie jest identyfikatorem technicznym.
- `AGENT_ID` to identyfikator używany:
    - w kolumnie `Agent` w `tasks.md`,
    - w nazwach plików `SESSION_<AGENT_ID>.md`,
    - w nagłówku `[AGENT_ID: ...]` w rozmowie.
- `agent_type` opisuje **rolę subagenta** (`default` / `orchestrator` / `worker`) i jest **wyłącznie opisowe** (bez walidacji):
    - `default` dziedziczy konfigurację rodzica,
    - `orchestrator` ma inne bazowe instrukcje,
    - `worker` ma stały model `gpt-5.2-codex` i własne instrukcje.
  Typowe mapowanie: `ba` = `orchestrator`, profile repo/komponentów = `worker`.
- `name` jest osobną kolumną (wymagane opisowo); domyślnie w wizardzie `name = id`.
- `Domyślny katalog` jest informacją pomocniczą przy komunikacji (np. podpowiedź „ten agent pracuje głównie w /”).
- `type` opisuje **typ komponentu/repo** (np. `backend`, `frontend`, `repo`) i nie jest tym samym co `agent_type`.
- `description` jest wymagane opisowo („kiedy delegować”); brak walidacji wartości w narzędziach.
- `tools`, `disallowedTools`, `skills`, `hooks` są opcjonalne (brak walidacji wartości).
- `model`: dowolny model (np. `gpt-5.2-codex`) lub `inherit` (opisowo).
- `permissionMode`: `default` / `acceptEdits` / `dontAsk` / `bypassPermissions` / `plan` (opisowo).
- Możesz dodawać kolejne profile (`qa-1`, `data-1` itd.), ważne jest zachowanie unikalności `AGENT_ID`.
- Jeżeli nowy profil `AGENT_ID` ma pracować z `agents-tasks-knowledge/tasks/`, rozważ utworzenie
  pliku `agents-tasks-knowledge/SESSION_<AGENT_ID>.md` (według formatu z `AGENTS.md`), żeby agent
  mógł wznawiać pracę między sesjami bez zgadywania kontekstu.