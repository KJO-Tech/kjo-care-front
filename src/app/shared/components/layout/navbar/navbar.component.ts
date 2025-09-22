import { Component } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { ThemeControllerComponent } from '../theme-controller/theme-controller.component';

@Component({
  selector: 'layout-navbar',
  templateUrl: './navbar.component.html',
  imports: [NotificationsComponent, ProfileButtonComponent, ThemeControllerComponent]
})
export class NavbarComponent {

}
