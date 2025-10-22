import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnDestroy, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { map, Subscription, tap } from 'rxjs';
import { NotificationResponse } from '../../../../core/models/notification';
import { rxResource } from '@angular/core/rxjs-interop';
import { KeycloakService } from '../../../../modules/auth/services/keycloak.service';

@Component({
  selector: 'navbar-notifications',
  templateUrl: './notifications.component.html',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent implements OnDestroy {
  private notificationService = inject(NotificationService);
  private keycloakService = inject(KeycloakService);

  private notificationSubscription?: Subscription;

  private notificationsResource = rxResource({
    loader: () => this.notificationService.getMyNotifications().pipe(
      map(response => response.result),
      tap(list => {
        this.notifications.set(list);
      })
    )
  });

  notifications = signal<NotificationResponse[]>([]);

  constructor() {
    effect((onCleanup) => {
      const userId = this.keycloakService.profile()?.id;

      if (userId) {
        this.notificationService.connect();

        this.notificationSubscription = this.notificationService.watchNotifications()
          .subscribe((message) => {
            console.log('¡Mensaje recibido!', message.body);
            const newNotification = JSON.parse(message.body) as NotificationResponse;
            this.notifications.update(list => [newNotification, ...list]);
          });

        onCleanup(() => {
          this.notificationSubscription?.unsubscribe();
        });
      }
    });
  }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }
}
