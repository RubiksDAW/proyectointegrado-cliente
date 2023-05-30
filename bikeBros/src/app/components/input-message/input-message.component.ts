import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-input-message',
  templateUrl: './input-message.component.html',
  styleUrls: ['./input-message.component.scss'],
})
export class InputMessageComponent implements OnInit {
  recipientId: string | null;
  messageForm: FormGroup;
  senderId: string | null;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private message: MessagesService,
    private auth: AuthService,
    private alertController: AlertController
  ) {
    this.messageForm = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.senderId = await this.auth.getProfileId();
    this.recipientId = localStorage.getItem('id-recipient');
    console.log(this.recipientId);
    console.log(this.senderId);
  }

  async onSubmit() {
    const { comment } = this.messageForm.value;
    this.message
      .sendMessage(this.senderId, this.recipientId, comment)
      .subscribe((data) => {
        console.log(data);
      });
    const alert = await this.alertController.create({
      header: 'Mensajes',
      message: 'Mensaje enviado.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {},
        },
      ],
    });
    this.closeModal();
    await alert.present();
    this.messageForm.reset();
    this.closeModal();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
