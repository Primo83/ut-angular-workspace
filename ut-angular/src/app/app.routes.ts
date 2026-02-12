import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'minisearch',
    loadComponent: () =>
      import('./minisearch/minisearch-page.component').then((m) => m.MiniSearchPageComponent),
  },
  {
    path: '',
    redirectTo: 'minisearch',
    pathMatch: 'full',
  },
];
