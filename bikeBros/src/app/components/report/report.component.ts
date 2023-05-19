import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() id: string;
  report: string;
  userName: string;
  idUser: string;
  constructor(
    private auth: AuthService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.idUser = await this.auth.getProfileId();
    console.log(this.idUser);
    this.auth.getUserById(this.idUser).then((user: any) => {
      console.log(user);
      this.userName = user;
      // Asignar el nombre del usuario a la propiedad userName, o una cadena vacía si es null
    });
  }

  onSubmit() {
    console.log(this.id);
    console.log(this.userName);
    const mailtoLink = `mailto:aledelarosa2@gmail.com?subject=Reporte de una ruta &body= El usuario '${this.userName}'ha reportado la ruta cuyo id es: ${this.id}.<br> 
    Comentario: ${this.report}`;
    window.location.href = mailtoLink;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
