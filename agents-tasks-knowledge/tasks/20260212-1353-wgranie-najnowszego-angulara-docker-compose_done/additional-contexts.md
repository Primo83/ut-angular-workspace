# 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal - Wgranie najnowszego Angulara (docker compose)

## 0. Karta zadania (wypełnij zawsze)
- Cel w 1 zdaniu: Uruchomić od zera projekt Angular w `ut-angular/` (latest stable) i dostarczyć `docker compose` (plus `Makefile`) do powtarzalnego uruchamiania dev‑serwera bez lokalnej instalacji Node.
- Poziom specyfikacji: M
- Typ zadania (zaznacz):
    - [ ] Backend/API
    - [ ] UI/UX
    - [ ] DB/migracje
    - [x] Integracje
    - [x] Refactor/tech-debt
- Dotknięte systemy/moduły: `ut-angular/` (Angular + docker/compose + Makefile), dokumentacja planu w `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/`.
- Właściciel decyzji biznesowych: `primo`
- Właściciel decyzji technicznych: `gui-1`
- Linki: brak (task inicjalizacyjny)

## 1. Surowe dane / materiały wejściowe
- Ustalenie: właściwy projekt ma być w katalogu `ut-angular/`.
- Root (`/home/primo/projects/ut-angular-workspace`) traktujemy jako workspace/monorepo root.
- Git jest wspólny dla całości (jeden repo na root), nie osobny w `ut-angular/`.
- Obserwacja (2026-02-12): `ut-angular/` nie zawiera jeszcze projektu Angular (brak `package.json`, `angular.json`, `docker-compose*.yml`, `Makefile`).

## 2. Dlaczego robimy to zadanie? (problem / potrzeba)
Aktualnie workspace zawiera jedynie instrukcje i szkielet workflow, ale nie ma faktycznego projektu Angular w docelowym katalogu `ut-angular/`.  
Bez tego nie da się uruchomić GUI ani wykonywać zadań frontendowych w sposób powtarzalny (lokalnie i dla agentów).  
Potrzebujemy minimalnego, działającego „baseline” (Angular + compose), który potem będzie bazą do dalszych funkcji.

## 3. Efekt dla użytkownika / biznesu (wypełnij zawsze)
### 3.1 Użytkownicy / role
- Developer / agent pracujący na GUI.

### 3.2 Scenariusze (Given/When/Then) — minimum 2
- G1: Given świeży checkout repo, When uruchamiam `make -C ut-angular up`, Then dev‑serwer Angular działa w Dockerze i jest dostępny z hosta na `http://localhost:4299/`.
- G2: Given działający stack, When edytuję plik w `ut-angular/src/` i zapisuję, Then aplikacja przeładowuje się (HMR/live reload) bez ręcznego restartu kontenera.
- G3: Given działający stack, When uruchamiam `make -C ut-angular test` i `make -C ut-angular lint`, Then komendy przechodzą bez błędów.

### 3.3 Zasady biznesowe (jeśli są)
- Brak (zadanie infrastrukturalne).

### 3.4 Dane i wynik (najlepiej przykładami)
- Wejście: komendy `make -C ut-angular up` / `docker compose up` w `ut-angular/`.
- Wynik: działający dev‑serwer, powtarzalne komendy dla testów/lint.

