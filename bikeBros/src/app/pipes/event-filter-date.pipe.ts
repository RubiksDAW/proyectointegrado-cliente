import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventFilterDate',
})
export class EventFilterDatePipe implements PipeTransform {
  transform(events: any[], startDate: Date, endDate: Date): any[] {
    if (!events || !startDate || !endDate) {
      return events;
    }

    return events.filter((event) => {
      const eventDate = new Date(event.fecha);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }
}
