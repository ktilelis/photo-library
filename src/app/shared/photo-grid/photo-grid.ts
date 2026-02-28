import { Component, input, output } from '@angular/core';
import { Photo } from '@core/model';
import { PhotoCard } from '../photo-card/photo-card';

@Component({
  selector: 'xm-photo-grid',
  imports: [PhotoCard],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss'
})
export class PhotoGrid {
  photos = input<Photo[]>([]);
  clickedPhoto = output<string>();
}
