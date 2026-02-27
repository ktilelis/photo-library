import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { resolveLocator } from '@testing/test-locator-helper';
import { NavigationHeader } from './navigation-header';

@Component({
  template: ''
})
class DummyRouteComponent {}

describe('NavigationHeader', () => {
  let component: NavigationHeader;
  let fixture: ComponentFixture<NavigationHeader>;
  let router: Router;

  const getNavigationLinks = (fixture: ComponentFixture<NavigationHeader>) => {
    const el = fixture.nativeElement as HTMLElement;
    return el.querySelectorAll(`${resolveLocator('navigation-links')} > a`);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationHeader],
      providers: [
        provideRouter([
          { path: '', component: DummyRouteComponent },
          { path: 'favourites', component: DummyRouteComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationHeader);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the navigation links', () => {
    const links = getNavigationLinks(fixture);
    expect(links?.length).toBe(2);
    expect(links[0].textContent.trim()).toBe('Photos');
    expect(links[1].textContent.trim()).toBe('Favourites');
    expect(links[0].getAttribute('routerLink')).toBe('/');
    expect(links[1].getAttribute('routerLink')).toBe('/favourites');
  });

  it('should mark Photos as active when navigating to root path', async () => {
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const links = getNavigationLinks(fixture);

    expect(links[0].classList).toContain('active');
    expect(links[1].classList).not.toContain('active');
  });

  it('should mark Favourites as active when navigating to favourites path', async () => {
    await router.navigateByUrl('/favourites');
    fixture.detectChanges();
    await fixture.whenStable();

    const links = getNavigationLinks(fixture);

    expect(links[0].classList).not.toContain('active');
    expect(links[1].classList).toContain('active');
  });
});
