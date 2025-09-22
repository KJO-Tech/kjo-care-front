import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NotificationsComponent } from '../../shared/components/layout/notifications/notifications.component';
import { ProfileButtonComponent } from '../../shared/components/layout/profile-button/profile-button.component';
import { NgClass } from '@angular/common';
import { ThemeControllerComponent } from '../../shared/components/layout/theme-controller/theme-controller.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterLink,
    RouterLinkActive,
    NotificationsComponent,
    ProfileButtonComponent,
    RouterOutlet,
    NgClass,
    ThemeControllerComponent
  ],
  templateUrl: './main.component.html'
})
export default class MainComponent {

  links = [
    {
      name: 'Inicio',
      path: '/app',
      icon: 'home',
    },
    {
      name: 'Ánimo',
      path: '/app/mood',
      icon: 'emoji_emotions',
    },
    {
      name: 'Comunidad',
      path: '/app/community',
      icon: 'diversity_1', // groups
    },
    {
      name: 'Recursos',
      path: '/app/resources',
      icon: 'vertical_split',
    },
    {
      name: 'Perfil',
      path: '/app/profile',
      icon: 'person',
    }
  ]
}
