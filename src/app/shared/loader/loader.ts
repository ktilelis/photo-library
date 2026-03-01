import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'xm-loader',
  imports: [MatProgressSpinner],
  template: ` <section class="centered-container" data-testid="loader">
    <mat-spinner [diameter]="60"></mat-spinner>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loader {}
