# Audyt planu (runda 20260212-1557) — subagent-6 (Docker DX + reproducibility)

Task: `20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal`

## Werdykt: PASS

P0: 0  
P1: 0  
P2: 5

## Zakres
- Oceniono: `additional-contexts.md` + `tasks.md` (stan na rundzie `20260212-1557`).
- Fokus: Docker DX i powtarzalnosc (fresh checkout, deterministyczne deps, brak root-owned files).
- Uwaga: audyt nie blokuje na formalnym statusie `ID-T=01` (planning/done).

## Co jest domkniete (DX/repro)
- Docker-only: bootstrap i wszystkie komendy (`up/test/lint`) zaplanowane do uruchamiania w kontenerze.
- Fresh checkout: `make -C ut-angular up` ma zapewnic deps (`npm ci` w kontenerze) przed startem serwera.
- Brak root-owned: `user: "${UID}:${GID}"` + `HOME=/tmp` + `NPM_CONFIG_CACHE=/tmp/.npm`.
- `node_modules`: bind mount kodu + named volume na `/app/node_modules`.
- Permissions wolumenu: wymaganie przygotowania mountpointu `/app/node_modules` w obrazie jako zapisywalnego (np. `chmod 0777`) adresuje typowy `EACCES` na swiezym wolumenie.
- Repro deps: `npm` + lockfile, a instalacja przez `npm ci` (nie `npm install`).

## P2 (nieblokujace usprawnienia)
- P2.1 Doprecyzowac pinning obrazu Node: wymagac tagu z pelna wersja (major.minor.patch) lub digest (unikac plywajacych `node:latest`/`node:20`), bo to poprawia reproducibility srodowiska.
- P2.2 Watchery: nie opierac toggla tylko o `CHOKIDAR_USEPOLLING` (Angular/Vite moze go ignorowac); w planie/README przewidziec weryfikacje faktycznie dzialajacego mechanizmu (np. `--poll`/ustawienie w `angular.json`/zmienne Vite) i podac jedna nazwe toggla w `Makefile`.
- P2.3 Nazwac i zapisac jawnie mapowanie portow host:container (np. `4299:4200`) i zdecydowac czy zmieniamy port w `ng serve` czy zostaje domyslny w kontenerze.
- P2.4 Uczynic `.angular/cache` named volume domyslnym (nie opcjonalnym) albo dodac jasna polityke + `.gitignore`, zeby cache nie zasmiecal repo i zeby restart `up` byl szybszy.
- P2.5 Dodac named volume na cache npm (albo inny mechanizm cache) dla szybszego `npm ci` po `down -v`; bez tego DX po czyszczeniu wolumenow bedzie wyraznie wolniejszy.

