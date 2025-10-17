import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { UserMood } from '../interfaces/mood-user.interface';

@Injectable({
  providedIn: 'root'
})
export class MoodTrackingUserService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/mind/mood-tracking/user-mood`;

  saveMyMood(moodId: string) {
    return this.http.post<ApiResponse<UserMood>>(`${this.baseUrl}/track-mood`, { moodId });
  }

  getMyMoods() {
    return this.http.get<ApiResponse<UserMood[]>>(`${this.baseUrl}/my-moods`);
  }

}
