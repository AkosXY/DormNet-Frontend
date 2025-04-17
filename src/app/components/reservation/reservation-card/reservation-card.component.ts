import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from '../../../model/reservation';
import { DatePipe, NgForOf } from '@angular/common';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-reservation-card',
  imports: [
    NgForOf,
    MatCardTitle,
    MatIconButton,
    MatIconButton,
    MatDivider,
    MatIcon,
    MatIcon,
    MatIconButton,
    DatePipe,
    MatCard,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
  @Output() delete = new EventEmitter<Reservation>();

  getDuration(start: string, stop: string): string {
    const s = new Date(start);
    const e = new Date(stop);
    const diffMs = e.getTime() - s.getTime();
    const diffMins = diffMs / 60000;

    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  onDeleteClick() {
    this.delete.emit(this.reservation);
  }
}
