import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  router: any;

  constructor(private auth: AuthService, private route: Router) {}

  // canActivate(): boolean {
  //   if (this.auth.loggedIn()) {
  //     return true;
  //   }else{
  //     return false
  //   }

  //   this.router.navigate(['/registro']);
  //   return false;
  // }

  /**
   * Este guard lo utilizamos para controlar la redirección entre rutas.
   * @param route
   * @param state
   * @returns
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario ha iniciado sesión
    if (this.auth.loggedIn()) {
      // Redirigir desde '/home' a otra ruta deseada ('/main' en este ejemplo)

      if (state.url === '/home') {
        this.route.navigate(['/main']);
        return false;
      }
      // Denegar acceso a las páginas de inicio de sesión o registro
      if (state.url === '/login' || state.url === '/register') {
        return false;
      }
    }
    // Permitir acceso a cualquier otra ruta
    return true;
  }
}
