import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionAnticipoPage } from './liquidacion-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionAnticipoPageRoutingModule {}
