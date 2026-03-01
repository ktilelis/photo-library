import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

import { NotificationsService } from './notifications.service';

@Component({
  selector: 'xm-notifications',
  template: ''
})
export class Notifications {
  #snackBar = inject(MatSnackBar);
  #notificationsService = inject(NotificationsService);

  constructor() {
    this.#notificationsService.notifications
      .pipe(
        tap(notification => this.#displayNotification(notification)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  #displayNotification(message: string): void {
    this.#snackBar.open(message, 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
