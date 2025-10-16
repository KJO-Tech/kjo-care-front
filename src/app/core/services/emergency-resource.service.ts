import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EmergencyResourceResponse, EmergencyResourceStats } from '../interfaces/emergency-resource-http.interface';
import { ApiResponse } from '../../shared/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class EmergencyResourceService {
  private baseUrl: string = environment.apiUrl + '/api/mind/emergency/resources';

  private http = inject(HttpClient);

  selectedResource = signal<EmergencyResourceResponse>({
    id: '',
    user: {
      id: '',
      username: '',
      firstName: '',
      lastName: ''
    },
    name: '',
    description: '',
    resourceUrl: '',
    contacts: [],
    links: [],
    status: '',
    accessCount: 0,
    createdDate: '',
    modifiedDate: ''
  });

  getAll(): Observable<ApiResponse<EmergencyResourceResponse[]>> {
    return this.http.get<ApiResponse<EmergencyResourceResponse[]>>(`${this.baseUrl}`);
  }

  getStats(): Observable<ApiResponse<EmergencyResourceStats>> {
    return this.http.get<ApiResponse<EmergencyResourceStats>>(`${this.baseUrl}/stats`);
  }

  getById(id: string): Observable<ApiResponse<EmergencyResourceResponse>> {
    return this.http.get<ApiResponse<EmergencyResourceResponse>>(`${this.baseUrl}/${id}`);
  }

  create(request: FormData): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}`, request);
  }

  update(request: FormData, id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
