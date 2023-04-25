import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private url = 'https://bikebrosv2.herokuapp.com';
  // private url = 'http://localhost:3300';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  loginUser(nick: string, password: string): Observable<any> {
    const url = `${this.url}/api/auth/login`;

    return this.http.post(url, {
      nick: nick,
      password: password,
    });
  }

  registerUser(
    nick: string,
    email: string,
    password: string,
    age: number,
    description: string,
    imageURL: string
  ) {
    console.log('nick', nick, 'Contraseña', password);
    const url = `${this.url}/api/auth/registro`;

    return this.http.post(url, {
      nick: nick,
      password: password,
      email: email,
      age: age,
      description: description,
      imageURL: imageURL,
    });
  }

  editUserProfile(
    id: string,
    nick: string,
    email: string,
    age: number,
    description: string,
    imageURL: string
  ) {
    const url = `${this.url}/${id}`;

    return this.http.put(url, {
      nick,
      email,
      age,
      description,
      imageURL,
    });
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

  async checkIfNickExists(nick: string): Promise<boolean> {
    const userNick = nick.trim().toLowerCase();
    try {
      const userAlreadyExist = await this.http
        .get(`${this.url}/api/auth/verify/${userNick}`)
        .toPromise();
      return !!userAlreadyExist; // Convierte la respuesta en un valor booleano
    } catch (error) {
      console.error(error);
      return false; // En caso de error, retorna false
    }
  }

  // async checkIfNickExists(nick: string): Promise<boolean> {
  //   const userNick = nick.trim().toLowerCase();
  //   try {
  //     const response = await this.http
  //       .get(`${this.url}/api/verify/${userNick}`)
  //       .toPromise();
  //     const userAlreadyExist = !!response;
  //     return userAlreadyExist;
  //   } catch (error) {
  //     // console.error(error);
  //     return false;
  //   }
  // }

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

  // async checkIfEmailExists(email: string): Promise<boolean> {
  //   const userEmail = email.trim().toLowerCase();
  //   try {
  //     const userAlreadyExist = await this.http
  //       .get(`${this.url}/user/${userEmail}`)
  //       .toPromise();
  //     return !!userAlreadyExist; // Convierte la respuesta en un valor booleano
  //   } catch (error) {
  //     console.error(error);
  //     return false; // En caso de error, retorna false
  //   }
  // }

  getProfile() {
    const token = localStorage.getItem('token');
    const url = `${this.url}/api/auth/profile`;
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return this.http.get(url, { headers: headers });
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
    console.log('me llaman');
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
}
