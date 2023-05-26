import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { BoxCommentsComponent } from './box-comments/box-comments.component';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { EditEventModalComponent } from './edit-event-modal/edit-event-modal.component';
import { EditRouteModalComponent } from './edit-route-modal/edit-route-modal.component';
import { EventListComponent } from './event-list/event-list.component';
import { FavListComponent } from './fav-list/fav-list.component';
import { InputCommentComponent } from './input-comment/input-comment.component';
import { JoinedEventsListComponent } from './joined-events-list/joined-events-list.component';
import { RegisterEventModalComponent } from './register-event-modal/register-event-modal.component';
import { RegisterRouteModalComponent } from './register-route-modal/register-route-modal.component';
import { ReportEventListComponent } from './report-event-list/report-event-list.component';
import { ReportEventComponent } from './report-event/report-event.component';
import { ReportRouteListComponent } from './report-route-list/report-route-list.component';
import { ReportComponent } from './report/report.component';
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
    InputCommentComponent,
    BoxCommentsComponent,
    EditRouteModalComponent,
    FavListComponent,
    EditEventModalComponent,
    JoinedEventsListComponent,
    ReportComponent,
    ReportEventComponent,
    ReportRouteListComponent,
    ReportEventListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    PipesModule,
  ],
  exports: [
    ConfirmDeleteAccountComponent,
    RegisterRouteModalComponent,
    RouteListComponent,
    RouteMapComponent,
    EventListComponent,
    RegisterEventModalComponent,
    InputCommentComponent,
    BoxCommentsComponent,
    EditRouteModalComponent,
    FavListComponent,
    EditEventModalComponent,
    JoinedEventsListComponent,
    ReportComponent,
    ReportEventComponent,
    ReportRouteListComponent,
    ReportEventListComponent,
  ],
})
export class ComponentsModule {}
