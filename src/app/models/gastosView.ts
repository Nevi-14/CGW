export class vistaGastos {

    constructor(
        public iD_ANTICIPO: number,
        public iD_LINEA_ANTICIPO:number,
        public fecha:Date,
        public tarjeta:boolean,
        public referencia: string,
        public tipO_GASTO:string,
        public proveedor: string,
        public monto: number,
        public estatus: string,
        public exedente: boolean,
        public id: number
    ){}
}