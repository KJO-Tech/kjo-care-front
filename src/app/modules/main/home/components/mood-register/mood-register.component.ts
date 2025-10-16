import { Component, inject, signal } from '@angular/core';
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
  templateUrl: './mood-register.component.html'
})
export class MoodRegisterComponent {

  router = inject(Router);
  moodService = inject(MoodStateService);

  moods = rxResource({
    loader: () => {
      return this.moodService.getAllMoods().pipe(
        map((response) => response.result)
      );
    }
  });

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
