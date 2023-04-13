import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlDepartamentosPage } from './control-departamentos.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDepartamentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDepartamentosPageRoutingModule {}
