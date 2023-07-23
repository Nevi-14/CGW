import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltroGastosSinAnticipoPage } from './filtro-gastos-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroGastosSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroGastosSinAnticipoPageRoutingModule {}
