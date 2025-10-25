import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { NOTIFICATION_TYPE_ICON, NotificationResponse } from '../../../../core/models/notification';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navbar-notifications',
  templateUrl: './notifications.component.html',
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent implements OnDestroy {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  private notificationSubscription?: Subscription;

  notifications = computed(()=> this.notificationService.notifications());
  notificationIcons = NOTIFICATION_TYPE_ICON;

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  handleNotificationClick(notification: NotificationResponse) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
    this.router.navigate([notification.link]);
  }

  // markAllAsRead() {
  //   this.notificationService.markAllAsRead().subscribe(() => {
  //     this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  //   });
  // }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }
}
