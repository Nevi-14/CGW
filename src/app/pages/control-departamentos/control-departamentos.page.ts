import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';

@Component({
  selector: 'app-control-departamentos',
  templateUrl: './control-departamentos.page.html',
  styleUrls: ['./control-departamentos.page.scss'],
})
export class ControlDepartamentosPage implements OnInit {

  constructor(
  public alertasService:AlertasService,
  public modalCtrl:ModalController,
  public departamentosService:DepartamentosService  
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..');
    this.departamentosService.syncGetDepartamentoToPromise().then(departamentos =>{
      this.departamentosService.departamentos = departamentos
      this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  }

}
