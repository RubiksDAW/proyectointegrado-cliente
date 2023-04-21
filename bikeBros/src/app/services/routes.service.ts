import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Route, RoutesResponse } from '../interfaces/route.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}
  //Cuando la respuesta llega, se utiliza el operador map para transformar la respuesta en un objeto de tipo RoutesResponse
  // y se selecciona el campo routes de este objeto. Finalmente, se devuelve un Observable que emite la matriz de objetos de tipo Route.
  getAllRoutes(): Observable<Route[]> {
    const url = `${this.url}/api/route/getAll`;

    return this.http.get<RoutesResponse>(url).pipe(map((resp) => resp.routes));
  }

  getRouteById(id: string) {
    const url = `${this.url}/route/id/${id}`;

    return this.http.get<Route>(url);
  }

  register(
    name: string,
    difficulty_level: string,
    distance: number,
    location: string,
    description: string,
    origin: string,
    destination: string,
    imageURL: string,
    author: string
  ) {
    const url = `${this.url}/api/route/register`;

    return this.http.post(url, {
      name: name,
      difficulty_level: difficulty_level,
      distance: distance,
      location: location,
      description: description,
      origin: origin,
      destination: destination,
      imageURL: imageURL,
      author: author,
    });
  }

  getIdRoute() {
    const idRoute = localStorage.getItem('id');
    return idRoute;
  }

  // Método para eliminar una ruta por ID solo si el usuario que lo llama es un admin
  deleteRouteById(routeId: string) {
    this.http.delete(`${this.url}/route/delete/${routeId}`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async getRouteAuthorId(id: string) {
    const url = `${this.url}/route/id/${id}`;

    try {
      const response = await fetch(url);

      const data = await response.json();
      const routeAuthorId = data.author;
      console.log('Id del creador ' + routeAuthorId);
      return routeAuthorId;
    } catch (error) {
      console.error(error);
    }
  }
}
