import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Marker } from 'src/app/interfaces/marker.interface';

declare let google: any;

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
})
export class RouteMapComponent implements OnInit {
  
  map: any;
  // Servicios de google para la generación de ruta
  directionsService = new google.maps.DirectionsService();
  
  // Servicios de google para la renderización de dicha ruta
  directionsDisplay = new google.maps.DirectionsRenderer();

  // Esta dirección ahora es fija, pero debería ser extraída del servicio de Rutas 
  // origin = { lat: 36.426398521037484, lng: -5.150544578685462 };
  origin = "Estepona";
  // Esta dirección ahora es fija, pero debería ser extraída del servicio de Rutas 
  destination = "Manilva"; 
  // destination = { lat: 36.431397497274155, lng: -5.122749984343144 }; 
  
  pathCoordinates = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Seleccionamos nuestro contenedor donde se mostrará el mapa
    const mapEle: HTMLElement | null = document.getElementById('map');
    // Seleccionamos nuestro contenedor de las indicaciones
    const indicatorsEle: HTMLElement | null = document.getElementById('indicators');

    // Creamos un objeto con la localización inicial en la que cargará el mapa (Vista inicial))
    const myLati = { lat: 37.38598973094481, lng: -5.990080137464493 };

    this.map = new google.maps.Map(mapEle, {
      center: myLati,
      zoom: 7,
    });

    // Indicamos el mapa sobre el que se mostrará la ruta 
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(indicatorsEle);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle?.classList.add('show-map');
      // Una vez renderizado el mapa calculará la ruta mas optima entre origen y destino
      this.calculateRoute();
    });
  }
  
  // Metodo para desplegar el mapa en el cual interaccionará el usuario.
  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: MapModalPage,
  //     componentProps: {
  //       markers: []
  //     }
  //   });
  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   console.log(data);
  // }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
    });
  }

  private calculateRoute(){
    this.directionsService.route({
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.BICYCLING,
    }, (response: any, status: string)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
}
