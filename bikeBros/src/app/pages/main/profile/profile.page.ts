import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FavListComponent } from 'src/app/components/fav-list/fav-list.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public profileUser: any;
  public userStats: any = '';
  private url = 'http://localhost:3300/';
  // private url = 'https://bikebrosv2.herokuapp.com';
  subscription: Subscription;
  subscription2: Subscription;
  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const nick = localStorage.getItem('nick');

    if (nick) {
      this.getStats(nick);
      this.subscription = this.auth.refresh$.subscribe(() => {
        this.getStats(nick);
      });
    }

    this.getUser();
    this.subscription2 = this.auth.refresh$.subscribe(() => {
      this.getUser();
    });
    //Hacemos uso del metodo getProfile en el servicio para obtener los datos asociados
    // al usuario que ha iniciado sesión
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);

        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Esto es una solución temporal para arreglar el problema de refresco de datos en la vista perfil una vez actualizado los datos del user
  ionViewDidEnter() {
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // onClick() {
  //   const usuarioLogeado = this.auth.getToken();
  //   console.log(usuarioLogeado)
  //   this.auth.onLogOut()
  //   this.router.navigate(['/login'], { replaceUrl: true });
  // }
  // onClick() {
  //   const usuarioLogeado = this.auth.getToken();
  //   console.log(usuarioLogeado);

  //   if (confirm('¿Estás seguro que deseas cerrar la sesión?')) {
  //     this.auth.onLogOut();
  //     this.router.navigate(['/login'], { replaceUrl: true });
  //   }
  // }

  async onClick() {
    const alert = await this.alertController.create({
      header: 'Confirmar acción',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            // Lógica para eliminar o realizar la acción deseada
            const usuarioLogeado = this.auth.getToken();
            console.log(usuarioLogeado);
            this.auth.onLogOut();
            this.router.navigate(['/login'], { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }

  // con este metodo eliminaremos nuestro perfil de usuario
  deleteAccount(id: string) {
    this.http.delete(`${this.url}${id}`).subscribe(
      (response) => {
        console.log('Usuario borrado con éxito', response);
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      (error) => {
        console.error('Ocurrió un error al borrar el usuario', error);
      }
    );
  }

  //Este metodo llama a un modal para confirmar que realmente deseas borrar el usuario
  // async confirmDelete() {
  //   const modal = await this.modalController.create({
  //     component: ConfirmDeleteAccountComponent,
  //   });
  //   return await modal.present();
  // }

  // editProfile(){
  //   this.router.navigate(['/edit-profile'])
  // }

  openProfileOptions() {
    this.router.navigate(['main/profile-options']);
  }

  async openFavRoutes() {
    const modal = await this.modalController.create({
      component: FavListComponent,
    });
    // this.selectedPage = 'eventos';
    return await modal.present();
  }

  getUser() {
    this.auth.getProfile().subscribe((data: any) => {
      this.profileUser = data;
      console.log(data);
    });
  }

  getStats(nick: string) {
    this.auth.getUserByNick(nick).subscribe((data: any) => {
      this.userStats = data;
      console.log(data);
    });
  }
}
