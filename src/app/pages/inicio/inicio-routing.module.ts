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
        loadChildren: () => import('../detalle/detalle.module').then( m => m.DetallePageModule),
      },
      {
        path: 'control-departamentos',
        loadChildren: () => import('../control-departamentos/control-departamentos.module').then( m => m.ControlDepartamentosPageModule)
      },
      {
        path: 'control-usuarios',
        loadChildren: () => import('../control-usuarios/control-usuarios.module').then( m => m.ControlUsuariosPageModule)
      },
    
      {
        path: 'control-matriz-acceso',
        loadChildren: () => import('../control-matriz-acceso/control-matriz-acceso.module').then( m => m.ControlMatrizAccesoPageModule)
      },
      {
        path: 'control-anticipos',
        loadChildren: () => import('../control-anticipos/control-anticipos.module').then( m => m.ControlAnticiposPageModule)
      },
      {
        path: 'registro-anticipos',
        loadChildren: () => import('../registro-anticipos/registro-anticipos.module').then( m => m.RegistroAnticiposPageModule)
      },
      {
        path: 'control-estados-cuenta',
        loadChildren: () => import('../control-estados-cuenta/control-estados-cuenta.module').then( m => m.ControlEstadosCuentaPageModule)
      },
      {
        path: 'detalle-anticipo',
        loadChildren: () => import('../detalle-anticipo/detalle-anticipo.module').then( m => m.DetalleAnticipoPageModule)
      },
      {
        path: 'gastos-sin-anticipo',
        loadChildren: () => import('../gastos-sin-anticipo/gastos-sin-anticipo.module').then( m => m.GastosSinAnticipoPageModule)
      },
    
    ]
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
