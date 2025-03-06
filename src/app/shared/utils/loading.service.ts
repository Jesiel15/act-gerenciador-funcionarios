import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private WAIT_TIME = 1000;
  private loadingSubject = new Subject<boolean>();

  loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, this.WAIT_TIME);
  }
}
