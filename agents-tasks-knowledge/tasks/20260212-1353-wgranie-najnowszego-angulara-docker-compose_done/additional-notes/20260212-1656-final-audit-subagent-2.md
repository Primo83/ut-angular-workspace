# FINAL AUDIT implementacji (subagent-2)

Task: `20260212-1353-wgranie-najnowszego-angulara-docker-compose_in-progress`  
Zakres wejścia: `ut-angular/compose.yaml`, `ut-angular/docker/Dockerfile.dev`, `ut-angular/Makefile`, `ut-angular/README.md`, `ut-angular/package.json`

## Werdykt

PASS  
P0: 0 | P1: 0 | P2: 7

## Punkty audytu (DX / reproducibility / wolumeny / shell / Makefile)

- OK: `ut-angular/docker/Dockerfile.dev` jest przypięty do konkretnego obrazu `node:22.22.0-bookworm-slim`, a `package.json` deklaruje `packageManager: npm@10.9.4` (spójne z obrazem) -> dobra baza pod powtarzalne środowisko.
- OK: strategia wolumenów w `ut-angular/compose.yaml` (bind mount projektu + named volume na `/app/node_modules`) jest sensowna dla Docker-only DX i minimalizuje ryzyko przypadkowego commitowania zależności.
- OK: uprawnienia do `/app/node_modules` są świadomie „rozluźnione” w dev obrazie (`chmod 0777` w `ut-angular/docker/Dockerfile.dev:15-16`), co realnie usuwa klasę problemów EACCES przy `user: UID:GID` (w praktyce: wolumen inicjalizuje się jako root:root, ale jest zapisywalny).
- [P2] Footgun DX: `ut-angular/compose.yaml:9` ma `user: "${UID}:${GID}"`, ale `UID/GID` nie są domyślnie eksportowanymi zmiennymi środowiskowymi (nawet jeśli powłoka ma `$UID`). W efekcie `docker compose up` uruchomione „bez Makefile” ostrzega i kończy z `user: ':'`. Rekomendacja: dopisać jawnie w `ut-angular/README.md`, że wspierany entrypoint to `make ...`, albo dodać bezpieczne wartości domyślne w compose (z opisem trade-off).
- [P2] Odporność na shell: `ut-angular/compose.yaml:20` wymusza `bash -lc`, a `ut-angular/Makefile:34` daje `make sh` jako `bash`. Obecnie działa (obraz Debiana ma bash), ale to zależność zbędna. Rekomendacja: preferować exec-form bez shella, np. `command: ["npm","run","start","--","--host","0.0.0.0","--port","4200"]` (mniej rzeczy do „zepsucia”).
- [P2] DX/performance: `ut-angular/Makefile:18` wiąże `up` z `deps`, a `deps` uruchamia `npm ci` (fresh install) przy każdym `make up`. To jest poprawne, ale kosztowne. Rekomendacja: rozdzielić na `up` (bez reinstalla) + `deps`/`up-fresh` (wymusza reinstall) albo dodać jawny target typu `refresh-deps`.
- [P2] Czytelność: `ut-angular/Makefile:8-10` tworzy hostowy katalog `node_modules`, mimo że runtime używa named volume na `/app/node_modules`. To może sugerować, że zależności będą na hoście, a nie będą. Rekomendacja: usunąć to albo dopisać krótką notkę w `README.md` po co ten katalog istnieje (jeśli jest potrzebny dla IDE).
- [P2] Reproducibility: przypięcie obrazu po tagu (`node:22.22.0-bookworm-slim`) jest zwykle OK, ale nie jest „bit-perfect” (digest może się zmienić przy rebuildach security). Jeśli wymagacie twardej powtarzalności w CI: rozważyć pin po digest.
- OK: `ut-angular/compose.yaml:14-16` przewiduje problemy z watcherami i daje prosty toggle przez `CHOKIDAR_USEPOLLING/INTERVAL`; `ut-angular/README.md:24-36` to dokumentuje w formie gotowych komend.
- [P2] Dokumentacja DX: `ut-angular/README.md` jest zwięzły i użyteczny, ale warto dopisać explicite wymagania (`docker` + `docker compose` v2) oraz ostrzeżenie, że `docker compose ...` bez `UID/GID` nie jest wspieranym trybem (żeby uniknąć pierwszego potknięcia).

