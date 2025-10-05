import { Component } from '@angular/core';

@Component({
  selector: 'home-weekly-history',
  imports: [],
  templateUrl: './weekly-history.component.html',
})
export class WeeklyHistoryComponent {

  history = [
    {
      day: "Lunes",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#ff0000",
        value: 1
      },
    },
    {
      day: "Martes",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#00ff00",
        value: 2
      },
    },
    {
      day: "Miércoles",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#0000ff",
        value: 2
      },
    },
    {
      day: "Jueves",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#ff0000",
        value: 3
      },
    },
    {
      day: "Viernes",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#00ff00",
        value: 4
      },
    },
    {
      day: "Sábado",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#0000ff",
        value: 5
      },
    },
    {
      day: "Domingo",
      mood: {
        id: 0,
        name: "",
        image: "",
        color: "#ff0000",
        value: 3
      },
    },
  ]



}
