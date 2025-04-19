import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Reservation } from '../../model/reservation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from '../../services/api/reservation.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { DateUtils } from '../../services/utils/DateUtils';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation',
  imports: [
    MatFormField,
    MatLabel,
    MatIcon,
    MatHeaderCell,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    DatePipe,
    MatHeaderCellDef,
    MatPaginator,
    MatRow,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatInput,
    MatSort,
    MatSortHeader,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    FormsModule,
    MatSuffix,
    ReactiveFormsModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent implements OnInit {
  displayedColumns = ['resourceName', 'email', 'date', 'duration'];
  dataSource: MatTableDataSource<Reservation> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: true }) input!: any;

  allReservations: Reservation[] = [];

  dialog: MatDialog = inject(MatDialog);
  reservationService: ReservationService = inject(ReservationService);

  ngOnInit(): void {
    this.initTable();
    this.initDebounce();
  }

  initTable(): void {
    this.reservationService
      .getAllReservations()
      .subscribe((data: Reservation[]) => {
        this.allReservations = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  initDebounce() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        this.applyFilter(value);
      });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  protected readonly DateUtils = DateUtils;

  onDateFilterChange(selectedDate: Date | null) {
    if (!selectedDate) {
      this.dataSource.data = this.allReservations;
      return;
    }

    const selected = new Date(selectedDate.setHours(0, 0, 0, 0)).getTime();

    this.dataSource.data = this.allReservations.filter((res) => {
      const start = new Date(res.startDate).setHours(0, 0, 0, 0);
      return start === selected;
    });
  }
}
