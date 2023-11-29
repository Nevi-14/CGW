import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobadoresPage } from './aprobadores.page';

const routes: Routes = [
  {
    path: '',
    component: AprobadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AprobadoresPageRoutingModule {}
