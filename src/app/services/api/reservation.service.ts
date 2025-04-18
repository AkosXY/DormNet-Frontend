import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReservationBase } from '../../model/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly baseUrl = environment.baseUrl + '/reservation';

  http: HttpClient = inject(HttpClient);

  placeReservation(reservation: ReservationBase): Observable<any> {
    return this.http.post(`${this.baseUrl}/reserve`, reservation, {
      responseType: 'text',
    });
  }

  getAllReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getActiveReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/allActive`);
  }

  getMyReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations`);
  }

  getMyActiveReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activeReservations`);
  }

  dropReservation(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/drop?id=${id}`, {});
  }

  getAvailableTimeSlots(
    resourceId: number,
    date: string,
    durationMinutes: number,
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('resourceId', resourceId.toString())
      .set('date', date)
      .set('durationMinutes', durationMinutes.toString());

    return this.http.get<string[]>(`${this.baseUrl}/availability`, { params });
  }
}
