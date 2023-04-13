import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlRolesPage } from './control-roles.page';

const routes: Routes = [
  {
    path: '',
    component: ControlRolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlRolesPageRoutingModule {}
