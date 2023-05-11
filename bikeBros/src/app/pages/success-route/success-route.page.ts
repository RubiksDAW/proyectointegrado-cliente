import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-route',
  templateUrl: './success-route.page.html',
  styleUrls: ['./success-route.page.scss'],
})
export class SuccessRoutePage implements OnInit {
  constructor(private navCtrl: NavController, private router: Router) {}

  ngOnInit() {}

  continue() {
    // location.reload();
    this.router.navigate(['/main/create-route']);
  }
}
