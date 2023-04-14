import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Roles } from 'src/app/models/roles';
import { AlertasService } from 'src/app/services/alertas.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-crear-role',
  templateUrl: './crear-role.page.html',
  styleUrls: ['./crear-role.page.scss'],
})
export class CrearRolePage implements OnInit {
  role :Roles ={
    id: null,
    nombre:null,
    descripcion:null
  }
    constructor(
    public modalCtrl:ModalController,
    public alertasService:AlertasService,
    public rolesService:RolesService
    ) { }
  
    ngOnInit() {
    }
  
    cerrarModal(){
      this.modalCtrl.dismiss();
    }
    post(){
      this.alertasService.presentaLoading('Guardando datos..');
      this.rolesService.syncPostRoletoToPromise(this.role).then( resp =>{
        this.alertasService.loadingDissmiss();
        this.rolesService.syncGetRolesToPromise().then(roles =>{
          this.rolesService.roles = roles;
          this.modalCtrl.dismiss()
        }, error =>{
       
          this.alertasService.message('Dione','Lo sentimos algo salio mal!..')
        })
      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('Dione','Lo sentimos algo salio mal!..')
      })
    }

}
