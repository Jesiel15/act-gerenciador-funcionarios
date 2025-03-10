import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FuncionarioService } from './funcionario.service';

describe('FuncionarioService', () => {
  let service: FuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FuncionarioService],
    });
    service = TestBed.inject(FuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
