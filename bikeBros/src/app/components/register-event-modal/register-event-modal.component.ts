import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { Route } from 'src/app/interfaces/route.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-register-event-modal',
  templateUrl: './register-event-modal.component.html',
  styleUrls: ['./register-event-modal.component.scss'],
})
export class RegisterEventModalComponent implements OnInit {
  eventForm: FormGroup;
  routes$: Observable<Route[]>;
  constructor(
    private formBuilder: FormBuilder,
    private routes: RoutesService,
    private modalController: ModalController,
    private auth: AuthService,
    private events: EventService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.routes$ = this.routes.getAllRoutes().pipe(
      map((res) => {
        // Aqui podemos aplicar logica para modificar el array de objetos que nos llega

        // Aqui debemos seguir devolviendo un array de rutas, ya que el observable es lo que espera
        return res;
      })
    );

    this.eventForm = this.formBuilder.group({
      rutaId: ['', Validators.required],
      fecha: ['', Validators.required],
      ubicacion: ['', Validators.required],
      maxParticipantes: ['', Validators.required],
    });
  }

  // async onSubmit() {
  //   const { rutaId, fecha, maxParticipantes } = this.eventForm.value;

  //   const creador = await this.auth.getProfileId();

  //   this.events
  //     .register(rutaId, fecha, [], maxParticipantes, creador)
  //     .subscribe({
  //       next: (res) => {
  //         console.log(res);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });

  //   this.closeModal();
  // }
  async onSubmit() {
    const { rutaId, fecha, ubicacion, maxParticipantes } = this.eventForm.value;
    const creador = await this.auth.getProfileId();

    const fechaValida = await this.fechaValida();
    if (fechaValida?.fechaInvalida) {
      return;
    }

    this.events
      .register(rutaId, fecha, [], ubicacion, maxParticipantes, creador)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });

    this.closeModal();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  // Con este metodo controlamos que el usuario no establezca una fecha para el evento
  // anterior a la fecha actual.
  async fechaValida() {
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(this.eventForm.controls['fecha'].value);

    if (fechaSeleccionada < fechaActual) {
      const alert = await this.alertController.create({
        header: 'Fecha incorrecta',
        message: 'No puedes establecer una fecha anterior al día de hoy',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
          },
        ],
      });

      await alert.present();
      return { fechaInvalida: true };
    }

    return null;
  }
}
