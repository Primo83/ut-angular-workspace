# <ID-Z>_proposal – bootstrap workspace

> Ten task powstał automatycznie przy inicjalizacji workspace.  
> Cel: dopiąć konfigurację + runbook tak, żeby agent mógł pracować przewidywalnie w tym projekcie, bez dopytywania o podstawy.

## Jak używać tego pliku (ważne, proste)

**Źródło prawdy:** `project.yaml`
- Jeśli coś dotyczy *komponentów/komend/narzędzi* → popraw to w `project.yaml`, a potem zrób `sync`.
- Ten plik służy do: **potwierdzeń**, **wyjątków**, **ryzyk**, **bezpiecznych zasad uruchamiania**, **decyzji** i **blokad**.

**Zasada minimalnych pytań:** agent najpierw próbuje sam:
- przeczytać `project.yaml`,
- przejrzeć repo (README/Makefile/package.json/etc.),
- dopiero potem zadaje pytania — tylko blokujące albo wysokiego ryzyka.

---

## 0. Snapshot z `project.yaml` (auto‑generated)
<!-- AUTO-INSERT: bootstrap -->

### 0.1 Co zrobić teraz (5 minut)
- [ ] Potwierdź `project.name` i `project.structure`.
- [ ] Potwierdź listę komponentów i katalogi (czy „BRAK” jest spodziewany).
- [ ] Jeśli „BRAK”, bo repo nie jest checkoutowane → wpisz w sekcji 6: kto/ kiedy zapewni repo i gdzie będzie.
- [ ] Jeśli „BRAK”, bo config jest zły → popraw `project.yaml` (to jedyne miejsce, gdzie poprawiamy katalogi).
- [ ] Jeśli auto‑sekcja wypluła „Open questions” → odpowiedz w sekcji 6 i usuń/odhacz je (żeby nie wracały).

---

## Metoda pracy (audyt instrukcji)
Cel: każdy plik `AGENTS/CLAUDE/GEMINI.md` ma być spójny z realnym repo, precyzyjny i bezpieczny dla agenta.

**Kanał dostarczenia instrukcji:** ta sekcja + krótki link w opisie subtaska (np. „Patrz: additional-contexts.md -> Metoda pracy”).

Checklistę wykonuj **osobno dla każdego pliku** (subtask = 1 plik):

1) **Zakres i kontekst**
   - Potwierdź, do jakiej części repo odnosi się instrukcja (root / komponent / subdir / agents-tasks-knowledge).
   - Zweryfikuj, że adresat i zakres są jasno opisane na początku pliku (kto i do czego ma używać instrukcji).

2) **Ścieżki i struktura repo**
   - Sprawdź, czy wszystkie ścieżki/katalogi istnieją i są aktualne.
   - Zweryfikuj nazwy katalogów komponentów (np. `apis/`, `gui/`, `tools/scripts/`), brak starych aliasów.
   - Upewnij się, że ścieżki są względne względem root lub jasno zdefiniowanego katalogu bazowego.

3) **Komendy i skrypty**
   - Zweryfikuj, że wszystkie polecenia istnieją (Makefile targets, `package.json` scripts, `pyproject`, `docker-compose`, itp.).
   - Usuń lub oznacz niepewne komendy (np. brak Makefile -> pytanie/komentarz).
   - Dodaj minimalny „happy path” (build/test/run) i jasno odróżnij optional/advanced.

4) **Wymagania środowiskowe**
   - Sprawdź wersje narzędzi/środowiska (Python/Node/Java/Docker) i czy są realistyczne.
   - Zweryfikuj, czy instrukcja wymaga specjalnych zmiennych env, tokenów, kluczy — jeśli tak, zostaw tylko placeholdery.

5) **Przykłady i fragmenty**
   - Każdy przykład musi być poprawny składniowo i aktualny z repo.
   - Unikaj „magicznych” nazw; jeśli coś jest przykładowe, oznacz to wyraźnie.

6) **Bezpieczeństwo i ryzyko**
   - Usuń/oznacz komendy destrukcyjne (np. `rm -rf`, migracje produkcyjne).
   - Dodaj ostrzeżenia przy operacjach nieodwracalnych lub kosztownych.

7) **Linki i odwołania**
   - Zweryfikuj, że wszystkie linki do plików w repo działają.
   - Jeśli odwołujesz się do README/AGENTS w innym katalogu — upewnij się, że ścieżka jest poprawna.

8) **Spójność i styl**
   - Zgodność językowa (PL), brak sprzecznych instrukcji.
   - Spójny styl sekcji i nazewnictwa (ten sam układ w AGENTS/CLAUDE/GEMINI).

