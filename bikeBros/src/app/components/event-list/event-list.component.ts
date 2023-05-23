import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EventResponse } from 'src/app/interfaces/event.interface';
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

  events: EventResponse[] = [];

  public currentPage: number = 1; // Página actual
  public itemsPerPage: number = 5; // Cantidad de elementos por página
  public totalItems: number = 100; // Total de elementos disponibles
  public isLoading: boolean = false; // Variable para controlar la carga de datos

  subscription: Subscription;
  constructor(
    private eventService: EventService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private alertController: AlertController,
    private modal: ModalController
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

  searchEvents() {
    this.eventService.getAllEvents(this.searchTerm).subscribe((data: any) => {
      this.events = data.events;
      console.log(data);
    });

    // console.log(this.events$);
  }

  getEvents(): void {
    this.eventService.getAllEvents().subscribe((data: any) => {
      this.events = data.events;
      console.log(data);
    });
  }

  loadMoreData(event: any): void {
    console.log('ey');
    console.log(this.events.length);
    console.log(this.totalItems);
    if (!this.isLoading && this.events.length < this.totalItems) {
      console.log(this.searchTerm);
      console.log('ou');
      this.isLoading = true;
      this.currentPage++;
      console.log(this.currentPage);

      // Lógica para obtener más elementos, por ejemplo, haciendo otra solicitud al servicio
      this.eventService
        .getAllEvents(this.searchTerm, this.currentPage, this.itemsPerPage)
        .subscribe((data: any) => {
          // Agregar los nuevos elementos al arreglo existente
          this.events = this.events.concat(data.events);
          console.log(this.events);
          this.isLoading = false;

          // Completar la acción de carga infinita
          event.target.complete();
        });
    } else {
      // Completar la acción de carga infinita si no hay más elementos
      event.target.complete();
    }
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
}
