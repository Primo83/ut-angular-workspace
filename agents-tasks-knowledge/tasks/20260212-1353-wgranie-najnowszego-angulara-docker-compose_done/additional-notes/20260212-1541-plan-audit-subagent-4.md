# Audyt planu (runda 20260212-1541) — subagent-4

- Werdykt: PASS
- P0: 0, P1: 0, P2: 3

## Zakres
- Przejrzano wylacznie: `additional-contexts.md` + `tasks.md` w katalogu taska.

## Wymagania kluczowe (check)
- Docker-only (bez lokalnego Node): OK (AC: P4; `tasks.md`: ID-T=03/04/05).
- Host port `4299` (`make -C ut-angular up` -> `http://localhost:4299/`): OK (AC: G1; `tasks.md`: ID-T=04/05/06).
- UID/GID + brak root-owned files + `HOME=/tmp` + `NPM_CONFIG_CACHE=/tmp/.npm`: OK (AC: P5; `tasks.md`: ID-T=04).
- Bind mount kodu + named volume `/app/node_modules`: OK (AC: P6; `tasks.md`: ID-T=04).
- `ng serve --host 0.0.0.0`: OK (AC: 4.3; `tasks.md`: ID-T=04).
- Test runner vitest + `ng test --watch=false`: OK (AC: P7 + 4.3; `tasks.md`: ID-T=03/04).
- Lint: `ng add angular-eslint` + `ng lint`: OK (`tasks.md`: ID-T=03/04).
- Watchery: polling jako toggle env: OK (AC: P8; `tasks.md`: ID-T=04).
- `make up` zapewnia deps (np. `make deps` + `npm ci`) i dopiero startuje serwer: OK (`tasks.md`: ID-T=05).

## P2 (usprawnienia, nie blokuja)
- P2.1 Doprecyzowac mapowanie portow kontenera. Gdzie: `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md` (ID-T=04). Co dopisac: wprost jaka jest para host:container (np. `4299:4200`) i czy `ng serve` ma zostac na domyslnym porcie czy ma byc ustawiony jawnie.
- P2.2 Doprecyzowac "non-interactive" dla `ng add angular-eslint`. Gdzie: `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md` (ID-T=03 lub ID-T=05). Co dopisac: wymog `--skip-confirmation` (albo jawny odpowiednik w projekcie) / ustawienie `CI=1`, zeby `make lint` nie wchodzilo w prompty.
- P2.3 Ustalic finalna nazwe toggla dla pollingu i opisac mapowanie na zmienne watchera. Gdzie: `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/additional-contexts.md` (P8) oraz `tasks.md` (ID-T=04/05). Co dopisac: jedna nazwa zmiennej (np. `WATCH_POLLING=1`) + krotka informacja, ze mapuje sie na `CHOKIDAR_USEPOLLING=1` (i ewentualnie interval), oraz gdzie to opisac w `ut-angular/README.md`.
