import { Injectable } from '@angular/core';
import { StorageEnum } from '../enums/storage.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setStorage(storageName: StorageEnum, value: string): void {
    sessionStorage.setItem(storageName, value);
  }

  getStorage(storageName: StorageEnum): string {
    return sessionStorage.getItem(storageName) || '';
  }

  clearDataLogin(): void {
    sessionStorage.clear();
  }
}
