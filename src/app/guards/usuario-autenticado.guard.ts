import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
    if( this.usuariosService.usuario){
     
      return true;
    }else {
      this.alertasService.message('DiOne','Inicia sesión para continuar');
     return this.router.createUrlTree(['/inicio-sesion']);
    }
  }
}
