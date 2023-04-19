import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventResponse } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url = 'https://bikebrosv2.herokuapp.com';
  constructor(private http: HttpClient, private router: Router) {}

  getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.url}/api/getAllEvents`);
  }

  // Los metodos que vienen a continuación no han sido probados
  createEvent(event: EventResponse): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.url}/api/createEvent`, event);
  }

  updateEvent(event: EventResponse): Observable<EventResponse> {
    return this.http.put<EventResponse>(
      `${this.url}/api/updateEvent/${event._id}`,
      event
    );
  }

  getEventById(id: string) {
    const url = `${this.url}/api/events/id/${id}`;

    return this.http.get<EventResponse>(url);
  }
  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/api/deleteEvent/${id}`);
  }
}
