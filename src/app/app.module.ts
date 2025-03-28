import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './pages/login/login.module';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenService } from './shared/utils/token.service';
import { FuncionariosModule } from './pages/funcionarios/funcionarios.module';
import { ModalAdicionarEditarFuncionarioModule } from './shared/components/modal-adicionar-editar-funcionario/modal-adicionar-editar-funcionario.module';
import { ModalAlterarSenhaModule } from './shared/components/modal-alterar-senha/modal-alterar-senha.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalConfirmarModule } from './shared/components/modal-confirmar/modal-confirmar.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,

    // Pages
    LoginModule,
    FuncionariosModule,

    // Components
    ModalAdicionarEditarFuncionarioModule,
    ModalAlterarSenhaModule,
    ModalConfirmarModule,

    // Modules
    MatCardModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true,
    },
    provideNgxMask({
      validation: true,
      dropSpecialCharacters: false,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
