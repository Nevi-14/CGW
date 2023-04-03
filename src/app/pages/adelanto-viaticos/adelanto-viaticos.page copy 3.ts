import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { AlertasService } from '../../services/alertas.service';
import { GastosService } from '../../services/gastos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { format } from 'date-fns';
import { adelantoViaticos } from '../../models/adelantoViaticos';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { Router } from '@angular/router';
import { CrearAdelantoViaticosPage } from '../crear-adelanto-viaticos/crear-adelanto-viaticos.page';
import { ONE_MOVDIR, ONE_Asiento_Diario, ONE_Diario } from '../../models/procesoContable';
import { VistassService } from 'src/app/services/vistas.service';
import { Clientes } from '../../models/clientes';

@Component({
  selector: 'app-adelanto-viaticos',
  templateUrl: './adelanto-viaticos.page.html',
  styleUrls: ['./adelanto-viaticos.page.scss'],
})
export class AdelantoViaticosPage implements OnInit {
usuarios:Usuario[]=[]
usuario:Usuario
adelantoViatico:adelantoViaticos  = {
   id : null,
   correoEnviado :false,
   estado: 'I',
   remitente: this.usuariosService.usuario.usuario,
   destinatario:null,
    codCompania :null,
    compania: null,
   fechaInicial: new Date(),
   fechaFinal: new Date(),
   fechaCorte:null,
   detalle :null,
   fechaTransaccion:null,
   numeroTransaccion :null,
   moneda: '₡',
   monto: 0,
   utilizado: 0,
   restante: 0,
   exedente: 0
}
adelantoVaticos:adelantoViaticos[]=[];
formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
montoMaximo = 0;
montoTotal =  0;
montoRestante = 0;
isOpen:boolean = false;
textoBuscar = '';
clientes:Clientes[]=[]
  constructor(
public modalCtrl:ModalController,
public alertasService: AlertasService,
public gastosService: GastosService,
public usuariosService:UsuariosService,
public popOverCtrl: PopoverController,
public adelantoViaticosService:AdelantoViaticosService,
public router:Router,
public vistasService:VistassService

  ) { }

  ngOnInit() {
 
    this.vistasService.syncGetClientesToPromise().then(clientes =>{

      clientes.forEach((cliente, index)=>{
      let i = this.clientes.findIndex(c => c.cia == cliente.cia);
      if(i < 0){
        this.clientes.push(cliente)
      }

      if(index == clientes.length -1){
        console.log('clientes', this.clientes);
        this.cargarDatos();
      }
      })

   
    })
;

  }

