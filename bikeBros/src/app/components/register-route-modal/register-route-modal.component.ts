import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { RoutesService } from 'src/app/services/routes.service';

// Declaramos una variable global para hacer uso de los servicios de Google
declare let google: any;

@Component({
  selector: 'app-register-route-modal',
  templateUrl: './register-route-modal.component.html',
  styleUrls: ['./register-route-modal.component.scss'],
})
export class RegisterRouteModalComponent implements OnInit {
  // Nuestro formulario de registro
  routeForm: FormGroup;
  // Consulta del Origen
  queryOrigin: string;

  queryDestination: string;

  destinationPlaces: boolean = false;

  originPlaces: boolean = false;

  origins: any = [];

  destinations: any = [];

  destination: string;

  origin: string;

  selectedOrigin: any;

  selectedDestination: any;

  author: string;

  constructor(
    private formBuilder: FormBuilder,
    private routeService: RoutesService,
    private modalController: ModalController,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      difficulty_level: ['', Validators.required],
      distance: [0, Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      imageURL: [''],
    });
  }

  async submitForm() {
    // Desestructuraramos los valores que nos llevan a través del formulario
    const {
      name,
      difficulty_level,
      distance,
      location,
      description,
      origin,
      destination,
      imageURL,
    } = this.routeForm.value;

    const originForm = this.origin;
    const destinationForm = this.destination;
    const author = this.auth.getProfileId();
    console.log(`Origen: ${originForm}, destino: ${destinationForm}`);

    this.routeService
      .register(
        name,
        difficulty_level,
        distance,
        location,
        description,
        originForm,
        destinationForm,
        imageURL,
        await author
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    // OBLIGATORIO HACER LA LLAMADA A SUSCRIBE

    // this.routeService.register2()
    // this.modalController.dismiss()

    // Aquí puedes enviar el nuevo registro al servidor
    await this.modalController.dismiss();
    this.router.navigate([`/main/create-route`]);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  //Busqueda con Places
  onSearchInput() {
    if (this.origin.length > 0) {
      this.query(this.origin, true);
    }
  }
  // Metodo que establece
  onPlaceSelect(place: any) {
    this.select(place, true);
  }

  onSearchDestination() {
    if (this.destination.length > 0) {
      this.query(this.destination, false);
    }
  }

  onDestinationSelect(place: any) {
    this.select(place, false);
  }

  query(queryInput: string, isOrigin: boolean) {
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: queryInput,
        componentRestrictions: {
          country: 'es',
        },
      },
      (predictions: any) => {
        if (isOrigin) {
          this.origins = predictions;
          this.originPlaces = true;
        } else {
          this.destinations = predictions;
          this.destinationPlaces = true;
        }
      }
    );
  }

  select(place: any, isOrigin: boolean) {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    service.getDetails({ placeId: place.place_id }, (result: any) => {
      //Aqui se asigna el valor marcado de las sugerencias al valor de origin
      if (isOrigin) {
        this.origin = result.formatted_address;
        // this.selectedOrigin = result.formatted_address;
        this.origins = [];
        this.originPlaces = false;
      } else {
        this.destination = result.formatted_address;
        this.destinations = [];
        this.destinationPlaces = false;
      }
    });
  }
}
