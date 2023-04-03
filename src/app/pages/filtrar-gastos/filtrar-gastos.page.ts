import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { Usuario } from '../../models/usuario';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { format } from 'date-fns';
import { GastosService } from 'src/app/services/gastos.service';

@Component({
  selector: 'app-filtrar-gastos',
  templateUrl: './filtrar-gastos.page.html',
  styleUrls: ['./filtrar-gastos.page.scss'],
})
export class FiltrarGastosPage implements OnInit {
  factura = null;
  formatoFecha =null
  usuario = null;
  usuarioID = null;
  usuarios: Usuario[]=[];
  today:Date = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m , 1).toISOString();
  value2 = new Date(this.y, this.m+1 , 0).toISOString();
  textoBuscar = "";
  fechaActual: boolean=false;
  estado = 'A';
  estados=[
    {
    id:'A',
    description:'Archivados'
    },{
      id:'P',
      description:'Pendientes'
      },
      {
        id:'R',
        description:'Rechazadas'
        }
    
  ]
  constructor(
    
    public modalCtrl: ModalController,
    public popOverCtrl: PopoverController,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public gastosService:GastosService
    
    
    
    ) { }

  ngOnInit(


  ) {
    this.cargarDatos();
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
      }
  cargarDatos(){
    this.formatoFecha = new Date(this.formatoFecha);
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

  
  seleccionarUsuario(usuario:Usuario, index){
     
    this.usuario = index;
    this.usuarioID = usuario.usuario
  }



  async fechaPopOver(index) {

  
 
      const popover = await this.popOverCtrl.create({
        component: CalendarioPopoverPage,
        cssClass: 'my-custom-class',
        translucent: true,
        componentProps : {
          fecha: index == 0 ? this.value1 : this.value2
        }
      });
      await popover.present();
    
      const { data } = await popover.onDidDismiss();
    
      if(data != undefined){
       
        let fecha= new Date(data.fecha).toLocaleDateString('Es', {
          year: 'numeric',
          month: '2-digit',
          weekday: 'short',
          day: 'numeric',
        });

        if(index == 0){
          this.value1 =  data.fecha;;
        }else{
          this.value2 =  data.fecha;
        }
        
    
    
      }
    }


    generarConsulta(){

      console.log('this.factura', this.factura)
      console.log('this.usuarioID', this.usuarioID)
    if(this.factura){
       this.gastosService.syncGetGastoFacturaToPromise(this.factura).then( resp =>{
        this.gastosService.rellenarArregloGastos(resp);
          this.cerrarModal();
      })
      } else if( !this.factura && this.usuarioID){
  this.gastosService.synsgetGastosUsuarioRangoFechaToPromise(this.usuarioID, this.estado, this.value1, this.value2).then( resp =>{
this.gastosService.gastos = resp;
this.gastosService.rellenarArregloGastos(resp);
this.cerrarModal();
        })
      }
      else if(this.fechaActual ){
        this.gastosService.getViaticos(this.estado, new Date().toISOString(), new Date().toISOString());
        this.cerrarModal();
      }else{
        this.gastosService.getViaticos(this.estado, this.value1, this.value2);
        this.cerrarModal();
      }
    }
}
