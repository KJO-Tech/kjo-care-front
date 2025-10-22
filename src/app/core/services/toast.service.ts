import { Injectable, signal } from '@angular/core';
import { Toast } from '../interfaces/toast';
import { NotificationResponse } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  notifications = signal<NotificationResponse[]>([]);

  addToast(toast: Toast) {
    this.toasts.update(list => [toast, ...list]);

    setTimeout(() => {
      this.toasts.update(list => {
        list.shift();
        return list;
      });
    }, toast.duration);
  }

  addNotification(notification: NotificationResponse) {
    this.notifications.update(list => [notification, ...list]);

    setTimeout(() => {
      this.notifications.update(list => {
        list.shift();
        return list;
      });
    }, 5000);
  }
}
