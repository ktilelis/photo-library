import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Photo } from '@core/model';

@Component({
  selector: 'xm-photo-card',
  imports: [NgOptimizedImage],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoCard {
  photo = input.required<Photo>();
  isPriority = input<boolean>(false);
  photoClicked = output<string>();
}
