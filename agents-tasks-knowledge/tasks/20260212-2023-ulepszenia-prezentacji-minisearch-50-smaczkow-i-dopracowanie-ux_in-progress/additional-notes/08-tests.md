# ID-T 08 - Testy automatyczne + lint

Status: done
Owner: gui-1

## Zakres testow
- Routing: `/` redirects to `/minisearch`, `/minisearch` route istnieje.
- Komponent: loading state, hero, search input, code snippets, comparison table, 6 use case cards.
- Skrot klawiszowy: `Alt+Shift+M` fokusuje input, `Ctrl+K` NIE fokusuje (brak kolizji z Chrome).
- Shortcut hint: widoczny w DOM z tekstem "Alt", "Shift", "M".
- Search controls: prefix/fuzzy/boost/combine/filter toggle (testy serwisu).
- Serwis: 20 testow pokrywajacych search, fuzzy, prefix, boosting, highlighting, autoSuggest, categories, facets.
- Error state: fetch failure = error state.

## Wyniki (2026-02-12 21:30)

### `make -C ut-angular lint`
```
All files pass linting.
```

### `make -C ut-angular test`
```
Test Files:  3 passed (3)
     Tests:  35 passed (35)
  Duration:  2.84s
```

### Rozbicie testow
| Plik | Testy | Status |
|---|---|---|
| `src/app/app.spec.ts` | 2 | PASS |
| `src/app/minisearch/minisearch-page.component.spec.ts` | 13 | PASS |
| `src/app/minisearch/minisearch-search.service.spec.ts` | 20 | PASS |

### Nowe testy dodane w tej sesji
1. `should focus search input on Alt+Shift+M` — symuluje event `keydown` z `altKey+shiftKey+M`, weryfikuje `document.activeElement === input`.
2. `should NOT focus search input on Ctrl+K` — potwierdza brak kolizji z Chrome.
3. `should show keyboard shortcut hint` — sprawdza widocznosc `.ms-shortcut-hint` z tekstem kbd.

## Mapowanie na wymagania
- 50 smaczkow -> testy serwisu (prefix, fuzzy, boosting, combine, filter, autoSuggest, categories, facets, highlighting) + komponentow (search input, controls, results, snippets, table, use cases).
- Skrot klawiszowy -> 2 dedykowane testy (pozytywny Alt+Shift+M + negatywny Ctrl+K).
- "100%" -> lint PASS + 35/35 test PASS.

## Komendy
- `make -C ut-angular lint`
- `make -C ut-angular test`

## Wnioski dla kolejnych krokow

[HANDOFF: 09]

- **Dla ID-T 09**: testy automatyczne sa kompletne i zielone. Pozostaje: testy manualne `agent-browser` (scenariusz demo), dowody w `additional-notes/09-manual.md`, finalne audyty, zamkniecie taska.
