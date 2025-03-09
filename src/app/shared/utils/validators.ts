import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DocumentValidators {
  static validateCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) return { invalidCPF: true };

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return { invalidCPF: true };

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return { invalidCPF: true };

    return null;
  }

  static validatePhone(control: AbstractControl): ValidationErrors | null {
    const phone = control.value?.replace(/\D/g, '');
    const phoneRegex = /^[1-9]{2}[9]{1}[0-9]{8}$/;

    if (!phone || !phoneRegex.test(phone)) {
      return { invalidPhone: true };
    }
    return null;
  }
}
