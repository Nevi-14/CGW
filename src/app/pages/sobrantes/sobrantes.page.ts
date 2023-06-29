import { Component, Input, OnInit } from '@angular/core';
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
  constructor(
    public alertasService: AlertasService,
public sobrantesService:SobrantesService,
public modalCtrl:ModalController    
  ) { }

  ngOnInit() {
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
     
actualizarSobrante(){
  this.alertasService.presentaLoading('actualizando sobrante');
  this.sobrantesService.syncPutSobranteToPromise(this.sobrante).then( resp =>{
    this.alertasService.loadingDissmiss();
    console.log('resp', resp)
    this.modalCtrl.dismiss();
    this.alertasService.message('DIONE', 'Sobrante actualizado!..')

  }, error =>{
    this.alertasService.loadingDissmiss();
    console.log('error', error)
    this.alertasService.message('DIONE', 'Sobrante actualizado!..')
  })
}

}
