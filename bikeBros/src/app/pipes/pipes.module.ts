import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventFilterDatePipe } from './event-filter-date.pipe';
import { EventFilterPipe } from './event-filter.pipe';
import { RouteFilterDistancePipe } from './route-filter-distance.pipe';
import { RouteFilterLevelPipe } from './route-filter-level.pipe';
import { RoutesFilterPipe } from './routes-filter.pipe';

@NgModule({
  declarations: [
    RoutesFilterPipe,
    RouteFilterLevelPipe,
    EventFilterPipe,
    RouteFilterDistancePipe,
    EventFilterDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    RoutesFilterPipe,
    RouteFilterLevelPipe,
    EventFilterPipe,
    RouteFilterDistancePipe,
    EventFilterDatePipe,
  ],
})
export class PipesModule {}
