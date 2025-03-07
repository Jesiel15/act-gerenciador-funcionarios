import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAdicionarEditarFuncionarioComponent } from './modal-adicionar-editar-funcionario.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ModalAdicionarEditarFuncionarioComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ModalAdicionarEditarFuncionarioModule {}
