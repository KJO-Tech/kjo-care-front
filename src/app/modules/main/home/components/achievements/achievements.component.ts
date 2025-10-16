import { Component, inject } from '@angular/core';
import { EmergencyResourceService } from '../../../../../core/services/emergency-resource.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'home-achievements',
  imports: [],
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent {

  resourceService = inject(EmergencyResourceService);

  stats = rxResource({
    loader: () => this.resourceService.getStats().pipe(
      map(response => response.result)
    )
  });

  reload() {
    this.stats.reload();
  }

}
