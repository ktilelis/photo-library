import { ComponentFixture } from '@angular/core/testing';

export function resolveLocator(value: string): string {
  return `[data-testid="${value}"]`;
}

export function getElementByLocator<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.nativeElement.querySelector(resolveLocator(selector));
}
