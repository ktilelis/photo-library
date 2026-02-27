import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationHeader } from '@core/layout/navigation-header/navigation-header';

@Component({
  selector: 'xm-root',
  imports: [RouterOutlet, NavigationHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
