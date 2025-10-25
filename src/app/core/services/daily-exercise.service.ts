import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { DailyExerciseRequest, DailyExerciseResponse } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class DailyExerciseService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.apiUrl + '/api/mind/daily-activity/exercises';

  getExercises() {
    return this.http.get<ApiResponse<DailyExerciseResponse[]>>(`${this.baseUrl}/difficulty/PRINCIPIANTE`);
  }

  createExercise(exercise: DailyExerciseRequest) {
    return this.http.post<ApiResponse<DailyExerciseResponse>>(`${this.baseUrl}`, exercise);
  }

  updateExercise(id: string, exercise: DailyExerciseRequest) {
    return this.http.put<ApiResponse<DailyExerciseResponse>>(`${this.baseUrl}/${id}`, exercise);
  }

  deleteExercise(id: string) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
