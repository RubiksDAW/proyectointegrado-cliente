import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterEventModalComponent } from 'src/app/components/register-event-modal/register-event-modal.component';
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

  // ionDidEnterView() {
  //   location.reload()
  // }

  async showRouteRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterRouteModalComponent,
    });
    // this.selectedPage = 'eventos';
    return await modal.present();
  }
  async showEventRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterEventModalComponent,
    });

    return await modal.present();
  }
}
