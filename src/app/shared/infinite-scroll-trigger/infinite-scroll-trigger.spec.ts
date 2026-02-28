import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InfiniteScrollTrigger } from './infinite-scroll-trigger';

@Component({
  selector: 'xm-test-host',
  template: `<div xmInfiniteScrollTrigger (triggerScroll)="scroll()"></div>`,
  imports: [InfiniteScrollTrigger]
})
class TestHostComponent {
  scroll = vi.fn();
}

describe('InfiniteScrollTrigger', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directiveEl: DebugElement;

  const observeFn = vi.fn();
  const disconnectFn = vi.fn();
  let observerCallback: IntersectionObserverCallback;

  const IntersectionObserverMock = vi.fn(
    class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      disconnect = disconnectFn;
      observe = observeFn;
      takeRecords = vi.fn();
      unobserve = vi.fn();
    }
  );

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(InfiniteScrollTrigger));

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(directiveEl).toBeDefined();
  });

  it('should observe on after view init', () => {
    expect(IntersectionObserverMock).toHaveBeenCalledTimes(1);
    expect(observeFn).toHaveBeenCalledTimes(1);
  });

  it('should emit triggerScroll when the element intersects', () => {
    observerCallback(
      [
        {
          isIntersecting: true
        } as IntersectionObserverEntry
      ],
      {} as IntersectionObserver
    );

    expect(component.scroll).toHaveBeenCalledTimes(1);
  });

  it('should not emit triggerScroll when the element does not intersect', () => {
    observerCallback(
      [
        {
          isIntersecting: false
        } as IntersectionObserverEntry
      ],
      {} as IntersectionObserver
    );

    expect(component.scroll).not.toHaveBeenCalled();
  });

  it('should disconnect the observer on destruction', () => {
    fixture.destroy();
    expect(disconnectFn).toHaveBeenCalled();
  });
});
