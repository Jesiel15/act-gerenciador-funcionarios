import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FuncionarioModel } from '../../models/funcionario.model';
import { ProfileEnum } from '../../enums/profile.enum';
import { ModalAdicionarEditarFuncionarioComponent } from './modal-adicionar-editar-funcionario.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalAdicionarEditarFuncionarioComponent', () => {
  let component: ModalAdicionarEditarFuncionarioComponent;
  let fixture: ComponentFixture<ModalAdicionarEditarFuncionarioComponent>;
  let dialogRef: MatDialogRef<ModalAdicionarEditarFuncionarioComponent>;
  let formBuilder: FormBuilder;

  const mockFuncionario: FuncionarioModel = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '123.456.789-09',
    phone: '1234567890',
    manager_name: 'Manager',
    date_of_birth: new Date('1990-01-01'),
    profile: ProfileEnum.EMPLOYEE,
  };

  const mockManagers = [
    {
      name: 'Manager 1',
      profile: ProfileEnum.MANAGER,
      document: '111.111.111-11',
    },
    {
      name: 'Manager 2',
      profile: ProfileEnum.MANAGER,
      document: '222.222.222-22',
    },
  ];
  let matDialogRefMock: MatDialogRefMock;

  beforeEach(async () => {
    matDialogRefMock = new MatDialogRefMock();
    await TestBed.configureTestingModule({
      declarations: [ModalAdicionarEditarFuncionarioComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatNativeDateModule,
        MatDatepickerModule,
        NgxMaskDirective,
        NgxMaskPipe,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { funcionario: mockFuncionario, managers: mockManagers },
        },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        provideNgxMask(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAdicionarEditarFuncionarioComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com os dados do funcionário', () => {
    expect(component.funcionarioForm).toBeDefined();
    expect(component.funcionarioForm.get('name')?.value).toBe(
      mockFuncionario.name
    );
    expect(component.funcionarioForm.get('email')?.value).toBe(
      mockFuncionario.email
    );
    expect(component.funcionarioForm.get('document')?.value).toBe(
      mockFuncionario.document
    );
    expect(component.funcionarioForm.get('manager_name')?.value).toBe(
      mockFuncionario.manager_name
    );
    expect(component.funcionarioForm.get('date_of_birth')?.value).toBe(
      mockFuncionario.date_of_birth
    );
    expect(component.funcionarioForm.get('profile')?.value).toBe(
      mockFuncionario.profile
    );
  });

  it('deve adicionar um novo controle de telefone', () => {
    const comprimentoInicial = component.phones.length;
    component.addPhone();
    expect(component.phones.length).toBe(comprimentoInicial + 1);
  });

  it('deve remover um controle de telefone', () => {
    component.addPhone();
    const comprimentoInicial = component.phones.length;
    component.removePhone(comprimentoInicial - 1);
    expect(component.phones.length).toBe(comprimentoInicial - 1);
  });

  it('não deve remover o último controle de telefone', () => {
    const comprimentoInicial = component.phones.length;
    component.removePhone(0);
    expect(component.phones.length).toBe(comprimentoInicial);
  });

  it('deve fechar o diálogo sem dados ao cancelar', () => {
    const closeSpy = spyOn(dialogRef, 'close');
    component.cancelar();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('deve validar o CPF ao perder o foco', () => {
    const documentControl = component.funcionarioForm.get('document');
    documentControl?.setValue('123.456.789-09');
    component.validateCPFOnBlur();
    expect(documentControl?.valid).toBeTruthy();
  });

  it('deve atualizar a máscara do documento com base no comprimento da entrada', () => {
    const evento = { target: { value: '12345678909' } };
    component.updateMask(evento);
    expect(component.documentMask).toBe('000.000.000-00');
  });
});

class MatDialogRefMock {
  close(result?: any): void {}
}
