import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletedRoutePageRoutingModule } from './deleted-route-routing.module';

import { DeletedRoutePage } from './deleted-route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletedRoutePageRoutingModule
  ],
  declarations: [DeletedRoutePage]
})
export class DeletedRoutePageModule {}
