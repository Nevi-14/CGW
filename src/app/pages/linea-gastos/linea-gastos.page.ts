import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { EditarGastoPage } from '../editar-gasto/editar-gasto.page';
import { DatatableComponent } from '@swimlane/ngx-datatable';

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
@ViewChild(DatatableComponent) table: DatatableComponent;
public columns: any;
public rows: any[];
temp = [];
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

  ) {   }

  ngOnInit() {

   
    console.log(this.linea)
    this.cargarDatos()
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

  
  cargarDatos(){

    this.columns = [
      { id: "referencia", label: "Factura", size: 2 },
      { id: "descripcion", label: "Descripcion", size: 2},
      { id: "monto", label: "Monto", size: 2 },
      { id: "estatus", label: "Estatus", size: 2 },
      { id: "opciones", label: "Opciones", size: 2 }
  ];
  this.lineasAnticiposService.syncGetGastosLineasToPromise(this.linea.id).then((res) => {
        console.log(res)
        this.temp = [...res];

      // push our inital complete list
      this.rows = res;
      });
 
  }

  editarElemento(row) {
    console.log(row,'editarElemento');
    let i = this.rows.findIndex( e => e.id == row.id);
    if(i >= 0){
      this.gastoDetalle(this.rows[i])
    }
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

  async gastoDetalle(nuevoGasto) {
    const modal = await this.modalCtrl.create({
      component: EditarGastoPage,
      cssClass: 'alert-modal',
      mode: 'ios',
      componentProps:{
        nuevoGasto: nuevoGasto,
        linea: this.linea
      }
    })

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
 
    }
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
