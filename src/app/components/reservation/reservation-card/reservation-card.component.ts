import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from '../../../model/reservation';
import { DatePipe } from '@angular/common';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { DateUtils } from '../../../services/utils/DateUtils';

@Component({
  selector: 'app-reservation-card',
  imports: [
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
  protected readonly DateUtils = DateUtils;
  @Input() reservation!: Reservation;
  @Output() delete = new EventEmitter<Reservation>();

  onDeleteClick() {
    this.delete.emit(this.reservation);
  }
}
