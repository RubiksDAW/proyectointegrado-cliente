import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RoutesService } from 'src/app/services/routes.service';
import { Route } from '../../interfaces/route.interface';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent implements OnInit {
  // routes: Route[] = [];

  //Esto es un observable, cuando lleva un dollar
  routes$: Observable<Route[]>;
  profileUser: any;
  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;

        console.log(this.profileUser.roles);
      },
      error: (err) => {
        console.log(err);
      },
    });
    // this.routesSer.getAllRoutes().subscribe((routes)=>{

    //   this.routes = routes;
    //   console.log(routes)
    // })
    this.routes$ = this.routesSer.getAllRoutes().pipe(
      map((res) => {
        // Aqui podemos aplicar logica para modificar el array de objetos que nos llega
        res[0].name = 'Prueba';
        // Aqui debemos seguir devolviendo un array de rutas, ya que el observable es lo que espera
        return res;
      })
    );
  }
  // Almacena en localstorage la id de la ruta seleccionada.
  setIdRoute(id: string) {
    localStorage.setItem('id', id);
    console.log(id);
  }

  // Redirige a la ruta con la id correspondiente
  checkRoute(id: string) {
    this.router.navigate([`/route/${id}`]);
  }

  // En este metodo hacemos la comprobación previa de los roles que tiene el usuario actual,
  // en caso de ser admin puede borrar una ruta, sino no es posible borrarlas.
  async deleteRoute(id: string) {
    if (this.profileUser.roles.includes('ROLE_ADMIN')) {
      console.log(id);
      this.routesSer.deleteRouteById(id);
      console.log('hi');
    } else {
      const alert = await this.alertController.create({
        header: 'Permiso denegado',
        message: 'Inicia sesión como Administrador para borrar una ruta',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
          },
        ],
      });

      await alert.present();
    }
    this.routesSer.deleteRouteById(id);
  }
}
