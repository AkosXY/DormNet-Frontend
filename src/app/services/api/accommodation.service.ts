import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private readonly baseUrl = environment.baseUrl;
  http: HttpClient = inject(HttpClient);

  getAllRooms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rooms`);
  }

  createRoom(roomData: {
    capacity: number;
    numOfResidents: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/rooms`, roomData);
  }

  getAllResidents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/resident`);
  }

  createResident(residentData: {
    name: string;
    room: { id: number };
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/resident`, residentData);
  }

  assignResidentToRoom(residentId: number, roomId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/resident/${residentId}/assign/${roomId}`,
      {},
    );
  }

  unassignResident(residentId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/resident/${residentId}/unassign`,
      {},
    );
  }
}
