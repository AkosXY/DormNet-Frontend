import { Component, Input } from '@angular/core';
import { Route } from '../../../model/route';
import {
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-card',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    RouterLink,
  ],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
})
export class FeatureCardComponent {
  @Input() route?: Route;
}
