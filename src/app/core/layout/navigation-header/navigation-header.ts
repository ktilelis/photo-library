import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'xm-navigation-header',
  imports: [MatButtonModule, RouterLinkActive, RouterLink],
  templateUrl: './navigation-header.html',
  styleUrl: './navigation-header.scss'
})
export class NavigationHeader {}
