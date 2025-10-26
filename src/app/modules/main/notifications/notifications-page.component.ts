import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { Location, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NOTIFICATION_TYPE_ICON, NotificationResponse, NotificationType } from '../../../core/models/notification';
import { formatDateToISO8601 } from '../../../shared/utils/date';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  imports: [
    NgClass
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class NotificationsPageComponent {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private location = inject(Location);

  notificationIcons = NOTIFICATION_TYPE_ICON;
  notificationTypes = [
    { type: NotificationType.LIKE, message: 'Likes' },
    { type: NotificationType.COMMENT, message: 'Comentarios' },
    { type: NotificationType.FOLLOW, message: 'Seguidores' },
    { type: NotificationType.MOOD_ALERT, message: 'Estados de animo' }

  ];

  allNotifications = computed(() => this.notificationService.notifications());
  selectedFilter = signal<NotificationType | 'all'>('all');

  filteredNotifications = computed(() => {
    const filter = this.selectedFilter();
    const notifications = this.allNotifications();

    if (filter === 'all') {
      return notifications;
    }
    return notifications.filter(n => n.type === filter);
  });

  unreadCount = computed(() => this.allNotifications().filter(n => !n.read).length);

  handleNotificationClick(notification: NotificationResponse) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
    this.router.navigate([notification.link]);
  }

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFilter.set(selectElement.value as NotificationType | 'all');
  }

  goBack() {
    this.location.back();
  }

  protected readonly formatDateToISO8601 = formatDateToISO8601;
}
