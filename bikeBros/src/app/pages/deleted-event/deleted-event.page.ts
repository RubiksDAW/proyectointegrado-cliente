import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-deleted-event',
  templateUrl: './deleted-event.page.html',
  styleUrls: ['./deleted-event.page.scss'],
})
export class DeletedEventPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {}

  continue() {
    this.navCtrl.navigateForward('/main/create-route#eventos');
  }
}
