import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { DailyExerciseService } from '../../../../../core/services/daily-exercise.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'home-daily-activities',
  templateUrl: './daily-activities.component.html',
  imports: [
    NgClass
  ]
})
export class DailyActivitiesComponent {
  private router = inject(Router);
  private exercisesService = inject(DailyExerciseService);

  activities = rxResource({
    loader: () => this.exercisesService.getMyDailyExercises().pipe(
      map((response) => response.result)
    )
  });

  goToExercise(id: string) {
    this.router.navigate([`/app/exercises/${id}`]);
  }

  reload() {
    this.activities.reload();
  }
}
