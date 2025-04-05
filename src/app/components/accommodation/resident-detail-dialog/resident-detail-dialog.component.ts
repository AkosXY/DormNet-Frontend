import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AccommodationService } from '../../../services/api/accommodation.service';
import { Resident } from '../../../model/resident';
import { Room } from '../../../model/room';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-resident-detail-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './resident-detail-dialog.component.html',
  styleUrl: './resident-detail-dialog.component.scss',
})
export class ResidentDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ResidentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resident: Resident; room: Room },
    private accommodationService: AccommodationService,
  ) {}

  unassignResident() {
    this.accommodationService
      .unassignResident(this.data.resident.id)
      .subscribe(() => {
        this.dialogRef.close('unassigned');
      });
  }
}
