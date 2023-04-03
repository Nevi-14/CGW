import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlEstadosCuentaPage } from './control-estados-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: ControlEstadosCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlEstadosCuentaPageRoutingModule {}
