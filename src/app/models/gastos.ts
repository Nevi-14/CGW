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