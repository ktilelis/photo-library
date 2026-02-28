import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getElementByLocator } from '@testing/test-locator-helper';
import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  const mockPhoto = {
    id: 'photo-1',
    downloadUrl: 'https://photo_url/photo.jpg',
    width: 200,
    height: 300
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo container, button and image', () => {
    const containerElement = getElementByLocator<PhotoCard>(fixture, 'photo-container');
    const imageElement = getElementByLocator<PhotoCard>(fixture, 'photo');
    const buttonElement = getElementByLocator<PhotoCard>(fixture, 'photo-button');

    expect(containerElement).toBeTruthy();
    expect(buttonElement).toBeTruthy();
    expect(imageElement).toBeTruthy();
  });

  it('should correctly bind image attributes', () => {
    const imageElement = getElementByLocator<PhotoCard>(fixture, 'photo');

    expect(imageElement?.getAttribute('alt')).toBe('Image is randomly generated');
    expect(imageElement?.getAttribute('width')).toBe(`${mockPhoto.width}`);
    expect(imageElement?.getAttribute('height')).toBe(`${mockPhoto.height}`);
  });

  it('should correctly set the priority attribute', async () => {
    fixture.componentRef.setInput('photo', { ...mockPhoto, isPriority: true });
    fixture.detectChanges();
    await fixture.whenStable();

    const imageElement = getElementByLocator<PhotoCard>(fixture, 'photo');

    expect(imageElement?.getAttribute('width')).toBeTruthy();
  });

  it('should emit photo id when the button is clicked', () => {
    let emittedValue = '';
    const buttonElement: HTMLButtonElement = getElementByLocator<PhotoCard>(fixture, 'photo-button');
    const subscription = component.photoClicked.subscribe(photoId => {
      emittedValue = photoId;
    });

    buttonElement.click();

    expect(emittedValue).toEqual(mockPhoto.id);
    subscription.unsubscribe();
  });

  it('should render the expected accessibility label on the button', () => {
    const buttonElement: HTMLButtonElement = getElementByLocator<PhotoCard>(fixture, 'photo-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('View image a random image');
  });
});
