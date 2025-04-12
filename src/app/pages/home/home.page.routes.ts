import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const HOME_PAGE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
  },
];
