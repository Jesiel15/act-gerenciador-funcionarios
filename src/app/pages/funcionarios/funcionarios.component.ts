import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalAdicionarEditarFuncionarioComponent } from 'src/app/shared/components/modal-adicionar-editar-funcionario/modal-adicionar-editar-funcionario.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  funcionarios: User[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'document',
    'phone',
    'manager',
    'date_of_birth',
    'profile',
    'actions',
  ];
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFuncionarios();
  }

  getFuncionarios(): void {
    this.userService.getUsers().subscribe((response) => {
      this.funcionarios = response.response;
    });
  }

  adicionarFuncionario() {
    const dialogRef = this.dialog.open(ModalAdicionarEditarFuncionarioComponent, {
      width: '50%',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.funcionarios.push(result);
      }
    });
  }

  private validarFuncionario(funcionario: User): boolean {
    return !!(
      funcionario.name &&
      funcionario.email &&
      funcionario.document &&
      funcionario.phone &&
      funcionario.manager_name &&
      funcionario.date_of_birth &&
      funcionario.profile &&
      funcionario.password
    );
  }

  private mostrarAlerta(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-alert'],
    });
  }

  salvarFuncionario(funcionario: User): void {
    if (!this.validarFuncionario(funcionario)) {
      console.warn('Preencha todos os campos obrigatórios antes de salvar.');
      this.mostrarAlerta(
        'Preencha todos os campos obrigatórios antes de salvar!'
      );
      return;
    }

    if (funcionario.id) {
      this.userService.updateUser(funcionario).subscribe((response) => {});
    } else {
      this.userService.createUser(funcionario).subscribe((response) => {
        if (response.response.id) {
          funcionario.id = response.response.id;
        }
        this.getFuncionarios();
      });
    }
  }

  editarFuncionario(funcionario: User): void {
    console.log(funcionario);

    const dialogRef = this.dialog.open(ModalAdicionarEditarFuncionarioComponent, {
      width: '50%',
      data: funcionario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.funcionarios.push(result);
      }
    });
  }

  removerFuncionario(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
    });
  }
}
