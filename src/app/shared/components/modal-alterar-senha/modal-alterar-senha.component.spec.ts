import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlterarSenhaComponent } from './modal-alterar-senha.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileEnum } from '../../enums/profile.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalAlterarSenhaComponent', () => {
  let component: ModalAlterarSenhaComponent;
  let fixture: ComponentFixture<ModalAlterarSenhaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAlterarSenhaComponent],
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
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ModalAlterarSenhaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
