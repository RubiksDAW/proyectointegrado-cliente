import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessRoutePage } from './success-route.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessRoutePageRoutingModule {}
