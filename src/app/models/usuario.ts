export class Usuario {

    constructor(
      public id:number,
      public  usuario:string,
      public     empleado:string,
      public   nombre:string,
      public  clave: string,
      public  correo:string,
      public  estatus:string,
      public  fecha:Date,
      public seleccionado:boolean
    ){}
}

export interface UsuariosCitrix {
  usuario: string;
  nombre:  string;
  clave:    string;
  cia:    string;
seleccionado:boolean
}
