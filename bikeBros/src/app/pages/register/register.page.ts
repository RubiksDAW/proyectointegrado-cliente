import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private builder = inject(FormBuilder);
  registerForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private auth: AuthService,
    public alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      nick: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])\S{6,}$/),
      ]),
      rpassword: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      description: new FormControl('', Validators.nullValidator),
      imageURL: new FormControl('', Validators.nullValidator),
    });
  }

  ngOnInit() {}

  async register() {
    // Hacemos uso de trim() para eliminar posibles espacios en blanco antes y despues del valor
    const nick = this.registerForm.get('nick')?.value.trim().toLowerCase();
    // const nickError = this.registerForm.get('nick')?.errors

    const email = this.registerForm.get('email')?.value.trim().toLowerCase();
    // const emailError = this.registerForm.get('email')?.errors;

    const password = this.registerForm.get('password')?.value.trim();

    const rpassword = this.registerForm.get('rpassword')?.value.trim();

    const age = this.registerForm.get('age')?.value;
    // const ageError = this.registerForm.get('age')?.errors;

    const description = this.registerForm.get('description')?.value.trim();
    // const descriptionError = this.registerForm.get('description')?.errors;

    const imageURL = this.registerForm.get('imageURL')?.value.trim();
    // const imageURLError = this.registerForm.get('imageURL')?.errors;

    const nickExiste = await this.auth.checkIfNickExists(nick);

    const emailExiste = await this.auth.checkIfEmailExists(email);

    console.log('El nick existe?' + nickExiste);
    console.log('El email existe?' + emailExiste);

    if (nickExiste) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message: 'Ya existe un usuario con este nombre',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }

    if (emailExiste) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message: 'Ya existe un usuario con este email',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }

    if (nick === '' || null) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message: 'El nick es obligatorio',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }

    if (email === '' || null) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message: 'El email es obligatorio',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }

    if (password === '' || null || password.length < 6) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message:
          'La contraseña debe ser de almenos 5 caracteres e incluir 2 números',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }

    if (password === rpassword) {
      // console.log(nick,email,password,age,description,imageURL)
      // console.log(nick,password)
      this.auth
        .registerUser(nick, email, password, age, description, imageURL)
        .subscribe({
          next: (res) => {
            // console.log(res)
            this.auth.onLogOut();
            this.router.navigate(['/login'], { replaceUrl: true });
            // this.auth.loginUser(nick, password);
          },

          error: (err) => {
            console.error(err);
          },
        });
    } else {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        cssClass: 'custom-alert',
        message: 'Las contraseñas no coinciden',
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'alert-button-confirm',
          },
        ],
      });

      await alert.present();

      return;
    }
  }
}
