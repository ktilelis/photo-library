import { Photo } from '@core/model';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotosApiService } from './photos-api.service';

describe('PhotosApiService', () => {
  let service: PhotosApiService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new PhotosApiService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    it('should return 30 seeded photos after the minimum delay', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      let seedIndex = 0;
      vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => `${seedIndex++}-0000-0000-0000-0000`);
      let result: Photo[] | undefined;

      service.getPhotos().subscribe(response => {
        result = response;
      });

      vi.advanceTimersByTime(199);
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(result).toHaveLength(30);
      expect(result![0]).toEqual({
        id: '0-0000-0000-0000-0000',
        width: 200,
        height: 300,
        downloadUrl: `https://picsum.photos/seed/${encodeURIComponent('0-0000-0000-0000-0000')}/200/300`
      });
      expect(result![29]).toEqual({
        id: '29-0000-0000-0000-0000',
        width: 200,
        height: 300,
        downloadUrl: `https://picsum.photos/seed/${encodeURIComponent('29-0000-0000-0000-0000')}/200/300`
      });
    });

    it('should return photos after the maximum delay', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => 'seed-1-seed-1-seed-1');
      let result: Photo[] | undefined;

      service.getPhotos().subscribe(response => {
        result = response;
      });

      vi.advanceTimersByTime(299);
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(result).toHaveLength(30);
    });
  });

  describe('getPhotoInfo', () => {
    it('should return a seeded 1000x1000 photo for the given id after the minimum delay', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      let result: Photo | undefined;
      const photoId = 'photo-id';

      service.getPhotoInfo(photoId).subscribe(response => {
        result = response;
      });

      vi.advanceTimersByTime(199);
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(result).toEqual({
        id: photoId,
        width: 1000,
        height: 1000,
        downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(photoId)}/1000/1000`
      });
    });

    it('should return photo info after the maximum delay', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      let result: Photo | undefined;

      service.getPhotoInfo('seed-1-seed-1').subscribe(response => {
        result = response;
      });

      vi.advanceTimersByTime(299);
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(result).toBeDefined();
    });
  });
});
