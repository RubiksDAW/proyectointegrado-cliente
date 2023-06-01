import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { RouteFilterDistancePipe } from './pipes/route-filter-distance.pipe';
import { RouteFilterLevelPipe } from './pipes/route-filter-level.pipe';
import { RoutesFilterPipe } from './pipes/routes-filter.pipe';
// import { EventFilterPipe } from './event-filter.pipe';
// import { ReportService } from './services/report.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuard,
    SocialSharing,
    RoutesFilterPipe,
    RouteFilterDistancePipe,
    RouteFilterLevelPipe,
    // ReportService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
