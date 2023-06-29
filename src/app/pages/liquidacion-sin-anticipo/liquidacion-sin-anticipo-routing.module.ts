import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionSinAnticipoPage } from './liquidacion-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionSinAnticipoPageRoutingModule {}
