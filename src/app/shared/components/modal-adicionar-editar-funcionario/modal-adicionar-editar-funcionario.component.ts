import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { ProfileEnum } from '../../enums/profile.enum';
import { DocumentValidators } from '../../utils/validators';

@Component({
  selector: 'app-modal-adicionar-editar-funcionario',
  templateUrl: './modal-adicionar-editar-funcionario.component.html',
  styleUrls: ['./modal-adicionar-editar-funcionario.component.scss'],
})
export class ModalAdicionarEditarFuncionarioComponent {
  funcionarioForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  funcionarios: User[] = [];
  managers: string[] = [];
  documentMask: string = '000.000.000-00';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalAdicionarEditarFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { funcionario: User; managers: string[] }
  ) {
    const passwordValidators = data?.funcionario ? [] : [Validators.required];

    this.managers = data.managers;
    this.funcionarioForm = this.fb.group(
      {
        id: [data?.funcionario.id || ''],
        name: [data?.funcionario.name || '', Validators.required],
        email: [
          data?.funcionario.email || '',
          [Validators.required, Validators.email],
        ],
        document: [
          data?.funcionario.document || '',
          [Validators.required, DocumentValidators.validateCPF],
        ],
        phone: [data?.funcionario.phone || '', Validators.required],
        manager_name: [data?.funcionario.manager_name || ''],
        date_of_birth: [
          data?.funcionario.date_of_birth || '',
          Validators.required,
        ],
        password: [
          '',
          [
            ...passwordValidators,
            Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/),
          ],
        ],
        confirmPassword: ['', passwordValidators],
        profile: [
          {
            value: this.data?.funcionario.profile || ProfileEnum.EMPLOYEE,
            disabled: true,
          },
        ],
      },
      { validators: this.senhasIguais }
    );
  }

  senhasIguais(form: FormGroup) {
    const senha = form.get('password');
    const confirmarSenha = form.get('confirmPassword');

    if (!senha || !confirmarSenha) {
      return null;
    }

    return senha.value === confirmarSenha.value
      ? null
      : confirmarSenha.setErrors({ senhaInvalida: true });
  }

  updateMask(event: any): void {
    const inputValue = event.target.value;

    if (inputValue.length <= 11) {
      this.documentMask = '000.000.000-00';
    }
  }

  validateCPFOnBlur(): void {
    const documentControl = this.funcionarioForm.get('document');
    if (documentControl?.valid) {
      return;
    }

    documentControl?.updateValueAndValidity();
  }

  salvar() {
    if (this.funcionarioForm.valid) {
      this.funcionarioForm.get('profile')?.enable();
      this.dialogRef.close(this.funcionarioForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
