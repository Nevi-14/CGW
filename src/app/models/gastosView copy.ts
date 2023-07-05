export class vistaGastos {

    constructor(
        public iD_ANTICIPO: number,
        public iD_LINEA_ANTICIPO:number,
        public fecha:Date,
        public tipO_GASTO:string,
        public tarjeta:boolean,
        public referencia: string,
        public iD_TIPO_GASTO:number,
        public usuario: string,
        public proveedor: string,
        public justificacion: string,
        public descripcion: string,
        public estatus: string,
        public exedente: boolean,
        public id: number
    ){}
}