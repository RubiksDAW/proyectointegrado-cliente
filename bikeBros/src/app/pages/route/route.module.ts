import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { RoutePageRoutingModule } from './route-routing.module';
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
})
export class RoutePageModule {}
