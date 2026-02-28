import { effect, inject, Injectable, signal } from '@angular/core';
import { Photo } from '@core/model';
import { LOCAL_STORAGE } from '@core/tokens';
import { FavouritesRecord } from './favourites-record';

@Injectable({ providedIn: 'root' })
export class FavouritesStorageService {
  readonly #key = 'photo-gallery-favourites';
  readonly #favourites = signal<FavouritesRecord>({});
  readonly #localStorage = inject<Storage>(LOCAL_STORAGE);

  readonly favourites = this.#favourites.asReadonly();

  constructor() {
    this.#favourites.set(this.#loadFromStorage());

    effect(() => {
      const favs = this.#favourites();
      try {
        this.#localStorage.setItem(this.#key, JSON.stringify(favs));
      } catch {
        // Ignore storage write errors (e.g. quota or restricted contexts)
      }
    });
  }

  addFavourite(photo: Photo): void {
    if (!photo) {
      return;
    }

    this.#favourites.update(favs => ({
      ...favs,
      [photo.id]: photo
    }));
  }

  removeFavourite(id: string): void {
    this.#favourites.update(favs => {
      const found = favs[id];
      if (!found) return favs;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = favs;
      return rest;
    });
  }

  #loadFromStorage(): FavouritesRecord {
    try {
      const localStorageData = JSON.parse(this.#localStorage.getItem(this.#key) ?? '{}');
      if (typeof localStorageData !== 'object' || localStorageData === null || Array.isArray(localStorageData)) {
        return {};
      }

      return localStorageData;
    } catch {
      return {};
    }
  }
}
