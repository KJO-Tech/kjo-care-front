import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { ModalOpenButtonComponent } from '../../../shared/components/modal-open-button/modal-open-button.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ActivityCategoryService } from '../../../core/services/activity-category.service';
import { ActivityCategory } from '../../../core/models/activity.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ActivityCategoryModalComponent } from './acivity-category-modal/activity-category-modal.component';


@Component({
  selector: 'app-activity-categories',
  standalone: true,
  template: `
    <div class="flex justify-between items-center gap-2 flex-wrap mb-3 p-2">
      <h1 class="sm:text-2xl text-xl font-bold">Actividades</h1>
      <modal-open-button
        modalName="modal_activity_category"
        [classes]="'btn-primary'"
        (click)="openCreateModal()"
      >
        Agregar Categoría
      </modal-open-button>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Icono</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
          @if (categories.isLoading()) {
            <tr>
              <td colspan="2">
                <div class="flex justify-center p-4">
                  <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
              </td>
            </tr>
          } @else if (categories.error()) {
            <tr>
              <td colspan="2">
                <div class="alert alert-error mt-4">
                  <i class="material-symbols-outlined !text-xl">error</i>
                  <span>Ocurrió un error al cargar las categorías. Por favor intenta de nuevo.</span>
                  <button class="btn btn-sm btn-outline hover:btn-error" (click)="reload()">
                    <i class="material-symbols-outlined !text-xl">refresh</i>
                  </button>
                </div>
              </td>
            </tr>
          } @else {
            @for (category of categories.value() ?? []; track category.id) {
              <tr class="hover:bg-base-200">
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>
                <td>{{ category.imageUrl }}</td>
                <td class="flex items-center gap-1">
                  <modal-open-button
                    [modalName]="'modal_activity_category'"
                    [type]="'icon'"
                    (click)="openEditModal(category)"
                  >
                    <i class="material-symbols-outlined !text-xl">edit_square</i>
                  </modal-open-button>

                  <modal-open-button
                    [modalName]="'modal_activity_category_delete'"
                    [type]="'icon'"
                    (click)="deleteCategory(category)"
                  >
                    <i class="material-symbols-outlined !text-xl">delete</i>
                  </modal-open-button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="2" class="text-center">
                  <p>No se encontraron categorías.</p>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>

    <app-category-modal (close)="reload()" [category]="selectedCategory()"
                        (reload)="reload()"></app-category-modal>

    <app-dialog
      [title]="'Delete activity category'"
      [message]="'Are you sure you want to delete this activity category?'"
      [modalName]="'modal_activity_category_delete'"
      [buttonText]="'Delete'"
      (callback)="deleteConfirmed()"
    ></app-dialog>

  `,
  imports: [
    ReactiveFormsModule,
    ActivityCategoryModalComponent,
    ModalOpenButtonComponent,
    DialogComponent
  ]
})
export default class ActivityCategoryComponent {
  private categoryService = inject(ActivityCategoryService);
  private toastService = inject(ToastService);

  categories = rxResource({
    loader: () => this.categoryService.getCategories().pipe(
      map((res) => res.result)
    )
  });
  selectedCategory = signal<ActivityCategory | null>(null);

  reload() {
    this.categories.reload();
  }

  openCreateModal() {
    this.selectedCategory.set(null);
  }

  openEditModal(category: ActivityCategory) {
    this.selectedCategory.set(category);
  }

  deleteCategory(category: ActivityCategory) {
    this.selectedCategory.set(category);
  }

  deleteConfirmed() {
    this.categoryService.deleteCategory(this.selectedCategory()?.id!!).subscribe({
      next: () => {
        this.toastService.addToast({ message: 'Categoría eliminada correctamente', type: 'success', duration: 4000 });
        this.reload();
      },
      error: (err) => {
        this.toastService.addToast({ message: 'Error al eliminar la categoría', type: 'error', duration: 4000 });
      }
    });
  }
}
