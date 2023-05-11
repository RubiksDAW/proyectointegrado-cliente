import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessRoutePageRoutingModule } from './success-route-routing.module';

import { SuccessRoutePage } from './success-route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessRoutePageRoutingModule
  ],
  declarations: [SuccessRoutePage]
})
export class SuccessRoutePageModule {}
