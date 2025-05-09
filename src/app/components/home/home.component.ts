import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/state/navigation.service';
import { ResponsiveService } from '../../services/display/responsive.service';
import { FeatureCardComponent } from '../shared/feature-card/feature-card.component';
import { ReservationService } from '../../services/api/reservation.service';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { Reservation } from '../../model/reservation';
import { RouterLink } from '@angular/router';
import { ReservationCardComponent } from '../reservation/reservation-card/reservation-card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FeatureCardComponent,
    MatIcon,
    RouterLink,
    ReservationCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  navigationService: NavigationService = inject(NavigationService);
  reservationService: ReservationService = inject(ReservationService);
  responsiveService: ResponsiveService = inject(ResponsiveService);
  dialog: MatDialog = inject(MatDialog);

  routes: any;
  reservations: Reservation[] = [];

  ngOnInit() {
    this.routes = this.navigationService.getFilteredRoutes();
    this.getReservations();
  }

  getReservations() {
    this.reservationService
      .getMyActiveReservations()
      .subscribe((reservations) => (this.reservations = reservations));
  }

  columnSelector: Signal<string> = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'repeat(4, 1fr)';
    } else if (this.responsiveService.mediumWidth()) {
      return 'repeat(2, 1fr)';
    } else return 'repeat(1, 1fr)';
  });

  shouldShowFeatureCards(): boolean {
    return !this.responsiveService.smallWidth();
  }

  onDelete(reservation: Reservation) {
    console.log(reservation);
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Are you sure you want to cancel this reservation?',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.reservationService.dropReservation(reservation.id).subscribe({
            next: () => this.getReservations(),
            error: (err) => console.error('Failed to cancel reservation', err),
          });
        }
      });
  }
}
