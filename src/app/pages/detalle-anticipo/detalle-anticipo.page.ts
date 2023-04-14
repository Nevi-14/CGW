import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';

@Component({
  selector: 'app-detalle-anticipo',
  templateUrl: './detalle-anticipo.page.html',
  styleUrls: ['./detalle-anticipo.page.scss'],
})
export class DetalleAnticipoPage implements OnInit {
  
  lineas: LineaAnticipo[]=[]

    constructor(
    public modalCtrl:ModalController,
    public alertasService: AlertasService,
    public adelantosService:AdelantoViaticosService,
    public linaAnticiposService:LineasAnticiposService
    ) { }
  
    ngOnInit() {
      console.log(this.adelantosService.adelantoViatico, 'adelantoViatico')
      this.linaAnticiposService.syncGetLineasAnriciposToPromise(this.adelantosService.adelantoViatico.id).then(lineas =>{
        this.lineas = lineas;
        console.log('lineas', lineas)
      
      })
    }
    cerrarModal(){
  this.modalCtrl.dismiss();
    }
  
    liquidar(){
      this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')
  
    }


}
