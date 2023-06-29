import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Departamentos } from 'src/app/models/departamentos';
import { AlertasService } from 'src/app/services/alertas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.page.html',
  styleUrls: ['./crear-departamento.page.scss'],
})
export class CrearDepartamentoPage implements OnInit {
departamento :Departamentos ={
  id: null,
  nombre:null,
  descripcion:null
}
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
  crearDepartamento(fDepartamento: NgForm){
    this.departamento.nombre =  fDepartamento.value.nombre;
    this.departamento.descripcion =  fDepartamento.value.descripcion;
    this.alertasService.presentaLoading('Guardando datos..');
    this.departamentosService.syncPostDepartamentoToPromise(this.departamento).then( resp =>{
      this.alertasService.loadingDissmiss();
      this.modalCtrl.dismiss(true)
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Dione','Lo sentimos algo salio mal!..')
    })
  }

}
