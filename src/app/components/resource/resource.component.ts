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
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {
  MatButton,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
import { NgClass } from '@angular/common';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { ResourceService } from '../../services/api/resource.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { CreateResourceDialogComponent } from './create-resource-dialog/create-resource-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservationDialogComponent } from './reservation-dialog/reservation-dialog.component';

import { Resource } from '../../model/resource';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import Keycloak from 'keycloak-js';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-resource',
  imports: [
    MatIcon,
    MatTable,
    FormsModule,
    NgClass,
    MatCellDef,
    MatCell,
    MatHeaderCell,
    MatSortModule,
    MatHeaderCellDef,
    MatColumnDef,
    MatSlideToggle,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatIconButton,
    MatNativeDateModule,
    MatButton,
    MatFabButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    HasRoleDirective,
  ],
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
  providers: [],
})
export class ResourceComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: true }) input!: any;
  dialog: MatDialog = inject(MatDialog);

  resourceService: ResourceService = inject(ResourceService);
  keycloak: Keycloak = inject(Keycloak);

  ngOnInit(): void {
    this.initTable();
    this.initDebounce();
    this.initDisplayedColumns();
  }

  initTable() {
    this.resourceService.getResources().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item: any, property: string) => {
        if (property === 'enabled') {
          return item.available;
        }
        return item[property];
      };
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

  applyFilter(value: any) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateResourceDialogComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.initTable();
      }
    });
  }

  openReservationDialog(element: Resource) {
    console.log(element);
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange, element: any) {
    if (event.checked) {
      this.resourceService.makeAvailable(element.id).subscribe({
        next: () => {
          element.available = true;
        },
        error: () => {
          event.source.checked = false;
        },
      });
    } else {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: `Are you sure you want to make ${element.name || 'this resource'} unavailable? This will delete all related reservations.`,
        })
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed) {
            this.resourceService.makeUnavailable(element.id).subscribe({
              next: () => {
                element.available = false;
              },
              error: () => {
                event.source.checked = true;
              },
            });
          } else {
            event.source.checked = true;
          }
        });
    }
  }

  onDelete(element: Resource) {
    if (element.available) {
      // Optionally show a snack bar or warning dialog
      this.dialog.open(ConfirmDialogComponent, {
        data: `Resource "${element.name}" must be disabled before deletion.`,
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: `Are you sure you want to delete "${element.name}"? This action cannot be undone.`,
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.resourceService.deleteResource(element.id).subscribe({
          next: (result) => {
            if (result) {
              this.initTable();
            } else {
              this.dialog.open(ConfirmDialogComponent, {
                data: `Could not delete "${element.name}". Disable resource first`,
              });
            }
          },
          error: () => {
            this.dialog.open(ConfirmDialogComponent, {
              data: `Error occurred while deleting "${element.name}".`,
            });
          }
        });
      }
    });
  }

  private initDisplayedColumns() {
    this.displayedColumns = ['name', 'available'];

    if (this.keycloak.hasRealmRole('admin')) {
      this.displayedColumns.push('enabled');
    }
  }
}
