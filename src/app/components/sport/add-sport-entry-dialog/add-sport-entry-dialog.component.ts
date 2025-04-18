import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SportService } from '../../../services/api/sport.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-sport-entry-dialog',
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
  ],
  templateUrl: './add-sport-entry-dialog.component.html',
  styleUrl: './add-sport-entry-dialog.component.scss',
})
export class AddSportEntryDialogComponent {
  sportService: SportService = inject(SportService);

  constructor(
    protected dialogRef: MatDialogRef<AddSportEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedEvent: any,
  ) {}

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    score: new FormControl('', [Validators.required]),
  });

  submit() {
    const { name, score } = this.submitForm.value;
    const eventId = this.selectedEvent.id;

    console.log(eventId);
    console.log({ participantName: name!, score: +score! });

    this.sportService
      .addEntryToSportEvent(eventId, { participantName: name!, score: +score! })
      .subscribe({
        next: () => {
          this.dialogRef.close('refresh');
        },
      });
  }
}
