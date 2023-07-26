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
    path: 'crear-departamento',
    loadChildren: () => import('./pages/crear-departamento/crear-departamento.module').then( m => m.CrearDepartamentoPageModule)
  },
  {
    path: 'editar-departamento',
    loadChildren: () => import('./pages/editar-departamento/editar-departamento.module').then( m => m.EditarDepartamentoPageModule)
  },
  {
    path: 'linea-gastos',
    loadChildren: () => import('./pages/linea-gastos/linea-gastos.module').then( m => m.LineaGastosPageModule)
  },
  {
    path: 'lista-usuarios',
    loadChildren: () => import('./pages/lista-usuarios/lista-usuarios.module').then( m => m.ListaUsuariosPageModule)
  },
  {
    path: 'liquidacion-anticipo',
    loadChildren: () => import('./pages/liquidacion-anticipo/liquidacion-anticipo.module').then( m => m.LiquidacionAnticipoPageModule)
  },
  {
    path: 'sobrantes',
    loadChildren: () => import('./pages/sobrantes/sobrantes.module').then( m => m.SobrantesPageModule)
  },
  {
    path: 'liquidacion-sin-anticipo',
    loadChildren: () => import('./pages/liquidacion-sin-anticipo/liquidacion-sin-anticipo.module').then( m => m.LiquidacionSinAnticipoPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },
  {
    path: 'editar-gasto',
    loadChildren: () => import('./pages/editar-gasto/editar-gasto.module').then( m => m.EditarGastoPageModule)
  },  {
    path: 'devoluciones',
    loadChildren: () => import('./pages/devoluciones/devoluciones.module').then( m => m.DevolucionesPageModule)
  },
  {
    path: 'linea-gastos-sin-anticipo',
    loadChildren: () => import('./pages/linea-gastos-sin-anticipo/linea-gastos-sin-anticipo.module').then( m => m.LineaGastosSinAnticipoPageModule)
  },
  {
    path: 'filtro-gastos-sin-anticipo',
    loadChildren: () => import('./pages/filtro-gastos-sin-anticipo/filtro-gastos-sin-anticipo.module').then( m => m.FiltroGastosSinAnticipoPageModule)
  },
  {
    path: 'editar-gasto-sin-anticipo',
    loadChildren: () => import('./pages/editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.module').then( m => m.EditarGastoSinAnticipoPageModule)
  },
  {
    path: 'visor-archivos',
    loadChildren: () => import('./pages/visor-archivos/visor-archivos.module').then( m => m.VisorArchivosPageModule)
  }






  




 







 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
