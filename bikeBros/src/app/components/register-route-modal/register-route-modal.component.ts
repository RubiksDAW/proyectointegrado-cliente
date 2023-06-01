import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar la solicitud de carga de archivos
import { AlertController, ModalController } from '@ionic/angular';
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

  // Variable para almacenar las imágenes seleccionadas
  images: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private routeService: RoutesService,
    private modalController: ModalController,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.routeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      difficulty_level: ['', Validators.required],
      distance: [0, Validators.required],
      location: ['', [Validators.required, Validators.pattern(/^[^0-9]*$/)]],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      images: [null, Validators.required],
    });
  }

  async submitForm() {
    // Desestructuraramos los valores que nos llevan a través del formulario
    const { name, difficulty_level, location, description } =
      this.routeForm.value;

    const originForm = this.origin;
    const destinationForm = this.destination;

    const distance = await this.calcularDistancia(originForm, destinationForm);
    const author = this.auth.getProfileId();
    const distanceKM = distance / 1000;
    const distanceText = distanceKM.toString();
    // Probando a implementar Multer
    const formData = new FormData();

    console.log(distance);
    // Agrega los demás campos al objeto FormData
    formData.append('name', name);
    formData.append('difficulty_level', difficulty_level);
    formData.append('distance', distanceText);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('origin', originForm);
    formData.append('destination', destinationForm);

    // Agrega las imágenes al objeto FormData
    for (let i = 0; i < this.images.length; i++) {
      formData.append('images', this.images[i]);
    }

    formData.append('author', await author);
    console.log(`Origen: ${originForm}, destino: ${destinationForm}`);

    // Validar campos antes de enviar el formulario
    if (
      !name ||
      !difficulty_level ||
      !distance ||
      !location ||
      !description ||
      !originForm ||
      !destinationForm ||
      !this.images.length
    ) {
      const alert = await this.alertController.create({
        header: 'Campos vacíos',
        message:
          'Por favor, complete todos los campos antes de enviar el formulario.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    this.routeService.register(formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });

    await this.modalController.dismiss();
    this.router.navigate(['/success-route']);
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

  onImageChange(event: any) {
    const files = event.target.files;
    this.images = [];

    for (let i = 0; i < files.length; i++) {
      this.images.push(files[i]);
    }
  }

  async calcularDistancia(origen: string, destino: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origen,
          destination: destino,
          travelMode: google.maps.TravelMode.BICYCLING,
        },
        (response: any, status: string) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const distance = response.routes[0].legs[0].distance.value;
            resolve(distance);
          } else {
            reject('No se pudo calcular la distancia debido a: ' + status);
          }
        }
      );
    });
  }
}
