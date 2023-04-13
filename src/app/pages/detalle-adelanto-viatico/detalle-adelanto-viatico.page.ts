import { Component, OnInit, Input } from '@angular/core';
import { LineaGasto, adelantoViaticos } from '../../models/adelantoViaticos';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';

@Component({
  selector: 'app-detalle-adelanto-viatico',
  templateUrl: './detalle-adelanto-viatico.page.html',
  styleUrls: ['./detalle-adelanto-viatico.page.scss'],
})
export class DetalleAdelantoViaticoPage implements OnInit {
@Input() adelantoViatico :adelantoViaticos
gastos: LineaGasto[]=[]
  constructor(
  public modalCtrl:ModalController,
  public alertasService: AlertasService,
  public adelantosService:AdelantoViaticosService
  ) { }

  ngOnInit() {
    console.log(this.adelantoViatico, 'adelantoViatico')
    this.adelantosService.syncGetGastosAnticipo(this.adelantoViatico.id).then(gastos =>{
      this.gastos = gastos;
      console.log('gastos', gastos)
    
    })
  }
  cerrarModal(){
this.modalCtrl.dismiss();
  }

  liquidar(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')

  }
}
