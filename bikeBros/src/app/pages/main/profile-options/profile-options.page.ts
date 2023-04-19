import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ConfirmDeleteAccountComponent } from 'src/app/components/confirm-delete-account/confirm-delete-account.component';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.page.html',
  styleUrls: ['./profile-options.page.scss'],
})
export class ProfileOptionsPage implements OnInit {
  public profileUser: any;

  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

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
  // Solución temporal
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

  //Este metodo llama a un modal para confirmar que realmente deseas borrar el usuario
  async confirmDelete() {
    const modal = await this.modalController.create({
      component: ConfirmDeleteAccountComponent,
    });
    return await modal.present();
  }

  editProfile() {
    this.router.navigate(['main/edit-profile']);
  }
}
