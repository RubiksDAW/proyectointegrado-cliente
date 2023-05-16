import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;
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

  loadData() {
    this.http
      // .get(`${API_URL}weather?q=${'Sevilla'}&appid=${API_KEY}`)
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=London&APPID=c330fa705916dcb621befdf137ccaf76`
      )
      .subscribe((response) => {
        this.weatherDetails = response;
        this.icon = `http://openweathermap.org/img/wn/${this.weatherDetails.weather[0].icon}@4x.png`;

        console.log(response);
      });
  }

  search() {
    if (this.searchQuery.trim() !== '') {
      this.http
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.searchQuery}&APPID=c330fa705916dcb621befdf137ccaf76`
        )
        .subscribe((response) => {
          this.weatherDetails = response;
          this.icon = `http://openweathermap.org/img/wn/${this.weatherDetails.weather[0].icon}@4x.png`;
        });
    }
  }

  ngOnInit() {}
}
