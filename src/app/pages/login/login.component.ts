import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/shared/models/login-request.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/utils/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginErrorMessage: string | null = null;
  loading = false;

  formLogin = new UntypedFormGroup({
    email: new FormControl('functeste@email.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('*Test123', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.storageService.clearDataLogin();

    this.authService.loginError$.subscribe((errorMsg) => {
      this.loginErrorMessage = errorMsg;
      if (errorMsg) {
        this.loading = false;
      }
    });
  }

  getErrorMessage() {
    if (this.formLogin.get('email')?.hasError('required')) {
      return 'Você precisa digitar um e-mail';
    }

    return this.formLogin.get('email')?.hasError('email')
      ? 'Digite um e-mail válido'
      : '';
  }

  login(): void {
    console.log(this.formLogin.get('email')?.value);

    if (this.formLogin.valid) {
      this.loading = true;
      this.loginErrorMessage = null;

      const email: string = this.formLogin.get('email')?.value;
      const password: string = this.formLogin.get('password')?.value;
      const loginData = new LoginRequest(email, password);

      this.authService.login(loginData);
    } else {
      // TODO: MSG Apresentar MSG para tratar o formulário inválido se necessário
    }
  }
}
