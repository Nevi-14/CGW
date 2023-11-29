import { Injectable } from '@angular/core';
import { AdelantoViaticosService } from './adelanto-viaticos.service';
import { ProcesoContableService } from './proceso-contable.service';
import { UsuariosService } from './usuarios.service';
import { format } from 'date-fns';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from '../models/procesoContable';
import { CompaniasService } from './companias.service';
import { AsientoDiario } from '../models/asientoDiario';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CierreContableService {

  asientoDiario:AsientoDiario = null;

cuentaGastosCvetCookCoris = '1-01-05-004-011';
cuentaGastosCrcb = '1-01-25-003-002';
bancosDaViviendaColones = '1-01-02-001-005';
bancoDaViviendaDolares = '1-01-02-002-008';


  constructor(
    public adelantosService: AdelantoViaticosService,
    public procesoContableService: ProcesoContableService,
    public usuariosService: UsuariosService,
    public companiasService:CompaniasService

  ) { }



  generarMovDir(monto, concepto) {
    let movDir: ONE_MOVDIR = {
      id: this.adelantosService.adelantoViatico.numerO_TRANSACCION,
      tipO_GASTO: 'N/D',
      tipo: 'N/D',
      suB_TIPO: 'N/D',
      fecha: new Date(),
      monto:  monto,
      tipO_ASIENTO: 'CB',
      paquete: 'CB',
      concepto:concepto,
      nuM_ASIENTO: 'null'
    }

    return movDir;
  }
  removeTimeFromDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    const day = date.getDate();
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  }
  async generarAsiento(compania:string,asiento:string,asientO_CIERRE:string,paquete:string,tipO_ASIENTO:string,contabilidad:string,origen:string,clasE_ASIENTO:string,bancos:boolean,moneda:string, monto:number, credito:boolean,debito:boolean, notas:string) {

    let tipoCambioVenta = await this.adelantosService.syncGetTipoCambio(compania,'TVEN');
    let tipoCambioCompra = await this.adelantosService.syncGetTipoCambio(compania,'TCOM');
 
    let montoColones = 0;
    let montoDolares = 0;
    if(moneda == '$'){
      montoColones =  monto * tipoCambioVenta.monto;
      montoDolares = monto;
    }else{
      montoDolares = monto / tipoCambioCompra.monto;
      montoColones = monto;
    }
     
    // totaL_DEBITO_LOC: debito ? moneda == '₡' || moneda == '¢' ?  monto : 0 :  0,
    // totaL_DEBITO_DOL: debito ? moneda == '$'  ?  monto : 0 :  0,
    // totaL_CREDITO_LOC: credito ? moneda == '₡' || moneda == '¢'  ?  monto : 0 :  0,
    // totaL_CREDITO_DOL: credito ? moneda == '$' ?  monto : 0 :  0,


    let asientoDiario: ONE_Asiento_Diario = {
      id: null,
      coD_COMPANIA: compania,
      asiento: asiento,
      asientO_CIERRE,
      paquete: paquete,
      tipO_ASIENTO: tipO_ASIENTO,
      fecha: this.removeTimeFromDate(new Date()),
      contabilidad: contabilidad,
      origen: origen,
      clasE_ASIENTO: clasE_ASIENTO,
      totaL_DEBITO_LOC: montoColones,
      totaL_DEBITO_DOL: montoDolares,
      totaL_CREDITO_LOC: montoColones,
      totaL_CREDITO_DOL:montoDolares,
      ultimO_USUARIO: this.usuariosService.usuario.usuario,
      fechA_ULT_MODIF: new Date(),
      marcado: 'N',
      notas: notas,
      totaL_CONTROL_LOC: null,
      totaL_CONTROL_DOL: null,
      usuariO_CREACION: this.usuariosService.usuario.usuario,
      fechA_CREACION: new Date(),
      rowPointer: null,
      dependencia: null,
      noteExistingFlag: null,
      recordDate: new Date(),
      createdBy: this.usuariosService.usuario.usuario,
      updatedBy: this.usuariosService.usuario.usuario,
      createdDate:new Date(),
      documentO_GLOBAL: null
    }

    return asientoDiario;
  }

  async generarDiario(fuente ,compania, asiento, consecutivo,centroCosto, referencia, bancos: boolean, moneda: string, monto: number, credito: boolean, debito: boolean, cuenta?: string) {
   // let usuario = await this.usuariosService.syncGetUsuariosExactusID();
 
    let cuentaLocal = moneda == '₡' || moneda == '¢' ? true : false;
    let cuentasBancos = await this.companiasService.syncGetCompaniaCuentaBancos(compania);
    let cuentaAnticipo = cuentasBancos.find(e => e.moneda == 'NA');
    let cuentaBancosLocal = cuentasBancos.find(e => e.moneda == 'L');
    let cuentaBancosDolares = cuentasBancos.find(e => e.moneda == 'D');
    let cuentsBancostilizar = cuentaLocal ? cuentaBancosLocal : cuentaBancosDolares;
    console.log('generarDiario', compania, asiento, consecutivo, referencia, bancos, moneda, monto)
    //let cuentaAnticipo = compania == 'CRCB' ? this.cuentaGastosCrcb: this.cuentaGastosCvetCookCoris;
    let cuentaBanco = moneda == '$' ? this.bancoDaViviendaDolares : this.bancosDaViviendaColones;
  
    let tipoCambioVenta = await this.adelantosService.syncGetTipoCambio(compania, 'TVEN');
    let tipoCambioCompra = await this.adelantosService.syncGetTipoCambio(compania, 'TCOM');
  
    let montoColones = 0;
    let montoDolares = 0;
    // if (moneda == '$') {
    //   montoColones = +Math.round(monto * tipoCambioVenta.monto)
    //   montoDolares = +Math.round(monto);
    // } else {
    //   montoDolares = +Math.round(monto / tipoCambioCompra.monto);
    //   montoColones = +Math.round(monto);
    // }
  
    if (moneda == '$') {
      montoColones = +monto * tipoCambioVenta.monto
      montoDolares = +monto;
    } else {
      montoDolares = +monto / tipoCambioCompra.monto;
      montoColones = +monto;
    }
  
    console.log('tipoCambioVenta.monto', tipoCambioVenta.monto)
    console.log('tipoCambioCompra.monto', tipoCambioCompra.monto)
    console.log('montoColones', montoColones)
    console.log('montoDolares', montoDolares)

    let diario: ONE_Diario = {
      id: null,
      coD_COMPANIA: compania,
      asiento: asiento,
      consecutivo: consecutivo,
      nit: null,
      usuario: this.usuariosService.usuario.usuario,
      descripcion: null,
      centrO_COSTO: centroCosto,
      // preguntar esta reventando cuenta contable > let cuentaAnticipo = cuentasBancos.find(e => e.moneda == 'NA');  https://sde1.sderp.site/api-coris-control-viaticos/api/get/compania/cuenta/bancos?id=CRCB
      cuentA_CONTABLE: cuenta ? cuenta : bancos ? cuentsBancostilizar.cuenta : cuentaAnticipo.cuenta,
      fuente: fuente,
      referencia: referencia,
      debitO_LOCAL: debito ? montoColones : null,
      debitO_DOLAR: debito ? montoDolares : null,
      creditO_LOCAL: credito ? montoColones: null,
      creditO_DOLAR: credito ? montoDolares : null,
      debitO_UNIDADES: 0,
      creditO_UNIDADES: 0,
      tipO_CAMBIO: 0,
      rowPointer: null,
      basE_LOCAL: 0,
      basE_DOLAR: 0,
      proyecto: null,
      fase: null,
      noteExistingFlag: 0,
      recordDate: new Date(),
      createdBy: this.usuariosService.usuario.usuario,
      updatedBy: this.usuariosService.usuario.usuario,
      createdDate: new Date(),
      documentO_GLOBAL: null
    }
    return diario;
  }
}
