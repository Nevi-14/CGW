export class  adelantoViaticos{
    constructor(
    public id : number,
    public tarjeta : boolean,
    public anticipo : boolean,
    public correoEnviado : boolean,
    public estado: string,
    public remitente: string,
    public destinatario:string,
    public fechaInicial: Date,
    public fechaFinal: Date,
    public detalle :string,
    public fechaTransaccion: Date,
    public numeroTransaccion :string,
    public moneda:string,
    public monto: number
     
    ){}
}