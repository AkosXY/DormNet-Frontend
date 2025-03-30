import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../../services/accommodation.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Room } from '../../model/room';
import { Resident } from '../../model/resident';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
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
