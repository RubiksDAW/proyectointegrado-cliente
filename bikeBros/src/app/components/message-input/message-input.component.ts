import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  messageContent: string;

  constructor(
    private messageService: MessagesService,
    private auth: AuthService
  ) {}

  sendMessage() {
    // Obtén el sender y recipient del almacenamiento local
    const sender = localStorage.getItem('sender-id');
    const recipient = localStorage.getItem('recipient-id');

    // Verifica si se ha proporcionado sender y recipient
    if (sender && recipient) {
      this.messageService
        .sendMessage(sender, recipient, this.messageContent)
        .subscribe(() => {
          // Realiza cualquier acción adicional después de enviar el mensaje
          this.messageContent = ''; // Limpiar el campo de texto después de enviar el mensaje
        });
    } else {
      console.error(
        'No se pudo enviar el mensaje: sender o recipient no están definidos'
      );
    }
  }
}
