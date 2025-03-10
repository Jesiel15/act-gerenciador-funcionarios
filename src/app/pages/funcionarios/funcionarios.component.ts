import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { FuncionarioModel } from 'src/app/shared/models/funcionario.model';
import { ProfileEnum } from 'src/app/shared/enums/profile.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalAdicionarEditarFuncionarioComponent } from 'src/app/shared/components/modal-adicionar-editar-funcionario/modal-adicionar-editar-funcionario.component';
import { ModalAlterarSenhaComponent } from 'src/app/shared/components/modal-alterar-senha/modal-alterar-senha.component';
import { tap } from 'rxjs';
import { ModalConfirmarComponent } from 'src/app/shared/components/modal-confirmar/modal-confirmar.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  isAllowed = false;
  loading = false;
  funcionarios: FuncionarioModel[] = [];
  managers: { name: string; profile: ProfileEnum }[] = [];

  displayedColumns: string[] = [
    'profile_img',
    'name',
    'email',
    'document',
    'phone',
    'manager',
    'date_of_birth',
    'profile',
    'actions',
  ];

  displayedColumnsEmployee: string[] = [
    'profile_img',
    'name',
    'email',
    'document',
    'phone',
    'manager',
    'date_of_birth',
    'profile',
  ];

  constructor(
    private funcionarioService: FuncionarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getFuncionarios();
    this.authService.permission$.subscribe((isAllowed) => {
      this.isAllowed = isAllowed;
    });
  }

  getFuncionarios(): void {
    this.loading = true;

    this.funcionarioService.getFuncionarios().subscribe(
      (response) => {
        this.funcionarios = response.response.filter(
          (funcionario) => funcionario.profile !== ProfileEnum.MANAGER
        );

        this.managers = response.response
          .filter((manager) => manager.profile)
          .map((manager) => ({
            name: manager.name,
            profile: manager.profile,
            document: manager.document
          }));

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

  private validarFuncionario(funcionario: FuncionarioModel): boolean {
    return !!(
      funcionario.name &&
      funcionario.email &&
      funcionario.document &&
      funcionario.phone &&
      funcionario.date_of_birth
    );
  }

  salvarFuncionario(funcionario: FuncionarioModel): void {
    this.loading = true;
    if (!this.validarFuncionario(funcionario)) {
      this.mostrarAlerta(
        'Preencha todos os campos obrigatórios antes de salvar!'
      );
      this.loading = false;
      return;
    }

    const acao = funcionario.id
      ? this.funcionarioService.updateFuncionario(funcionario)
      : this.funcionarioService.createFuncionario(funcionario);

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
    return this.funcionarioService.getFuncionarios().pipe(
      tap((response) => {
        this.funcionarios = response.response.filter(
          (funcionario) => funcionario.profile !== ProfileEnum.MANAGER
        );
        this.managers = response.response
          .filter((manager) => manager.profile)
          .map((manager) => ({
            name: manager.name,
            profile: manager.profile,
            document: manager.document
          }));
      })
    );
  }

  editarFuncionario(funcionario: FuncionarioModel): void {
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
    this.funcionarioService.deleteFuncionario(id).subscribe(
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
    this.funcionarioService.changePassword(id, novaSenha).subscribe(
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

  logout(): void {
    this.authService.logout();
  }
}
