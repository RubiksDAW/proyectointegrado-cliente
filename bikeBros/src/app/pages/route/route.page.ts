import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/routes.service';

declare let google: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {
  map: any;
  // Servicios de google para la generación de ruta
  directionsService = new google.maps.DirectionsService();

  // Servicios de google para la renderización de dicha ruta
  directionsDisplay = new google.maps.DirectionsRenderer();

  // origin = { lat: 36.426398521037484, lng: -5.150544578685462 };
  origin: string;
  // Esta dirección ahora es fija, pero debería ser extraída del servicio de Rutas
  destination: string;
  // destination = { lat: 36.431397497274155, lng: -5.122749984343144 };
  route: any;
  id: any;

  constructor(private routeService: RoutesService) {}

  async ngOnInit() {
    this.id = localStorage.getItem('id');
    const data = await this.routeService.getRouteById(this.id).toPromise();
    this.route = data;
    console.log(data);

    this.initMap();
  }

  ngOnChanges() {}

  initMap() {
    // Seleccionamos nuestro contenedor donde se mostrará el mapa
    const mapEle: HTMLElement | null = document.getElementById('map');
    // Seleccionamos nuestro contenedor de las indicaciones
    const indicatorsEle: HTMLElement | null =
      document.getElementById('indicators');

    // Creamos un objeto con la localización inicial en la que cargará el mapa (Vista inicial))
    const myLati = { lat: 37.38598973094481, lng: -5.990080137464493 };

    this.map = new google.maps.Map(mapEle, {
      center: myLati,
      zoom: 12,
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

  async calculateRoute() {
    this.directionsService.route(
      {
        origin: await this.route.origin,
        destination: await this.route.destination,
        travelMode: google.maps.TravelMode.BICYCLING,
      },
      (response: any, status: string) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      }
    );
  }

  toggleIndicators() {
    const indicators: HTMLElement | null =
      document.getElementById('indicators');
    indicators &&
      (indicators.style.display =
        indicators.style.display === 'none' ? 'block' : 'none');
    const map: HTMLElement | null = document.getElementById('map');
    map && (map.style.height = map.style.height === '100%' ? '50%' : '100%');
  }
}
