import { Component, inject } from '@angular/core';
import { EmergencyResourceService } from '../../../../core/services/emergency-resource.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'resource-stats',
  templateUrl: './resource-stats.component.html',
  imports: []
})
export class ResourceStatsComponent {

  resourceService = inject(EmergencyResourceService);
  toastService = inject(ToastService);

  stats = rxResource({
    loader: () => this.resourceService.getStats().pipe(
      map((response) => response.result)
    )
  });

  reload() {
    this.stats.reload();
  }

}
