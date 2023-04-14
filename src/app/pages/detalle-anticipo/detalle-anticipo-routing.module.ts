import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAnticipoPage } from './detalle-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAnticipoPageRoutingModule {}
