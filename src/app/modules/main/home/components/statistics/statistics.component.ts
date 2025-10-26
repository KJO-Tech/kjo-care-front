import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmergencyResourceService } from '../../../../../core/services/emergency-resource.service';
import { map } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { MoodTrackingUserService } from '../../../../../core/services/mood-user.service';

@Component({
  selector: 'home-statistics',
  imports: [],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent {
  private moodUserService = inject(MoodTrackingUserService);
  analyticsService = inject(AnalyticsService);

  stats = rxResource({
    loader: () => this.analyticsService.getHomeStats()
  });

  moods = rxResource({
    loader: () => {
      return this.moodUserService.getMyMoods().pipe(
        map((response) => response.result)
      );
    }
  });

  countCheckins = computed(() => this.moods.value()?.length ?? 0)

  reload() {
    this.stats.reload();
    this.moods.reload();
  }

}
