import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../models/user-profile';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../interfaces/user-http.interface';
import { ApiResponse } from '../../shared/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/api/mind/auth/users`;
  private http = inject(HttpClient);

  private _selectedUser = signal<UserResponse | null>(null);

  readonly selectedUser = this._selectedUser.asReadonly();

  setSelectedUser(user: UserResponse | null): void {
    this._selectedUser.set(user);
  }

  // selectUserResponse(user: UserResponse) {
  //   const user2 = user as UserResponse;
  //   this._selectedUser.set({
  //     id: user2.id,
  //     username: user2.username,
  //     email: user2.email,
  //     firstName: user2.firstName,
  //     lastName: user2.lastName,
  //     password: '',
  //     roles: user2.roles
  //   });
  // }

  getAll(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/listAll`);
  }

  create(request: UserRequest) {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/register`, request);
  }

  update(request: UserRequest) {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/update/${request.id}`, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${id}`);
  }
}
