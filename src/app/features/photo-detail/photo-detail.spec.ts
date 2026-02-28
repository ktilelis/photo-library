import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Photo } from '@core/model';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { resolveLocator } from '@testing/test-locator-helper';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotoDetail } from './photo-detail';

@Component({
  template: ''
})
class DummyRouteComponent {}

describe('PhotoDetail', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let favouritesSignal: ReturnType<typeof signal<Record<string, Photo>>>;
  let favouritesStorageMock: {
    favourites: () => Record<string, Photo>;
    removeFavourite: ReturnType<typeof vi.fn>;
  };

  const getElementByTestId = (testId: string) => harness.routeNativeElement?.querySelector(resolveLocator(testId));

  beforeEach(async () => {
    favouritesSignal = signal<Record<string, Photo>>({});
    favouritesStorageMock = {
      favourites: favouritesSignal.asReadonly(),
      removeFavourite: vi.fn()
    };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'photos/:id', component: PhotoDetail },
          { path: 'favorites', component: DummyRouteComponent }
        ]),
        {
          provide: FavouritesStorageService,
          useValue: favouritesStorageMock
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', async () => {
    const component = await harness.navigateByUrl('/photos/sample-id', PhotoDetail);

    expect(component).toBeTruthy();
  });

  it('should render no-favorite message when route id is not in favourites store', async () => {
    await harness.navigateByUrl('/photos/non-existing-id', PhotoDetail);

    expect(getElementByTestId('image')).toBeFalsy();

    const noFavouriteElement = getElementByTestId('no-favorite');
    expect(noFavouriteElement).toBeTruthy();
    expect(noFavouriteElement?.textContent?.trim()).toContain('Photo was not found among favorites.');
  });

  it('should render photo when route id matches a favourite', async () => {
    const photoId = 'photo-1';
    favouritesSignal.set({
      [photoId]: {
        id: photoId,
        width: 120,
        height: 80,
        downloadUrl: 'https://picsum.photos/id/1/120/80'
      }
    });

    const component = await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    expect(component.photo()).toEqual({
      id: photoId,
      downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(photoId)}/1000/1000`,
      width: 1000,
      height: 1000
    });
    expect(getElementByTestId('no-favorite')).toBeFalsy();
    expect(getElementByTestId('image')).toBeTruthy();
  });

  it('should remove current favourite and navigate to /favorites', async () => {
    const photoId = 'fav-1';
    favouritesSignal.set({
      [photoId]: {
        id: photoId,
        width: 120,
        height: 80,
        downloadUrl: 'https://picsum.photos/id/1/120/80'
      }
    });
    const component = await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    component.removeFromFavorites();
    await harness.fixture.whenStable();

    expect(favouritesStorageMock.removeFavourite).toHaveBeenCalledTimes(1);
    expect(favouritesStorageMock.removeFavourite).toHaveBeenCalledWith(photoId);
    expect(router.url).toBe('/favorites');
  });
});
