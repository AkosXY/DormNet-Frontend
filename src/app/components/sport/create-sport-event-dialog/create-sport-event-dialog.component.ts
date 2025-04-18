import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { SportService } from '../../../services/api/sport.service';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { SportComponent } from '../sport.component';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-sport-event-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatDialogClose,
    ReactiveFormsModule,
    MatInput,
    MatSuffix,
    NgIf,
    MatError,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
  ],
  templateUrl: './create-sport-event-dialog.component.html',
  styleUrl: './create-sport-event-dialog.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD.MM.YYYY', 'YYYY.MM.DD', 'DD/MM/YYYY'],
        },
        display: {
          dateInput: 'input',
          monthYearLabel: 'YYYY. MMM',
          dateA11yLabel: 'YYYY. MMMM D.',
          monthYearA11yLabel: 'YYYY. MMMM',
        },
      },
    },
  ],
})
export class CreateSportEventDialogComponent {
  sportService: SportService = inject(SportService);
  datePipe: DatePipe = inject(DatePipe);

  constructor(protected dialogRef: MatDialogRef<SportComponent>) {}

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required]),
  });

  submit() {
    if (this.submitForm.valid) {
      const { name, date } = this.submitForm.value;

      const request = {
        name: name!,
        date: this.datePipe.transform(date, 'yyyy-MM-dd')!,
      };

      this.sportService.createSportEvent(request).subscribe((success) => {
        if (success) {
          this.dialogRef.close('refresh');
        }
      });
    }
  }
}
