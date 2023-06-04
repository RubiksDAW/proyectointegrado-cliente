import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Route } from 'src/app/interfaces/route.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.scss'],
})
export class EditEventModalComponent implements OnInit {
  eventForm: FormGroup;
  routes: Route[] = [];
  subscription: Subscription;
  eventId: string;

  constructor(
    private formBuilder: FormBuilder,
    private routeSer: RoutesService,
    private modalController: ModalController,
    private auth: AuthService,
    private events: EventService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getRoutes();
    this.subscription = this.routeSer.refresh$.subscribe(() => {
      this.getRoutes();
    });

    this.eventForm = this.formBuilder.group({
      rutaId: ['', Validators.required],
      fecha: ['', Validators.required],
      ubicacion: ['', [Validators.required]],
      maxParticipantes: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]*$/),
          Validators.max(20),
        ],
      ],
    });

    const idEvent = localStorage.getItem('id-event');

    if (idEvent !== null) {
      this.eventId = idEvent;
    }
    // Actualiza los valores de los controles del formulario eventForm utilizando
    // el método patchValue. Los valores se obtienen del evento recibido y se asignan
    // a los campos correspondientes del formulario.
    this.events.getEventById(this.eventId).subscribe((event) => {
      console.log(event);
      this.eventForm.patchValue({
        rutaId: event.ruta?._id,
        fecha: event.fecha,
        ubicacion: event.ubicacion,
        maxParticipantes: event.maxParticipantes,
      });
    });
  }
  // Recogemos la información a enviar del formulario
  async onSubmit() {
    const eventId = this.eventId;
    const routeId = this.eventForm.controls['rutaId'].value;
    const fecha = this.eventForm.controls['fecha'].value;
    const ubicacion = this.eventForm.controls['ubicacion'].value.trim();
    console.log(ubicacion);
    const maxParticipantes = this.eventForm.controls['maxParticipantes'].value;

    const fechaValida = await this.fechaValida();
    if (fechaValida?.fechaInvalida) {
      return;
    }
    console.log(fecha);

    const eventData = {
      ruta: routeId,
      fecha: fecha,
      ubicacion: ubicacion,
      maxParticipantes: maxParticipantes,
    };
    console.log(eventData);
    this.events.editEvent(eventData, eventId).subscribe(
      (res) => {
        console.log(res);
        this.closeModal();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getRoutes(): void {
    this.routeSer.getAllRoutes().subscribe((data: any) => {
      this.routes = data.routes;
      console.log(this.routes);
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

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
