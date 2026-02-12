# Audyt planu (Docker/Compose DX)

Task: `20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal`  
Audyt: Docker/Compose developer experience (DX)  
Data: 2026-02-12 14:46 (Europe/Warsaw)  

## Zakres audytu

- uprawnienia plików (root-owned), UID/GID, user w Dockerfile
- cache `node_modules` vs bind mount
- watchery (inotify/polling, `CHOKIDAR_USEPOLLING`, `ng serve --poll`) i cross-platform
- wydajność i reproducibility (lockfile, `npm ci` vs `npm install`)
- rozdzielenie dev/prod, profiles, healthcheck

Podstawa: `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md` + `additional-contexts.md`.

## P0 (blokery)

- **Kolejność i sposób bootstrapu Angular vs Docker (ryzyko root-owned i sprzeczność z “brak lokalnego Node”).**
  - Plan zakłada bootstrap Angular w ID‑T=03, a dopiero potem Compose/Dockerfile w ID‑T=04. Przy założeniu “bez lokalnej instalacji Node” bootstrap musi zostać wykonany w kontenerze, a to wymaga wcześniejszego ustalenia user/UID/GID i sposobu montowania katalogu.
  - Rekomendacja do planu: doprecyzować “jak” bootstrapujemy (jednorazowy `docker run` albo `docker compose run`) i **wymusić uruchomienie generatora jako UID/GID hosta**.

- **Brak jawnej decyzji “jak gwarantujemy brak root-owned plików”.**
  - W planie jest hasło “stabilne UID/GID”, ale brakuje konkretu: `user:` w compose vs tworzenie usera w Dockerfile (`ARG UID/GID`) vs `USER node`.
  - Rekomendacja do planu: wybrać mechanizm i opisać go wprost (w `additional-contexts.md` jako decyzja + w ID‑T=04 jako kryterium techniczne).

- **Brak jawnej strategii `node_modules` przy bind mount (maskowanie katalogu, niedziałający start).**
  - Jeśli montujemy kod jako volume (`.:/app`), a `node_modules` ma zostać w kontenerze, potrzebny jest named volume na `/app/node_modules` (albo rezygnacja z bind mount na rzecz innego workflow).
  - Rekomendacja do planu: doprecyzować, gdzie żyje `node_modules` (host vs named volume) i jak zachowujemy spójność po zmianie lockfile (np. procedura “reset volumes” albo automatyczny reinstall).

- **Hot reload i dostęp z hosta: brak wymogu `--host 0.0.0.0` / konfiguracji dev-serwera.**
  - Bez tego typowo port jest “wystawiony”, ale serwer nasłuchuje tylko na `localhost` w kontenerze.
  - Rekomendacja do planu: dopisać w ID‑T=04 wymaganie, że `ng serve` uruchamia się z `--host 0.0.0.0` i jest mapowany port (domyślnie 4200).

- **`make -C ut-angular test` w kontenerze: brak decyzji o przeglądarce headless i trybie non-watch.**
  - Domyślny Angular test runner zwykle wymaga Chromium/Chrome w środowisku; dodatkowo domyślne “watch” potrafi zawiesić komendę w CI/Makefile.
  - Rekomendacja do planu: doprecyzować, czy Docker image ma zawierać Chromium (i jak ustawiamy `CHROME_BIN`), oraz że testy odpalamy bez watch (`--watch=false` / `CI=true`).

## P1 (ważne)

- **Reproducibility: lockfile jest wspomniany, ale brak twardej decyzji “`npm ci` jako standard” dla kontenera.**
  - Rekomendacja do planu: spisać zasadę: w kontenerze `npm ci` (a nie `npm install`) dla `up/test/lint` + commit lockfile.

- **Watchery na różnych hostach/FS: ryzyko, ale brak planu na knob’y.**
  - Rekomendacja do planu: przewidzieć zmienne/env dla polling (np. `CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`, `ng serve --poll <ms>`) oraz opisać w README “kiedy włączyć”.

- **Wydajność: brak planu na cache npm/Angular (bez tego dev jest “wolny po restarcie”).**
  - Rekomendacja do planu: named volume na cache npm (np. `~/.npm`) i/lub `.angular/cache` albo użycie BuildKit cache w Dockerfile (jeśli stosowane).

- **Definicja “clean state” w ID‑T=06 jest nieprecyzyjna.**
  - Rekomendacja do planu: test “clean” powinien obejmować co najmniej `docker compose down -v` (albo równoważnie usunięcie named volumes), żeby wyłapać problemy z instalacją deps i ownership.

## P2 (usprawnienia / opcjonalne)

- **Dev/prod: P2 w `additional-contexts.md` pyta o prod, ale plan nie wskazuje preferowanej implementacji.**
  - Rekomendacja do planu: jeśli “tak”, to od razu założyć Compose profiles (`dev`/`prod`) lub osobny plik (np. `compose.prod.yaml`) i cel Makefile (opcjonalny). Jeśli “nie”, zapisać jawnie “out of scope”.

- **Healthcheck i readiness.**
  - Rekomendacja do planu: dodać healthcheck (HTTP na 4200) lub przynajmniej “wait-for” w Makefile dla lepszego DX (opcjonalne).

- **Ergonomia Compose.**
  - Rekomendacja do planu: rozważyć `init: true` (lepsze sygnały/stop), `.dockerignore`, i spójne nazwy (`compose.yaml` vs `docker-compose.yml`) jako elementy porządkujące.

## Konkretne rekomendacje zmian w planie (pliki + decyzje)

### 1) `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/additional-contexts.md`

- Rozszerzyć sekcję **6. Otwarte pytania** o decyzje (propozycja):
  - P4: “W jaki sposób bootstrapujemy Angular bez lokalnego Node i bez root-owned?” (`docker run`/`compose run`, jaką komendą, jak mapujemy UID/GID).
  - P5: “Strategia user/UID/GID” (`user:` w compose vs user w Dockerfile).
  - P6: “Strategia `node_modules`” (named volume vs host; co przy zmianie `package-lock.json`).
  - P7: “Test runner w kontenerze” (Chromium w image? `CHROME_BIN`? `--watch=false`?).
  - P8: “Watchery” (polling default? kiedy włączyć? wartości).
  - (opcjonalnie) P9: “Czy targetujemy też macOS/Windows (Docker Desktop) czy tylko Linux?”.

- Doprecyzować **3.3 Kryteria akceptacji**:
  - dodać punkt “brak root-owned plików w repo po `make up/test/lint`”.
  - dodać punkt “`make test` jest non-interactive (bez watch) i przechodzi w kontenerze”.

### 2) `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md`

- Zmienić zakres ID‑T=02 (“toolchain”) tak, aby obejmował też P4–P8 (Docker DX), a nie tylko P1–P3.
- Zmienić kolejność albo dopisać krok przed bootstrapem:
  - opcja A: przenieść ID‑T=04 (Docker dev tooling) przed ID‑T=03 (bootstrap Angular w kontenerze),
  - opcja B: w ID‑T=03 dopisać “bootstrap wykonywany w kontenerze z mapowaniem UID/GID”.
- Dopisać w ID‑T=04 konkretne wymagania:
  - `ng serve --host 0.0.0.0`,
  - named volume dla `/app/node_modules` (jeśli wybrany wariant),
  - ustawienia watcherów (env/flag),
  - user/UID/GID.
- Rozważyć dodanie osobnego ID‑T na “test runner w kontenerze (Chromium + konfiguracja)”, jeśli nie wejdzie czysto w ID‑T=04.

