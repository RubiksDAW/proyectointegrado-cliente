import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageModule } from '../login/login.module';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterPageRoutingModule,
    LoginPageModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
