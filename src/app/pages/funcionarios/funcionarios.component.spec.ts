import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionariosComponent } from './funcionarios.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ResponseModel } from 'src/app/shared/models/reponse.model';
import { FuncionarioModel } from 'src/app/shared/models/funcionario.model';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';
import { DatePipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FuncionariosComponent', () => {
  let component: FuncionariosComponent;
  let fixture: ComponentFixture<FuncionariosComponent>;
  let funcionarioServiceSpy: jasmine.SpyObj<FuncionarioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const funcionarioSpy = jasmine.createSpyObj('FuncionarioService', [
    'getFuncionarios',
    'updateFuncionario',
    'createFuncionario',
    'changePassword',
    'deleteFuncionario',
  ]);

  const authSpy = jasmine.createSpyObj(
    'AuthService',
    ['verificarPermissao', 'logout'],
    {
      permission$: of(true),
    }
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        NgxMaskPipe,
        NgxMaskDirective,
        DatePipe,
        BrowserAnimationsModule,
      ],
      declarations: [FuncionariosComponent],
      providers: [
        { provide: FuncionarioService, useValue: funcionarioSpy },
        { provide: AuthService, useValue: authSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FuncionariosComponent);
    component = fixture.componentInstance;

    funcionarioServiceSpy = TestBed.inject(
      FuncionarioService
    ) as jasmine.SpyObj<FuncionarioService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('deve chamar getFuncionarios() e dar subscribe no permission$ no ngOnInit', () => {
    const mockResponse: ResponseModel<FuncionarioModel[]> = {
      message: 'Funcionários carregados com sucesso',
      response: [
        {
          id: '1',
          name: 'Funcionario 1',
          email: 'func@email.com',
          document: '123',
          phone: '999999999',
          date_of_birth: new Date('1990-01-01'),
          profile: ProfileEnum.EMPLOYEE,
          manager_name: 'Manager 1',
        },
        {
          id: '2',
          name: 'Gerente 1',
          email: 'manager@email.com',
          document: '456',
          phone: '888888888',
          date_of_birth: new Date('1985-01-01'),
          profile: ProfileEnum.MANAGER,
          manager_name: '',
        },
      ],
    };

    funcionarioServiceSpy.getFuncionarios.and.returnValue(of(mockResponse));
    component.ngOnInit();

    expect(component.isAllowed).toBeTrue();
  });

  it('deve tratar erro ao carregar funcionários no ngOnInit', () => {
    const erroMock = new Error('Erro simulado');
    spyOn(component as any, 'mostrarAlerta');
    funcionarioServiceSpy.getFuncionarios.and.returnValue(
      throwError(() => erroMock)
    );
    component.ngOnInit();

    expect(component['mostrarAlerta']).toHaveBeenCalledWith(
      'Erro ao carregar funcionários.'
    );
    expect(component.loading).toBeFalse();
  });

  it('deve tentar salvarFuncionario sem alguns campos e retornar alerta', () => {
    const mockFuncionario: FuncionarioModel = {
      id: '1',
      name: 'Funcionario 1',
      email: '',
      document: '',
      phone: '999999999',
      date_of_birth: new Date('1990-01-01'),
      profile: ProfileEnum.EMPLOYEE,
      manager_name: 'Manager 1',
    };

    funcionarioSpy.updateFuncionario.and.returnValue(of(mockFuncionario));
    component.validarFuncionario(mockFuncionario);
    component.salvarFuncionario(mockFuncionario);
  });

  it('deve atualizar um funcionário existente corretamente', () => {
    const mockFuncionario: FuncionarioModel = {
      id: '1',
      name: 'Funcionario 1',
      email: 'func@email.com',
      document: '504.498.350-06',
      phone: '(61) 9 8181-8286',
      date_of_birth: new Date('1996-01-01'),
      profile: ProfileEnum.EMPLOYEE,
      manager_name: 'Manager 1',
    };

    const mockResponse: ResponseModel<FuncionarioModel[]> = {
      message: 'Funcionários carregados com sucesso',
      response: [
        {
          id: '1',
          name: 'Funcionario 1',
          email: 'func@email.com',
          document: '123',
          phone: '999999999',
          date_of_birth: new Date('1990-01-01'),
          profile: ProfileEnum.EMPLOYEE,
          manager_name: 'Manager 1',
        },
      ],
    };

    funcionarioServiceSpy.getFuncionarios.and.returnValue(of(mockResponse));

    funcionarioSpy.updateFuncionario.and.returnValue(of(mockFuncionario));

    spyOn(component, 'getFuncionariosComLoadingDesativado');

    component.salvarFuncionario(mockFuncionario);

    expect(funcionarioSpy.updateFuncionario).toHaveBeenCalledWith(
      mockFuncionario
    );

    expect(component.getFuncionariosComLoadingDesativado).toHaveBeenCalledWith(
      'Funcionário atualizado com sucesso!'
    );
  });

  it('deve adicionar um novo funcionário corretamente', () => {
    const mockFuncionario = {
      id: '',
      name: 'Novo Funcionário',
      email: 'novo@funcionario.com',
      document: '504.498.350-06',
      phone: '(61) 9 8181-8286',
      date_of_birth: new Date('1996-01-01'),
      profile: ProfileEnum.EMPLOYEE,
      manager_name: 'Gerente 1',
    };

    const mockCreateResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário criado com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };

    funcionarioSpy.createFuncionario.and.returnValue(of(mockCreateResponse));

    spyOn(component, 'getFuncionariosComLoadingDesativado');

    component.salvarFuncionario(mockFuncionario);

    expect(mockFuncionario.id).toBe('1');
  });

  it('deve chamar mostrarAlerta e getFuncionarios após a mudança de senha', () => {
    const mockFuncionario = {
      id: '1',
      name: 'Novo Funcionário',
      email: 'novo@funcionario.com',
      document: '504.498.350-06',
      phone: '(61) 9 8181-8286',
      date_of_birth: new Date('1996-01-01'),
      profile: ProfileEnum.EMPLOYEE,
      manager_name: 'Gerente 1',
    };

    const mockCreateResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário criado com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };

    funcionarioSpy.changePassword.and.returnValue(of(mockCreateResponse));

    spyOn(component, 'mostrarAlerta');
    spyOn(component, 'getFuncionarios');

    component.salvarNovaSenhaFuncionario('1', '*NovaSenha123');

    expect(component.mostrarAlerta).toHaveBeenCalledWith(
      'Senha atualizada com sucesso!'
    );
    expect(component.getFuncionarios).toHaveBeenCalled();
  });

  it('deve chamar mostrarAlerta com erro ao tentar alterar a senha', () => {
    const errorResponse = { error: { message: 'Erro ao alterar a senha.' } };
    funcionarioSpy.changePassword.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(component, 'mostrarAlerta');
    spyOn(component, 'getFuncionarios');

    component.alterarSenha('1');
    component.salvarNovaSenhaFuncionario('1', '*NovaSenha123');

    expect(component.mostrarAlerta).toHaveBeenCalledWith(
      'Erro ao alterar a senha.'
    );
    expect(component.getFuncionarios).not.toHaveBeenCalled();
  });

  it('deve chamar deleteFuncionario', () => {
    const mockFuncionario = {
      id: '1',
      name: 'Novo Funcionário',
      email: 'novo@funcionario.com',
      document: '504.498.350-06',
      phone: '(61) 9 8181-8286',
      date_of_birth: new Date('1996-01-01'),
      profile: ProfileEnum.EMPLOYEE,
      manager_name: 'Gerente 1',
    };

    const mockCreateResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário excluído com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };

    funcionarioSpy.deleteFuncionario.and.returnValue(of(mockCreateResponse));

    spyOn(component, 'mostrarAlerta');

    component.removerFuncionario('1');

    expect(component.mostrarAlerta).toHaveBeenCalledWith(
      'Funcionário excluído com sucesso!'
    );
  });

  it('deve chamar deleteFuncionario com erro', () => {
    const errorResponse = {
      error: { message: 'Erro ao excluir funcionário.' },
    };
    funcionarioSpy.deleteFuncionario.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(component, 'mostrarAlerta');

    component.removerFuncionario('1');

    expect(component.mostrarAlerta).toHaveBeenCalledWith(
      'Erro ao excluir funcionário.'
    );
  });

  it('deve testar getFuncionariosComLoadingDesativado ', () => {
    const mockResponse: ResponseModel<FuncionarioModel[]> = {
      message: 'Funcionários carregados com sucesso',
      response: [
        {
          id: '1',
          name: 'Funcionario 1',
          email: 'func@email.com',
          document: '123',
          phone: '999999999',
          date_of_birth: new Date('1990-01-01'),
          profile: ProfileEnum.EMPLOYEE,
          manager_name: 'Manager 1',
        },
        {
          id: '2',
          name: 'Gerente 1',
          email: 'manager@email.com',
          document: '456',
          phone: '888888888',
          date_of_birth: new Date('1985-01-01'),
          profile: ProfileEnum.MANAGER,
          manager_name: '',
        },
      ],
    };

    spyOn(component, 'mostrarAlerta');

    funcionarioSpy.getFuncionarios.and.returnValue(of(mockResponse));

    component.getFuncionariosComLoadingDesativado('mensagem');

    expect(component.mostrarAlerta).toHaveBeenCalledWith('mensagem');
  });

  it('deve chamar o método logout do AuthService quando logout for chamado', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
