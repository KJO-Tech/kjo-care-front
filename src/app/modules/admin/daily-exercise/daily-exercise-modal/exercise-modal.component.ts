import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DailyExerciseService } from '../../../../core/services/daily-exercise.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ActivityCategoryService } from '../../../../core/services/activity-category.service';
import {
  ActivityCategory,
  DailyExerciseRequest,
  DailyExerciseResponse,
  ExerciseContentType,
  ExerciseDifficultyType
} from '../../../../core/models/activity.model';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-exercise-modal',
  standalone: true,
  template: `
    <dialog id="modal_exercise" class="modal">
      <div class="modal-box max-h-11/12">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <i class="material-icons-outlined !text-xl">close</i>
          </button>
        </form>

        <h2 class="text-lg font-semibold">{{ title() }}</h2>

        <form [formGroup]="exerciseForm" (ngSubmit)="onSubmit()">

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Tipo de contenido</legend>
            <select
              class="select validator w-full"
              formControlName="category"
              required
            >
              <option value="" disabled>Seleccione</option>
              @for (category of categories(); track category) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
            <p class="validator-hint hidden">
              Por favor seleccione una categoría
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Título</legend>
            <input
              type="text"
              class="input validator w-full"
              formControlName="title"
              placeholder="Título"
              required
              autocomplete="off"
            />
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'title') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Descripción</legend>
            <textarea
              class="textarea validator w-full"
              formControlName="description"
              placeholder="Descripción"
              required
              autocomplete="off"
            ></textarea>
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'description') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Tipo de contenido</legend>
            <select
              class="select validator w-full"
              formControlName="contentType"
              required
            >
              @for (type of Object.values(ExerciseContentType); track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'contentType') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Dificultad</legend>
            <select
              class="select validator w-full"
              formControlName="difficulty"
              required
            >
              @for (type of Object.values(ExerciseDifficultyType); track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'difficulty') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Duración</legend>
            <input
              type="number"
              class="input validator w-full"
              formControlName="duration"
              placeholder="Url del contenido"
              autocomplete="off"
            />
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'duration') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Url del contenido</legend>
            <input
              type="url"
              class="input validator w-full"
              formControlName="contentUrl"
              placeholder="Url del contenido"
              autocomplete="off"
            />
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'contentUrl') }}
            </p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Url del thumbnail</legend>
            <input
              type="url"
              class="input validator w-full"
              formControlName="thumbnailUrl"
              placeholder="Url del thumbnail"
              autocomplete="off"
            />
            <p class="validator-hint hidden">
              {{ FormUtils.getFieldError(exerciseForm, 'thumbnailUrl') }}
            </p>
          </fieldset>

          <div class="modal-action mt-4">
            <form method="dialog" class="space-x-2">
              <button class="btn">Cerrar</button>

              <button
                class="btn btn-primary"
                [disabled]="exerciseForm.invalid"
                (click)="onSubmit()"
                type="submit"
              >
                {{ nameButton() }}
              </button>
            </form>

          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  `,
  imports: [
    ReactiveFormsModule
  ]
})
export class ExerciseModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private exerciseService = inject(DailyExerciseService);
  private toastService = inject(ToastService);
  private categoryService = inject(ActivityCategoryService);

  categories = signal<ActivityCategory[]>([]);

  exercise = input<DailyExerciseResponse | null>(null);
  title = computed(() => this.exercise() ? 'Editar Ejercicio' : 'Nuevo Ejercicio');
  nameButton = computed(() => this.exercise() ? 'Actualizar' : 'Guardar');

  close = output();

  exerciseForm = this.fb.group({
    category: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    duration: [0, [Validators.required, Validators.min(1)]],
    contentUrl: [''],
    contentType: [ExerciseContentType.TEXTO, [Validators.required]],
    difficulty: [ExerciseDifficultyType.PRINCIPIANTE, [Validators.required]],
    thumbnailUrl: ['']
  });

  constructor() {
    effect(() => {
      this.exerciseForm.reset();
      this.exerciseForm.clearValidators();
      this.exerciseForm.markAsUntouched();

      if (this.exercise()) {
        this.exerciseForm.patchValue({
          title: this.exercise()?.title,
          description: this.exercise()?.description,
          contentType: this.exercise()?.contentType,
          contentUrl: this.exercise()?.contentUrl,
          thumbnailUrl: this.exercise()?.thumbnailUrl,
          category: this.exercise()?.categoryId,
          difficulty: this.exercise()?.difficulty
        });
      }
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories.result);
      },
      error: () => {
        this.toastService.addToast({
          message: 'Hubo un error al cargar las categorías',
          type: 'success',
          duration: 4000
        });
      }
    });
  }

  onSubmit() {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      console.log('Formulario inválido');
      return;
    }

    const exercise: DailyExerciseRequest = {
      categoryId: this.exerciseForm.value.category!,
      title: this.exerciseForm.value.title!,
      description: this.exerciseForm.value.description!,
      durationMinutes: this.exerciseForm.value.duration!,
      contentType: this.exerciseForm.value.contentType!,
      contentUrl: this.exerciseForm.value.contentUrl!,
      thumbnailUrl: this.exerciseForm.value.thumbnailUrl!,
      difficulty: this.exerciseForm.value.difficulty!
    };

    if (this.exercise()?.id) {
      this.exerciseService.updateExercise(this.exercise()?.id!!, exercise).subscribe({
        next: () => {
          this.toastService.addToast({ message: 'Ejercicio actualizado', type: 'success', duration: 4000 });
          this.exerciseForm.reset();
          this.exerciseForm.clearValidators();
          this.close.emit();
        },
        error: (err) => {
          this.toastService.addToast({ message: 'Error al actualizar', type: 'error', duration: 4000 });
        }
      });
    } else {
      this.exerciseService.createExercise(exercise).subscribe({
        next: (id) => {
          this.toastService.addToast({ message: 'Ejercicio creado', type: 'success', duration: 4000 });
          this.exerciseForm.reset();
          this.exerciseForm.clearValidators();
          this.close.emit();
        },
        error: (err) => {
          this.toastService.addToast({ message: 'Error al crear', type: 'error', duration: 4000 });
        }
      });
    }
  }

  protected readonly Object = Object;
  protected readonly ExerciseContentType = ExerciseContentType;
  protected readonly FormUtils = FormUtils;
  protected readonly ExerciseDifficultyType = ExerciseDifficultyType;
}
