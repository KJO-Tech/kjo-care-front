import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { ActivityCategory, ActivityCategoryRequest } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityCategoryService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.apiUrl + '/api/mind/daily-activity/categories';

  getCategories() {
    return this.http.get<ApiResponse<ActivityCategory[]>>(this.baseUrl);
  }

  createCategory(category: ActivityCategoryRequest) {
    return this.http.post<ApiResponse<ActivityCategory>>(this.baseUrl, category);
  }

  updateCategory(category: ActivityCategoryRequest, id: string) {
    return this.http.put<ApiResponse<ActivityCategory>>(this.baseUrl + '/' + id, category);
  }

  deleteCategory(id: string) {
    return this.http.delete<ApiResponse<void>>(this.baseUrl + '/' + id);
  }
}
