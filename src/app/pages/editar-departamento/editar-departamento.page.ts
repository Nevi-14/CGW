import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Departamentos } from 'src/app/models/departamentos';
import { AlertasService } from 'src/app/services/alertas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';

@Component({
  selector: 'app-editar-departamento',
  templateUrl: './editar-departamento.page.html',
  styleUrls: ['./editar-departamento.page.scss'],
})
export class EditarDepartamentoPage implements OnInit {
@Input() departamento:Departamentos
constructor(
  public modalCtrl:ModalController,
  public alertasService:AlertasService,
  public departamentosService:DepartamentosService  
  ) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  post(){
    this.alertasService.presentaLoading('Actualizando datos..');
    this.departamentosService.syncPutDepartamentoToPromise(this.departamento).then( resp =>{
      this.alertasService.loadingDissmiss();
      this.departamentosService.syncGetDepartamentoToPromise().then(departamentos =>{
        this.departamentosService.departamentos = departamentos;
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
