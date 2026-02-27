import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Photo, PhotoGalleryError } from '@core/model';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotosApiService } from './photos-api.service';

describe('PhotosApiService', () => {
  let service: PhotosApiService;
  let httpTestingController: HttpTestingController;

  const photo: Photo = {
    author: 'Kostas Tilelis',
    download_url: 'https://picsum.photos/id/1/500/500',
    height: 500,
    id: '1',
    url: 'https://picsum.photos/id/1',
    width: 500
  };

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PhotosApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    it('should fetch photos from default page with delay', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      let result: Photo[] | undefined;

      service.getPhotos().subscribe(response => {
        result = response;
      });

      const request = httpTestingController.expectOne('https://picsum.photos/v2/list?page=1');
      expect(request.request.method).toBe('GET');
      request.flush([photo]);

      vi.advanceTimersByTime(199);
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(result).toEqual([photo]);
    });

    it('should fetch photos from provided page', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      let result: Photo[] | undefined;

      service.getPhotos(3).subscribe(response => {
        result = response;
      });

      const request = httpTestingController.expectOne('https://picsum.photos/v2/list?page=3');
      expect(request.request.method).toBe('GET');
      request.flush([photo]);

      vi.advanceTimersByTime(200);
      expect(result).toEqual([photo]);
    });

    it('should map server errors for getPhotos', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      let mappedError: PhotoGalleryError | undefined;

      service.getPhotos().subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error: PhotoGalleryError) => {
          mappedError = error;
        }
      });

      const request = httpTestingController.expectOne('https://picsum.photos/v2/list?page=1');
      request.flush('Server failure', {
        status: 500,
        statusText: 'Server Error'
      });

      expect(mappedError).toEqual(
        expect.objectContaining({
          type: 'server',
          statusCode: 500
        })
      );
    });
  });
});