9) **Wynik subtaska**
   - Zapisz poprawki bezpośrednio w pliku instrukcji.
   - Jeśli potrzebne, dodaj krótką notatkę w `additional-notes/<ID-T>.md` (co poprawiono i co wymaga uwagi).
   - Odhacz subtask jako `done`.

---

## 1. Definition of Done (DoD) dla bootstrapu
Po zakończeniu tego taska:
- agent potrafi uruchomić **minimalny happy path dev**,
- agent wie, jak uruchomić **testy i lint** (albo ma jasno zapisane „brak / TBD”),
- agent wie, **czego nie wolno uruchamiać bez potwierdzenia**,
- jest jasne, jakie **MCP/narzędzia/dostępy** są wymagane,
- jest jasny **layout repo** (single/mono/multi) i jak uruchamiać komendy w odpowiednich katalogach,
- `doctor.py` przechodzi bez błędów.

---

## 2. Kontrakt bezpieczeństwa (co agent może robić „bez pytania”)

### 2.1 Twarde ograniczenia
Agent **nie** robi bez jawnego polecenia człowieka:
- destrukcyjnych operacji na danych/volume’ach (np. drop DB, `down -v`, kasowanie storage),
- deploy/publikacji artefaktów,
- migracji na środowiskach innych niż lokalne/testowe,
- żadnych operacji „na produkcji”.

Jeśli agent nie ma pewności czy komenda jest bezpieczna → traktuje ją jako **CONFIRM**.

### 2.2 Klasyfikacja komend (wpisz tylko wyjątki)
Nie powielamy komend z `project.yaml`. Tu zapisujemy **zasady bezpieczeństwa**.

| Komponent | SAFE (bez pytania) | CONFIRM (zanim uruchomi) | DESTRUCTIVE (nigdy bez człowieka) |
|---|---|---|---|
| (np. api) |  |  |  |
| (np. gui) |  |  |  |
| (np. scripts) |  |  |  |

> Jeśli nie masz czasu: uzupełnij kolumny **CONFIRM** i **DESTRUCTIVE**.  
> Reszta domyślnie = CONFIRM, dopóki nie będzie potwierdzona w praktyce.

---

## 3. Layout repo i nawigacja (żeby agent nie błądził)
- Struktura wg `project.yaml`: `single` / `monorepo` / `multirepo`: **...**
- Gdzie jest root każdego repo (jeśli multirepo):
    - `api`: ...
    - `gui`: ...
    - inne: ...
- Zasada uruchamiania:
    - multirepo: komendy uruchamiamy w katalogu komponentu (`make -C ...`, `git -C ...`),
    - monorepo: komendy uruchamiamy z root (np. `pnpm -w`, `nx`, `turbo`).

---

## 4. Minimalny „happy path” (1–3 kroki)
Wpisz **najkrótszą** ścieżkę startu dla developerki. Kolejność ma znaczenie.

1) ...
2) ...
3) ...

**Typowe pułapki / uwagi (konkretne):**
- wersje toolchain (Node/Python/PHP/Java/etc.): ...
- wymagane pliki `.env` / sekrety: ...
- porty i konflikty: ...

---

## 5. MCP / narzędzia / dostępy (minimum)
- Minimalny zestaw MCP (co jest faktycznie potrzebne):
    - DB: ...
    - Browser (Playwright): ...
    - DevTools: ...
- Ograniczenia dostępu:
    - VPN/proxy: ...
    - registry (npm/composer/docker): ...
- Sekrety:
    - gdzie są i jak je pozyskać bezpiecznie (bez wklejania wartości do czatu): ...

---

## 6. Pytania blokujące (minimum)
> Pełna lista jest w `additional-notes/question-bank.md`. Tu trzymamy tylko realne blokery.

- [ ] Czy repo jest dostępne lokalnie/na CI? Jeśli nie: kto i kiedy zapewni checkout + gdzie będzie katalog?
- [ ] Czy istnieje sandbox/test DB, na którym wolno odpalać migracje i testy integracyjne?
- [ ] Jakie komendy są potencjalnie destrukcyjne lub kosztowne? (wpisz do tabeli w sekcji 2.2)
- [ ] Czy agent może instalować zależności lokalnie (npm/composer/pip), czy tylko opisywać kroki?
- [ ] Czy są ograniczenia bezpieczeństwa/prawne (np. zakaz wynoszenia kodu/logów)?

---

## 7. Decyzje i uzasadnienia (żeby nie wracać)
- RRRR-MM-DD – **Decyzja:** ... **Uzasadnienie:** ... **Konsekwencje:** ... **Alternatywy:** ...

---

## 8. Ustalenia z rozmów (Q&A / notatki)
- RRRR-MM-DD – ...

---

## 9. Brief do `tasks.md` (dla planu technicznego)
- Najważniejsze niewiadome + kto odpowiada: ...
- Sugerowany podział pracy na agentów: ...
- Ryzyka: ...
