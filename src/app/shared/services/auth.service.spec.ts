import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { TokenService } from '../utils/token.service';
import { StorageService } from '../utils/storage.service';
import { NotificationService } from '../utils/notification.service';
import { Router } from '@angular/router';
import { ProfileEnum } from '../enums/profile.enum';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { StorageEnum } from '../enums/storage.enum';
import { RoutesEnum } from '../enums/routes.enum';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'setAuthToken',
    ]);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'setStorage',
      'getStorage',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'show',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    storageService = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve fazer login com sucesso e redirecionar o usuário', () => {
    const mockLoginRequest: LoginRequest = { email: 'user', password: 'pass' };
    const mockLoginResponse: LoginResponse = {
      id: '1',
      login: true,
      token: 'token123',
      profile: ProfileEnum.MANAGER,
      message: 'Login realizado com sucesso',
    };

    service.login(mockLoginRequest);

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);

    expect(tokenService.setAuthToken).toHaveBeenCalledWith('token123');

    expect(storageService.setStorage).toHaveBeenCalledWith(
      StorageEnum.USER_PROFILE,
      ProfileEnum.MANAGER
    );

    expect(router.navigate).toHaveBeenCalledWith([RoutesEnum.FUNCIONARIOS]);
  });

  it('deve fazer logout e redirecionar o usuário', () => {
    const mockLogoutResponse = { login: false };

    service.logout();

    const req = httpMock.expectOne(`${service['apiUrl']}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLogoutResponse);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve conceder permissão para um gerente', () => {
    storageService.getStorage.and.returnValue(ProfileEnum.MANAGER);

    let hasPermission: boolean = false;
    service.permission$.subscribe((permission) => (hasPermission = permission));

    service.verificarPermissao();

    expect(hasPermission).toBeTrue();
  });
});
