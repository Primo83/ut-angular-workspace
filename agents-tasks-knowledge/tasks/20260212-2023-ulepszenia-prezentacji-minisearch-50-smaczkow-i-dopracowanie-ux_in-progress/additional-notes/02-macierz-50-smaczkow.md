# ID-T 02 - Macierz pokrycia 50 smaczkow

Status: done
Owner: gui-1

## Cel
Zmapowac 50/50 smaczkow MiniSearch do konkretnych elementow UI, akcji demo i dowodow testowych.

## Tabela pokrycia
| # | Smaczek | Sekcja UI | Akcja demo | Status | Dowod testu |
|---|---|---|---|---|---|
| 1 | Live search bez backendu | Playground | wpisywanie frazy na zywo | mapped | test komponentu + manual ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 2 | Offline search | Playground | tryb offline w DevTools | mapped | manual agent-browser ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 3 | Prefix search | Playground | toggle Prefix ON | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 4 | Prefix per-term | Playground | tryb zaawansowany prefix | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 5 | Fuzzy search | Playground | fuzzy=0.2 | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 6 | Fuzzy per-term | Playground | per-term fuzzy map | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 7 | maxFuzzy | Playground | ustawienie maxFuzzy | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 8 | Exact+prefix+fuzzy mix | Playground | wlaczenie 3 opcji | mapped | test integracyjny ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 9 | Search po wybranych fields | Playground | wybor fields | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 10 | Field boost | Playground | boost title/tags | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 11 | boostTerm | Playground | suwak boostTerm | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 12 | boostDocument | Playground | ranking z boostDocument | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 13 | weights fuzzy/prefix | Playground | suwak wag | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 14 | bm25 tuning | Playground | preset BM25 | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 15 | combineWith OR | Playground | OR mode | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 16 | combineWith AND | Playground | AND mode | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 17 | combineWith AND_NOT | Playground | AND_NOT mode | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 18 | Query tree nested | Advanced query | drzewo zapytan | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 19 | MiniSearch.wildcard | Playground | wildcard button | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 20 | Wildcard + filter | Playground | wildcard + category | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 21 | filter callback | Playground | custom filter | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 22 | Role-based filtering | Playground | profil roli demo | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 23 | storeFields optimization | Explain panel | porownanie payloadu | mapped | test jednostkowy ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 24 | match info explanation | Result details | panel Match | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 25 | score explanation | Result details | panel Score | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 26 | autoSuggest basic | Suggestion list | wpisywanie prefiksu | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 27 | autoSuggest + fuzzy | Suggestion list | literowka + fuzzy | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 28 | autoSuggest + filter | Suggestion list | filter + suggest | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 29 | autoSuggestOptions | Settings | preset suggest options | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 30 | extractField nested | Dataset explain | nested author.name | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 31 | extractField derived fields | Dataset explain | derived pubYear | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 32 | stringifyField | Dataset explain | custom stringify | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 33 | custom tokenize | Advanced tokenizer | tokenizer mode | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 34 | tokenize split index/search | Advanced tokenizer | index/search tokenize | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 35 | processTerm normalization | Advanced processor | lowercase/stopwords | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 36 | processTerm split index/search | Advanced processor | osobne processTerm | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 37 | processTerm synonyms | Advanced processor | synonyms ON | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 38 | processTerm discard terms | Advanced processor | discard terms | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 39 | custom idField | Dataset explain | niestandardowe id | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 40 | add runtime | Live indexing | dodanie 1 dokumentu | mapped | test komponentu + manual ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 41 | addAll batch | Live indexing | import batch | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 42 | addAllAsync chunking | Live indexing | async import 100 docs | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 43 | remove | Live indexing | remove by id | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 44 | discard | Live indexing | soft discard | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 45 | replace | Live indexing | replace document | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 46 | discardAll | Live indexing | discard selected | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 47 | manual vacuum | Maintenance panel | vacuum action | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 48 | dirtCount/dirtFactor | Maintenance panel | metryki dirt | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 49 | documentCount/termCount | Metrics panel | licznik docs/terms | mapped | test komponentu ; additional-notes/08-tests.md + additional-notes/09-manual.md |
| 50 | toJSON/loadJSON/loadJSONAsync | Snapshot panel | save/load snapshot | mapped | test serwisu ; additional-notes/08-tests.md + additional-notes/09-manual.md |

## Scenariusz prezentacji (ok. 30 minut)
1. Intro i framing (2 min): czym jest MiniSearch i dlaczego bez backendu.
2. Playground - query quality (8 min): smaczki 1-22, nacisk na prefix/fuzzy/filters/combineWith.
3. Explainability i sugestie (6 min): smaczki 23-32, pokaz "dlaczego ten wynik" i autoSuggest.
4. Tokenizer/processor (5 min): smaczki 33-39, szybkie porownanie trybow i synonimow.
5. Live indexing i utrzymanie indeksu (7 min): smaczki 40-50, add/addAll/remove/discard/vacuum/snapshot.
6. Podsumowanie i Q&A (2 min): "100%" = 50/50 pokrycia + testy automatyczne + test manualny.

## Kryterium DONE
- Tabela ma 50 pozycji i kazda pozycja ma przypisane: sekcje UI, akcje demo, status i dowod testu.
- Brak pozycji bez mapowania (`UNMAPPED`).
- Wszystkie pozycje sa oznaczone jako `mapped`.
