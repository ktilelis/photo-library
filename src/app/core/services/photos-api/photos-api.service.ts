import { Injectable } from '@angular/core';
import { Photo } from '@core/model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosApiService {
  readonly #baseUrl = 'https://picsum.photos/seed';
  readonly #pageSize = 30;

  getPhotos(): Observable<Photo[]> {
    const photos = Array.from({ length: this.#pageSize }, () => this.#buildSeededPhoto());

    return of(photos).pipe(delay(this.#applyRandomDelay()));
  }

  #buildSeededPhoto(width = 200, height = 300): Photo {
    const seed = crypto.randomUUID();
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
