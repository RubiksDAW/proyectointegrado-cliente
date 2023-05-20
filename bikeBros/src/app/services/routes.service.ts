import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, firstValueFrom, map, tap } from 'rxjs';
import { Route } from '../interfaces/route.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';

  // Declaramos una variable para observar
  private refreshRoute$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}
  //Cuando la respuesta llega, se utiliza el operador map para transformar la respuesta en un objeto de tipo RoutesResponse
  // y se selecciona el campo routes de este objeto. Finalmente, se devuelve un Observable que emite la matriz de objetos de tipo Route.
  // getAllRoutes(): Observable<Route[]> {
  //   const url = `${this.url}/api/route/getAll`;

  //   return this.http.get<RoutesResponse>(url).pipe(map((resp) => resp.routes));
  // }

  get refresh$() {
    return this.refreshRoute$;
  }

  getAllRoutes(
    searchTerm?: string,
    selectedDifficulty?: string
  ): Observable<Route[]> {
    let query: any = {};
    if (searchTerm) {
      // Si se proporciona un término de búsqueda, filtrar las rutas por nombre o nivel de dificultad
      query = {
        searchTerm: searchTerm,
      };
    } else {
      query = {};
    }

    if (selectedDifficulty) {
      // Si se proporciona un nivel de dificultad seleccionado, filtrar las rutas por ese nivel
      query.difficulty_level = selectedDifficulty;
    }

    return this.http
      .get<Route[]>(`${this.url}/api/route/getAll`, {
        params: query,
      })
      .pipe(map((resp) => resp));
  }

  getRouteById(id: string) {
    const url = `${this.url}/route/id/${id}`;

    return this.http.get<Route>(url);
  }

  register(formData: FormData) {
    const url = `${this.url}/api/route/register`;
    return this.http.post(url, formData).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
    );
  }

  getIdRoute() {
    const idRoute = localStorage.getItem('id');
    return idRoute;
  }

  // Método para eliminar una ruta por ID solo si el usuario que lo llama es un admin
  // deleteRouteById(routeId: string) {
  //   this.http.delete(`${this.url}/route/delete/${routeId}`).subscribe(
  //     (response) => {
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  deleteRouteById(routeId: string) {
    const url = `${this.url}/route/delete/${routeId}`;
    return this.http.delete(url).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
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

  editRoute(formData: FormData, id: string) {
    const url = `${this.url}/route/${id}/modify`;

    return this.http.put(url, formData).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
    );
  }

  async addFavoriteRoute(routeId: string) {
    const userId = await this.auth.getProfileId();
    const body = {
      userId: userId,
    };
    const url = `${this.url}/favs/routes/addFavRoute/${routeId}`;

    return this.http.post(url, body).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
    );
  }

  async removeFavoriteRoute(routeId: string) {
    const userId = await this.auth.getProfileId();
    const body = {
      userId: userId,
    };

    const url = `${this.url}/favs/routes/removeFavRoute/${routeId}`;

    return this.http.post(url, body).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
    );
  }

  async getUserFavoriteRouteIds(userId: string): Promise<string[]> {
    console.log('id' + userId);
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.url}/favs/${userId}`)
      );
      const favoriteRoutes = res as Route[];
      const routeIds = favoriteRoutes.map((route) => route._id.toString());
      return routeIds;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // getFavoriteRoutes(userId: string): Observable<any> {
  //   const url = `${this.url}/favs/routes/${userId}`;
  //   return this.http.get(url);
  // }

  // async getFavoriteRoutes(userId: string): Promise<Route[]> {
  //   console.log('id: ' + userId);
  //   try {
  //     const res = await firstValueFrom(
  //       this.http.get<Route[]>(`${this.url}/favs/${userId}`)
  //     );
  //     console.log(res);
  //     return Promise.resolve(res);
  //   } catch (error) {
  //     console.error(error);
  //     return Promise.resolve([]);
  //   }
  // }

  getFavoriteRoutes(userId: string): Observable<Route[]> {
    return this.http
      .get<Route[]>(`${this.url}/favs/${userId}`)
      .pipe(map((resp: any) => resp));
  }
  // async getFavoriteRoutes(userId: string): Promise<Route[]> {
  //   console.log('id: ' + userId);
  //   try {
  //     const res = await firstValueFrom(
  //       this.http.get<Route[]>(`${this.url}/favs/${userId}`)
  //     );
  //     console.log(res);
  //     return Promise.resolve(res);
  //   } catch (error) {
  //     console.error(error);
  //     return Promise.resolve([]);
  //   }
  // }
}
