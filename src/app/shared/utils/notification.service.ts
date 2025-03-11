import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationEnum } from '../enums/notification.enum';
import { ResponseModel } from '../models/reponse.model';

class NotificationData {
  data!: ResponseModel<any>;
  type!: NotificationEnum;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private TIME_OUT = 3000;

  private notificationSubject = new Subject<
    NotificationData | undefined | null
  >();

  notification$ = this.notificationSubject.asObservable();

  show(data: ResponseModel<any>, type: NotificationEnum): void {
    this.notificationSubject.next({ data, type });
    setTimeout(() => this.hide(), this.TIME_OUT);
  }

  hide(): void {
    this.notificationSubject.next(null);
  }
}
