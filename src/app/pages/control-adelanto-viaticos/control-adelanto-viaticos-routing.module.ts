import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlAdelantoViaticosPage } from './control-adelanto-viaticos.page';

const routes: Routes = [
  {
    path: '',
    component: ControlAdelantoViaticosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlAdelantoViaticosPageRoutingModule {}
