import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-control-roles',
  templateUrl: './control-roles.page.html',
  styleUrls: ['./control-roles.page.scss'],
})
export class ControlRolesPage implements OnInit {

  constructor(
public alertasService:AlertasService,
public modalCtrl:ModalController,
public rolesService:RolesService


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

}
