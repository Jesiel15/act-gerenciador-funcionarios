import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent {
  constructor(private userService: UserService) {}
  getFuncionarios(): void {
    this.userService.getUsers().subscribe((data) => {
      console.log(data);
    });
    // console.log(this.userService.getUsers());
  }
}
