import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventResponse } from 'src/app/interfaces/event.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  events$: Observable<EventResponse[]>;
  currentUser: any;
  constructor(
    private eventService: EventService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.currentUser = response;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.events$ = this.http.get<EventResponse[]>(
      'https://bikebrosv2.herokuapp.com/api/getAllEvents'
    );

    console.log(this.events$);
  }
  // Habiendo guardado el usuario actual en el current user podemos obtener la id para pasarla como parametro
  // al metodo que crearemos para apuntar usuarios a un evento, al igual que al de desapuntarlos.
  printId() {
    console.log(this.currentUser.id);
  }

  setIdEvent(id: string) {
    localStorage.setItem('id-event', id);
    console.log(id);
  }
  checkEvent(id: string) {
    this.router.navigate([`/event/${id}`]);
  }

  editEvent(event: Event) {
    // implementa la lógica para editar un evento
  }

  deleteEvent(event: Event) {
    // implementa la lógica para eliminar un evento
  }
}
