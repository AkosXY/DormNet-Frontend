import { Component, inject, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { AccommodationService } from '../../services/api/accommodation.service';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AssignResidentDialogComponent } from '../accommodation/assign-resident-dialog/assign-resident-dialog.component';
import { CreateResidentDialogComponent } from './create-resident-dialog/create-resident-dialog.component';

@Component({
  selector: 'app-resident',
  imports: [
    MatIcon,
    MatTable,
    FormsModule,
    NgClass,
    MatCellDef,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatSortModule,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatIconButton,
    MatLabel,
    MatFormField,
    MatInput,
    MatFabButton,
    MatSuffix,
  ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss',
})
export class ResidentComponent {
  displayedColumns = ['name', 'username', 'contact'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('input', { static: true }) input!: any;

  accommodationService: AccommodationService = inject(AccommodationService);
  dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this.initTable();
    this.initDebounce();
  }

  initTable() {
    this.accommodationService.getAllResidents().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getAdminName() {
    return 'todo name';
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

  applyFilter(value: any) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateResidentDialogComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.initTable();
      }
    });
  }
}
