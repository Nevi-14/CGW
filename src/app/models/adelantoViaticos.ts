export class  adelantoViaticos{
    constructor(
    public id : number,
    public iD_MATRIZ_ACCESO: number,
    public correO_ENVIADO : number,
    public emisor: string,
    public estatus: string,
    public usuario:string,
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
    public observaciones:string,
     
    ){}
}


export class LineaGasto {
    constructor(
      public fecha: Date,
      public tarjeta:boolean,
      public anticipo:boolean,
      public idAnticipo:number,
      public usuario: string,
      public referencia: string,
      public ceCo: string,
      public cuenta: string,
      public tipo_Gasto: string,
      public proveedor: string,
      public justificacion: string,
      public descripcion: string,
      public observaciones: string,
      public monto: number,
      public rol: string,
      public procesado: string,
      public excedente:boolean
    ){}
  }