import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearDepartamentoPage } from './crear-departamento.page';

const routes: Routes = [
  {
    path: '',
    component: CrearDepartamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearDepartamentoPageRoutingModule {}
