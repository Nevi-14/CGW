import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarMatrizAccesoPage } from './editar-matriz-acceso.page';

const routes: Routes = [
  {
    path: '',
    component: EditarMatrizAccesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarMatrizAccesoPageRoutingModule {}
