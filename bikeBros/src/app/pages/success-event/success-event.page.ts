import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-event',
  templateUrl: './success-event.page.html',
  styleUrls: ['./success-event.page.scss'],
})
export class SuccessEventPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  continue() {
    this.router.navigate(['/main/create-route']);
  }
}
