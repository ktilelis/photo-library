import { Injectable } from '@angular/core';
import { Photo, PhotoGalleryError } from '@core/model';
import { catchError, delay, Observable, of, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosApiService {
  readonly #baseUrl = 'https://picsum.photos/seed';
  readonly #pageSize = 30;
  readonly #defaultPhotosErrorMessage = 'Failed to load photos.';
  readonly #defaultPhotoInfoErrorMessage = 'Failed to load photo info.';

  getPhotos(): Observable<Photo[]> {
    const photos = Array.from({ length: this.#pageSize }, () => this.#buildPhoto());

    return of(photos).pipe(
      delay(this.#applyRandomDelay()),
      take(1),
      catchError(() =>
        throwError(
          (): PhotoGalleryError => ({
            type: 'server',
            message: this.#defaultPhotosErrorMessage
          })
        )
      )
    );
  }

  getPhotoInfo(id: string): Observable<Photo> {
    if (!id) {
      return throwError(
        (): PhotoGalleryError => ({
          type: 'client',
          message: 'Photo id is required.'
        })
      );
    }

    const photoInfo = this.#buildPhoto(id, 1000, 1000);

    return of(photoInfo).pipe(
      delay(this.#applyRandomDelay()),
      take(1),
      catchError(() =>
        throwError(
          (): PhotoGalleryError => ({
            type: 'server',
            message: this.#defaultPhotoInfoErrorMessage
          })
        )
      )
    );
  }

  #buildPhoto(seed?: string, width = 200, height = 300): Photo {
    seed = seed || crypto.randomUUID();
    const imageUrl = `${this.#baseUrl}/${encodeURIComponent(seed)}/${width}/${height}`;

    return {
      id: seed,
      width,
      height,
      downloadUrl: imageUrl
    };
  }

  #applyRandomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
