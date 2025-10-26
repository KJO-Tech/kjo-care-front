import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-resources',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './resources.component.html'
})
export default class ResourcesComponent {
  links = [
    {
      name: 'Centros de salud',
      path: '/app/resources/health-centers'
    },
    {
      name: 'Recursos de emergencia',
      path: '/app/resources/emergency'
    }
  ];
}
