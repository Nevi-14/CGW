import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlMatrizAccesoPage } from './control-matriz-acceso.page';

const routes: Routes = [
  {
    path: '',
    component: ControlMatrizAccesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlMatrizAccesoPageRoutingModule {}
