# ID-T 06 - Tooltipy i a11y

Status: planned
Owner: gui-1

## Cel
Kazdy interaktywny element ma prosty tooltip i jest dostepny klawiatura oraz na mobile.

## Wymagania techniczne
- Tooltip widoczny na hover (desktop).
- Tooltip widoczny na focus (klawiatura).
- Tooltip dostepny na touch (tap lub info icon).
- Powiazanie przez `aria-describedby`.
- Czytelny kontrast i brak zaslaniania glownej akcji.

## Test matrix
- Keyboard only:
  - [ ] TAB przechodzi po elementach z tooltipem.
  - [ ] ENTER/SPACE nie psuje focusa.
  - [ ] ESC chowa tooltip (jesli otwierany interaktywnie).
- Screen reader:
  - [ ] `aria-describedby` wskazuje tekst tooltipa.
- Mobile:
  - [ ] Tooltip da sie otworzyc tapem.
  - [ ] Tooltip nie zaslania kluczowego przycisku.
- Content:
  - [ ] Tooltip zgodny z copy-guide dla laika.

## Dowody
- Testy komponentowe: `additional-notes/08-tests.md`
- Manual browser: `additional-notes/09-manual.md`

## Zakres kontrolny (co najmniej)
- Input wyszukiwarki + clear button.
- Toggle: prefix, fuzzy, combine mode.
- Akcje live indexing: add, addAllAsync, replace, discard.
- Akcje snapshot: save, load.
