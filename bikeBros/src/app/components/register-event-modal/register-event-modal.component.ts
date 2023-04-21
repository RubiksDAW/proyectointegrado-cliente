import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
    private events: EventService
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
      maxParticipantes: ['', Validators.required],
    });
  }

  async onSubmit() {
    const { rutaId, fecha, maxParticipantes } = this.eventForm.value;

    const creador = await this.auth.getProfileId();

    this.events
      .register(rutaId, fecha, [], maxParticipantes, creador)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
