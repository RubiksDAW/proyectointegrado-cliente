import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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

  comments: Comment[] = [];
  profileUser: any;
  roles: string[];
  showComment: boolean;
  commentStatus: { [routeId: string]: boolean } = {};

  searchTerm: string;
  selectedDifficulty: string;

  routes: Route[] = [];
  // routes$: Observable<Route[]>;
  subscription: Subscription;

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

    this.getRoutes();
    this.subscription = this.routesSer.refresh$.subscribe(() => {
      this.getRoutes();
    });

    console.log(this.subscription);
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
      // this.routesSer.deleteRouteById(id);
      this.routesSer.deleteRouteById(id).subscribe((data: any) => {
        this.routes = data.routes;
        console.log(this.routes);
      });
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
  // Meotodo para controlar que se muestre o no la sección de comentarios.
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
    // console.log(this.searchTerm);
    // this.routes$ = this.routesSer
    //   .getAllRoutes(this.searchTerm, this.selectedDifficulty)
    //   .pipe(
    //     map((res) => {
    //       // Aquí podemos aplicar lógica para modificar el array de objetos que nos llega
    //       console.log(res);
    //       // Aquí debemos seguir devolviendo un array de rutas, ya que el observable es lo que espera
    //       return res;
    //     })
    //   );

    // console.log(this.routes$);
    this.routesSer
      .getAllRoutes(this.searchTerm, this.selectedDifficulty)
      .subscribe((data: any) => {
        this.routes = data.routes;
      });
  }

  nextSlide() {
    console.log(this.slides);
    console.log('ey');
    this.slides.slideNext();
  }

  prevSlide() {
    this.slides.slidePrev();
  }

  getRoutes(): void {
    this.routesSer.getAllRoutes().subscribe((data: any) => {
      this.routes = data.routes;
      console.log(this.routes);
    });
  }
}
