import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Room } from '../../model/room';
import { Resident } from '../../model/resident';
import { AccommodationService } from '../../services/api/accommodation.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-accommodation',
  imports: [AsyncPipe, NgIf, NgForOf],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
})
export class AccommodationComponent implements OnInit {
  rooms$: Observable<Room[]> | undefined;
  resident$: Observable<Resident[]> | undefined;

  constructor(private accommodationService: AccommodationService) {}

  ngOnInit() {
    this.rooms$ = this.accommodationService.getAllRooms().pipe(
      tap((data) => {
        console.log(data);
      }),
    );

    this.resident$ = this.accommodationService.getAllResidents().pipe(
      tap((data) => {
        console.log(data);
      }),
    );
  }
}
