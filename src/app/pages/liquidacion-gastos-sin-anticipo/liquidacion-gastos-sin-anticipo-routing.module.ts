import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionGastosSinAnticipoPage } from './liquidacion-gastos-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionGastosSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionGastosSinAnticipoPageRoutingModule {}
