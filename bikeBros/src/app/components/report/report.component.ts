import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  routeId: string | null;
  description: string;
  userName: string;
  idUser: string;
  reportForm: FormGroup;
  reason: string;
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private report: ReportService
  ) {
    this.routeId = localStorage.getItem('id');
  }

  async ngOnInit() {
    console.log(this.routeId);
    this.reportForm = this.formBuilder.group({
      reason: [''],
      description: [''],
    });
  }

  async onSubmit() {
    const { reason, description } = this.reportForm.value;
    if (this.routeId) {
      console.log(this.routeId, reason, description);
      this.report
        .addReport(this.routeId, reason, description)
        .subscribe((data) => {
          console.log(data);
        });
      this.reportForm.reset();
    } else {
      console.log('Error: routeId es nulo.');
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
