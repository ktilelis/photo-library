import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { PhotosApiService } from '@core/services/photos-api/photos-api.service';
import { distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'xm-photo-detail',
  imports: [NgOptimizedImage, MatButton],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss'
})
export class PhotoDetail {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #favouritesStorage = inject(FavouritesStorageService);
  readonly #photoApiService = inject(PhotosApiService);

  readonly photo = toSignal(
    this.#activatedRoute.paramMap.pipe(
      map(pm => pm.get('id')),
      filter(id => !!id),
      distinctUntilChanged(),
      switchMap(id => {
        if (!id || !this.#favouritesStorage.favourites()[id]) {
          return of(null);
        }

        return this.#photoApiService.getPhotoInfo(id);
      })
    ),
    { initialValue: null }
  );

  removeFromFavorites() {
    const photoId = this.photo()?.id;
    if (!photoId) {
      return;
    }

    this.#favouritesStorage.removeFavourite(photoId);
    this.#router.navigateByUrl('/favorites');
  }
}
