import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRoutePageRoutingModule } from './create-route-routing.module';

import { ComponentsModule } from '../../../components/components.module';
import { CreateRoutePage } from './create-route.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRoutePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CreateRoutePage]
})
export class CreateRoutePageModule {}
