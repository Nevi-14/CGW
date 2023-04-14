import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { MatrizAccesoGuard } from './guards/matriz-acceso.guard';
import { UsuarioAutenticadoGuard } from './guards/usuario-autenticado.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full'
  },
  {
    path: 'calendario-popover',
    loadChildren: () => import('./pages/calendario-popover/calendario-popover.module').then( m => m.CalendarioPopoverPageModule)
  },

  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    canLoad:[UsuarioAutenticadoGuard],
    canActivate:[MatrizAccesoGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'estado-cuenta',
    loadChildren: () => import('./pages/estado-cuenta/estado-cuenta.module').then( m => m.EstadoCuentaPageModule)
  },
  {
    path: 'filtrar-gastos',
    loadChildren: () => import('./pages/filtrar-gastos/filtrar-gastos.module').then( m => m.FiltrarGastosPageModule)
  },
  {
    path: 'crear-adelanto-viaticos',
    loadChildren: () => import('./pages/crear-adelanto-viaticos/crear-adelanto-viaticos.module').then( m => m.CrearAdelantoViaticosPageModule)
  },
  {
    path: 'liquidacion-viaticos',
    loadChildren: () => import('./pages/liquidacion-viaticos/liquidacion-viaticos.module').then( m => m.LiquidacionViaticosPageModule)
  },
  {
    path: 'crear-matriz-acceso',
    loadChildren: () => import('./pages/crear-matriz-acceso/crear-matriz-acceso.module').then( m => m.CrearMatrizAccesoPageModule)
  },
  {
    path: 'editar-matriz-acceso',
    loadChildren: () => import('./pages/editar-matriz-acceso/editar-matriz-acceso.module').then( m => m.EditarMatrizAccesoPageModule)
  },
  {
    path: 'crear-usuario',
    loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then( m => m.CrearUsuarioPageModule)
  },
  {
    path: 'editar-usuario',
    loadChildren: () => import('./pages/editar-usuario/editar-usuario.module').then( m => m.EditarUsuarioPageModule)
  },
  {
    path: 'crear-role',
    loadChildren: () => import('./pages/crear-role/crear-role.module').then( m => m.CrearRolePageModule)
  },
  {
    path: 'editar-role',
    loadChildren: () => import('./pages/editar-role/editar-role.module').then( m => m.EditarRolePageModule)
  },
  {
    path: 'crear-departamento',
    loadChildren: () => import('./pages/crear-departamento/crear-departamento.module').then( m => m.CrearDepartamentoPageModule)
  },
  {
    path: 'editar-departamento',
    loadChildren: () => import('./pages/editar-departamento/editar-departamento.module').then( m => m.EditarDepartamentoPageModule)
  },
  




 







 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
