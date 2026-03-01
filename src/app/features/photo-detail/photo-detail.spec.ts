import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Photo, PhotoGalleryError } from '@core/model';
import { NotificationsService } from '@core/notifications/notifications.service';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { PhotosApiService } from '@core/services/photos-api/photos-api.service';
import { resolveLocator } from '@testing/test-locator-helper';
import { NEVER, of, throwError } from 'rxjs';
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
  let photosApiMock: {
    getPhotoInfo: ReturnType<typeof vi.fn>;
  };
  let notificationsServiceMock: {
    dispatchNotification: ReturnType<typeof vi.fn>;
  };

  const getElementByTestId = (testId: string) => harness.routeNativeElement?.querySelector(resolveLocator(testId));

  beforeEach(async () => {
    favouritesSignal = signal<Record<string, Photo>>({});
    favouritesStorageMock = {
      favourites: favouritesSignal.asReadonly(),
      removeFavourite: vi.fn()
    };
    photosApiMock = {
      getPhotoInfo: vi.fn((id: string) =>
        of({
          id,
          width: 1000,
          height: 1000,
          downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(id)}/1000/1000`
        })
      )
    };
    notificationsServiceMock = {
      dispatchNotification: vi.fn()
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
        },
        {
          provide: PhotosApiService,
          useValue: photosApiMock
        },
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock
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

    expect(photosApiMock.getPhotoInfo).not.toHaveBeenCalled();
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
        width: 200,
        height: 300,
        downloadUrl: 'https://picsum.photos/id/1/200/300'
      }
    });

    const component = await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    expect(photosApiMock.getPhotoInfo).toHaveBeenCalledTimes(1);
    expect(photosApiMock.getPhotoInfo).toHaveBeenCalledWith(photoId);

    expect(component.photo()).toEqual({
      id: photoId,
      downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(photoId)}/1000/1000`,
      width: 1000,
      height: 1000
    });
    expect(getElementByTestId('no-favorite')).toBeFalsy();
    expect(getElementByTestId('image')).toBeTruthy();
  });

  it('should render loading state while favourite photo details are being fetched', async () => {
    const photoId = 'photo-loading';
    favouritesSignal.set({
      [photoId]: {
        id: photoId,
        width: 200,
        height: 300,
        downloadUrl: 'https://picsum.photos/id/2/200/300'
      }
    });
    photosApiMock.getPhotoInfo.mockReturnValueOnce(NEVER);

    await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    const loader = getElementByTestId('loader');
    expect(loader).toBeTruthy();
    expect(getElementByTestId('image')).toBeFalsy();
    expect(getElementByTestId('no-favorite')).toBeFalsy();
  });

  it('should remove current favourite and navigate to /favorites', async () => {
    const photoId = 'fav-1';
    favouritesSignal.set({
      [photoId]: {
        id: photoId,
        width: 200,
        height: 300,
        downloadUrl: 'https://picsum.photos/id/1/200/300'
      }
    });
    const component = await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    component.removeFromFavorites();
    await harness.fixture.whenStable();

    expect(favouritesStorageMock.removeFavourite).toHaveBeenCalledTimes(1);
    expect(favouritesStorageMock.removeFavourite).toHaveBeenCalledWith(photoId);
    expect(router.url).toBe('/favorites');
  });

  it('should dispatch notification when photo details request fails', async () => {
    const photoId = 'photo-error';
    const apiError: PhotoGalleryError = {
      type: 'server',
      message: 'Failed to load photo info.'
    };

    favouritesSignal.set({
      [photoId]: {
        id: photoId,
        width: 200,
        height: 300,
        downloadUrl: 'https://picsum.photos/id/2/200/300'
      }
    });
    photosApiMock.getPhotoInfo.mockReturnValueOnce(throwError(() => apiError));

    await harness.navigateByUrl(`/photos/${photoId}`, PhotoDetail);

    expect(notificationsServiceMock.dispatchNotification).toHaveBeenCalledTimes(1);
    expect(notificationsServiceMock.dispatchNotification).toHaveBeenCalledWith(apiError.message);
    expect(getElementByTestId('no-favorite')).toBeTruthy();
  });
});
