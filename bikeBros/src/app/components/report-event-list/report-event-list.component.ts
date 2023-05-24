import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-event-list',
  templateUrl: './report-event-list.component.html',
  styleUrls: ['./report-event-list.component.scss'],
})
export class ReportEventListComponent implements OnInit {
  @Input() eventId: string;
  reports: any[] = [];
  authorNicks: { [authorId: string]: string } = {};
  subscription: Subscription;

  constructor(
    private report: ReportService,
    private auth: AuthService,
    private modal: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // this.obtenerNicksAutores();
    this.getReports();
    this.subscription = this.report.refresh$.subscribe(() => {
      this.getReports();
    });
  }

  getReports() {
    // console.log(this.routeId);
    this.report.getEventReports(this.eventId).subscribe((data: any) => {
      this.reports = data.reports;
      console.log(data);
    });
  }

  // obtenerNicksAutores() {
  //   this.comments.forEach((comment) => {
  //     this.auth
  //       .getUserById(comment.authorId)
  //       .then((user) => {
  //         this.authorNicks[comment.authorId] = user.nick; // Almacena el nick del autor en el objeto authorNicks
  //       })
  //       .catch((error) => {
  //         console.log('Error al obtener el nick del autor:', error);
  //       });
  //   });
  // }

  // async getAuthorNick(authorId: string) {
  //   // Recupera el nick del autor utilizando el servicio de usuarios
  //   const user = await this.auth.getUserById(authorId);
  //   return user;
  // }
  getAuthorNick(authorId: string): string {
    return this.authorNicks[authorId] || ''; // Devuelve el nick del autor desde el objeto authorNicks
  }
  async closeModal() {
    await this.modal.dismiss();
  }

  async deleteEventReport(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este reporte de ruta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.report
              .deleteEventReportById(this.eventId, id)
              .subscribe(async (data: any) => {
                const successAlert = await this.alertController.create({
                  header: 'Reporte de Ruta',
                  message: 'Reporte eliminado exitosamente',
                  buttons: ['Aceptar'],
                });

                await successAlert.present();
                this.closeModal();

                console.log(data);
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
