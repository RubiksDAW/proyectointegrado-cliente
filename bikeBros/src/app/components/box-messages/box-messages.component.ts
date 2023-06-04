import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-box-messages',
  templateUrl: './box-messages.component.html',
  styleUrls: ['./box-messages.component.scss'],
})
export class BoxMessagesComponent implements OnInit, OnDestroy {
  userId: string;
  messages: any[] = [];
  mensajesAgrupados: any[] = [];
  subscription: Subscription;
  userNick: string;

  constructor(
    private messageSer: MessagesService,
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.userId = await this.auth.getProfileId();

    this.getMessages();
    this.subscription = this.messageSer.refresh$.subscribe(() => {
      this.getMessages();
    });
    console.log(this.userId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getMessages(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
      });
      await loading.present();

      this.messageSer.getMessages(this.userId).subscribe((data: any) => {
        console.log(data);
        this.messages = data;
        this.agruparMensajes();

        loading.dismiss(); // Ocultar el spinner cuando se obtienen los datos
      });
    } catch (error) {
      console.error(error);
    }
  }

  agruparMensajes() {
    const usuariosAgregados: string[] = [];
    this.mensajesAgrupados = [];
    // Construimos un array en el cual solo figurará un usuario por mesnajes
    for (const mensaje of this.messages) {
      if (!usuariosAgregados.includes(mensaje.sender._id)) {
        this.mensajesAgrupados.push(mensaje);
        usuariosAgregados.push(mensaje.sender._id);
      }
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  setIdMessage(messageId: string) {
    localStorage.setItem('id-message', messageId);
  }

  goMessage(messageId: string) {
    console.log(messageId);
    this.closeModal();
    this.router.navigate([`message/${messageId}`]);
  }

  truncateContent(content: string): string {
    const words = content.split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    } else {
      return content;
    }
  }

  openMessage(messageId: string) {
    localStorage.setItem('message-id', messageId);
    this.closeModal();
    // Redirigir a la página de visualización del mensaje completo
    this.router.navigate([`/message/${messageId}`]);
  }

  openMessageList(recipientId: string, senderId: string, messageId: string) {
    console.log(senderId);
    console.log(recipientId);
    localStorage.setItem('recipient-id', recipientId);
    localStorage.setItem('sender-id', senderId);
    this.closeModal();
    // Redirigir a la página de visualización del mensaje completo
    this.router.navigate([`/message/${messageId}`]);
  }
}
