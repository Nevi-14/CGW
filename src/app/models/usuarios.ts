export class Usuarios {
    constructor(
        public id: number,
        public usuario: string,
        public nombre: string,
        public clave: string,
        public correo: string,
        public estatus: boolean,
        public apellido: string,
        public fecha: Date,
        public seleccionado: boolean
    ) { }
}
export class UsuarioExactus {
constructor(
    public   usuario: string,
    public  nombre: string,
    public clave: string,
    public cia: string,
    public seleccionado: boolean,
    public monto: number
){}
}

// https://sde1.sderp.site/api-coris-control-viaticos/api/get/usuarios