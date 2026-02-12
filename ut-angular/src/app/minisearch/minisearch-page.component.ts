import { Component, OnInit, inject, signal, ElementRef, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiniSearchService, EnrichedResult, SearchOptions } from './minisearch-search.service';

@Component({
  selector: 'app-minisearch-page',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './minisearch-page.component.html',
  styleUrl: './minisearch-page.component.scss',
})
export class MiniSearchPageComponent implements OnInit {
  protected readonly svc = inject(MiniSearchService);
  protected queryInput = '';
  protected readonly copiedSnippet = signal<number | null>(null);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly codeSnippets = [
    {
      id: 1,
      title: 'Create Index',
      code: `import MiniSearch from 'minisearch';

const miniSearch = new MiniSearch({
  fields: ['title', 'text'],
  storeFields: ['title', 'category']
});`,
    },
    {
      id: 2,
      title: 'Add Documents',
      code: `miniSearch.addAll([
  { id: 1, title: 'Angular', text: 'Frontend framework', category: 'frontend' },
  { id: 2, title: 'React', text: 'UI library', category: 'frontend' },
  { id: 3, title: 'Node.js', text: 'JS runtime', category: 'backend' },
]);`,
    },
    {
      id: 3,
      title: 'Basic Search',
      code: `const results = miniSearch.search('angular');
// => [{ id: 1, score: 1.38, match: { angular: ['title'] } }]`,
    },
    {
      id: 4,
      title: 'Fuzzy Search',
      code: `// Tolerate typos (up to 20% of term length)
const results = miniSearch.search('anglar', { fuzzy: 0.2 });`,
    },
    {
      id: 5,
      title: 'Prefix Search',
      code: `// Autocomplete: match terms starting with 'ang'
const results = miniSearch.search('ang', { prefix: true });`,
    },
    {
      id: 6,
      title: 'Field Boosting',
      code: `const results = miniSearch.search('framework', {
  boost: { title: 2 }  // title matches are 2x more important
});`,
    },
    {
      id: 7,
      title: 'Filter Results',
      code: `const results = miniSearch.search('search', {
  filter: (result) => result.category === 'frontend'
});`,
    },
    {
      id: 8,
      title: 'Auto-Suggest',
      code: `const suggestions = miniSearch.autoSuggest('ang', { prefix: true });
// => [{ suggestion: 'angular', score: 5.2 }, ...]`,
    },
    {
      id: 9,
      title: 'Serialize / Restore',
      code: `// Save
const json = JSON.stringify(miniSearch);

// Restore
const restored = MiniSearch.loadJSON(json, {
  fields: ['title', 'text']
});`,
    },
  ];

  ngOnInit(): void {
    this.svc.loadAndIndex();
  }

  protected onQueryChange(value: string): void {
    this.queryInput = value;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.svc.search(value);
    }, 200);
  }

  protected onSuggestionClick(suggestion: string): void {
    this.queryInput = suggestion;
    this.svc.search(suggestion);
    this.searchInput()?.nativeElement?.focus();
  }

  protected toggleOption(key: keyof SearchOptions): void {
    const current = this.svc.options()[key];
    if (typeof current === 'boolean') {
      this.svc.updateOption(key, !current as SearchOptions[typeof key]);
    }
  }

  protected toggleCombine(): void {
    const current = this.svc.options().combineWith;
    this.svc.updateOption('combineWith', current === 'OR' ? 'AND' : 'OR');
  }

  protected setCategoryFilter(category: string | null): void {
    this.svc.updateOption('categoryFilter', category);
  }

  protected async copySnippet(code: string, id: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copiedSnippet.set(id);
      setTimeout(() => this.copiedSnippet.set(null), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copiedSnippet.set(id);
      setTimeout(() => this.copiedSnippet.set(null), 2000);
    }
  }

  protected getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      concepts: 'Concepts',
      api: 'API Reference',
      examples: 'Examples',
      'use-cases': 'Use Cases',
    };
    return labels[category] || category;
  }

  protected getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      concepts: 'lightbulb',
      api: 'code',
      examples: 'play_circle',
      'use-cases': 'rocket_launch',
    };
    return icons[category] || 'article';
  }

  protected trackByResultId(_index: number, item: EnrichedResult): number {
    return item.id as number;
  }

  protected formatScore(score: number): string {
    return score.toFixed(2);
  }

  protected clearSearch(): void {
    this.queryInput = '';
    this.svc.search('');
    this.searchInput()?.nativeElement?.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput()?.nativeElement?.focus();
    }
  }
}
