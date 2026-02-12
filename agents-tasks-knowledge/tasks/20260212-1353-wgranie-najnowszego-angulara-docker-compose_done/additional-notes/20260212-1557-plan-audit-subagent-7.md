# Audyt planu (runda 20260212-1557) — subagent-7

Task: `20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal`

## Wejscie
- `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/additional-contexts.md`
- `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md`

## Werdykt: PASS

P0: 0  
P1: 0  
P2: 4

## Uzasadnienie (audit planu ID-T=01)
- Plan ma jasny efekt uzytkowy i kryteria akceptacji (G1-G3 + checklista) oraz mapuje je na kroki ID-T 02-06.
- "Docker-only" jest konsekwentnie wymuszony: bootstrap, `up/test/lint` i narzedzia (Angular CLI, npm) sa planowane do uruchamiania w kontenerze.
- Ryzyko "niepustego" `ut-angular/` jest adresowane poprawnie (bootstrap do katalogu tymczasowego + przeniesienie/merge, bez nadpisywania plikow instrukcji).
- Plan uwzglednia typowe gotchas dla serwera dev w kontenerze: `--host 0.0.0.0`, mapowanie portu na hosta `4299`, oraz troubleshooting watcherow.
- Poprawnie domknieto strategię uprawnien i brak root-owned files: `user: ${UID}:${GID}` + `HOME=/tmp` + `NPM_CONFIG_CACHE=/tmp/.npm`.
- Poprzedni bloker (EACCES na `/app/node_modules`) zostal zaadresowany wymaganiem przygotowania mountpointu w obrazie jako zapisywalnego (np. `chmod 0777`) + named volume na `/app/node_modules`.
- Powtarzalnosc zaleznosci jest zaplanowana przez `npm` + lockfile + `npm ci` jako czesc "fresh checkout" (`make ... up` zapewnia deps przed startem).
- Plan uwzglednia testy i lint jako nieinteraktywne kroki w kontenerze (w tym `ng test --watch=false`), oraz osobny krok E2E weryfikacji na clean state.

## P2 (rekomendacje nieblokujace)
- P2.1 Pinning Node: doprecyzowac w ID-T=02, ze obraz ma byc przypiety pelna wersja (major.minor.patch) lub digestem (unikac plywajacych tagow), zeby ograniczyc drift srodowiska.
- P2.2 Watcher polling: nie opierac toggla wylacznie o `CHOKIDAR_USEPOLLING` (Angular/Vite moze to ignorowac) — w ID-T=04/README zweryfikowac faktycznie dzialajacy mechanizm (np. `--poll`/ustawienie w `angular.json`/Vite) i nazwac jedna zmienna sterujaca.
- P2.3 Porty: w compose jawnie zapisac mapowanie host:container (np. `4299:4200`) i podjac decyzje, czy port w kontenerze zostaje domyslny, czy tez jest zmieniany.
- P2.4 `.dockerignore`: ID-T=04 wymienia `.dockerignore`, ale warto dopisac go tez do kryteriow akceptacji (minimalizacja kontekstu buildu, mniejsza szansa na przypadkowe smieci w obrazie).
