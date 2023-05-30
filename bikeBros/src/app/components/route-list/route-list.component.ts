import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
// import { ReportService } from 'src/app/services/report.service';
import { LoadingController } from '@ionic/angular';
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

  searchTerm: string = '';

  selectedDifficulty: string = '';

  kmDistance: number = 0;
  public routes: any[] = []; // Arreglo para almacenar las rutas
  public currentPage: number = 1; // Página actual
  public itemsPerPage: number = 5; // Cantidad de elementos por página
  public isLoading: boolean = false; // Variable para controlar la carga de datos
  public totalItems: number;
  public totalPages: number;
  subscription: Subscription;

  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private comment: CommentsService,
    private modal: ModalController,
    private loadingController: LoadingController
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
    console.log(this.kmDistance);
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

  async getRoutes(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: 'Cargando...', // Puedes personalizar el mensaje aquí
      });
      await loading.present();

      this.routesSer
        .getAllRoutes(this.currentPage, this.itemsPerPage)
        .subscribe((data: any) => {
          console.log(data);
          this.routes = data.routes;
          this.totalItems = data.totalRoutes;
          this.totalPages = data.totalPages;
          console.log(this.totalItems);
          console.log(this.routes);

          loading.dismiss(); // Ocultar el spinner cuando se obtienen los datos
        });
    } catch (error) {
      console.error(error);
      // loading.dismiss(); // Ocultar el spinner en caso de error
    }
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
    if (!this.isLoading && this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.currentPage++;
      console.log(this.currentPage);

      this.routesSer
        .getAllRoutes(this.currentPage, this.itemsPerPage)
        .subscribe((data: any) => {
          // Verificar si hay datos retornados por la solicitud
          if (data && data.routes && data.routes.length > 0) {
            // Agregar los nuevos elementos al arreglo existente
            this.routes = this.routes.concat(data.routes);
          }

          this.isLoading = false;
          event.target.complete();
        });
    } else {
      event.target.complete();
    }
  }

  updateKmDistance() {
    console.log(this.kmDistance); // Verifica si se muestra el valor actualizado en la consola
  }

  // Para mostrar una imagen de carga mientras se muestran los datos.
  async showSpinner() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }
}
