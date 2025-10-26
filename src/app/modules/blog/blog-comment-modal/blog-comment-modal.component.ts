import { Component, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../../core/services/comment.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormUtils } from '../../../shared/utils/form-utils';

@Component({
  selector: 'blog-comment-modal',
  templateUrl: './blog-comment-modal.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class BlogCommentModalComponent {

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  reload = output();

  title = signal('Agregar comentario');
  nameButton = signal('Guardar');

  commentForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor() {
    effect(() => {
      this.title.set('Agregar comentario');
      this.nameButton.set('Guardar');

      if (this.commentService._selectedComment().id.length > 0) {
        this.title.set('Editar comentario');
        this.nameButton.set('Actualizar');

        this.commentForm.patchValue({
          content: this.commentService.selectedComment.content
        });
      }

      if (this.commentService._selectedComment().commentParentId && this.commentService._selectedComment().id.length === 0) {
        this.title.set('Responder comentario');
        this.nameButton.set('Guardar');
        this.commentForm.patchValue({
          content: ''
        });
      }
    });
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      console.log('Form invalid');
      return;
    }

    const request = {
      id: this.commentService.selectedComment.id,
      content: this.commentForm.value.content!,
      blogId: this.commentService.selectedComment.blogId,
      commentParentId: this.commentService.selectedComment.commentParentId
    };

    if (this.commentService.selectedComment.id.length > 0) {
      return this.commentService.update(request, this.commentService.selectedComment.id).pipe()
        .subscribe({
          next: () => {
            this.toastService.addToast({
              message: 'Comentario actualizado con éxito',
              type: 'success',
              duration: 4000
            });

            this.reloadComments();
            this.commentForm.reset();
            this.commentForm.clearValidators();
          },
          error: (error) => {
            this.toastService.addToast({
              message: 'Error al actualizar el comentario',
              type: 'error',
              duration: 4000
            });
          }
        });
    } else {
      return this.commentService.create(request).pipe()
        .subscribe({
          next: () => {
            this.toastService.addToast({
              message: 'Comentario creado con éxito',
              type: 'success',
              duration: 4000
            });

            this.reloadComments();
            this.commentForm.reset();
            this.commentForm.clearValidators();
          },
          error: (error) => {
            this.toastService.addToast({
              message: 'Error al crear el comentario',
              type: 'error',
              duration: 4000
            });
          }
        });
    }
  }

  reloadComments() {
    this.reload.emit();
  }

  protected readonly formUtils = FormUtils;
}
