import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { LineaGastosPage } from '../linea-gastos/linea-gastos.page';
import { CorreoService } from 'src/app/services/correo.service';
import { LiquidacionAnticipoPage } from '../liquidacion-anticipo/liquidacion-anticipo.page';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { Sobrantes } from 'src/app/models/sobrantes';
import { SobrantesService } from 'src/app/models/sobrantes.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Notificaciones } from 'src/app/models/notificaciones';
interface email {
  toEmail:string,
  file:string,
  subject:string,
  body:string
}
@Component({
  selector: 'app-detalle-anticipo',
  templateUrl: './detalle-anticipo.page.html',
  styleUrls: ['./detalle-anticipo.page.scss'],
})
export class DetalleAnticipoPage implements OnInit {
  isOpen:boolean = false;
  lineas: LineaAnticipo[]=[]
gastos = [];
img = null
file:any  = null;
    constructor(
    public modalCtrl:ModalController,
    public alertasService: AlertasService,
    public adelantosService:AdelantoViaticosService,
    public linaAnticiposService:LineasAnticiposService,
    public gtastosService:GastosService,
    public correosService:CorreoService,
    public procesoContableService:ProcesoContableService,
    public notificacionesService:NotificacionesService
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
        mode:'ios',
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
    
borrarImagen(){
  this.file = null;
  this.img = null;
 }
   
    adjuntarImagen($event){
      // Get a reference to the file that has just been added to the input
     this.file =  $event.target.files[0];
     console.log('file to upload', this .file)
    let reader = new FileReader();
    reader.onload = (event:any) => {
      this.img = event.target.result;
    }
    reader.readAsDataURL($event.target.files[0]);  // to trigger onload
    }
  
  
    enviarCorreo(linea:LineaAnticipo){

      let notificacion:Notificaciones = {
         id : 0,
         estatus: true,
         usuario : linea.usuario,
         fecha: new Date(),
         referencia:this.adelantosService.adelantoViatico.numerO_TRANSACCION,
         descripcion:'Por favor liquidar anticipo',
         adjunto: false,
         archivo:null
      }
      if(linea.estatus == 'A'){
        this.alertasService.message('APP', 'Lo sentimos no se pueden enviar mas correos!')
return
      }
      this.alertasService.presentaLoading('Enviando correo...')
      let correo:email = {
        toEmail:'workemailnelson@gmail.com',
        file:null,
        subject:'Recordatorio Liquidacion Gastos',
        body:'Por favor proceder a liquidar los gatos ' 
      }
      this.notificacionesService.syncPostNotificacionToPromise(notificacion).then(resp =>{
        this.alertasService.message('APP', 'El usuario ha sido notificado..')
        this.alertasService.loadingDissmiss();
  console.log('resp', resp)
      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
      })
  
    }
  async  liquidarAnticipo(){
   let filter = this.lineas.filter( e => e.estatus == 'A');

   if(filter.length  != this.lineas.length){
    this.alertasService.message('SD1', 'Lo sentimos, debes de aprobar todas las lineas de anticipo para continuar!.');
 
    return
   }
this.liquidacionAnticipo();
/**
 * 
 */
    }

    async liquidacionAnticipo() {
 
      this.isOpen = true;
  
      const modal = await this.modalCtrl.create({
        component: LiquidacionAnticipoPage,
        cssClass: 'alert-modal-large',
        mode:'ios'
      });
  
      if (this.isOpen) {
  
        modal.present();
        const { data } = await modal.onWillDismiss();
        this.isOpen = false;
        if (data != undefined) {
     
  
        }
  
      }
    }
}
