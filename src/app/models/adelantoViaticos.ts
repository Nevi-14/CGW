export class  adelantoViaticos{
    constructor(

      public id : number,
      public cREADO_POR: number,
      public mODIFICADO_POR: number,
      public eSTATUS :string,
      public coD_COMPANIA: string,
      public fecha: Date,
      public fechA_INICIAL: Date,
      public fechA_FINAL: Date,
      public detalle :string,
      public fechA_TRANSACCION: Date,
      public numerO_TRANSACCION :string,
      public moneda:string,
      public monto: number,
      public utilizado: number,
      public restante: number,
      public observaciones:string,
      public lineas: number,
      public ultimA_FECHA_MODIFICACION: Date
     
    ){}
}

export class  anticipo {
constructor(
public  adelantoViatico:adelantoViaticos,
public lineasAnticipo:LineaAnticipo[]
){}
}


export class LineaAnticipo {
    constructor(
      
      public id : number,
      public iD_ANTICIPO: number,
      public metodO_DEVOLUCION : string,
      public correO_ENVIADO : number,
      public estatus: string,
      public usuario:string,
      public monto: number,
      public utilizado: number,
      public restante: number
    ){}
  }