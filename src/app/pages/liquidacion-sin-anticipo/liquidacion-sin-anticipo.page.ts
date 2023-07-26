import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from 'src/app/models/procesoContable';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { CierreContableService } from 'src/app/services/cierre-contable.service';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { gastos } from '../../models/gastos';
import { Notificaciones } from 'src/app/models/notificaciones';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { EstadosCuenta } from 'src/app/models/estadosCuenta';
interface gastosSin {
  usuario :string,
  totalColones:number,
  totalDolares:number,
  gastos:GastoSinAnticipo[]
}
 
@Component({
  selector: 'app-liquidacion-sin-anticipo',
  templateUrl: './liquidacion-sin-anticipo.page.html',
  styleUrls: ['./liquidacion-sin-anticipo.page.scss'],
})
export class LiquidacionSinAnticipoPage implements OnInit {
@Input() gastos:GastoSinAnticipo[]
  fecha: Date = new Date();
  ano = this.fecha.getFullYear();
  mes = this.fecha.getMonth();
  fechaInicioMes = new Date(this.ano, this.mes, 1).toISOString();
  fechaFinMes = new Date(this.ano, this.mes + 1, 0).toISOString();
    diario: ONE_Diario[] = [];
  postAsiento: ONE_Diario = null;
  postSobrante: ONE_Diario = null;
  movDirSobrante: ONE_MOVDIR = null;
  asientoDiarioSobrante: ONE_Asiento_Diario = null;
  diarioSobrante: ONE_Diario[] = [];
  total = 0;
  gastosSinAnticipo:gastosSin[] = [];
  constructor(
    public modalCtrl: ModalController,
    public adelantosService: AdelantoViaticosService,
    public procesoContableService: ProcesoContableService,
    public usuariosService: UsuariosService,
    public cierreContableService: CierreContableService,
    public gastosService:GastosService,
    public lienasAnticiposService:LineasAnticiposService,
    public alertasService:AlertasService,
    public router:Router,
    public estadosCuentaService:EstadosCuentaService,
    public gastosSinAnticipoService:GastosSinAnticipoService,
    public notificacionesService:NotificacionesService
    ) { }


    cerrarModal(){

      this.modalCtrl.dismiss(true)
    }
 async  ngOnInit() {
  
  let consecutivo = this.fechaInicioMes.split('T')[0]+this.fechaFinMes.split('T')[0];
 
 
      console.log(gastos,'gastos')

      this.gastos.forEach((gasto, gastoIndex) =>{
        let gastoU = {
          usuario:gasto.usuario,
          totalColones:  gasto.moneda == '¢' ? +gasto.monto : 0,
          totalDolares: gasto.moneda == '$' ? +gasto.monto : 0,
          gastos:[gasto]
         }
        let i = this.gastosSinAnticipo.findIndex( e => e.usuario == gasto.usuario);
        if(i < 0){
          this.gastosSinAnticipo.push(gastoU)
        }else{
          this.gastosSinAnticipo[i].totalColones  += gasto.monto;
          this.gastosSinAnticipo[i].gastos.push(gasto)

        }
        let referencia = `Liquidación de viáticos ${gasto.usuario} ${format(new Date(this.fechaInicioMes), 'MM/dd/yyyy')} + ${format(new Date(this.fechaFinMes), 'MM/dd/yyyy')}`;
        this.total += gasto.monto;
        // DIARIO
        this.diario.push(this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.iD_TIPO_GASTO,'1-01-02-002-007', referencia, true, gasto.monto, false,0))

if(gastoIndex ==  this.gastos.length -1){
  let referencia = `Liquidación de gastons sin Anticipo ${format(new Date(this.fechaInicioMes), 'MM/dd/yyyy')} + ${format(new Date(this.fechaFinMes), 'MM/dd/yyyy')}`;
  this.postAsiento = this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.iD_TIPO_GASTO,'1-01-02-002-007', referencia, true, this.total, false,0)
 
}

      })
  
    
  }

  notificarUsuario(usuario){

  }

 async  liquidar(){
 // this.alertasService.presentaLoading('guardando cambios...')
this.gastos.forEach(async (gasto, index) =>{
  gasto.estatus = 'F';
 if(this.gastos.length-1  == index){
  await this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise(gasto) 
  this.gastosSinAnticipo.forEach(async (gastoSin, index) =>{
    let estadoCuenta:EstadosCuenta = {
      id : null,
      anticipo: false,
      referencia : gasto.identificador,
      usuario: gasto.usuario,
      fecha: format(new Date(), 'MM/dd/yyyy'),
      fechA_INICIAL: format(new Date(gasto.fechA_INICIAL), 'MM/dd/yyyy'),
      fechA_FINAL:format(new Date(gasto.fechA_FINAL), 'MM/dd/yyyy'),
      monto: gastoSin.totalColones > 0 
      ? gastoSin.totalColones : gastoSin.totalDolares,
      restante: 0,
      utilizado:gastoSin.totalColones > 0 
      ? gastoSin.totalColones : gastoSin.totalDolares,
      observaciones:'observaciones'
   }
   await this.estadosCuentaService.syncPostEstadosCuentaToPromise(estadoCuenta);
   if(this.gastosSinAnticipo.length -1 == index){
    // if(this.diario){ await this.procesoContableService.syncPostDiarioToPromise(this.diario);}
      //await this.procesoContableService.syncPostAsientoDiarioToPromise(this.asientoDiarioSobrante);
      this.alertasService.loadingDissmiss();
      this.cerrarModal();
      this.router.navigateByUrl('/inicio/control-estados-cuenta',{replaceUrl:true})
  
     }

  })
 }
 
})
 
    console.log('liquidar')
  }
 
}
