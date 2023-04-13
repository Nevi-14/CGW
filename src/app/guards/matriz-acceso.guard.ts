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
            console.log(url)

          if(url == '/inicio/control-anticipos'){
            this.alertasService.message('Access Denied',url)
        //  this.router.navigateByUrl(this.previousUrl)
            return false;
          }
         // this.alertasService.message('Allowed URL',this.currentUrl)
          return true;
        
        });
    
        return true; 

  }
  
}
