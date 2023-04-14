import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { Usuarios } from 'src/app/models/usuarios';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
@Input() usuario:Usuario
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
    this.usuariosService.syncPutUsuarioToPromise(this.usuario).then(resp =>{
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
