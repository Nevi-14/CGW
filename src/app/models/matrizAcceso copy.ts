export class MatrizAcceso {
    constructor(
        public id:number,
        public iD_COMPANIA: number,
        public iD_DEPARTAMENTO: number,
        public iD_MODULO: number,
        public iD_ROLE: number,
        public iD_USUARIO: number,
        public estatus: boolean,
        public administrador: boolean,
        public aprobador: boolean,
        public c: boolean,
        public r: boolean,
        public u: boolean,
        public d: boolean
    ){}
}