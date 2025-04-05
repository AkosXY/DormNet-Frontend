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
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-assign-resident-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatOption,
    MatAutocomplete,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatSelectModule,
    FormsModule,
    NgForOf,
    MatInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
  ],
  templateUrl: './assign-resident-dialog.component.html',
  styleUrl: './assign-resident-dialog.component.scss',
})
export class AssignResidentDialogComponent implements OnInit {
  residents: Resident[] = [];
  selectedResident: Resident | null = null;
  searchTerm: string | Resident = '';

  constructor(
    public dialogRef: MatDialogRef<AssignResidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room: Room },
    private accommodationService: AccommodationService,
  ) {}

  ngOnInit() {
    this.accommodationService
      .getUnassignedResidents()
      .subscribe((residents) => {
        this.residents = residents;
      });
  }

  assignResident() {
    console.log(this.selectedResident);

    if (this.selectedResident) {
      console.log('selected:' + this.selectedResident);
      this.accommodationService
        .assignResidentToRoom(this.selectedResident.id, this.data.room.id)
        .subscribe(() => {
          this.dialogRef.close('assigned');
        });
    }
  }

  filteredResidents(): Resident[] {
    const term =
      typeof this.searchTerm === 'string' ? this.searchTerm.toLowerCase() : '';
    return this.residents.filter((r) => r.name.toLowerCase().includes(term));
  }

  displayResident(resident: Resident): string {
    return resident ? resident.name : '';
  }

  onResidentSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedResident = event.option.value;
  }
}
