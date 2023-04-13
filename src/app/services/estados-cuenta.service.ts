import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { estadosCuenta } from '../models/estadosCuenta';
 

@Injectable({
  providedIn: 'root'
})
export class EstadosCuentaService {

  constructor(
    public http:HttpClient

  ) { }

getAPI(api:string){

  let test = "";
  if(!environment.prdMode) test = environment.TestURL;
  const URL = environment.preURL + test + environment.postURL + api;
  return URL;
}

private getEstadosCuenta(){
const URL = this.getAPI(environment.getEstadosCuenta);
console.log('URL',URL)
return this.http.get<estadosCuenta[]>(URL);
}
private getArchivoEstadosCuenta(ID){
  let URL = this.getAPI(environment.getArchivoEstadosCuenta);
      URL = URL + ID;
      console.log('URL', URL)
  return this.http.get<any[]>(URL);
  }
private postEstadoCuenta(estadoCuenta:estadosCuenta){

  const URL = this.getAPI(environment.postEstadosCuenta);
  let   options ={
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Access-Control-Origin':'*'
    }
  }

  return this.http.post(URL,estadoCuenta, options );
}



private postEstadoCuentaArchivo(ID,formData){
let URL = this.getAPI(environment.postArchivoEstadosCuenta);
    URL = URL + ID;
const options = {
  headers:{
    'enctype': 'multipart/form-data;',
    'Accept': 'plain/text',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token',
  }
  
}
return this.http.post(URL,formData, options);
}
syncGetEstadosCuentaToPromise(){
  return this.getEstadosCuenta().toPromise();
}

syncPostEstadosCuentaToPromise(estadoCuenta:estadosCuenta){

  return this.postEstadoCuenta(estadoCuenta).toPromise();
}
syncPostEstadoCuentaArchivoToPromise(ID,formData){

  return this.postEstadoCuentaArchivo(ID,formData).toPromise();
}


syncGetArchivoEstadosCuenta(ID){
  return this.getArchivoEstadosCuenta(ID).toPromise();
}
}
