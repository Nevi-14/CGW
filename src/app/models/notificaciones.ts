export class Notificaciones {
  constructor(
    public id : number,
    public remitente:string,
    public usuario : string,
    public canal:string, // correo, movil
    public tipo:string,    
    public referencia:string, 
    public estatus: string, // P  // R // F
    public fecha: Date,
    public fechaLimite: Date,
    public titulo:string,
    public descripcion:string
  ){}
}