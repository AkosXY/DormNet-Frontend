import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { AccommodationComponent } from '../../accommodation/accommodation.component';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { ResourceService } from '../../../services/api/resource.service';
import { ResourceBase } from '../../../model/resource';

@Component({
  selector: 'app-create-resource-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatMiniFabButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatError,
    NgIf,
    MatInput,
    MatFormField,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggle,
    MatSlideToggleModule,
    MatTooltip,
    MatSuffix,
  ],
  templateUrl: './create-resource-dialog.component.html',
  styleUrl: './create-resource-dialog.component.scss',
})
export class CreateResourceDialogComponent {
  resourceService: ResourceService = inject(ResourceService);

  constructor(protected dialogRef: MatDialogRef<AccommodationComponent>) {}

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    available: new FormControl(false),
  });

  submit() {
    if (this.submitForm.valid) {
      const resource: ResourceBase = {
        name: this.name?.value || '',
        available: this.available?.value || false,
      };
      this.resourceService
        .createResource(resource)
        .subscribe((success: boolean) => {
          if (success) {
            this.dialogRef.close('refresh');
          }
        });
    }
  }

  get name() {
    return this.submitForm.get('name');
  }
  get available() {
    return this.submitForm.get('available');
  }
}
