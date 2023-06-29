import { Component, OnInit } from '@angular/core';
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
 
    this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise().then(async (gastos) =>{
      console.log(gastos,'gastos')

      gastos.forEach((gasto, gastoIndex) =>{
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

if(gastoIndex == gastos.length -1){
  let referencia = `Liquidación de gastons sin Anticipo ${format(new Date(this.fechaInicioMes), 'MM/dd/yyyy')} + ${format(new Date(this.fechaFinMes), 'MM/dd/yyyy')}`;
  this.postAsiento = this.cierreContableService.generarDiario(gasto.usuario,consecutivo,gasto.iD_TIPO_GASTO,'1-01-02-002-007', referencia, true, this.total, false,0)
 
}

      })
  
    })
  }

  notificarUsuario(usuario){

  }

  liquidar(){

    console.log('liquidar')
  }
 
}
