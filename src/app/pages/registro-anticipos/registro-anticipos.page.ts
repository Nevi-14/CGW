import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Usuario, UsuariosCitrix } from 'src/app/models/usuario';
import { AlertasService } from '../../services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import { LineaAnticipo, adelantoViaticos, anticipo } from '../../models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { CrearAdelantoViaticosPage } from '../crear-adelanto-viaticos/crear-adelanto-viaticos.page';
import { VistassService } from 'src/app/services/vistas.service';
import { Clientes } from '../../models/clientes';
import { ColonesPipe } from 'src/app/pipes/colones.pipe';

@Component({
  selector: 'app-registro-anticipos',
  templateUrl: './registro-anticipos.page.html',
  styleUrls: ['./registro-anticipos.page.scss'],
})
export class RegistroAnticiposPage implements OnInit {
  usuarios: UsuariosCitrix[] = []

  adelantoViatico: adelantoViaticos = {
    id : null,
    id_usuario_role_module: this.usuariosService.moduloAcceso.rolE_ID,
   estatus: 'P',
   coD_COMPANIA :null,
   fechA_INICIAL: new Date(),
   fechA_FINAL:  new Date(),
   detalle : null,
   fechA_TRANSACCION:  new Date(),
   numerO_TRANSACCION :null,
   moneda:'₡',
   monto: 0,
   utilizado: 0,
   restante: 0,
   excedente: 0,
   excedentes:0,
   sobrantes:0,
   observaciones:'obervaciones',
   lineas:0

  }


  formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
  montoMaximo = 0;
  montoTotal = 0;
  montoRestante = 0;
  isOpen: boolean = false;
  textoBuscar = '';
  clientes: Clientes[] = []
  usuariosAnticipo: UsuariosCitrix[] = []
  constructor(
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public gastosService: GastosService,
    public usuariosService: UsuariosService,
    public popOverCtrl: PopoverController,
    public adelantoViaticosService: AdelantoViaticosService,
    public router: Router,
    public vistasService: VistassService

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
  onSearchChange(event) {

    this.textoBuscar = event.detail.value;
  }




  consultarUsuario(usuario: Usuario) {
    let data = this.adelantoViaticosService.lineasAnticipo.filter(adelanto => adelanto.usuario == usuario.usuario);
    return data.length;

  }

  async crearAdelantoViaticos() {

    if (this.adelantoViaticosService.adelantoVaticos.length == 0) {
      return
    }
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: CrearAdelantoViaticosPage,
      componentProps: {
        adelantoVaticos: this.adelantoViaticosService.adelantoVaticos
      },
      cssClass: 'alert-modal'
    });

