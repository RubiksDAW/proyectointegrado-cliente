import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage {
  email: string;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async resetPassword() {
    try {
      this.authService.sendPasswordResetEmail(this.email); // Llama al método del servicio de autenticación para enviar el correo de restablecimiento de contraseña
      this.presentSuccessToast(
        'Correo de restablecimiento de contraseña enviado'
      );
    } catch (error) {
      this.presentErrorToast(
        'Error al enviar el correo de restablecimiento de contraseña'
      );
    }
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
}
