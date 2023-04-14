import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearUsuarioPage } from '../crear-usuario/crear-usuario.page';
import { EditarUsuarioPage } from '../editar-usuario/editar-usuario.page';
import { Usuarios } from 'src/app/models/usuarios';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.page.html',
  styleUrls: ['./control-usuarios.page.scss'],
})
export class ControlUsuariosPage implements OnInit {
  isOpen:boolean = false;
  constructor(

public usuariosService:UsuariosService,
public alertasService:AlertasService,
public modalCtrl:ModalController,
public alertCrl: AlertController

  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('cargando datos..');
    this.usuariosService.syncGetUsuariosToPromise().then(usuarios=>{
      this.alertasService.loadingDissmiss();
      this.usuariosService.usuarios = usuarios;
    }, error =>{
      this.alertasService.loadingDissmiss();
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

  async editarUsuario(usuario:Usuario){
    this.isOpen = true;
        
          const modal = await this.modalCtrl.create({
     component:EditarUsuarioPage,
     cssClass:'alert-modal',
     componentProps:{
      usuario
     }
 
          });
    
    if(this.isOpen){
    
      modal.present();
      const {data} = await modal.onWillDismiss();
      this.isOpen = false;
      if(data != undefined){
 
         
      }
    }
    

  }

  async borrarUsuario(usuario:Usuario){
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el usuario ${usuario.nombre}?`,
      buttons:[
        {
          text:'cancelar',
          role:'cancel',
          handler:()=>{
            console.log('cancel')
          }
        },
        {
          text:'continuar',
          role:'confirm',
          handler:async ()=>{
  this.alertasService.presentaLoading('Borrando datos..');
  this.usuariosService.syncDeleteUsuarioToPromise(usuario.id).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.usuariosService.syncGetUsuariosToPromise().then(usuarios =>{
      this.usuariosService.usuarios = usuarios;
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal...')
    })
  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('Dione','Lo sentimos algo salio mal...')
  })
          }
        }
      ]
    })
    alert.present();
  
    }


}
