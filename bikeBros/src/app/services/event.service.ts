import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, tap } from 'rxjs';
import { EventResponse } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';

  private refreshEvent$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  get refresh$() {
    return this.refreshEvent$;
  }

  getAllEvents(searchTerm?: string): Observable<EventResponse> {
    let query = {};
    if (searchTerm) {
      // Si se proporciona un término de búsqueda, filtrar las rutas por nombre o nivel de dificultad
      query = {
        searchTerm: searchTerm,
      };
    } else {
      query = {};
    }
    return this.http
      .get<EventResponse>(`${this.url}/api/getAllEvents`, { params: query })
      .pipe(map((resp: any) => resp));
  }

  // Los metodos que vienen a continuación no han sido probados
  // createEvent(event: EventResponse): Observable<EventResponse> {
  //   return this.http.post<EventResponse>(`${this.url}/api/createEvent`, event);
  // }

  register(
    rutaId: string,
    fecha: Date,
    participantes: string[],
    ubicacion: string,
    maxParticipantes: number,
    creador: string
  ) {
    const url = `${this.url}/api/createEvent`;

    return this.http
      .post(url, {
        ruta: rutaId,
        fecha: fecha,
        participantes: participantes,
        ubicacion: ubicacion,
        maxParticipantes: maxParticipantes,
        creador: creador,
      })
      .pipe(
        tap(() => {
          this.refreshEvent$.next();
        })
      );
  }

  // updateEvent(event: EventResponse): Observable<EventResponse> {
  //   return this.http.put<EventResponse>(``, event);
  // }
  editEvent(formData: any, id: string) {
    const url = `${this.url}/api/${id}/updateEvent`;
    console.log(formData);
    return this.http.put(url, formData).pipe(
      tap(() => {
        this.refreshEvent$.next();
      })
    );
  }

  getEventById(id: string) {
    const url = `${this.url}/api/events/id/${id}`;

    return this.http.get<EventResponse>(url);
  }
  // deleteEvent(id: string) {
  //   this.http.delete(`${this.url}/api/deleteEvent/${id}`).subscribe(
  //     (response) => {
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  deleteEvent(id: string) {
    const url = `${this.url}/api/deleteEvent/${id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        this.refreshEvent$.next();
      })
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

  getEventsJoined(userId: string) {
    console.log(userId);
    const url = `${this.url}/api/getEventsJoined/${userId}`;
    console.log(url);
    return this.http.get(url).pipe(map((resp: any) => resp));
  }

  registerUser(eventId: string, userId: string) {
    return this.http
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
