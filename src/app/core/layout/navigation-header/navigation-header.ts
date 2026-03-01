import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

type Section = 'photos' | 'favorites';

@Component({
  selector: 'xm-navigation-header',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './navigation-header.html',
  styleUrl: './navigation-header.scss'
})
export class NavigationHeader {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #navEnd = toSignal(this.#router.events.pipe(filter(e => e instanceof NavigationEnd)), {
    initialValue: null
  });

  readonly activeSection = computed<Section>(() => {
    this.#navEnd();

    let r = this.#route;
    while (r.firstChild) {
      r = r.firstChild;
    }

    return (r.snapshot.data['activeSection'] as Section) ?? 'photos';
  });
}
