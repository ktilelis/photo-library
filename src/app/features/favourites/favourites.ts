import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@core/model';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { PhotoGrid } from '@shared/photo-grid/photo-grid';

@Component({
  selector: 'xm-favourites',
  imports: [PhotoGrid],
  template: ` @if (photos().length) {
      <xm-photo-grid [photos]="photos()" (clickedPhoto)="viewPhoto($event)" data-testid="favourites-photo-grid" />
    } @else {
      <section class="no-favourites-container">
        <p data-testid="no-favourites-message">No favourite photos were found.</p>
      </section>
    }`,
  styles: `
    .no-favourites-container {
      text-align: center;
      padding: 4rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Favourites {
  readonly #favouritesStorage = inject(FavouritesStorageService);
  readonly #router = inject(Router);

  readonly photos = computed<Photo[]>(() => {
    const favs = this.#favouritesStorage.favourites();
    return Object.values(favs);
  });

  viewPhoto(photoId: string) {
    this.#router.navigate(['photos', photoId]);
  }
}
