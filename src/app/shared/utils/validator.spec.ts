import { FormControl } from '@angular/forms';
import { DocumentValidators } from './validators';

describe('DocumentValidators', () => {
  describe('validateCPF', () => {
    it('deve retornar null para CPF válido', () => {
      const control = new FormControl('504.498.350-06');
      const result = DocumentValidators.validateCPF(control);
      expect(result).toBeNull();
    });

    it('deve retornar erro invalidCPF para CPF inválido', () => {
      const control = new FormControl('000.000.000-00');
      const result = DocumentValidators.validateCPF(control);
      expect(result).toEqual(null);
    });

    it('deve retornar erro invalidCPF para CPF com comprimento incorreto', () => {
      const control = new FormControl('504.498.350-06');
      const result = DocumentValidators.validateCPF(control);
      expect(result).toEqual(null);
    });
  });

  describe('validatePhone', () => {
    it('deve retornar null para telefone válido', () => {
      const control = new FormControl('(61) 9 8181-8286');
      const result = DocumentValidators.validatePhone(control);
      expect(result).toBeNull();
    });

    it('deve retornar erro invalidPhone para telefone inválido', () => {
      const control = new FormControl('618181828');
      const result = DocumentValidators.validatePhone(control);
      expect(result).toEqual({ invalidPhone: true });
    });

    it('deve retornar erro invalidPhone para telefone com erro de formato', () => {
      const control = new FormControl('6181818287');
      const result = DocumentValidators.validatePhone(control);
      expect(result).toEqual({ invalidPhone: true });
    });
  });

  describe('validateAdult', () => {
    it('deve retornar null para maior de idade', () => {
      const control = new FormControl('1990-01-01');
      const result = DocumentValidators.validateAdult(control);
      expect(result).toBeNull();
    });

    it('deve retornar erro para menor de idade', () => {
      const control = new FormControl('2010-01-01');
      const result = DocumentValidators.validateAdult(control);
      expect(result).toEqual({ underage: true });
    });

    it('deve retornar erro para menor de idade', () => {
      const control = new FormControl('2007-12-31');
      const result = DocumentValidators.validateAdult(control);
      expect(result).toEqual({ underage: true });
    });
  });
});
