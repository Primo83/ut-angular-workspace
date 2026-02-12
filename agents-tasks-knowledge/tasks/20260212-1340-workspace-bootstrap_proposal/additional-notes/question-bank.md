# Question bank – bootstrap onboarding (aktywny wywiad)

To jest **bank pytań**, nie checklista do przejścia w całości.  
Zadaj tylko to, czego **nie da się**:
- wywnioskować z `project.yaml`,
- znaleźć w repo (README/Makefile/package.json/etc.),
- bezpiecznie sprawdzić bez ryzyka.

**Gdzie zapisujemy odpowiedzi?**
- komendy / komponenty / MCP → `project.yaml` (źródło prawdy),
- bezpieczeństwo, wyjątki, „czego nie wolno” → `additional-contexts.md` (sekcja 2),
- minimalny happy path → `additional-contexts.md` (sekcja 4),
- blokery → `additional-contexts.md` (sekcja 6),
- decyzje → `additional-contexts.md` (sekcja 7).

---

## Jak pytać (format „genialny w prostocie”)
Zawsze:
1) co już wiemy (z `project.yaml`/repo),
2) proponowany default,
3) 1–3 opcje wyboru,
4) co zrobimy, jeśli brak odpowiedzi (bezpieczny fallback).

Szablon (kopiuj/wklej do rozmowy):
> W `project.yaml` widzę: **{fakt}**.  
> Proponuję: **{default}**.  
> Potwierdzasz? Jeśli nie, wybierz:
> A) ...
> B) ...
> C) ...
> (Jeśli brak odpowiedzi: przyjmę **{fallback}** i zapiszę to w `additional-contexts.md`.)

---

## MUST – pytania blokujące (zawsze rozważ)

### A) Dostęp i bezpieczeństwo
- [ ] Czy agent może uruchamiać środowisko lokalnie (Docker/Compose) i instalować zależności (npm/composer/pip)?
- [ ] Czy istnieje bezpieczne środowisko testowe / sandbox DB? Jak je rozpoznać?
- [ ] Jakie komendy są destrukcyjne lub kosztowne? (drop DB, reset, purge, reindex, full seed itp.)
- [ ] Czy są ograniczenia bezpieczeństwa/prawne (dane wrażliwe, NDA, zakaz wynoszenia logów)?
- [ ] Czy agent może uruchamiać testy integracyjne/e2e, czy tylko unit?

### B) Repo / struktura workspace
- [ ] Czy to `single`, `monorepo` czy `multirepo`? Jeśli multi: gdzie są repozytoria i jak je rozpoznać (`.git/`)?
- [ ] Czy katalogi komponentów w `project.yaml` są na pewno poprawne?
- [ ] Czy są dodatkowe komponenty, których nie ma w configu (np. `infra/`, `mobile/`, `docs/`)?

### C) Minimalny happy path (żeby agent mógł zacząć)
- [ ] Jak odpalić minimalny dev flow (kolejność, porty, zależności)?
- [ ] Skąd wziąć `.env`/sekrety i jak je bezpiecznie przekazać (bez wklejania wartości)?
- [ ] Jaka jest wymagana wersja toolchain (Node/PHP/Python/Java/Docker)?

### D) Testy / jakość (minimum)
- [ ] Jaki jest najszybszy sanity-check po zmianach (komenda/target <= kilka minut)?
- [ ] Czy testy wymagają usług zewnętrznych (DB, redis, S3, queue)? Jak je uruchomić?

---

## NICE – pytania doprecyzowujące (tylko jeśli potrzebne)

### E) CI/CD i definicja „zielono”
- [ ] Jak wygląda pipeline CI (co musi przejść, co jest opcjonalne)?
- [ ] Czy są pre-commit hooks / format on save / wymagany formatter?
- [ ] Czy PR musi mieć określony zestaw testów?

### F) Architektura i granice zmian
- [ ] Czy są „zakazane” obszary (legacy, vendor, generated code)?
- [ ] Czy są standardy architektoniczne (DDD, hexagonal, CQRS)?
- [ ] Czy zmiany wymagają zgody (ADR, review konkretnej osoby)?

