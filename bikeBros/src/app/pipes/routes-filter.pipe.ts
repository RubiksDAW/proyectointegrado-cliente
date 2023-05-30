import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '../interfaces/route.interface';

@Pipe({
  name: 'routesFilter',
})
export class RoutesFilterPipe implements PipeTransform {
  transform(rutas: Route[], searchTerm: string): any[] {
    if (!searchTerm) {
      return rutas;
    }
    if (searchTerm === '') {
      return rutas;
    }
    console.log(searchTerm);
    searchTerm = searchTerm.toLowerCase().trim();

    return rutas.filter((ruta) => {
      return (
        (ruta.name && ruta.name.toLowerCase().includes(searchTerm)) ||
        (ruta.location && ruta.location.toLowerCase().includes(searchTerm))
      );
    });
  }
}
