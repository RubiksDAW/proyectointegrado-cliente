import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-confirm-delete-account',
  templateUrl: './confirm-delete-account.component.html',
  styleUrls: ['./confirm-delete-account.component.scss'],
})
export class ConfirmDeleteAccountComponent  implements OnInit {

  constructor(private modalCtrl: ModalController, private auth:AuthService, private router:Router) {}
  
  // Declaramos un objeto vacio donde almacenaremos la información del usuario que nos facilita nuestro token
  public profileUser:any;


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    //Hacemos uso del metodo getProfile en el servicio para obtener los datos asociados
    // al usuario que ha iniciado sesión
    this.auth.getProfile().subscribe({
      next: response => {
        console.log(response)
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  // Este metodo es llamado al pulsar confirmar y llama a nuestro servicio para eliminar el perfil del usuario
  deleteProfile(id:string){
    this.auth.deleteAccount(id)
    this.auth.onLogOut()
    this.router.navigate(['/login'], { replaceUrl: true });
    console.log("Usuario Borrado")
    return this.modalCtrl.dismiss('confirm');
  }

}
