import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearMatrizAccesoPage } from './crear-matriz-acceso.page';

const routes: Routes = [
  {
    path: '',
    component: CrearMatrizAccesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearMatrizAccesoPageRoutingModule {}
