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


  




 







 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
