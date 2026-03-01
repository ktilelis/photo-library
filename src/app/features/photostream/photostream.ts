import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Photo } from '@core/model';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { PhotosApiService } from '@core/services/photos-api/photos-api.service';
import { InfiniteScrollTrigger } from '@shared/infinite-scroll-trigger/infinite-scroll-trigger';
import { PhotoGrid } from '@shared/photo-grid/photo-grid';
import { finalize } from 'rxjs';

@Component({
  selector: 'xm-photostream',
  imports: [PhotoGrid, MatProgressSpinner, InfiniteScrollTrigger],
  templateUrl: './photostream.html',
  styleUrl: './photostream.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Photostream implements OnInit {
  readonly #photoApiService = inject(PhotosApiService);
  readonly #favouritesStorage = inject(FavouritesStorageService);
  readonly #destroyRef = inject(DestroyRef);

  photos = signal<Photo[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos() {
    this.isLoading.set(true);
    this.#photoApiService
      .getPhotos()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(photos => {
        this.photos.update(cur => cur.concat(photos));
      });
  }

  addToFavourites(photoId: string) {
    const photo = this.photos().find(p => p.id === photoId);

    if (!photo) {
      return;
    }

    this.#favouritesStorage.addFavourite(photo);
  }
}
