import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodStateService } from '../../../../core/services/mood-tracking.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgClass } from '@angular/common';
import { MoodTrackingUserService } from '../../../../core/services/mood-user.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'mood-register',
  imports: [
    NgClass
  ],
  templateUrl: './mood-register.component.html'
})
export default class MoodRegisterComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private moodService = inject(MoodStateService);
  private moodUserService = inject(MoodTrackingUserService);
  private toastService = inject(ToastService);

  moods = rxResource({
    loader: () => {
      return this.moodService.getAllMoods().pipe(
        map((response) => response.result)
      );
    }
  });

  moodsContent = computed(() => {
    let moods = this.moods.value()?.content ?? []
    return moods.filter(mood => mood.isActive).sort((a, b) => (b.value || 0) - (a.value || 0))
  })

  moodId = signal<string>('');
  moodSelected = signal<string>('');
  moodDescription = signal<string>('');

  isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.route.queryParamMap.subscribe(params => {
        this.moodId.set(params.get('moodId') ?? '');
      });

      if (this.moodId() !== '') {
        this.moodSelected.set(this.moodId());
      }
    });
  }

  selectMood(id: string) {
    if (this.moodSelected() === id) {
      this.moodSelected.set('');
    } else {
      this.moodSelected.set(id);
    }
  }

  saveMyMood() {
    if (this.moodSelected() !== '') {
      this.isLoading.set(true);

      this.moodUserService.saveMyMood(this.moodSelected(), this.moodDescription()).subscribe({
        next: response => {
          if (response.success) {
            this.router.navigate(['/app/mood/recorded']);
          } else {
            this.toastService.addToast({
              message: response.message,
              type: 'error',
              duration: 5000
            });
          }
        },
        error: () => {
          this.toastService.addToast({
            message: 'Error al guardar el estado de animo',
            type: 'error',
            duration: 5000
          });
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  reload() {
    this.moods.reload();
  }
}
