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
  // ANTICIPOS
  getAnticipo:'get/anticipo?id=',
  getVistaAnticipoLineasAnticipo:'get/vista/anticipo/linea/anticipo?id=',
  putAnticipoAPI: 'put/anticipo?id=',
  getGastosConAnticipo:'get/gastos/linea/anticipo?id=',
  getGastosConAnticipoTipo:'get/gastos/linea/anticipo/tipo?id=',
  // LINEA ANTICIPOS
  getLineaAnticipo:'get/linea/anticipo?id=',
  getVistaUsuarioLineaAnticipo:'get/vista/usuario/linea/anticipo?id=',
  getVistaAnticipoReferencia:'get/vista/anticipo/linea/anticipo?referencia=',
  getLineanticipo:'get/linea/anticipo?id=',
  putLineaAnticipo:'put/linea/anticipo?id=',
// GASTOS

getGastos:'get/gastos/estado/rango/fecha?estado=',
getGastosAnticipo:'get/gastos/anticipo?id=',
getGastosAnticipoLineas:'get/gastos/linea/anticipo?id=',
putGastos:'put/gasto/linea/anticipo?id=',
getFacturaGastos:'get/gasto?id=',
getUsuarioGastos:'get/gastos/usuario?id=',
getUsuarioGastosRangoFecha:'get/usuario/gastos/estado/rango/fecha?id=',
putGastosConAnticipos:'put/gasto/linea/anticipo?id=',
// ADELANTO VIATICOS
getAdelantoViaticosID:'get/anticipo?id=',
getAdelantoViaticos:'get/anticipos',
postAdelantoViaticos:'post/anticipo',
putAdelantoViaticos:'put/anticipo?id=',
// LINEA ANTICIPOS
postLineaAnticipos:'post/linea/anticipo',
putLineaAnticipos:'put/linea/anticipo?id=',
getLineasAnticipos:'get/linea/web/anticipo?id=',
getLineasAnticipoEstatus:'get/lineas/anticipo?id=',
// ESTADOS CUENTA
getEstadosCuenta:'get/estados/cuenta',
postEstadosCuenta:'post/estado/cuenta',

// ARCHIVOS
getArchivoEstadosCuenta:'get/estados/cuenta/archivo/?ID=',
postArchivoEstadosCuenta:'post/estados/cuenta/archivo/?ID=',

// EMAIL
postEmail:'post/enviar/correo',

// MOV DIR
getMovDir:'get/movdir',
postMovDir:'post/movdir',
// ASIENTO DIARIO
getAsientoDiario:'get/asiento-diario?asiento=',
postAsientoDiario:'post/asiento-diario',
putAsientoDiario:'put/asiento-diario?id=',

//  DIARIO
getDiario:'get/diario?asiento=',
postDiario:'post/diario',
getusuariosSoflandCompania:'get/usuarios/compania?id=',
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
getMatrizAccesobyIDURL:'get/matriz-acceso?id=',
getMatrizAcceso:'get/matriz-accesos',
getMatrizAccesoUsuario:'get/matriz-acceso/usuario?id=',
getMatrizAccesoBYID:'get/matriz-acceso?id=',
getMatrizAccesoCheckModuloUsuario:'get/matriz-acceso/usuario?id=',
getUsuariosMstrizAcceso:'get/usuarios/matriz-acceso?id=',
postMatrizAcceo:'post/matriz-acceso',
postUsuarioMatrizAcceo:'post/usuario/matriz-acceso',
putMatrizAcceso:'put/matriz-acceso?id=',
deleteMatrizAcceso:'delete/matriz-acceso?id=',
deleteUsuarioMatrizAcceso:'delete/usuario/matriz-accesos?id=',
// MODULOS 
getMatrizAccesoModulosURL:'get/matriz-acceso/modulos?id=',
postModuloMatrizAcceo:'post/matriz-acceso/modulo',
putModuloMatrizAcceo:'post/matriz-acceso/modulo?id=',
deleteModuloMatrizAcceso:'delete/matriz-acceso/modulos?id=',
ONE_LinGastoURL: 'put/gasto/linea/anticipo?id=',
// USUARIO MATRIZ ACCESO
getUsuarioMatrizAccesoURL:'get/usuario/matriz-acceso?id=',
TipGastosURL: 'get/tipos/gastos',
getUltimoConsecitvo:'get/ultimo/consecutivo?compania=',

getGastosSinAnticipoURL:'get/lista/gastos/sin-anticipo',
getGastosSinAnticipoURL2:'get/usuario/gastos/sin/anticipo/estado/rango/fecha?id=',
  // SOBRANTES
  getUsuarioSobrante:'get/sobrante/usuario?id=',
  postSobrante:'post/sobrante',
  putSobrante:'put/sobrante?id=',
  deleteSobrante:'delete/sobrante?id=',
// GASTOS SIN ANTICIPO

  gastosSinAnticipoCompaniaMonedaEstadoRangoFecha:'get/gastos/sin/anticipo/compania/moneda/estado/rango/fecha?compania=',
  putGastosSinAnticipos:'put/gasto/sin/anticipo?id=',
  // notificaciones

getNotificacionesUsuario:'get/notificaciones/usuario?id=',
postNotificacion:'post/notificacion',
putNotificacion:'put/notificacion?id=',
 // GASTOS CON ANTICIPO
 getGastosConAnticipoEstado:'get/gastos/linea/anticipo/estado/?id=',
 getGastosConAnticipoReferencia:'get/anticipo?referencia=',
 postGastosConAnticipos:'post/gasto/linea/anticipo',
 deleteGastosConAnticipos:'delete/gasto/linea/anticipo?id=',
  // CUENTAS GASTOS
  getCompamiaCuentaGastos:'get/compania/cuenta/gastos?id=',
    // CUENTAS BANCOS
    getCompamiaCuentaBancos:'get/compania/cuenta/bancos?id=',
    getTipoCambo:'get/tipo/cambio?compania=',
      // DEVOLUCIONES
  getUsuarioExcedentes:'get/excedentes/usuario?id=',
  getUsuarioExcedente:'get/excedentes/usuario?id=',
  postExcedente:'post/excedente',
  putExcedente:'put/excedente?id=',
  deleteExcedente:'delete/excedente?id=',
  getCentrosCostos:'get/centro/costos?compania=',
  getDepartamentosSofland:'get/departamentos/sofland?compania=',
  getUsuariosSofland:'get/usuarios/sofland?compania=',
  getUsuarioCentroCosto:'get/usuario/centro/costo?id=',
  postUsuarioCentroCosto:'post/usuario/centro/costo',
  putUsuarioCentroCosto:'put/usuario/centro/costo?id=',
deleteUsuarioCentroCosto:'delete/usuario/centro/costo?id=',
deleteUsuarioCentroCostoUsuario:'delete/usuario/centro/costo?usuario=',
getSolicitudes:'get/solicitudes',
putSolicitud:'put/solicitud?id=',

// aprobadores

getAprobadores:'get/aprobadores',
postAprobador:'post/aprobador',
putAprobador:'put/aprobador?id=',
deleteAprobador:'delete/aprobador?id=',

anticipoCompaniaMonedaEstadoRangoFecha:'get/anticipo/compania/moneda/estado/rango/fecha?compania=',
solitudesCompaniaMonedaEstadoRangoFecha:'get/solicitudes/compania/moneda/estado/rango/fecha?compania=',
 
 
 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
