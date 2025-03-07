import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalAdicionarEditarFuncionarioComponent } from 'src/app/shared/components/modal-adicionar-editar-funcionario/modal-adicionar-editar-funcionario.component';
import { ModalAlterarSenhaComponent } from 'src/app/shared/components/modal-alterar-senha/modal-alterar-senha.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  funcionarios: User[] = [];
  managers: string[] = [];
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
      this.managers = this.funcionarios.map((manager) => manager.name);
    });
  }

  adicionarFuncionario() {
    const dialogRef = this.dialog.open(
      ModalAdicionarEditarFuncionarioComponent,
      {
        width: '50%',
        data: { funcionario: '', managers: this.managers },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.funcionarios.push(result);
        this.salvarFuncionario(result);
      }
    });
  }

  private validarFuncionario(funcionario: User): boolean {
    return !!(
      funcionario.name &&
      funcionario.email &&
      funcionario.document &&
      funcionario.phone &&
      funcionario.date_of_birth
    );
  }

  salvarFuncionario(funcionario: User): void {
    if (!this.validarFuncionario(funcionario)) {
      this.mostrarAlerta(
        'Preencha todos os campos obrigatórios antes de salvar!'
      );
      return;
    }

    if (funcionario.id) {
      this.userService.updateUser(funcionario).subscribe((response) => {
        this.mostrarAlerta('Funcionário atualizado com sucesso!');
        this.getFuncionarios();
      });
    } else {
      this.userService.createUser(funcionario).subscribe((response) => {
        if (response.response.id) {
          funcionario.id = response.response.id;
        }
        this.getFuncionarios();
        this.mostrarAlerta('Funcionário criado com sucesso!');
      });
    }
  }

  editarFuncionario(funcionario: User): void {
    const dialogRef = this.dialog.open(
      ModalAdicionarEditarFuncionarioComponent,
      {
        width: '50%',
        data: { funcionario, managers: this.managers },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.funcionarios.push(result);
        this.salvarFuncionario(result);
      }
    });
  }

  removerFuncionario(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
      this.mostrarAlerta('Funcionário excluído com sucesso!');
    });
  }

  alterarSenha(id: string): void {
    console.log(id);
    const dialogRef = this.dialog.open(ModalAlterarSenhaComponent, {
      width: '50%',
      data: { funcionarioId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.salvarNovaSenhaFuncionario(id, result.novaSenha);
      }
    });
  }

  salvarNovaSenhaFuncionario(id: string, novaSenha: string): void {
    this.userService.changePassword(id, novaSenha).subscribe((response) => {
      this.mostrarAlerta('Senha atualizada com sucesso!');
      this.getFuncionarios();
    });
  }

  mostrarAlerta(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-alert'],
    });
  }
}
