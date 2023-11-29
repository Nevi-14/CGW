import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Sobrantes } from 'src/app/models/sobrantes';
import { SobrantesService } from 'src/app/models/sobrantes.service';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-sobrantes',
  templateUrl: './sobrantes.page.html',
  styleUrls: ['./sobrantes.page.scss'],
})
export class SobrantesPage implements OnInit {
@Input() sobrante:Sobrantes
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
public sobrantesService:SobrantesService,
public modalCtrl:ModalController    
  ) { }

  ngOnInit() {
    console.log(this.sobrante, 'sobrante')
    if(this.sobrante.estatus == 'RA'){
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
   actualizarSobrante(fSobrante:NgForm){
    let data = fSobrante.value;
    this.sobrante.estatus = data.estatus;
    this.sobrante.observaciones = data.observaciones
  this.alertasService.presentaLoading('actualizando sobrante');
  this.sobrantesService.syncPutSobranteToPromise(this.sobrante).then( resp =>{
    this.alertasService.loadingDissmiss();
    console.log('resp', resp)
    this.modalCtrl.dismiss();
    this.alertasService.message('D1', 'Sobrante actualizado!..')

  }, error =>{
    this.alertasService.loadingDissmiss();
    console.log('error', error)
    this.alertasService.message('D1', 'Sobrante actualizado!..')
  })
}

}
