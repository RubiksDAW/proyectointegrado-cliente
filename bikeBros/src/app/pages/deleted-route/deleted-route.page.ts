import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-deleted-route',
  templateUrl: './deleted-route.page.html',
  styleUrls: ['./deleted-route.page.scss'],
})
export class DeletedRoutePage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {}

  continue() {
    this.navCtrl.navigateForward('/main/create-route#rutas');
  }
}
