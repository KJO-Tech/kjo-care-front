import { Routes } from '@angular/router';
import MoodComponent from './mood.component';

export default [

  {
    path: '', component: MoodComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'register', loadComponent: () => import('./mood-register/mood-register.component') },
      { path: 'history', loadComponent: () => import('./mood-history/mood-history.component') },
      { path: 'summary', loadComponent: () => import('./mood-summary/mood-summary.component') },
      { path: 'recorded', loadComponent: () => import('./mood-recorded/mood-recorded.component') },
      { path: '**', redirectTo: 'register' }
    ]
  }
] as Routes;
