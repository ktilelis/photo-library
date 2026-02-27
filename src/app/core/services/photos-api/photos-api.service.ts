import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Photo } from '@core/model';
import { catchError, delay, Observable } from 'rxjs';
import { mapError } from './error-mapper';

@Injectable({
  providedIn: 'root'
})
export class PhotosApiService {
  readonly #sourceUrl = 'https://picsum.photos';
  readonly #http = inject(HttpClient);

  getPhotos(page = 1): Observable<Photo[]> {
    return this.#http
      .get<Photo[]>(`${this.#sourceUrl}/v2/list?page=${page}`)
      .pipe(delay(this.#getRandomDelay()), catchError(mapError));
  }

  #getRandomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
