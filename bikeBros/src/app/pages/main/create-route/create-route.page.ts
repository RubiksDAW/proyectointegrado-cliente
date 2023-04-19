import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterRouteModalComponent } from 'src/app/components/register-route-modal/register-route-modal.component';
@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.page.html',
  styleUrls: ['./create-route.page.scss'],
})
export class CreateRoutePage implements OnInit {
  selectedPage = 'rutas';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async showRouteRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterRouteModalComponent,
    });
    return await modal.present();
  }
}
