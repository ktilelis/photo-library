import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Notifications } from './notifications';
import { NotificationsService } from './notifications.service';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;
  let notifications$: Subject<string>;
  let notificationsServiceMock: {
    notifications: Subject<string>;
  };
  let snackBarMock: {
    open: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    notifications$ = new Subject<string>();
    notificationsServiceMock = {
      notifications: notifications$
    };
    snackBarMock = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Notifications],
      providers: [
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snack bar when notification is dispatched', () => {
    notifications$.next('Something failed');

    expect(snackBarMock.open).toHaveBeenCalledTimes(1);
    expect(snackBarMock.open).toHaveBeenCalledWith('Something failed', 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  });
});
