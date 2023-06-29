import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosSinAnticipoPage } from './gastos-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: GastosSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosSinAnticipoPageRoutingModule {}
