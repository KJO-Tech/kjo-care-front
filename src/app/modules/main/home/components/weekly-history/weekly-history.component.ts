import { Component, computed, inject, input } from '@angular/core';
import { MoodTrackingUserService } from '../../../../../core/services/mood-user.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Content } from '../../../../../core/models/mood.model';
import { CommonModule } from '@angular/common';
import { formatDateToISO8601 } from '../../../../../shared/utils/date';

interface WeeklyMoodEntry {
  day: string;
  date: Date;
  mood: Content;
}

@Component({
  selector: 'mood-weekly-history',
  imports: [CommonModule],
  templateUrl: './weekly-history.component.html'
})
export class WeeklyHistoryComponent {

  private moodUserService = inject(MoodTrackingUserService);

  withDetails = input<boolean>(false);

  moods = rxResource({
    loader: () => {
      return this.moodUserService.getMyMoods().pipe(
        map((response) => response.result)
      );
    }
  });

  weeklyHistory = computed(() => {
    const moods = this.moods.value();
    if (!moods) {
      return [];
    }

    const today = new Date();
    const currentDay = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Calculate days to subtract to get to Monday

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const weeklyData: WeeklyMoodEntry[] = [];
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);

      const moodsForDay = moods.filter((moodEntry: any) => {
        const moodDate = new Date(formatDateToISO8601(moodEntry.recordedDate)); // Assuming createdAt is a valid date string
        return moodDate.toDateString() === currentDate.toDateString();
      });

      let dominantMood: Content = {
        id: '',
        name: '',
        image: 'https://d14ti7ztt9zv5f.cloudfront.net/emojis/Apple/Ghost-on-Apple-iOS-13.3/Ghost-on-Apple-iOS-13.3.png',
        color: '#CCCCCC',
        description: '',
        state: '',
        isActive: true,
        value: 0
      };

      if (moodsForDay.length > 0) {
        const moodCounts: { [key: string]: { count: number; mood: Content } } = {};
        moodsForDay.forEach((moodEntry: any) => {
          const moodId = moodEntry.mood.id;
          if (!moodCounts[moodId]) {
            moodCounts[moodId] = { count: 0, mood: moodEntry.mood };
          }
          moodCounts[moodId].count++;
        });

        let maxCount = 0;
        let dominantMoodId = '';
        for (const moodId in moodCounts) {
          if (moodCounts[moodId].count > maxCount) {
            maxCount = moodCounts[moodId].count;
            dominantMoodId = moodId;
          }
        }
        if (dominantMoodId) {
          dominantMood = moodCounts[dominantMoodId].mood;
        }
      }

      weeklyData.push({
        day: dayNames[currentDate.getDay()],
        date: currentDate,
        mood: dominantMood
      });
    }

    return weeklyData;
  });

  stats = computed(() => {
    const history = this.weeklyHistory();
    const moods = this.moods.value();

    // 1. Registered Days
    const registeredEntries = history.filter(entry => entry.mood && entry.mood.id !== '');
    const registeredDays = registeredEntries.length;

    if (registeredDays === 0) {
      return { average: 0, registeredDays: 0, improvement: 0 };
    }

    // 2. Weekly Average
    const weeklyAverage = registeredEntries.reduce((acc, entry) => acc + (entry.mood.value || 0), 0) / registeredDays;

    // 3. Improvement vs. Previous Week
    if (!moods) {
      return { average: weeklyAverage, registeredDays, improvement: 0 };
    }

    const today = new Date();
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const lastWeekMonday = new Date(today);
    lastWeekMonday.setDate(today.getDate() + diffToMonday - 7);
    lastWeekMonday.setHours(0, 0, 0, 0);
    const lastWeekSunday = new Date(lastWeekMonday);
    lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);
    lastWeekSunday.setHours(23, 59, 59, 999);

    const lastWeekMoods = moods.filter((moodEntry: any) => {
      const moodDate = new Date(formatDateToISO8601(moodEntry.recordedDate));
      return moodDate >= lastWeekMonday && moodDate <= lastWeekSunday;
    });

    let previousWeekAverage = 0;
    if (lastWeekMoods.length > 0) {
      const lastWeekDaysWithMoods = [...new Set(lastWeekMoods.map((m: any) => new Date(m.recordedDate).toDateString()))];
      const lastWeekRegisteredDays = lastWeekDaysWithMoods.length;

      if (lastWeekRegisteredDays > 0) {
        const lastWeekTotalValue = lastWeekMoods.reduce((acc: number, entry: any) => acc + (entry.mood.value || 0), 0);
        previousWeekAverage = lastWeekTotalValue / lastWeekRegisteredDays;
      }
    }

    let improvement = 0;
    if (previousWeekAverage > 0) {
      improvement = ((weeklyAverage - previousWeekAverage) / previousWeekAverage) * 100;
    } else if (weeklyAverage > 0) {
      improvement = 100;
    }

    return {
      average: weeklyAverage,
      registeredDays,
      improvement
    };
  });


  reload() {
    this.moods.reload();
  }
}
