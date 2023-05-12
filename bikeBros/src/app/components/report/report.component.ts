import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  @Input() id: string;
  report: string;

  onSubmit() {
    console.log(this.id);
    const mailtoLink = `mailto:aledelarosa2@gmail.com?subject=Reporte de ${this.id}&body=${this.report}`;
    window.location.href = mailtoLink;
  }
}
