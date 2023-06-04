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

  get refresh$() {
    return this.refreshRoute$;
  }

  getAllRouteNames(): Observable<any> {
    return this.http.get<any>(`${this.url}/routes/getAll`);
  }

  getAllRoutes(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/route/getAll`);
  }
  // getAllRoutes(page?: number, pageSize?: number): Observable<any> {
  //   let params = new HttpParams();

  //   if (page) {
  //     params = params.set('page', page.toString());
  //   }

  //   if (pageSize) {
  //     params = params.set('pageSize', pageSize.toString());
  //   }

  //   return this.http.get<any>(`${this.url}/api/route/getAll`, { params });
  // }

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
        // He desactivado esto porque se rayaba a la hora de la paginación del infinite-scroll
        // this.refreshRoute$.next();
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
        // this.refreshRoute$.next();
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

  getFavoriteRoutes(userId: string): Observable<Route[]> {
    return this.http
      .get<Route[]>(`${this.url}/favs/${userId}`)
      .pipe(map((resp: any) => resp));
  }

  uploadRoutePhoto(routeId: string, images: File[]): Observable<any> {
    const URL = `${this.url}/route/updateRoutePic/${routeId}`;
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    return this.http.post(URL, formData).pipe(
      tap(() => {
        this.refreshRoute$.next();
      })
    );
  }
}
