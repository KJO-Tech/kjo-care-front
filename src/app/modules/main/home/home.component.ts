import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { HomeMoodRegisterComponent } from './components/home-mood-register/home-mood-register.component';
import { WeeklyHistoryComponent } from './components/weekly-history/weekly-history.component';
import { DailyActivitiesComponent } from './components/daily-activities/daily-activities.component';
import { KeycloakService } from '../../auth/services/keycloak.service';

@Component({
  selector: 'app-home',
  imports: [
    AchievementsComponent,
    StatisticsComponent,
    HomeMoodRegisterComponent,
    WeeklyHistoryComponent,
    DailyActivitiesComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  userService = inject(KeycloakService);

  userName = computed(() => {
    const names = this.userService.profile()?.firstName ?? 'Usuario';
    return names.split(' ')[0];
  });
}
