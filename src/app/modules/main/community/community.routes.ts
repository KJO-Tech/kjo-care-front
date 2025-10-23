import { Routes } from '@angular/router';
import MoodComponent from './community.component';
import CommunityComponent from './community.component';

export default [

  {
    path: '', component: CommunityComponent,
    children: [
      { path: '', loadComponent: () => import('./community-blogs/community-blogs.component') },
      { path: 'post', loadComponent: () => import('./community-form-blog/community-form-blog.component') },
      { path: 'success', loadComponent: () => import('./community-success/community-success.component') },
      { path: 'post/:id', loadComponent: () => import('./community-blog/community-blog.component') },
      { path: '**', redirectTo: '' }
    ]
  }
] as Routes;
