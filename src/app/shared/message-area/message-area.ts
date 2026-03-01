import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'xm-message-area',
  template: `
    <section class="centered-container" data-testid="message-area">
      <p data-testid="message">{{ message() }}</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageArea {
  message = input.required<string>();
}
