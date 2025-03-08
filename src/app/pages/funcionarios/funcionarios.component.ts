import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalAdicionarEditarFuncionarioComponent } from 'src/app/shared/components/modal-adicionar-editar-funcionario/modal-adicionar-editar-funcionario.component';
import { ModalAlterarSenhaComponent } from 'src/app/shared/components/modal-alterar-senha/modal-alterar-senha.component';
import { tap } from 'rxjs';
import { ModalConfirmarComponent } from 'src/app/shared/components/modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  loading = false;
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
    this.loading = true;

    this.userService.getUsers().subscribe(
      (response) => {
        this.funcionarios = response.response.filter(
          (funcionario) => funcionario.profile !== ProfileEnum.MANAGER
        );
        this.managers = response.response
          .filter((manager) => manager.profile === ProfileEnum.MANAGER)
          .map((manager) => manager.name);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.mostrarAlerta('Erro ao carregar funcionários.');
      }
    );
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
    this.loading = true;

    if (!this.validarFuncionario(funcionario)) {
      this.mostrarAlerta(
        'Preencha todos os campos obrigatórios antes de salvar!'
      );
      this.loading = false;
      return;
    }

    const acao = funcionario.id
      ? this.userService.updateUser(funcionario)
      : this.userService.createUser(funcionario);

    acao.subscribe(
      (response) => {
        if (!funcionario.id && response.response.id) {
          funcionario.id = response.response.id;
        }

        this.getFuncionariosComLoadingDesativado(
          funcionario.id
            ? 'Funcionário atualizado com sucesso!'
            : 'Funcionário criado com sucesso!'
        );
      },
      () => {
        this.loading = false;
        this.mostrarAlerta(
          funcionario.id
            ? 'Erro ao atualizar funcionário!'
            : 'Erro ao criar funcionário!'
        );
      }
    );
  }

  private getFuncionariosComLoadingDesativado(mensagem: string): void {
    this.getFuncionariosFinalizado().subscribe(() => {
      this.loading = false;
      this.mostrarAlerta(mensagem);
    });
  }

  private getFuncionariosFinalizado() {
    return this.userService.getUsers().pipe(
      tap((response) => {
        this.funcionarios = response.response.filter(
          (funcionario) => funcionario.profile !== ProfileEnum.MANAGER
        );
        this.managers = this.funcionarios.map((manager) => manager.name);
      })
    );
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

  abrirModalConfirmarExclusao(id: string): void {
    const dialogRef = this.dialog.open(ModalConfirmarComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removerFuncionario(id);
      }
    });
  }

  removerFuncionario(id: string): void {
    this.loading = true;
    this.userService.deleteUser(id).subscribe(
      () => {
        this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
        this.loading = false;
        this.mostrarAlerta('Funcionário excluído com sucesso!');
      },
      (error) => {
        this.loading = false;
        this.mostrarAlerta('Erro ao excluir funcionário.');
      }
    );
  }

  alterarSenha(id: string): void {
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
    this.userService.changePassword(id, novaSenha).subscribe(
      (response) => {
        this.mostrarAlerta('Senha atualizada com sucesso!');
        this.getFuncionarios();
      },
      (error) => {
        this.mostrarAlerta('Erro ao alterar a senha.');
      }
    );
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
