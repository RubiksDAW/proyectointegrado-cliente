import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { EditEventModalComponent } from '../edit-event-modal/edit-event-modal.component';
import { ReportEventListComponent } from '../report-event-list/report-event-list.component';
import { ReportEventComponent } from '../report-event/report-event.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  // events$: Observable<Event[]>;
  currentUser: any;

  roles: string[];

  searchTerm: string;

  authorEventId: string;

  startDate: Date;
  endDate: Date;
  events: any[] = [];
  displayedEvents: any[] = [];
  subscription: Subscription;
  constructor(
    private eventService: EventService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private alertController: AlertController,
    private modal: ModalController,
    private loadingController: LoadingController
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

    this.getEvents();
    this.subscription = this.eventService.refresh$.subscribe(() => {
      this.getEvents();
    });
    console.log(this.events);
  }

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
              //Llegados aquí procede a hacer borrado del evento
              this.eventService.deleteEvent(id).subscribe((data: any) => {
                this.events = data;
              });
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

  async getEvents() {
    // await this.showSpinner(); // Mostrar spinner loader

    this.eventService.getAllEvents().subscribe(async (data: any) => {
      console.log(data);
      this.events = data.events;
      this.displayedEvents = this.events.slice(0, 5);
      console.log(this.displayedEvents);

      // await this.hideSpinner(); // Ocultar spinner loader una vez recibidos los datos
    });
  }
  // async getEvents(): Promise<void> {
  //   try {
  //     const loading = await this.loadingController.create({
  //       message: 'Cargando...', // Puedes personalizar el mensaje aquí
  //     });
  //     await loading.present();

  //     this.eventService
  //       .getAllEvents()
  //       .subscribe((data: any) => {
  //         this.events = data.events;
  //         console.log(data.events);
  //         this.totalItems = data.totalEvents;
  //         this.totalPages = data.totalPages;
  //         console.log(data.totalPages);

  //         loading.dismiss(); // Ocultar el spinner cuando se obtienen los datos
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  loadMoreData(event: any): void {
    setTimeout(() => {
      const startIndex = this.displayedEvents.length;
      const endIndex = startIndex + 5;
      const moreEvents = this.events.slice(startIndex, endIndex);
      this.displayedEvents = this.displayedEvents.concat(moreEvents);
      event.target.complete();
    }, 1000);
  }

  async showEventEditModal() {
    const modal = await this.modal.create({
      component: EditEventModalComponent,
    });
    return await modal.present();
  }

  async openReport() {
    const modal = await this.modal.create({
      component: ReportEventComponent,
    });
    return await modal.present();
  }

  async openReportList(id: string) {
    const modal = await this.modal.create({
      component: ReportEventListComponent,
      componentProps: {
        eventId: id, // Reemplaza 'ID_DE_LA_RUTA' con el valor real de la ID de la ruta
      },
    });
    return await modal.present();
  }

  async showSpinner() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }

  async hideSpinner() {
    await this.loadingController.dismiss(); // Ocultar spinner loader
  }
}