### 3.5 Kryteria akceptacji (biznesowe) — checklista
- [ ] W `ut-angular/` istnieje projekt Angular utworzony w najnowszej stabilnej wersji w momencie implementacji (wersje utrwalone w lockfile właściwym dla wybranego PM).
- [ ] `ut-angular/docker-compose.yml` (lub `compose.yaml`) uruchamia dev‑serwer Angular w kontenerze i mapuje port na hosta.
- [ ] `make -C ut-angular up` wystawia aplikację na porcie hosta `4299`.
- [ ] `ut-angular/Makefile` dostarcza powtarzalne cele co najmniej: `up`, `down`, `logs`, `test`, `lint`.
- [ ] `ut-angular/README.md` opisuje minimalny „happy path” uruchomienia i listę komend.
- [ ] Repo nie zawiera sekretów; pliki `.env*` (jeśli potrzebne) są ignorowane przez Git.
- [ ] Stack działa na Linux (host = ten workspace); jeśli wymagane są dodatkowe env (np. polling watchera) są opisane w README.
- [ ] Po uruchomieniu `make -C ut-angular up/test/lint` w repo nie zostają pliki z ownerem `root` (brak „root-owned files”).
- [ ] `make -C ut-angular test` jest nieinteraktywne (bez watch) i przechodzi w kontenerze.

## 4. Referencje i wzorce (żeby agent nie zgadywał)
### 4.1 Bliźniacze taski / PR / commity (1–3)
- Brak (repo świeże).
### 4.2 Co kopiujemy ze wzorca
- [ ] flow/architektura
- [ ] kontrakt API / event
- [ ] walidacje
- [ ] testy
- [ ] migracje
- [ ] podobieństwa funkcjonalne np. akcja użytkownika, umiejscowienie, wygląd, itp.
### 4.3 Pułapki / “gotchas”
- `ut-angular/` jest już niepuste (pliki `AGENTS/CLAUDE/GEMINI.md`) więc bootstrap Angulara musi uwzględnić tworzenie projektu w istniejącym katalogu (albo generowanie do katalogu tymczasowego i merge).
- File watching w kontenerze: potencjalnie potrzebne `CHOKIDAR_USEPOLLING=true` (zależy od środowiska/FS).
- Dev‑serwer w kontenerze musi nasłuchiwać na `0.0.0.0` (np. `ng serve --host 0.0.0.0`), inaczej port mapping może nie działać z hosta.
- Testy w kontenerze: `make -C ut-angular test` ma być nieinteraktywne (`ng test --watch=false`). Wymagania środowiskowe zależą od wybranego test runnera (ustalamy vitest w `ng new`, więc nie potrzebujemy Chromium).
- Strategia `node_modules` + bind mount: bez named volume na `/app/node_modules` łatwo o maskowanie katalogu i problemy ze startem.
- Uprawnienia do named volume `/app/node_modules`: przy `user: "${UID}:${GID}"` mountpoint musi być zapisywalny (typowy fix: przygotować `/app/node_modules` w obrazie z prawami `0777`, żeby świeży volume nie powodował `EACCES` przy `npm ci`).

## 5. Zakres i ograniczenia (wypełnij zawsze)
### 5.1 Zakres in/out
- **W zakresie**:
  - utworzenie projektu Angular (baseline, bez logiki biznesowej),
  - uruchamianie przez `docker compose` w `ut-angular/`,
  - Makefile + README dla powtarzalnych komend,
  - podstawowa weryfikacja (`up`, `test`, `lint`).
- **Poza zakresem**:
  - implementacja funkcji biznesowych UI,
  - konfiguracja deploymentu produkcyjnego (chyba że decyzja P2 mówi inaczej),
  - integracje z backendem (brak backendu w tym repo na teraz).

### 5.2 Ograniczenia i zależności
- Termin/release: brak
- Technologiczne/architektoniczne:
  - nie zakładamy Nx ani dodatkowych frameworków; minimalny Angular CLI,
  - wersję Node dobieramy do wymagań „latest stable” Angular (utrwalamy w Dockerfile).
- Zależności (inne zespoły/systemy): brak

### 5.3 Założenia i ryzyka (krótko, jeśli są)
- Założenia:
  - dev uruchamiamy przez `ng serve` w kontenerze, a kod montujemy jako volume.
  - package manager: `npm`.
- Ryzyka:
  - konflikty uprawnień plików (root w kontenerze) i „root-owned files” w repo,
  - problemy z watcherem w zależności od środowiska/FS,
  - rozjazd wersji Node vs Angular CLI jeśli nie zostanie jawnie przypięty.

