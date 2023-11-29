import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltroSolicitudesPage } from './filtro-solicitudes.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroSolicitudesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroSolicitudesPageRoutingModule {}
