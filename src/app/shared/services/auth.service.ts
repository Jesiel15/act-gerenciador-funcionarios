import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../utils/token.service';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageEnum } from '../enums/storage.enum';
import { StorageService } from '../utils/storage.service';
import { RoutesEnum } from '../enums/routes.enum';
import { NotificationService } from '../utils/notification.service';
import { NotificationEnum } from '../enums/notification.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}
  login(loginRequest: LoginRequest): void {
    this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        catchError((data: HttpErrorResponse) => {
          console.log(data.error);
          this.notificationService.show(data.error, NotificationEnum.ERROR);
          return throwError(() => data);
        })
      )
      .subscribe((response: LoginResponse) => {
        if (response?.login) {
          this.tokenService.setAuthToken(response.token);
          this.storageService.setStorage(
            StorageEnum.USER_PROFILE,
            response.profile
          );
          this.storageService.setStorage(
            StorageEnum.LOGGED,
            response.login.toString()
          );
          this.router.navigate([RoutesEnum.FUNCIONARIOS]);
        } else {
          console.log(response.message);
        }
      });
  }

  logout(): void {
    this.http
      .post<LoginResponse>(`${this.apiUrl}/logout`, {})
      .subscribe((response: { login: boolean }) => {
        if (!response?.login) {
          this.router.navigate(['/login']);
        }
      });
  }
}
