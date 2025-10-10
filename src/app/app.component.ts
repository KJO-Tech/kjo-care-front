import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from './modules/auth/services/keycloak.service';
import { ToastComponent } from './shared/components/layout/toast/toast.component';
import { ThemeControllerComponent } from './shared/components/layout/theme-controller/theme-controller.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ThemeControllerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  keycloakService = inject(KeycloakService);

  login() {
    this.keycloakService.login();
  }

  register() {
    this.keycloakService.register();
  }

  ngOnInit() {
    this.keycloakService.init();
  }
}
