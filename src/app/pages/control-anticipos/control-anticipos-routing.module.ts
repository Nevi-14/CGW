import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlAnticiposPage } from './control-anticipos.page';

 

const routes: Routes = [
  {
    path: '',
    component: ControlAnticiposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlAnticiposPageRoutingModule {}
