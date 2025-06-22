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
import { AccommodationComponent } from '../accommodation.component';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { RoomBase } from '../../../model/room';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { AccommodationService } from '../../../services/api/accommodation.service';

@Component({
  selector: 'app-create-room-dialog',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    NgIf,
    MatInput,
    MatSlider,
    MatSliderModule,
    MatSuffix,
    MatButton,
    MatMiniFabButton,
    MatTooltip,
    MatDialogClose,
    MatSlider,
    FormsModule,
    MatDialogActions,
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrl: './create-room-dialog.component.scss',
})
export class CreateRoomDialogComponent {
  accommodationService: AccommodationService = inject(AccommodationService);

  constructor(protected dialogRef: MatDialogRef<AccommodationComponent>) {}

  submitForm = new FormGroup({
    numberForm: new FormControl('', [Validators.required]),
    capacityForm: new FormControl(4, [Validators.required]),
  });

  capacity = 4;

  submit() {
    this.submitForm.markAllAsTouched();

    if (this.submitForm.valid) {
      const room: RoomBase = {
        number: this.numberForm?.value || '',
        capacity: this.capacity,
        numOfResidents: 0,
      };
      this.accommodationService.createRoom(room).subscribe((success) => {
        if (success) {
          this.dialogRef.close('refresh');
        }
      });
    }
  }

  get numberForm() {
    return this.submitForm.get('numberForm');
  }

  get capacityForm() {
    return this.submitForm.get('capacityForm');
  }
}
