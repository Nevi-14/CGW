import { Injectable } from '@angular/core';
import { AdelantoViaticosService } from './adelanto-viaticos.service';
import { ProcesoContableService } from './proceso-contable.service';
import { UsuariosService } from './usuarios.service';
import { format } from 'date-fns';
import { ONE_Asiento_Diario, ONE_Diario, ONE_MOVDIR } from '../models/procesoContable';

@Injectable({
  providedIn: 'root'
})
export class CierreContableService {

  constructor(
    public adelantosService: AdelantoViaticosService,
    public procesoContableService: ProcesoContableService,
    public usuariosService: UsuariosService

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

  generarAsiento(totaL_CREDITO_LOC, notas) {
    let asientoDiario: ONE_Asiento_Diario = {
      id: null,
      coD_COMPANIA: this.adelantosService.adelantoViatico.coD_COMPANIA,
      asiento: null,
      paquete: 'CB',
      tipO_ASIENTO: 'CB',
      fecha: new Date(),
      contabilidad: 'C',
      origen: 'CB',
      clasE_ASIENTO: 'C',
      totaL_DEBITO_LOC: null,
      totaL_DEBITO_DOL: null,
      totaL_CREDITO_LOC: totaL_CREDITO_LOC,
      totaL_CREDITO_DOL:null,
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
      createdDate: new Date(),
      documentO_GLOBAL: null
    }

    return asientoDiario;
  }

  generarDiario(usuario,consecutivo,descripcion,cuentA_CONTABLE,referencia,dbL:boolean,debitO_LOCAL,cL:boolean,creditO_LOCAL) {
    let diario: ONE_Diario = {
      id: null,
      coD_COMPANIA: this.adelantosService.adelantoViatico ? this.adelantosService.adelantoViatico.coD_COMPANIA : 'COOK',
      asiento: consecutivo,
      consecutivo: 0,
      nit: null,
      usuario:usuario,
      descripcion:descripcion,
      centrO_COSTO: '00-00-00',
      cuentA_CONTABLE: cuentA_CONTABLE,
      fuente: 'fuente',
      referencia: referencia,
      debitO_LOCAL: dbL ?  debitO_LOCAL : null,
      debitO_DOLAR: null,
      creditO_LOCAL: cL ?  creditO_LOCAL : null,
      creditO_DOLAR: null,
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
