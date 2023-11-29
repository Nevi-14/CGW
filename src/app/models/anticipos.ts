export class  Anticipos{
    constructor(
     public  id: number,
     public  creadO_POR: number,
     public  modificadO_POR: number,
     public  estatus: string,
     public  coD_COMPANIA: string,
     public  fecha: Date,
     public fechA_INICIAL: Date,
     public  fechA_FINAL: Date,
     public  asiento: string,
     public  asientO_CIERRE: string,
     public  detalle: string,
     public  fechA_TRANSACCION: Date,
     public  numerO_TRANSACCION: string,
     public  moneda: string,
     public  monto: number,
     public  utilizado: number,
     public  restante: number,
     public  excedente: number,
     public  lineaS_EXCEDENTE: number,
     public  observaciones: string,
     public  lineas: number,
     public  ultimA_FECHA_MODIFICACION: Date
     
    ){}
}