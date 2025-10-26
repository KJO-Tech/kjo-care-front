import { Component, inject } from '@angular/core';
import { EmergencyResourceService } from '../../../../../core/services/emergency-resource.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';

@Component({
  selector: 'home-achievements',
  imports: [],
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent {

  analyticsService = inject(AnalyticsService);

  stats = rxResource({
    loader: () => this.analyticsService.getSummary()
  });

  reload() {
    this.stats.reload();
  }

}
