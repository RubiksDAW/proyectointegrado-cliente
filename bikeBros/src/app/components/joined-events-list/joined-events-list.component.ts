import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { EditEventModalComponent } from '../edit-event-modal/edit-event-modal.component';

@Component({
  selector: 'app-joined-events-list',
  templateUrl: './joined-events-list.component.html',
  styleUrls: ['./joined-events-list.component.scss'],
})
export class JoinedEventsListComponent implements OnInit {
  events: any[];
  currentUser: any;
  roles: string[];
  subscription: Subscription;
  userId: string;
  constructor(
    private eventsSer: EventService,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private modal: ModalController
  ) {}

  async ngOnInit() {
    this.userId = await this.auth.getProfileId();
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

    this.getEventsJoined();
    this.subscription = this.eventsSer.refresh$.subscribe(() => {
      this.getEventsJoined();
    });
  }

  setIdEvent(id: string) {
    localStorage.setItem('id-event', id);
    console.log(id);
  }

  checkEvent(id: string) {
    this.router.navigate([`/event/${id}`]);
  }

  async deleteEvent(id: string) {
    const authorEventId = await this.eventsSer.getEventAuthorId(id);
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
              this.eventsSer.deleteEvent(id).subscribe((data: any) => {
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
  async showEventEditModal() {
    console.log('ey');
    const modal = await this.modal.create({
      component: EditEventModalComponent,
    });
    return await modal.present();
  }

  getEventsJoined(): void {
    console.log(this.userId);
    this.eventsSer.getEventsJoined(this.userId).subscribe((data: any) => {
      this.events = data;
      console.log(data);
    });
  }

  async closeModal() {
    await this.modal.dismiss();
  }
}
