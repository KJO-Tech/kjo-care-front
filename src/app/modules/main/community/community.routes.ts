import { Routes } from '@angular/router';
import MoodComponent from './community.component';
import CommunityComponent from './community.component';

export default [

  {
    path: '', component: CommunityComponent,
    children: [
      { path: '', loadComponent: () => import('./community-blogs/community-blogs.component') },
      { path: 'create', loadComponent: () => import('./community-create-blog/community-create-blog.component') },
      { path: 'success', loadComponent: () => import('./community-success/community-success.component') },
      { path: 'blog/:id', loadComponent: () => import('./community-blog/community-blog.component') },
      { path: '**', redirectTo: '' }
    ]
  }
] as Routes;
