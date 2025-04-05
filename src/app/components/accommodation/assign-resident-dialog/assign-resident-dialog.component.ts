import { Component, Inject, OnInit } from '@angular/core';
import { Resident } from '../../../model/resident';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AccommodationService } from '../../../services/api/accommodation.service';
import { Room } from '../../../model/room';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-assign-resident-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatOption,
    MatSelect,
    MatDialogActions,
    MatButton,
    MatLabel,
    FormsModule,
    NgForOf,
    MatInput,
  ],
  templateUrl: './assign-resident-dialog.component.html',
  styleUrl: './assign-resident-dialog.component.scss',
})
export class AssignResidentDialogComponent implements OnInit {
  residents: Resident[] = [];
  selectedResident: Resident | null = null;
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignResidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room: Room },
    private accommodationService: AccommodationService,
  ) {}

  ngOnInit() {
    this.accommodationService.getAllResidents().subscribe((residents) => {
      this.residents = residents;
    });
  }

  assignResident() {
    if (this.selectedResident) {
      this.accommodationService
        .assignResidentToRoom(this.selectedResident.id, this.data.room.id)
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  filteredResidents(): Resident[] {
    return this.residents.filter((resident) =>
      resident.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
}
