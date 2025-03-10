import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuncionariosComponent } from './funcionarios.component';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';

describe('FuncionariosComponent', () => {
  let component: FuncionariosComponent;
  let fixture: ComponentFixture<FuncionariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDialogModule,
      ],
      declarations: [FuncionariosComponent],
      providers: [
        FuncionarioService,
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            funcionario: {
              nome: 'Carlos Silva',
              documento: '123456789',
              email: 'email@email.com',
            },
            managers: [
              {
                name: 'John Faria',
                profile: ProfileEnum.MANAGER,
                document: '12345',
              },
              {
                name: 'Jane Silva',
                profile: ProfileEnum.MANAGER,
                document: '67890',
              },
            ],
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
