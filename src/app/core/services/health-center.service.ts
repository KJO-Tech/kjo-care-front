import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HealthCenterRequest, HealthCenterResponse } from '../interfaces/health-center-http.interface';
import { ApiResponse } from '../../shared/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class HealthCenterService {
  private baseUrl: string = environment.apiUrl + '/api/mind/emergency/centers';

  private http = inject(HttpClient);

  selectedCenter = signal<HealthCenterResponse>({
    name: '',
    address: '',
    phone: '',
    latitude: 0,
    longitude: 0,
    id: '',
    user: {
      firstName: '',
      lastName: '',
      username: ''
    },
    status: '',
    createdDate: '',
    modifiedDate: ''
  });

  getAll(): Observable<ApiResponse<HealthCenterResponse[]>> {
    return this.http.get<ApiResponse<HealthCenterResponse[]>>(`${this.baseUrl}/all`);
  }

  getAllActive(): Observable<ApiResponse<HealthCenterResponse[]>> {
    return this.http.get<ApiResponse<HealthCenterResponse[]>>(`${this.baseUrl}`);
  }

  getNearbyHealthCenters(latitude: number, longitude: number, distanceKm: number = 10): Observable<ApiResponse<HealthCenterResponse[]>> {
    return this.http.get<ApiResponse<HealthCenterResponse[]>>(`${this.baseUrl}/nearby?lat=${latitude}&lon=${longitude}&distanceKm=${distanceKm}`);
  }

  //
  // getStats(): Observable<EmergencyResourceStats> {
  //   return this.http.get<EmergencyResourceStats>(`${this.baseUrl}/stats`);
  // }
  //
  // getById(id: number): Observable<EmergencyResourceResponse> {
  //   return this.http.get<EmergencyResourceResponse>(`${this.baseUrl}/${id}`);
  // }

  create(request: HealthCenterRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}?name=${request.name}&address=${request.address}&phone=${request.phone}&latitude=${request.latitude}&longitude=${request.longitude}`, request);
  }

  update(request: HealthCenterRequest, id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}?name=${request.name}&address=${request.address}&phone=${request.phone}&latitude=${request.latitude}&longitude=${request.longitude}`, request);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async getLocalData() {
    const response = await fetch('/centers.csv');
    return response.blob().then(blob => new File([blob], 'centers.csv'));
  }

  clearSelectedCenter() {
    this.selectedCenter.set({
      name: '',
      address: '',
      phone: '',
      latitude: 0,
      longitude: 0,
      id: '',
      user: {
        firstName: '',
        lastName: '',
        username: ''
      },
      status: '',
      createdDate: '',
      modifiedDate: ''
    });
  }
}
