export class TipoCambio {
constructor(
    public tipO_CAMBIO: string,
    public  fecha: string,
    public   usuario: string,
    public  monto: number,
    public  rowPointer: string,
    public noteExistsFlag: number,
    public recordDate: string,
    public  createdBy: string,
    public updatedBy: string,
    public createDate: string 
){}
  }