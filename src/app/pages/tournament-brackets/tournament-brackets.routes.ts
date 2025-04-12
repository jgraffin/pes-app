import { Routes } from '@angular/router';
import { TournamentBracketsPage } from './tournament-brackets.page';

export const TOURNAMENT_BRACKETS_PAGE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TournamentBracketsPage,
  },
];
