import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit {
  publicProfileUser: any;
  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const publicId = localStorage.getItem('id-public-user');

    try {
      this.publicProfileUser = await this.auth.getUserProfileById(publicId);
      console.log(this.publicProfileUser);
    } catch (error) {
      console.error(error);
    }
  }

  openFavRoutes() {}

  openEventsJoined() {}
}
