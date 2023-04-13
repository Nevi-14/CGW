import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Usuario, UsuariosCitrix } from 'src/app/models/usuario';
import { AlertasService } from '../../services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import { adelantoViaticos } from '../../models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { CrearAdelantoViaticosPage } from '../crear-adelanto-viaticos/crear-adelanto-viaticos.page';
import { VistassService } from 'src/app/services/vistas.service';
import { Clientes } from '../../models/clientes';

@Component({
  selector: 'app-registro-anticipos',
  templateUrl: './registro-anticipos.page.html',
  styleUrls: ['./registro-anticipos.page.scss'],
})
export class RegistroAnticiposPage implements OnInit {
  usuarios: UsuariosCitrix[] = []

  adelantoViatico: adelantoViaticos = {
    id : null,
    iD_MATRIZ_ACCESO: 1,
    correO_ENVIADO : 0,
   emisor: this.usuariosService.usuario.usuario,
   estatus: 'P',
   usuario:null,
   coD_COMPANIA :null,
   fechA_INICIAL: new Date(),
   fechA_FINAL:  new Date(),
   detalle : null,
   fechA_TRANSACCION:  new Date(),
   numerO_TRANSACCION :null,
   moneda:null,
   monto: 0,
   utilizado: 0,
   restante: 0,
   exedente: 0,
   observaciones:'obervaciones'

  }
  adelantoVaticos: adelantoViaticos[] = [];
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
    let data = this.adelantoVaticos.filter(adelanto => adelanto.usuario == usuario.usuario);
    return data.length;

  }

  async crearAdelantoViaticos() {

    if (this.adelantoVaticos.length == 0) {
      return
    }
    this.isOpen = true;

    const modal = await this.modalCtrl.create({
      component: CrearAdelantoViaticosPage,
      componentProps: {
        adelantoVaticos: this.adelantoVaticos
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
      return this.alertasService.message('APP', 'Lo sentimos supera el monto limite, el monto permitido por usuario es de ' + this.montoMaximo / this.usuariosAnticipo.length)
    }
    this.montoTotal += this.adelantoViatico.monto;
    this.montoRestante = this.montoMaximo - this.montoTotal;
    this.adelantoViatico.restante = this.adelantoViatico.monto;

    for (let i = 0; i < this.usuariosAnticipo.length; i++) {
      console.log(this.usuariosAnticipo[i])
      let anticipo: adelantoViaticos = {
        id : this.adelantoViatico.id,
        iD_MATRIZ_ACCESO: this.adelantoViatico.iD_MATRIZ_ACCESO,
        correO_ENVIADO :  this.adelantoViatico.correO_ENVIADO,
        emisor:  this.adelantoViatico.emisor,
        estatus:  this.adelantoViatico.estatus,
        usuario: this.usuariosAnticipo[i].usuario,
        coD_COMPANIA : this.adelantoViatico.coD_COMPANIA,
        fechA_INICIAL:  this.adelantoViatico.fechA_INICIAL,
        fechA_FINAL:  this.adelantoViatico.fechA_FINAL,
        detalle :  this.adelantoViatico.detalle,
        fechA_TRANSACCION:   this.adelantoViatico.fechA_TRANSACCION,
        numerO_TRANSACCION : this.adelantoViatico.numerO_TRANSACCION,
        moneda: this.adelantoViatico.moneda,
        monto:  this.adelantoViatico.monto,
        utilizado:  this.adelantoViatico.utilizado,
        restante:  this.adelantoViatico.restante,
        exedente:  this.adelantoViatico.exedente,
        observaciones: this.adelantoViatico.observaciones
      }

      console.log(anticipo)
      this.adelantoVaticos.push(anticipo);
      if (i == this.usuariosAnticipo.length - 1) {
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

    this.adelantoViatico = {
      id : null,
      iD_MATRIZ_ACCESO: 1,
      correO_ENVIADO : 0,
     emisor: this.usuariosService.usuario.usuario,
     estatus: 'P',
     usuario:null,
     coD_COMPANIA :null,
     fechA_INICIAL: new Date(),
     fechA_FINAL:  new Date(),
     detalle : null,
     fechA_TRANSACCION:  new Date(),
     numerO_TRANSACCION :null,
     moneda:null,
     monto: 0,
     utilizado: 0,
     restante: 0,
     exedente: 0,
     observaciones:'obervaciones'
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
 
          this.adelantoViatico.fechA_INICIAL = this.obtenerFechaCorte();
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
