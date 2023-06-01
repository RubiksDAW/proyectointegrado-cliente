import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
// import { ReportService } from 'src/app/services/report.service';
import { LoadingController } from '@ionic/angular';
import { RouteFilterDistancePipe } from 'src/app/pipes/route-filter-distance.pipe';
import { RouteFilterLevelPipe } from 'src/app/pipes/route-filter-level.pipe';
import { RoutesService } from 'src/app/services/routes.service';
import { RoutesFilterPipe } from '../../pipes/routes-filter.pipe';
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

  displayedRoutes: any[] = [];

  filteredRoutes: any[] = [];

  subscription: Subscription;

  selectedDistance: number;
  selectedLevel: string;
  selectedSearchTerm: string;

  constructor(
    private routesSer: RoutesService,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private comment: CommentsService,
    private modal: ModalController,
    private loadingController: LoadingController,
    private routeFilterDistance: RouteFilterDistancePipe,
    private routeFilterLevel: RouteFilterLevelPipe,
    private routesFilter: RoutesFilterPipe
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

  // async getRoutes(): Promise<void> {
  //   try {
  //     const loading = await this.loadingController.create({
  //       message: 'Cargando...', // Puedes personalizar el mensaje aquí
  //     });
  //     await loading.present();

  //     this.routesSer
  //       .getAllRoutes(this.currentPage, this.itemsPerPage)
  //       .subscribe((data: any) => {
  //         console.log(data);
  //         this.routes = data.routes;
  //         this.totalItems = data.totalRoutes;
  //         this.totalPages = data.totalPages;
  //         console.log(data.totalRoutes);
  //         console.log(this.routes);

  //         loading.dismiss(); // Ocultar el spinner cuando se obtienen los datos
  //       });
  //   } catch (error) {
  //     console.error(error);
  //     // loading.dismiss(); // Ocultar el spinner en caso de error
  //   }
  // }

  // async getRoutes() {
  //   await this.showSpinner(); // Mostrar spinner loader

  //   this.routesSer.getAllRoutes().subscribe(async (data: any) => {
  //     console.log(data);
  //     this.routes = data.routes;
  //     this.displayedRoutes = this.routes.slice(0, 5);
  //     console.log(this.displayedRoutes);

  //     await this.hideSpinner(); // Ocultar spinner loader una vez recibidos los datos
  //   });
  // }
  // Método para aplicar los filtros en this.routes según las selecciones del usuario
  applyFiltersToRoutes() {
    // Aplica los filtros en this.routes según las selecciones del usuario
    this.filteredRoutes = this.routes;
    if (this.selectedDistance) {
      this.filteredRoutes = this.routeFilterDistance.transform(
        this.filteredRoutes,
        this.selectedDistance
      );
    }
    if (this.selectedLevel) {
      this.filteredRoutes = this.routeFilterLevel.transform(
        this.filteredRoutes,
        this.selectedLevel
      );
    }
    if (this.selectedSearchTerm) {
      this.filteredRoutes = this.routesFilter.transform(
        this.filteredRoutes,
        this.selectedSearchTerm
      );
    }
  }

  // Método para aplicar los filtros en this.displayedRoutes según las selecciones del usuario
  applyFiltersToDisplayedRoutes() {
    // Aplica los filtros en this.displayedRoutes según las selecciones del usuario
    this.displayedRoutes = this.routes.slice(0, 5);
    if (this.selectedDistance) {
      this.displayedRoutes = this.routeFilterDistance.transform(
        this.displayedRoutes,
        this.selectedDistance
      );
    }
    if (this.selectedLevel) {
      this.displayedRoutes = this.routeFilterLevel.transform(
        this.displayedRoutes,
        this.selectedLevel
      );
    }
    if (this.selectedSearchTerm) {
      this.displayedRoutes = this.routesFilter.transform(
        this.displayedRoutes,
        this.selectedSearchTerm
      );
    }
  }

  // Método para obtener las rutas
  async getRoutes() {
    // await this.showSpinner(); // Mostrar el cargador de espera

    this.routesSer.getAllRoutes().subscribe(async (data: any) => {
      console.log(data);
      this.routes = data.routes;

      this.applyFiltersToRoutes(); // Aplicar filtros en this.routes
      this.applyFiltersToDisplayedRoutes(); // Aplicar filtros en this.displayedRoutes

      // await this.hideSpinner(); // Ocultar el cargador de espera una vez recibidos los datos
    });
  }

  filterRoutes(): void {
    // Realizar el filtrado en this.routes y guardar el resultado en un nuevo array
    const filteredRoutes = this.routes.filter((ruta) => {
      return (
        (ruta.name &&
          ruta.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (ruta.location &&
          ruta.location.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });

    // Aplicar el filtrado a this.displayedRoutes
    this.displayedRoutes = filteredRoutes.slice(0, 5);
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

  // loadMoreData(event: any): void {
  //   if (!this.isLoading && this.currentPage < this.totalPages) {
  //     this.isLoading = true;
  //     this.currentPage++;
  //     console.log(this.currentPage);

  //     this.routesSer
  //       .getAllRoutes(this.currentPage, this.itemsPerPage)
  //       .subscribe((data: any) => {
  //         // Verificar si hay datos retornados por la solicitud
  //         if (data && data.routes && data.routes.length > 0) {
  //           // Agregar los nuevos elementos al arreglo existente
  //           this.routes = this.routes.concat(data.routes);
  //         }

  //         this.isLoading = false;
  //         event.target.complete();
  //       });
  //   } else {
  //     event.target.complete();
  //   }
  // }

  // loadMoreData(event: any): void {
  //   setTimeout(() => {
  //     const startIndex = this.displayedRoutes.length;
  //     const endIndex = startIndex + 5;
  //     const moreRoutes = this.routes.slice(startIndex, endIndex);
  //     this.displayedRoutes = this.displayedRoutes.concat(moreRoutes);

  //     event.target.complete();
  //   }, 1000);
  // }
  loadMoreData(event: any): void {
    setTimeout(() => {
      const startIndex = this.displayedRoutes.length;
      const endIndex = startIndex + 5;
      const moreRoutes = this.filteredRoutes.slice(startIndex, endIndex);

      // Aplicar los filtros correspondientes a las nuevas rutas
      const filteredMoreRoutes = this.routeFilterDistance.transform(
        moreRoutes,
        this.selectedDistance
      );
      // Aplicar otros filtros según sea necesario

      // Agregar las rutas filtradas adicionales a displayedRoutes
      this.displayedRoutes = this.displayedRoutes.concat(filteredMoreRoutes);

      event.target.complete();
    }, 1000);
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

  async hideSpinner() {
    await this.loadingController.dismiss(); // Ocultar spinner loader
  }
}
