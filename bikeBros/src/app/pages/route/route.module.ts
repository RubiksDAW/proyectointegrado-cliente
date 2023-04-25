import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutePageRoutingModule } from './route-routing.module';

import { ComponentsModule } from '../../components/components.module';
import { RoutePage } from './route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [RoutePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoutePageModule {}
