import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { PerfilPage } from 'src/app/pages/perfil/perfil.page';
import { ConfiguracionesService } from 'src/app/services/configuraciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent  {
@Input()mostrarUsuario:boolean=false;
isOpen :boolean = false;
fecha = new Date().toLocaleDateString();
alertas = 0;
alertasArray = [];
  constructor(
    public modalCtrl:ModalController,
    public menuCtrl: MenuController,
    private plt:Platform,
    public configuracionesService: ConfiguracionesService,
    public router: Router,
    public usuariosService:UsuariosService,
    public notificacionesService:NotificacionesService
    
      ) {
        const navigation = this.router.getCurrentNavigation();
        let url = null;
    
        if(navigation){
      url = navigation.extractedUrl.toString();
 this.notificacionesService.syncGetNotificacionesUsuarioToPromise(this.usuariosService.usuario.usuario).then((notificaciones)=>{ 
  this.alertas = notificaciones.filter( e => e.canal == 'web').length;
  this.alertasArray = notificaciones.filter( e => e.canal == 'web');
  console.log(notificaciones,'notificaciones')
  })
    
        }
    
    //alert(url)
      }
 
      async perfil() {
        this.isOpen = true;
    
    
        const modal = await this.modalCtrl.create({
          component: PerfilPage,
          cssClass: 'medium-modal'
        });
    
        if (this.isOpen) {
    
          modal.present();
          const { data } = await modal.onWillDismiss();
          this.isOpen = false;
          if (data != undefined) {
    
    
          }
        }
    
    
    
      }
  toggle(){
 
 this.configuracionesService.menu = !this.configuracionesService.menu ;
    this.menuCtrl.toggle('myMenu');
  
  }
}
