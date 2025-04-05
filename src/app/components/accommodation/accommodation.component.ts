import { Component, inject, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Room } from '../../model/room';
import { Resident } from '../../model/resident';
import { AccommodationService } from '../../services/api/accommodation.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssignResidentDialogComponent } from './assign-resident-dialog/assign-resident-dialog.component';
import { ResidentDetailDialogComponent } from './resident-detail-dialog/resident-detail-dialog.component';

@Component({
  selector: 'app-accommodation',
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    MatCardContent,
    MatChip,
    MatCardActions,
    MatButton,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatFormField,
    MatLabel,
    MatSlideToggle,
    FormsModule,
    MatInput,
    MatCard,
    MatCardHeader,
  ],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
})
export class AccommodationComponent implements OnInit {
  rooms$: Observable<Room[]> | undefined;
  resident$: Observable<Resident[]> | undefined;

  searchRoomNumber: string = '';
  searchResidentName: string = '';
  filterAvailableCapacity: boolean = false;

  dialog: MatDialog = inject(MatDialog);

  accommodationService: AccommodationService = inject(AccommodationService);

  ngOnInit() {
    this.loadRooms();

    this.resident$ = this.accommodationService.getAllResidents().pipe(
      tap((data) => {
        console.log(data);
      }),
    );
  }

  loadRooms() {
    this.rooms$ = this.accommodationService.getAllRooms().pipe(
      tap((data) => {
        console.log(data);
      }),
    );
  }

  openAssignResidentDialog(room: Room) {
    const dialogRef = this.dialog.open(AssignResidentDialogComponent, {
      data: { room },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'assigned') {
        this.loadRooms();
      }
    });
  }

  filteredRooms(rooms: Room[]): Room[] {
    return rooms.filter((room) => {
      const matchesRoomNumber = this.searchRoomNumber
        ? room.number
            .toLowerCase()
            .includes(this.searchRoomNumber.toLowerCase())
        : true;

      const matchesResidentName = this.searchResidentName
        ? room.residents.some((resident) =>
            resident.name
              .toLowerCase()
              .includes(this.searchResidentName.toLowerCase()),
          )
        : true;

      const isAvailable = this.filterAvailableCapacity
        ? room.numOfResidents < room.capacity
        : true;

      return matchesRoomNumber && matchesResidentName && isAvailable;
    });
  }

  openResidentDetailDialog(resident: Resident, room: Room) {
    const dialogRef = this.dialog.open(ResidentDetailDialogComponent, {
      data: { resident, room },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'unassigned') {
        this.loadRooms();
      }
    });
  }
}
