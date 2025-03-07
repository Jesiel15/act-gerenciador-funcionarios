import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { ProfileEnum } from '../../enums/profile.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-modal-adicionar-editar-funcionario',
  templateUrl: './modal-adicionar-editar-funcionario.component.html',
  styleUrls: ['./modal-adicionar-editar-funcionario.component.scss'],
})
export class ModalAdicionarEditarFuncionarioComponent {
  funcionarioForm: FormGroup;
  hidePassword = true;
  funcionarios: User[] = [];
  managers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalAdicionarEditarFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { funcionario: User; managers: string[] }
  ) {
    this.managers = data.managers;
    this.funcionarioForm = this.fb.group({
      id: [data?.funcionario.id || ''],
      name: [data?.funcionario.name || '', Validators.required],
      email: [
        data?.funcionario.email || '',
        [Validators.required, Validators.email],
      ],
      document: [data?.funcionario.document || '', Validators.required],
      phone: [data?.funcionario.phone || '', Validators.required],
      manager_name: [data?.funcionario.manager_name || ''],
      date_of_birth: [
        data?.funcionario.date_of_birth || '',
        Validators.required,
      ],
      password: [data?.funcionario.password || '', Validators.required],
      profile: [
        {
          value: this.data?.funcionario.profile || ProfileEnum.EMPLOYEE,
          disabled: true,
        },
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
