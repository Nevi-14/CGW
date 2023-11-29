import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import {
  LineaAnticipo,
  adelantoViaticos,
  anticipo,
} from '../../models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { VistassService } from 'src/app/services/vistas.service';
import { UsuarioExactus } from 'src/app/models/usuarios';
import { ListaUsuariosPage } from '../lista-usuarios/lista-usuarios.page';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import {
  ONE_Asiento_Diario,
  ONE_Diario,
  ONE_MOVDIR,
} from 'src/app/models/procesoContable';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { Notificaciones } from 'src/app/models/notificaciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CompaniasService } from 'src/app/services/companias.service';
import { CierreContableService } from 'src/app/services/cierre-contable.service';
import { NgForm } from '@angular/forms';
import { CentrO_COSTO } from 'src/app/models/centroCostos';
import { CentroCostosPage } from '../centro-costos/centro-costos.page';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
interface filtros {
  nombre:any,
  filtro:any, 
 }
@Component({
  selector: 'app-registro-anticipos',
  templateUrl: './registro-anticipos.page.html',
  styleUrls: ['./registro-anticipos.page.scss'],
})
export class RegistroAnticiposPage implements OnInit {
  usuarios: any[] = [];
  centros: CentrO_COSTO[] = [];
  data = [];
  editing = {};
  rows = [];
  columns = [];
  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = 'force';
  adelantoViatico: adelantoViaticos = {
    id: null,
    cREADO_POR: null,
    mODIFICADO_POR: null,
    estatus: 'P',
    coD_COMPANIA: null,
    fecha: new Date(),
    fechA_INICIAL: new Date(),
    fechA_FINAL: new Date(),
    asiento: null,
    asientO_CIERRE: null,
    detalle: null,
    fechA_TRANSACCION: new Date(),
    numerO_TRANSACCION: null,
    moneda: '₡',
    monto: 0,
    utilizado: 0,
    restante: 0,
    excedente: 0,
    observaciones: null,
    lineas: 0,
    ultimA_FECHA_MODIFICACION: new Date(),
  };
  Cod_Compania = null;
  formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
  montoMaximo = 0;
  montoTotal = 0;
  montoRestante = 0;
  isOpen: boolean = false;
  textoBuscar = '';
  companias: any[] = [];
  usuariosAnticipo: UsuarioExactus[] = [];
  multi: any = 'multi';
  centroCosto: CentrO_COSTO = null;
  filtro:filtros = {nombre:'Nombre',filtro:'nombre'}
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
    public procesoContableService: ProcesoContableService,
    public notificacionesService: NotificacionesService,
    public companiasService: CompaniasService,
    public cierreContableService: CierreContableService,
    public solicitudesService:SolicitudesService
  ) {
    this.cargarUsuarios(this.usuarios);
  }
  updateValue($event) {
    // this.editing[rowIndex + '-' + cell] = false;
    // this.rows[rowIndex][cell] = event.target.value;

    // this.rows = [...this.rows];
   setTimeout(() => {
    this.actualizarTotales();
   }, 1500);
  }

  actualizarTotales() {
    this.adelantoViatico.monto = 0;
    this.usuarios.forEach((u) => {
      this.adelantoViatico.monto += Number(u.monto);
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      //d.nombre, d.descripcion, etc..
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  ngOnInit() {
    this.companiasService.syncGetCompaniasToPromise().then((companias) => {
      companias.forEach((cliente, index) => {
        let compania = {
          id: cliente.nombre,
          valor: cliente.nombre,
        };
        this.companias.push(compania);
        if (index == companias.length - 1) {
          this.cargarDatos();

          if (this.adelantoViaticosService.solicitudes.length > 0) {
            this.adelantoViatico.coD_COMPANIA =
              this.adelantoViaticosService.solicitudes[0].cia;
              console.log(this.adelantoViatico.coD_COMPANIA)
              console.log(this.adelantoViaticosService.solicitudes)
            this.cargarUsuarios(this.adelantoViaticosService.solicitudes);
          }
        }
      });
    });
  }
  async compania(form: NgForm) {
    // this.adelantoViatico.coD_COMPANIA = $event.detail.value;
    console.log(form.value);
    this.Cod_Compania = form.value.coD_COMPANIA;

    return;
    this.centros = [];
    this.centros = await this.companiasService.syncGetCentroCostosToPromise(
      form.value.coD_COMPANIA
    );
    this.centros.forEach((cliente, index) => {
      let centro = {
        id: cliente.centrO_COSTO1,
        valor: cliente.descripcion,
      };
      console.log(centro);
      this.data.push(centro);
      if (index == this.centros.length - 1) {
      }
    });
  }
  obtenerFechaCorte() {
    let currentDate = this.adelantoViatico.fechA_INICIAL;
    let date = currentDate.getDay();
    let daysToSunday = 7 - date;
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + daysToSunday
    );
  }
  async listaColaboradores() {
    const modal = await this.modalCtrl.create({
      component: ListaUsuariosPage,
      cssClass: 'medium-modal',
      componentProps: {
        Cod_Compania: this.Cod_Compania,
      },
    });

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
      this.cargarUsuarios(data);
    }
  }
  async centrosCostos() {
    const modal = await this.modalCtrl.create({
      component: CentroCostosPage,
      cssClass: 'medium-modal',
      componentProps: {
        centroCostos: this.centros,
      },
    });

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != undefined) {
      this.centroCosto = data;
    }
  }
 async  cargarUsuarios(usuarios: any[]) {
    let usuariosDB = await this.usuariosService.syncGetUsuariosToPromise();
    this.rows = [];

    usuarios.forEach((usuario, index) => {
      let i = this.usuarios.findIndex((e) => e.usuario == usuario.usuario);
      if (i < 0) {
        usuario.monto = usuario.monto ? usuario.monto : 0;
        let ui = usuariosDB.findIndex((e) => e.usuario == usuario.usuario);
      if(ui >= 0){
        usuario.nombre = usuariosDB[ui].nombre+' '+ usuariosDB[ui].apellido;
        this.usuarios.push(usuario);
      }
        
      }

      if (usuarios.length - 1 == index) {
        this.usuarios.forEach((usuario, index) => {
          this.rows.push(usuario);
          if (this.usuarios.length - 1 == index) {
            //this.rows = this.usuarios
            this.temp = [...this.rows];
            this.actualizarTotales();
          }
        });
      }
    });
  }

  regresar(){
    this.router.navigateByUrl('/inicio/control-anticipos');
  }
  cargarDatos() {
    this.adelantoViatico.fechA_INICIAL = new Date(this.formatoFecha);
    this.adelantoViatico.fechA_FINAL = this.obtenerFechaCorte();
    this.adelantoViatico.fechA_TRANSACCION = new Date(this.formatoFecha);
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  borrarElemento(row) {
    this.adelantoViatico.monto -= Number(row.monto);
    let i = this.rows.findIndex((e) => e.usuario == row.usuario);
    if (i >= 0) {
      let u = this.usuarios.findIndex((e) => e.usuario == row.usuario);
      if (u >= 0) {
        this.usuarios.splice(u, 1);
      }
      this.rows.splice(i, 1);
      this.cargarUsuarios(this.usuarios);
    }
  }
  borrarDatos() {
    this.formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
    this.montoMaximo = 0;
    this.adelantoViatico = {
      id: null,
      cREADO_POR: null,
      mODIFICADO_POR: null,
      estatus: 'P',
      coD_COMPANIA: null,
      fecha: new Date(),
      fechA_INICIAL: new Date(),
      fechA_FINAL: new Date(),
      asiento: null,
      asientO_CIERRE: null,
      detalle: null,
      fechA_TRANSACCION: new Date(),
      numerO_TRANSACCION: null,
      moneda: '₡',
      monto: 0,
      utilizado: 0,
      restante: 0,
      excedente: 0,
      observaciones: null,
      lineas: 0,
      ultimA_FECHA_MODIFICACION: new Date(),
    };
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
        fecha: nuevaFecha,
      },
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();

    if (data != undefined) {
      this.formatoFecha = data.fecha;

      switch (identificador) {
        case 'fechaInicial':
          if (new Date(this.formatoFecha).getDay() == 0) {
            this.alertasService.message(
              'D1',
              'Lo sentimos no se pueden utilizar fechas de corte.'
            );
            return;
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
  }

  selectAll($event){
    console.log($event)
  }
  incrementarMonto(usuario: UsuarioExactus, $event) {
    usuario.monto = $event.detail.value;
    this.adelantoViatico.monto += usuario.monto;
    this.actualziarTotales();
  }
  actualziarTotales() {
    this.adelantoViatico.monto = 0;
    this.usuarios.forEach((usuario) => {
      this.adelantoViatico.monto += Number(usuario.monto);
    });
  }
  randomID() {
    //define a variable consisting alphabets in small and capital letter
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var lenString = 10;
    var randomstring = '';

    //loop to select a new character in each iteration
    for (var i = 0; i < lenString; i++) {
      var rnum = Math.floor(Math.random() * characters.length);
      randomstring += characters.substring(rnum, rnum + 1);
      if (i == lenString - 1) {
        return randomstring;
      }
    }
  }
  incrementString(paquete: string, str: string): string {
    let prefix = paquete; // get the first two letters

    if (!str) {
      return prefix + '00000001';
    }
    let numberPart = str.substring(2); // get the number part

    // Use regex to extract leading zeros and the numeric part
    const regexResult = numberPart.match(/^0*(\d+)$/);

    if (regexResult) {
      let number = parseInt(regexResult[1]); // convert the numeric part to a number
      number++; // increment the number

      // Convert the incremented number back to a string and pad with leading zeros
      let newNumberPart = number.toString().padStart(numberPart.length, '0');

      return prefix + newNumberPart;
    } else {
      // If the number part doesn't match the expected format, return an error or handle it as needed
      return this.incrementString(paquete, str);
    }
  }

  async generarPost(form: NgForm) {
    if(this.rows.length == 0) return this.alertasService.message('D1','Debes de agregar al menos un usuario');
   if(this.adelantoViatico.monto == 0  || !this.adelantoViatico.monto) return this.alertasService.message('D1','Debes de agregar un monto');
    let consecutivoNum = 0;
    // let usuario = await this.usuariosService.syncGetUsuariosExactusID();
    let centroCosto = '00-00-00';
    // let data = form.value;
    // this.adelantoViatico.detalle = data.detalle;
    // this.adelantoViatico.numerO_TRANSACCION = data.numerO_TRANSACCION;
    // this.adelantoViatico.coD_COMPANIA = data.coD_COMPANIA;
    if(!this.adelantoViatico.detalle) return this.alertasService.message('D1','Debes de agregar una justificacion');
    
    // if(!data.coD_COMPANIA) return this.alertasService.message('D1','Debes de seleccionar una compañia');
    if(!this.adelantoViatico.fechA_INICIAL) return this.alertasService.message('D1','Debes de seleccionar una fecha inicial');
    if(!this.adelantoViatico.fechA_FINAL) return this.alertasService.message('D1','Debes de seleccionar una fecha final');
    //if(!data.numerO_TRANSACCION) return this.alertasService.message('D1','Debes de agregar un numero de transaccion');
  


    let paquete = 'CB';
    let consecutivo =
      await this.adelantoViaticosService.syncGetUltimoConsecutivo(
        this.adelantoViatico.coD_COMPANIA,
        paquete
      );
    let numAsiento = this.incrementString(
      paquete,
      consecutivo ? consecutivo.asiento : null
    );
    let tipO_ASIENTO = 'CB';
    let contabilidad = 'C';
    let origen = 'CB';
    let clasE_ASIENTO = 'C';

    if (
      !this.adelantoViatico.detalle ||
      !this.adelantoViatico.coD_COMPANIA ||
      !this.adelantoViatico.numerO_TRANSACCION
    )
      return this.alertasService.message(
        'D1',
        'Todos los campos son obligatorios!..'
      );


    let usuariosSinMontoAsignado = 0;

    this.adelantoViatico.cREADO_POR = this.usuariosService.usuario.id;
    this.adelantoViatico.mODIFICADO_POR = this.usuariosService.usuario.id;
    this.adelantoViatico.lineas = this.usuarios.length;
    this.adelantoViatico.restante = this.adelantoViatico.monto;
 this.adelantoViaticosService.solicitudesActualizar.forEach((solicitud) => {
    solicitud.estatus = 'F';  
    solicitud.asiento = numAsiento;
  this.solicitudesService.syncPutSolicitudToPromise(solicitud);
 })
    this.alertasService.presentaLoading('Guardando Datos...');

    this.adelantoViatico.asiento = numAsiento;
    this.adelantoViaticosService
      .syncPostAdelantoViaticosToPromise(this.adelantoViatico)
      .then(
        async (resp: adelantoViaticos) => {
          let movDir: ONE_MOVDIR = {
            id: this.adelantoViatico.numerO_TRANSACCION,
            tipO_GASTO: 'N/D',
            tipo: 'N/D',
            suB_TIPO: 'N/D',
            fecha: this.adelantoViatico.fechA_TRANSACCION,
            monto: this.adelantoViatico.monto,
            tipO_ASIENTO: 'CB',
            paquete: 'CB',
            concepto: `Pago de
    viáticos +
    ${format(this.adelantoViatico.fechA_INICIAL, 'MM/dd/yyyy')} +
    ${format(this.adelantoViatico.fechA_FINAL, 'MM/dd/yyyy')}`,
            nuM_ASIENTO: this.adelantoViatico.asiento,
          };

          await this.procesoContableService.syncPostMovDirToPromise(movDir);

          let asientoDiario: ONE_Asiento_Diario =
          await this.cierreContableService.generarAsiento(
            this.adelantoViatico.coD_COMPANIA,
            numAsiento,
            null,
            paquete,
            tipO_ASIENTO,
            contabilidad,
            origen,
            clasE_ASIENTO,
            true,
            this.adelantoViatico.moneda,
            this.adelantoViatico.monto,
            true,
            false,
            `Anticipos  viáticos ${format(
              this.adelantoViatico.fechA_INICIAL,
              'MM/dd/yyyy'
            )}  / ${format(
              this.adelantoViatico.fechA_FINAL,
              'MM/dd/yyyy'
            )}`
          );
       
        await this.procesoContableService.syncPostAsientoDiarioToPromise(
          asientoDiario
        );
   
   
 this.usuarios.forEach(async (usuario, index) => {

  consecutivoNum++;
  console.log('post usuario', usuario)

 // usuarios inicia aqui
 
 if (usuario.monto == 0) {
   usuariosSinMontoAsignado += 1;
 }

 // INICIO 
// paquete:string,tipO_ASIENTO:string,contabilidad:string,origen:string,clasE_ASIENTO:string


let banco: ONE_Diario =
await this.cierreContableService.generarDiario(
  'CB',
this.adelantoViatico.coD_COMPANIA,
numAsiento,
consecutivoNum,
centroCosto,
`Usuario : ${usuario.nombre}  - Cedula ${usuario.usuario} - Bancos Viaticos - Agosto. 2023-08-15 / 2023-08-20`,
true,
this.adelantoViatico.moneda,
usuario.monto,
true,
false
);
consecutivoNum++;
let anticipo: ONE_Diario =
await this.cierreContableService.generarDiario(
  'CB',
this.adelantoViatico.coD_COMPANIA,
numAsiento,
consecutivoNum,
centroCosto,
`Usuario : ${usuario.nombre}- Cedula ${usuario.usuario} - Anticipo Viaticos - Agosto. 2023-08-15 / 2023-08-20`,
false,
this.adelantoViatico.moneda,
usuario.monto,
false,
true
);

await this.procesoContableService.syncPostDiarioToPromise([
banco,
anticipo,
]);


   const linea: LineaAnticipo = {
     id: null,
     iD_ANTICIPO: resp.id,
     correO_ENVIADO: 0,
     estatus: 'P',
     usuario: usuario.usuario,
     monto: usuario.monto,
     utilizado: 0,
     restante: usuario.monto,
     excedente: 0
   };
   await this.lineasAnticipoService.syncPostLineaAnticipoToPromise(
     linea
   );
   this.notificarUsuario(
     usuario.usuario,
     this.adelantoViatico.numerO_TRANSACCION
   );
   if (index == this.usuarios.length - 1) {
     this.rows = [];
     this.temp = [];
     this.alertasService.loadingDissmiss();
     this.alertasService.message(
       'D1',
       'El Anticipo se creo con exito!.'
     );
     this.borrarDatos();
   }
 });
    

        //  finaliza aqui

     
     


    
        
        },
        (error) => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message(
            'D1',
            'Lo sentimos algo salio mal...'
          );
        }
      );



   
  }

  notificarUsuario(usuario: string, referencia) {
    let notificacion: Notificaciones = {
      id: 0,
      remitente: this.usuariosService.usuario.usuario,
      usuario: usuario,
      canal: 'co',
      tipo: 'RA', // Registro Anticipo
      referencia: referencia,
      estatus: 'P',
      fecha: new Date(),
      fechaLimite: new Date(),
      titulo: `Registro Anticipo ${referencia}`,
      descripcion: `Se ha creado un nuevo anticipo ${referencia}`,
    };

    this.notificacionesService.syncPostNotificacionToPromise(notificacion).then(
      (resp) => {},
      (error) => {}
    );
  }
}
