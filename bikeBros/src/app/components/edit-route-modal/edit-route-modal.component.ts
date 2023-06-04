import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { RoutesService } from 'src/app/services/routes.service';

declare let google: any;

@Component({
  selector: 'app-edit-route-modal',
  templateUrl: './edit-route-modal.component.html',
  styleUrls: ['./edit-route-modal.component.scss'],
})
export class EditRouteModalComponent implements OnInit {
  routeForm: FormGroup;
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
  images: File[] = [];

  routeId: string; // Nuevo campo para almacenar el ID de la ruta

  constructor(
    private formBuilder: FormBuilder,
    private routeService: RoutesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      difficulty_level: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      images: ['', Validators.required],
    });

    const id = localStorage.getItem('id');
    if (id !== null) {
      this.routeId = id;
    }

    // Cargar los datos de la ruta existente
    this.routeService.getRouteById(this.routeId).subscribe((route) => {
      console.log(route);
      this.routeForm.patchValue({
        name: route.name,
        difficulty_level: route.difficulty_level,
        distance: route.distance,
        location: route.location,
        description: route.description,
        origin: route.origin,
        destination: route.destination,
        images: route.images,
      });
    });
  }

  async submitForm() {
    const id = this.routeId;
    const name = this.routeForm.controls['name'].value.trim();
    const difficulty_level = this.routeForm
      .get('difficulty_level')
      ?.value.trim();
    const location = this.routeForm.get('location')?.value.trim();
    const description = this.routeForm.get('description')?.value.trim();
    const originForm = this.routeForm.get('origin')?.value.trim();
    const destinationForm = this.routeForm.get('destination')?.value.trim();
    const distance = await this.calcularDistancia(originForm, destinationForm);
    const distanceKM = distance / 1000;
    const distanceText = distanceKM.toString();
    const formData = new FormData();

    formData.append('_id', id);
    formData.append('name', name);
    formData.append('difficulty_level', difficulty_level);
    formData.append('distance', distanceText);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('origin', originForm);
    formData.append('destination', destinationForm);

    // Agrega las imágenes al objeto FormData solo si se han seleccionado
    for (let i = 0; i < this.images.length; i++) {
      formData.append('images', this.images[i]);
    }

    this.routeService.editRoute(formData, id).subscribe(
      (res) => {
        console.log(res);
        // Realiza las acciones necesarias después de editar la ruta exitosamente
        this.closeModal();
      },
      (err) => {
        console.error(err);
        // Realiza las acciones necesarias en caso de error
      }
    );
  }

  //Busqueda con Places
  onSearchInput() {
    if (this.origin.length > 0) {
      this.query(this.origin, true);
    }
  }
  // Metodo para seleccionar las sugerencía de la API de Google Places
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

  async closeModal() {
    await this.modalController.dismiss();
  }
}