    if (this.isOpen) {

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;
      if (data != undefined) {
        this.adelantoViaticosService.syncGetAdelantoViaticosToPromise().then(resp => {

          this.alertasService.message('APP', 'Adelanto de viático guardado!')
        }, error => {

        });

      }

    }
  }

  agregarAdelanto() {
    if (this.montoMaximo <= 0 || !this.montoMaximo) {
      return this.alertasService.message('APP', 'Ingresa un monto limite mayor a 0 para continuar!.')
    }
    if (this.usuariosAnticipo.length == 0) {
      return this.alertasService.message('APP', 'Selecciona al menos un usuario para continuar!.')
    }
    if (!this.adelantoViatico.detalle || !this.adelantoViatico.numerO_TRANSACCION || this.adelantoViatico.monto <= 0 || !this.adelantoViatico.coD_COMPANIA) {
      return this.alertasService.message('APP', 'Verifica que cumpla con los campos requeridos!..')
    }
    if (this.adelantoViatico.monto * this.usuariosAnticipo.length > this.montoMaximo) {
      return this.alertasService.message('APP', 'Lo sentimos supera el monto limite, el monto permitido por usuario es de ' + ColonesPipe.prototype.transform( this.montoMaximo / this.usuariosAnticipo.length, 2 , '.' , ',' ,  this.adelantoViatico.moneda))
    }
    this.montoTotal += this.adelantoViatico.monto;
    this.montoRestante = this.montoMaximo - this.montoTotal;
    this.adelantoViatico.id = this.adelantoViaticosService.adelantoVaticos.length +1;
  this.adelantoViatico.lineas = this.usuariosAnticipo.length;

    let adelanto:anticipo = {
      adelantoViatico : this.adelantoViatico,
      lineasAnticipo: []
    }

   // this.adelantoViaticosService.adelantoVaticos.push(this.adelantoViatico);
    for (let i = 0; i < this.usuariosAnticipo.length; i++) {
      console.log(this.usuariosAnticipo[i])
      let lineaAnticipo: LineaAnticipo  = {
        id : null,
        iD_ANTICIPO: this.adelantoViatico.id,
        correO_ENVIADO  : 0,
        estatus:  this.adelantoViatico.estatus,
        usuario: this.usuariosAnticipo[i].usuario,
        monto:  this.adelantoViatico.monto,
        utilizado:  this.adelantoViatico.utilizado,
        restante: this.adelantoViatico.monto,
        excedente:  this.adelantoViatico.excedente,
        excedentes:  0,
        sobrante:false,
        observaciones: this.adelantoViatico.observaciones
      }

      console.log(lineaAnticipo)
      adelanto.lineasAnticipo.push(lineaAnticipo)


      if (i == this.usuariosAnticipo.length - 1) {

        adelanto.adelantoViatico.monto = this.adelantoViatico.monto  * this.usuariosAnticipo.length;
        adelanto.adelantoViatico.restante = this.adelantoViatico.monto  * this.usuariosAnticipo.length;
    
        console.log('anticipos',this.adelantoViaticosService.adelantoVaticos)
        console.log('lineaAnticipo',this.adelantoViaticosService.lineasAnticipo)
        this.adelantoViaticosService.adelantoVaticos.push(adelanto)
        this.borrarDatos();
        this.usuariosAnticipo = [];
        this.alertasService.message('Dione', 'Anticipos agregados a la lista!.')
      }
    }


  }


  cargarDatos() {
    this.adelantoViatico.fechA_INICIAL = new Date(this.formatoFecha);
    this.adelantoViatico.fechA_FINAL = this.obtenerFechaCorte();
    this.adelantoViatico.fechA_TRANSACCION = new Date(this.formatoFecha);
    this.alertasService.presentaLoading('Cargando datos..')
    this.usuariosService.syncGetUsuariosExactusToPromise().then(resp => {
      this.alertasService.loadingDissmiss();
      this.usuarios = resp;
    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
    })

  }
  cerrarModal() {
    this.modalCtrl.dismiss();

  }
  borrarDatos() {
    this.formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
this.montoMaximo = 0;
    this.adelantoViatico = {
      id : null,
      id_usuario_role_module: this.usuariosService.moduloAcceso.rolE_ID,
     estatus: 'P',
     coD_COMPANIA :null,
     fechA_INICIAL: new Date(),
     fechA_FINAL:  new Date(),
     detalle : null,
     fechA_TRANSACCION:  new Date(),
     numerO_TRANSACCION :null,
     moneda:'₡',
     monto: 0,
     utilizado: 0,
     restante: 0,
     excedente: 0,
     excedentes:0,
     sobrantes:0,
     observaciones:'obervaciones',
     lineas:0
    }
    this.usuarios.forEach(usuario => {
      usuario.seleccionado = false;
    })
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
  changeListener($event) {


  }

  agregarUsuario($event, u: number) {
    const isChecked = $event.detail.checked;
    console.log('isChecked', isChecked)
    if (isChecked) {
      this.usuariosAnticipo.push(this.usuarios[u]);
    } else {
      let i = this.usuariosAnticipo.findIndex(k => k.usuario == this.usuarios[u].usuario);
      if (i >= 0) {
        this.usuariosAnticipo.splice(i, 1);
      }
    }

    console.log('This.usuariosAnticipo', this.usuariosAnticipo)


  }
  generarPost() {



    this.alertasService.presentaLoading('Guardando Datos...')
    this.adelantoViaticosService.syncPostAdelantoViaticosToPromise(this.adelantoViatico).then(resp => {
      this.alertasService.loadingDissmiss();
      this.modalCtrl.dismiss(true)


    }, error => {
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
    })


  }
}
