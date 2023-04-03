export class ONE_MOVDIR{
constructor(
 public Numero :string,
 public Tipo: string,
 public Subtipo:string,
 public Fecha:Date,
 public Monto:number,
 public TipoAsiento:string,
 public Paquete:string,
 public Concepto:string,
 public Asiento:string   
){}
}

export class ONE_Asiento_Diario {
    constructor(
  public NumAsiento:string,
  public Tipo:string,
  public Paquete:string,
  public Concepto:string,
  public Monto:number,
  public Fecha:Date      
    ){}
}

export class ONE_Diario {
    constructor(
        public NumAsiento:string,
        public CentroDeCosto:string,
        public CuentaConta:string,
        public DebitoTotal:number,
        public CreditoLocal:number,
        public Referencia:string
    ){}
}