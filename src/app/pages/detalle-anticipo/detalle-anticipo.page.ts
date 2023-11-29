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
import { saveAs } from 'file-saver';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CompaniasService } from 'src/app/services/companias.service';
import { Router } from '@angular/router';
import { AprobadoresService } from 'src/app/services/aprobadores.service';
import { Notificaciones } from 'src/app/models/notificaciones';
import { Usuarios } from 'src/app/models/usuarios';
interface filtros {
  nombre:any,
  filtro:any, 
 }
 
@Component({
  selector: 'app-detalle-anticipo',
  templateUrl: './detalle-anticipo.page.html',
  styleUrls: ['./detalle-anticipo.page.scss'],
})
export class DetalleAnticipoPage implements OnInit {
  aprobadores:any = [];
  usuarios:Usuarios[] = [];
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
  segment = 'P';
  data = [];
  rows = [];
  temp = [];
  pageSize = 3;
  currentPage = 1;
  filtro:filtros = {nombre:'Usuario',filtro:'usuario'}
  firstDataLoad = false;
  cuentaAnticipo = null;
  cuentaBancostilizar = null;
  usuarioAprobador:Boolean = false;
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
    public tiposGastosSerivce: TiposGastosService,
    public usuariosService:UsuariosService,
    public companiasService:CompaniasService,
    public adelantoViaticosService:AdelantoViaticosService,
    public router:Router,
    public aprobadoresService:AprobadoresService
  ) { }

  async createTxtFileFromArray() {

    this.aprobadores = await this.aprobadoresService.syncGetAprobadoresToPromise();
    this.usuarios = await this.usuariosService.syncGetUsuariosToPromise();
    
    let array = [];
    let promises = this.totalLineas.map(async (linea) => {
      let usuario = await this.usuariosService.getUsuarioToPromise(linea.usuario);
      let data = `${this.cuentaBancostilizar.cuenta},${usuario[0].nombre}  ${usuario[0].apellido},${this.cuentaAnticipo.cuenta},${linea.monto},PAGO DE VIATICOS DEL ${new Date(this.adelantosService.adelantoViatico.fechA_INICIAL).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} AL  ${new Date(this.adelantosService.adelantoViatico.fechA_FINAL).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })},CODIGO 150`;
      array.push(data);
    });
  
    await Promise.all(promises);
  
    let filename = 'LibroViaticos.txt';
    const blob = new Blob([array.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  }
  segmentChanged(data) {
    this.segment = data;
  //  console.log('event', $event)
    this.cargarGastos(data)
    //this.linaAnticiposService.s
  }
  async lineaGastos(linea: LineaAnticipo) {

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: LineaGastosPage,
      cssClass: 'medium-modal',
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

      this.cargarGastos(this.segment)

    }
  }

 async  actualizarEstadoAnticipo(){

  if(this.adelantosService.adelantoViatico.estatus == 'RA'){
    return this.notificarAprobadores();
  }else{
    this.alertasService.presentaLoading('Actualizando estado del anticipo...')
  await this.adelantosService.syncPuttAdelantoViaticosToPromise(
    this.adelantosService.adelantoViatico
  ).then(async (resp) => {
    await this.alertasService.loadingDissmiss();
    this.alertasService.message('D1','Anticipo actualizado con exito!..')
  }, async (err) => {
    await this.alertasService.loadingDissmiss();
     
  })
  }
   
  }

  estadoAnticipo($event){
    console.log('event', $event)
   

  }
 async ngOnInit() {

  let cuentasBancos = await this.companiasService.syncGetCompaniaCuentaBancos( this.adelantosService.adelantoViatico.coD_COMPANIA);
  this.cuentaAnticipo = cuentasBancos.find(e => e.moneda == 'NA');
  let cuentaBancosLocal = cuentasBancos.find(e => e.moneda == 'L');
  let cuentaBancosDolares = cuentasBancos.find(e => e.moneda == 'D');
  this.cuentaBancostilizar = this.adelantosService.adelantoViatico.moneda == '$' ? cuentaBancosDolares : cuentaBancosLocal ;

  this.aprobadores = await this.aprobadoresService.syncGetAprobadoresToPromise();
    this.usuarios = await this.usuariosService.syncGetUsuariosToPromise();
    this.usuarioAprobador = this.aprobadores.findIndex(e => e.usuario == this.usuariosService.usuario.usuario) >= 0 ? true : false;


//alert(this.segment)
  //this.cargarGastos(this.segment)

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

   if(!this.firstDataLoad){
    this.firstDataLoad = true;
    this.segment = this.p > 0 ? 'P' :  this.ra > 0 ?  'RA' :  'A';
   }

    this.linaAnticiposService.syncGetLineasAnticipoEstatusToPromise(this.adelantosService.adelantoViatico.id,  this.segment).then(async (lineas) => {
      this.lineas = lineas;
      this.data = this.lineas;
      this.temp = [...this.data];
      this.gastos = await this.adelantosService.syncGetGastosAnticipo(this.adelantosService.adelantoViatico.id);
      if ( this.gastos.length == 0) {
        await this.alertasService.loadingDissmiss();
        this.graficosService.cargarGRaficos();
      }
      this.gastos.forEach(async (gasto: vistaGastos, index) => {
      console.log('gasto',gasto)
      let indexG = this.tiposGastosSerivce.tiposGastos.findIndex(e => e.tipo == gasto.tipO_GASTO);
        let i = null;
        if(indexG >= 0){
          i =  this.graficosService.labels.findIndex(e => e == this.tiposGastosSerivce.tiposGastos[indexG].descripcion);
        }
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

  async notificarAprobadores(){
    this.aprobadores = await this.aprobadoresService.syncGetAprobadoresToPromise();
    this.usuarios = await this.usuariosService.syncGetUsuariosToPromise();
    if(this.aprobadores.length == 0) return this.alertasService.message('D1','Lo sentimos, no se pude notiticar a los aprobadores, no hay aprobadores configurados.');
    this.alertasService.presentaLoading('Notificando Aprobadores...')
    this.alertasService.presentaLoading('Actualizando estado del anticipo...')
    await this.adelantosService.syncPuttAdelantoViaticosToPromise(
      this.adelantosService.adelantoViatico
    ).then(async (resp) => {
      await this.alertasService.loadingDissmiss();
      this.aprobadores.forEach( async (aprobador, index) =>{

        let notificacion:Notificaciones = {
          id : 0,
          remitente : this.usuariosService.usuario.usuario,
          usuario : aprobador.usuario,
          canal:'web',
          tipo:'N', // Registro Anticipo
          referencia:'Aprobacion de Anticipos',
          estatus:'P',
          fecha: new Date(),
          fechaLimite: new Date(),
          titulo:`Se require de su aprobacion para la solicitud de anticipos`,
          descripcion: `Se require de su aprobacion para la solicitud de anticipos`
       }
    
      
   
     
  
  console.log('usuario',aprobador.usuario)
  console.log('this.usuarios',this.usuarios)
  
        let i  =  this.usuarios.findIndex(e => e.usuario == aprobador.usuario);
        console.log(i,'i')
        console.log(this.usuarios[i],'usuario')
        if(i >= 0){
        await  this.notificacionesService.syncPostNotificacionToPromise(notificacion) 
  
          let usuario = this.usuarios[i];
          let email = {
            toEmail:usuario.correo,
            file:null,
            subject:'Aprobacion de Anticipos',
            body:`
     
      <ul>
      <li>
      Se require de su aprobacion para la socituded de anticipos.
      </li>
     
      <li>
      Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte en [Correo o Teléfono de Soporte].
      
      </li>
      
      </ul>
        
       
       
      
      Gracias por confiar en [Nombre de la Plataforma/Servicio]. Estamos aquí para ayudarte.
      <br>
      <br>
      Saludos cordiales,
      <br>
      <br>
      [Nombre del Equipo de Soporte]
      <br>
      <br>
      [Nombre de la Plataforma/Servicio]
      <br>
      [Correo de Contacto de Soporte]
      <br>
      [Teléfono de Contacto de Soporte]
            `
              }
          this.correosService.syncPostEmailToPromise(email)
        }
        if(index == this.aprobadores.length -1){
          this.alertasService.loadingDissmiss();
          this.alertasService.message('D1ONE','Aprobadores Notificados!')
        }
      })
    }, async (err) => {
      await this.alertasService.loadingDissmiss();
       
    })
    
  }



  getBadgeColor(estatus: string) {
    switch (estatus) {
      case 'P':
        return 'primary';
      case 'RA':
        return 'warning';
      case 'A':
        return 'success';
      case 'R':
        return 'danger';
      default:
        return 'primary';
    }
  }

  
  updateFilter(event, filtro: filtros) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d[filtro.filtro].toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the data
    this.data = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter() {

this.cargarGastos(this.segment)

  
   // if(this.adelantosService.adelantoViatico.estatus == 'F'){this.segment='A';   }else { this.cargarGastos(this.segment)}

 

  }

  liquidar() {
    this.alertasService.message('D1', 'La opción no se encuentra disponible..')

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


  get ordersToDisplay(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }


  async mostrarEstadisiticas() {

    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: EstadisticasPage,
      cssClass: 'medium-modal',
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
  regresar(){
    this.router.navigateByUrl('/inicio/control-anticipos')
  }
  async liquidacionAnticipo() {
 
    if(this.totalLineas.length != this.totalLineas.filter( e => e.estatus == 'A').length) return this.alertasService.message('D1','Lo sentimos debes de aprobar todas las lineas antes de proceder!..');
    if(this.adelantosService.adelantoViatico.estatus != 'A' && this.adelantosService.adelantoViatico.estatus != 'F'){
      return this.alertasService.message('D1', 'Lo sentimos, el anticipo debe de estar aprobado para continuar!.');
    }
    this.isOpen = true;

  
    return  this.router.navigate(['/inicio/liquidacion-anticipo'])
    const modal = await this.modalCtrl.create({
      component: LiquidacionAnticipoPage,
      cssClass: 'medium-modal',
      mode: 'md'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {


      }

    }
  }

      // PAGINATED DATA
      get paginatedData(): any[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.data.slice(startIndex, startIndex + this.pageSize);
      }
      
      // NEXT PAGE
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
      
      // PREVIOUS PAGE
      previousPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      }
       
      
        // SELECCIONAR TODO
        selectAll(event) {
          if (event.detail.checked) {
            this.data.forEach((item) => {
              item.seleccionado = true;
            });
          } else {
            this.data.forEach((item) => {
              item.seleccionado = false;
            });
          }
        }
      
}
