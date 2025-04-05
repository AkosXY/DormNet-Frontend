import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly baseUrl = 'http://localhost/api' + 'reservation';

  http: HttpClient = inject(HttpClient);

  placeReservation(
    resourceId: number,
    startDate: string,
    stopDate: string,
  ): Observable<any> {
    const body = { resourceId, startDate, stopDate };
    return this.http.post(`${this.baseUrl}/reserve`, body);
  }

  getAllReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getMyReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations`);
  }

  dropReservation(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/drop?id=${id}`, {});
  }
}
