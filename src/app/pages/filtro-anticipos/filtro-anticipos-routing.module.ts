import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltroAnticiposPage } from './filtro-anticipos.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroAnticiposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroAnticiposPageRoutingModule {}
