import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Photo } from '@core/model';
import { FavouritesStorageService } from '@core/services/favourites-storage/favourites-storage.service';
import { getElementByLocator } from '@testing/test-locator-helper';
import { beforeEach, describe, expect, it } from 'vitest';
import { Favourites } from './favourites';

describe('Favourites', () => {
  let component: Favourites;
  let fixture: ComponentFixture<Favourites>;
  let favouritesSignal: ReturnType<typeof signal<Record<string, Photo>>>;

  beforeEach(async () => {
    favouritesSignal = signal<Record<string, Photo>>({});

    await TestBed.configureTestingModule({
      imports: [Favourites],
      providers: [
        {
          provide: FavouritesStorageService,
          useValue: {
            favourites: favouritesSignal.asReadonly()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Favourites);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display a message when no favourites are found', () => {
    expect(component.photos()).toEqual([]);
    const photoGrid = getElementByLocator(fixture, 'favourites-photo-grid');
    expect(photoGrid).toBeFalsy();

    const noFavouritesFound = getElementByLocator(fixture, 'no-favourites-message');
    expect(noFavouritesFound).toBeTruthy();
    const message = noFavouritesFound.textContent?.trim();
    expect(message).toBe('No favourite photos were found.');
  });

  it('should display favourite photos when favourites found in storage', async () => {
    const photo1: Photo = { id: '1', width: 200, height: 300, downloadUrl: 'https://picsum.photos/id/1/200/300' };
    const photo2: Photo = { id: '2', width: 200, height: 300, downloadUrl: 'https://picsum.photos/id/2/200/300' };

    favouritesSignal.set({
      [photo1.id]: photo1,
      [photo2.id]: photo2
    });

    fixture.detectChanges();
    const noFavouritesFound = getElementByLocator(fixture, 'no-favourites-message');
    expect(noFavouritesFound).toBeFalsy();

    const photoGrid = getElementByLocator(fixture, 'favourites-photo-grid');
    expect(photoGrid).toBeTruthy();
  });
});
