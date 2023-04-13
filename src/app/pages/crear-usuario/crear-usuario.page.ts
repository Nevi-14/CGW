import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  usuario  = {
    id : null,
      usuario:null,
       empleado:'new',
       nombre:null,
      clave: null,
      correo:null,
      estatus:true,
      fecha:new Date()
  }
  constructor(
public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
    
  }


  post(){
    console.log(this.usuario)
    this.alertasService.presentaLoading('guardando cambios..')
    this.usuariosService.syncPostUsuarioToPromise(this.usuario).then(resp =>{
   this.usuariosService.syncGetUsuariosToPromise().then(usuarios =>{
    this.usuariosService.usuarios = usuarios;
    this.modalCtrl.dismiss();
    this.alertasService.loadingDissmiss();
   }, error =>{
    this.alertasService.loadingDissmiss();
  })
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
