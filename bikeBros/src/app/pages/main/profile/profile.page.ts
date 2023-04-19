import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  public profileUser: any;

  private url = 'http://localhost:3300/';

  ngOnInit() {
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
}
