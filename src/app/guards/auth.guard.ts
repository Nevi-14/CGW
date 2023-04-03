import { Injectable } from '@angular/core';
import { Router, CanLoad, ActivatedRoute } from '@angular/router';
import { AlertasService } from '../services/alertas.service';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(

    public router: Router,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public activatedRoute: ActivatedRoute
  ) {

  }
  canLoad() {

    const navigation = this.router.getCurrentNavigation();
    let url = '/';
    let storageUser:Usuario = JSON.parse(localStorage.getItem('usuario'));
 
    if (storageUser) {

      this.usuariosService.usuario = storageUser;
       url =  this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'inicio';
 
       //this.router.navigateByUrl(url);       
      return true;


    } else {

    

      if (navigation) {
        url = navigation.extractedUrl.toString();
      }
      this.router.navigate(['/inicio-sesion'], { queryParams: { returnto: url } })
      return false;

    }


  }
}
