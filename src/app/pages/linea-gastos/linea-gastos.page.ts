import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { LineaGasto } from 'src/app/models/gastos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';

@Component({
  selector: 'app-linea-gastos',
  templateUrl: './linea-gastos.page.html',
  styleUrls: ['./linea-gastos.page.scss'],
})
export class LineaGastosPage implements OnInit {
@Input() linea:LineaAnticipo
gastos:LineaGasto[]=[]
observaciones = null;
url = "https://sde1.sderp.site/api-coris-control-viaticos/api/descargar-archivo?id=";
  constructor(
public modalCtrl:ModalController,
public adelantosService: AdelantoViaticosService,
public lineasAnticiposService:LineasAnticiposService,
public alertasService:AlertasService

  ) { }

  ngOnInit() {

   
    console.log(this.linea)
    this.lineasAnticiposService.syncGetGastosLineasToPromise(this.linea.id).then(resp =>{

      this.gastos = resp;
      console.log(this.gastos)
    })
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }


  aprobar(){
 

this.linea.estatus = 'A';
this.actualizar();
  }

  rechazar(){
 
this.linea.estatus = 'R';
this.actualizar();
  }

  actualizar(){
    this.lineasAnticiposService.syncPutLineaAnticipoToPromise(this.linea).then(resp =>{
      this.cerrarModal();
      this.alertasService.message('SD1', 'Anticipo Actualizado')
    })
  }
}
