import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
// import { ReportService } from 'src/app/services/report.service';
import { RoutesService } from 'src/app/services/routes.service';
import { EditRouteModalComponent } from '../edit-route-modal/edit-route-modal.component';
import { ReportRouteListComponent } from '../report-route-list/report-route-list.component';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent implements OnInit {
  comments: Comment[] = [];

  profileUser: any;

  roles: string[];

  showComment: boolean;

  commentStatus: { [routeId: string]: boolean } = {};

  searchTerm: string;

  selectedDifficulty: string;

  public routes: any[] = []; // Arreglo para almacenar las rutas
  public currentPage: number = 1; // Página actual
  public itemsPerPage: number = 5; // Cantidad de elementos por página
  public totalItems: number = 100; // Total de elementos disponibles
  public isLoading: boolean = false; // Variable para controlar la carga de datos

  subscription: Subscription;

  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private comment: CommentsService,
    // private report: ReportService,
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
  // async deleteRoute(id: string) {
  //   const authorRouteId = await this.routesSer.getRouteAuthorId(id);
  //   // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
  //   if (
  //     this.profileUser.roles.includes('ROLE_ADMIN') ||
  //     this.profileUser.id == authorRouteId
  //   ) {
  //     // this.routesSer.deleteRouteById(id);
  //     this.routesSer.deleteRouteById(id).subscribe((data: any) => {
  //       this.routes = data.routes;
  //       console.log(this.routes);
  //     });
  //     this.router.navigateByUrl('/deleted-route');
  //   } else {
  //     const alert = await this.alertController.create({
  //       header: 'Permiso denegado',
  //       message: 'Solo el creador o un Administrador pueden borrar la ruta',
  //       buttons: [
  //         {
  //           text: 'Aceptar',
  //           role: 'cancel',
  //           cssClass: 'secondary',
  //         },
  //       ],
  //     });

  //     await alert.present();
  //   }
  // }

  async deleteRoute(id: string) {
    const authorRouteId = await this.routesSer.getRouteAuthorId(id);
    // Controlamos que solo pueda borrar la ruta el usuario creador o un administrador
    if (
      this.profileUser.roles.includes('ROLE_ADMIN') ||
      this.profileUser.id == authorRouteId
    ) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Está seguro de que desea eliminar esta ruta?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.routesSer.deleteRouteById(id).subscribe((data: any) => {
                this.routes = data.routes;
                console.log(this.routes);
              });
              this.router.navigateByUrl('/deleted-route');
            },
          },
        ],
      });
      await alert.present();
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

  getRoutes(): void {
    this.routesSer.getAllRoutes().subscribe((data: any) => {
      console.log(data);
      this.routes = data.routes;
      // this.totalItems = this.routes.length;
      console.log(this.totalItems);
      console.log(this.routes);
    });
  }

  async openReport() {
    const modal = await this.modal.create({
      component: ReportComponent,
    });
    return await modal.present();
  }

  async openReportList(id: string) {
    const modal = await this.modal.create({
      component: ReportRouteListComponent,
      componentProps: {
        routeId: id, // Reemplaza 'ID_DE_LA_RUTA' con el valor real de la ID de la ruta
      },
    });
    return await modal.present();
  }

  loadMoreData(event: any): void {
    console.log(this.routes.length);
    console.log(this.totalItems);
    if (!this.isLoading && this.routes.length < this.totalItems) {
      console.log(this.searchTerm);
      console.log(this.selectedDifficulty);

      this.isLoading = true;
      this.currentPage++;
      console.log(this.currentPage);

      // Lógica para obtener más elementos, por ejemplo, haciendo otra solicitud al servicio
      this.routesSer
        .getAllRoutes(
          this.searchTerm,
          this.selectedDifficulty,
          this.currentPage,
          this.itemsPerPage
        )
        .subscribe((data: any) => {
          // Agregar los nuevos elementos al arreglo existente
          this.routes = this.routes.concat(data.routes);
          console.log(this.routes);
          this.isLoading = false;

          // Completar la acción de carga infinita
          event.target.complete();
        });
    } else {
      // Completar la acción de carga infinita si no hay más elementos
      event.target.complete();
    }
  }
}
