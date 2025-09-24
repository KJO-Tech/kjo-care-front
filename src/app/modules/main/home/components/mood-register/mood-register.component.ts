import { Component, inject, resource, signal } from '@angular/core';
import { MoodStateService } from '../../../../../core/services/mood-tracking.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

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
    loader: () => this.moodService.getAllMoods()
  });

  moodSelected = signal<number>(0);

  selectMood(id: number) {
    if (this.moodSelected() === id) {
      this.moodSelected.set(0);
    } else {
      this.moodSelected.set(id);
    }
  }

  redirectToMoodRegister() {
    if (this.moodSelected() !== 0) {
      this.router.navigate(['/app/mood'], { queryParams: { moodId: this.moodSelected() } });
    }
  }

  reload() {
    this.moods.reload();
  }

}
