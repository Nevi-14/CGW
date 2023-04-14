import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Roles } from 'src/app/models/roles';
import { AlertasService } from 'src/app/services/alertas.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-editar-role',
  templateUrl: './editar-role.page.html',
  styleUrls: ['./editar-role.page.scss'],
})
export class EditarRolePage implements OnInit {
  @Input() role:Roles
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
      this.alertasService.presentaLoading('Actualizando datos..');
      this.rolesService.syncPutRoleoToPromise(this.role).then( resp =>{
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
