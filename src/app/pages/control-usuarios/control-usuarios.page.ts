import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearUsuarioPage } from '../crear-usuario/crear-usuario.page';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.page.html',
  styleUrls: ['./control-usuarios.page.scss'],
})
export class ControlUsuariosPage implements OnInit {
  isOpen:boolean = false;
  constructor(

public usuariosSerice:UsuariosService,
public alertasServic:AlertasService,
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
    this.alertasServic.presentaLoading('cargando datos..');
    this.usuariosSerice.syncGetUsuariosToPromise().then(usuarios=>{
      this.alertasServic.loadingDissmiss();
      this.usuariosSerice.usuarios = usuarios;
    }, error =>{
      this.alertasServic.loadingDissmiss();
    })
  }


  async crearUsuario( ){
    this.isOpen = true;
        
          const modal = await this.modalCtrl.create({
     component:CrearUsuarioPage,
     cssClass:'alert-modal',
 
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){
 
         
      }
    }
    

  }
}
