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
  
  // APIS


// GASTOS
getGastos:'get/gastos/estado/rango/fecha?estado=',
putGastos:'put/gasto?id=',
getFacturaGastos:'get/gasto?id=',
getUsuarioGastos:'get/gastos/usuario?id=',
getUsuarioGastosRangoFecha:'get/usuario/gastos/estado/rango/fecha?id=',
// ADELANTO VIATICOS
getAdelantoViaticos:'get/anticipos',
postAdelantoViaticos:'post/anticipo',
// LINEA ANTICIPOS
postLineaAnticipos:'post/linea/anticipo',
getLineasAnticipos:'get/linea/anticipo?id=',
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
postDiario:'post/diario',
getusuariosExactus:'get/usuarios/exactus',
getGastosAnticipos:'get/gastos/anticipo?id=',


// USUARIOS
getUsuarios:'get/usuarios',
getUsuarioID:'get/usuario?correo=',
postUsuario:'post/usuario',
putUsuario:'put/usuario?id=',
deleteUsuario:'delete/usuario?id=',
// COMPANIAS
getCompanias:'get/companias',
// MODULOS
getModulos:'get/modulos',
// DEPARTAMENTOS
getDepartamentos:'get/departamentos',
postDepartamento:'post/departamento',
putDepartamento:'put/departamento?id=',
deleteDepartamento:'delete/departamento?id=',

// ROLES
getRoles:'get/roles',
postRole:'post/role',
putRole:'put/role?id=',
deleteRole:'delete/role?id=',
// MATRIZ ACCESO
getMatrizAcceso:'get/matriz-accesos',
getMatrizAccesoUsuario:'get/matriz-acceso/usuario?id=',
getMatrizAccesoBYID:'get/matriz-acceso?id=',
getMatrizAccesoCheckModuloUsuario:'get/matriz-acceso/usuario?id=',
getUsuariosMstrizAcceso:'get/usuarios/matriz-acceso?id=',
postMatrizAcceo:'post/matriz-acceso',
postUsuarioMatrizAcceo:'post/usuario/matriz-acceso',
putMatrizAcceso:'put/matriz-acceso?id=',
deleteMatrizAcceso:'delete/matriz-acceso?id=',
deleteUsuarioMatrizAcceso:'delete/usuario/matriz-acceso?id='


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
