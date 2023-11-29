export class Excedentes {
    constructor(
      public id: number,
      public  estatus: string,
      public  usuario: string,
      public  asiento: string,
      public  usuariO_APROBADOR: string,
      public  metodO_DEVOLUCION: string,
      public  cuenta: string,
      public  telefono: string,
      public  justificacion: string,
      public  descripcion: string,
      public  adjunto: string,
      public  monto: number,
      public  observaciones: string,
    ){}
}