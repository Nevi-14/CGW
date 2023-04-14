export class  adelantoViaticos{
    constructor(

      public id : number,
      public iD_MATRIZ_ACCESO: number,
      public estatus: string,
      public coD_COMPANIA :string,
      public fechA_INICIAL: Date,
      public fechA_FINAL: Date,
      public detalle :string,
      public fechA_TRANSACCION: Date,
      public numerO_TRANSACCION :string,
      public moneda:string,
      public monto: number,
      public utilizado: number,
      public restante: number,
      public exedente: number,
      public observaciones:string
     
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
      public correO_ENVIADO : number,
      public estatus: string,
      public usuario:string,
      public monto: number,
      public utilizado: number,
      public restante: number,
      public exedente: number,
      public exedentes: number,
      public observaciones:string
    ){}
  }