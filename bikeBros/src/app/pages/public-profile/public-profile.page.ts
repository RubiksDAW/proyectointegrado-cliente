import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { InputMessageComponent } from 'src/app/components/input-message/input-message.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit {
  publicProfileUser: any;
  publicId: string;
  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.publicId = localStorage.getItem('id-public-user')!;
    console.log(this.publicId);
    if (this.publicId !== null) {
      this.publicProfileUser = await this.auth.getUserProfileById(
        this.publicId
      );
      console.log(this.publicProfileUser);
    } else {
      console.error('El ID público del usuario no está disponible');
    }
  }

  async openInputMessage() {
    const modal = await this.modalController.create({
      component: InputMessageComponent,
    });

    return await modal.present();
  }

  setRecipientUser(recipientId: string) {
    localStorage.setItem('id-recipient', recipientId);
  }

  openEventsJoined() {}
}
