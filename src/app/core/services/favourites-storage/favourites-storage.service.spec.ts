import { TestBed } from '@angular/core/testing';

import { Photo } from '@core/model';
import { LOCAL_STORAGE } from '@core/tokens';
import { FavouritesStorageService } from './favourites-storage.service';

describe('FavouritesStorageService', () => {
  let service: FavouritesStorageService;

  class LocalStorageMock implements Storage {
    private store: Record<string, string> = {};

    get length(): number {
      return Object.keys(this.store).length;
    }

    clear(): void {
      this.store = {};
    }

    getItem(key: string): string | null {
      return this.store[key] ?? null;
    }

    key(index: number): string | null {
      return Object.keys(this.store)[index] ?? null;
    }

    removeItem(key: string): void {
      delete this.store[key];
    }

    setItem(key: string, value: string): void {
      this.store[key] = value;
    }
  }

  const storageKey = 'photo-gallery-favourites';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavouritesStorageService, { provide: LOCAL_STORAGE, useClass: LocalStorageMock }]
    });
    service = TestBed.inject(FavouritesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty favourites storage on initialization', () => {
    expect(service.favourites()).toEqual({});
  });

  it('should update the localStorage on adding a favourite', () => {
    const photo: Photo = {
      id: '1',
      width: 200,
      height: 300,
      downloadUrl: 'https://img/1.jpg'
    };

    service.addFavourite(photo);
    expect(service.favourites()).toEqual({ 1: { ...photo } });
  });

  it('should update the localStorage on adding multiple favourites', () => {
    const photo1: Photo = { id: '1', width: 100, height: 100, downloadUrl: '' };
    const photo2: Photo = { id: '2', width: 200, height: 200, downloadUrl: '' };

    service.addFavourite(photo1);
    service.addFavourite(photo2);

    expect(service.favourites()).toEqual({ '1': photo1, '2': photo2 });

    service.removeFavourite('1');
    expect(service.favourites()).toEqual({ '2': photo2 });
  });

  it('should update the localStorage on deleting a favourite', () => {
    const photo = {
      id: '1',
      width: 200,
      height: 300,
      downloadUrl: 'https://img/1.jpg'
    };

    service.addFavourite(photo);
    expect(service.favourites()).toEqual({ '1': { ...photo } });

    service.removeFavourite('1');
    expect(service.favourites()).toEqual({});
  });

  it('should not change localStorage when removing id which does not exist', () => {
    const photo1: Photo = { id: '1', width: 100, height: 100, downloadUrl: '' };
    service.addFavourite(photo1);
    expect(service.favourites()).toEqual({ '1': photo1 });
    service.removeFavourite('3');
    expect(service.favourites()).toEqual({ '1': photo1 });
  });

  it('should not throw if localStorage write fails', () => {
    const storage = TestBed.inject(LOCAL_STORAGE);
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('');
    });

    const photo: Photo = { id: '1', width: 100, height: 100, downloadUrl: '' };
    expect(() => service.addFavourite(photo)).not.toThrow();
    expect(service.favourites()).toEqual({ '1': photo });
  });

  describe('when localStorage contains invalid value', () => {
    let storage: LocalStorageMock;
    beforeEach(() => {
      TestBed.resetTestingModule();
      storage = new LocalStorageMock();
    });

    it('should initialize with empty favourites when stored value is null', () => {
      storage.setItem(storageKey, 'null');

      TestBed.configureTestingModule({
        providers: [FavouritesStorageService, { provide: LOCAL_STORAGE, useValue: storage }]
      });

      const favouritesService = TestBed.inject(FavouritesStorageService);
      expect(favouritesService.favourites()).toEqual({});
    });

    it('should initialize with empty favourites when persisted value is an array', () => {
      storage.setItem(storageKey, '[]');

      TestBed.configureTestingModule({
        providers: [FavouritesStorageService, { provide: LOCAL_STORAGE, useValue: storage }]
      });

      const favouritesService = TestBed.inject(FavouritesStorageService);
      expect(favouritesService.favourites()).toEqual({});
    });

    it('should initialize with empty favourites when persisted value is a primitive', () => {
      storage.setItem(storageKey, '"invalid-shape"');

      TestBed.configureTestingModule({
        providers: [FavouritesStorageService, { provide: LOCAL_STORAGE, useValue: storage }]
      });

      const favouritesService = TestBed.inject(FavouritesStorageService);
      expect(favouritesService.favourites()).toEqual({});
    });

    it('should initialize with persisted favourites when value is an object', () => {
      const persisted = {
        '1': { id: '1', width: 100, height: 100, downloadUrl: 'https://img/1.jpg' }
      };
      storage.setItem(storageKey, JSON.stringify(persisted));

      TestBed.configureTestingModule({
        providers: [FavouritesStorageService, { provide: LOCAL_STORAGE, useValue: storage }]
      });

      const favouritesService = TestBed.inject(FavouritesStorageService);
      expect(favouritesService.favourites()).toEqual(persisted);
    });
  });
});
