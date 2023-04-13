import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroAnticiposPage } from './registro-anticipos.page';

 
const routes: Routes = [
  {
    path: '',
    component: RegistroAnticiposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroAnticiposPageRoutingModule {}
