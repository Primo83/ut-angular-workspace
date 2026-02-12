Mam pełny obraz. Teraz przeprowadzam audyt planu.

---

# Audyt planu: 20260212-1353 – Wgranie najnowszego Angulara (docker compose)

**Audytor:** Claude (claude-opus-4-6)  
**Data:** 2026-02-12  
**Runda:** 20260212-1515 (runda 2 — po poprawkach z rundy 20260212-1448)

---

## Werdykt: **PASS**

**P0: 0 | P1: 0 | P2: 3**

---

## Uzasadnienie

### Kontekst rundy

Runda 20260212-1448 (2 subagenci) zgłosiła łącznie ~10 P0 i kilka P1. Po tej rundzie plan został **istotnie poprawiony** — `additional-contexts.md` zawiera teraz domknięte decyzje P1–P9, a `tasks.md` odzwierciedla te decyzje w opisach poszczególnych ID-T.

Sprawdzam punkt po punkcie, czy wcześniejsze blokery zostały zaadresowane:

---

### Weryfikacja wymagań z promptu audytu

| Wymaganie | Status | Gdzie w planie |
|-----------|--------|----------------|
| Docker-only (bez lokalnego Node) | OK | P4, ID-T=03 („bootstrap w kontenerze"), ID-T=04 |
| Host port 4299 | OK | AC sekcja 3.2 (G1), sekcja 3.5, ID-T=04 opis |
| Brak root-owned plików | OK | P5 (`user: ${UID}:${GID}`, `HOME=/tmp`, `NPM_CONFIG_CACHE=/tmp/.npm`), AC sekcja 3.5, checklista |
| `node_modules` w named volume | OK | P6 (bind mount kodu + named volume `/app/node_modules`, opcjonalnie `.angular/cache`) |
| Testy w kontenerze (Chromium, --watch=false) | OK | P7 (Chromium w dev obrazie, `CHROME_BIN`, `ng test --watch=false`), ID-T=04 opis |
| `ng serve --host 0.0.0.0` | OK | AC sekcja 4.3 (pułapki), ID-T=04 opis |
| Polling jako toggle | OK | P8 (domyślnie bez polling, toggle env `CHOKIDAR_USEPOLLING=1`, troubleshooting w README) |

### Weryfikacja P0 z rundy subagentów (20260212-1448)

| P0 z subagenta 1 | Rozwiązanie |
|---|---|
| Bootstrap w niepustym `ut-angular/` — brak metody | ID-T=03 opisuje: generowanie do katalogu tymczasowego + merge, w kontenerze z `--user $(id -u):$(id -g)` |
| Brak `--host 0.0.0.0` | Dodano w sekcji 4.3 + ID-T=04 |
| Brak Chromium / `--watch=false` | P7 + ID-T=04 |

| P0 z subagenta 2 | Rozwiązanie |
|---|---|
| Bootstrap vs Docker order + permissions | P5, ID-T=03 (bootstrap w kontenerze z UID/GID mapping) |
| Brak decyzji o root-owned | P5 (mechanizm: `user: "${UID}:${GID}"` w compose, `HOME=/tmp`) |
| Brak strategii `node_modules` | P6 (named volume) |
| Hot reload + host access | Sekcja 4.3 + ID-T=04 |
| Test runner (Chromium + non-watch) | P7 + ID-T=04 |

**Wszystkie P0 z rundy 1 zostały zaadresowane w planie.**

### Kolejność ID-T

| ID-T | Zależność | Ocena |
|------|-----------|-------|
| 01 | — | Plan i AC — logiczny start |
| 02 | 01 | Finalizacja toolchainu (wersje Node/Angular, nazwa compose) — musi być przed bootstrapem |
| 03 | 01 | Bootstrap Angular w kontenerze — logicznie po 02 (wersje ustalone) |
| 04 | 01 | Docker compose + Dockerfile — logicznie po 03 (jest co uruchamiać) |
| 05 | 01 | Makefile + README — logicznie po 04 |
| 06 | 01 | Weryfikacja E2E — musi być ostatnia |
| 07 | 02 | Opcjonalny profil prod — poza scope (P2=dev-only) |

Kolejność jest poprawna. Jedyna uwaga: zależność `Rodzic` w tabeli wskazuje `01` dla 02–06 i `02` dla 07, co jest poprawne (wszystkie wynikają z planu, 07 jest follow-upem 02).

**Każdy krok mieści się w jednej sesji** — żaden ID-T nie wymaga więcej niż: odczyt kontekstu + kilka plików + weryfikacja.

### Scenariusze AC/GWT

Trzy scenariusze (G1, G2, G3) pokrywają: uruchomienie, hot reload, testy+lint. To wystarczający zakres dla taska infrastrukturalnego.

---

## P2 (nieblokujące uwagi)

**P2-1: Brak `.dockerignore` w planie**  
Żaden ID-T nie wspomina o utworzeniu `ut-angular/.dockerignore`. Bez niego `docker build` kopiuje niepotrzebne pliki (np. `.git`, `node_modules` z hosta jeśli kiedyś powstanie). Sugestia: dodać wzmiankę w ID-T=04.

**P2-2: ID-T=07 (profil prod) — brak jawnego zamknięcia**  
P2 mówi „scope = dev-only", ale ID-T=07 ma status `proposal` zamiast jawnego oznaczenia „out-of-scope / on-hold". Sugestia: przy zamykaniu ID-T=01 oznaczyć 07 jako `on-hold` z adnotacją „poza zakresem tego taska (decyzja P2)".

**P2-3: Brak wzmianki o `npm ci` vs `npm install`**  
Plan nie precyzuje, czy w Dockerfile (i przy bootstrap) używać `npm ci` (deterministyczne, z lockfile) czy `npm install`. Dla powtarzalności rekomendowane `npm ci` po wygenerowaniu lockfile. Sugestia: dodać notatkę w ID-T=04 lub ID-T=02.

---

## Podsumowanie

Plan po poprawkach z rundy 1 jest **spójny, wykonalny i domyka wszystkie kluczowe decyzje** (P1–P9). Wcześniejsze P0 subagentów zostały zaadresowane konkretnymi mechanizmami (UID/GID, named volumes, Chromium, `--host 0.0.0.0`, bootstrap w kontenerze do tmp + merge). Kolejność ID-T jest logiczna, każdy krok jest atomowy. Trzy P2 to usprawnienia, nie blokery.

---

Czy chcesz, żebym zapisał ten raport do `agents-tasks-knowledge/tasks/20260212-1353-wgranie-najnowszego-angulara-docker-compose_proposal/additional-notes/20260212-1515-plan-audit-claude.md`?
