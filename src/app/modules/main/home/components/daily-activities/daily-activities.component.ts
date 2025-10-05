import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'home-daily-activities',
  imports: [
    NgClass
  ],
  templateUrl: './daily-activities.component.html',
})
export class DailyActivitiesComponent {

  activities = [
    {
      image: "",
      name: "Meditación matutina",
      description: "",
      duration: 10,
      streak: 3,
      isComplete: false
    },
    {
      image: "",
      name: "Ejercicio",
      description: "",
      duration: 30,
      streak: 7,
      isComplete: true
    },
    {
      image: "",
      name: "Lectura",
      description: "",
      duration: 20,
      streak: 0,
      isComplete: false
    }
  ]

}
