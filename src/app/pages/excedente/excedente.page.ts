import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Excedentes } from 'src/app/models/excedentes';
import { AlertasService } from 'src/app/services/alertas.service';
import { ExcedentesService } from 'src/app/services/excedentes.service';

@Component({
  selector: 'app-excedente',
  templateUrl: './excedente.page.html',
  styleUrls: ['./excedente.page.scss'],
})
export class ExcedentePage implements OnInit {
  @Input() excedente:Excedentes
  img = null
  file:any  = null;
  estatus = [
    {
     id: 'P',
     valor : 'Pendiente'
    },
    {
      id: 'RA',
      valor : 'Requiere Aprobación'
     },
    {
      id: 'A',
      valor : 'Aprobado'
     },
     {
      id: 'R',
      valor : 'Rechazado'
     }
  ]
  metodoDevolucion = [
    {
     id: 'S',
     valor : 'Sinpe Móvil'
    },
    {
      id: 'T',
      valor : 'Transferencia'
     },
    {
      id: 'D',
      valor : 'Deposito'
     } 
  ]
  readonly = true;
    constructor(
      public alertasService: AlertasService,
  public excedentesService:ExcedentesService,
  public modalCtrl:ModalController 
    ) { }
  
    ngOnInit() {
      console.log(this.excedente, 'sobrante')
      if(this.excedente.estatus == 'RA'){
        this.estatus.splice(0,1)
      }
    }
   
   
    adjuntarImagen($event){
      // Get a reference to the file that has just been added to the input
     this.file =  $event.target.files[0];
     console.log('file to upload', this.file)
    let reader = new FileReader();
    reader.onload = (event:any) => {
      this.img = event.target.result;
      
    }
    reader.readAsDataURL($event.target.files[0]);  // to trigger onload
    }
  
  
    borrarImagen(){
      this.file = null;
      this.img = null;
     }
     cerrarModal(){
      this.modalCtrl.dismiss();
     }
     actualizarExcedente(fExcedente:NgForm){
      let data = fExcedente.value;
      this.excedente.estatus = data.estatus;
      this.excedente.observaciones = data.observaciones
    this.alertasService.presentaLoading('actualizando excedente');
    this.excedentesService.syncPutExcedenteToPromise(this.excedente).then( resp =>{
      this.alertasService.loadingDissmiss();
      console.log('resp', resp)
      this.modalCtrl.dismiss();
      this.alertasService.message('D1', 'Excedente actualizado!..')
  
    }, error =>{
      this.alertasService.loadingDissmiss();
      console.log('error', error)
      this.alertasService.message('D1', 'Error actualizado!..')
    })
  }

}
