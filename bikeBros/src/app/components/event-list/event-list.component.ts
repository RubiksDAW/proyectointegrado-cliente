import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  roles: string[];
  constructor(
    private eventService: EventService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.currentUser = response;
        this.roles = this.currentUser.roles;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.events$ = this.http.get<EventResponse[]>(
      'http://localhost:3300/api/getAllEvents'
      // 'https://bikebrosv2.herokuapp.com/api/getAllEvents'
    );

    console.log(this.events$);
  }

  ionViewDidEnter() {
    this.events$ = this.http.get<EventResponse[]>(
      'http://localhost:3300/api/getAllEvents'
      // 'https://bikebrosv2.herokuapp.com/api/getAllEvents'
    );
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

  async deleteEvent(id: string) {
    const authorEventId = await this.eventService.getEventAuthorId(id);
    // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
    if (
      this.currentUser.roles.includes('ROLE_ADMIN') ||
      this.currentUser.id == authorEventId
    ) {
      this.eventService.deleteEvent(id);
      this.ionViewDidEnter();
    } else {
      const alert = await this.alertController.create({
        header: 'Permiso denegado',
        message: 'Solo el creador o un Administrador pueden borrar el evento',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
          },
        ],
      });

      await alert.present();
    }
  }
}
