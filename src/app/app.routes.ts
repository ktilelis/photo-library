import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/photostream/photostream').then(c => c.Photostream)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favourites/favourites').then(c => c.Favourites)
  },
  {
    path: 'photos/:id',
    loadComponent: () => import('./features/photo-detail/photo-detail').then(c => c.PhotoDetail)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
