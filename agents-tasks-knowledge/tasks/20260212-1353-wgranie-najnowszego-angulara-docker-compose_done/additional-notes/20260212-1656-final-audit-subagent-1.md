# FINAL AUDYT IMPLEMENTACJI (subagent-1)

Task: `20260212-1353-wgranie-najnowszego-angulara-docker-compose_in-progress`  
Data (Europe/Warsaw): 2026-02-12 17:11:09  
Zakres: audyt implementacji (nie planu)

## Werdykt

PASS  
P0: 0 | P1: 0 | P2: 4

## Kryteria (weryfikacja + evidence)

- Docker-only: **PASS**
- Host port `4299`: **PASS**
- `make -C ut-angular up` działa: **PASS**
- UID/GID + brak root-owned plików: **PASS**
- Named volume `/app/node_modules` + brak EACCES: **PASS**
- Testy i lint działają w kontenerze: **PASS**

### Docker-only

- `ut-angular/README.md` deklaruje workflow **Docker-only**.
- `ut-angular/Makefile` uruchamia `deps/up/test/lint` przez `docker compose`.
- Hostowy `ut-angular/node_modules/` istnieje, ale jest pusty (nie ma zależności na hoście).

### Port hosta `4299`

- `ut-angular/compose.yaml`: `ports: - "4299:4200"`.
- Runtime: `docker compose ps` pokazuje `0.0.0.0:4299->4200/tcp`.
- Runtime: `curl -sSf http://localhost:4299/` zwraca HTML aplikacji (dev-server działa).

### `make -C ut-angular up` działa

- `ut-angular/Makefile`: target `up` = `deps` + `docker compose up --build`.
- Runtime: serwis `gui` działa (dev-server odpowiada na porcie hosta).
- Uwaga praktyczna: `up` jest komendą interaktywną (foreground). W audycie zweryfikowano runtime dev-server + to, że `deps` przechodzi w kontenerze (patrz sekcja EACCES).

### UID/GID + brak root-owned plików

- `ut-angular/compose.yaml`: `user: "${UID}:${GID}"`.
- Runtime: `env UID=$(id -u) GID=$(id -g) docker compose exec gui id` -> `uid=1000 ... gid=1000 ...`.
- Runtime: `find ut-angular -user root -print` -> brak wyników.
- Runtime: `find . -user root -print` -> brak wyników.

### Named volume `/app/node_modules` + brak EACCES

- `ut-angular/compose.yaml`: `volumes: - node_modules:/app/node_modules` + `volumes: node_modules:`.
- Runtime: `docker inspect ut-angular-gui-1` pokazuje mount:
  - `Type=volume`, `Destination=/app/node_modules`, `Name=ut-angular_node_modules`.
- Runtime: zapis do volume jako user z hosta:
  - `docker compose exec gui bash -lc 'touch /app/node_modules/.permtest && rm /app/node_modules/.permtest'` -> OK.
- Runtime: instalacja deps w kontenerze:
  - `make -C ut-angular deps` (`npm ci`) -> **OK** (bez `EACCES`).
- `ut-angular/docker/Dockerfile.dev` przygotowuje mountpoint pod volume:
  - `mkdir -p /app/node_modules /tmp/.npm` + `chmod 0777 ...` (zapobiega EACCES na świeżym volume przy `user: UID:GID`).

### Testy i lint w kontenerze

- Runtime: `make -C ut-angular lint` -> PASS (`All files pass linting.`).
- Runtime: `make -C ut-angular test` -> PASS (Vitest: `1 passed`, `2 passed`).

## P0 / P1

- Brak.

## P2 (rekomendacje)

- [P2] `make -C ut-angular up` zawsze uruchamia `deps` (a `deps` robi `npm ci`) -> koszt czas/sieć przy każdym `up`. Rozważyć rozdzielenie na `up` (bez reinstalla) + `deps`/`up-fresh`.
- [P2] `compose.yaml` używa `${UID}/${GID}`: uruchomienie `docker compose ...` bez Makefile emituje warningi o brakujących zmiennych. Jeśli wspierany jest tylko `make`, dopisać to w `ut-angular/README.md`; alternatywnie dodać bezpieczne wartości domyślne.
- [P2] `ut-angular/Makefile` tworzy hostowy katalog `ut-angular/node_modules/`, mimo że runtime używa named volume na `/app/node_modules`. Usunąć albo krótko uzasadnić (DX/IDE).
- [P2] Redundancja `NG_CLI_ANALYTICS=false` (jest i w `ut-angular/docker/Dockerfile.dev`, i w `ut-angular/compose.yaml`) -> zostawić jedno źródło.

## Komendy uruchomione w audycie (bez destrukcji typu `down -v`)

- `curl -sSf http://localhost:4299/ | head`
- `make -C ut-angular lint`
- `make -C ut-angular test`
- `make -C ut-angular deps`
- `env UID=$(id -u) GID=$(id -g) docker compose exec gui id`
- `find ut-angular -user root -print`
- `docker inspect ut-angular-gui-1 --format '{{json .Mounts}}'`

