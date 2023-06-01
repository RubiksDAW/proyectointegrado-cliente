import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { MainPage } from './main.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    PipesModule,
  ],
  declarations: [MainPage],
})
export class MainPageModule {}
