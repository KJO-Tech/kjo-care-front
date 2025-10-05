import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { MoodRegisterComponent } from './components/mood-register/mood-register.component';
import { WeeklyHistoryComponent } from './components/weekly-history/weekly-history.component';
import { DailyActivitiesComponent } from './components/daily-activities/daily-activities.component';

@Component({
  selector: 'app-home',
  imports: [
    AchievementsComponent,
    StatisticsComponent,
    MoodRegisterComponent,
    WeeklyHistoryComponent,
    DailyActivitiesComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {

}
