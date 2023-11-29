export class DepartamentoSodland {
  constructor(
  public  departamento: string,
  public descripcion: string,
  public jefe: any,
  public  rowPointer: string,
  public  noteExistsFlag: number,
  public  recordDate: string,
  public  createdBy: string,
  public updatedBy: string,
  public createDate: string,
  public activo: string
  ){}
  }
  export class DepartamentoSodlandVariant {
   constructor(
    public  departamentO1: string,
    public descripcion: string,
    public jefe: any,
    public rowPointer: string,
    public noteExistsFlag: number,
    public recordDate: string,
    public createdBy: string,
    public updatedBy: string,
    public createDate: string,
    public activo: string
   ){}
  }