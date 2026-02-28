import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Photo } from '@core/model';

import { getElementByLocator, resolveLocator } from '@testing/test-locator-helper';
import { PhotoCard } from '../photo-card/photo-card';
import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
  let component: PhotoGrid;
  let fixture: ComponentFixture<PhotoGrid>;

  const mockPhotos: Photo[] = [
    {
      id: 'photo-1',
      downloadUrl: 'https://photo_url/photo-1.jpg',
      width: 200,
      height: 300
    },
    {
      id: 'photo-2',
      downloadUrl: 'https://photo_url/photo-2.jpg',
      width: 400,
      height: 600
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrid]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photos', mockPhotos);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo grid', () => {
    const containerElement = getElementByLocator<PhotoGrid>(fixture, 'photo-grid');
    expect(containerElement).toBeTruthy();
  });

  it('should render one card per photo', () => {
    const containerElement = getElementByLocator<PhotoGrid>(fixture, 'photo-grid');
    const photoCardElements = fixture.nativeElement.querySelectorAll(resolveLocator('photo-card'));

    expect(containerElement).toBeTruthy();
    expect(photoCardElements.length).toBe(mockPhotos.length);
  });

  it('should pass the expected inputs to each photo card and set first card as priority', () => {
    const photoCardDebugElements = fixture.debugElement.queryAll(By.directive(PhotoCard));
    const [firstCard, secondCard] = photoCardDebugElements.map(
      ({ componentInstance }) => componentInstance as PhotoCard
    );

    expect(photoCardDebugElements.length).toBe(mockPhotos.length);
    expect(firstCard.photo()).toEqual(mockPhotos[0]);
    expect(firstCard.isPriority()).toBeTruthy();
    expect(secondCard.photo()).toEqual(mockPhotos[1]);
    expect(secondCard.isPriority()).toBeFalsy();
  });

  it('should re-emit photoClicked from a child card through clickedPhoto output', () => {
    const emittedValues: string[] = [];
    const subscription = component.clickedPhoto.subscribe(photoId => emittedValues.push(photoId));
    const firstCard = fixture.debugElement.queryAll(By.directive(PhotoCard))[0].componentInstance as PhotoCard;

    firstCard.photoClicked.emit(mockPhotos[0].id);

    expect(emittedValues).toEqual([mockPhotos[0].id]);
    subscription.unsubscribe();
  });
});
