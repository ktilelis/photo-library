import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  #notifications = new Subject<string>();

  notifications = this.#notifications.asObservable();

  dispatchNotification(message: string): void {
    this.#notifications.next(message);
  }
}
