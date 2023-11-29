export class Solicitudes {
  constructor(
  public  id: number,
  public  asiento: string,
  public  coD_COMPANIA: string,
  public  moneda: string,
  public fechA_INICIO: Date,
  public fechA_FIN: Date,
  public usuario: string,
  public descripcion:string,
  public estatus:string,
  public montO_SOLICITADO:number,
  public montO_APROBADO:number,
  public aprobador:string,
  public resolucion:string,
  public seleccionado?:boolean
  ){}
    }