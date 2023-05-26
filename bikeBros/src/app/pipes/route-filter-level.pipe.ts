import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '../interfaces/route.interface';

@Pipe({
  name: 'routesFilterLevel',
})
export class RouteFilterLevelPipe implements PipeTransform {
  transform(rutas: Route[], difficultyLevel: string): any[] {
    return rutas.filter((ruta) => {
      return (
        ruta.difficulty_level && ruta.difficulty_level.includes(difficultyLevel)
      );
    });
  }
}
