import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import {
  MatButton,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
import { SportService } from '../../services/api/sport.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateSportEventDialogComponent } from './create-sport-event-dialog/create-sport-event-dialog.component';
import { AddSportEntryDialogComponent } from './add-sport-entry-dialog/add-sport-entry-dialog.component';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { SportEntry, SportEvent } from '../../model/sport';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
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
import { MatSort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'app-sport',
  imports: [
    NgIf,
    MatLabel,
    MatFormField,
    MatInput,
    MatFormField,
    MatButton,
    FormsModule,
    DatePipe,
    NgForOf,
    MatFabButton,
    MatIcon,
    MatSuffix,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatIconButton,
    MatSort,
    MatSortHeader,
  ],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.scss',
})
export class SportComponent implements OnInit {
  sportEvents: any[] = [];
  allSportEvents: SportEvent[] = [];
  entry = { participantName: '', score: 0 };
  @ViewChild('input', { static: true }) input!: ElementRef;
  dialog: MatDialog = inject(MatDialog);
  currentFilter = '';

  constructor(private sportService: SportService) {}

  ngOnInit(): void {
    this.loadSportEvents();
    this.initDebounce();
  }

  loadSportEvents(): void {
    const expandedIds = this.allSportEvents
      .filter((event) => event.showEntries)
      .map((event) => event.id);

    this.sportService.getAllSportEvents().subscribe(
      (data) => {
        this.allSportEvents = data.map((event: any) => ({
          ...event,
          showEntries: expandedIds.includes(event.id),
        }));
        this.applyFilter(this.currentFilter);
      },
      (error) => {
        console.error('Error loading sport events', error);
      },
    );
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

  applyFilter(value: string) {
    this.currentFilter = value.trim().toLowerCase();
    this.sportEvents = this.allSportEvents.filter((event) =>
      event.name.toLowerCase().includes(this.currentFilter),
    );
  }

  selectEvent(event: any): void {
    console.log(event);
    const dialogRef = this.dialog.open(AddSportEntryDialogComponent, {
      autoFocus: false,
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadSportEvents();
      }
    });
  }

  toggleEntries(event: any): void {
    event.showEntries = !event.showEntries;
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateSportEventDialogComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadSportEvents();
      }
    });
  }

  deleteEvent(event: SportEvent) {
    console.log(event);
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Are you sure you want to cancel ' + event.name + '?',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.sportService.deleteSportEvent(event.id).subscribe({
            next: () => this.loadSportEvents(),
            error: (err) => console.error('Failed to cancel event', err),
          });
        }
      });
  }

  deleteEntry(id: string, entry: SportEntry) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data:
          'Are you sure you want to remove entry for ' +
          entry.participantName +
          '?',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.sportService.deleteEntryFromSportEvent(id, entry).subscribe({
            next: () => this.loadSportEvents(),
            error: (err) => console.error('Failed to delete entry', err),
          });
        }
      });
  }
}
