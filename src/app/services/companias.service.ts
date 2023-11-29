import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Companias } from '../models/companias';
import { environment } from 'src/environments/environment';
import { cuentasBancos } from '../models/cuentasBancos';
import { cuentasGastos } from '../models/cuentsaGastos';
import { CentrO_COSTO } from '../models/centroCostos';

@Injectable({
  providedIn: 'root'
})
export class CompaniasService {
  companias:Companias[]=[];
  constructor(
    public http:HttpClient

  ) { }

getAPI(api:string){

  let test = "";
  if(!environment.prdMode) test = environment.TestURL;
  const URL = environment.preURL + test + environment.postURL + api;
  return URL;
}

private getCompanias(){
const URL = this.getAPI(environment.getCompanias);
console.log('URL',URL)
return this.http.get<Companias[]>(URL);
}

syncGetCompaniasToPromise(){
  return this.getCompanias().toPromise();
}


private getCompaniaCuentaBancos(id){
  const URL = this.getAPI(environment.getCompamiaCuentaBancos)+id;
  console.log('URL',URL)
  return this.http.get<cuentasBancos[]>(URL);
  }
  
  private getCentroCostos(compania){
    const URL = this.getAPI(environment.getCentrosCostos)+compania;
    console.log('URL',URL)
    return this.http.get<CentrO_COSTO[]>(URL);
    }
    syncGetCentroCostosToPromise(compania){
      return this.getCentroCostos(compania).toPromise();
    }
  syncGetCompaniaCuentaBancos(id){
    return this.getCompaniaCuentaBancos(id).toPromise();
  }

private getCompaniaCuentaGastos(id){
  const URL = this.getAPI(environment.getCompamiaCuentaGastos)+id;
  console.log('URL',URL)
  return this.http.get<cuentasGastos[]>(URL);
  }
  
  syncGetCompaniaCuentaGastos(id){
    return this.getCompaniaCuentaGastos(id).toPromise();
  }

  
}
