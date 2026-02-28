import { Directive, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Photo } from '@core/model';
import { PhotosApiService } from '@core/services/photos-api/photos-api.service';
import { InfiniteScrollTrigger } from '@shared/infinite-scroll-trigger/infinite-scroll-trigger';
import { getElementByLocator } from '@testing/test-locator-helper';
import { of, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Photostream } from './photostream';

@Directive({
  selector: '[xmInfiniteScrollTrigger]'
})
class InfiniteScrollTriggerStub {
  triggerScroll = output<void>();
}

describe('Photostream', () => {
  let component: Photostream;
  let fixture: ComponentFixture<Photostream>;
  let photosApiServiceMock: {
    getPhotos: ReturnType<typeof vi.fn>;
  };

  const firstBatch: Photo[] = [{ id: '1', width: 200, height: 300, downloadUrl: 'https://picsum.photos/id/1/200/300' }];
  const secondBatch: Photo[] = [
    { id: '2', width: 200, height: 300, downloadUrl: 'https://picsum.photos/id/2/200/300' }
  ];

  beforeEach(async () => {
    photosApiServiceMock = {
      getPhotos: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Photostream],
      providers: [{ provide: PhotosApiService, useValue: photosApiServiceMock }]
    })
      .overrideComponent(Photostream, {
        remove: { imports: [InfiniteScrollTrigger] },
        add: { imports: [InfiniteScrollTriggerStub] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(Photostream);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and load photos on init', () => {
    photosApiServiceMock.getPhotos.mockReturnValue(of(firstBatch));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(photosApiServiceMock.getPhotos).toHaveBeenCalledTimes(1);
    expect(component.photos()).toEqual(firstBatch);
    expect(component.isLoading()).toBe(false);
    expect(getElementByLocator(fixture, 'load-more-sentry')).toBeTruthy();
  });

  it('should show loader while loading and hide it after photos resolve', () => {
    const pendingRequest$ = new Subject<Photo[]>();
    photosApiServiceMock.getPhotos.mockReturnValue(pendingRequest$.asObservable());

    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
    expect(getElementByLocator(fixture, 'loader')).toBeTruthy();

    pendingRequest$.next(firstBatch);
    pendingRequest$.complete();
    fixture.detectChanges();

    expect(component.photos()).toEqual(firstBatch);
    expect(component.isLoading()).toBe(false);
    expect(getElementByLocator(fixture, 'loader')).toBeNull();
  });

  it('should append photos when infinite scroll trigger emits', () => {
    photosApiServiceMock.getPhotos.mockReturnValueOnce(of(firstBatch)).mockReturnValueOnce(of(secondBatch));

    fixture.detectChanges();

    const triggerDebugEl = fixture.debugElement.query(By.directive(InfiniteScrollTriggerStub));
    const triggerDirective = triggerDebugEl.injector.get(InfiniteScrollTriggerStub);

    triggerDirective.triggerScroll.emit();
    fixture.detectChanges();

    expect(photosApiServiceMock.getPhotos).toHaveBeenCalledTimes(2);
    expect(component.photos()).toEqual([...firstBatch, ...secondBatch]);
  });
});
