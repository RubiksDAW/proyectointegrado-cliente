import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { EventListComponent } from './event-list/event-list.component';
import { RegisterEventModalComponent } from './register-event-modal/register-event-modal.component';
import { RegisterRouteModalComponent } from './register-route-modal/register-route-modal.component';
import { RouteListComponent } from './route-list/route-list.component';
import { RouteMapComponent } from './route-map/route-map.component';

@NgModule({
  declarations: [
    ConfirmDeleteAccountComponent,
    RegisterRouteModalComponent,
    RouteListComponent,
    RouteMapComponent,
    EventListComponent,
    RegisterEventModalComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FormsModule],
  exports: [
    ConfirmDeleteAccountComponent,
    RegisterRouteModalComponent,
    RouteListComponent,
    RouteMapComponent,
    EventListComponent,
  ],
})
export class ComponentsModule {}
