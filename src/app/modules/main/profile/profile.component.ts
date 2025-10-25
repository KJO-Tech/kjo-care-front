import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../auth/services/keycloak.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
})
export default class ProfileComponent {
  private keycloakService = inject(KeycloakService);

  userProfile = this.keycloakService.profile;


  editProfile(): void {
    this.keycloakService.goToAccountManagement();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
