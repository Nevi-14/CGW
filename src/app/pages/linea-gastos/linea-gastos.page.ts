import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { LineaGasto } from 'src/app/models/gastos';
import { Sobrantes } from 'src/app/models/sobrantes';
import { SobrantesService } from 'src/app/models/sobrantes.service';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosAnticiposService } from 'src/app/services/gastos-anticipos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { SobrantesPage } from '../sobrantes/sobrantes.page';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Notificaciones } from 'src/app/models/notificaciones';

@Component({
  selector: 'app-linea-gastos',
  templateUrl: './linea-gastos.page.html',
  styleUrls: ['./linea-gastos.page.scss'],
})
export class LineaGastosPage implements OnInit {
@Input() linea:LineaAnticipo
gastos:LineaGasto[]=[]
observaciones = null;
isOpen:boolean = false;
sobrante:Sobrantes = null;
url = "https://sde1.sderp.site/api-coris-control-viaticos/api/descargar-archivo?id=";
  constructor(
public modalCtrl:ModalController,
public adelantosService: AdelantoViaticosService,
public lineasAnticiposService:LineasAnticiposService,
public alertasService:AlertasService,
public gastosAnticiposService:GastosAnticiposService,
public sobrantesService:SobrantesService,
public changeDetector:ChangeDetectorRef,
public notificacionesService:NotificacionesService,
public alertCtrl:AlertController

  ) { }

  ngOnInit() {

   
    console.log(this.linea)
    this.lineasAnticiposService.syncGetGastosLineasToPromise(this.linea.id).then(async (resp) =>{

      this.gastos = resp;
      let sobrante = await  this.sobrantesService.syncGetSobranteAnticipoUsuarioToPromise( this.linea.usuario,this.adelantosService.adelantoViatico.numerO_TRANSACCION)
      this.sobrante = sobrante[0]
      console.log(this.gastos)
    })
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  async consultarSobrante() {
    const modal = await this.modalCtrl.create({
      component: SobrantesPage,
      cssClass: 'alert-modal',
      mode: 'ios',
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75],
      componentProps:{
        sobrante: this.sobrante
      }
    })

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
 
    }
  }
 
  async aprobar(linea:LineaGasto){
 

    linea.estatus = 'A';
    await   this.gastosAnticiposService.syncPutGastoToPromise(linea);
    this.alertasService.message('SD1', 'Linea Actualizada')
this.actualizar();
  }

  notificarUsuario(){

  }
  async rechazar(linea:LineaGasto){

    const alert = await this.alertCtrl.create({
      header: 'Rechazar Gasto',
      subHeader:'Detallar motivo',
      mode:'ios',
      buttons: ['OK'],
      inputs: [
        {
          type: 'textarea',
          placeholder: 'A little about yourself',
        },
      ],
    });
  
    await alert.present();
  }
  actualizar(){
    let count = this.gastos.length;
    let filter = 0;
    this.gastos.forEach((gasto, index) =>{
      if(gasto.estatus == 'A') filter +=1;
      if(gasto.estatus == 'R') this.linea.estatus = "R";
      if(index == this.gastos.length -1){
        if(count == filter){
          this.linea.estatus = "A";
 
        }else if(this.linea.estatus  != 'R'){
          this.linea.estatus = "I";
        }
        this.lineasAnticiposService.syncPutLineaAnticipoToPromise(this.linea).then((resp:LineaAnticipo) =>{
          if(resp.estatus == 'A'){
            console.log(resp)
          }
  
        })
      } 

    })

    
  }








}
