import { Component, OnInit, inject, signal, ElementRef, viewChild, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiniSearchService, DocRecord, EnrichedResult, SearchOptions } from './minisearch-search.service';

interface CodeSnippet {
  id: number;
  title: string;
  code: string;
  docUrl: string;
}

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
  protected readonly liveMessage = signal<string>('');
  protected readonly liveMessageType = signal<'success' | 'error'>('success');
  protected readonly showAdvanced = signal(false);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private liveIdCounter = 9900;

  protected liveDoc: Omit<DocRecord, 'id' | 'tags'> & { title: string; text: string; category: string } = {
    title: '',
    text: '',
    category: 'examples',
  };
  protected liveDocTags = '';

  /** ID-T 42/43: inputy dla remove/discard */
  protected removeDocId = '';
  protected discardDocId = '';
  /** ID-T 44: potwierdzenie discardAll */
  protected readonly showDiscardAllConfirm = signal(false);
  /** ID-T 45: metryki snapshotu */
  protected readonly snapshotSize = signal<string | null>(null);
  protected readonly snapshotLoadTime = signal<number>(0);

  protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly availableFields = ['title', 'text', 'tags'];
  readonly availableRoles = ['all', 'guest', 'admin'];
  readonly filterStrategies = ['none', 'minLength', 'hasTag'] as const;

  readonly codeSnippets: CodeSnippet[] = [
    {
      id: 1,
      title: 'Tworzenie indeksu',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=new+MiniSearch&type=code',
      code: `import MiniSearch from 'minisearch';

const miniSearch = new MiniSearch({
  fields: ['title', 'text'],
  storeFields: ['title', 'category']
});`,
    },
    {
      id: 2,
      title: 'Dodawanie dokumentów',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=addAll&type=code',
      code: `miniSearch.addAll([
  { id: 1, title: 'Angular', text: 'Frontend framework', category: 'frontend' },
  { id: 2, title: 'React', text: 'Biblioteka UI', category: 'frontend' },
  { id: 3, title: 'Node.js', text: 'Środowisko JS', category: 'backend' },
]);`,
    },
    {
      id: 3,
      title: 'Podstawowe wyszukiwanie',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=search%28query&type=code',
      code: `const results = miniSearch.search('angular');
// => [{ id: 1, score: 1.38, match: { angular: ['title'] } }]`,
    },
    {
      id: 4,
      title: 'Wyszukiwanie rozmyte',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=fuzzy&type=code',
      code: `// Toleruje literówki (do 20% długości słowa)
const results = miniSearch.search('anglar', { fuzzy: 0.2 });`,
    },
    {
      id: 5,
      title: 'Wyszukiwanie prefiksowe',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=prefix&type=code',
      code: `// Autouzupełnianie: dopasuj słowa zaczynające się od 'ang'
const results = miniSearch.search('ang', { prefix: true });`,
    },
    {
      id: 6,
      title: 'Wzmacnianie pól',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=boost&type=code',
      code: `const results = miniSearch.search('framework', {
  boost: { title: 2 }  // dopasowania w tytule są 2x ważniejsze
});`,
    },
    {
      id: 7,
      title: 'Filtrowanie wyników',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=filter&type=code',
      code: `const results = miniSearch.search('search', {
  filter: (result) => result.category === 'frontend'
});`,
    },
    {
      id: 8,
      title: 'Podpowiedzi',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=autoSuggest&type=code',
      code: `const suggestions = miniSearch.autoSuggest('ang', { prefix: true });
// => [{ suggestion: 'angular', score: 5.2 }, ...]`,
    },
    {
      id: 9,
      title: 'Zapis / Odtworzenie',
      docUrl: 'https://github.com/lucaong/minisearch/search?q=loadJSON&type=code',
      code: `// Zapis
const json = JSON.stringify(miniSearch);

// Odtworzenie
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
    const next = current === 'OR' ? 'AND' : current === 'AND' ? 'AND_NOT' : 'OR';
    this.svc.updateOption('combineWith', next);
  }

  protected setCategoryFilter(category: string | null): void {
    this.svc.updateOption('categoryFilter', category);
  }

  protected toggleAdvanced(): void {
    this.showAdvanced.update(v => !v);
  }

  protected toggleField(field: string): void {
    const current = this.svc.options().searchFields;
    if (current.includes(field)) {
      this.svc.updateOption('searchFields', current.filter(f => f !== field));
    } else {
      this.svc.updateOption('searchFields', [...current, field]);
    }
  }

  protected isFieldSelected(field: string): boolean {
    return this.svc.options().searchFields.includes(field);
  }

  protected onSliderChange(key: keyof SearchOptions, value: string): void {
    this.svc.updateOption(key, parseFloat(value) as SearchOptions[typeof key]);
  }

  protected onNumberChange(key: keyof SearchOptions, value: string): void {
    this.svc.updateOption(key, parseInt(value, 10) as SearchOptions[typeof key]);
  }

  protected onTextChange(key: keyof SearchOptions, value: string): void {
    this.svc.updateOption(key, value as SearchOptions[typeof key]);
  }

  protected switchToOffline(): void {
    this.svc.loadOffline();
  }

  protected switchToOnline(): void {
    this.svc.loadAndIndex();
  }

  protected async copySnippet(code: string, id: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copiedSnippet.set(id);
      setTimeout(() => this.copiedSnippet.set(null), 2000);
    } catch {
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
      concepts: 'Pojęcia',
      api: 'Dokumentacja API',
      examples: 'Przykłady',
      'use-cases': 'Zastosowania',
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

  protected addLiveDocument(): void {
    const doc: DocRecord = {
      id: ++this.liveIdCounter,
      title: this.liveDoc.title.trim(),
      text: this.liveDoc.text.trim(),
      tags: this.liveDocTags.split(',').map(t => t.trim()).filter(Boolean),
      category: this.liveDoc.category,
    };
    this.svc.addDocument(doc);
    this.showLiveMessage(`Dodano dokument #${doc.id}: „${doc.title}"`);
    this.resetLiveForm();
  }

  protected replaceLiveDocument(): void {
    const doc: DocRecord = {
      id: this.liveIdCounter,
      title: this.liveDoc.title.trim(),
      text: this.liveDoc.text.trim(),
      tags: this.liveDocTags.split(',').map(t => t.trim()).filter(Boolean),
      category: this.liveDoc.category,
    };
    this.svc.replaceDocument(doc);
    this.showLiveMessage(`Zamieniono dokument #${doc.id}: „${doc.title}"`);
    this.resetLiveForm();
  }

  protected vacuumIndex(): void {
    this.svc.vacuum();
    this.showLiveMessage('Porządkowanie zakończone — wyczyszczono usunięte wpisy.');
  }

  /** ID-T 40: addAll batch — dodaje paczkę przykładowych dokumentów */
  protected addBatchDocuments(): void {
    const batch: DocRecord[] = [
      { id: ++this.liveIdCounter, title: 'Batch: Indeks odwrócony', text: 'Struktura danych mapująca słowa na dokumenty, w których występują.', tags: ['indeks', 'struktura'], category: 'concepts' },
      { id: ++this.liveIdCounter, title: 'Batch: TF-IDF', text: 'Miara istotności słowa w dokumencie — częstość lokalna vs. rzadkość globalna.', tags: ['ranking', 'algorytm'], category: 'concepts' },
      { id: ++this.liveIdCounter, title: 'Batch: Stemming', text: 'Redukcja słów do rdzenia, np. "szukanie" → "szuk".', tags: ['nlp', 'stemming'], category: 'api' },
      { id: ++this.liveIdCounter, title: 'Batch: N-gramy', text: 'Podciągi znaków o stałej długości — przydatne w fuzzy search.', tags: ['ngram', 'fuzzy'], category: 'api' },
      { id: ++this.liveIdCounter, title: 'Batch: Wyszukiwarka e-commerce', text: 'Przykład użycia MiniSearch w sklepie internetowym z filtrowaniem po cechach produktu.', tags: ['ecommerce', 'example'], category: 'use-cases' },
    ];
    this.svc.addAllDocuments(batch);
    this.showLiveMessage(`Dodano paczkę ${batch.length} dokumentów (addAll).`);
  }

  /** ID-T 41: addAllAsync — asynchroniczne dodanie z postępem */
  protected async addBatchDocumentsAsync(): Promise<void> {
    const batch: DocRecord[] = [];
    for (let i = 0; i < 100; i++) {
      batch.push({
        id: ++this.liveIdCounter,
        title: `Async #${i + 1}: Dokument testowy`,
        text: `Treść dokumentu testowego nr ${i + 1} wygenerowanego dla demonstracji addAllAsync z chunkingiem.`,
        tags: ['async', 'batch', `nr${i + 1}`],
        category: ['concepts', 'api', 'examples', 'use-cases'][i % 4],
      });
    }
    await this.svc.addAllDocumentsAsync(batch, 20);
    this.showLiveMessage(`Dodano asynchronicznie ${batch.length} dokumentów (addAllAsync, chunk=20).`);
  }

  /** ID-T 42: remove — usuwa dokument po ID */
  protected removeLiveDocument(): void {
    const id = parseInt(this.removeDocId, 10);
    if (isNaN(id)) return;
    this.svc.removeDocument(id);
    this.showLiveMessage(`Usunięto dokument #${id} (remove).`);
    this.removeDocId = '';
  }

  /** ID-T 43: discard — odrzuca dokument po ID (leniwe usuwanie) */
  protected discardLiveDocument(): void {
    const id = parseInt(this.discardDocId, 10);
    if (isNaN(id)) return;
    this.svc.discardDocument(id);
    this.showLiveMessage(`Odrzucono dokument #${id} (discard). Wpis pozostaje w indeksie do vacuum.`);
    this.discardDocId = '';
  }

  /** ID-T 44: discardAll — potwierdzenie + wykonanie */
  protected confirmDiscardAll(): void {
    this.showDiscardAllConfirm.set(true);
  }

  protected executeDiscardAll(): void {
    this.svc.discardAllDocuments();
    this.showDiscardAllConfirm.set(false);
    this.showLiveMessage('Odrzucono wszystkie dokumenty (discardAll). Użyj vacuum, aby wyczyścić indeks.');
  }

  protected cancelDiscardAll(): void {
    this.showDiscardAllConfirm.set(false);
  }

  /** ID-T 45: snapshot — zapis */
  protected saveSnapshot(): void {
    const json = this.svc.saveToJSON();
    const sizeKb = (new Blob([json]).size / 1024).toFixed(1);
    this.snapshotSize.set(`${sizeKb} kB`);
    this.showLiveMessage(`Zapisano snapshot indeksu (${sizeKb} kB).`);
  }

  /** ID-T 45: snapshot — odtworzenie sync */
  protected loadSnapshot(): void {
    const json = this.svc.snapshotJson();
    if (!json) return;
    const start = performance.now();
    this.svc.loadFromJSON(json);
    this.snapshotLoadTime.set(performance.now() - start);
    this.showLiveMessage(`Odtworzono indeks z JSON (loadJSON) w ${this.snapshotLoadTime().toFixed(1)} ms — bez reindeksacji.`);
  }

  /** ID-T 45: snapshot — odtworzenie async */
  protected async loadSnapshotAsync(): Promise<void> {
    const json = this.svc.snapshotJson();
    if (!json) return;
    const start = performance.now();
    await this.svc.loadFromJSONAsync(json);
    this.snapshotLoadTime.set(performance.now() - start);
    this.showLiveMessage(`Odtworzono indeks asynchronicznie (loadJSONAsync) w ${this.snapshotLoadTime().toFixed(1)} ms.`);
  }

  /** ID-T 54: n-gram comparison query */
  protected ngramCompareQuery = '';

  /** ID-T 54: uruchom porównanie n-gram vs standard */
  protected runNgramCompare(): void {
    this.svc.compareNgramVsStandard(this.ngramCompareQuery);
  }

  protected formatDirtFactor(value: number): string {
    return (value * 100).toFixed(1) + '%';
  }

  private showLiveMessage(msg: string): void {
    this.liveMessage.set(msg);
    this.liveMessageType.set('success');
    setTimeout(() => this.liveMessage.set(''), 3000);
  }

  private resetLiveForm(): void {
    this.liveDoc = { title: '', text: '', category: 'examples' };
    this.liveDocTags = '';
  }

  protected getCombineLabel(): string {
    const mode = this.svc.options().combineWith;
    return mode === 'AND_NOT' ? 'AND NOT' : mode;
  }

  protected getCombineTooltip(): string {
    const mode = this.svc.options().combineWith;
    if (mode === 'OR') {
      return 'Pokazuje wyniki zawierające dowolne z wpisanych słów. Wpisujesz „angular react"? Zobaczysz dokumenty o Angularze ALBO o Reactcie. Daje najwięcej wyników — dobry punkt startowy. Kliknij, żeby przełączyć na tryb AND.';
    }
    if (mode === 'AND') {
      return 'Pokazuje tylko wyniki zawierające WSZYSTKIE wpisane słowa naraz. Wpisujesz „angular framework"? Zobaczysz tylko dokumenty, w których występują oba słowa jednocześnie. Mniej wyników, ale celniejsze. Kliknij, żeby przełączyć na AND NOT.';
    }
    return 'Najpierw szuka wyników pasujących do głównych słów, a potem odrzuca te, w których pojawiają się słowa wykluczone (wpisz je poniżej w „Opcjach zaawansowanych"). Kliknij, żeby wrócić do trybu OR.';
  }

  protected getRoleLabel(role: string): string {
    const labels: Record<string, string> = { all: 'Wszyscy', guest: 'Gość', admin: 'Admin' };
    return labels[role] || role;
  }

  protected getFilterStrategyLabel(s: string): string {
    const labels: Record<string, string> = { none: 'Brak', minLength: 'Min. długość tekstu', hasTag: 'Zawiera tag' };
    return labels[s] || s;
  }

  protected getMatchExplanation(result: { match: Record<string, string[]>; score: number }): string {
    const parts: string[] = [];
    for (const [term, fields] of Object.entries(result.match)) {
      parts.push(`„${term}" → ${fields.join(', ')}`);
    }
    return parts.join(' | ');
  }

  protected toggleIndexOption(key: keyof SearchOptions): void {
    const current = this.svc.options()[key];
    if (typeof current === 'boolean') {
      this.svc.updateIndexOption(key, !current as SearchOptions[typeof key]);
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected onGlobalKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      this.searchInput()?.nativeElement?.focus();
    }
  }
}
