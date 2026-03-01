import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoGalleryError } from '@core/model';
import { NotificationsService } from '@core/notifications/notifications.service';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { PhotosApiService } from '@core/services/photos-api/photos-api.service';
import { Loader } from '@shared/loader/loader';
import { MessageArea } from '@shared/message-area/message-area';
import { catchError, distinctUntilChanged, filter, map, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'xm-photo-detail',
  imports: [NgOptimizedImage, MatButton, MessageArea, Loader],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss'
})
export class PhotoDetail {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #favouritesStorage = inject(FavouritesStorageService);
  readonly #photoApiService = inject(PhotosApiService);
  readonly #notificationsService = inject(NotificationsService);

  readonly #photoState = toSignal(
    this.#activatedRoute.paramMap.pipe(
      map(pm => pm.get('id')),
      filter(id => !!id),
      distinctUntilChanged(),
      switchMap(id => {
        if (!id || !this.#favouritesStorage.favourites()[id]) {
          return of({ photo: null, isLoading: false });
        }

        return this.#photoApiService.getPhotoInfo(id).pipe(
          map(photo => ({ photo, isLoading: false })),
          catchError((error: PhotoGalleryError) => {
            this.#notificationsService.dispatchNotification(error.message);
            return of({ photo: null, isLoading: false });
          }),
          startWith({ photo: null, isLoading: true })
        );
      })
    ),
    { initialValue: { photo: null, isLoading: true } }
  );
  readonly photo = computed(() => this.#photoState().photo);
  readonly isLoading = computed(() => this.#photoState().isLoading);

  removeFromFavorites() {
    const photoId = this.photo()?.id;
    if (!photoId) {
      return;
    }

    this.#favouritesStorage.removeFavourite(photoId);
    this.#router.navigateByUrl('/favorites');
  }
}
