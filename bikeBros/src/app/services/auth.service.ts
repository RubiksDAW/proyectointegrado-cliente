import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://bikebrosv2.herokuapp.com';
  // private url = 'http://localhost:3300';
  // headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  private refreshUsers$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  get refresh$() {
    return this.refreshUsers$;
  }

  loginUser(nick: string, password: string): Observable<any> {
    const url = `${this.url}/api/auth/login`;

    return this.http.post(url, {
      nick: nick,
      password: password,
    });
  }

  registerUser(formData: FormData) {
    // console.log('nick', nick, 'Contraseña', password);
    const url = `${this.url}/api/auth/registro`;

    return this.http.post(url, formData);
  }

  editUserProfile(formData: FormData, id: string) {
    const url = `${this.url}/${id}`;

    return this.http.put(url, formData);
  }

  // eliminar un usuario segun su id
  deleteAccount(id: string) {
    this.http.delete(`${this.url}/${id}`).subscribe(
      (response) => {
        console.log('Usuario borrado con éxito', response);
        //Una vez borrado el usuario se redirige a la pagina de inicio
        this.router.navigate(['/'], { replaceUrl: true });
      },
      (error) => {
        console.error('Ocurrió un error al borrar el usuario', error);
      }
    );
  }

  verifyIsAdmin(id: string) {
    this.http.get(`${this.url}/api/auth/idAdmin/${id}`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUserByNick(nick: string): Observable<any> {
    return this.http
      .get(`${this.url}/api/auth/verify/${nick}`)
      .pipe(map((resp) => resp));
  }

  async checkIfNickExists(nick: string): Promise<boolean> {
    const userNick = nick.trim().toLowerCase();
    try {
      const userAlreadyExist = await this.http
        .get(`${this.url}/api/auth/verify/${userNick}`)
        .toPromise();
      return !!userAlreadyExist; // Convierte la respuesta en un valor booleano
    } catch (error) {
      // console.error(error);
      return false; // En caso de error, retorna false
    }
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const userEmail = email.trim().toLowerCase();
    try {
      const response = await this.http
        .get(`${this.url}/api/auth/verifyEmail/${userEmail}`)
        .toPromise();
      const userAlreadyExist = !!response;
      return userAlreadyExist;
    } catch (error) {
      // console.error(error);
      return false;
    }
  }

  getProfile() {
    const token = localStorage.getItem('token');
    const url = `${this.url}/api/auth/profile`;
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return this.http.get(url, { headers: headers }).pipe(map((resp) => resp));
  }

  loggedIn(): boolean {
    //Comprueba si el token existe o no
    return !!localStorage.getItem('token');
  }

  getToken() {
    //Devuelve el token
    return localStorage.getItem('token');
  }

  onLogOut() {
    // Al cerrar sesión eliminamos toda información almacenada en el localstorage
    localStorage.removeItem('token');
    localStorage.removeItem('nick');
    localStorage.removeItem('password');
  }

  // Este metodo lo utilizaremos para conocer la id del usuario que se encuentra actualmente logeado
  // y poder comprobar si es el autor tanto del evento como de la ruta para que pueda o no borrarlos. Así
  // como añadir esta id a la hora de crear eventos y rutas.
  async getProfileId() {
    // console.log('me llaman');
    const nick = localStorage.getItem('nick');
    const url = `${this.url}/api/auth/verify/${nick}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener la respuesta de la solicitud');
      }

      const data = await response.json();
      console.log(data._id);
      const profileId = data._id;

      return profileId;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserById(userId: string | null) {
    const url = `${this.url}/user/${userId}`;

    try {
      const user = await fetch(url);

      if (!user.ok) {
        throw new Error('Error al obtener la respuesta de la solicitud');
      }

      const data = await user.json();
      console.log(data.nick);
      const userNick = data.nick;

      return userNick;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserProfileById(userId: string | null) {
    const url = `${this.url}/user/${userId}`;

    try {
      const user = await fetch(url);

      if (!user.ok) {
        throw new Error('Error al obtener la respuesta de la solicitud');
      }

      const data = await user.json();
      console.log(data);
      const userNick = data;

      return userNick;
    } catch (error) {
      console.error(error);
    }
  }

  sendPasswordResetEmail(email: string) {
    const url = `${this.url}/api/auth/reset-password`;
    console.log(email);
    return this.http.post(url, { email }).subscribe((res) => {
      console.log(res);
    });
  }
}
