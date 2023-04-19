import { Component, OnInit } from '@angular/core';
import { EventResponse } from 'src/app/interfaces/event.interface';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: any;
  currentEvent: EventResponse;

  constructor(private event: EventService) {}

  ngOnInit() {
    this.id = localStorage.getItem('id-event');
    this.event.getEventById(this.id).subscribe(
      (data) => {
        this.currentEvent = data;
        console.log(this.currentEvent);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
