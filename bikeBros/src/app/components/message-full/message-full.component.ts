import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-message-full',
  templateUrl: './message-full.component.html',
  styleUrls: ['./message-full.component.scss'],
})
export class MessageFullComponent implements OnInit {
  mensajeId: string | null;
  mensajeCompleto: any;
  autor: string | null;
  senderId: string;
  recipientId: string;
  mensajes: any[];
  loggedUser: string;
  constructor(
    private message: MessagesService,
    private router: Router,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    this.loggedUser = await this.auth.getProfileId();
    this.mensajeId = localStorage.getItem('message-id') || '';
    this.senderId = localStorage.getItem('sender-id') || '';
    this.recipientId = localStorage.getItem('recipient-id') || '';
    this.message.getMessageById(this.mensajeId).subscribe((data: any) => {
      console.log(data);
      this.autor = data.sender.nick;
    });
    console.log(this.loggedUser);
    this.message
      .getMessagesBeetwenUsers(this.recipientId, this.senderId)
      .subscribe((data) => {
        this.mensajes = data;
        console.log(data);
      });

    console.log(this.senderId);
    console.log(this.recipientId);
  }

  goSenderProfile(senderId: string) {
    console.log(senderId);
    localStorage.setItem('id-public-user', senderId);
    this.router.navigate([`/public-profile/${senderId}`]);
  }
}
