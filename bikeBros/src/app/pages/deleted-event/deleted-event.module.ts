import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletedEventPageRoutingModule } from './deleted-event-routing.module';

import { DeletedEventPage } from './deleted-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletedEventPageRoutingModule
  ],
  declarations: [DeletedEventPage]
})
export class DeletedEventPageModule {}
