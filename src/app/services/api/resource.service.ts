import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceBase } from '../../model/resource';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private readonly baseUrl = 'http://localhost/api/resource';

  http: HttpClient = inject(HttpClient);

  isAvailable(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/available?id=${id}`);
  }

  getAvailableResources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/availableResources`);
  }

  getResources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getResources`);
  }

  makeUnavailable(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/makeUnavailable?id=${id}`, {});
  }

  makeAvailable(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/makeAvailable?id=${id}`, {});
  }

  createResource(resource: ResourceBase): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, resource);
  }
}
