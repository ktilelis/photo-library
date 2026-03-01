import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a notification upon error', () => {
    let message = '';
    service.notifications.subscribe(notification => {
      message = notification;
    });

    service.dispatchNotification('This is an error message');
    expect(message).toBe('This is an error message');
  });
});
