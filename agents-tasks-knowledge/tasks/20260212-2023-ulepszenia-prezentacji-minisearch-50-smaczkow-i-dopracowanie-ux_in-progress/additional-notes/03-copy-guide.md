# ID-T 03 - Copy guide dla laikow

Status: done
Owner: gui-1

## Cel

Przygotowac kompletny przewodnik jezykowy, ktory rozumie osoba bez doswiadczenia z wyszukiwarkami i ES. Kazdy tooltip, etykieta i opis sekcji musza byc napisane prostym jezykiem.

---

## 1. Zasady pisania tooltipow

1. **Maks 2 krotkie zdania.** Jesli nie da sie pomniejszyc — rozbij na 2 tooltipy (np. tooltip + sekcja "dowiedz sie wiecej").
2. **Struktura: "Co robi" + "Po co / kiedy wlaczyc".**
3. **Bez zargonu**; jesli termin techniczny jest potrzebny, dodaj proste wyjasnienie w nawiasie lub w drugim zdaniu.
4. **Bez skrotow** nieoczywistych dla laika (np. "TF-IDF", "BM25").
5. **Jezyk angielski** w samych tooltipach (poniewaz UI jest po angielsku), ale **prosty i potoczny** — unikaj akademickiego tonu.
6. **Unikaj negacji i podwojnych zaprzeczen** — pisz "Finds results even with typos" zamiast "Won't skip results that don't match exactly".
7. **Zaczynaj od czasownika lub rzeczownika** — "Finds...", "Shows...", "Adds...", "This option...".
8. **Nie zaczynaj od "This is..."** — od razu mow, co element robi.

---

## 2. Slownik zabroniony bez wyjasnienia

Ponizszych terminow **nie wolno uzywac** w tooltipach ani etykietach bez natychmiastowego prostego wyjasnienia:

| Termin | Dopuszczalne zastepstwo / wyjasnienie |
|---|---|
| BM25 | "a ranking formula that decides which results are most relevant" |
| tokenizacja / tokenize | "splitting text into individual words" |
| stemming | "reducing words to their root form" |
| Levenshtein | "a way to measure how different two words are" |
| TF-IDF / tf-idf | "a formula that scores how important a word is in a document" |
| inverted index | "a lookup table the search engine builds to find words quickly" |
| n-gram | "small pieces of a word used for matching" |
| stopwords | "common words like 'the' or 'and' that are usually ignored" |
| facet / faceting | "category count" lub "grouping results by category" |
| relevance score | "how well a result matches your search" |
| wildcard | "a special placeholder that matches any text" |
| vacuum | "clean up deleted entries to save memory" |
| dirt / dirty | "leftover data from removed documents" |
| payload | "the data sent or stored" |
| serialize / deserialize | "save to file" / "load from file" |
| callback | "a custom function you provide" |

---

## 3. Wzorzec tooltipa

```
Line 1: [What it does — action or effect]
Line 2: [When to use it / why it helps — benefit or scenario]
```

Przyklad:
```
Finds results even when you misspell a word.
Useful when users type quickly and make typos.
```

---

## 4. Kompletne teksty tooltipow — istniejace elementy UI

### 4.1 Playground — Search bar

| Element | Tooltip (EN) |
|---|---|
| Search input (placeholder) | `Search docs... (Alt+Shift+M)` |
| Clear search button | `Clear the search box and reset results.` |

### 4.2 Playground — Search controls (toggles)

| Element | Tooltip (EN) |
|---|---|
| **Prefix** toggle | `Matches words that start with what you typed. Turn on for autocomplete-style search (e.g. "ang" finds "angular").` |
| **Fuzzy** toggle | `Finds results even when you misspell a word. Useful when users type quickly and make typos.` |
| **Boost title** toggle | `Gives extra weight to matches found in titles. Results with the search term in the title appear higher.` |
| **OR / AND** combine toggle (OR state) | `Shows results containing any of the words you typed. Switch to AND to require all words.` |
| **OR / AND** combine toggle (AND state) | `Shows only results containing all the words you typed. Switch to OR to include partial matches.` |

### 4.3 Playground — Category filters

| Element | Tooltip (EN) |
|---|---|
| "All" chip | `Show results from all categories.` |
| Category chip (generic) | `Filter results to show only this category. The number shows how many results match.` |

### 4.4 Playground — Suggestions

| Element | Tooltip (EN) |
|---|---|
| Suggestion chip | `Click to search for this suggested term.` |

### 4.5 Playground — Results

| Element | Tooltip (EN) |
|---|---|
| Score badge | `How well this result matches your search — higher means a better match.` |
| Tag chip | `A label that describes this document's topic.` |

### 4.6 Quick Reference — Code snippets

| Element | Tooltip (EN) |
|---|---|
| Copy button | `Copy this code example to your clipboard.` |

---

## 5. Kompletne teksty tooltipow — planowane elementy UI (macierz 50)

### 5.1 Playground — zaawansowane opcje wyszukiwania

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Prefix per-term** | `Sets prefix matching separately for each search word. Some words autocomplete, others match exactly.` |
| **Fuzzy per-term** | `Sets typo tolerance separately for each search word. Useful for mixed queries with proper names and regular words.` |
| **maxFuzzy** | `Limits how many characters can differ when matching a misspelled word. Higher = more tolerant, but may show unrelated results.` |
| **Exact + prefix + fuzzy mix** | `Combines all three matching modes at once. The search engine tries exact matches first, then prefixes, then fuzzy — giving you the best of each.` |
| **Search fields selector** | `Choose which fields to search in (e.g. title, text, tags). Narrowing fields makes results more focused.` |
| **Field boost** | `Gives extra importance to matches in chosen fields. For example, boost "title" so title matches rank higher.` |
| **boostTerm** | `Increases the score for specific search terms. Handy when one word in your query matters more than others.` |
| **boostDocument** | `Adjusts the score for specific documents. Use this to pin important documents to the top of results.` |
| **weights (fuzzy/prefix)** | `Controls how much fuzzy and prefix matches count compared to exact matches. Move the slider to fine-tune ranking.` |
| **BM25 tuning** | `Adjusts the ranking formula that decides result order. Tweak how much word frequency and document length affect scores.` |
| **combineWith AND_NOT** | `Excludes results containing certain words. For example, "search AND_NOT elasticsearch" shows results about search but not Elasticsearch.` |

### 5.2 Advanced query

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Query tree (nested)** | `Build complex searches by nesting conditions. Combine AND, OR and NOT like building blocks.` |
| **Wildcard** button | `Matches any text in place of the wildcard symbol. Useful when you're not sure of the exact word.` |
| **Wildcard + filter** | `Combines wildcard matching with a category filter. Find broad matches but only within a specific group.` |
| **Filter callback** | `Filters results using a custom rule you define. Only results that pass your rule are shown.` |
| **Role-based filtering** | `Filters results based on user roles or permissions. Shows only what the current user is allowed to see.` |

### 5.3 Explain panels

| Element / smaczek | Tooltip (EN) |
|---|---|
| **storeFields optimization** | `Shows which fields are stored alongside the index. Storing fewer fields means a smaller, faster index.` |
| **Match info** | `Shows which words matched and in which fields. Helps you understand why a result appeared.` |
| **Score explanation** | `Breaks down how the relevance score was calculated. See exactly what made this result rank where it did.` |

### 5.4 Suggestion list (autoSuggest)

| Element / smaczek | Tooltip (EN) |
|---|---|
| **autoSuggest basic** | `Suggests complete search terms as you type. Powered by the same index — no server needed.` |
| **autoSuggest + fuzzy** | `Suggests terms even when you misspell. Combines auto-complete with typo tolerance.` |
| **autoSuggest + filter** | `Narrows suggestions to a specific category. Useful when you know the area but not the exact term.` |
| **autoSuggestOptions** preset | `Pre-configured suggestion settings (e.g. how many suggestions, whether to use fuzzy). Pick a preset to try different behaviors.` |

### 5.5 Dataset explain

| Element / smaczek | Tooltip (EN) |
|---|---|
| **extractField nested** | `Reads data from nested fields like "author.name". The search engine digs into sub-objects automatically.` |
| **extractField derived** | `Creates a new searchable field from existing data (e.g. "pubYear" from a date). No need to change your original documents.` |
| **stringifyField** | `Converts non-text fields (like arrays) into searchable text. For example, turns a list of tags into a single string.` |
| **custom idField** | `Uses a field other than "id" as the unique document identifier. Useful when your data has "slug" or "uuid" instead of "id".` |

### 5.6 Advanced tokenizer

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Custom tokenize** | `Splits text into searchable words using your own rules. By default, spaces and punctuation are used.` |
| **Tokenize split (index/search)** | `Uses different word-splitting rules for indexing vs. searching. Index can be thorough; search can be lenient.` |

### 5.7 Advanced processor

| Element / smaczek | Tooltip (EN) |
|---|---|
| **processTerm normalization** | `Cleans up words before searching — for example, lowercasing or removing accents. Makes "Angular" and "angular" find the same results.` |
| **processTerm split (index/search)** | `Applies different word cleanup rules when building the index vs. when searching. Index time can normalize aggressively; search time can be more flexible.` |
| **processTerm synonyms** | `Treats different words as the same thing (e.g. "JS" = "JavaScript"). Finds results even when exact words differ.` |
| **processTerm discard terms** | `Removes common or unhelpful words before searching (e.g. "the", "and", "is"). Keeps results focused on meaningful words.` |

### 5.8 Live indexing panel

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Add document** (add) | `Adds a single new document to the search index. It becomes searchable immediately — no restart needed.` |
| **Add batch** (addAll) | `Adds many documents at once. Faster than adding them one by one.` |
| **Add async** (addAllAsync) | `Adds documents in small batches so the page stays responsive. Best for large imports (100+ documents).` |
| **Remove** (remove) | `Permanently removes a document from the index. It will no longer appear in search results.` |
| **Discard** (discard) | `Marks a document as deleted without fully removing it. Faster than remove, but uses a bit more memory until you clean up.` |
| **Replace** (replace) | `Swaps an existing document with an updated version. Useful when a document's content changes.` |
| **Discard all** (discardAll) | `Marks multiple documents as deleted at once. Use cleanup (vacuum) afterwards to free memory.` |

### 5.9 Maintenance panel

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Vacuum** | `Cleans up leftover data from deleted documents. Frees memory and keeps the index lean.` |
| **dirtCount** | `Shows how many deleted entries are still in the index. A high number means cleanup (vacuum) would help.` |
| **dirtFactor** | `Shows the ratio of deleted entries to total entries. Values closer to 0 mean the index is clean.` |

### 5.10 Metrics panel

| Element / smaczek | Tooltip (EN) |
|---|---|
| **documentCount** | `Total number of documents currently in the search index.` |
| **termCount** | `Total number of unique words the search engine knows about.` |

### 5.11 Snapshot panel

| Element / smaczek | Tooltip (EN) |
|---|---|
| **Save snapshot** (toJSON) | `Saves the entire search index as a file. You can load it later to skip re-indexing.` |
| **Load snapshot** (loadJSON) | `Loads a previously saved index from a file. Instantly restores the search engine without re-processing documents.` |
| **Load async** (loadJSONAsync) | `Loads a saved index in chunks so the page stays responsive. Best for large indexes.` |

---

## 6. Etykiety sekcji UI (section titles + descriptions)

Ponizej teksty naglowkow i podnaglowkow sekcji, napisane prostym jezykiem.

| Sekcja | Title (EN) | Description (EN) |
|---|---|---|
| Playground | `Interactive Playground` | `Try searching the dataset in real time. Toggle options to see how they change results.` |
| Live indexing | `Live Indexing` | `Add, update or remove documents while the search engine is running. No restart needed.` |
| Maintenance | `Index Maintenance` | `Keep the search index clean and efficient. Remove leftover data from deleted documents.` |
| Metrics | `Index Metrics` | `See how big the index is: documents, unique words, and performance stats.` |
| Snapshots | `Save & Load` | `Export the entire index to a file and import it later — skip re-indexing.` |
| Advanced query | `Advanced Queries` | `Build complex search logic with nested conditions, wildcards and custom filters.` |
| Tokenizer | `Text Splitting` | `Control how text is broken into searchable words. Customize for your language or data format.` |
| Processor | `Word Processing` | `Clean up and transform words before they enter the index or your search query.` |
| Dataset explain | `Dataset & Fields` | `See how the search engine reads your documents: which fields are indexed, how data is extracted.` |
| Explain | `Under the Hood` | `Look inside: see how scores are calculated and which words matched.` |
| Suggestions | `Auto-Suggest` | `Get search term suggestions as you type, powered by the same index.` |
| Quick Reference | `Quick Reference` | `Key API patterns you can copy and use right away.` |
| Comparison | `How Does It Compare?` | `See how MiniSearch stacks up against other client-side search libraries.` |
| Use Cases | `Use Cases` | `Common scenarios where MiniSearch shines: docs search, autocomplete, offline, e-commerce.` |

---

## 7. Forbidden patterns — przyklady ZLE vs DOBRZE

| ZLE | DOBRZE | Dlaczego |
|---|---|---|
| "Applies BM25 ranking to results" | "Adjusts the ranking formula that decides result order" | BM25 jest w slowniku zabronionym |
| "Tokenizes input using custom rules" | "Splits text into searchable words using your own rules" | "Tokenizes" = zargon |
| "This is a fuzzy search toggle" | "Finds results even when you misspell a word" | "This is..." nie mowi co robi; brak korzysc |
| "Inverted index is used for lookups" | "The search engine builds a fast lookup table" | inverted index = zargon |
| "Sets fuzzy to 0.2" | "Allows up to 20% of a word's letters to differ" | Wartosc liczbowa bez kontekstu nie jest zrozumiala |
| "Doesn't not match non-exact terms" | "Also matches similar words, not just exact ones" | Podwojna negacja |

---

## 8. Review checklist (do odhaczenia przy ID-T=06)

Ponizszej checklisty uzywamy do weryfikacji **kazdego** tooltipa i etykiety przed zamknieciem ID-T=06:

- [ ] Kazdy tooltip ma max 2 zdania.
- [ ] Kazdy tooltip odpowiada na "co robi" i "po co / kiedy".
- [ ] Brak termow ze slownika zabronionych (sekcja 2) bez wyjasnienia.
- [ ] Teksty da sie przeczytac glosno w mniej niz 6 sekund.
- [ ] Brak podwojnych zaprzeczen i negacji.
- [ ] Kazdy tooltip zaczyna sie od czasownika lub rzeczownika (nie od "This is...").
- [ ] Tooltipy dla toggleow jasno mowia, co sie zmieni po wlaczeniu I co po wylaczeniu.
- [ ] Tooltipy dla akcji (przyciskow) mowia, co sie stanie po kliknieciu.
- [ ] Tooltipy dla metryk/paneli mowia, co wartosc oznacza.
- [ ] Zweryfikowano na zywo (agent-browser): kazdy element z tabeli ma widoczny tooltip.
- [ ] Kontrast i pozycja tooltipow nie zaslaniaja kluczowych elementow (a11y).

---

## 9. Wnioski dla kolejnych krokow

[HANDOFF: 04, 05, 06, 07]

- **Dla ID-T 04** (zmiana skrotu klawiszowego): placeholder inputa zmieniony w tym guide z `Ctrl+K` na `Alt+Shift+M`. Implementacja musi zaktualizowac zarowno `placeholder`, `onKeydown`, jak i tooltip.
- **Dla ID-T 05** (live indexing): komplet tooltipow dla panelu live indexing jest w sekcji 5.8. Implementacja UI powinna uzywac tych tekstow 1:1.
- **Dla ID-T 06** (tooltipy): **caly ten plik jest zrodlem prawdy** dla tooltipow. Review checklist (sekcja 8) jest glownym kryterium DONE dla ID-T 06.
- **Dla ID-T 07** (definicja 100%): tooltipy i etykiety sa czescia checklisty "100%" — wszystkie musza przejsc review checklist z sekcji 8.

---

## 10. Powiazane zadania

- ID-T 02: macierz 50 smaczkow (zrodlo listy elementow)
- ID-T 04: skrot klawiszowy (zmiana placeholdera)
- ID-T 05: live indexing (tooltipy panelu)
- ID-T 06: implementacja tooltipow (glowny konsument tego guide)
- ID-T 07: definicja "100%" (tooltipy jako czesc checklisty)
- ID-T 08: testy (weryfikacja copy w testach)
