import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { format, formatISO } from 'date-fns';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReservationService } from '../../../services/api/reservation.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {
  MatStep,
  MatStepper,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { NgForOf, NgIf } from '@angular/common';
import { Resource } from '../../../model/resource';
import { ReservationBase } from '../../../model/reservation';

@Component({
  imports: [
    MatDialogContent,
    MatFormField,
    MatDatepicker,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatSuffix,
    MatLabel,
    MatDialogClose,
    MatDialogActions,
    MatButton,
    FormsModule,
    MatDialogTitle,
    NgxMaterialTimepickerModule,
    MatStep,
    MatStepper,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MatStepperPrevious,
  ],
  selector: 'app-reservation-dialog',
  styleUrl: './reservation-dialog.component.scss',
  templateUrl: './reservation-dialog.component.html',
})
export class ReservationDialogComponent {
  isLinear = false;
  availableTimeSlots: string[] = [];
  isAvailable = false;
  selectedStep = 0;
  selectedTimeSlot: string | null = null;
  selectedTimeSlotText: string | null = null;

  reservationForm = new FormGroup({
    reservationDate: new FormControl('', Validators.required),
    duration: new FormControl(90, [
      Validators.required,
      Validators.min(1),
      Validators.max(240),
    ]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Resource,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
  ) {}

  get reservationDate() {
    return this.reservationForm.get('reservationDate');
  }
  get duration() {
    return this.reservationForm.get('duration');
  }

  checkAvailability(stepper: any) {
    const formattedDate = formatISO(this.reservationDate?.value || '', {
      representation: 'date',
    });

    console.log(this.data);
    this.reservationService
      .getAvailableTimeSlots(this.data.id, formattedDate, this.duration?.value!)
      .subscribe({
        next: (slots) => {
          this.availableTimeSlots = slots;
          this.isAvailable = this.availableTimeSlots.length > 0;

          stepper.next();
        },
        error: (err) => {
          console.error('Error loading slots:', err);
        },
      });
  }

  reserve() {
    if (!this.selectedTimeSlot) {
      console.error('No time slot selected');
      return;
    }

    const { id: resourceId, name: resourceName } = this.data;
    const duration = this.duration?.value!;
    const startDate = this.formatDateForApi(
      this.reservationDate?.value,
      this.selectedTimeSlot,
    );
    const stopDate = this.calculateStopDate(startDate, duration);

    const newReservation: ReservationBase = {
      resourceId,
      resourceName,
      startDate: format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss"),
      stopDate: format(new Date(stopDate), "yyyy-MM-dd'T'HH:mm:ss"),
    };

    console.log(newReservation);
    this.reservationService.placeReservation(newReservation).subscribe({
      next: (response) => {
        console.log('Reservation:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error placing reservation:', error);
      },
    });
  }

  private formatDateForApi(date: any, time: string): string {
    const formattedDate = new Date(date);
    const timeParts = time.split(':');
    formattedDate.setHours(
      Number(timeParts[0]),
      Number(timeParts[1]),
      Number(timeParts[2]),
      0,
    );

    return formattedDate.toISOString(); //ISO format (YYYY-MM-DDTHH:mm:ss)
  }

  private calculateStopDate(startDate: string, duration: number): string {
    const start = new Date(startDate);
    const stop = new Date(start.getTime() + duration * 60000);

    return stop.toISOString(); //ISO format (YYYY-MM-DDTHH:mm:ss)
  }

  onTimeSlotSelect(slot: string) {
    this.selectedTimeSlot = slot;
    this.selectedTimeSlotText = this.formatTimeSlotText(
      slot,
      this.duration?.value!,
    );
  }

  private formatTimeSlotText(time: string, duration: number): string {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes, seconds || 0, 0);

    const end = new Date(start.getTime() + duration * 60000);

    const format = (date: Date) =>
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0');

    return `Place reservation between ${format(start)} and ${format(end)}`;
  }

  onPreviousStep() {
    this.selectedTimeSlot = null;
    this.selectedTimeSlotText = null;
  }
}
