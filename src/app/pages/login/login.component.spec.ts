import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/utils/storage.service';
import { LoginRequest } from 'src/app/shared/models/login-request.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'loginError$']);
    authServiceSpy.loginError$ = of('');

    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['clearDataLogin']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com valores vazios', () => {
    expect(component.formLogin.get('email')?.value).toEqual('');
    expect(component.formLogin.get('password')?.value).toEqual('');
  });

  it('deve chamar storageService.clearDataLogin no ngOnInit', () => {
    component.ngOnInit();
    expect(storageService.clearDataLogin).toHaveBeenCalled();
  });

  it('deve definir loginErrorMessage quando authService.loginError$ emite um valor', () => {
    const errorMsg = 'Falha no login';
    authService.loginError$ = of(errorMsg);

    component.ngOnInit();
    expect(component.loginErrorMessage).toEqual(errorMsg);
  });

  it('deve retornar a mensagem de erro correta para o campo de e-mail', () => {
    const emailControl = component.formLogin.get('email');

    emailControl?.setValue('');
    expect(component.getErrorMessage()).toEqual('Você precisa digitar um e-mail');

    emailControl?.setValue('invalid-email');
    expect(component.getErrorMessage()).toEqual('Digite um e-mail válido');
  });

  it('deve chamar authService.login quando o formulário for válido', () => {
    const email = 'test@example.com';
    const password = 'password123';

    component.formLogin.get('email')?.setValue(email);
    component.formLogin.get('password')?.setValue(password);

    component.login();

    expect(authService.login).toHaveBeenCalledWith(new LoginRequest(email, password));
  });

  it('não deve chamar authService.login quando o formulário for inválido', () => {
    component.formLogin.get('email')?.setValue('');
    component.formLogin.get('password')?.setValue('');

    component.login();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('deve tratar erro de login', () => {
    const errorMsg = 'Falha no login';

    authService.loginError$ = of(errorMsg);

    component.formLogin.get('email')?.setValue('test@example.com');
    component.formLogin.get('password')?.setValue('password123');

    component.login();

    expect(component.loginErrorMessage).toEqual('');
  });
});
