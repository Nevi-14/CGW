import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentroCostosPage } from './centro-costos.page';

const routes: Routes = [
  {
    path: '',
    component: CentroCostosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentroCostosPageRoutingModule {}
