import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Route } from 'src/app/interfaces/route.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { RoutesService } from 'src/app/services/routes.service';
import { EditRouteModalComponent } from '../edit-route-modal/edit-route-modal.component';
@Component({
  selector: 'app-fav-list',
  templateUrl: './fav-list.component.html',
  styleUrls: ['./fav-list.component.scss'],
})
export class FavListComponent implements OnInit {
  routes$: Promise<Route[]>;
  comments: Comment[] = [];
  profileUser: any;
  roles: string[];
  showComment: boolean;
  commentStatus: { [routeId: string]: boolean } = {};
  userId: string;

  subscription: Subscription;
  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private comment: CommentsService,
    private modal: ModalController
  ) {}

  async ngOnInit() {
    this.userId = await this.auth.getProfileId();
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
    const authorRouteId = await this.routesSer.getRouteAuthorId(id);
    // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
    if (
      this.profileUser.roles.includes('ROLE_ADMIN') ||
      this.profileUser.id == authorRouteId
    ) {
      this.routesSer.deleteRouteById(id);
    } else {
      const alert = await this.alertController.create({
        header: 'Permiso denegado',
        message: 'Solo el creador o un Administrador pueden borrar la ruta',
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
  }

  showId() {
    this.auth.getProfileId();
  }

  toggleComment(routeId: string) {
    this.commentStatus[routeId] = !this.commentStatus[routeId];
  }

  async showRouteEditModal() {
    const modal = await this.modal.create({
      component: EditRouteModalComponent,
    });
    return await modal.present();
  }

  searchRoutes() {}

  getFavs() {
    this.routesSer.getUserFavoriteRouteIds(this.userId);
  }
}
