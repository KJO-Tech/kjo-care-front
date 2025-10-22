// src/app/services/notification.service.ts
import { computed, inject, Injectable } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { KeycloakService } from '../../modules/auth/services/keycloak.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { NotificationResponse } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl: string = environment.apiUrl + '/api/mind/notification/notification';

  // Conectar a través del Gateway
  private wsUrl: string = 'ws://localhost:9007/ws-notifications';

  private http = inject(HttpClient);
  private keycloakService = inject(KeycloakService);
  private rxStomp: RxStomp;

  private userId = computed(() => this.keycloakService.profile()?.id);

  constructor() {
    this.rxStomp = new RxStomp();
  }

  public connect(): void {
    const token = this.keycloakService.keycloak.token;
    if (!token) {
      console.error('No hay token de autenticación, no se puede conectar al WebSocket.');
      return;
    }

    // Si ya está conectado o conectando, no hacer nada
    if (this.rxStomp.connected() || this.rxStomp.connectionState$.value === RxStompState.CONNECTING) {
      console.log('WebSocket ya está conectado o conectando');
      return;
    }

    this.rxStomp.configure({
      // Usa la URL completa del WebSocket
      brokerURL: this.wsUrl,

      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      // Tiempo de reconexión
      reconnectDelay: 5000,

      // Heartbeat (importante para mantener la conexión)
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      // Timeout de conexión
      connectionTimeout: 5000,

      // Debug
      debug: (msg: string): void => {
        console.log('[STOMP]', new Date().toLocaleTimeString(), msg);
      },

      // Callback cuando se establece la conexión
      beforeConnect: () => {
        console.log('Intentando conectar al WebSocket...');
      },
    });

    console.log('Activando cliente STOMP...');
    this.rxStomp.activate();

    // Observar el estado de la conexión
    this.rxStomp.connectionState$.subscribe((state) => {
      console.log('Estado de conexión:', RxStompState[state]);
    });
  }

  public getMyNotifications() {
    return this.http.get<ApiResponse<NotificationResponse[]>>(`${this.baseUrl}`);
  }

  public watchNotifications(): Observable<Message> {
    const userId = this.userId();
    if (!userId) {
      throw new Error("El usuario no está autenticado, no se puede suscribir.");
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
