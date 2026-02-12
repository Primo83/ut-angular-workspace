# Audyt planu: 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal

## Werdykt: **PASS**

**P0: 0 | P1: 0 | P2: 2**

---

## Szczegółowa analiza wymagań

### Docker-only (bez lokalnego Node)
**OK** — `additional-contexts.md` sekcja 6 (P4) jawnie stwierdza: „Uruchamianie dev-serwera i komend = w Dockerze (bez lokalnej instalacji Node)". ID-T=03 wymaga bootstrapu w kontenerze (generowanie do katalogu tymczasowego i przenoszenie). ID-T=04 i 05 opisują Makefile/compose bez lokalnego Node. Spójne.

### Host port 4299 (G1)
**OK** — Scenariusz G1 w sekcji 3.2: „Then dev-serwer Angular działa w Dockerze i jest dostępny z hosta na `http://localhost:4299/`". P4 potwierdza: „`make -C ut-angular up` ma wystawiać host port `4299`". ID-T=04 mówi o „mapowanie host port `4299`". Spójne w trzech miejscach.

### `make -C ut-angular up` zapewnia deps i startuje serwer
**OK** — ID-T=05 jawnie wymaga: „`make -C ut-angular up` na świeżym checkout ma najpierw zapewnić zależności w named volume (`npm ci` w kontenerze), a dopiero potem uruchomić dev-serwer". Cel `deps` jest wymieniony osobno w liście celów Makefile.

### UID/GID: `user: "${UID}:${GID}"`, `HOME=/tmp`, `NPM_CONFIG_CACHE=/tmp/.npm`, brak root-owned files
**OK** — P5 w sekcji 6: „`user: "${UID}:${GID}"` w compose, a `Makefile` podstawia `UID/GID` z hosta (bez `.env`). Dodatkowo ustawiamy `HOME=/tmp` + `NPM_CONFIG_CACHE=/tmp/.npm`". Kryterium akceptacji (sekcja 3.5, przedostatni punkt): „Po uruchomieniu `make -C ut-angular up/test/lint` w repo nie zostają pliki z ownerem `root`". ID-T=04 powtarza: „`user: ${UID}:${GID}` (brak root-owned)". ID-T=06 weryfikuje: „brak root-owned plików".

### Bind mount kodu + named volume `/app/node_modules`
**OK** — P6: „bind mount kodu + named volume na `/app/node_modules`". ID-T=04: „bind mount kodu + named volume dla `/app/node_modules` (+ opcjonalnie `.angular/cache`)". Gotcha w sekcji 4.3 również ostrzega o maskowaniu katalogu.

### `ng serve --host 0.0.0.0`
**OK** — Gotcha w sekcji 4.3: „Dev-serwer w kontenerze musi nasłuchiwać na `0.0.0.0` (np. `ng serve --host 0.0.0.0`)". ID-T=04: „`ng serve --host 0.0.0.0`". Spójne.

### Test runner: vitest + `ng test --watch=false`
**OK** — P7: „wymuszamy `--test-runner=vitest` przy bootstrapie (`ng new ... --test-runner=vitest`) i uruchamiamy `ng test --watch=false` (bez Chromium)". ID-T=03 podaje flagi bootstrapu zawierające `--test-runner=vitest`. ID-T=04: „`make test` (`ng test --watch=false`, vitest)". Scenariusz G3 i kryterium akceptacji potwierdzają nieinteraktywność.

### Lint: `ng add angular-eslint` + `ng lint`
**OK** — ID-T=03: „lint skonfiguruj przez `ng add angular-eslint` (tak, aby `ng lint` działało)". ID-T=04 powtarza: „`make lint` (`ng lint`)". Scenariusz G3 wymaga, by `make lint` przeszedł bez błędów.

### Polling watcherów jako toggle (nie default)
**OK** — P8: „domyślnie bez polling; dodajemy «toggle» env (np. `CHOKIDAR_USEPOLLING=1`) + troubleshooting w README". ID-T=04 mówi: „toggle dla watcherów (polling)". Gotcha 4.3 ostrzega o potencjalnej potrzebie, ale nie jako default.

---

## Uwagi P2 (nieblokujące)

### P2-1: Brak jawnego wskazania wersji Angular CLI w `additional-contexts.md`
Plan mówi „latest stable na moment implementacji" (ID-T=02), co jest poprawne koncepcyjnie, ale `additional-contexts.md` sekcja 1 (surowe dane) nie zawiera żadnej konkretnej wersji Angular ani Node. ID-T=02 ma to ustalić, więc jest to pokryte proceduralnie, ale warto dodać notatkę w sekcji 7 (log decyzji), że konkretne wersje zostaną zalogowane przy realizacji ID-T=02.

**Sugestia:** W `additional-contexts.md` sekcja 7 dodać wpis:
> `- 2026-02-12: Konkretne wersje Angular CLI i Node zostaną ustalone i zalogowane przy realizacji ID-T=02 (przed bootstrapem).`

### P2-2: Nazwa pliku compose nieokreślona
ID-T=02 zawiera „Ustal docelową nazwę pliku compose (`compose.yaml` vs `docker-compose.yml`)", a ID-T=04 podaje obie opcje w nawiasie. Nie jest to bloker (decyzja zapada w ID-T=02), ale dla spójności planu warto wybrać jedną i trzymać się jej w opisach kolejnych ID-T.

**Sugestia:** Wybrać `compose.yaml` (domyślna konwencja od Compose v2) i ujednolicić nazewnictwo w ID-T=04 i 05.

---

## Podsumowanie

Plan jest kompletny, spójny i pokrywa wszystkie wymagane aspekty. Decyzje P1–P9 są domknięte. Sekwencja ID-T jest logiczna (toolchain -> bootstrap -> Docker -> Makefile/docs -> weryfikacja E2E). Dwie uwagi P2 dotyczą drobnych uściśleń dokumentacyjnych i nie blokują implementacji.
