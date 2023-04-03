import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
    canLoad:[AuthGuard]
  },
  {
    path: 'control-viaticos',
    loadChildren: () => import('./pages/control-viaticos/control-viaticos.module').then( m => m.ControlViaticosPageModule)
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
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },  {
    path: 'crear-adelanto-viaticos',
    loadChildren: () => import('./pages/crear-adelanto-viaticos/crear-adelanto-viaticos.module').then( m => m.CrearAdelantoViaticosPageModule)
  },
  {
    path: 'detalle-adelanto-viatico',
    loadChildren: () => import('./pages/detalle-adelanto-viatico/detalle-adelanto-viatico.module').then( m => m.DetalleAdelantoViaticoPageModule)
  },
  {
    path: 'liquidacion-viaticos',
    loadChildren: () => import('./pages/liquidacion-viaticos/liquidacion-viaticos.module').then( m => m.LiquidacionViaticosPageModule)
  },









 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
