import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { BlogService } from '../../../../core/services/blog.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Category } from '../../../../core/models/blog';
import { BlogResponse } from '../../../../core/interfaces/blog-http.interface';
import { UserProfile } from '../../../../core/models/user-profile';
import { Router, RouterLink } from '@angular/router';
import { KeycloakService } from '../../../auth/services/keycloak.service';
import { ReactionService } from '../../../../core/services/reaction.service';

@Component({
  selector: 'community-blogs',
  templateUrl: './community-blogs.component.html',
  imports: [
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export default class CommunityBlogsComponent {

  private router = inject(Router);

  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private reactionService = inject(ReactionService);
  private keycloakService = inject(KeycloakService);
  private toastService = inject(ToastService);

  blogs = rxResource({
    loader: () => this.blogService.getPublished(0, 100).pipe(
      map(response => response.result.content)
    )
  });

  _categories = rxResource({
    loader: () => this.categoryService.findAll().pipe(
      map(response => response.result)
    )
  });

  search = signal<string>('');
  category = signal<string>('');
  type = signal<'default' | 'recent' | 'popular' | 'my-blogs'>('default');

  categories = computed<Category[]>(() => {
    return this._categories.value() ?? [];
  });

  filteredBlogs = computed<BlogResponse[]>(() => {
    let temporal = this.blogs.value() ?? [];

    if (this.search().length > 0) {
      temporal = temporal.filter(blog => {
        let author = blog.blog.author?.firstName + ' ' + blog.blog.author?.lastName;

        return blog.blog.title.toLowerCase().includes(this.search().toLowerCase()) ||
          blog.blog.content.toLowerCase().includes(this.search().toLowerCase()) ||
          author.toLowerCase().includes(this.search().toLowerCase());
      });
    }

    if (this.category().length > 0) {
      temporal = temporal.filter(blog => blog.blog.category?.id === this.category());
    }

    if (this.type() === 'recent') {
      temporal = temporal.sort((a, b) => new Date(b.blog.publishedDate).getTime() - new Date(a.blog.publishedDate).getTime());
    }

    if (this.type() === 'popular') {
      temporal = temporal.sort((a, b) => b.reactionCount - a.reactionCount);
    }

    if (this.type() === 'my-blogs') {
      temporal = temporal.filter(blog => blog.blog.author?.id === this.keycloakService.profile()?.id);
    }

    return temporal;
  });

  getUserLetters(user?: UserProfile) {
    const firstName: string = user?.firstName ?? '?';
    const lastName: string = user?.lastName ?? '?';
    return firstName[0] + lastName[0];
  }

  setType(type: string) {
    this.type.set(type as 'default' | 'recent' | 'popular' | 'my-blogs');
  }

  goToBlog(blogId: string) {
    this.router.navigate(['/app/community/post', blogId]);
  }

  // FIXME: Que prevenga correctamente el evento de blog
  goToBlogCommentSection(event: Event, blogId: string) {
    event.preventDefault();
    this.router.navigate(['/app/community/post', blogId], {
      fragment: 'comments'
    });
  }

  goToCreateBlog() {
    this.router.navigate(['/app/community/post']);
  }

  // TODO: Create the functions to create reactions

  reload() {
    this.blogs.reload();
  }

}
