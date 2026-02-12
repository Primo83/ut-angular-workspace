# Plan audit (subagent: codex) - 20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal

## Zakres
- Oceniono: `additional-contexts.md`, `tasks.md` (stan na 2026-02-12 14:46 CET).
- Cel audytu: wykryć brakujące decyzje/ryzyka/testy tak, aby plan był wykonalny i spełniał kryteria akceptacji (compose + Makefile + README + brak sekretów).

## Werdykt
- Plan NIE jest jeszcze „decision-complete”.
- Blokują P0/P1 poniżej (P0 = natychmiastowe, P1 = konieczne przed zamknięciem ID‑T=01).

## P0 (blokery)
- Bootstrap Angular do niepustego `ut-angular/`: w planie brakuje konkretnej metody (CLI zwykle odmawia pracy w niepustym katalogu). Bez doprecyzowania ID‑T=03 może utknąć.
- `docker compose` dla dev‑serwera: plan nie wymusza `ng serve --host 0.0.0.0` (albo równoważnie). Bez tego port może być zmapowany, ale serwer nie będzie dostępny z hosta.
- `make test` / `make lint`: plan zakłada istnienie komend, ale nie precyzuje:
  - czy w baseline Angular zapewniamy lint (często wymaga jawnego setupu ESLint / `@angular-eslint`),
  - jak uruchamiamy testy w kontenerze (typowy `ng test` wymaga Chrome/Chromium; obraz `node:*` nie ma go domyślnie).
  Bez tego kryteria G3 („test” i „lint” bez błędów) są wysokiego ryzyka.

## P1 (ważne)
- „Latest stable”: brakuje doprecyzowania jak ją ustalamy i jak utrwalamy w repo poza lockfile:
  - komenda/źródło (`npx @angular/cli@latest ...` itp.),
  - zapis wersji Angular/CLI/Node w `ut-angular/README.md` (żeby kolejny agent nie zgadywał).
- Brak jawnej deklaracji, że wszystkie cele `Makefile` mają działać bez lokalnej instalacji Node (tj. `make test/lint` uruchamiają się przez `docker compose run`).
- `.env*` i sekrety: kryteria mówią „jeśli potrzebne `.env*` są ignorowane przez Git”, ale root `.gitignore` ignoruje tylko `/.env.test-accounts`. Jeśli plan zakłada plik `.env` (np. UID/GID dla compose) trzeba to świadomie rozwiązać (np. ignore w `ut-angular/.gitignore` albo brak `.env` i generowanie UID/GID w `make`).
- P2 (dev+prod) nie ma odzwierciedlenia w ID‑T: jeśli owner wybierze dev+prod, warto dodać osobny krok (np. `07`) na profil prod (build + serwowanie statyków) zamiast „upychać” to w ID‑T=04/05.
- `ut-angular/AGENTS.md` zawiera wiele opisów struktury aplikacji (moduły `admin/employees/...`, `app-routing.module.ts`, `e2e/`) które nie wynikają z planu baseline. To ryzyko „instrukcji niezgodnych z rzeczywistością” po bootstrapie, jeśli nie zostanie przycięte do minimum.

## P2 (usprawnienia)
- Doprecyzować nazewnictwo i ścieżki: rekomendacja `ut-angular/compose.yaml`, `ut-angular/docker/Dockerfile.dev`, serwis np. `gui`.
- Dodać `.dockerignore` w `ut-angular/` (przyspieszy build i ograniczy kontekst).
- W Makefile dodać cele pomocnicze (opcjonalnie): `shell`, `ps`, `build`, `clean` (np. `down -v`), `npm-ci` (jeśli potrzebne).
- W README dopisać szybki troubleshooting: port zajęty, brak hot reload (polling), problemy z uprawnieniami.

## Co dopisać / skorygować (konkret)
### `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/additional-contexts.md`
- W sekcji 4.3 „Pułapki” dopisać:
  - wymóg `--host 0.0.0.0` dla `ng serve` w kontenerze,
  - że `ng test` w kontenerze wymaga Chromium (albo alternatywnego runnera) i to jest element planu.
- W 3.5 (Kryteria) rozważyć zmianę lockfile na neutralny zapis: „lockfile właściwy dla PM (npm/pnpm/yarn)”.
- W 5.3 „Założenia” zmienić „package manager: npm” na „domyślnie npm, zależne od decyzji P3”.

### `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/tasks.md`
- W ID‑T=03 dopisać w opisie konkret: jak generujemy Angular w niepustym `ut-angular/` (np. temp dir + przeniesienie plików z zachowaniem `AGENTS*.md`).
- Dodać osobny ID‑T (np. `03-01` albo `04-01`) na „lint/test toolchain”:
  - konfiguracja lint w baseline (jeśli nie generuje się automatycznie),
  - zapewnienie testów w kontenerze (Chromium lub inny uzgodniony wariant),
  - dopiero potem `Makefile` ma wiązać się z realnymi skryptami.
- Jeśli P2=dev+prod: dodać nowy ID‑T na profil prod (z własnymi artefaktami i testami).

## Ryzyka
- Uprawnienia plików (root-owned) przy bind mount i instalacji zależności.
- File watching/HMR w zależności od FS; może wymagać polling (warto mieć toggle w compose/README).
- Czas pierwszego uruchomienia (instalacja deps w kontenerze) i stan wolumenów (node_modules cache).

## Brakujące testy/komendy (do ID‑T=06)
- `make -C ut-angular up` (serwer dostępny na hoście po zmapowanym porcie).
- `make -C ut-angular logs` (weryfikacja, że `ng serve` słucha na `0.0.0.0` i nie ma błędów).
- Hot reload: edycja pliku w `ut-angular/src/...` i obserwacja reload/HMR.
- `make -C ut-angular test` (jednorazowo, bez watch; w kontenerze).
- `make -C ut-angular lint`.
- Clean-state: `make -C ut-angular down` + wariant z czyszczeniem wolumenów (jeśli dodany).

[HANDOFF: 02, 03, 04, 05, 06]

