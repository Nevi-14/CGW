import { Component, OnInit, Input } from '@angular/core';
import { adelantoViaticos } from '../../models/adelantoViaticos';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-detalle-adelanto-viatico',
  templateUrl: './detalle-adelanto-viatico.page.html',
  styleUrls: ['./detalle-adelanto-viatico.page.scss'],
})
export class DetalleAdelantoViaticoPage implements OnInit {
@Input() adelantoViatico :adelantoViaticos
  constructor(
  public modalCtrl:ModalController,
  public alertasService: AlertasService  
  ) { }

  ngOnInit() {
    console.log(this.adelantoViatico, 'adelantoViatico')
  }
  cerrarModal(){
this.modalCtrl.dismiss();
  }

  liquidar(){
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')

  }
}
