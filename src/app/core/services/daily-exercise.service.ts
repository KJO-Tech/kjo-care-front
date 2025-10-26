import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { AssignmentResponse, DailyExerciseRequest, DailyExerciseResponse } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class DailyExerciseService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.apiUrl + '/api/mind/daily-activity';

  getExercises() {
    return this.http.get<ApiResponse<DailyExerciseResponse[]>>(`${this.baseUrl}/exercises/difficulty/PRINCIPIANTE`);
  }

  createExercise(exercise: DailyExerciseRequest) {
    return this.http.post<ApiResponse<DailyExerciseResponse>>(`${this.baseUrl}/exercises`, exercise);
  }

  updateExercise(id: string, exercise: DailyExerciseRequest) {
    return this.http.put<ApiResponse<DailyExerciseResponse>>(`${this.baseUrl}/exercises/${id}`, exercise);
  }

  deleteExercise(id: string) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/exercises/${id}`);
  }

  getMyDailyExercises() {
    return this.http.get<ApiResponse<AssignmentResponse[]>>(`${this.baseUrl}/assignments/my-exercises`);
  }

  markAsCompleted(id: string, completed: boolean) {
    return this.http.patch<ApiResponse<AssignmentResponse>>(`${this.baseUrl}/assignments/${id}/complete`, { completed });
  }
}
