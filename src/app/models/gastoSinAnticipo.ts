export class GastoSinAnticipo {
  constructor(
    public id:number,
    public compania:string,
    public iD_TIPO_GASTO: string,
    public modificadO_POR: string,
    public centrO_COSTOS: string,
    public fecha: Date,
    public fechA_INICIAL: Date,
    public fechA_FINAL: Date,
    public identificador:string,
    public cuentA_COSTOS: string,
    public moneda: string,
    public tarjeta:boolean,
    public usuario: string,
    public referencia: string,
    public proveedor: string,
    public justificacion: string,
    public descripcion: string,
    public adjunto: string,
    public monto: number,
    public porcentajeiva: number,
    public montoiva: number,
    public estatus:string,
    public observaciones: string,
    public seleccionado?:boolean
  ){}
}