import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidacionFormularioPipe } from 'src/app/pipes/validacion-formulario.pipe';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as bcrypt from 'bcryptjs';  // npm install bcryptjs --save  &&  npm install @types/bcrypt --save-dev
@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage  {
  Contrasena = '';
  ConfirmarContrasena = '';
  constructor(
    public alertasService:AlertasService,
    public usuariosService:UsuariosService,
    public router:Router
  ) { }

  ionViewWillEnter() {
 
this.limpiarDatos();
  }
  limpiarDatos(){
    this.Contrasena = '';
    this.ConfirmarContrasena = '';
  }
  async cambiarContrasena(fCambiarContrasena:NgForm){

let continuar = await ValidacionFormularioPipe.prototype.transform(fCambiarContrasena);
if(!continuar)  return this.alertasService.message('D1','Todos los campos son obligatorios!');
this.alertasService.presentaLoading('Efectuado cambios!..')
let data = fCambiarContrasena.value;
this.Contrasena = data.Contrasena;
this.ConfirmarContrasena = data.ConfirmarContrasena;

 
    if(this.Contrasena != this.ConfirmarContrasena){
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1','Las contraseñas deben de coincidir');
    }else{
      this.usuariosService.getUsuarioToPromise(this.usuariosService.CorreoVerificacion).then((resp:any)=>{
        
        if(resp.length === 0){
          this.alertasService.loadingDissmiss();
          this.alertasService.message('D1', 'Lo sentimos algo salio mal');
          return;
        }
      let usuario = resp[0];
      usuario.clave =  this.Contrasena; //bcrypt.hashSync(this.Contrasena, 10);
      this.usuariosService.syncPutUsuarioToPromise(usuario).then(async(resp:any) =>{
        this.usuariosService.usuario = usuario;
        this.alertasService.loadingDissmiss();
        this.router.navigateByUrl('/inicio/detalle',{replaceUrl:true})
      })


      })

 
      //  
      // let userInfo = {
      //   email:this.usuariosService.CorreoVerificacion,
      //   password: bcrypt.hashSync(this.Contrasena, 10)
      // }
      
  /**
   *     this.usuariosService.syncPutUserPasswordToPromise(userInfo).then(async(resp:any) =>{
        
        let user = await this.usuariosService.syncGetUsuario(resp.user.Cod_Usuario);
        console.log(user, 'user')
 
       await this.alertasService.loadingDissmiss();
        this.alertasService.message('FUTPLAY', resp.message)
        this.router.navigateByUrl('/futplay/reservations',{replaceUrl:true})
      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('app', 'Lo sentimos algo salio mal')
      })
   */
    }
  }



}
