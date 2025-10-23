// src/app/services/notification.service.ts
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { Observable, Subscription, tap } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { KeycloakService } from '../../modules/auth/services/keycloak.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { NotificationResponse } from '../models/notification';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl: string = environment.apiUrl + '/api/mind/notification/notification';

  // Conectar a través del Gateway
  private wsUrl: string = 'ws://localhost:9007/ws-notifications';

  private http = inject(HttpClient);
  private keycloakService = inject(KeycloakService);
  private toastService = inject(ToastService);

  private rxStomp: RxStomp;
  private notificationSubscription?: Subscription;

  private userId = computed(() => this.keycloakService.profile()?.id);

  public notifications = signal<NotificationResponse[]>([]);

  constructor() {
    this.rxStomp = new RxStomp();

    this.getMyNotifications().subscribe({
      next: (response) => {
        this.notifications.set(response.result ?? []);
      },
    })

    effect((onCleanup) => {
      if (this.keycloakService.profile()?.id) {
        this.connect();

        this.notificationSubscription = this.watchNotifications()
          .subscribe((message) => {
            const newNotification = JSON.parse(message.body) as NotificationResponse;
            this.notifications.update(list => [newNotification, ...list]);

            this.toastService.addNotification(newNotification);
          });

        onCleanup(() => {
          this.notificationSubscription?.unsubscribe();
        });
      }
    });
  }

  public connect(): void {
    const token = this.keycloakService.keycloak.token;
    if (!token) {
      console.error('No hay token de autenticación, no se puede conectar al WebSocket.');
      return;
    }

    if (this.rxStomp.connected() || this.rxStomp.connectionState$.value === RxStompState.CONNECTING) {
      return;
    }

    this.rxStomp.configure({
      brokerURL: this.wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectionTimeout: 5000,
      debug: (msg: string): void => {
        console.log('[STOMP]', new Date().toLocaleTimeString(), msg);
      },
      beforeConnect: () => {
        console.log('Intentando conectar al WebSocket...');
      }
    });

    this.rxStomp.activate();

    this.rxStomp.connectionState$.subscribe((state) => {
      console.log('Estado de conexión:', RxStompState[state]);
    });
  }

  public getMyNotifications() {
    return this.http.get<ApiResponse<NotificationResponse[]>>(`${this.baseUrl}`);
  }

  public markAsRead(notificationId: string): Observable<ApiResponse<NotificationResponse>> {
    return this.http.patch<ApiResponse<NotificationResponse>>(`${this.baseUrl}/${notificationId}`, {}).pipe(
      tap(() => {
        this.notifications.update(list =>
          list.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      })
    );
  }

  // public markAllAsRead(): Observable<ApiResponse<void>> {
  //   return this.http.post<ApiResponse<void>>(`${this.baseUrl}/read-all`, {});
  // }

  public watchNotifications(): Observable<Message> {
    const userId = this.userId();
    if (!userId) {
      throw new Error('El usuario no está autenticado, no se puede suscribir.');
    }

    const destination = `/queue/notifications-${userId}`;
    console.log('Suscribiendo al canal:', destination);

    return this.rxStomp.watch(destination);
  }

  public isConnected(): boolean {
    return this.rxStomp.connected();
  }

  public disconnect() {
    if (this.rxStomp.active) {
      this.rxStomp.deactivate();
      console.log('Cliente WebSocket desconectado.');
    }
  }
}
