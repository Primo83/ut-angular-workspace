# Plan audit (subagent: codex) - 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal

## Zakres
- Oceniono: `additional-contexts.md`, `tasks.md` oraz stan plików audytów w `additional-notes/` (na 2026-02-12 15:21 CET).
- Cel audytu: wykryć sprzeczności/braki/ryzyka tak, aby plan był wykonalny i spełniał CA (Docker-only, port `4299`, UID/GID, volumes, `ng serve --host 0.0.0.0`, testy w kontenerze, toggle polling).

## Werdykt
- **FAIL** (plan nie jest jeszcze „decision-complete” wg bramki z `ut-angular/AGENTS.md`).

## P0 (blokery bramki decision-complete)
- `tasks.md`: `ID-T=01` ma nadal `Status = planning` (wymóg bramki: `done`).
- `additional-notes/20260212-1515-plan-audit-gemini.md` nie zawiera audytu (to log błędu 429 / brak werdyktu i listy P0/P1/P2) — warunek „1x gemini plan audit” nie jest spełniony.

## P1 (braki w planie technicznym)
- Bootstrap Angular w monorepo:
  - plan powinien jawnie wymusić `ng new ... --skip-git` (żeby nie tworzyć zagnieżdżonego `.git` w `ut-angular/`, bo Git ma być wspólny w root),
  - plan powinien wymusić tryb nieinteraktywny (`--no-interactive`/`--defaults`) dla powtarzalności i pracy agentów.
- „Fresh checkout -> `make up`”:
  - przy bind mount + named volume `/app/node_modules` plan musi doprecyzować, **jak** następuje pierwsza instalacja zależności tak, aby G1 (jedna komenda `make -C ut-angular up`) była prawdziwa.
  - ryzyko: bez jawnej strategii `make up` może startować na pustym `node_modules` i wywalić się, albo instalować deps za każdym razem (wolne, niestabilne).
- Lint:
  - plan zakłada `make lint` jako kryterium (G3/AC), ale nie dopina jednoznacznie, czy baseline „latest stable” Angular CLI zapewnia działający lint out-of-the-box, a jeśli nie: jaki minimalny setup (np. `@angular-eslint`) jest akceptowany.

## P2 (usprawnienia / ryzyka operacyjne)
- Testy w kontenerze (Chromium): warto w planie przewidzieć troubleshooting dla `ChromeHeadless` w Dockerze (często potrzebny launcher z `--no-sandbox`), żeby nie utknąć na ID‑T=06.
- Watchery: `CHOKIDAR_USEPOLLING` może nie pokryć wszystkich przypadków (zależnie od bundlera); rozważyć dopisanie alternatyw (`WATCHPACK_POLLING` lub flagi `--poll`) jako opcjonalnego „toggle”.
- Porządki DX: dopisać `.dockerignore`, `init: true` (opcjonalnie), oraz jawny „clean” (`down -v`) w Makefile.
- Spójność scope: przy decyzji P2=dev-only rozważyć oznaczenie ID‑T=07 jako `on-hold` / out-of-scope, żeby nie sugerować implementacji profilu prod w tym tasku.

[HANDOFF: 01]

