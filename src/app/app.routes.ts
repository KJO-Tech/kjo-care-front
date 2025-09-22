import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/components/layout/dashboard/dashboard.component'),
    children: [
      { path: '', loadComponent: () => import('./modules/dashboard/dashboard-page.component') },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/user/user-page.component')
      },
      {
        path: 'emergency-resources',
        loadComponent: () => import('./modules/emergency-resource/emergency-resource.component')
      },
      { path: 'blog-management', loadComponent: () => import('./modules/blog/blog-page.component') },
      { path: 'moods', loadChildren: () => import('./modules/mood-analytics/mood-analytics.routes') },
      { path: 'settings', loadChildren: () => import('./modules/settings/settings.routes') },
      { path: 'health-centers', loadComponent: () => import('./modules/health-center/health-center.component') },
      { path: 'map', loadComponent: () => import('./modules/health-center-map/health-center-map.component') }
    ],
    canActivate: [authGuard]
  },
  {
    path: 'app',
    loadComponent: () => import('./modules/main/main.component'),
    children: [
      { path: '', loadComponent: () => import('./modules/main/home/home.component') },
      { path: 'mood', loadComponent: () => import('./modules/main/mood/mood.component') },
      { path: 'community', loadComponent: () => import('./modules/main/community/community.component') },
      { path: 'resources', loadComponent: () => import('./modules/main/resources/resources.component') },
      { path: 'profile', loadComponent: () => import('./modules/main/profile/profile.component') },
    ]
  }
];
