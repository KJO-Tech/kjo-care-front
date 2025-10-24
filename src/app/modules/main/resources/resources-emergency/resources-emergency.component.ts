import { Component, inject } from '@angular/core';
import { EmergencyResourceService } from '../../../../core/services/emergency-resource.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'resources-emergency',
  templateUrl: './resources-emergency.component.html',
  imports: []
})
export default class ResourcesEmergencyComponent {

  private resourcesService = inject(EmergencyResourceService)

  resources = rxResource({
    loader: () => this.resourcesService.getAllActive().pipe(
      map(response => response.result)
    )
  })

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  reload() {
    this.resources.reload();
  }
}
