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
  // private url = 'http://localhost:3300';

  constructor(private http: HttpClient, private router: Router) {}

  getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.url}/api/getAllEvents`);
  }

  // Los metodos que vienen a continuación no han sido probados
  // createEvent(event: EventResponse): Observable<EventResponse> {
  //   return this.http.post<EventResponse>(`${this.url}/api/createEvent`, event);
  // }

  register(
    rutaId: string,
    fecha: Date,
    participantes: string[],
    maxParticipantes: number,
    creador: string
  ) {
    const url = `${this.url}/api/createEvent`;

    return this.http.post(url, {
      ruta: rutaId,
      fecha: fecha,
      participantes: participantes,
      maxParticipantes: maxParticipantes,
      creador: creador,
    });
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
  deleteEvent(id: string) {
    this.http.delete(`${this.url}/api/deleteEvent/${id}`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async getEventAuthorId(id: string) {
    const url = `${this.url}/api/events/id/${id}`;

    try {
      const response = await fetch(url);

      const data = await response.json();
      console.log(data);
      const eventAuthorId = data.creador;
      console.log('Id del creador ' + eventAuthorId);
      return eventAuthorId;
    } catch (error) {
      console.error(error);
    }
  }

  registerUser(eventId: string, userId: string) {
    this.http
      .post(`${this.url}/api/events/register`, { eventId, userId })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  unregisterUser(eventId: string, userId: string) {
    this.http
      .post(`${this.url}/api/events/unregister`, { eventId, userId })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkUserParticipation(eventId: string, userId: string) {
    this.http
      .get(`${this.url}/${eventId}/checkParticipation/${userId}`)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
