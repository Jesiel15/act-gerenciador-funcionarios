import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';
import {
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { NotificationEnum } from '../enums/notification.enum';
import { StorageEnum } from '../enums/storage.enum';
import { of, throwError } from 'rxjs';
import { ResponseModel } from '../models/reponse.model';

describe('TokenService', () => {
  let service: TokenService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenService,
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', [
            'setStorage',
            'getStorage',
          ]),
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['show']),
        },
        {
          provide: LoadingService,
          useValue: jasmine.createSpyObj('LoadingService', ['show', 'hide']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigateByUrl']),
        },
      ],
    });

    service = TestBed.inject(TokenService);
    storageServiceSpy = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve definir o token de autenticação', () => {
    service.setAuthToken('abc123');
    expect(storageServiceSpy.setStorage).toHaveBeenCalledWith(
      StorageEnum.AUTH_TOKEN_ACT,
      'abc123'
    );
  });

  it('deve obter o token de autenticação', () => {
    storageServiceSpy.getStorage.and.returnValue('token123');
    const token = service.getAuthToken();
    expect(token).toBe('token123');
    expect(storageServiceSpy.getStorage).toHaveBeenCalledWith(
      StorageEnum.AUTH_TOKEN_ACT
    );
  });

});
