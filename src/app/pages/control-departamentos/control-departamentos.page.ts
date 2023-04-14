import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { CrearDepartamentoPage } from '../crear-departamento/crear-departamento.page';
import { Departamentos } from 'src/app/models/departamentos';
import { EditarDepartamentoPage } from '../editar-departamento/editar-departamento.page';

@Component({
  selector: 'app-control-departamentos',
  templateUrl: './control-departamentos.page.html',
  styleUrls: ['./control-departamentos.page.scss'],
})
export class ControlDepartamentosPage implements OnInit {
  isOpen:boolean = false;
  constructor(
  public alertasService:AlertasService,
  public modalCtrl:ModalController,
  public departamentosService:DepartamentosService,
  public alertCrl: AlertController  
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

  async crearDepartamento() {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CrearDepartamentoPage,
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
  async editarDepartamento(departamento:Departamentos) {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: EditarDepartamentoPage,
      cssClass: 'alert-modal',
      componentProps:{
        departamento
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


  async borrarDepartamento(departamento:Departamentos){
    const alert = await this.alertCrl.create({
      subHeader:'Dione',
      message:`¿Desea borrar el departamento ${departamento.nombre}?`,
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
  this.departamentosService.syncDeleteDepartamentoToPromise(departamento.id).then( resp =>{
    this.alertasService.loadingDissmiss();
    this.departamentosService.syncGetDepartamentoToPromise().then(departamentos =>{
      this.departamentosService.departamentos = departamentos;
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
