import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAprobadoresPage } from './crear-aprobadores.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAprobadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAprobadoresPageRoutingModule {}
