import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  editarDepartamento(fDepartamento: NgForm){
    this.departamento.nombre =  fDepartamento.value.nombre;
    this.departamento.descripcion =  fDepartamento.value.descripcion;
    this.alertasService.presentaLoading('Actualizando datos..');
    this.departamentosService.syncPutDepartamentoToPromise(this.departamento).then( resp =>{
      this.alertasService.loadingDissmiss();
      this.modalCtrl.dismiss(true)
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('D1','Lo sentimos algo salio mal!..')
    })
  }
}
