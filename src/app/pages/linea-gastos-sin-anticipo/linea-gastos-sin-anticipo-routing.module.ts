import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LineaGastosSinAnticipoPage } from './linea-gastos-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: LineaGastosSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineaGastosSinAnticipoPageRoutingModule {}
