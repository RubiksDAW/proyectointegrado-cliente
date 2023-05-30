import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  constructor(private modal: ModalController) {}

  ngOnInit() {}

  async closeModal() {
    await this.modal.dismiss();
  }
}
