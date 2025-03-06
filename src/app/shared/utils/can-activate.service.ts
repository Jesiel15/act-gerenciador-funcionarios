import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { StorageEnum } from '../enums/storage.enum';

@Injectable({
  providedIn: 'root',
})
export class CanActivateService implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot): any {
    const isLogged = this.verifyLogin();
    if (!isLogged) {
      this.router.navigate(['/login']);
    }
    return isLogged;
  }

  private verifyLogin(): boolean {
    const isLogged = this.storageService.getStorage(StorageEnum.LOGGED);
    return Boolean(isLogged);
  }
}
