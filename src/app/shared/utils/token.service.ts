import { Injectable } from '@angular/core';
import { StorageEnum } from '../enums/storage.enum';
import { StorageService } from './storage.service';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';
import { NotificationEnum } from '../enums/notification.enum';
import { ResponseModel } from '../models/reponse.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService implements HttpInterceptor {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  setAuthToken(token: string): void {
    this.storageService.setStorage(StorageEnum.AUTH_TOKEN_ACT, token);
  }

  getAuthToken(): string {
    return this.storageService.getStorage(StorageEnum.AUTH_TOKEN_ACT);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.show();
    return next.handle(request).pipe(
      tap((successesponse: HttpEvent<ResponseModel<any>>) => {
        if (successesponse instanceof HttpResponse) {
          if (request.method === 'GET') {
            return;
          }
          const successMsg = successesponse?.body as ResponseModel<any>;
          this.notificationService.show(successMsg, NotificationEnum.SUCCESS);
        }
      }),
      catchError((errorResponse) => {
        if (
          errorResponse instanceof HttpErrorResponse &&
          (errorResponse.status === 401 || errorResponse.status === 403)
        ) {
          this.router.navigateByUrl('login');
        }
        const errorMsg = errorResponse?.error;
        this.notificationService.show(errorMsg, NotificationEnum.ERROR);
        return throwError(errorResponse);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
