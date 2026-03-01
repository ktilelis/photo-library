import { Injectable } from '@angular/core';
import { Photo } from '@core/model';
import { delay, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosApiService {
  readonly #baseUrl = 'https://picsum.photos/seed';
  readonly #pageSize = 30;

  getPhotos(): Observable<Photo[]> {
    const photos = Array.from({ length: this.#pageSize }, () => this.#buildPhoto());

    return of(photos).pipe(delay(this.#applyRandomDelay()), take(1));
  }

  getPhotoInfo(id: string) {
    const photoInfo = this.#buildPhoto(id, 1000, 1000);
    return of(photoInfo).pipe(delay(this.#applyRandomDelay()), take(1));
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