## 6. Otwarte pytania (blokery + decyzje)
> Zasada: każde pytanie ma właściciela i “deadline decyzji”.
- [x] **P1:** Baseline Angular generujemy w `ut-angular/` (nie „wgrywamy” istniejącego projektu). | owner: `primo`
- [x] **P2:** Scope = dev-only (bez profilu prod na tym etapie). | owner: `primo`
- [x] **P3:** Package manager = `npm`. | owner: `primo`
- [x] **P4:** Uruchamianie dev‑serwera i komend = w Dockerze (bez lokalnej instalacji Node); `make -C ut-angular up` ma wystawiać host port `4299`. | owner: `primo`
- [x] **P5:** UID/GID: używamy `user: "${UID}:${GID}"` w compose, a `Makefile` podstawia `UID/GID` z hosta (bez `.env`). Dodatkowo ustawiamy `HOME=/tmp` + `NPM_CONFIG_CACHE=/tmp/.npm`, żeby działało nawet gdy UID nie istnieje w obrazie. | owner: `gui-1`
- [x] **P6:** `node_modules`: bind mount kodu + named volume na `/app/node_modules` (żeby nie tworzyć `node_modules` na hoście i nie maskować deps). Opcjonalnie drugi named volume na `.angular/cache`. | owner: `gui-1`
- [x] **P6a:** Uprawnienia `node_modules` volume: w dev obrazie przygotowujemy mountpoint z prawami zapisu dla dowolnego UID (np. `chmod 0777 /app/node_modules`), żeby `npm ci` działało przy `user: "${UID}:${GID}"`. | owner: `gui-1`
- [x] **P7:** Testy w kontenerze: wymuszamy `--test-runner=vitest` przy bootstrapie (`ng new ... --test-runner=vitest`) i uruchamiamy `ng test --watch=false` (bez Chromium). | owner: `gui-1`
- [x] **P8:** Watchery/HMR: domyślnie bez polling; dodajemy „toggle” env (np. `CHOKIDAR_USEPOLLING=1`) + troubleshooting w README. | owner: `gui-1`
- [x] **P9:** Target = Linux (host tego workspace). | owner: `primo`

## 7. Ustalenia z rozmów (log decyzji)
- 2026-02-12: Docelowy katalog GUI to `ut-angular/`; root jest monorepo root; Git jest wspólny dla całości.
- 2026-02-12: W repo brak obecnie projektu Angular w `ut-angular/` (do zrobienia w tym tasku).
- 2026-02-12: Baseline Angular generujemy w `ut-angular/` i uruchamiamy w Dockerze; `make -C ut-angular up` wystawia host port `4299`.
- 2026-02-12: Docker DX: `user: ${UID}:${GID}` + named volume na `/app/node_modules` + test runner vitest + polling jako toggle (nie default).

## 8. Brief do planu technicznego (`tasks.md`) — 8–15 linijek max
- Backend/API: brak
- UI: baseline Angular (bez funkcji), tylko weryfikacja, że startuje i hot reload działa.
- Docker/compose: `docker compose up` w `ut-angular/`, mapowanie host port `4299`, volume na kod + named volume na `node_modules`, stabilna wersja Node, `user=${UID}:${GID}` (brak root-owned plików).
- Makefile/Docs: `ut-angular/Makefile` + `ut-angular/README.md` jako jedyne źródło komend (happy path).
- Testy: `make -C ut-angular test` (`ng test --watch=false`, vitest), `make -C ut-angular lint` (wszystko w kontenerze).
- Ryzyka/rollout: watchery i uprawnienia plików (UID/GID, `node_modules`); decyzje P1–P9 muszą być zamknięte przed implementacją.

---

# MODUŁY
- Nie dotyczy (task infrastrukturalny, bez API/DB i bez zmian UI/UX).
