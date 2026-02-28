import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@core/model';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { map } from 'rxjs';

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

  #photoId = toSignal(this.#activatedRoute.paramMap.pipe(map(pm => pm.get('id'))), { initialValue: null });

  photo = computed(() => {
    const photoId = this.#photoId();
    if (!photoId) {
      return null;
    }

    const foundFavourite = this.#favouritesStorage.favourites()[photoId];
    if (!foundFavourite) {
      return null;
    }

    return {
      id: photoId,
      downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(photoId)}/1000/1000`,
      width: 1000,
      height: 1000
    } satisfies Photo;
  });

  removeFromFavorites() {
    if (!this.#photoId()) {
      return;
    }
    this.#favouritesStorage.removeFavourite(this.#photoId()!);
    this.#router.navigateByUrl('/favorites');
  }
}
