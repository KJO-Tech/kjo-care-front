import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { ReactionResponse } from '../interfaces/blog-http.interface';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private baseUrl: string = environment.apiUrl + '/api/mind/blog/reaction';

  private http = inject(HttpClient);

  create(blogId: string) {
    return this.http.post<ApiResponse<ReactionResponse>>(`${this.baseUrl}`, {
      blogId
    });
  }

  delete(blogId: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${blogId}`);
  }
}
