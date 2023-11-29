import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfiguracionesService } from '../../services/configuraciones';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage {

  image = '../assets/imgs/devCodingLogo.svg';
  showPass = false;
  correo: string = null;
  clave: string = null;
  logingURL = '';

  constructor( public route: Router,
    private alertas: AlertasService,
    public usuariosService: UsuariosService,
    public activatedRoute: ActivatedRoute,
    public configuracionesService: ConfiguracionesService) { }

ionViewWillEnter(){
this.logingURL = this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'inicio/detalle';
this.configuracionesService.title = this.logingURL.split('/')[2];
  }
  login(fLogin: NgForm){
    this.correo =  fLogin.value.correo;
    this.clave =  fLogin.value.clave;
    console.log(this.correo);
    console.log(this.clave);
    this.alertas.presentaLoading('Cargando datos..');
    this.usuariosService.getUsuarioToPromise(this.correo).then(resp =>{
      this.alertas.loadingDissmiss();
      if(resp.length === 0){
     this.alertas.message('D1', 'Lo sentimos usuario o contraseña incorrectos..');
      }else if (resp[0].correo === this.correo  && resp[0].clave === this.clave){

        if(resp[0].estatus === false) return this.alertas.message('D1', 'Lo sentimos usuario inactivo..');
        if(resp[0].web === false) return this.alertas.message('D1', 'Lo sentimos usuario sin acceso a la web..' );
        localStorage.setItem('usuario', JSON.stringify(resp[0]));
        this.usuariosService.usuario = resp[0];
        this.route.navigateByUrl(this.logingURL);
      }else{
        this.alertas.message('D1', 'Lo sentimos usuario o contraseña incorrectos..');
      }

    }, error =>{
      this.alertas.message('D1', 'Lo sentimos algo salio mal');
      this.alertas.loadingDissmiss();

    });
  }

}
