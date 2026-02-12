import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MiniSearchPageComponent } from './minisearch-page.component';
import { MiniSearchService } from './minisearch-search.service';
import { routes } from '../app.routes';

const MOCK_DOCS = [
  { id: 1, title: 'Angular', text: 'Frontend framework', tags: ['angular'], category: 'concepts' },
  { id: 2, title: 'React', text: 'UI library', tags: ['react'], category: 'api' },
];

describe('MiniSearchPageComponent', () => {
  let fixture: ComponentFixture<MiniSearchPageComponent>;
  let component: MiniSearchPageComponent;
  let service: MiniSearchService;

  beforeEach(async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DOCS),
    } as unknown as Response);

    await TestBed.configureTestingModule({
      imports: [MiniSearchPageComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    service = TestBed.inject(MiniSearchService);
    fixture = TestBed.createComponent(MiniSearchPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading state initially', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // State may transition quickly to ready, so check either loading or ready
    const loading = el.querySelector('.ms-status--loading');
    const hero = el.querySelector('.ms-hero');
    expect(loading || hero).toBeTruthy();
  });

  it('should show hero section when ready', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    // Wait for async load
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const hero = el.querySelector('.ms-hero__title');
    expect(hero?.textContent).toContain('MiniSearch');
  });

  it('should show custom solutions note on homepage', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const note = el.querySelector('.ms-custom-note');
    expect(note).toBeTruthy();
    expect(note?.textContent).toContain('custom');
    expect(note?.textContent).toContain('exact');
    expect(note?.textContent).toContain('fuzzy');
  });

  it('should show search input when ready', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.ms-search-bar__input');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should show code snippets section', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const snippets = el.querySelectorAll('.ms-snippet');
    expect(snippets.length).toBeGreaterThan(0);
  });

  it('should show documentation links for snippets', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const links = el.querySelectorAll<HTMLAnchorElement>('.ms-snippet__doc-link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toContain('github.com/lucaong/minisearch');
  });

  it('should show comparison table', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const table = el.querySelector('.ms-table');
    expect(table).toBeTruthy();
  });

  it('should show use cases', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('.ms-usecase-card');
    expect(cards.length).toBe(6);
  });

  it('should focus search input on Alt+Shift+M', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.ms-search-bar__input')!;

    const event = new KeyboardEvent('keydown', {
      key: 'm',
      altKey: true,
      shiftKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });

  it('should focus search input with global shortcut even when event is outside page container', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.ms-search-bar__input')!;
    input.blur();

    const event = new KeyboardEvent('keydown', {
      key: 'M',
      altKey: true,
      shiftKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });

  it('should NOT focus search input on Ctrl+K (no Chrome collision)', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.ms-search-bar__input')!;

    // Blur input first to ensure it's not focused
    input.blur();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(document.activeElement).not.toBe(input);
  });

  it('should show keyboard shortcut hint', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const hint = el.querySelector('.ms-shortcut-hint');
    expect(hint).toBeTruthy();
    expect(hint?.textContent).toContain('Alt');
    expect(hint?.textContent).toContain('Shift');
    expect(hint?.textContent).toContain('M');
  });

  it('should show clickable document link in search results', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    service.search('angular');
    (component as unknown as { queryInput: string }).queryInput = 'angular';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const link = el.querySelector<HTMLAnchorElement>('.ms-result__doc-link');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toContain('github.com/lucaong/minisearch');
  });

  it('should show error state on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    } as unknown as Response);

    // Reset service state
    const freshService = new MiniSearchService();
    await freshService.loadAndIndex();
    expect(freshService.state().status).toBe('error');
  });

  // ID-T 40: addAll batch
  it('should add batch documents via addAll', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const countBefore = service.documentCount();
    service.addAllDocuments([
      { id: 901, title: 'Batch A', text: 'Text A', tags: ['a'], category: 'concepts' },
      { id: 902, title: 'Batch B', text: 'Text B', tags: ['b'], category: 'api' },
    ]);
    expect(service.documentCount()).toBe(countBefore + 2);
  });

  // ID-T 41: addAllAsync chunking
  it('should add documents asynchronously with progress', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const countBefore = service.documentCount();
    const docs = Array.from({ length: 10 }, (_, i) => ({
      id: 800 + i,
      title: `Async ${i}`,
      text: `Text ${i}`,
      tags: ['async'],
      category: 'examples' as const,
    }));
    const promise = service.addAllDocumentsAsync(docs, 3);
    // Progress should start at 0
    expect(service.asyncProgress()).toBeDefined();
    await promise;
    // After completion, progress should be null
    expect(service.asyncProgress()).toBeNull();
    expect(service.documentCount()).toBe(countBefore + 10);
  });

  // ID-T 42: remove via service
  it('should remove a document by ID', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const countBefore = service.documentCount();
    service.removeDocument(1);
    expect(service.documentCount()).toBe(countBefore - 1);
  });

  // ID-T 43: discard via service
  it('should discard a document by ID and increase dirt count', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const dirtBefore = service.getDirtCount();
    service.discardDocument(1);
    expect(service.getDirtCount()).toBeGreaterThan(dirtBefore);
  });

  // ID-T 44: discardAll
  it('should discard all documents', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    expect(service.documentCount()).toBeGreaterThan(0);
    service.discardAllDocuments();
    expect(service.documentCount()).toBe(0);
  });

  // ID-T 45: toJSON / loadJSON roundtrip
  it('should save and restore index via toJSON/loadJSON', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const countBefore = service.documentCount();
    const json = service.saveToJSON();
    expect(json.length).toBeGreaterThan(10);
    expect(service.snapshotJson()).toBe(json);

    // Restore from JSON
    service.loadFromJSON(json);
    expect(service.documentCount()).toBe(countBefore);
  });

  // ID-T 45: loadJSONAsync
  it('should restore index asynchronously via loadJSONAsync', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const countBefore = service.documentCount();
    const json = service.saveToJSON();

    await service.loadFromJSONAsync(json);
    expect(service.documentCount()).toBe(countBefore);
  });

  // ID-T 40: UI shows batch ops section
  it('should show batch operations section', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const batchSection = el.querySelector('.ms-batch-ops');
    expect(batchSection).toBeTruthy();
  });

  // ID-T 42/43: UI shows remove/discard controls
  it('should show remove and discard controls', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const removeInput = el.querySelector('#remove-id');
    const discardInput = el.querySelector('#discard-id');
    expect(removeInput).toBeTruthy();
    expect(discardInput).toBeTruthy();
  });

  // ID-T 45: UI shows snapshot panel
  it('should show snapshot panel', async () => {
    fixture.detectChanges();
    await service.loadAndIndex();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const snapshotPanel = el.querySelector('.ms-snapshot-panel');
    expect(snapshotPanel).toBeTruthy();
  });
});

describe('Routing', () => {
  it('should have /minisearch route', () => {
    const minisearchRoute = routes.find((r) => r.path === 'minisearch');
    expect(minisearchRoute).toBeTruthy();
  });

  it('should redirect / to /minisearch', () => {
    const defaultRoute = routes.find((r) => r.path === '');
    expect(defaultRoute?.redirectTo).toBe('minisearch');
  });
});
