import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionViaticosPage } from './liquidacion-viaticos.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionViaticosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionViaticosPageRoutingModule {}
