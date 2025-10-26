import { Component } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { ThemeControllerComponent } from '../theme-controller/theme-controller.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'layout-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    NotificationsComponent,
    ProfileButtonComponent,
    ThemeControllerComponent,
    RouterLink
  ]
})
export class NavbarComponent {

}
