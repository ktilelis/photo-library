import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/photostream/photostream').then(c => c.Photostream)
  },
  {
    path: 'favourites',
    loadComponent: () => import('./features/favourites/favourites').then(c => c.Favourites)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
