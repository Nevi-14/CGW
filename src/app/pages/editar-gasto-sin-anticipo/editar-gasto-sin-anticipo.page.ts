import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { Notificaciones } from 'src/app/models/notificaciones';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';

@Component({
  selector: 'app-editar-gasto-sin-anticipo',
  templateUrl: './editar-gasto-sin-anticipo.page.html',
  styleUrls: ['./editar-gasto-sin-anticipo.page.scss'],
})
export class EditarGastoSinAnticipoPage implements OnInit {
  @Input() nuevoGasto: GastoSinAnticipo
  tipoGasto: TiposGastos
  montoAnterior = 0;
  restanteAnterior = 0;
  motivoRechazo  = null;
  estatus = [
    {
     id: 'P',
     valor : 'Pendiente'
    },
    {
      id: 'RA',
      valor : 'Requiere Aprobación'
     },
    {
      id: 'A',
      valor : 'Aprobado'
     },
     {
      id: 'R',
      valor : 'Rechazado'
     }
  ]
  constructor(
 public tiposGastosService:TiposGastosService,
 public gastosSinAnticipoService:GastosSinAnticipoService ,
 public alertasService:AlertasService,
 public notificacionesService:NotificacionesService,
 public modalCtrl:ModalController  
  ) { }

  ngOnInit() {
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == this.nuevoGasto.iD_TIPO_GASTO);
   if(i >=0) this.tipoGasto= this.tiposGastosService.tiposGastos[i];
   console.log(this.tipoGasto)
    console.log(this.nuevoGasto)

   
  
    console.log(this.nuevoGasto, 'gastooo')
  }
  estadoGasto(fRegistroGasto){
    
  }
  actualizarGasto(ngForm:NgForm){
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.estatus = ngForm.value.estatus;
    console.log(ngForm.value, 'valor')
    console.log(this.nuevoGasto.estatus , 'this.nuevoGasto.estatus')
    // this.nuevoGasto.estatus
    this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise( this.nuevoGasto).then( async (resp) =>{
      this.alertasService.loadingDissmiss();
     
      if(this.nuevoGasto.estatus == 'R'){
        this.notificarUsuario();
        this.nuevoGasto.estatus = 'R'
         
      }else if(this.nuevoGasto.estatus == 'RA' || this.nuevoGasto.estatus == 'P'){
        this.nuevoGasto.estatus = this.nuevoGasto.estatus
      }
      await   this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise(this.nuevoGasto);
      this.alertasService.message('DIONE','Gasto Actualizado!..')
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('DIONE','Lo sentimos algo salio mal!..')
    })
  }

  notificarUsuario(){

    let notificacion:Notificaciones = {
       id : 0,
       remitente :this.nuevoGasto.usuario,
       usuario : this.nuevoGasto.usuario,
       canal:'co',
       tipo:'RA', // Registro Anticipo
       referencia:String(this.nuevoGasto.id),
       estatus:'P',
       fecha: new Date(),
       fechaLimite: new Date(),
       titulo:`Se ha rechazado  el gasto # ${this.nuevoGasto.id}`,
       descripcion: `${this.motivoRechazo}`
    }
 
   

    this.notificacionesService.syncPostNotificacionToPromise(notificacion).then(resp =>{
    
console.log('resp usuario notificado', resp)
    }, error =>{
    
    })

  }

  regresar(){

    this.modalCtrl.dismiss();
  }
}
