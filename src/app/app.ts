import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationHeader } from '@core/layout/navigation-header/navigation-header';
import { Notifications } from '@core/notifications/notifications';

@Component({
  selector: 'xm-root',
  imports: [RouterOutlet, NavigationHeader, Notifications],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
