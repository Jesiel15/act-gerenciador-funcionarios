import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { HttpUtilsService } from '../utils/http-utils.service';
import { ProfileEnum } from '../enums/profile.enum';
import { ResponseModel } from '../models/reponse.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  getUsers(profile?: ProfileEnum): Observable<ResponseModel<User[]>> {
    const headers = this.httpUtilsService.getHeaders();
    const urlUserList = profile
      ? `${this.apiUrl}-list/${profile}`
      : `${this.apiUrl}-list/`;
    return this.http.get<ResponseModel<User[]>>(urlUserList, { headers });
  }

  getUserById(id: string): Observable<ResponseModel<User> | undefined> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.get<ResponseModel<User>>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }

  createUser(user: User): Observable<ResponseModel<User>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.post<ResponseModel<User>>(this.apiUrl, user, { headers });
  }

  updateUser(user: User): Observable<ResponseModel<User>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.put<ResponseModel<User>>(
      `${this.apiUrl}/${user.id}`,
      user,
      { headers }
    );
  }

  changePassword(
    id: string,
    new_password: string
  ): Observable<ResponseModel<User>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.put<ResponseModel<User>>(
      `${this.apiUrl}/change-password/${id}`,
      { new_password },
      { headers }
    );
  }

  deleteUser(id: string): Observable<ResponseModel<User>> {
    const headers = this.httpUtilsService.getHeaders();
    return this.http.delete<ResponseModel<User>>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }
}
