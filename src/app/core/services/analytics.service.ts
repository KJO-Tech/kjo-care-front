import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MoodAnalyticsResponse, MoodTrendsAnalysis } from '../interfaces/mood-analytics.response';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { DashboardSummary, Summary } from '../interfaces/analytics.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/mind/mood-tracking`;
  private readonly analyticsUrl = `${environment.apiUrl}/api/mind/analytics`;

  getMoodAnalytics(months: number = 3): Observable<ApiResponse<MoodAnalyticsResponse>> {
    return this.http
      .get<ApiResponse<MoodAnalyticsResponse>>(
        `${this.baseUrl}/user-mood/statistics?month=${months}`
      )
      .pipe(
        tap((response) => {
          console.log('Analytics response', response);
        }),
        catchError((error) => {
          console.error('Error al traer las estadisticas', error);
          return throwError(
            () =>
              new Error(
                'Error la obtener las estadisticas de los estados de animo'
              )
          );
        })
      );
  }

  getMoodTrendsAnalysis(month: number = 3): Observable<ApiResponse<MoodTrendsAnalysis>> {
    return this.http.get<ApiResponse<MoodTrendsAnalysis>>(`${this.baseUrl}/user-mood/trends-analysis?months=${month}`
    ).pipe(
      tap((response) => console.log('Mood Trend Anlysis', response)),
      catchError((error) => {
        console.error('Error al traer las estadisticas', error);
        return throwError(() => new Error('Error al obtener las analiticas de los estados de animo'));
      })
    );
  }

  getSummary() {
    return this.http.get<ApiResponse<Summary>>(`${this.analyticsUrl}/summary`);
  }

  getHomeStats() {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.analyticsUrl}/summary-dashboard`);
  }

}
