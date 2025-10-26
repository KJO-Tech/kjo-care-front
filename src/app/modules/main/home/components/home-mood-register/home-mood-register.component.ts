import { Component, computed, inject, signal } from '@angular/core';
import { MoodStateService } from '../../../../../core/services/mood-tracking.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'home-mood-register',
  imports: [
    NgClass
  ],
  templateUrl: './home-mood-register.component.html'
})
export class HomeMoodRegisterComponent {

  router = inject(Router);
  moodService = inject(MoodStateService);

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

  moodSelected = signal<string>('');

  selectMood(id: string) {
    if (this.moodSelected() === id) {
      this.moodSelected.set('');
    } else {
      this.moodSelected.set(id);
    }
  }

  redirectToMoodRegister() {
    if (this.moodSelected() !== '') {
      this.router.navigate(['/app/mood'], { queryParams: { moodId: this.moodSelected() } });
    }
  }

  reload() {
    this.moods.reload();
  }

}
