import { Component, inject } from '@angular/core';
import { EmergencyResourceService } from '../../../../../core/services/emergency-resource.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'home-achievements',
  imports: [],
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent {

  resourceService = inject(EmergencyResourceService);

  stats = rxResource({
    loader: () => this.resourceService.getStats()
  });

  reload() {
    this.stats.reload();
  }

}
