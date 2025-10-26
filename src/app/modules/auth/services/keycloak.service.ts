import { Injectable, signal, computed } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../../environments/environment';
import { UserProfile } from '../../../core/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloakInstance = signal<Keycloak | undefined>(undefined);
  private _userProfile = signal<UserProfile | undefined>(undefined);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(true);

  readonly profile = computed(() => this._userProfile());
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly isLoading = computed(() => this._isLoading());

  readonly isAdmin = computed(() => {
    const keycloak = this._keycloakInstance();
    if (!keycloak || !this.isAuthenticated()) {
      return false;
    }
    return keycloak.hasRealmRole('admin');
  });

  private initKeycloak(): Keycloak {
    if (!this._keycloakInstance()) {
      const keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });
      this._keycloakInstance.set(keycloak);
    }
    return this._keycloakInstance()!;
  }

  get keycloak(): Keycloak {
    return this.initKeycloak();
  }

  async init() {
    console.log("Autenticando al usuario...");
    const keycloak = this.initKeycloak();

    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
      });

      this._isLoading.set(false);
      this._isAuthenticated.set(authenticated);

      if (authenticated) {
        console.log("Usuario autenticado");
        const userProfile = await keycloak.loadUserProfile() as UserProfile;
        userProfile.token = keycloak.token || '';
        this._userProfile.set(userProfile);

        // Iniciar el refresco automático del token
        this.startTokenAutoRefresh();
      }
    } catch (error) {
      console.error('Error al inicializar Keycloak:', error);
      this._isAuthenticated.set(false);
      this._isLoading.set(false);
    }
  }

  private startTokenAutoRefresh(): void {
    const keycloak = this._keycloakInstance();
    if (!keycloak) return;

    setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(50);
        if (refreshed) {
          console.log('Token refrescado exitosamente');
          const user = this._userProfile();
          if(user) {
            user.token = keycloak.token || '';
            this._userProfile.set({ ...user });
          }
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        this.logout();
      }
    }, 60000); // Comprobar cada 60 segundos
  }

  login() {
    return this.keycloak.login();
  }

  register() {
    return this.keycloak.register();
  }

  logout() {
    this._isAuthenticated.set(false);
    this._userProfile.set(undefined);
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  goToAccountManagement() {
    return this.keycloak.accountManagement();
  }
}
