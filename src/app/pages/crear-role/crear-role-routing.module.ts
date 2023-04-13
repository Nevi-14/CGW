import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearRolePage } from './crear-role.page';

const routes: Routes = [
  {
    path: '',
    component: CrearRolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearRolePageRoutingModule {}
