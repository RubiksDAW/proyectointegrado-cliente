import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //Aquí declaramos un formulario el cual será rellenado con los datos de la vista Login
  public loginForm: FormGroup;

  // Buscar una mejor forma de comprobar el estado de los campos y como mostrar los errores.
  public formularioNoValido = false;
  public passwordEmpty = false;
  public nickEmpty = false;
  public nickNotFound = false;
  public incorrectPassword = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    public alertController: AlertController
  ) {
    //Aqui especificamos los campos que deben ser validados.
    this.loginForm = this.fb.group({
      nick: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    const nick = localStorage.getItem('nick');
    const password = localStorage.getItem('password');
    if (nick && password) {
      this.auth.loginUser(nick, password);
      this.router.navigate(['/main'], { replaceUrl: true });
    }
  }

  login() {
    const nick = this.loginForm.controls['nick'].value.trim().toLowerCase();
    const password = this.loginForm.controls['password'].value.trim();

    localStorage.setItem('nick', nick);
    localStorage.setItem('password', password);

    this.auth.loginUser(nick, password).subscribe({
      next: (res) => {
        // console.log(res);
        this.incorrectPassword = false;
        this.nickNotFound = false;
        localStorage.setItem('token', res.accessToken);

        // Aqui devolveriamos la ruta al perfil de nuestro usuario
        this.router.navigate(['/main'], { replaceUrl: true });
        // console.log('Bienvenido a tu perfil');
      },
      error: (err) => {
        this.presentAlert('Error al iniciar sesión', err.error.message);
      },
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();

    return;
  }
}
