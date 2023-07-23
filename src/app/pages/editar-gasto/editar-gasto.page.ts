import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { NgForm } from '@angular/forms';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { GastosAnticiposService } from 'src/app/services/gastos-anticipos.service';
import { Notificaciones } from 'src/app/models/notificaciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { LineaGasto } from 'src/app/models/gastos';

@Component({
  selector: 'app-editar-gasto',
  templateUrl: './editar-gasto.page.html',
  styleUrls: ['./editar-gasto.page.scss'],
})
export class EditarGastoPage implements OnInit {
  @Input() nuevoGasto: GastoConAnticipo
  @Input()  linea:LineaGasto
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
  @Input() tipo:TiposGastos;
  file = null;

  constructor(
    public modalctrl: ModalController,
    public changeDetector: ChangeDetectorRef,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService,
    public popOverCtrl:PopoverController,
    public tiposGastosService:TiposGastosService,
    public gastosConAnticipoService:GastosAnticiposService,
    public alertCtrl:AlertController,
    public notificacionesService:NotificacionesService,
    public cd:ChangeDetectorRef,
    public gastosAnticiposService:GastosAnticiposService
  ) { }

  async ngOnInit() {
    if(this.nuevoGasto.estatus == 'RA'){
      this.estatus.splice(0,1)
    }
    this.montoAnterior = this.nuevoGasto.monto;
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == this.nuevoGasto.iD_TIPO_GASTO);
   if(i >=0) this.tipoGasto= this.tiposGastosService.tiposGastos[i];
   console.log(this.tipoGasto)
    console.log(this.nuevoGasto)

   
  }
  estadoGasto(ngForm:NgForm){
    console.log(ngForm,'formulario')
   if(ngForm.value.estatus == 'R')this.notificacion(ngForm);
  }

  actualizarGasto(ngForm:NgForm){
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.estatus = ngForm.value.estatus;
    console.log(ngForm.value, 'valor')
    console.log(this.nuevoGasto.estatus , 'this.nuevoGasto.estatus')
    // this.nuevoGasto.estatus
    this.gastosConAnticipoService.syncPutGastoConAnticipo( this.nuevoGasto).then( async (resp) =>{
      this.alertasService.loadingDissmiss();
     
      if(this.nuevoGasto.estatus == 'R'){
        this.notificarUsuario();
        this.linea.estatus = 'R'
         
      }else if(this.nuevoGasto.estatus == 'RA' || this.nuevoGasto.estatus == 'P'){
        this.linea.estatus = this.nuevoGasto.estatus
      }
      await   this.gastosAnticiposService.syncPuLineatGastoToPromise(this.linea);
      this.alertasService.message('DIONE','Gasto Actualizado!..')
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('DIONE','Lo sentimos algo salio mal!..')
    })
  }

  regresar() {
    this.modalctrl.dismiss();
  }

async notificacion(ngForm:NgForm) {
    const alert = await this.alertCtrl.create({
      header: 'DIONE',
      subHeader:'Por favor detallar el motivo de rechazo de la solicitud!',
      mode:'ios',
      buttons:  [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            console.log(data)
            this.motivoRechazo = data.detalle;
             
          },
        },
      ],
      inputs: [
        {
          type: 'textarea',
          placeholder: 'detalle',
          name:'detalle'
        },
      ],
    });

    await alert.present();
    let { data} = await alert.onDidDismiss();
    console.log('data',data)
    console.log('data',this.motivoRechazo)
      if(!this.motivoRechazo) {
        console.log('data2',data)
        ngForm.value.estatus = 'P'
        this.nuevoGasto.estatus = 'P';
        this.cd.detectChanges();
      }  
  }


  notificarUsuario(){

    let notificacion:Notificaciones = {
       id : 0,
       remitente : this.usuariosService.usuario.usuario,
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



}
