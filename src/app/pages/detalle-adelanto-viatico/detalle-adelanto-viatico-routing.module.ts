import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAdelantoViaticoPage } from './detalle-adelanto-viatico.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAdelantoViaticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAdelantoViaticoPageRoutingModule {}
