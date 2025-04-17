import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { format } from 'date-fns';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly baseUrl = environment.baseUrl + '/reservation';

  http: HttpClient = inject(HttpClient);

  placeReservation(
    resourceId: number,
    resourceName: string,
    startDate: string,
    stopDate: string,
  ): Observable<any> {
    const body = {
      resourceId,
      resourceName,
      startDate: format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss"),
      stopDate: format(new Date(stopDate), "yyyy-MM-dd'T'HH:mm:ss"),
    };
    return this.http.post(`${this.baseUrl}/reserve`, body, {
      responseType: 'text',
    });
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
