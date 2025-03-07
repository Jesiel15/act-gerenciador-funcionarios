import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { ProfileEnum } from '../../enums/profile.enum';

@Component({
  selector: 'app-modal-adicionar-editar-funcionario',
  templateUrl: './modal-adicionar-editar-funcionario.component.html',
  styleUrls: ['./modal-adicionar-editar-funcionario.component.scss'],
})
export class ModalAdicionarEditarFuncionarioComponent {
  funcionarioForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalAdicionarEditarFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    console.log('data', data);
    this.funcionarioForm = this.fb.group({
      id: [data?.id || ''],
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      document: [data?.document || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      manager_name: [data?.manager_name || ''],
      date_of_birth: [data?.date_of_birth || '', Validators.required],
      password: [data?.password || '', Validators.required],
      profile: [
        { value: this.data?.profile || ProfileEnum.EMPLOYEE, disabled: true },
      ],
    });
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
