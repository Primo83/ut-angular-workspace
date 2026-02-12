# ID-T 52 — Audyt inspiracji floating-toc

Status: done

## Kontekst
- Uwaga właściciela była trafna: lista na stronie wyglądała jak wdrożenie 1:1.
- Celem audytu było rozdzielenie:
  - co już mamy i ma sens utrzymywać,
  - co jest tylko inspiracją i na teraz nie wnosi najlepszej relacji koszt/efekt.

## Macierz decyzji (inspiracja -> stan u nas)

| Inspiracja z floating-toc | Stan w `/minisearch` | Dowód w kodzie | Decyzja produktowo-techniczna |
|---|---|---|---|
| `buildSearchIndex(...)` | `TAK` (ekwiwalent) | `minisearch-search.service.ts:207` (`indexDocuments`) | Trzymamy. To serce wydajności i skalowania wyszukiwarki. |
| `toSearchResult(...)` | `TAK` (ekwiwalent) | `minisearch-search.service.ts:457` (`raw.map -> EnrichedResult`) | Trzymamy. Potrzebne do spójnego modelu UI i łatwego rozszerzania pól. |
| `buildSnippet(...)` | `TAK` (ekwiwalent) | `minisearch-search.service.ts:866` (`snippet`) + użycie `:466` | Trzymamy. Krótki kontekst znacząco poprawia trafność odbieraną przez użytkownika. |
| `stripHtml(...)` | `NIE` | brak funkcji w serwisie | Odkładamy. Nasz dataset jest już plain text; czyszczenie HTML dziś nie dodaje wartości. |
| `normalize(...)` | `TAK` (ekwiwalent) | `minisearch-search.service.ts:319` (`stripDiacritics`), `:841` (`normalizeForHighlight`) | Trzymamy. Lepsze dopasowania dla PL i mniejsza wrażliwość na zapis. |
| `tokens(...)` | `TAK` (ekwiwalent) | `minisearch-search.service.ts:261` (`tokenize`), `:275` (`processTerm`) | Trzymamy. Bez tego nie ma kontroli nad precyzją i jakością dopasowania. |
| `ngramsFor(...)` | `NIE` | brak funkcji n-gram | Odkładamy. Mamy już `fuzzy + prefix`; n-gramy zwiększyłyby koszt indeksu i złożoność. |
| `buildNgramsField(...)` | `NIE` | brak pola n-gram | Odkładamy. Najpierw potrzebny realny przypadek, którego nie pokrywa obecna konfiguracja. |
| `getStepContentPlainText(...)` | `NIE` | brak funkcji | Odkładamy. Potrzebne dopiero gdy zaczniemy indeksować kroki/sekcje z treści HTML-rich. |
| `buildSectionFreshness(...)` + `evaluateStepFreshness(...)` | `NIE` | brak logiki freshness | Odkładamy. W obecnym demo brak wiarygodnego `updatedAt/changelog`; freshness byłby sztuczny. |

## Co uznaliśmy za najbardziej przydatne na teraz
- Budowa indeksu + mapowanie wyniku + snippet.
- Normalizacja i tokenizacja (w tym custom/split pipeline).
- Custom highlight exact/fuzzy i linki do dokumentacji (już wdrożone wcześniej).

## Co świadomie odłożone
- Czyszczenie HTML i ekstrakcja treści kroków (`stripHtml`, `getStepContentPlainText`).
- N-gramy (`ngramsFor`, `buildNgramsField`).
- Freshness (`buildSectionFreshness`, `evaluateStepFreshness`).

## Kiedy wrócić do odłożonych elementów
- `stripHtml`/`getStepContentPlainText`: gdy źródłem danych staną się treści HTML/Markdown z renderem.
- n-gramy: gdy pojawi się mierzalny problem recallu, którego nie naprawia `fuzzy/prefix`.
- freshness: gdy będziemy mieć metadata aktualizacji i scenariusz rankingowania po czasie.
