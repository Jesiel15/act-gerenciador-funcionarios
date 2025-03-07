import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-alterar-senha',
  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.scss'],

})
export class ModalAlterarSenhaComponent {
  form: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalAlterarSenhaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group(
      {
        novaSenha: ['', [Validators.required]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.senhasIguais }
    );
  }

  senhasIguais(form: FormGroup) {
    const senha = form.get('novaSenha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhaInvalida: true };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  salvarSenha() {
    if (this.form.valid) {
      const novaSenha = this.form.value.novaSenha;
      this.dialogRef.close({ novaSenha });
    }
  }
}
