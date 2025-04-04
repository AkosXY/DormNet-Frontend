import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/state/navigation.service';
import { MatIcon } from '@angular/material/icon';
import { ResponsiveService } from '../../services/display/responsive.service';
import { FeatureCardComponent } from '../shared/feature-card/feature-card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    FeatureCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  navigationService: NavigationService = inject(NavigationService);
  responsiveService: ResponsiveService = inject(ResponsiveService);

  routes: any;
  reservations: any = [
    {
      reservationNumber: 'e015ad7d-8eab-46a2-8707-a031afda427d',
      resourceId: 1,
      email: 'admin@test.com',
    },
    {
      reservationNumber: 'e015ad7d-8eab-46a2-8707-a031afda427d',
      resourceId: 2,
      email: 'admin@test.com',
    },
  ];

  ngOnInit() {
    this.routes = this.navigationService.getFilteredRoutes();
  }

  columnSelector: Signal<string> = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'repeat(4, 1fr)';
    } else if (this.responsiveService.mediumWidth()) {
      return 'repeat(2, 1fr)';
    } else return 'repeat(1, 1fr)';
  });
}
