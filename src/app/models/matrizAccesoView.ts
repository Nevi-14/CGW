export class MatrizAccesoView {
    constructor(
        public id: number,
        public iD_MATRIZ_ACCESO:string,
        public iD_COMPANIA: number,
        public nombrE_COMPANIA: string,
        public iD_DEPARTAMENTO: number,
        public nombrE_DEPARTAMENTO: string,
        public iD_ONE_MATRIZ_ACCESO: string,
        public nombre: string,
        public estatus: boolean,
        public aprobador: boolean,
        public c: boolean,
        public r: boolean,
        public u: boolean,
        public d: boolean,
        public seleccionado: boolean,
    ){}
}