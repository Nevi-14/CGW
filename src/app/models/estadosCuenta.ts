export class estadosCuenta{
    constructor(
    public id:number,
    public remitente: string,
    public destinatario:string,
    public fecha: Date,
    public monto: number,  
    public archivo:string,
    public ruta:string
    ){}
}