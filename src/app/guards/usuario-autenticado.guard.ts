import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { AlertasService } from '../services/alertas.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAutenticadoGuard implements CanLoad {
  constructor(
    private usuariosService:UsuariosService,
    public router:Router,
    public alertasService:AlertasService
   
  ){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): boolean | UrlTree  {
      
 
    if( localStorage.getItem('usuario')){
    if(!this.usuariosService.usuario){
      this.usuariosService.usuario = JSON.parse(localStorage.getItem('usuario'));
      return  this.router.createUrlTree([localStorage.getItem('currentUrl')]);
    }

    
     
      return true;
    }else {
      this.alertasService.message('D1','Inicia sesión para continuar');
     return this.router.createUrlTree(['/inicio-sesion']);
    }
  }
}
