import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DailyExerciseService } from '../../../core/services/daily-exercise.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { Location, CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  imports: [CommonModule, YouTubePlayerModule, RouterLink] // <-- Módulo actualizado
})
export default class ExercisesComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  private exercisesService = inject(DailyExerciseService);
  private toastService = inject(ToastService);

  activities = rxResource({
    loader: () => this.exercisesService.getMyDailyExercises().pipe(
      map((response) => response.result)
    )
  });

  exerciseId = signal('');

  selectedExercise = computed(() => {
    const exercises = this.activities.value();
    if (!exercises) return undefined;

    return exercises.find(exercise => exercise.id === this.exerciseId());
  });

  youtubeVideoId = computed(() => {
    const exercise = this.selectedExercise();
    if (exercise && exercise.exercise.contentType === 'VIDEO' && exercise.exercise.contentUrl?.includes('youtube.com')) {
      // Extrae el ID de varias URL de YouTube (youtu.be, /embed, ?v=)
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
      const match = exercise.exercise.contentUrl.match(regex);
      return match ? match[1] : null;
    }
    return null;
  });

  // Nueva señal para videos estándar (MP4, etc.)
  isStandardVideo = computed(() => {
    const exercise = this.selectedExercise();
    return exercise && exercise.exercise.contentType === 'VIDEO' && !!exercise.exercise.contentUrl && !this.youtubeVideoId();
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.exerciseId.set(params.get('id') ?? '');
    });
  }

  markAsComplete() {
    this.exercisesService.markAsCompleted(this.exerciseId(), true).subscribe({
      next: () => {
        this.toastService.addToast({
          message: '¡Ejercicio completado con éxito!',
          type: 'success',
          duration: 4000
        });
        this.router.navigate(['/app/home'], { fragment: 'daily-activities' });
      },
      error: () => {
        this.toastService.addToast({
          message: 'Ocurrió un error al marcar el ejercicio como completado.',
          type: 'error',
          duration: 4000
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  reload() {
    this.activities.reload();
  }
}
