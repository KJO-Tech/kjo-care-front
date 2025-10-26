import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MoodStateService } from '../../../../core/services/mood-tracking.service';
import { MoodTrackingUserService } from '../../../../core/services/mood-user.service';
import { Router } from '@angular/router';
import { formatDateToISO8601 } from '../../../../shared/utils/date';

@Component({
  selector: 'mood-history',
  templateUrl: './mood-history.component.html',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export default class MoodHistoryComponent {
  private router = inject(Router);

  private moodUserService = inject(MoodTrackingUserService);

  moods = rxResource({
    loader: () => {
      return this.moodUserService.getMyMoods().pipe(
        map((response) => response.result)
      );
    }
  });

  registerMood() {
    this.router.navigate(['/app/mood/register']);
  }

  reload() {
    this.moods.reload();
  }

  protected readonly formatDateToISO8601 = formatDateToISO8601;
}
