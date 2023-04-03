import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAdelantoViaticosPage } from './crear-adelanto-viaticos.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAdelantoViaticosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAdelantoViaticosPageRoutingModule {}
