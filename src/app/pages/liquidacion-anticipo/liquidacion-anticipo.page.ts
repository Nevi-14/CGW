import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { LineaAnticipo } from 'src/app/models/adelantoViaticos';
import { EstadosCuenta } from 'src/app/models/estadosCuenta';
import { LineaGasto } from 'src/app/models/gastos';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from 'src/app/models/procesoContable';
import { AdelantoViaticosService } from 'src/app/services/adelanto-viaticos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { CierreContableService } from 'src/app/services/cierre-contable.service';
import { EstadosCuentaService } from 'src/app/services/estados-cuenta.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { ProcesoContableService } from 'src/app/services/proceso-contable.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-liquidacion-anticipo',
  templateUrl: './liquidacion-anticipo.page.html',
  styleUrls: ['./liquidacion-anticipo.page.scss'],
})
export class LiquidacionAnticipoPage implements OnInit {
  @Input() linea: LineaAnticipo
  @Input() gastos: LineaGasto[] = []
 
  diario: ONE_Diario[] = [];
  postAsiento: ONE_Diario = null;
  postSobrante: ONE_Diario = null;
  movDirSobrante: ONE_MOVDIR = null;
  asientoDiarioSobrante: ONE_Asiento_Diario = null;
  diarioSobrante: ONE_Diario[] = [];
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
    public estadosCuentaService:EstadosCuentaService
    ) { }

 async  ngOnInit() {
  this.alertasService.presentaLoading('Cargando...')
let consecutivos = await this.adelantosService.syncGetConsecutivo();
let i = consecutivos.findIndex(e => e.cia == this.adelantosService.adelantoViatico.coD_COMPANIA)
let consecutivo = null;
if(i >=0){
consecutivo = consecutivos[i].ultimO_ASIENTO
}
let totalDiario = 0;
    this.gastosService.syncGetGastosAnticipoToPtomise(this.adelantosService.adelantoViatico.id).then(async (gastos) =>{
      console.log(gastos,'gastos')
      gastos.forEach((gasto, gastoIndex) =>{
        let referencia = `Liquidación de viáticos ${gasto.usuario} ${format(new Date(this.adelantosService.adelantoViatico.fechA_INICIAL), 'MM/dd/yyyy')} + ${format(new Date(this.adelantosService.adelantoViatico.fechA_FINAL), 'MM/dd/yyyy')}`;
        totalDiario += gasto.monto;
        // DIARIO
        this.diario.push(this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.tipO_GASTO,'1-01-02-002-007', referencia, true, gasto.monto, false,0))

if(gastoIndex == gastos.length -1){
  let referencia = `Liquidación de viáticos Anticipo ${format(new Date(this.adelantosService.adelantoViatico.fechA_INICIAL), 'MM/dd/yyyy')} + ${format(new Date(this.adelantosService.adelantoViatico.fechA_FINAL), 'MM/dd/yyyy')}`;
  this.postAsiento = this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.tipO_GASTO,'1-01-02-002-007', referencia, true, totalDiario, false,0)
  if(this.adelantosService.adelantoViatico.restante == 0){ this.alertasService.loadingDissmiss(); }
  if (this.adelantosService.adelantoViatico.restante > 0) {
 
    this.lienasAnticiposService.syncGetLineasAnriciposToPromise(this.adelantosService.adelantoViatico.id).then(resp =>{





    console.log('lineas', resp)
let totalSobrante = 0;
resp.forEach(async (lineas, indexLineas) =>{
let referencia2 = `Sobrante 
${lineas.usuario} +  ${format(new Date(this.adelantosService.adelantoViatico.fechA_INICIAL), 'MM/dd/yyyy')} + ${format(new Date(this.adelantosService.adelantoViatico.fechA_FINAL), 'MM/dd/yyyy')}`;
totalSobrante += lineas.restante;
  this.diarioSobrante.push(this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.tipO_GASTO,'7-99-01-009-000', referencia2, false,  0, true, lineas.restante))
  if(indexLineas == resp.length -1){
    let referencia2 = `Sobrante 
Anticipo +  ${format(new Date(this.adelantosService.adelantoViatico.fechA_INICIAL), 'MM/dd/yyyy')} + ${format(new Date(this.adelantosService.adelantoViatico.fechA_FINAL), 'MM/dd/yyyy')}`;
  this.postSobrante = this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.tipO_GASTO,'7-99-01-009-000', referencia2, false,  0, true, totalSobrante);
  this.alertasService.loadingDissmiss();

}
})

})
  }
}

      })
  
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('Error', 'Error al cargar los gastos')
    })
 
  }
  cerrarModal(){
    this.modalCtrl.dismiss()
  }

 

 async  liquidar(){
  this.alertasService.presentaLoading('Guadando cambios...')
    this.adelantosService.adelantoViatico.estatus = 'F';
    await   this.adelantosService.syncPuttAdelantoViaticosToPromise(this.adelantosService.adelantoViatico);
    await this.procesoContableService.syncPostDiarioToPromise(this.adelantosService.adelantoViatico.restante > 0 ? [this.postAsiento, this.postSobrante] : [this.postAsiento]);

    this.lienasAnticiposService.syncGetLineasAnriciposToPromise(this.adelantosService.adelantoViatico.id).then(resp =>{

      resp.forEach(async (linea, index) =>{
        let estadoCuenta:EstadosCuenta = {
          id : null,
          anticipo: true,
          referencia : this.adelantosService.adelantoViatico.numerO_TRANSACCION,
          usuario: linea.usuario,
          fecha: format(new Date(), 'MM/dd/yyyy'),
          fechA_INICIAL: format(new Date(this.adelantosService.adelantoViatico.fechA_INICIAL), 'MM/dd/yyyy'),
          fechA_FINAL:format(new Date(this.adelantosService.adelantoViatico.fechA_FINAL), 'MM/dd/yyyy'),
          monto: linea.monto,
          restante: linea.restante,
          utilizado:linea.utilizado,
          observaciones:'observaciones'
       }
       await this.estadosCuentaService.syncPostEstadosCuentaToPromise(estadoCuenta);
        if(index == resp.length -1){
         await this.alertasService.loadingDissmiss();
          this.cerrarModal();
          this.router.navigateByUrl('/inicio/control-estados-cuenta',{replaceUrl:true})
        }
      })
     
    }, error =>{
      console.log('error', error)
    })
 
  }
}
