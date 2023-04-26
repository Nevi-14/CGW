import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import { LineaAnticipo, adelantoViaticos } from '../../models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { VistassService } from 'src/app/services/vistas.service';
import { Clientes } from '../../models/clientes';
import { UsuarioExactus } from 'src/app/models/usuarios';
import { ListaUsuariosPage } from '../lista-usuarios/lista-usuarios.page';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from 'src/app/models/procesoContable';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';

@Component({
  selector: 'app-registro-anticipos',
  templateUrl: './registro-anticipos.page.html',
  styleUrls: ['./registro-anticipos.page.scss'],
})
export class RegistroAnticiposPage implements OnInit {
  usuarios: UsuarioExactus[] = []

  adelantoViatico: adelantoViaticos = {
    id: null,
    cREADO_POR: null,
    mODIFICADO_POR: null,
    eSTATUS: 'P',
    coD_COMPANIA: null,
    fecha: new Date(),
    fechA_INICIAL: new Date(),
    fechA_FINAL: new Date(),
    detalle: null,
    fechA_TRANSACCION: new Date(),
    numerO_TRANSACCION: null,
    moneda: '₡',
    monto: 0,
    utilizado: 0,
    restante: 0,
    observaciones: null,
    lineas: 0,
    ultimA_FECHA_MODIFICACION: new Date()

  }


  formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
  montoMaximo = 0;
  montoTotal = 0;
  montoRestante = 0;
  isOpen: boolean = false;
  textoBuscar = '';
  clientes: Clientes[] = []
  usuariosAnticipo: UsuarioExactus[] = []
  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public gastosService: GastosService,
    public usuariosService: UsuariosService,
    public popOverCtrl: PopoverController,
    public adelantoViaticosService: AdelantoViaticosService,
    public router: Router,
    public vistasService: VistassService,
    public lineasAnticipoService: LineasAnticiposService,
    public procesoContableService: ProcesoContableService

  ) { }

  ngOnInit() {

    this.vistasService.syncGetClientesToPromise().then(clientes => {
      clientes.forEach((cliente, index) => {
        if (cliente.cia == 'CVET' || cliente.cia == 'COOK' || cliente.cia == 'CORE') {
          let i = this.clientes.findIndex(c => c.cia == cliente.cia);
          if (i < 0) {
            this.clientes.push(cliente)
          }
        }
        if (index == clientes.length - 1) {
          console.log('clientes', this.clientes);
          this.cargarDatos();
        }
      })


    })
      ;

  }
  compania($event) {
    console.log($event)
    this.adelantoViatico.coD_COMPANIA = $event.detail.value;
  }
  obtenerFechaCorte() {
    let currentDate = this.adelantoViatico.fechA_INICIAL;
    let date = currentDate.getDay();
    let daysToSunday = 7 - date;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToSunday);
  }
  async listaColaboradores() {
    const modal = await this.modalCtrl.create({
      component: ListaUsuariosPage,
      cssClass: 'alert-modal'
    })

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
      console.log(data)
      data.forEach((usuario: UsuarioExactus) => {
        let i = this.usuarios.findIndex(e => e.usuario == usuario.usuario);
        if (i < 0) {
          usuario.monto = 0;
          this.usuarios.push(usuario)
        }

      })
    }
  }
  cargarDatos() {
    this.adelantoViatico.fechA_INICIAL = new Date(this.formatoFecha);
    this.adelantoViatico.fechA_FINAL = this.obtenerFechaCorte();
    this.adelantoViatico.fechA_TRANSACCION = new Date(this.formatoFecha);


  }
  cerrarModal() {
    this.modalCtrl.dismiss();

  }
  borrarDatos() {
    this.formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
    this.montoMaximo = 0;
    this.adelantoViatico = {
      id: null,
      cREADO_POR: null,
      mODIFICADO_POR: null,
      eSTATUS: 'P',
      coD_COMPANIA: null,
      fecha: new Date(),
      fechA_INICIAL: new Date(),
      fechA_FINAL: new Date(),
      detalle: null,
      fechA_TRANSACCION: new Date(),
      numerO_TRANSACCION: null,
      moneda: '₡',
      monto: 0,
      utilizado: 0,
      restante: 0,
      observaciones: null,
      lineas: 0,
      ultimA_FECHA_MODIFICACION: new Date()
    }
    this.usuarios = [];
    this.cargarDatos();
  }

  async fecha(identificador: string) {

    let nuevaFecha = null;
    switch (identificador) {
      case 'fechaInicial':
        nuevaFecha = this.adelantoViatico.fechA_INICIAL.toISOString();

        break;
      case 'fechaTransaccion':

        nuevaFecha = this.adelantoViatico.fechA_TRANSACCION.toISOString();
        break;
    }
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps: {
        fecha: nuevaFecha
      }
    })

    await popover.present();
    const { data } = await popover.onDidDismiss();

    if (data != undefined) {



      this.formatoFecha = data.fecha;

      switch (identificador) {
        case 'fechaInicial':

          if (new Date(this.formatoFecha).getDay() == 0) {
            this.alertasService.message('Dione', 'Lo sentimos no se pueden utilizar fechas de corte.')
            return
          }
          this.adelantoViatico.fechA_INICIAL = new Date(this.formatoFecha);

          this.adelantoViatico.fechA_FINAL = this.obtenerFechaCorte();
          break;
        case 'fechaTransaccion':
          this.adelantoViatico.fechA_TRANSACCION = new Date(this.formatoFecha);
          break;
      }
    }


  }
  borrarUsuario(i) {
    this.usuarios.splice(i, 1);
    this.actualziarTotales();
  }

  incrementarMonto(usuario: UsuarioExactus, $event) {
    usuario.monto = $event.detail.value;
    this.actualziarTotales();

  }
  actualziarTotales() {
    this.adelantoViatico.monto = 0;
    this.usuarios.forEach(usuario => {
      this.adelantoViatico.monto += Number(usuario.monto);
    })
  }
  randomID(){
    //define a variable consisting alphabets in small and capital letter  
var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";  
var lenString = 10;  
var randomstring = '';  

//loop to select a new character in each iteration  
for (var i=0; i<lenString; i++) {  
var rnum = Math.floor(Math.random() * characters.length);  
randomstring += characters.substring(rnum, rnum+1);  
if(i == lenString -1){
return randomstring
}
}  
}

  generarPost() {

    this.adelantoViatico.cREADO_POR = this.usuariosService.usuario.id
    this.adelantoViatico.mODIFICADO_POR = this.usuariosService.usuario.id
    this.adelantoViatico.lineas = this.usuarios.length;
    this.adelantoViatico.restante = this.adelantoViatico.monto;
    this.alertasService.presentaLoading('Guardando Datos...')
    this.adelantoViaticosService.syncPostAdelantoViaticosToPromise(this.adelantoViatico).then(async (resp: adelantoViaticos) => {

      let numAsiento = this.randomID();  

      let movDir:ONE_MOVDIR = {
        id : this.adelantoViatico.numerO_TRANSACCION,
        tipO_GASTO: 'N/D',
        tipo:'N/D',
        suB_TIPO:'N/D',
        fecha: this.adelantoViatico.fechA_TRANSACCION,
        monto:this.adelantoViatico.monto,
        tipO_ASIENTO:'CB',
        paquete:'CB',
        concepto:`Pago de
        viáticos +
        ${format(this.adelantoViatico.fechA_INICIAL,'MM/dd/yyyy')} +
        ${format(this.adelantoViatico.fechA_FINAL,'MM/dd/yyyy')}`,
        nuM_ASIENTO: numAsiento
     }

await this.procesoContableService.syncPostMovDirToPromise(movDir);

let asientoDiario:ONE_Asiento_Diario = {
  id:null,
 coD_COMPANIA:this.adelantoViatico.coD_COMPANIA, 
 asiento:numAsiento,
 paquete:'CB',
 tipO_ASIENTO:'CB',
 fecha:new Date(),
 contabilidad:'C',
 origen:'CB',
 clasE_ASIENTO:'C',
 totaL_DEBITO_LOC:this.adelantoViatico.monto,
 totaL_DEBITO_DOL:0,
 totaL_CREDITO_LOC:0,
 totaL_CREDITO_DOL:0,
 ultimO_USUARIO:this.usuariosService.usuario.usuario,
 fechA_ULT_MODIF:new Date(),
 marcado:'N',
 notas:`Pago de viáticos ${format(this.adelantoViatico.fechA_INICIAL,'MM/dd/yyyy')} + ${format(this.adelantoViatico.fechA_FINAL,'MM/dd/yyyy')}`,
 totaL_CONTROL_LOC:0,
 totaL_CONTROL_DOL:0,
 usuariO_CREACION:this.usuariosService.usuario.usuario,
 fechA_CREACION:new Date(),
 rowPointer:null,
 dependencia:null,
 noteExistingFlag:0,
 recordDate:new Date(),
 createdBy:this.usuariosService.usuario.usuario,
 updatedBy:this.usuariosService.usuario.usuario,
 createdDate:new Date(),
 documentO_GLOBAL:null
}

await this.procesoContableService.syncPostAsientoDiarioToPromise(asientoDiario);


let diario:ONE_Diario[] = [
  {
     id:null,
     coD_COMPANIA:this.adelantoViatico.coD_COMPANIA, 
     asiento:numAsiento,
     consecutivo:0,
     nit:null,
     centrO_COSTO:'00-00-00',
     cuentA_CONTABLE:'1-01-02-002-007',
     fuente:'fuente',
     referencia:`Pago de viáticos ${format(this.adelantoViatico.fechA_INICIAL,'MM/dd/yyyy')} + ${format(this.adelantoViatico.fechA_FINAL,'MM/dd/yyyy')}`,
     debitO_LOCAL:0,
     debitO_DOLAR:0,
     creditO_LOCAL:this.adelantoViatico.monto,
     creditO_DOLAR:0,
     debitO_UNIDADES:0,
     creditO_UNIDADES:0,
     tipO_CAMBIO:0,
     rowPointer:null,
     basE_LOCAL:0,
     basE_DOLAR:0,
     proyecto:null,
     fase:null,
     noteExistingFlag:0,
     recordDate:new Date(),
     createdBy:this.usuariosService.usuario.usuario,
     updatedBy:this.usuariosService.usuario.usuario,
    createdDate:new Date(),
     documentO_GLOBAL:null
  },


  {
    id:null,
    coD_COMPANIA:this.adelantoViatico.coD_COMPANIA, 
    asiento:numAsiento,
    consecutivo:0,
    nit:null,
    centrO_COSTO:'00-00-00',
    cuentA_CONTABLE:'1-01-05-004-011',
    fuente:'fuente',
    referencia:`Pago de viáticos + ${format(this.adelantoViatico.fechA_INICIAL,'MM/dd/yyyy')}  + ${format(this.adelantoViatico.fechA_FINAL,'MM/dd/yyyy')}`,
    debitO_LOCAL:0,
    debitO_DOLAR:0,
    creditO_LOCAL:this.adelantoViatico.monto,
    creditO_DOLAR:0,
    debitO_UNIDADES:0,
    creditO_UNIDADES:0,
    tipO_CAMBIO:0,
    rowPointer:null,
    basE_LOCAL:0,
    basE_DOLAR:0,
    proyecto:null,
    fase:null,
    noteExistingFlag:0,
    recordDate:new Date(),
    createdBy:this.usuariosService.usuario.usuario,
    updatedBy:this.usuariosService.usuario.usuario,
    createdDate:new Date(),
    documentO_GLOBAL:null
 },


 {
  id:null,
  coD_COMPANIA:this.adelantoViatico.coD_COMPANIA, 
  asiento:numAsiento,
  consecutivo:0,
  nit:null,
  centrO_COSTO:'00-00-00',
  cuentA_CONTABLE:'7-99-01-009-000',
  fuente:'fuente',
  referencia:`Pago de viáticos ${format(this.adelantoViatico.fechA_INICIAL,'MM/dd/yyyy')} + ${format(this.adelantoViatico.fechA_FINAL,'MM/dd/yyyy')} +  ${this.adelantoViatico.numerO_TRANSACCION}`,
  debitO_LOCAL:0,
  debitO_DOLAR:0,
  creditO_LOCAL:this.adelantoViatico.monto,
  creditO_DOLAR:0,
  debitO_UNIDADES:0,
  creditO_UNIDADES:0,
  tipO_CAMBIO:0,
  rowPointer:null,
  basE_LOCAL:0,
  basE_DOLAR:0,
  proyecto:null,
  fase:null,
  noteExistingFlag:0,
  recordDate:new Date(),
  createdBy:this.usuariosService.usuario.usuario,
  updatedBy:this.usuariosService.usuario.usuario,
  createdDate:new Date(),
  documentO_GLOBAL:null
}
]

await this.procesoContableService.syncPostDiarioToPromise(diario);

      console.log(resp)
      this.usuarios.forEach(async (usuario, index) => {

        const linea: LineaAnticipo = {
          id: null,
          iD_ANTICIPO: resp.id,
          metodO_DEVOLUCION: null,
          correO_ENVIADO: 0,
          estatus: 'P',
          usuario: usuario.usuario,
          monto: usuario.monto,
          utilizado: 0,
          restante: usuario.monto
        }
        await this.lineasAnticipoService.syncPostLineaAnticipoToPromise(linea)
        if (index == this.usuarios.length - 1) {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('APP', 'El Anticipo se creo con exito!.')
          this.borrarDatos();
        }
      })

    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
    })
  }




}
