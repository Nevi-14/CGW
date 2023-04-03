import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfiguracionesService } from '../../services/configuraciones';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  image = '../assets/imgs/devCodingLogo.svg';
  showPass = false;
  usuario: string = null;
  clave: string = null;
  logingURL = '';

  constructor( 
    public route: Router,
    private alertas: AlertasService,
    public usuariosService: UsuariosService,
    public activatedRoute: ActivatedRoute,
    public configuracionesService: ConfiguracionesService 
               
               
               ) { }

  ngOnInit() {
  }


  ionViewWillEnter(){
this.logingURL = this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'inicio';
this.configuracionesService.title = this.logingURL.split('/')[2];
 

  }

  loginMethod(){
    console.log(this.usuario);
    console.log(this.clave);
    this.alertas.presentaLoading('Cargando datos..');
    this.usuariosService.getUsuarioIdToPtomise(this.usuario).then(resp =>{
      console.log('resp', resp)
      this.alertas.loadingDissmiss();
      if(resp.length ==0){
     this.alertas.message('APP', 'Lo sentimos usuario o contraseña incorrectos..')
      }else if (resp[0].usuario == this.usuario  && resp[0].clave == this.clave){
        localStorage.setItem('usuario', JSON.stringify(resp[0]));
        this.usuariosService.usuario = resp[0]
        this.route.navigateByUrl(this.logingURL);
      }else{
        this.alertas.message('APP', 'Lo sentimos usuario o contraseña incorrectos..')
      }

    }, error =>{
      this.alertas.loadingDissmiss();


    })

 



/**
 * 
    this.usuariosService.syngGetUsersToPromise(this.usuario, this.clave).then(
      resp => {
        this.alertas.loadingDissmiss();
        if (resp.length > 0){
          console.log(resp);
          if (resp[0].Clave === this.clave){
            this.usuariosService.usuario = resp[0];
            this.route.navigate(['/inicio']);
          } else {
            this.alertas.message('ERROR', 'Usuario o clave incorrectos.');
          }
        } else {
          this.alertas.message('ERROR', 'Usuario o clave incorrectos.');
        }
      }, error => {
        this.alertas.loadingDissmiss();
        this.alertas.message('Error', `No se puede acceder a la BD. ${error.message}`);
      }
    )
 */

    //this.route.navigate(['/inicio']);
  }

}
