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
asientoDiario: ONE_Asiento_Diario;
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
    public notificacionesService:NotificacionesService,
    public adelantoViaticosService:AdelantoViaticosService
    ) { }


    cerrarModal(){

      this.modalCtrl.dismiss(true)
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

    async ngOnInit() {
      let index = 0;
      let paquete = 'CG';
      let consecutivo =
        await this.adelantoViaticosService.syncGetUltimoConsecutivo(
          this.gastosSinAnticipoService.compania.nombre,
          paquete
        );
        let usuario = await this.usuariosService.syncGetUsuariosExactusID();
        let centroCosto = usuario[0].centrO_COSTO;
      let numAsiento = this.incrementString(
        paquete,
        consecutivo ? consecutivo.asiento : null
      );
      let tipO_ASIENTO = 'CG';
      let contabilidad = 'A';
      let origen = 'CG';
      let clasE_ASIENTO = 'N';
      let gastoIndex = 0; // initialize gastoIndex to 0
    
      for (let gasto of this.gastos) {
        gastoIndex++; // increment gastoIndex
        index++;
        let gastoU = {
          usuario: gasto.usuario ? gasto.usuario : 'SIN USUARIO',
          totalColones: gasto.moneda == '¢' ? +gasto.monto : 0,
          totalDolares: gasto.moneda == '$' ? +gasto.monto : 0,
          gastos: [gasto]
        };
        let i = this.gastosSinAnticipo.findIndex((e) => e.usuario == gasto.usuario);
        if (i < 0) {
          this.gastosSinAnticipo.push(gastoU);
        } else {
          this.gastosSinAnticipo[i].totalColones += gasto.monto;
          this.gastosSinAnticipo[i].gastos.push(gasto);
        }
        let referencia = `Liquidación de viáticos ${gasto.usuario} ${format(
          new Date(this.fechaInicioMes),
          'MM/dd/yyyy'
        )} + ${format(new Date(this.fechaFinMes), 'MM/dd/yyyy')}`;
        this.total += gasto.monto;
        // DIARIO
        this.diario.push(
          await this.cierreContableService.generarDiario(
            paquete,
            this.gastosSinAnticipoService.compania.nombre,
            numAsiento,
            gastoIndex, // use gastoIndex instead of gastoIndex++
           gasto.centrO_COSTOS,
            referencia,
            false,
            this.gastosSinAnticipoService.moneda,
            gasto.monto,
            true,
            false
          )
        );
        console.log('index', index);
    
        if (index == this.gastos.length) {
          this.postAsiento = await this.cierreContableService.generarDiario(
            paquete,
            this.gastosSinAnticipoService.compania.nombre,
            numAsiento,
            this.gastos.length +=1, // use gastoIndex instead of gastoIndex++
            '00-00-00',
            numAsiento,
            false,
            this.gastosSinAnticipoService.moneda,
            this.total,
            false,
            true
          );
          this.diario.push(this.postAsiento);
          this.asientoDiario = await this.cierreContableService.generarAsiento(
            this.gastosSinAnticipoService.compania.nombre,
            numAsiento,
            numAsiento,
            paquete,
            tipO_ASIENTO,
            contabilidad,
            origen,
            clasE_ASIENTO,
            true,
            this.gastosSinAnticipoService.moneda,
            this.total,
            true,
            false,
            `Liquidacion Anticipo`
          );
    
          console.log('this.asientoDiario', this.asientoDiario);
          console.log('this.postAsiento', this.postAsiento);
          console.log('this.diario', this.diario);
        }
      }
    }
  notificarUsuario(usuario){

  }

 async  liquidar(){
let indexG = 0;
  await this.procesoContableService.syncPostAsientoDiarioToPromise(
    this.asientoDiario
  );
  console.log('gasto',this.gastos)
 // this.alertasService.presentaLoading('guardando cambios...')
 indexG++;
this.gastos.forEach(async (gasto, index) =>{
 
  console.log('gasto', index)
  console.log('gasto', this.gastos.length-1 )
  gasto.estatus = 'F';
 if(   indexG == index){
  await this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise(gasto) 
  this.gastosSinAnticipo.forEach(async (gastoSin, index2) =>{
 
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
   if(this.gastosSinAnticipo.length-1 == index2){
     if(this.diario){ await this.procesoContableService.syncPostDiarioToPromise(this.diario);}
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
