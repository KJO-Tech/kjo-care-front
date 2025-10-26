import { Routes } from '@angular/router';
import ResourcesComponent from './resources.component';

export default [

  {
    path: '', component: ResourcesComponent,
    children: [
      { path: '', redirectTo: 'health-centers', pathMatch: 'full' },
      { path: 'health-centers', loadComponent: () => import('./resources-health-center/resources-health-center.component')},
      { path: 'emergency', loadComponent: () => import('./resources-emergency/resources-emergency.component')},
      { path: '**', redirectTo: 'health-centers' }
    ]
  }
] as Routes;
