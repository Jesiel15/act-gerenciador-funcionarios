import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdicionarEditarFuncionarioComponent } from './modal-adicionar-editar-funcionario.component';

describe('ModalAdicionarEditarFuncionarioComponent', () => {
  let component: ModalAdicionarEditarFuncionarioComponent;
  let fixture: ComponentFixture<ModalAdicionarEditarFuncionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAdicionarEditarFuncionarioComponent]
    });
    fixture = TestBed.createComponent(ModalAdicionarEditarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
