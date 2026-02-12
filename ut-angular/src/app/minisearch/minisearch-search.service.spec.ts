import { TestBed } from '@angular/core/testing';
import { MiniSearchService } from './minisearch-search.service';

const MOCK_DOCS = [
  { id: 1, title: 'Angular Framework', text: 'A frontend framework by Google', tags: ['angular', 'frontend'], category: 'concepts' },
  { id: 2, title: 'React Library', text: 'A UI library by Meta', tags: ['react', 'frontend'], category: 'concepts' },
  { id: 3, title: 'Node.js Runtime', text: 'JavaScript runtime for server', tags: ['node', 'backend'], category: 'api' },
  { id: 4, title: 'Prefix Search', text: 'Search by beginning of terms', tags: ['prefix', 'search'], category: 'examples' },
  { id: 5, title: 'Fuzzy Search', text: 'Tolerates typos in queries', tags: ['fuzzy', 'typo'], category: 'examples' },
  { id: 6, title: 'Documentation Tools', text: 'VitePress uses MiniSearch for docs', tags: ['docs', 'vitepress'], category: 'use-cases' },
];

describe('MiniSearchService', () => {
  let service: MiniSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with idle state', () => {
    expect(service.state()).toEqual({ status: 'idle' });
  });

  describe('after loading', () => {
    beforeEach(async () => {
      // Mock fetch to return our test docs
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(MOCK_DOCS),
      } as unknown as Response);

      await service.loadAndIndex();
    });

    it('should set state to ready', () => {
      expect(service.state().status).toBe('ready');
    });

    it('should report correct document count', () => {
      expect(service.documentCount()).toBe(6);
    });

    it('should have 4 categories', () => {
      expect(service.categories()).toEqual(['api', 'concepts', 'examples', 'use-cases']);
    });

    it('should record index time', () => {
      expect(service.indexTimeMs()).toBeGreaterThan(0);
    });

    describe('search', () => {
      it('should find documents by title', () => {
        service.search('angular');
        expect(service.results().length).toBeGreaterThan(0);
        expect(service.results()[0].title).toContain('Angular');
      });

      it('should return empty for empty query', () => {
        service.search('');
        expect(service.results()).toEqual([]);
      });

      it('should return empty for no matches', () => {
        service.search('xyznonexistent');
        expect(service.results()).toEqual([]);
      });

      it('should support prefix search', () => {
        service.updateOption('prefix', true);
        service.search('ang');
        expect(service.results().length).toBeGreaterThan(0);
      });

      it('should support fuzzy search', () => {
        service.updateOption('fuzzy', true);
        service.search('anglar'); // typo
        expect(service.results().length).toBeGreaterThan(0);
      });

      it('should support field boosting', () => {
        service.updateOption('boost', true);
        service.search('framework');
        expect(service.results().length).toBeGreaterThan(0);
      });

      it('should filter by category', () => {
        service.updateOption('categoryFilter', 'examples');
        service.search('search');
        const results = service.results();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((r) => {
          expect(r.category).toBe('examples');
        });
      });

      it('should support AND combineWith', () => {
        service.updateOption('combineWith', 'AND');
        service.search('angular framework');
        const results = service.results();
        expect(results.length).toBeGreaterThan(0);
      });

      it('should provide suggestions', () => {
        service.search('ang');
        expect(service.suggestions().length).toBeGreaterThan(0);
      });

      it('should measure search time', () => {
        service.search('angular');
        expect(service.searchTimeMs()).toBeGreaterThanOrEqual(0);
      });

      it('should generate facet counts', () => {
        service.updateOption('categoryFilter', null);
        service.search('search');
        const facets = service.facetCounts();
        expect(Object.keys(facets).length).toBeGreaterThan(0);
      });

      it('should highlight matched terms', () => {
        service.search('angular');
        const r = service.results()[0];
        expect(r.highlightedTitle).toContain('<mark>');
      });
    });
  });

  describe('error handling', () => {
    it('should set error state on fetch failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as unknown as Response);

      await service.loadAndIndex();
      expect(service.state().status).toBe('error');
      expect(service.state().error).toContain('500');
    });

    it('should set error state on network error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await service.loadAndIndex();
      expect(service.state().status).toBe('error');
      expect(service.state().error).toBe('Network error');
    });
  });
});
