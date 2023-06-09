import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventResponse } from 'src/app/interfaces/event.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: any;
  currentEvent: EventResponse;
  assist: boolean;
  showParticipants = false;

  constructor(
    private event: EventService,
    private auth: AuthService,
    private router: Router,
    public alertController: AlertController // Agregar el servicio AlertController aquí
  ) {}

  async ngOnInit() {
    this.id = localStorage.getItem('id-event');
    const userNick = localStorage.getItem('nick');

    this.event.getEventById(this.id).subscribe(
      async (data) => {
        this.currentEvent = data;
        // Guardaremos en esta variable assists el participante, si coincide el nick del usuario logeado entre
        // los participantes del evento. En caso de que exista la variable assist cambiara o no su estado.
        // Esto es para que el boton de la pagina del evento se muestre de una forma u otra
        const assists = this.currentEvent.participantes?.find(
          (p) => p.nick === userNick
        );
        if (assists) {
          this.assist = true;
        } else {
          this.assist = false;
        }
        console.log(this.currentEvent);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ionViewDidEnter() {
    // this.ngOnInit();
    this.event.getEventById(this.id).subscribe(
      async (data) => {
        this.currentEvent = data;
        console.log(this.currentEvent);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // async checkAssist() {
  //   const eventId = this.id;
  //   const userId = this.auth.getProfileId();
  //   this.event.checkUserParticipation(eventId, await userId);
  // }
  async joinEvent() {
    const eventId = this.id;
    const userId = await this.auth.getProfileId();

    try {
      this.event.registerUser(eventId, userId);

      this.assist = true;
      await this.router.navigate(['/main/create-route']);

      const alert = await this.alertController.create({
        header: '¡Te has registrado correctamente!',
        message: 'Ahora eres un participante del evento.',
        buttons: ['OK'],
      });

      await alert.present();
    } catch (error) {
      this.assist = false;
    }
  }

  async leftEvent() {
    const eventId = this.id;
    const userId = await this.auth.getProfileId();

    this.event.unregisterUser(eventId, userId);
    this.assist = false;
    await this.router.navigate(['/main/create-route']);

    const alert = await this.alertController.create({
      header: '¡Te has desregistrado correctamente!',
      message: 'Ya no eres un participante del evento.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  toggleParticipants() {
    this.showParticipants = !this.showParticipants;
  }

  setIdUser(id: string) {
    localStorage.setItem('id-public-user', id);
    console.log(id);
  }
  checkUser(id: string) {
    this.router.navigate([`/public-profile/${id}`]);
  }
}
