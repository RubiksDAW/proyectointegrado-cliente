import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '../interfaces/route.interface';

@Pipe({
  name: 'routeFilterDistance',
})
export class RouteFilterDistancePipe implements PipeTransform {
  transform(rutas: Route[], kmDistance: number): any[] {
    if (!kmDistance) {
      return rutas;
    }

    if (kmDistance === 0) {
      return rutas;
    }

    console.log(kmDistance);
    return rutas.filter((ruta) => {
      return ruta.distance && ruta.distance <= kmDistance;
    });
  }
}
