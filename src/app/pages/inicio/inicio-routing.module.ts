import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children:[
      {
        path: '',
        redirectTo: '/inicio/detalle',
        pathMatch: 'full'
      },
      {
        path: 'detalle',
        loadChildren: () => import('../detalle/detalle.module').then( m => m.DetallePageModule)
      },
      {
        path: 'control-viaticos',
        loadChildren: () => import('../control-viaticos/control-viaticos.module').then( m => m.ControlViaticosPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'control-anticipos',
        loadChildren: () => import('../control-adelanto-viaticos/control-adelanto-viaticos.module').then( m => m.ControlAdelantoViaticosPageModule)
      },
      {
        path: 'adelanto-viaticos',
        loadChildren: () => import('../adelanto-viaticos/adelanto-viaticos.module').then( m => m.AdelantoViaticosPageModule)
      },
      {
        path: 'control-estados-cuenta',
        loadChildren: () => import('../control-estados-cuenta/control-estados-cuenta.module').then( m => m.ControlEstadosCuentaPageModule)
      }
    ]
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
