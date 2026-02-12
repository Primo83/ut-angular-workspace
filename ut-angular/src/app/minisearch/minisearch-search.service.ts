import { Injectable, signal } from '@angular/core';
import MiniSearch, { SearchResult } from 'minisearch';

export interface DocRecord {
  id: number;
  title: string;
  text: string;
  tags: string[];
  category: string;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
}

export interface SearchOptions {
  prefix: boolean;
  fuzzy: boolean;
  boost: boolean;
  combineWith: 'OR' | 'AND';
  categoryFilter: string | null;
}

export interface EnrichedResult extends SearchResult {
  title: string;
  text: string;
  tags: string[];
  category: string;
  highlightedTitle: string;
  highlightedText: string;
}

@Injectable({ providedIn: 'root' })
export class MiniSearchService {
  private miniSearch: MiniSearch<DocRecord> | null = null;
  private documents: DocRecord[] = [];

  readonly state = signal<SearchState>({ status: 'idle' });
  readonly query = signal('');
  readonly options = signal<SearchOptions>({
    prefix: true,
    fuzzy: false,
    boost: false,
    combineWith: 'OR',
    categoryFilter: null,
  });

  readonly results = signal<EnrichedResult[]>([]);
  readonly suggestions = signal<{ suggestion: string; score: number }[]>([]);
  readonly searchTimeMs = signal<number>(0);
  readonly documentCount = signal(0);
  readonly categories = signal<string[]>([]);
  readonly facetCounts = signal<Record<string, number>>({});

  readonly indexTimeMs = signal<number>(0);

  async loadAndIndex(): Promise<void> {
    this.state.set({ status: 'loading' });
    try {
      const response = await fetch('/minisearch-docs.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const docs: DocRecord[] = await response.json();
      this.documents = docs;

      const start = performance.now();
      this.miniSearch = new MiniSearch<DocRecord>({
        fields: ['title', 'text', 'tags'],
        storeFields: ['title', 'text', 'tags', 'category'],
        extractField: (doc, field) => {
          const val = (doc as unknown as Record<string, unknown>)[field];
          return Array.isArray(val) ? val.join(' ') : (val as string);
        },
        searchOptions: {
          prefix: true,
          fuzzy: 0.2,
          boost: { title: 2, tags: 1.5 },
        },
      });

      this.miniSearch.addAll(docs);
      this.indexTimeMs.set(performance.now() - start);

      this.documentCount.set(this.miniSearch.documentCount);
      const cats = [...new Set(docs.map((d) => d.category))].sort();
      this.categories.set(cats);

      this.state.set({ status: 'ready' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.state.set({ status: 'error', error: msg });
    }
  }

  search(query: string): void {
    this.query.set(query);
    if (!this.miniSearch || !query.trim()) {
      this.results.set([]);
      this.suggestions.set([]);
      this.searchTimeMs.set(0);
      this.facetCounts.set({});
      return;
    }

    const opts = this.options();
    const start = performance.now();

    const searchOpts: Parameters<MiniSearch<DocRecord>['search']>[1] = {
      prefix: opts.prefix,
      fuzzy: opts.fuzzy ? 0.2 : false,
      combineWith: opts.combineWith,
    };

    if (opts.boost) {
      searchOpts.boost = { title: 3, tags: 2 };
    }

    if (opts.categoryFilter) {
      const cat = opts.categoryFilter;
      searchOpts.filter = (result) => result['category'] === cat;
    }

    const raw = this.miniSearch.search(query, searchOpts);
    this.searchTimeMs.set(performance.now() - start);

    const matchedTerms = new Set<string>();
    raw.forEach((r) => {
      Object.keys(r.match).forEach((t) => matchedTerms.add(t));
    });
    const terms = [...matchedTerms];

    const enriched: EnrichedResult[] = raw.map((r) => ({
      ...r,
      title: (r as unknown as DocRecord).title,
      text: (r as unknown as DocRecord).text,
      tags: ((r as unknown as DocRecord).tags as unknown as string)?.split?.(' ') ??
        (r as unknown as DocRecord).tags ?? [],
      category: (r as unknown as DocRecord).category,
      highlightedTitle: this.highlight((r as unknown as DocRecord).title, terms),
      highlightedText: this.highlight(this.snippet((r as unknown as DocRecord).text, terms), terms),
    }));

    this.results.set(enriched);

    // Facet counts (unfiltered)
    const counts: Record<string, number> = {};
    raw.forEach((r) => {
      const cat = (r as unknown as DocRecord).category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    this.facetCounts.set(counts);

    // Auto-suggest
    const sugg = this.miniSearch.autoSuggest(query, {
      prefix: opts.prefix,
      fuzzy: opts.fuzzy ? 0.2 : false,
    });
    this.suggestions.set(sugg.slice(0, 5));
  }

  updateOption<K extends keyof SearchOptions>(key: K, value: SearchOptions[K]): void {
    this.options.update((o) => ({ ...o, [key]: value }));
    this.search(this.query());
  }

  private highlight(text: string, terms: string[]): string {
    if (!text || terms.length === 0) return text || '';
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const re = new RegExp(`(${escaped.join('|')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
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

    const start = Math.max(0, bestIdx - windowSize);
    const end = Math.min(text.length, bestIdx + windowSize + 20);
    let result = text.slice(start, end);
    if (start > 0) result = '...' + result;
    if (end < text.length) result = result + '...';
    return result;
  }
}
