export class gastos {

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

export class LineaGasto {
    constructor(
      public id:number,
      public iD_LINEA_ANTICIPO:number,
      public fecha: Date,
      public tarjeta:boolean,
      public usuario: string,
      public referencia: string,
      public iD_TIPO_GASTO: number,
      public proveedor: string,
      public justificacion: string,
      public descripcion: string,
      public observaciones: string,
      public adjunto: string,
      public monto: number,
      public estatus:string
    ){}

    
  }

  
export class LineaGastoView {
  constructor(
    public id:number,
    public iD_ANTICIPO:number,
    public iD_LINEA_ANTICIPO: number,
    public tipO_GASTO:string,
    public fecha: Date,
    public tarjeta: boolean,
    public referencia: string,
    public proveedor: string,
    public monto: number,
    public estatus:string,
    public usuario: string,
    public utilizado:number,
    public restante:number,
    public centrO_COSTOS:string,
    public porcentajeiva:number,
    public montoiva:number,
    public montO_ANTICIPO:number,
    public excedente:number
  ){}

  
}