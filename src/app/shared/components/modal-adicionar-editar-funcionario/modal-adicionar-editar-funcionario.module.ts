import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAdicionarEditarFuncionarioComponent } from './modal-adicionar-editar-funcionario.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

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
    MatIconModule,
    MatSelectModule,
    NgxMaskPipe,
    NgxMaskDirective
  ],
})
export class ModalAdicionarEditarFuncionarioModule {}
