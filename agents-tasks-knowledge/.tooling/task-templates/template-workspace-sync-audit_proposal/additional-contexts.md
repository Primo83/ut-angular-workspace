# <ID-Z>_in-progress – sync-audit instrukcji po sync

> Ten task powstał automatycznie po `render.py --mode sync`, gdy wykryto różnice w `origin-*` i startuje jako `_in-progress`.
> Cel: ręczny audyt instrukcji `AGENTS/CLAUDE/GEMINI.md` i doprowadzenie ich do spójności z repo.

## Jak używać tego pliku (krótko)
- Subtaski „Audyt instrukcji” są checklistą per plik – realizuj je pojedynczo.
- Wszystkie poprawki zapisuj **bezpośrednio** w instrukcjach (user-owned), nie w `origin-*`.
- Jeśli potrzebujesz notatek: użyj `additional-notes/<ID-T>.md`.

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

## Auto-merge (manualne, wykonywane przez agenta)
Auto-merge to **ręczne** zastosowanie zmian `old-origin` → `origin` na plikach user-owned. `render.py` niczego nie stosuje automatycznie.

### Wejście i format diff
- Pliki: `O0` = `old-origin-*`, `O1` = `origin-*`, `U` = user-owned.
- Diffy:
  - `A = diff(O0 → O1)` (upstream z generatora),
  - `B = diff(O0 → U)` (lokalne zmiany użytkownika).
- Format: unified diff (`diff -u`); liczenie „linii zmienionych” tylko z linii `+` i `-` (bez kontekstu/nagłówków).
- Jeśli plik jest pusty, brakujący albo nie jest UTF-8 (np. problem z BOM) → **manual** + pytanie do użytkownika.

### Reguły kolizji (manual)
1) **Overlap hunks**: hunk z `A` nachodzi na hunk z `B` w tych samych liniach `O0`.
2) **Wstawienie przy zmienionym kontekście**: `A` wstawia w obszarze hunka `B` lub w jego kontekście ±3 linie.
3) **Usunięcie zmienionych linii**: `A` usuwa linie zmienione w `B`.
4) **Sekcje krytyczne** (zawsze manual; dopasowanie case-insensitive, tylko nagłówki Markdown #/##/###/####; dopasowanie jako fragment nagłówka, np. „deploy” w „deployment”):  
   `bezpieczenstwo`, `ryzyko`, `runbook`, `deploy`, `migracje`, `secret`, `secrets`, `env`, `dane`,  
   `production`, `destrukcyjne`, `do not`, `never`, `credentials`, `api key`, `token`, `password`,  
   `auth`, `private`, `sensitive`.

### Reguły rozmiaru (manual)
- Jeśli |A| > 100 linii (suma `+` i `-`) **lub** liczba hunków > 8 → manual.

### Warunek auto-merge
- Brak kolizji (reguły 1–4) **i** mieści się w limitach rozmiaru.

### Jak wykonać auto-merge
- Preferowane: `git apply --3way` na patchu `A` (wymaga `.git/`).
- Jeśli brak `.git/` lub patch nie wchodzi czysto → `diff3` (O0/O1/U); ostateczny fallback: python `difflib`.
- Jeśli patch nie aplikuje się czysto → **manual**.

### Interfejs manual (kolizje / wątpliwości)
- Zawsze twórz `additional-notes/<ID-T>-conflict.md` + pytanie do użytkownika w rozmowie.

---

## Drzewko decyzji (auto vs manual)
1) Brakujący/pusty/nie-UTF-8 plik? → **manual** + pytanie.
2) Sekcje krytyczne lub kolizje wg reguł? → **manual**.
3) Przekroczone limity (100 linii / 8 hunków)? → **manual**.
4) W przeciwnym razie: spróbuj auto-merge.
5) Jeśli auto-merge nie wchodzi czysto → **manual**.

---

## Wzór notatki (auto-merge „light”)
```
# <ID-T>.md
Plik: <SCIEZKA_REL>
A (O0 → O1): diff -u <old-origin> <origin>
B (O0 → U): diff -u <old-origin> <user-owned>

Streszczenie zmian:
- ...

Decyzja:
- auto-merge (A na U)

Handoff:
- ...

Open questions:
- ...

Opcjonalnie: jeśli diff <= 100 linii, możesz wkleić go poniżej.
```

---

## Wzór pliku konfliktu
```
# <ID-T>-conflict.md
Plik: <SCIEZKA_REL>
Powód konfliktu: ...

Propozycje rozstrzygnięcia:
1) ...
2) ...

Diffy:
- A (O0 → O1): diff -u <old-origin> <origin>
- B (O0 → U): diff -u <old-origin> <user-owned>

Instrukcja dla użytkownika:
- wybierz wariant 1/2 lub podaj własne rozstrzygnięcie.
```

---

## Definition of Done (sync-audit)
Po zakończeniu tego taska:
- wszystkie subtaski audytu mają status `done`,
- instrukcje są spójne z repo i nie zawierają niepewnych komend,
- jeśli były zmiany w instrukcjach – wykonano sync i `doctor.py` jest „green”,
- ryzyka/niejasności są zapisane w `additional-notes/`.

---

## Notatki / ryzyka (opcjonalnie)
- RRRR-MM-DD – ...
