import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

// const API_URL = environment.API_URL;
// const API_KEY = environment.API_KEY;
@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  todayDay = new Date();
  weatherDetails: any;
  icon: any;
  searchQuery: string = '';

  constructor(private http: HttpClient) {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Realiza la consulta a la API utilizando la ubicación del usuario
      this.http
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=c330fa705916dcb621befdf137ccaf76`
        )
        .subscribe((response) => {
          this.weatherDetails = response;
          this.icon = `https://openweathermap.org/img/wn/${this.weatherDetails.weather[0].icon}@4x.png`;

          console.log(response);
        });
    } catch (error) {
      console.error('Error al obtener la ubicación del usuario:', error);
    }
  }

  search() {
    if (this.searchQuery.trim() !== '') {
      this.http
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.searchQuery}&APPID=c330fa705916dcb621befdf137ccaf76`
        )
        .subscribe((response) => {
          this.weatherDetails = response;
          this.icon = `https://openweathermap.org/img/wn/${this.weatherDetails.weather[0].icon}@4x.png`;
        });
    }
  }
}
