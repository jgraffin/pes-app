import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.page.routes').then((m) => m.HOME_PAGE_ROUTES),
  },
  {
    path: 'tournament',
    loadChildren: () =>
      import('./pages/tournament-brackets/tournament-brackets.routes').then(
        (r) => r.TOURNAMENT_BRACKETS_PAGE_ROUTES
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
