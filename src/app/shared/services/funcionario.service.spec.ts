import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioModel } from '../models/funcionario.model';
import { ProfileEnum } from '../enums/profile.enum';
import { ResponseModel } from '../models/reponse.model';

describe('FuncionarioService', () => {
  let service: FuncionarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FuncionarioService],
    });
    service = TestBed.inject(FuncionarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get funcionarios', () => {
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

    const mockResponse: ResponseModel<FuncionarioModel[]> = {
      message: 'Funcionário criado com sucesso!',
      response: [{ ...mockFuncionario, id: '1' }],
    };

    service.getFuncionarios().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}-list/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get funcionario by id', () => {
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

    const mockResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário criado com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };

    service.getFuncionarioById('1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create funcionario', () => {
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

    const mockResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário criado com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };
    service.createFuncionario(mockFuncionario).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  it('should update funcionario', () => {
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

    const mockResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário atualizado com sucesso!',
      response: { ...mockFuncionario },
    };

    service.updateFuncionario(mockFuncionario).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
  it('should change password', () => {
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

    const newPassword = 'newPassword123';
    const mockResponse: ResponseModel<FuncionarioModel> = {
      message: 'Senha alterada com sucesso!',
      response: { ...mockFuncionario },
    };

    service.changePassword('1', newPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/change-password/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete funcionario', () => {
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

    const mockResponse: ResponseModel<FuncionarioModel> = {
      message: 'Funcionário criado com sucesso!',
      response: { ...mockFuncionario, id: '1' },
    };
    service.deleteFuncionario('1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
