import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report-event.component.html',
  styleUrls: ['./report-event.component.scss'],
})
export class ReportEventComponent implements OnInit {
  eventId: string | null;
  description: string;
  userName: string;
  idUser: string;
  reportForm: FormGroup;
  reason: string;
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private report: ReportService,
    private alertController: AlertController
  ) {
    this.eventId = localStorage.getItem('id-event');
  }

  async ngOnInit() {
    console.log(this.eventId);
    this.reportForm = this.formBuilder.group({
      reason: [''],
      description: [''],
    });
  }

  async onSubmit() {
    const { reason, description } = this.reportForm.value;
    if (this.eventId) {
      console.log(this.eventId, reason, description);
      this.report
        .addReportEvent(this.eventId, reason, description)
        .subscribe(async (data) => {
          const alert = await this.alertController.create({
            header: 'Reporte de Ruta',
            message:
              'Esta ruta ha sido reportada. Un administrador revisará el reporte lo antes posible.',
            buttons: [
              {
                text: 'Aceptar',
                handler: () => {
                  // Acciones a realizar al aceptar la alerta
                  // Puedes agregar aquí cualquier lógica adicional que desees ejecutar al aceptar la alerta
                },
              },
            ],
          });
          this.closeModal();
          await alert.present();
          console.log(data);
        });
      this.reportForm.reset();
      this.closeModal();
    } else {
      console.log('Error: routeId es nulo.');
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
