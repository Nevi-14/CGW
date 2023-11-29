import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { CorreoService } from 'src/app/services/correo.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage   {
  token = null;
  verificarCodigo = false;
  correo = '';
  codigo = '';

  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public router: Router,
    public correoService:CorreoService

  ) { }

  ionViewWillEnter() {
    this.limpiarDatos()
  }
  limpiarDatos() {
    this.token = null;
    this.verificarCodigo = false;
    this.correo = '';
    this.codigo = '';

  }

  verificarCodigos(fRecuperarContrasena: NgForm) {
    
    let data = fRecuperarContrasena.value;
    this.codigo = data.codigo
 
    if(!this.codigo) return this.alertasService.message('D1','Todos los campos son obligatorios!');
    this.alertasService.presentaLoading('Validando información..')
    if (this.codigo == this.token) {
       this.alertasService.loadingDissmiss();
       this.usuariosService.CorreoVerificacion = this.correo;
       this.token = null;
       this.correo = '';
       this.codigo = '';
      this.router.navigateByUrl('cambiar-contrasena', { replaceUrl: true })
    } else {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1', 'Codigo incorrecto.');
      return;
    }
  }

  obtenerCodigoDeSeguridad(fRecuperarContrasena: NgForm) {

    if (this.verificarCodigo) return this.verificarCodigos(fRecuperarContrasena);
    let data = fRecuperarContrasena.value;
    this.correo = data.Correo;
    if(!this.correo) return this.alertasService.message('D1','Todos los campos son obligatorios!');
    let token = String(new Date().getHours()) + String(new Date().getMinutes()) + String(new Date().getMilliseconds());
    this.token = token;
    let email = {
      toEmail:this.correo,
      file:null,
      subject:'Código de Verificación para Recuperación de Contraseña',
      body:`
      Ingresa este código en la página de recuperación de contraseña para continuar con el proceso: <strong>${token}</strong>
<br>

<ul>
<li>
Recuerda que este código de verificación es confidencial y solo debe ser utilizado para este proceso de recuperación de contraseña. No compartas este código con nadie por razones de seguridad.
</li>

<li>
Si no has solicitado esta recuperación de contraseña o consideras que has recibido este correo por error, te recomendamos que cambies la contraseña de tu cuenta de correo electrónico y nos lo notifiques inmediatamente.
</li>
 
<li>
Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte en [Correo o Teléfono de Soporte].

</li>

</ul>
  
 
 

Gracias por confiar en [Nombre de la Plataforma/Servicio]. Estamos aquí para ayudarte.
<br>
<br>
Saludos cordiales,
<br>
<br>
[Nombre del Equipo de Soporte]
<br>
<br>
[Nombre de la Plataforma/Servicio]
<br>
[Correo de Contacto de Soporte]
<br>
[Teléfono de Contacto de Soporte]
      `
        }
        this.alertasService.presentaLoading('Verificando informacion.')
        this.usuariosService.getUsuarioToPromise(this.correo).then((resp:any)=>{
        
          if(resp.length === 0){
            this.alertasService.loadingDissmiss();
            this.alertasService.message('D1', 'Lo sentimos algo salio mal');
            return;
          }
          return this.correoService.syncPostEmailToPromise(email).then((resp: any) => {
            this.alertasService.loadingDissmiss();
            if (resp != 500) {
              this.verificarCodigo = true;
              this.alertasService.message('D1', 'Se ha enviado un codigo de verificacion a su correo.')
              return
            }
      
            this.alertasService.message('D1', 'Lo sentimos algo salio mal.')
      
      
          }, error => {
            this.verificarCodigo = false;
            this.alertasService.loadingDissmiss();
            this.alertasService.message('D1', 'Lo sentimos algo salio mal.')
      
          })
        }, error =>{
          this.alertasService.loadingDissmiss();
          this.alertasService.message('D1', 'Lo sentimos algo salio mal.')
        })
  
  
  }


}
