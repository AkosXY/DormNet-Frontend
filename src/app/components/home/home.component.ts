import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../../services/accommodation.service';
import { catchError, Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  rooms$: Observable<any[]> | undefined;

  constructor(private accommodationService: AccommodationService) {}

  ngOnInit() {
    this.rooms$ = this.accommodationService.getAllRooms().pipe(
      tap((data) => {
        console.log(data);
      }),
      catchError((error) => {
        console.error(error);
        return [];
      }),
    );
  }
}
