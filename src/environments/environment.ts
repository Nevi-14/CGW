// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  maxCharCodigoProd: 6,
  preURL: 'https://sde1.sderp.site/',
  TestURL: '_test',
  preURL2:'https://api_isa',
  postURL: 'api-coris-control-viaticos/api/',
  prdMode: true,
  mapboxKey:'pk.eyJ1IjoibWhlcnJhIiwiYSI6ImNrcWxhdXk4eTByMDUyd28xNnZ2b2hoMjMifQ.IrIAxPGO4oFiRVR8U5sqkA',
 
  // APIS

// USUARIOS
getUsuarios:'get/usuarios',
getUsuarioID:'get/usuario?id=',
// GASTOS
getGastos:'get/gastos/estado/rango/fecha?estado=',
putGastos:'put/gasto?id=',
getFacturaGastos:'get/gasto?id=',
getUsuarioGastos:'get/gastos/usuario?id=',
getUsuarioGastosRangoFecha:'get/usuario/gastos/estado/rango/fecha?id=',
// ADELANTO VIATICOS
getAdelantoViaticos:'get/adelanto/viaticos',
postAdelantoViaticos:'post/adelanto/viaticos',
// ESTADOS CUENTA
getEstadosCuenta:'get/estados/cuenta',
postEstadosCuenta:'post/estados/cuenta',

// ARCHIVOS
getArchivoEstadosCuenta:'get/estados/cuenta/archivo/?ID=',
postArchivoEstadosCuenta:'post/estados/cuenta/archivo/?ID=',

// EMAIL
postEmail:'post/enviar/correo',

// MOV DIR
getMovDir:'get/movdir',
postMovDir:'post/movdir',
// ASIENTO DIARIO
getAsientoDiario:'get/asiento-diario',
postAsientoDiario:'post/asiento-diario',

//  DIARIO
getDiario:'get/diario',
postDiario:'post/diario'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
