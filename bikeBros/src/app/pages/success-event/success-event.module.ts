import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessEventPageRoutingModule } from './success-event-routing.module';

import { SuccessEventPage } from './success-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessEventPageRoutingModule
  ],
  declarations: [SuccessEventPage]
})
export class SuccessEventPageModule {}
