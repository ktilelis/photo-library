import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: { activeSection: 'photos' },
    loadComponent: () => import('./features/photostream/photostream').then(c => c.Photostream)
  },
  {
    path: 'favorites',
    data: { activeSection: 'favorites' },
    loadComponent: () => import('./features/favourites/favourites').then(c => c.Favourites)
  },
  {
    path: 'photos/:id',
    data: { activeSection: 'favorites' },
    loadComponent: () => import('./features/photo-detail/photo-detail').then(c => c.PhotoDetail)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
