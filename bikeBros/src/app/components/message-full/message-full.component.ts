import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private message: MessagesService, private router: Router) {}

  async ngOnInit() {
    this.mensajeId = localStorage.getItem('message-id');

    this.message.getMessageById(this.mensajeId).subscribe((data: any) => {
      console.log(data);
      this.autor = data.sender.nick;
      this.mensajeCompleto = data.content;
      this.senderId = data.sender._id;
    });

    console.log(this.mensajeCompleto);
  }

  goSenderProfile(senderId: string) {
    console.log(senderId);
    localStorage.setItem('id-public-user', senderId);
    this.router.navigate([`/public-profile/${senderId}`]);
  }
}
