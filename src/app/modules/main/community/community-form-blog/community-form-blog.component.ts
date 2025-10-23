import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { Category, Status } from '../../../../core/models/blog';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, NEVER, tap } from 'rxjs';

@Component({
  selector: 'community-form-blog',
  templateUrl: './community-form-blog.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass
  ]
})
export default class CommunityFormBlogComponent {

  protected readonly Status = Status;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  formUtils = FormUtils;

  _categories = rxResource({
    loader: () => this.categoryService.findAll().pipe(
      map(response => response.result)
    )
  });

  blog = rxResource({
    request: () => this.blogId(),
    loader: ({ request }) => {
      if (request !== '') {
        return this.blogService.getById(request).pipe(
          map(response => response.result),
          tap(blog => {
            this.blogForm.patchValue({
              title: blog.blog.title,
              content: blog.blog.content,
              categoryId: blog.blog.category?.id
            });
          })
        );
      } else return NEVER;
    }
  });

  title = signal('Añadir nuevo post');
  nameButton = signal('Guardar');

  blogId = signal<string>('');
  isLoading = signal(false);

  categories = computed<Category[]>(() => {
    return this._categories.value() ?? [];
  });


  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(5)]],
    image: [null],
    video: [null],
    categoryId: [0, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    effect(() => {
      this.route.queryParamMap.subscribe(params => {
        let id = params.get('id') ?? '';
        if (id !== '') {
          this.blogId.set(id);
          this.title.set('Editar post');
          this.nameButton.set('Actualizar');
        }
      });
    });
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      console.log('Form invalid');
      return;
    }

    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);

    const image = this.blogForm.get('image')?.value;
    const video = this.blogForm.get('video')?.value;

    if (image instanceof File) {
      formData.append('image', image);
    }
    if (video instanceof File) {
      formData.append('video', video);
    }
    formData.append('categoryId', this.blogForm.value.categoryId);

    if (this.blogId() !== '' && !this.blog.error()) {
      return this.blogService.update(formData, this.blogId()).pipe()
        .subscribe({
          next: () => {
            this.toastService.addToast({
              message: 'Post actualizado con éxito',
              type: 'success',
              duration: 4000
            });

            this.router.navigate(['/app/community/post', this.blogId()]);
          },
          error: (error) => {
            this.toastService.addToast({
              message: 'Error actualizando el post',
              type: 'error',
              duration: 4000
            });
          },
          complete: () => {
            this.isLoading.set(false);
          }
        });
    } else {
      return this.blogService.create(formData).pipe()
        .subscribe({
          next: (response) => {
            this.router.navigate(['/app/community/success'], {
              queryParams: { id: response.result.id }
            });
          },
          error: (error) => {
            this.toastService.addToast({
              message: 'Error creando el post',
              type: 'error',
              duration: 4000
            });
          },
          complete: () => {
            this.isLoading.set(false);
          }
        });
    }
  }

  onFileChange(event: Event, field: 'image' | 'video') {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.blogForm.patchValue({
        [field]: file
      });
      this.blogForm.get(field)?.updateValueAndValidity();
    }
  }
}
