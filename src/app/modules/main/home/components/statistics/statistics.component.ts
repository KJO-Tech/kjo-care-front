import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmergencyResourceService } from '../../../../../core/services/emergency-resource.service';

@Component({
  selector: 'home-statistics',
  imports: [],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent {
  resourceService = inject(EmergencyResourceService);

  stats = rxResource({
    loader: () => this.resourceService.getStats()
  });

  reload() {
    this.stats.reload();
  }

}
