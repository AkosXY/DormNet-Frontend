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
import { MatButton, MatFabButton } from '@angular/material/button';
import { SportService } from '../../services/api/sport.service';
import { FormsModule } from '@angular/forms';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateSportEventDialogComponent } from './create-sport-event-dialog/create-sport-event-dialog.component';
import { AddSportEntryDialogComponent } from './add-sport-entry-dialog/add-sport-entry-dialog.component';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { SportEvent } from '../../model/sport';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

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
    MatListItem,
    MatList,
    MatFabButton,
    MatIcon,
    MatSuffix,
    MatExpansionPanel,
    MatExpansionPanelHeader,
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

  constructor(private sportService: SportService) {}

  ngOnInit(): void {
    this.loadSportEvents();
    this.initDebounce();
  }

  loadSportEvents(): void {
    this.sportService.getAllSportEvents().subscribe(
      (data) => {
        this.allSportEvents = data.map((event: any) => ({
          ...event,
          showEntries: false,
        }));
        this.sportEvents = [...this.allSportEvents];
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
    const filterValue = value.trim().toLowerCase();
    this.sportEvents = this.allSportEvents.filter((event) =>
      event.name.toLowerCase().includes(filterValue),
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
}
