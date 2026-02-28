import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[xmInfiniteScrollTrigger]'
})
export class InfiniteScrollTrigger implements AfterViewInit, OnDestroy {
  rootMargin = input<number>(200);
  triggerScroll = output<void>();

  #el = inject(ElementRef);
  #observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!this.#el.nativeElement) {
      return;
    }

    const options: IntersectionObserverInit = {
      rootMargin: `${this.rootMargin()}px`
    };
    this.#observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.triggerScroll.emit();
      }
    }, options);

    this.#observer.observe(this.#el.nativeElement);
  }

  ngOnDestroy(): void {
    this.#observer?.disconnect();
  }
}
