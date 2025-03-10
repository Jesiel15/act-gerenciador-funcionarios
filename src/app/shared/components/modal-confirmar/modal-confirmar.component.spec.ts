import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarComponent } from './modal-confirmar.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalConfirmarComponent', () => {
  let component: ModalConfirmarComponent;
  let fixture: ComponentFixture<ModalConfirmarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmarComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ModalConfirmarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
