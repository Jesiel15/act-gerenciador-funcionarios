import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAdicionarEditarFuncionarioComponent } from './modal-adicionar-editar-funcionario.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileEnum } from '../../enums/profile.enum';

describe('ModalAdicionarEditarFuncionarioComponent', () => {
  let component: ModalAdicionarEditarFuncionarioComponent;
  let fixture: ComponentFixture<ModalAdicionarEditarFuncionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAdicionarEditarFuncionarioComponent],
      providers: [
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
              email: 'email@email.com'
            },
            managers: [
              { name: 'John Faria', profile: ProfileEnum.MANAGER, document: '12345' },
              { name: 'Jane Silva', profile: ProfileEnum.MANAGER, document: '67890' },
            ],
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ModalAdicionarEditarFuncionarioComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
