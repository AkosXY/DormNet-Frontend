import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { NavigationService } from '../../services/state/navigation.service';
import { ResponsiveService } from '../../services/display/responsive.service';
import { FeatureCardComponent } from '../shared/feature-card/feature-card.component';
import { ReservationService } from '../../services/api/reservation.service';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { findTailwindConfigurationFile } from '@angular-devkit/build-angular/src/utils/tailwind';
import { Reservation } from '../../model/reservation';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
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
  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('300ms ease-in', style({ opacity: 1 })),
  //     ]),
  //   ]),
  //
  //   trigger('slideIn', [
  //     transition(':enter', [
  //       style({ transform: 'translateY(200px)', opacity: 0 }),
  //       animate(
  //         '300ms ease-out',
  //         style({ transform: 'translateY(0)', opacity: 1 }),
  //       ),
  //     ]),
  //   ]),
  // ],
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
      .getMyReservations()
      .subscribe((reservations) => (this.reservations = reservations));
  }

  columnSelector: Signal<string> = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'repeat(4, 1fr)';
    } else if (this.responsiveService.mediumWidth()) {
      return 'repeat(2, 1fr)';
    } else return 'repeat(1, 1fr)';
  });

  // getDuration(start: string, stop: string): string {
  //   const s = new Date(start);
  //   const e = new Date(stop);
  //   const diffMs = e.getTime() - s.getTime();
  //   const diffMins = diffMs / 60000;
  //
  //   if (diffMins < 60) return `${diffMins} min`;
  //   const hours = Math.floor(diffMins / 60);
  //   const mins = diffMins % 60;
  //   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  // }

  // onDelete(reservation: Reservation) {
  //   console.log(reservation);
  //   this.dialog
  //     .open(ConfirmDialogComponent, {
  //       data: 'Are you sure you want to cancel this reservation?',
  //     })
  //     .afterClosed()
  //     .subscribe((confirmed) => {
  //       if (confirmed) {
  //         this.reservationService.dropReservation(reservation.id).subscribe({
  //           next: () => this.getReservations(),
  //           error: (err) => console.error('Failed to cancel reservation', err),
  //         });
  //       }
  //     });
  // }

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
