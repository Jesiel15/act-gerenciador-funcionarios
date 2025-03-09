import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FuncionariosComponent } from './funcionarios.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@NgModule({
  declarations: [FuncionariosComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxMaskPipe,
    NgxMaskDirective,
    DatePipe,
  ],
})
export class FuncionariosModule {}
