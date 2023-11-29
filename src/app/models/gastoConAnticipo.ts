export class GastoConAnticipo {
    constructor(
     public  id: number,
     public ID_LINEA_ANTICIPO: number,
     public  iD_TIPO_GASTO: string,
     public  fecha: Date,
     public tarjeta: boolean,
     public  escedente: boolean,
     public   usuario: string,
     public  referencia: string,
     public centrO_COSTOS: string,
     public  cuentaA_CONTABLE: string,
     public  proveedor: string,
     public  justificacion: string,
     public  descripcion: string,
     public  adjunto: string,
     public monto: number,
     public porcentajeiva: number,
     public  montoiva: number,
     public estatus: string,
     public observaciones: string
    ){}
  }