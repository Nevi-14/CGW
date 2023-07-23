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
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { GraficosService } from 'src/app/services/graficos.service';
import { EstadisticasPage } from '../estadisticas/estadisticas.page';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { vistaGastos } from 'src/app/models/gastosView';
interface email {
  toEmail: string,
  file: string,
  subject: string,
  body: string
}
@Component({
  selector: 'app-detalle-anticipo',
  templateUrl: './detalle-anticipo.page.html',
  styleUrls: ['./detalle-anticipo.page.scss'],
})
export class DetalleAnticipoPage implements OnInit {
  isOpen: boolean = false;
  lineas: LineaAnticipo[] = []
  totalLineas: LineaAnticipo[] = []
  lineasPendientes = 0;
  gastos = [];
  img = null
  file: any = null;
  p = 0;
  ra = 0;
  a = 0;
  r = 0;
  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public adelantosService: AdelantoViaticosService,
    public linaAnticiposService: LineasAnticiposService,
    public gtastosService: GastosService,
    public correosService: CorreoService,
    public procesoContableService: ProcesoContableService,
    public notificacionesService: NotificacionesService,
    public graficosService: GraficosService,
    public tiposGastosSerivce: TiposGastosService
  ) { }


  segmentChanged($event) {
    console.log('event', $event)
    this.cargarGastos($event.detail.value)
    //this.linaAnticiposService.s
  }
  async lineaGastos(linea: LineaAnticipo) {


    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LineaGastosPage,
      cssClass: 'alert-modal',
      mode: 'ios',
      componentProps: {
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
  ngOnInit() {



  }




 async  cargarGastos(estatus: string) {
  this.graficosService.labels = [];
  this.graficosService.data = [];
  this.alertasService.presentaLoading('Cargando datos...')
  this.tiposGastosSerivce.getgastosToPromise().then((resp) => {
    this.tiposGastosSerivce.tiposGastos = resp;
    resp.forEach(async (tipo, index) => {
      this.graficosService.labels.push(tipo.descripcion)
      this.graficosService.data.push(0)
      if (index == resp.length - 1) {
        console.log(this.adelantosService.adelantoViatico, 'adelantooooo')
           
    let anticipo= await this.adelantosService.syncGetAdelantoViaticoIDToPromise(this.adelantosService.adelantoViatico.id);
    this.adelantosService.adelantoViatico  = anticipo[0]
    console.log('   this.adelantosService.adelantoViatico',   this.adelantosService.adelantoViatico)
    this.p = 0;
    this.ra = 0;
    this.a = 0;
    this.r = 0;

    this.totalLineas = await this.linaAnticiposService.syncGetLineasAnriciposToPromise(this.adelantosService.adelantoViatico.id);
    this.lineasPendientes = this.totalLineas.filter(e => e.estatus == 'P').length
 

    this.totalLineas.forEach(async (gasto: LineaAnticipo, index) => {
      switch (gasto.estatus) {
        case 'P':
          this.p += 1;
          break;
        case 'RA':
          this.ra += 1;
          break;
        case 'A':
          this.a += 1;
          break;
        case 'R':
          this.r += 1;
          break;
      }
    })



    this.linaAnticiposService.syncGetLineasAnticipoEstatusToPromise(this.adelantosService.adelantoViatico.id, estatus).then(async (lineas) => {
      this.lineas = lineas;
      this.gastos = await this.adelantosService.syncGetGastosAnticipo(this.adelantosService.adelantoViatico.id);
      if ( this.gastos.length == 0) {
        await this.alertasService.loadingDissmiss();
        this.graficosService.cargarGRaficos();
      }
      this.gastos.forEach(async (gasto: vistaGastos, index) => {
      console.log('gasto',gasto)
        let i = this.graficosService.labels.findIndex(e => e == gasto.tipO_GASTO);
        if (i >= 0) {
          this.graficosService.data[i] += 1;
        }

        if (index == this.gastos.length - 1) {
          await this.alertasService.loadingDissmiss();
          this.graficosService.cargarGRaficos();
        }

      })
    })
      }
    })


  })


 
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter() {



    this.cargarGastos('P')


 

  }

  liquidar() {
    this.alertasService.message('DIONE', 'La opción no se encuentra disponible..')

  }



  borrarImagen() {
    this.file = null;
    this.img = null;
  }

  adjuntarImagen($event) {
    // Get a reference to the file that has just been added to the input
    this.file = $event.target.files[0];
    console.log('file to upload', this.file)
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.img = event.target.result;
    }
    reader.readAsDataURL($event.target.files[0]);  // to trigger onload
  }



  async liquidarAnticipo() {
    let filter = this.lineas.filter(e => e.estatus == 'A');

    if (filter.length != this.lineas.length) {
      this.alertasService.message('SD1', 'Lo sentimos, debes de aprobar todas las lineas de anticipo para continuar!.');

      return
    }
    this.liquidacionAnticipo();
    /**
     * 
     */
  }
  async mostrarEstadisiticas() {

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: EstadisticasPage,
      cssClass: 'alert-modal',
      mode: 'ios'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {


      }

    }
  }
  async liquidacionAnticipo() {
 
    if(this.totalLineas.length != this.totalLineas.filter( e => e.estatus == 'A').length) return this.alertasService.message('DIONE','Lo sentimos debes de aprobar todas las lineas antes de proceder!..')
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LiquidacionAnticipoPage,
      cssClass: 'alert-modal',
      mode: 'ios'
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
