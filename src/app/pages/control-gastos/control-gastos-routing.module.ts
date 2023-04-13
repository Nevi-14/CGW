import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlGastosdPage } from './control-gastos.page';

 

const routes: Routes = [
  {
    path: '',
    component: ControlGastosdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlGastosPageRoutingModule {}
