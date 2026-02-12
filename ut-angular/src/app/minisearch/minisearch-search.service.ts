import { Injectable, signal } from '@angular/core';
import MiniSearch, { SearchResult } from 'minisearch';

export interface DocRecord {
  id: number;
  title: string;
  text: string;
  tags: string[];
  category: string;
  url?: string;
  metadata?: { author?: string; version?: string };
  [key: string]: unknown;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
}

export interface SearchOptions {
  prefix: boolean;
  fuzzy: boolean;
  boost: boolean;
  combineWith: 'OR' | 'AND' | 'AND_NOT';
  categoryFilter: string | null;
  // Advanced (ID-T 12–19)
  maxFuzzy: number;
  searchFields: string[];
  perTermPrefix: boolean;
  perTermFuzzy: boolean;
  boostTermEnabled: boolean;
  boostTermValue: string;
  boostTermFactor: number;
  boostDocumentEnabled: boolean;
  boostDocumentCategory: string;
  boostDocumentFactor: number;
  fuzzyWeight: number;
  prefixWeight: number;
  bm25k: number;
  bm25b: number;
  bm25d: number;
  // ID-T 20: AND_NOT
  excludeTerms: string;
  // ID-T 21: Query tree
  queryTreeEnabled: boolean;
  queryTreeQuery1: string;
  queryTreeQuery2: string;
  // ID-T 22–23: Wildcard
  wildcardMode: boolean;
  // ID-T 24: Filter callback
  filterStrategy: 'none' | 'minLength' | 'hasTag';
  filterMinLength: number;
  filterTag: string;
  // ID-T 25: Role-based filtering
  roleFilter: string;
  // ID-T 26: Score explanation
  showScoreExplanation: boolean;
  // ID-T 27–29: autoSuggest options
  suggestFuzzy: boolean;
  suggestPrefix: boolean;
  suggestCombineWith: 'OR' | 'AND';
  suggestFilterEnabled: boolean;
  // ID-T 30–39: Index configuration
  extractNestedEnabled: boolean;
  extractDerivedEnabled: boolean;
  stringifyFieldEnabled: boolean;
  customTokenizeEnabled: boolean;
  splitTokenizeEnabled: boolean;
  processTermNormEnabled: boolean;
  splitProcessTermEnabled: boolean;
  synonymsEnabled: boolean;
  discardTermsEnabled: boolean;
  customIdFieldEnabled: boolean;
}

export interface EnrichedResult extends SearchResult {
  title: string;
  text: string;
  tags: string[];
  category: string;
  url: string;
  highlightedTitle: string;
  highlightedText: string;
}

type HighlightStrength = 'exact' | 'fuzzy';
interface HighlightRange {
  start: number;
  end: number;
  type: HighlightStrength;
}

/** Wbudowany zestaw offline (ID-T 11) */
const OFFLINE_DOCS: DocRecord[] = [
  { id: 1, title: 'Wyszukiwanie pełnotekstowe', text: 'MiniSearch umożliwia błyskawiczne przeszukiwanie dokumentów po treści — bez backendu i serwera.', tags: ['search', 'fulltext'], category: 'concepts', url: 'https://github.com/lucaong/minisearch/search?q=full-text+search&type=code', metadata: { author: 'Jan Kowalski', version: '2.1' } },
  { id: 2, title: 'Prefix search', text: 'Wyszukiwanie prefiksowe dopasowuje słowa zaczynające się od wpisanego fragmentu.', tags: ['prefix', 'autocomplete'], category: 'concepts', url: 'https://github.com/lucaong/minisearch/search?q=prefix&type=code', metadata: { author: 'Anna Nowak', version: '1.3' } },
  { id: 3, title: 'Fuzzy search', text: 'Wyszukiwanie rozmyte toleruje literówki — "anglar" znajdzie "angular".', tags: ['fuzzy', 'typos'], category: 'concepts', metadata: { author: 'Jan Kowalski', version: '1.0' } },
  { id: 4, title: 'Field boosting', text: 'Boosting pól pozwala nadać większą wagę dopasowaniom w tytule niż w treści.', tags: ['boost', 'relevance'], category: 'api', metadata: { author: 'Piotr Wiśniewski', version: '3.0' } },
  { id: 5, title: 'Auto-suggest', text: 'Funkcja autoSuggest generuje podpowiedzi wyszukiwania w czasie rzeczywistym.', tags: ['suggest', 'autocomplete'], category: 'api', metadata: { author: 'Anna Nowak', version: '2.0' } },
  { id: 6, title: 'Filtrowanie wyników', text: 'Callback filter pozwala ograniczyć wyniki do określonej kategorii.', tags: ['filter', 'callback'], category: 'api' },
  { id: 7, title: 'Live indexing', text: 'Dokumenty można dodawać, usuwać i zamieniać w locie — bez restartu silnika.', tags: ['add', 'remove', 'replace'], category: 'examples' },
  { id: 8, title: 'Serializacja indeksu', text: 'Indeks można zapisać do JSON i odtworzyć bez ponownego indeksowania.', tags: ['json', 'serialize'], category: 'examples', metadata: { author: 'Piotr Wiśniewski', version: '1.5' } },
  { id: 9, title: 'Tokenizer niestandardowy', text: 'Możesz podać własną funkcję tokenizującą tekst.', tags: ['tokenize', 'custom'], category: 'api', metadata: { author: 'Jan Kowalski', version: '1.0' } },
  { id: 10, title: 'Dokumentacja offline', text: 'MiniSearch napędza wyszukiwanie w VitePress i Docusaurus — działa bez sieci.', tags: ['docs', 'vitepress'], category: 'use-cases', metadata: { author: 'Anna Nowak', version: '2.5' } },
];

@Injectable({ providedIn: 'root' })
export class MiniSearchService {
  private miniSearch: MiniSearch<DocRecord> | null = null;
  private documents: DocRecord[] = [];

  /** ID-T 37: mapa synonimów */
  private readonly SYNONYM_MAP: Record<string, string[]> = {
    js: ['javascript'], ts: ['typescript'],
    frontend: ['gui', 'ui'], backend: ['server', 'api'],
    szukaj: ['wyszukaj', 'znajdz'], szukanie: ['wyszukiwanie'],
  };
  /** ID-T 38: stop-words */
  private readonly STOP_WORDS = new Set([
    'i', 'w', 'na', 'z', 'do', 'to', 'jest', 'się', 'nie', 'że', 'o', 'od', 'po', 'za',
    'the', 'a', 'an', 'is', 'in', 'of', 'and', 'for', 'it', 'on',
  ]);

  readonly state = signal<SearchState>({ status: 'idle' });
  readonly query = signal('');
  readonly options = signal<SearchOptions>({
    prefix: true,
    fuzzy: false,
    boost: false,
    combineWith: 'OR',
    categoryFilter: null,
    maxFuzzy: 6,
    searchFields: [],
    perTermPrefix: false,
    perTermFuzzy: false,
    boostTermEnabled: false,
    boostTermValue: '',
    boostTermFactor: 2,
    boostDocumentEnabled: false,
    boostDocumentCategory: '',
    boostDocumentFactor: 2,
    fuzzyWeight: 0.45,
    prefixWeight: 0.375,
    bm25k: 1.2,
    bm25b: 0.7,
    bm25d: 0.5,
    excludeTerms: '',
    queryTreeEnabled: false,
    queryTreeQuery1: '',
    queryTreeQuery2: '',
    wildcardMode: false,
    filterStrategy: 'none',
    filterMinLength: 50,
    filterTag: '',
    roleFilter: 'all',
    showScoreExplanation: false,
    suggestFuzzy: false,
    suggestPrefix: true,
    suggestCombineWith: 'OR',
    suggestFilterEnabled: false,
    extractNestedEnabled: false,
    extractDerivedEnabled: false,
    stringifyFieldEnabled: false,
    customTokenizeEnabled: false,
    splitTokenizeEnabled: false,
    processTermNormEnabled: false,
    splitProcessTermEnabled: false,
    synonymsEnabled: false,
    discardTermsEnabled: false,
    customIdFieldEnabled: false,
  });

  readonly results = signal<EnrichedResult[]>([]);
  readonly suggestions = signal<{ suggestion: string; score: number }[]>([]);
  readonly searchTimeMs = signal<number>(0);
  readonly documentCount = signal(0);
  readonly categories = signal<string[]>([]);
  readonly facetCounts = signal<Record<string, number>>({});
  readonly indexTimeMs = signal<number>(0);
  readonly offlineMode = signal(false);
  /** ID-T 41: postęp addAllAsync (0–100, null = brak operacji) */
  readonly asyncProgress = signal<number | null>(null);
  /** ID-T 45: zapisany snapshot indeksu */
  readonly snapshotJson = signal<string | null>(null);

  async loadAndIndex(): Promise<void> {
    this.state.set({ status: 'loading' });
    try {
      const response = await fetch('/minisearch-docs.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const docs: DocRecord[] = await response.json();
      this.offlineMode.set(false);
      this.indexDocuments(docs);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.state.set({ status: 'error', error: msg });
    }
  }

  loadOffline(): void {
    this.offlineMode.set(true);
    this.indexDocuments(OFFLINE_DOCS);
  }

  private indexDocuments(docs: DocRecord[]): void {
    this.documents = docs;
    const opts = this.options();
    const start = performance.now();

    // Build dynamic fields list
    const fields: string[] = ['title', 'text', 'tags'];
    if (opts.extractNestedEnabled) fields.push('metadata.author');
    if (opts.extractDerivedEnabled) fields.push('summary');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msOpts: Record<string, any> = {
      fields,
      storeFields: ['title', 'text', 'tags', 'category', 'url'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 2, tags: 1.5 },
      },
    };

    // ID-T 39: custom idField
    if (opts.customIdFieldEnabled) {
      msOpts['idField'] = 'docId';
    }

    // extractField (ID-T 30 nested, 31 derived, 32 stringifyField, 39 customId)
    msOpts['extractField'] = (doc: Record<string, unknown>, field: string): string => {
      // Custom idField
      if (field === 'docId') {
        return `doc-${doc['id']}`;
      }
      // Nested path via dot notation (ID-T 30)
      if (field.includes('.')) {
        const parts = field.split('.');
        let val: unknown = doc;
        for (const p of parts) val = (val as Record<string, unknown>)?.[p];
        return val != null ? String(val) : '';
      }
      // Derived field (ID-T 31)
      if (field === 'summary') {
        return `${doc['title']} — ${doc['category']}`;
      }
      const val = doc[field];
      // ID-T 32: stringifyField — custom serialization for tags
      if (field === 'tags' && Array.isArray(val)) {
        if (opts.stringifyFieldEnabled) {
          return (val as string[]).map((t: string) => `${doc['category']}:${t}`).join(' ');
        }
        return (val as string[]).join(' ');
      }
      return (val as string) ?? '';
    };

    // ID-T 33/34: custom tokenize
    if (opts.customTokenizeEnabled || opts.splitTokenizeEnabled) {
      const camelCase = (text: string): string[] =>
        text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ')
          .toLowerCase().split(/\s+/).filter(Boolean);
      if (opts.splitTokenizeEnabled) {
        msOpts['tokenize'] = camelCase;
        msOpts['searchOptions']['tokenize'] = (text: string): string[] =>
          text.toLowerCase().split(/[\s-]+/).filter(Boolean);
      } else {
        msOpts['tokenize'] = camelCase;
      }
    }

    // ID-T 35–38: processTerm
    const hasProcessTerm = opts.processTermNormEnabled || opts.splitProcessTermEnabled
      || opts.synonymsEnabled || opts.discardTermsEnabled;
    if (hasProcessTerm) {
      const buildProcessTerm = (isSearch: boolean) => {
        return (term: string): string | string[] | null | false => {
          let t = term.toLowerCase();
          // ID-T 38: discard stop words
          if (opts.discardTermsEnabled && this.STOP_WORDS.has(t)) return null;
          // ID-T 35/36: normalization (strip diacritics)
          if (opts.processTermNormEnabled) {
            if (!opts.splitProcessTermEnabled || !isSearch) {
              t = this.stripDiacritics(t);
            }
          }
          // ID-T 37: synonyms (expand only at index time)
          if (opts.synonymsEnabled && !isSearch) {
            const syns = this.SYNONYM_MAP[t];
            if (syns) return [t, ...syns];
          }
          return t;
        };
      };
      if (opts.splitProcessTermEnabled) {
        msOpts['processTerm'] = buildProcessTerm(false);
        msOpts['searchOptions']['processTerm'] = buildProcessTerm(true);
      } else {
        msOpts['processTerm'] = buildProcessTerm(false);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.miniSearch = new MiniSearch<DocRecord>(msOpts as any);
    this.miniSearch.addAll(docs);
    this.indexTimeMs.set(performance.now() - start);

    this.documentCount.set(this.miniSearch.documentCount);
    const cats = [...new Set(docs.map((d) => d.category))].sort();
    this.categories.set(cats);

    this.state.set({ status: 'ready' });
  }

  /** ID-T 35: strip diacritics */
  private stripDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  search(query: string): void {
    this.query.set(query);
    const opts = this.options();
    if (!this.miniSearch || (!query.trim() && !opts.wildcardMode && !opts.queryTreeEnabled)) {
      this.results.set([]);
      this.suggestions.set([]);
      this.searchTimeMs.set(0);
      this.facetCounts.set({});
      return;
    }

    const start = performance.now();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchOpts: any = {
      combineWith: opts.combineWith === 'AND_NOT' ? 'AND' : opts.combineWith,
      maxFuzzy: opts.maxFuzzy,
      weights: { fuzzy: opts.fuzzyWeight, prefix: opts.prefixWeight },
      bm25: { k: opts.bm25k, b: opts.bm25b, d: opts.bm25d },
    };

    // Prefix: prosty lub per-term (ID-T 12)
    if (opts.perTermPrefix) {
      searchOpts.prefix = (_term: string, i: number, terms: string[]) => i === terms.length - 1;
    } else {
      searchOpts.prefix = opts.prefix;
    }

    // Fuzzy: prosty lub per-term (ID-T 13)
    if (opts.perTermFuzzy) {
      searchOpts.fuzzy = (term: string) => term.length > 3 ? 0.2 : false;
    } else {
      searchOpts.fuzzy = opts.fuzzy ? 0.2 : false;
    }

    // Fields (ID-T 15)
    if (opts.searchFields.length > 0) {
      searchOpts.fields = opts.searchFields;
    }

    // Field boost
    if (opts.boost) {
      searchOpts.boost = { title: 3, tags: 2 };
    }

    // boostTerm via boostDocument (ID-T 16)
    if (opts.boostTermEnabled && opts.boostTermValue) {
      const termToBoost = opts.boostTermValue.toLowerCase();
      const termFactor = opts.boostTermFactor;
      searchOpts.boostDocument = (_id: unknown, term: string) =>
        term.toLowerCase() === termToBoost ? termFactor : 1;
    } else if (opts.boostDocumentEnabled && opts.boostDocumentCategory) {
      // boostDocument wg kategorii (ID-T 17)
      const cat = opts.boostDocumentCategory;
      const docFactor = opts.boostDocumentFactor;
      searchOpts.boostDocument = (_id: unknown, _term: string, storedFields: Record<string, unknown>) =>
        storedFields?.['category'] === cat ? docFactor : 1;
    }

    // Combined filter (ID-T 24, 25 + category)
    const filters: ((result: Record<string, unknown>) => boolean)[] = [];

    if (opts.categoryFilter) {
      const cat = opts.categoryFilter;
      filters.push((result) => result['category'] === cat);
    }

    if (opts.filterStrategy === 'minLength') {
      const minLen = opts.filterMinLength;
      filters.push((result) => ((result['text'] as string) || '').length >= minLen);
    } else if (opts.filterStrategy === 'hasTag' && opts.filterTag) {
      const tag = opts.filterTag.toLowerCase();
      filters.push((result) => {
        const tags = ((result['tags'] as string) || '').toLowerCase();
        return tags.includes(tag);
      });
    }

    if (opts.roleFilter && opts.roleFilter !== 'all') {
      const role = opts.roleFilter;
      const roleAccess: Record<string, string[]> = {
        concepts: ['guest', 'admin'],
        api: ['admin'],
        examples: ['guest', 'admin'],
        'use-cases': ['guest', 'admin'],
      };
      filters.push((result) => {
        const cat = result['category'] as string;
        return (roleAccess[cat] || ['admin']).includes(role);
      });
    }

    if (filters.length > 0) {
      searchOpts.filter = (result: Record<string, unknown>) => filters.every(f => f(result));
    }

    // Query execution (ID-T 21, 22–23)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let raw: any[];
    if (opts.wildcardMode) {
      raw = this.miniSearch.search(MiniSearch.wildcard, searchOpts);
    } else if (opts.queryTreeEnabled && opts.queryTreeQuery1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queries: any[] = [];
      const q1Words = opts.queryTreeQuery1.split(/\s+/).filter(Boolean);
      if (q1Words.length > 0) queries.push({ combineWith: 'AND', queries: q1Words });
      if (opts.queryTreeQuery2) {
        const q2Words = opts.queryTreeQuery2.split(/\s+/).filter(Boolean);
        if (q2Words.length > 0) queries.push({ combineWith: 'AND', queries: q2Words });
      }
      raw = queries.length > 0
        ? this.miniSearch.search({ combineWith: 'OR', queries } as unknown as string, searchOpts)
        : this.miniSearch.search(query, searchOpts);
    } else {
      raw = this.miniSearch.search(query, searchOpts);
    }

    // AND_NOT: post-filter excluded terms (ID-T 20)
    if (opts.combineWith === 'AND_NOT' && opts.excludeTerms.trim()) {
      const excludeWords = opts.excludeTerms.toLowerCase().split(/\s+/).filter(Boolean);
      raw = raw.filter(r => {
        const matchedTerms = Object.keys(r.match).map((t: string) => t.toLowerCase());
        return !excludeWords.some(ew => matchedTerms.includes(ew));
      });
    }
    this.searchTimeMs.set(performance.now() - start);

    const matchedTerms = new Set<string>();
    raw.forEach((r) => {
      Object.keys(r.match).forEach((t) => matchedTerms.add(t));
    });
    const terms = [...matchedTerms];
    const queryTerms = this.extractHighlightTerms(query);

    const enriched: EnrichedResult[] = raw.map((r) => ({
      ...r,
      title: (r as unknown as DocRecord).title,
      text: (r as unknown as DocRecord).text,
      tags: ((r as unknown as DocRecord).tags as unknown as string)?.split?.(' ') ??
        (r as unknown as DocRecord).tags ?? [],
      category: (r as unknown as DocRecord).category,
      url: this.resolveDocumentUrl(r as unknown as DocRecord),
      highlightedTitle: this.highlight((r as unknown as DocRecord).title, queryTerms),
      highlightedText: this.highlight(this.snippet((r as unknown as DocRecord).text, terms), queryTerms),
    }));

    this.results.set(enriched);

    // Facet counts
    const counts: Record<string, number> = {};
    raw.forEach((r) => {
      const cat = (r as unknown as DocRecord).category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    this.facetCounts.set(counts);

    // Auto-suggest (ID-T 27–29)
    if (query.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestOpts: any = {
        prefix: opts.suggestPrefix,
        fuzzy: opts.suggestFuzzy ? 0.2 : false,
        combineWith: opts.suggestCombineWith,
      };
      if (opts.suggestFilterEnabled && opts.categoryFilter) {
        const cat = opts.categoryFilter;
        suggestOpts.filter = (result: Record<string, unknown>) => result['category'] === cat;
      }
      const sugg = this.miniSearch.autoSuggest(query, suggestOpts);
      this.suggestions.set(sugg.slice(0, 5));
    } else {
      this.suggestions.set([]);
    }
  }

  addDocument(doc: DocRecord): void {
    if (!this.miniSearch) return;
    this.miniSearch.add(doc);
    this.documents.push(doc);
    this.documentCount.set(this.miniSearch.documentCount);
    this.search(this.query());
  }

  removeDocument(id: number): void {
    if (!this.miniSearch) return;
    const doc = this.documents.find(d => d.id === id);
    if (!doc) return;
    this.miniSearch.remove(doc);
    this.documents = this.documents.filter(d => d.id !== id);
    this.documentCount.set(this.miniSearch.documentCount);
    this.search(this.query());
  }

  replaceDocument(doc: DocRecord): void {
    if (!this.miniSearch) return;
    const existing = this.documents.find(d => d.id === doc.id);
    if (existing) {
      this.miniSearch.replace(doc);
      this.documents = this.documents.map(d => d.id === doc.id ? doc : d);
    } else {
      this.miniSearch.add(doc);
      this.documents.push(doc);
    }
    this.documentCount.set(this.miniSearch.documentCount);
    this.search(this.query());
  }

  discardDocument(id: number): void {
    if (!this.miniSearch) return;
    this.miniSearch.discard(id);
    this.documents = this.documents.filter(d => d.id !== id);
    this.documentCount.set(this.miniSearch.documentCount);
    this.search(this.query());
  }

  vacuum(): void {
    if (!this.miniSearch) return;
    this.miniSearch.vacuum();
  }

  /** ID-T 40: addAll — synchroniczny batch import */
  addAllDocuments(docs: DocRecord[]): void {
    if (!this.miniSearch) return;
    this.miniSearch.addAll(docs);
    this.documents.push(...docs);
    this.documentCount.set(this.miniSearch.documentCount);
    const cats = [...new Set(this.documents.map(d => d.category))].sort();
    this.categories.set(cats);
    this.search(this.query());
  }

  /** ID-T 41: addAllAsync — chunked import z feedbackiem postępu */
  async addAllDocumentsAsync(docs: DocRecord[], chunkSize = 50): Promise<void> {
    if (!this.miniSearch) return;
    this.asyncProgress.set(0);
    const total = docs.length;
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      this.miniSearch.addAll(chunk);
      this.documents.push(...chunk);
      this.asyncProgress.set(Math.round(((i + chunk.length) / total) * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    this.documentCount.set(this.miniSearch.documentCount);
    const cats = [...new Set(this.documents.map(d => d.category))].sort();
    this.categories.set(cats);
    this.asyncProgress.set(null);
    this.search(this.query());
  }

  /** ID-T 44: discardAll — batch discard z listą ID */
  discardAllDocuments(): void {
    if (!this.miniSearch) return;
    const ids = this.documents.map(d => d.id);
    for (const id of ids) {
      this.miniSearch.discard(id);
    }
    this.documents = [];
    this.documentCount.set(this.miniSearch.documentCount);
    this.search(this.query());
  }

  /** ID-T 45: toJSON — serializacja indeksu */
  saveToJSON(): string {
    if (!this.miniSearch) return '{}';
    const json = JSON.stringify(this.miniSearch);
    this.snapshotJson.set(json);
    return json;
  }

  /** ID-T 45: loadJSON — synchroniczne odtworzenie indeksu */
  loadFromJSON(json: string): void {
    this.miniSearch = MiniSearch.loadJSON<DocRecord>(json, {
      fields: ['title', 'text', 'tags'],
      storeFields: ['title', 'text', 'tags', 'category', 'url'],
    });
    this.documents = [];
    this.documentCount.set(this.miniSearch.documentCount);
    this.state.set({ status: 'ready' });
    this.search(this.query());
  }

  /** ID-T 45: loadJSONAsync — asynchroniczne odtworzenie indeksu */
  async loadFromJSONAsync(json: string): Promise<void> {
    this.miniSearch = await MiniSearch.loadJSONAsync<DocRecord>(json, {
      fields: ['title', 'text', 'tags'],
      storeFields: ['title', 'text', 'tags', 'category', 'url'],
    });
    this.documents = [];
    this.documentCount.set(this.miniSearch.documentCount);
    this.state.set({ status: 'ready' });
    this.search(this.query());
  }

  /** Lista aktualnych dokumentów (do UI remove/discard) */
  getDocuments(): DocRecord[] {
    return this.documents;
  }

  getDirtCount(): number {
    return this.miniSearch?.dirtCount ?? 0;
  }

  getDirtFactor(): number {
    return this.miniSearch?.dirtFactor ?? 0;
  }

  getTermCount(): number {
    return this.miniSearch?.termCount ?? 0;
  }

  updateOption<K extends keyof SearchOptions>(key: K, value: SearchOptions[K]): void {
    this.options.update((o) => ({ ...o, [key]: value }));
    this.search(this.query());
  }

  /** ID-T 30–39: zmiana opcji indeksu — przebudowuje cały indeks */
  updateIndexOption<K extends keyof SearchOptions>(key: K, value: SearchOptions[K]): void {
    this.options.update((o) => ({ ...o, [key]: value }));
    if (this.documents.length > 0) {
      this.indexDocuments(this.documents);
      this.search(this.query());
    }
  }

  private highlight(text: string, terms: string[]): string {
    if (!text) return '';
    if (!terms.length) return this.escapeHtml(text);
    return this.buildHighlightedHtml(text, terms);
  }

  private extractHighlightTerms(query: string): string[] {
    return query
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean)
      .map((term) => this.normalizeForHighlight(term))
      .filter((term) => term.length > 0);
  }

  private buildHighlightedHtml(text: string, terms: string[]): string {
    const rawChars = Array.from(text);
    if (!rawChars.length || !terms.length) {
      return this.escapeHtml(text);
    }

    const normalizedSegments = rawChars.map((char) => this.normalizeForHighlight(char));
    const normalizedText = normalizedSegments.join('');
    if (!normalizedText.length) {
      return this.escapeHtml(text);
    }

    const normalizedIndexMap: number[] = [];
    normalizedSegments.forEach((segment, rawIndex) => {
      Array.from(segment).forEach(() => normalizedIndexMap.push(rawIndex));
    });

    const ranges: HighlightRange[] = [];

    for (const term of terms) {
      const exactRanges = this.findExactHighlightRanges(term, normalizedText, normalizedIndexMap);
      if (exactRanges.length > 0) {
        ranges.push(...exactRanges);
      } else {
        const fuzzyRange = this.findBestFuzzyHighlightRange(term, normalizedText, normalizedIndexMap);
        if (fuzzyRange) ranges.push(fuzzyRange);
      }
    }

    if (!ranges.length) {
      return this.escapeHtml(text);
    }

    const mergedRanges = this.mergeHighlightRanges(ranges);
    let cursor = 0;
    let html = '';

    for (const { start, end, type } of mergedRanges) {
      if (cursor < start) {
        html += this.escapeHtml(rawChars.slice(cursor, start).join(''));
      }
      html += `<mark class="ms-highlight ms-highlight--${type}" data-match="${type}">` +
        `${this.escapeHtml(rawChars.slice(start, end).join(''))}</mark>`;
      cursor = end;
    }

    if (cursor < rawChars.length) {
      html += this.escapeHtml(rawChars.slice(cursor).join(''));
    }

    return html;
  }

  private findExactHighlightRanges(
    term: string,
    normalizedText: string,
    normalizedIndexMap: number[],
  ): HighlightRange[] {
    const ranges: HighlightRange[] = [];
    if (!term.length || !normalizedText.length) return ranges;

    let pointer = 0;
    while (pointer <= normalizedText.length - term.length) {
      const matchIndex = normalizedText.indexOf(term, pointer);
      if (matchIndex === -1) break;

      const normalizedEnd = matchIndex + term.length - 1;
      const rawStart = normalizedIndexMap[matchIndex];
      const rawEndIndex = normalizedIndexMap[normalizedEnd];

      if (rawStart !== undefined && rawEndIndex !== undefined) {
        ranges.push({ start: rawStart, end: rawEndIndex + 1, type: 'exact' });
      }

      pointer = matchIndex + term.length;
    }

    return ranges;
  }

  private findBestFuzzyHighlightRange(
    term: string,
    normalizedText: string,
    normalizedIndexMap: number[],
  ): HighlightRange | undefined {
    if (!term.length || !normalizedText.length || term.length < 3) {
      return undefined;
    }

    const maxDistance = Math.max(1, Math.round(term.length * 0.2));
    const minWindow = Math.max(1, term.length - maxDistance);
    const maxWindow = Math.min(normalizedText.length, term.length + maxDistance);

    let bestMatch: { start: number; length: number; distance: number } | undefined;

    for (let len = minWindow; len <= maxWindow; len++) {
      for (let start = 0; start + len <= normalizedText.length; start++) {
        const candidate = normalizedText.slice(start, start + len);
        const distance = this.levenshteinDistance(term, candidate);

        if (distance > maxDistance) continue;

        if (!bestMatch || distance < bestMatch.distance || (distance === bestMatch.distance && len < bestMatch.length)) {
          bestMatch = { start, length: len, distance };
        }
      }
    }

    if (!bestMatch) return undefined;

    const rawStart = normalizedIndexMap[bestMatch.start];
    const rawEndIndex = normalizedIndexMap[bestMatch.start + bestMatch.length - 1];
    if (rawStart === undefined || rawEndIndex === undefined) return undefined;

    return { start: rawStart, end: rawEndIndex + 1, type: 'fuzzy' };
  }

  private mergeHighlightRanges(ranges: HighlightRange[]): HighlightRange[] {
    if (!ranges.length) return [];

    const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
    const merged: HighlightRange[] = [];

    for (const range of sorted) {
      const last = merged[merged.length - 1];
      if (!last) {
        merged.push({ ...range });
        continue;
      }

      if (range.start <= last.end) {
        last.end = Math.max(last.end, range.end);
        if (last.type !== 'exact' && range.type === 'exact') {
          last.type = 'exact';
        }
      } else {
        merged.push({ ...range });
      }
    }

    return merged;
  }

  private levenshteinDistance(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const previousRow = new Array(b.length + 1);
    const currentRow = new Array(b.length + 1);

    for (let j = 0; j <= b.length; j++) {
      previousRow[j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
      currentRow[0] = i;
      let previousDiagonal = i - 1;

      for (let j = 1; j <= b.length; j++) {
        const temp = previousRow[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        currentRow[j] = Math.min(
          currentRow[j - 1] + 1,
          previousRow[j] + 1,
          previousDiagonal + cost,
        );
        previousDiagonal = temp;
      }

      for (let j = 0; j <= b.length; j++) {
        previousRow[j] = currentRow[j];
      }
    }

    return currentRow[b.length];
  }

  private normalizeForHighlight(text: string): string {
    return this.stripDiacritics(text.toLocaleLowerCase('pl'));
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private resolveDocumentUrl(doc: Partial<DocRecord>): string {
    const explicitUrl = typeof doc.url === 'string' ? doc.url.trim() : '';
    if (explicitUrl) return explicitUrl;

    const title = typeof doc.title === 'string' ? doc.title.trim() : '';
    if (title) {
      return `https://github.com/lucaong/minisearch/search?q=${encodeURIComponent(title)}&type=code`;
    }

    return 'https://github.com/lucaong/minisearch';
  }

  private snippet(text: string, terms: string[], windowSize = 40): string {
    if (!text) return '';
    if (text.length <= 200) return text;

    const lower = text.toLowerCase();
    let bestIdx = -1;
    for (const term of terms) {
      const idx = lower.indexOf(term.toLowerCase());
      if (idx !== -1) {
        bestIdx = idx;
        break;
      }
    }

    if (bestIdx === -1) return text.slice(0, 200) + '...';

    const startPos = Math.max(0, bestIdx - windowSize);
    const end = Math.min(text.length, bestIdx + windowSize + 20);
    let result = text.slice(startPos, end);
    if (startPos > 0) result = '...' + result;
    if (end < text.length) result = result + '...';
    return result;
  }
}
