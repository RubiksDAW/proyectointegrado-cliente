import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { RoutesService } from 'src/app/services/routes.service';
import { Route } from '../../interfaces/route.interface';
import { EditRouteModalComponent } from '../edit-route-modal/edit-route-modal.component';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent implements OnInit {
  // routes: Route[] = [];
  @ViewChild(IonSlides) slides: IonSlides;
  //Esto es un observable, cuando lleva un dollar
  routes$: Observable<Route[]>;
  comments: Comment[] = [];
  profileUser: any;
  roles: string[];
  showComment: boolean;
  commentStatus: { [routeId: string]: boolean } = {};

  searchTerm: string;
  selectedDifficulty: string;

  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private comment: CommentsService,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;
        // console.log(response);
        this.roles = this.profileUser.roles;
        console.log(this.profileUser.roles);
        console.log(this.roles);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.routes$ = this.routesSer.getAllRoutes().pipe(
      map((res) => {
        // Aqui podemos aplicar logica para modificar el array de objetos que nos llega
        console.log(res);
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
    const authorRouteId = await this.routesSer.getRouteAuthorId(id);
    // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
    if (
      this.profileUser.roles.includes('ROLE_ADMIN') ||
      this.profileUser.id == authorRouteId
    ) {
      this.routesSer.deleteRouteById(id);
      this.router.navigateByUrl('/deleted-route');
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

  searchRoutes() {
    console.log(this.searchTerm);
    this.routes$ = this.routesSer
      .getAllRoutes(this.searchTerm, this.selectedDifficulty)
      .pipe(
        map((res) => {
          // Aquí podemos aplicar lógica para modificar el array de objetos que nos llega
          console.log(res);
          // Aquí debemos seguir devolviendo un array de rutas, ya que el observable es lo que espera
          return res;
        })
      );

    console.log(this.routes$);
  }

  nextSlide() {
    console.log(this.slides);
    console.log('ey');
    this.slides.slideNext();
  }

  prevSlide() {
    this.slides.slidePrev();
  }
}
