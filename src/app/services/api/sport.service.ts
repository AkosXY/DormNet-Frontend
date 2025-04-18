import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SportEntry } from '../../model/sport';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private readonly baseUrl = environment.baseUrl + '/sport';

  http: HttpClient = inject(HttpClient);

  createSportEvent(event: { name: string; date: string }): Observable<any> {
    const body = {
      ...event,
      entries: [],
    };
    return this.http.post(`${this.baseUrl}`, body);
  }

  addEntryToSportEvent(
    sportEventId: string,
    entry: SportEntry,
  ): Observable<any> {
    console.log(sportEventId);
    console.log(entry);
    return this.http.post(`${this.baseUrl}/${sportEventId}/add_entries`, entry);
  }

  getAllSportEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  deleteSportEvent(sportEventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${sportEventId}`);
  }

  deleteEntryFromSportEvent(
    sportEventId: string,
    entry: SportEntry,
  ): Observable<any> {
    return this.http.request(
      'delete',
      `${this.baseUrl}/${sportEventId}/delete_entry`,
      {
        body: entry,
      },
    );
  }
}
