import { Component, inject } from '@angular/core';
import { ToastService } from '../../../../core/services/toast.service';
import { NgClass } from '@angular/common';
import { NOTIFICATION_TYPE_ICON, NotificationResponse } from '../../../../core/models/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [
    NgClass
  ]
})
export class ToastComponent {
  private route = inject(Router);

  toastService = inject(ToastService);

  notificationIcons = NOTIFICATION_TYPE_ICON;

  handleNotificationClick(notification: NotificationResponse) {
    this.route.navigate([notification.link]);
  }
}
