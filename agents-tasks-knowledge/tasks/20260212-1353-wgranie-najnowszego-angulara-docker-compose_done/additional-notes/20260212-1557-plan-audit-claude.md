# Audyt planu: 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal

## Werdykt: **PASS**

**P0: 0, P1: 0, P2: 3**

---

## Szczegóły weryfikacji

### Kryteria obowiązkowe — status

| Kryterium | Status | Komentarz |
|-----------|--------|-----------|
| Docker-only (bez lokalnego Node) | OK | Plan jasno wymusza bootstrap i wszystkie komendy (`up`, `test`, `lint`) w kontenerze. ID-T 03 generuje Angular w kontenerze, ID-T 04 buduje Dockerfile.dev. |
| Host port 4299 | OK | `additional-contexts.md` §3.2 G1, §6 P4, §8; `tasks.md` ID-T 04 — port 4299 wyraźnie wskazany. |
| `make -C ut-angular up` zapewnia deps i startuje serwer | OK | ID-T 05 jawnie wymaga: „`make -C ut-angular up` na świeżym checkout ma najpierw zapewnić zależności w named volume (`npm ci` w kontenerze), a dopiero potem uruchomić dev-serwer." |
| UID/GID: `user: "${UID}:${GID}"`, `HOME=/tmp`, `NPM_CONFIG_CACHE=/tmp/.npm`, brak root-owned files | OK | §6 P5 i §8 w `additional-contexts.md`; ID-T 04 powtarza wymaganie. Kryteria akceptacji §3.5 zawierają punkt „brak root-owned files". |
| Bind mount kodu + named volume `/app/node_modules` | OK | §6 P6, §4.3 (gotchas), ID-T 04 — named volume + opcjonalnie `.angular/cache`. |
| Mountpoint `/app/node_modules` writable (`chmod 0777`) — brak `EACCES` | OK | §6 P6a, §4.3 (gotchas), ID-T 04 — „mountpoint `/app/node_modules` przygotowany w obrazie jako zapisywalny (np. `chmod 0777`)". Wprost dodane po rundie audytu `20260212-1541`. |
| `ng serve --host 0.0.0.0` | OK | §4.3 (gotchas): „Dev-serwer w kontenerze musi nasłuchiwać na `0.0.0.0`", ID-T 04: „`ng serve --host 0.0.0.0`". |
| Test runner: vitest + `ng test --watch=false` | OK | §6 P7: „`--test-runner=vitest` przy bootstrapie"; ID-T 03: flaga `--test-runner=vitest`; ID-T 04 i 06: `ng test --watch=false`. |
| Lint: `ng add angular-eslint --skip-confirmation --interactive=false --defaults` + `ng lint` | OK | ID-T 03: „lint skonfiguruj przez `ng add angular-eslint --skip-confirmation --interactive=false --defaults`"; ID-T 04 i 05 wymieniają `make lint` → `ng lint`. |
| Polling watcherów jako toggle (nie default) | OK | §6 P8: „domyślnie bez polling; dodajemy toggle env (np. `CHOKIDAR_USEPOLLING=1`)"; ID-T 04: „Toggle dla watcherów (polling)". |

---

### P2 — drobne uwagi (nieblokujące)

1. **P2 — Nazwa env dla polling toggle**: Plan wymienia `CHOKIDAR_USEPOLLING`, ale Angular 19+ używa esbuild/Vite dev server, który korzysta z własnego watchera (nie chokidar). Warto zweryfikować przy implementacji (ID-T 04), czy poprawna zmienna to `CHOKIDAR_USEPOLLING` czy raczej opcja w `angular.json` (`poll`) albo zmienna Vite. Nie blokuje — wystarczy dopisać notatkę w ID-T 04 / README.

2. **P2 — `.angular/cache` volume**: Plan mówi „opcjonalnie" (`+ opcjonalnie .angular/cache`). Warto podjąć decyzję jawnie przy implementacji ID-T 04: z named volume `.angular/cache` rebuildy będą szybsze, bez niego każdy `docker compose down -v` będzie wymuszał pełny rebuild. Sugeruję dodać go jako domyślny, nie opcjonalny.

3. **P2 — Brak jawnego `.dockerignore` w checkliście akceptacji**: ID-T 04 wymienia `.dockerignore`, ale kryteria akceptacji w §3.5 go nie obejmują. Drobne przeoczenie — `.dockerignore` jest potrzebny (żeby nie kopiować `node_modules` z hosta do kontekstu buildu), ale jego brak nie zablokuje działania (bo i tak jest named volume). Warto dodać do checklisty przy implementacji.

---

### Podsumowanie

Plan jest kompletny, spójny i pokrywa wszystkie wymagane kryteria techniczne. Decyzje P1–P9 są domknięte. Poprzedni bloker P0 (EACCES na `/app/node_modules`) został zaadresowany przez dodanie wymagania `chmod 0777` mountpointu w obrazie. Trzy uwagi P2 dotyczą drobnych kwestii implementacyjnych, które nie blokują przejścia do fazy realizacji.
