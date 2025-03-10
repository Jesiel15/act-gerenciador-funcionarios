import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FuncionarioService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
