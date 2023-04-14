import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { RolesService } from 'src/app/services/roles.service';
import { CrearRolePage } from '../crear-role/crear-role.page';
import { EditarRolePage } from '../editar-role/editar-role.page';
import { Roles } from 'src/app/models/roles';

@Component({
  selector: 'app-control-roles',
  templateUrl: './control-roles.page.html',
  styleUrls: ['./control-roles.page.scss'],
})
export class ControlRolesPage implements OnInit {
  isOpen:boolean = false;
  constructor(
public alertasService:AlertasService,
public modalCtrl:ModalController,
public rolesService:RolesService,
public alertCrl:AlertController


  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('cargando datos..');
    this.rolesService.syncGetRolesToPromise().then(roles =>{
this.rolesService.roles = roles;
this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  }

  async crearRole() {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CrearRolePage,
      cssClass: 'alert-modal'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
   

      }

    }
  }
  async editarRole(role:Roles) {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: EditarRolePage,
      cssClass: 'alert-modal',
      componentProps:{
        role
      }
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
   

      }

    }
  }


  async borrarDepartamento(role:Roles){
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el role ${role.nombre}?`,
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
  this.rolesService.syncDeleteRoletoToPromise(role.id).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.rolesService.syncGetRolesToPromise().then(roles =>{
      this.rolesService.roles = roles;
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
