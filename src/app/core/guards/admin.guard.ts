import { Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../../modules/auth/services/keycloak.service';

export const adminGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoading() && !keycloakService.isAdmin()) {
    router.navigate(['app']);
    // Evita que la página entre en un ciclo infinito de recarga
    return false;
  }
  return true;
};
