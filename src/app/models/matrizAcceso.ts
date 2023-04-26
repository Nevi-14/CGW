export class MatrizAcceso {
    constructor(
        public id:string,
        public iD_COMPANIA: number,
        public iD_DEPARTAMENTO: number,
        public nombre: string,
        public estatus: boolean,
        public aprobador: boolean,
        public c: boolean,
        public r: boolean,
        public u: boolean,
        public d: boolean
    ){}
}
export class MatrizAccesoModulos {
    constructor(
        public id:number,
        public iD_MATRIZ_ACCESO: string,
        public iD_MODULO: number
    ){}
}

export class UsuariosMatrizAcceso{
    constructor(
        public id:number,
        public iD_ONE_MATRIZ_ACCESO: string,
        public iD_USUARIO: number
    ){}
}