### G) Dane i migracje
- [ ] Jak wygląda seed danych (czy jest wymagany, czy ciężki)?
- [ ] Jak rozpoznać migracje „bezpieczne” vs ryzykowne?
- [ ] Czy wolno wykonywać migracje automatycznie w dev?

### H) Observability i debug
- [ ] Gdzie są logi (lokalnie/CI) i jak je odczytywać?
- [ ] Czy jest APM / Sentry / tracing? Czy agent ma dostęp?

---

## Pytania per typ komponentu (używaj selektywnie)

### API / backend
- [ ] Framework + wersja (czy to na pewno zgodne z `project.yaml`)?
- [ ] Jak uruchomić API lokalnie (port, DB, cache)?
- [ ] Jak uruchomić testy unit vs integration? Czy są osobne targety?
- [ ] Czy są migracje DB? Jak zrobić reset w dev (i czy wolno)?
- [ ] Jakie są standardy lint/format (phpcs, php-cs-fixer, eslint, black, gofmt, etc.)?

### GUI / frontend
- [ ] Jakie jest narzędzie budowania (vite/webpack/angular-cli/next)?
- [ ] Jak uruchomić dev server i jakie są porty?
- [ ] Czy są testy unit (jest/jest?) i e2e (Cypress/Playwright)?
- [ ] Czy są kontrakty z API (OpenAPI, mocki, MSW)? Skąd je brać?

### Scripts / narzędzia pomocnicze
- [ ] Jaki jest runtime (bash/python/node)? Wersje?
- [ ] Czy skrypty mają „dry-run”? Jak odpalać bez ryzyka?
- [ ] Czy skrypty dotykają danych produkcyjnych?

### Nx / apps (jeśli jest)
- [ ] Czy komendy uruchamiamy z root (nx/pnpm workspace)?
- [ ] Jakie są nazwy appów i gdzie jest ich konfiguracja (`project.json`)?
- [ ] Jak uruchomić lint/test/build dla konkretnej app?

---

## Jeśli agent nie ma dostępu do repo / środowiska (co poprosić do wklejenia)
Poproś właściciela o wklejenie (wystarczy skrót/fragmenty):
- `project.yaml` (lub sekcje `project`, `components`, `mcp_servers`)
- struktura katalogów: `ls -la` w root + w katalogach komponentów
- spis komend:
    - Makefile: lista targetów (`make help` jeśli istnieje) lub fragmenty Makefile
    - Node: `package.json` (sekcja `scripts`)
    - inne: README z instrukcją uruchomienia

---

## Mini‑ankieta (10 pytań) – gotowa do wysłania właścicielowi
Skopiuj ten blok do rozmowy, jeśli musisz szybko zebrać minimum:

> 1) Czy agent może uruchamiać Docker/Compose i instalować zależności lokalnie? (Tak/Nie/Ograniczenia)
> 2) Czy jest sandbox/test DB? Jak go rozpoznać?
> 3) Jakie komendy są destrukcyjne lub kosztowne (nigdy bez potwierdzenia)?
> 4) Najkrótszy happy path dev (1–3 kroki) – proszę podaj dokładne komendy.
> 5) Skąd wziąć `.env`/sekrety (bez wklejania wartości)?
> 6) Wymagane wersje toolchain (Node/PHP/Python/Java/Docker)?
> 7) Najszybszy sanity-check po zmianach (test/lint) – komenda/target.
> 8) Czy testy wymagają usług zewnętrznych (DB/redis/etc.)? Jak je odpalić?
> 9) Czy to single/mono/multirepo? Jeśli multi: gdzie są repozytoria?
> 10) Czy są ograniczenia bezpieczeństwa/prawne (dane wrażliwe, NDA, zakaz logów)?

Po odpowiedziach: aktualizuję `project.yaml` i dopisuję wyjątki/bezpieczeństwo do `additional-contexts.md`.
