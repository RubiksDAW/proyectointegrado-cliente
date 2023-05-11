import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletedEventPage } from './deleted-event.page';

const routes: Routes = [
  {
    path: '',
    component: DeletedEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletedEventPageRoutingModule {}
