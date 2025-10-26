import { Component } from '@angular/core';
import { WeeklyHistoryComponent } from '../../home/components/weekly-history/weekly-history.component';

@Component({
  selector: 'mood-summary',
  imports: [
    WeeklyHistoryComponent
  ],
  templateUrl: './mood-summary.component.html'
})
export default class MoodSummaryComponent {
}
