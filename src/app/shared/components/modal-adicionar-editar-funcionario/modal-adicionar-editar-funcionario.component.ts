import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuncionarioModel } from '../../models/funcionario.model';
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
  funcionarios: FuncionarioModel[] = [];
  managers: { name: string; profile: ProfileEnum }[] = [];
  documentMask: string = '000.000.000-00';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalAdicionarEditarFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      funcionario: FuncionarioModel;
      managers: { name: string; profile: ProfileEnum; document: string }[];
    }
  ) {
    const passwordValidators = data?.funcionario ? [] : [Validators.required];

    this.managers = data.managers.filter(
      (manager) => manager.document !== data.funcionario?.document
    );

    const phoneNumbers = data?.funcionario.phone
      ? data.funcionario.phone.split(';')
      : [''];

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
        phones: this.fb.array(
          phoneNumbers.map((phone: string) =>
            this.fb.group({
              phone: [
                phone,
                [Validators.required, DocumentValidators.validatePhone],
              ],
            })
          )
        ),
        manager_name: [data?.funcionario.manager_name || ''],
        date_of_birth: [
          data?.funcionario.date_of_birth || '',
          [Validators.required, DocumentValidators.validateAdult],
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
      const formValue = this.funcionarioForm.value;

      const formattedPhones = formValue.phones
        .map((phone: any) => phone.phone.replace(/\D/g, ''))
        .map((phone: string) => {
          return `(${phone.substring(0, 2)}) ${phone.substring(
            2,
            7
          )}-${phone.substring(7, 11)}`;
        })
        .join(';');

      this.dialogRef.close({
        ...formValue,
        phone: formattedPhones,
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  addPhone(): void {
    this.phones.push(
      this.fb.group({
        phone: ['', [Validators.required, DocumentValidators.validatePhone]],
      })
    );
    this.funcionarioForm.markAllAsTouched();
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  get phones(): FormArray {
    return this.funcionarioForm.get('phones') as FormArray;
  }
}
