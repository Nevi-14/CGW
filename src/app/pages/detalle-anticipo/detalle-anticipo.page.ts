import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { LineaGastosPage } from '../linea-gastos/linea-gastos.page';

@Component({
  selector: 'app-detalle-anticipo',
  templateUrl: './detalle-anticipo.page.html',
  styleUrls: ['./detalle-anticipo.page.scss'],
})
export class DetalleAnticipoPage implements OnInit {
  isOpen:boolean = false;
  lineas: LineaAnticipo[]=[]
gastos = [];
    constructor(
    public modalCtrl:ModalController,
    public alertasService: AlertasService,
    public adelantosService:AdelantoViaticosService,
    public linaAnticiposService:LineasAnticiposService,
    public gtastosService:GastosService
    ) { }
  
    ngOnInit() {

      console.log(this.adelantosService.adelantoViatico, 'adelantooooo')
      this.linaAnticiposService.syncGetLineasAnriciposToPromise(this.adelantosService.adelantoViatico.id).then(async (lineas) =>{
        this.lineas = lineas;
        console.log('lineas', lineas)
       this.gastos =  await this.adelantosService.syncGetGastosAnticipo(this.adelantosService.adelantoViatico.id);
      
      })
    }
    cerrarModal(){
  this.modalCtrl.dismiss();
    }
  
    liquidar(){
      this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  
    }

    async lineaGastos(linea:LineaAnticipo) {

 
      this.isOpen = true;
  
      const modal = await this.modalCtrl.create({
        component: LineaGastosPage,
        cssClass: 'alert-modal',
        componentProps:{
          linea
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

    liquidarAnticipo(){
   let filter = this.lineas.filter( e => e.estatus == 'A');

   if(filter.length  != this.lineas.length){
    this.alertasService.message('SD1', 'Lo sentimos, debes de aprobar todas las lineas de anticipo para continuar!.');
    return
   }
    }
}
