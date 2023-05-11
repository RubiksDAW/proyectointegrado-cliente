import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletedRoutePage } from './deleted-route.page';

const routes: Routes = [
  {
    path: '',
    component: DeletedRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletedRoutePageRoutingModule {}
