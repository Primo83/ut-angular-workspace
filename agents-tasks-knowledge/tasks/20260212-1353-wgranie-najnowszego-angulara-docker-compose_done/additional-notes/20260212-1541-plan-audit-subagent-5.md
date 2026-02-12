# Plan audit (subagent) - 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal

Runda: `20260212-1541`

## Werdykt: FAIL

P0: 1  
P1: 0  
P2: 1

## P0
- Named volume `/app/node_modules` + `user: ${UID}:${GID}`: doprecyzować strategię uprawnień mountpointu, bo na świeżym wolumenie `npm ci` może kończyć się `EACCES`.
  - Przykładowy fix: w `ut-angular/docker/Dockerfile.dev` przygotować mountpoint i ustawić prawa zapisu (np. `chmod 0777 /app/node_modules`) zanim volume zostanie zamontowany.

## P2
- Doprecyzować non-interactive dla `ng add angular-eslint` (np. `--skip-confirmation` / `--interactive=false` / `--defaults`), żeby bootstrap/lint nie blokowały się na promptach w kontenerze.

