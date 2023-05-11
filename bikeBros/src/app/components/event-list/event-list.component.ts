import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
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

  searchTerm: string;
  authorEventId: string;
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
        console.log(this.currentUser.id);
        this.roles = this.currentUser.roles;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.events$ = this.http.get<EventResponse[]>(
      // 'http://localhost:3300/api/getAllEvents'
      'https://bikebrosv2.herokuapp.com/api/getAllEvents'
    );
    this.events$.subscribe({
      next: (events) => {
        console.log(events);
      },
      error: (err) => {
        console.log(err);
      },
    });

    console.log(this.events$);
  }

  ionViewDidEnter() {
    location.reload();
    this.events$ = this.http.get<EventResponse[]>(
      // 'http://localhost:3300/api/getAllEvents'
      'https://bikebrosv2.herokuapp.com/api/getAllEvents'
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
    console.log(authorEventId);
    // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
    if (
      this.currentUser.roles.includes('ROLE_ADMIN') ||
      this.currentUser.id == authorEventId
    ) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Estás seguro de que quieres borrar este evento?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.eventService.deleteEvent(id);
              this.router.navigateByUrl('/deleted-event');
            },
          },
        ],
      });

      await alert.present();
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

  searchEvents() {
    this.events$ = this.eventService.getAllEvents(this.searchTerm).pipe(
      map((res) => {
        // Aquí podemos aplicar lógica para modificar el array de objetos que nos llega
        console.log(res);
        // Aquí debemos seguir devolviendo un array de rutas, ya que el observable es lo que espera
        return res;
      })
    );

    console.log(this.events$);
  }
}
