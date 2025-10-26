import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal } from '@angular/core';
import { BlogService } from '../../../../core/services/blog.service';
import { CommentService } from '../../../../core/services/comment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../../core/models/user-profile';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { CommunityBlogCommentComponent } from '../components/community-blog-comment/community-blog-comment.component';
import { CommunityCommentFormComponent } from '../components/community-comment-form/community-comment-form.component';
import { BlogResponse, CommentSummary } from '../../../../core/interfaces/blog-http.interface';
import { Location } from '@angular/common';
import { ReactionService } from '../../../../core/services/reaction.service';
import { KeycloakService } from '../../../auth/services/keycloak.service';
import { ModalOpenButtonComponent } from '../../../../shared/components/modal-open-button/modal-open-button.component';
import { BlogCommentModalComponent } from '../../../blog/blog-comment-modal/blog-comment-modal.component';

@Component({
  selector: 'app-community-blog',
  templateUrl: './community-blog.component.html',
  imports: [
    DialogComponent,
    CommunityBlogCommentComponent,
    CommunityCommentFormComponent,
    ModalOpenButtonComponent,
    BlogCommentModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class CommunityBlogComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  private keycloakService = inject(KeycloakService);
  blogService = inject(BlogService);
  private reactionService = inject(ReactionService);
  commentService = inject(CommentService);
  private toastService = inject(ToastService);

  isLoading = signal(true);
  blogId = signal('');

  userId = computed(() => this.keycloakService.profile()?.id);

  readonly blog = rxResource({
    request: () => this.blogId(),
    loader: ({ request }) => this.blogService.getById(request).pipe(
      map(response => {
        this.isLoading.set(false);
        this.comments.set(response.result.comments);
        this.blogService.selectedBlog = response.result as BlogResponse;
        return response.result;
      })
    )
  });

  comments = signal<CommentSummary[]>([]);

  constructor() {
    effect(() => {
      this.route.paramMap.subscribe(params => {
        this.blogId.set(params.get('id') ?? '');
      });
    });
  }

  toggleLike() {
    if (this.blog.value()?.hasLiked) {
      this.reactionService.delete(this.blogId()).subscribe(
        {
          next: () => {
            this.blog.update(blog => {
              blog!.reactionCount -= 1;
              blog!.hasLiked = false;
              return blog;
            });
          }
        }
      );
      return;
    }

    this.reactionService.create(this.blogId()).subscribe({
      next: value => {
        this.blog.update(blog => {
          blog!.reactionCount += 1;
          blog!.hasLiked = true;
          return blog;
        });
      },
      error: error => {
        this.toastService.addToast({
          message: 'Error al reaccionar',
          type: 'error',
          duration: 4000
        });
      }
    });
  }

  deleteComment() {
    this.commentService.delete(this.commentService.selectedComment.id).subscribe({
      next: () => {
        this.toastService.addToast({
          message: 'Comentario eliminado',
          type: 'success',
          duration: 4000
        });
        this.reload();
      },
      error: (error) => {
        this.toastService.addToast({
          message: 'Error eliminando el comentario',
          type: 'error',
          duration: 4000
        });
      }
    });
  }

  getUserLetters(user?: UserProfile) {
    const firstName: string = user?.firstName ?? '?';
    const lastName: string = user?.lastName ?? '?';
    return firstName[0] + lastName[0];
  }

  deleteBlog() {
    this.blogService.delete(this.blogService.selectedBlog?.blog.id ?? '').subscribe({
      next: () => {
        this.toastService.addToast({
          message: 'Post eliminado con éxito',
          type: 'success',
          duration: 4000
        });

        this.router.navigate(['/app/community']);
      },
      error: (error) => {
        this.toastService.addToast({
          message: 'Error eliminando el post',
          type: 'error',
          duration: 4000
        });
      }
    });
  }

  reload() {
    this.blog.reload();
  }

  redirectToEdit() {
    this.router.navigate(['/app/community/post'], { queryParams: { id: this.blogId() } });
  }

  goBack() {
    this.location.back();
  }

}
