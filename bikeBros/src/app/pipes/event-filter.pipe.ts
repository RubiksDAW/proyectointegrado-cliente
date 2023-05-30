import { Pipe, PipeTransform } from '@angular/core';
import { EventResponse } from '../interfaces/event.interface';

@Pipe({
  name: 'eventFilter',
})
export class EventFilterPipe implements PipeTransform {
  transform(events: EventResponse[], searchTerm: string): any[] {
    if (!searchTerm) {
      return events;
    }

    if (searchTerm === '') {
      return events;
    }
    // console.log(searchTerm);
    searchTerm = searchTerm.toLowerCase().trim();

    return events.filter((event) => {
      return (
        event.ubicacion.toLowerCase().includes(searchTerm) ||
        event?.ruta?.name?.toLowerCase().includes(searchTerm)
      );
    });
  }
}
