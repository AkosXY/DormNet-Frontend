import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoomBase } from '../../model/room';
import { ResidentBase } from '../../model/resident';

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private readonly baseUrl = environment.baseUrl;
  http: HttpClient = inject(HttpClient);

  getAllRooms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rooms`);
  }

  createRoom(roomData: RoomBase): Observable<boolean> {
    return this.http
      .post(`${this.baseUrl}/rooms`, roomData, { observe: 'response' })
      .pipe(map((resp) => resp.status == 201));
  }

  getAllResidents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/resident`);
  }

  getUnassignedResidents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/resident/unassigned`);
  }

  createResident(residentData: ResidentBase): Observable<any> {
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
