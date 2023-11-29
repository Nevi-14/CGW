import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { AlertasService } from '../services/alertas.service';
import {filter} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrizAccesoGuard implements CanActivate {
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  constructor(
    private usuariosService:UsuariosService,
    public router:Router,
    public alertasService:AlertasService
  ){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any {

   this.currentUrl = this.router.url;
   this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    )
        .subscribe((event:any) => {
            let url = event.urlAfterRedirects ;
            localStorage.setItem('currentUrl',url)
        
            if(!this.usuariosService.usuario) return false;
            this.usuariosService.syncGetUsuarioMatrizAccesosToPromise(this.usuariosService.usuario.id).then( accesos =>{
console.log(this.currentUrl, 'current module')
this.usuariosService.accesoModulos  = [];
this.usuariosService.accesoModulos = accesos;
if(this.currentUrl == '/inicio-sesion' || this.currentUrl == '/inicio/detalle' || this.currentUrl == '/inicio/liquidacion-gastos-sin-anticipo' || this.currentUrl == '/inicio/liquidacion-anticipo' ) return true


let indexControlAnticipos = accesos.findIndex(e => e.ruta == '/inicio/control-anticipos')
if(indexControlAnticipos >=0 &&  this.currentUrl == '/inicio/registro-anticipos' || indexControlAnticipos >=0 &&  this.currentUrl == '/inicio/detalle-anticipo' ) {
  this.usuariosService.moduloAcceso = null;
  this.usuariosService.moduloAcceso = accesos[indexControlAnticipos];
  return true;
}
let index = accesos.findIndex( e => e.ruta == this.currentUrl);

              console.log('accesos',accesos)
              if(index >= 0){
                this.usuariosService.moduloAcceso = null;
                this.usuariosService.moduloAcceso = accesos[index];
             //this.alertasService.message('Ruta Encontrada',url)
            //  this.router.navigateByUrl(this.previousUrl)
                return true;
              }else {
                this.alertasService.message('D1', `Acceso denegado - contacte al administrador para el  acceso al modulo.`)
                this.router.navigateByUrl(this.previousUrl)
              }
            }, error =>{
              this.alertasService.message('D1','Error cargando permisos');
            })
     
         // this.alertasService.message('Allowed URL',this.currentUrl)
          return true;
        
        });
    
        return true; 

  }
  
}
