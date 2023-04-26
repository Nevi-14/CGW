import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LineaGastosPage } from './linea-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: LineaGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineaGastosPageRoutingModule {}
