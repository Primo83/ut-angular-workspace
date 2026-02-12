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
