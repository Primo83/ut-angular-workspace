# ID-T 05 - Live indexing

Status: planned
Owner: gui-1

## Cel
Pokazac dokladanie dokumentow w locie bez restartu aplikacji.

## Scenariusz demo (krok po kroku)
1. Otworz sekcje "Live indexing".
2. Wpisz dokument:
   - id: 9901
   - title: "Jak dziala async indexing"
   - text: "Dodawanie dokumentow partiami zmniejsza przyciecia UI"
   - tags: ["performance", "beginners"]
   - category: "examples"
3. Kliknij "Dodaj dokument".
4. Wpisz fraze "async indexing" w glowne wyszukiwanie.
5. Sprawdz, ze nowy dokument pojawil sie bez restartu strony.
6. Kliknij "Replace" i zmien tekst dokumentu.
7. Wyszukaj ponownie i potwierdz aktualizacje wyniku.

## Kryteria akceptacji
- [ ] Dodanie dokumentu aktualizuje wyniki natychmiast.
- [ ] Replace aktualizuje dokument bez restartu.
- [ ] Dziala w scenariuszu manualnym `agent-browser`.
- [ ] Istnieje test komponentowy dla add/replace.

## Dowody
- `additional-notes/09-manual.md` (manual)
- `additional-notes/08-tests.md` (automaty)
