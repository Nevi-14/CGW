export class ONE_MOVDIR{
constructor(
 public id :string,
 public tipO_GASTO: string,
 public tipo: string,
 public suB_TIPO:string,
 public fecha:Date,
 public monto:number,
 public tipO_ASIENTO:string,
 public paquete:string,
 public concepto:string,
 public nuM_ASIENTO:string   
){}
}

export class ONE_Asiento_Diario {
    constructor(
public id:number,
public coD_COMPANIA:string, 
public asiento:string,
public paquete:string,
public tipO_ASIENTO:string,
public fecha:Date,
public contabilidad:string,
public origen:string,
public clasE_ASIENTO:string,
public totaL_DEBITO_LOC:number,
public totaL_DEBITO_DOL:number,
public totaL_CREDITO_LOC:number,
public totaL_CREDITO_DOL:number,
public ultimO_USUARIO:string,
public fechA_ULT_MODIF:Date,
public marcado:string,
public notas:string,
public totaL_CONTROL_LOC:number,
public totaL_CONTROL_DOL:number,
public usuariO_CREACION:string,
public fechA_CREACION:Date,
public rowPointer:string,
public dependencia:string,
public noteExistingFlag:number,
public recordDate:Date,
public createdBy:string,
public updatedBy:string,
public createdDate:Date,
public documentO_GLOBAL:string

    ){}
}

export class ONE_Diario {
    constructor(
        public id:number,
        public coD_COMPANIA:string, 
        public asiento:string,
        public consecutivo:number,
        public nit:string,
        public centrO_COSTO:string,
        public cuentA_CONTABLE:string,
        public fuente:string,
        public referencia:string,
        public debitO_LOCAL:number,
        public debitO_DOLAR:number,
        public creditO_LOCAL:number,
        public creditO_DOLAR:number,
        public debitO_UNIDADES:number,
        public creditO_UNIDADES:number,
        public tipO_CAMBIO:number,
        public rowPointer:string,
        public basE_LOCAL:number,
        public basE_DOLAR:number,
        public proyecto:string,
        public fase:string,
        public noteExistingFlag:number,
        public recordDate:Date,
        public createdBy:string,
        public updatedBy:string,
        public createdDate:Date,
        public documentO_GLOBAL:string
    ){}
}