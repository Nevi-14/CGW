export class Usuarios {
    constructor(
        public id:number,
        public usuario:string,
        public empleado: string,
        public nombre:string,
        public correo: string,
        public estatus: boolean,
        public fecha:Date
    ){}
}

// https://sde1.sderp.site/api-coris-control-viaticos/api/get/usuarios