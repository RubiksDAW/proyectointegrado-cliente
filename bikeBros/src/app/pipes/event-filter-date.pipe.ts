import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventFilterDate',
})
export class EventFilterDatePipe implements PipeTransform {
  transform(events: any[], startDate: Date, endDate: Date): any[] {
    if (!events || !startDate || !endDate) {
      return events;
    }

    // Transformar las fechas a formato "yyyy-MM-dd"
    const formattedStartDate = this.formatDate(new Date(startDate));
    const formattedEndDate = this.formatDate(new Date(endDate));

    return events.filter((event) => {
      const eventDate = new Date(event.fecha);
      const formattedEventDate = this.formatDate(eventDate);
      return (
        formattedEventDate >= formattedStartDate &&
        formattedEventDate <= formattedEndDate
      );
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
