import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { Room } from '../../model/room';
import { Resident } from '../../model/resident';
import { AccommodationService } from '../../services/api/accommodation.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatButton, MatFabButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssignResidentDialogComponent } from './assign-resident-dialog/assign-resident-dialog.component';
import { ResidentDetailDialogComponent } from './resident-detail-dialog/resident-detail-dialog.component';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { MatPaginator } from '@angular/material/paginator';
import { CreateRoomDialogComponent } from './create-room-dialog/create-room-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { HasRoleDirective } from '../../directives/has-role.directive';

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
    MatCardTitle,
    MatFormField,
    MatLabel,
    MatSlideToggle,
    FormsModule,
    MatInput,
    MatCard,
    MatCardHeader,
    MatPaginator,
    BaseChartDirective,
    MatIcon,
    MatFabButton,
    MatSuffix,
    HasRoleDirective,
  ],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AccommodationComponent implements OnInit {
  rooms$: Observable<Room[]> | undefined;
  loadedRooms: Room[] = [];
  filteredRoomsList: Room[] = [];
  paginatedRooms: Room[] = [];

  roomChartData: any;
  roomLabels: string[] | undefined;
  resident$: Observable<Resident[]> | undefined;

  searchRoomNumber: string = '';
  searchResidentName: string = '';
  filterAvailableCapacity: boolean = false;

  private searchRoomNumberSubject: Subject<string> = new Subject();
  private searchResidentNameSubject: Subject<string> = new Subject();
  private searchDebounceTime: number = 500;

  pageSize: number = 5;
  pageIndex: number = 0;

  dialog: MatDialog = inject(MatDialog);
  accommodationService: AccommodationService = inject(AccommodationService);

  ngOnInit() {
    this.loadRooms();
    this.resident$ = this.accommodationService.getAllResidents().pipe(
      tap((data) => {
        console.log('Residents data:', data);
      }),
    );
    Chart.register(...registerables);
    this.initDebounceTimer();
  }

  loadRooms() {
    this.rooms$ = this.accommodationService.getAllRooms().pipe(
      tap((data) => {
        this.loadedRooms = data;
        this.filteredRoomsList = this.filteredRooms(this.loadedRooms);
        this.updatePaginatedRooms();
        this.updateChartData(this.paginatedRooms);
      }),
    );
  }

  getPaginatedRooms(rooms: Room[]): Room[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return rooms.slice(start, end);
  }

  updatePaginatedRooms() {
    this.paginatedRooms = this.getPaginatedRooms(this.filteredRoomsList);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedRooms();
    this.updateChartData(this.paginatedRooms);
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

  openAssignResidentDialog(room: Room) {
    const dialogRef = this.dialog.open(AssignResidentDialogComponent, {
      data: { room },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'assigned') {
        this.loadRooms();
      }
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

  updateChartData(rooms: Room[]) {
    this.roomLabels = rooms.map((room) => `Room ${room.number}`);
    this.roomChartData = {
      labels: this.roomLabels,
      datasets: [
        {
          label: 'Occupancy',
          data: rooms.map((room) => room.numOfResidents),
          backgroundColor: rooms.map(
            (room) =>
              room.numOfResidents < room.capacity
                ? 'rgba(76, 175, 80, 0.6)' // Green for available rooms
                : 'rgba(244, 67, 54, 0.6)', // Red for full rooms
          ),
        },
      ],
    };
  }

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {},
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Rooms',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Residents',
        },
        min: 0,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  initDebounceTimer() {
    this.searchRoomNumberSubject
      .pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged())
      .subscribe(() => {
        this.onSearchChange();
      });

    this.searchResidentNameSubject
      .pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged())
      .subscribe(() => {
        this.onSearchChange();
      });
  }

  onSearchChange() {
    this.filteredRoomsList = this.filteredRooms(this.loadedRooms);
    this.updatePaginatedRooms();
    this.updateChartData(this.paginatedRooms);
  }

  onSearchRoomNumberChange() {
    this.searchRoomNumberSubject.next(this.searchRoomNumber);
  }

  onSearchResidentNameChange() {
    this.searchResidentNameSubject.next(this.searchResidentName);
  }

  onRoomCreate() {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadRooms();
      }
    });
  }
}
