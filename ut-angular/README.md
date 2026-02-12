# ut-angular

Baseline Angular uruchamiany **Docker-only** (bez lokalnej instalacji Node).

## Start (Docker-only)

1. `make -C ut-angular up`
2. Otwórz `http://localhost:4299/`

## Komendy

- `make -C ut-angular logs`
- `make -C ut-angular down`
- `make -C ut-angular clean` (usuwa volumes, w tym `node_modules`)
- `make -C ut-angular test` (non-watch)
- `make -C ut-angular lint`

## Toolchain (przypięte na moment bootstrapu)

- Angular CLI: `21.1.4`
- Node (dev image): `node:22.22.0-bookworm-slim` (`ut-angular/docker/Dockerfile.dev`)
- Compose: `ut-angular/compose.yaml` (host port `4299` -> container `4200`)

## File watching / HMR (gdyby nie łapało zmian)

Domyślnie powinno działać bez polling. Jeśli na Twoim FS watchery nie łapią zmian:

```bash
CHOKIDAR_USEPOLLING=1 make -C ut-angular up
```

Opcjonalnie:

```bash
CHOKIDAR_USEPOLLING=1 CHOKIDAR_INTERVAL=250 make -C ut-angular up
```
