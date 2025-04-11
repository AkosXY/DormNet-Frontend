import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { ResidentBase } from '../../../model/resident';
import { AccommodationComponent } from '../../accommodation/accommodation.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
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
    MatIconButton,
    MatButton,
    MatMiniFabButton,
    MatTooltip,
    MatDialogClose,
    MatDialogActions,
    MatSuffix,
  ],
  templateUrl: './create-resident-dialog.component.html',
  styleUrl: './create-resident-dialog.component.scss',
})
export class CreateResidentDialogComponent {
  accommodationService: AccommodationService = inject(AccommodationService);

  constructor(protected dialogRef: MatDialogRef<AccommodationComponent>) {}

  submitForm = new FormGroup({
    nameForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    usernameForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    phoneForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
  });

  submit() {
    if (this.submitForm.valid) {
      const user: ResidentBase = {
        name: this.nameForm?.value || '',
        username: this.usernameForm?.value || '',
        phone: this.phoneForm?.value || '',
        email: this.emailForm?.value || '',
      };
      this.accommodationService
        .createResident(user)
        .subscribe((success: boolean) => {
          if (success) {
            this.dialogRef.close('refresh');
          }
        });
    }
  }

  get nameForm() {
    return this.submitForm.get('nameForm');
  }

  get usernameForm() {
    return this.submitForm.get('usernameForm');
  }

  get phoneForm() {
    return this.submitForm.get('phoneForm');
  }

  get emailForm() {
    return this.submitForm.get('emailForm');
  }
}
