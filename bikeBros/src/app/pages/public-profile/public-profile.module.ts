import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicProfilePageRoutingModule } from './public-profile-routing.module';

import { PublicProfilePage } from './public-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicProfilePageRoutingModule
  ],
  declarations: [PublicProfilePage]
})
export class PublicProfilePageModule {}
