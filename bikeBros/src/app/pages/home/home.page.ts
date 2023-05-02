import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private route: Router, private auth: AuthService) {}

  /**
   * Con este ngOnInit() comprobamos si había un token activo previamente, en caso de que lo hubiera
   * se redirecciona al apartado principal de la app. Si no lo hubiera elimina todo rastro que pudiera quedar
   * de la sesión anterior.
   */
  ngOnInit() {
    if (this.auth.loggedIn()) {
      this.route.navigate(['/main']);
    } else {
      this.auth.onLogOut();
    }
  }
}
