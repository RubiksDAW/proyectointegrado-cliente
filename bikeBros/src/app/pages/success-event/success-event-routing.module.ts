import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessEventPage } from './success-event.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessEventPageRoutingModule {}