  cliente1s($event){
console.log($event)
this.adelantoViatico.compania = $event.detail.value;
  }
  nuevoAdelanto(usuario:Usuario){
    if(this.montoMaximo < 0 || this.montoMaximo == 0){
      return   this.alertasService.message('DiOne', 'Ingresa un limite de gastos para iniciar!..')

    }
    
  this.adelantoViatico.destinatario = usuario.usuario
     




  }
  obtenerFechaCorte(){
    let currentDate = this.adelantoViatico.fechaInicial;
    let date = currentDate.getDay();
    let daysToSunday = 7 - date;
    return new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+daysToSunday);
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }

  
 

  consultarUsuario(usuario:Usuario){
    let data = this.adelantoVaticos.filter(adelanto => adelanto.destinatario == usuario.usuario);
    return data.length;
  
  }

  async crearAdelantoViaticos(){

    if(this.adelantoVaticos.length == 0 ){
      return
    }
    this.isOpen = true;
        
    const modal = await this.modalCtrl.create({
component:CrearAdelantoViaticosPage,
componentProps:{
  adelantoVaticos:this.adelantoVaticos
},
cssClass:'alert-modal'
    });

if(this.isOpen){

modal.present();
const {data} = await modal.onWillDismiss();
this.isOpen = false;
if(data != undefined){
  this.adelantoViaticosService.syncGetAdelantoViaticosToPromise().then(resp =>{
   
    this.alertasService.message('APP', 'Adelanto de viático guardado!')
  }, error =>{
 
  });

}

}
  }

  agregarAdelanto(){
 
    let superaMontoTotal = this.montoMaximo <  this.montoTotal + this.adelantoViatico.monto   ? true : false;
    if(superaMontoTotal){
      return   this.alertasService.message('APP', 'Lo sentimos supera el monto máximo!..')

    }
    if(!this.adelantoViatico.detalle || !this.adelantoViatico.numeroTransaccion || this.adelantoViatico.monto < 0 || this.adelantoViatico.monto == 0){
      return   this.alertasService.message('APP', 'Verifica que cumpla con los campos requeridos!..')

    }
    this.montoTotal += this.adelantoViatico.monto;
    this.montoRestante = this.montoMaximo - this.montoTotal;
    this.adelantoViatico.restante = this.adelantoViatico.monto; 
    this.adelantoVaticos.push(this.adelantoViatico);
    this.usuario = null;
 this.borrarDatos();
   
   console.log(this.adelantoVaticos)
  }
  regresar(){

this.router.navigateByUrl('/inicio/control-adelanto-viaticos', {replaceUrl:true})
  }
  cargarDatos(){
    this.adelantoViatico.fechaInicial = new Date(this.formatoFecha);
    this.adelantoViatico.fechaFinal = new Date(this.formatoFecha);
    this.adelantoViatico.fechaTransaccion = new Date(this.formatoFecha);
this.alertasService.presentaLoading('Cargando datos..')
this.usuariosService.syncGetUsuariosToPromise().then(resp =>{
  this.alertasService.loadingDissmiss();
this.usuarios = resp;
}, error =>{
  this.alertasService.loadingDissmiss();
  this.alertasService.message('APP', 'Lo sentimos algo salio mal..')
})

  }
  cerrarModal(){
this.modalCtrl.dismiss();

  }
  borrarDatos(){
    this.formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
    this.usuario = null;
    this.adelantoViatico = {
      id : null,
      correoEnviado :false,
      estado: 'I',
      remitente: this.usuariosService.usuario.usuario,
      destinatario:null,
      codCompania :null,
      compania: null,
      fechaInicial: new Date(this.formatoFecha),
      fechaFinal: new Date(this.formatoFecha),
      fechaCorte:this.obtenerFechaCorte(),
      detalle :null,
      fechaTransaccion:new Date(this.formatoFecha),
      numeroTransaccion :null,
      moneda: '₡',
      monto: 0,
      utilizado: 0,
      restante: 0,
      exedente: 0
    }
  }
  seleccionarUsuario(usuario:Usuario, index){
    this.adelantoViatico.destinatario = usuario.usuario;
    this.usuario = index;
    this.adelantoViatico.fechaCorte = this.obtenerFechaCorte();
  }

  async fecha(identificador:string){

    let nuevaFecha = null;
    switch(identificador){
      case  'fechaInicial':
        nuevaFecha = this.adelantoViatico.fechaInicial.toISOString();
    
      break;
      case    'fechaFinal':

      nuevaFecha = this.adelantoViatico.fechaFinal.toISOString(); 
      break;
      case  'fechaTransaccion':
      
      nuevaFecha = this.adelantoViatico.fechaTransaccion.toISOString(); 
      break;
    }
    const popover = await this.popOverCtrl.create({
      component:CalendarioPopoverPage,
      cssClass:'my-custom-class',
      translucent:true,
      componentProps:{
       fecha: nuevaFecha
      }
    })

    await popover.present();
    const { data } = await popover.onDidDismiss();
  
    if(data != undefined){
     
  
      
      this.formatoFecha = data.fecha;
     
      switch(identificador){
        case  'fechaInicial':
          this.adelantoViatico.fechaInicial =  new Date(this.formatoFecha);
          this.adelantoViatico.fechaCorte = this.obtenerFechaCorte();
          this.adelantoViatico.fechaFinal =  this.obtenerFechaCorte();

          console.log(this.adelantoViatico, 'ssksksk')
        break;
        case    'fechaFinal':
  
        this.adelantoViatico.fechaFinal =  new Date(this.formatoFecha);
        break;
        case  'fechaTransaccion':
       
        this.adelantoViatico.fechaTransaccion =  new Date(this.formatoFecha);
        break;
      }
    }


  }
  changeListener($event){

    
  }

  generarPost(){



    this.alertasService.presentaLoading('Guardando Datos...')
     this.adelantoViaticosService.syncPostAdelantoViaticosToPromise(this.adelantoViatico).then(resp =>{
      this.alertasService.loadingDissmiss();
   this.modalCtrl.dismiss(true)


     },error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
     })

    
      }
}
