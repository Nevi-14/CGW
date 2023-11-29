import { Injectable } from '@angular/core';
import { GastoSinAnticipo } from '../models/gastoSinAnticipo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { format } from 'date-fns';
import { Companias } from '../models/companias';
interface filtros{
  compania:string,
  moneda:string,
  estatus:string,
  valor1:string,
  valor2:string,
}
@Injectable({
  providedIn: 'root'
})
export class GastosSinAnticipoService {
  gastos: GastoSinAnticipo[] = [];
  filtro:filtros = {
    compania:null,
    moneda:null,
    estatus:null,
    valor1: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0],
    valor2: new Date(format(new Date(), 'yyy-MM-dd')).toISOString().split('T')[0]
  }
  fecha: Date = new Date();
  ano = this.fecha.getFullYear();
  mes = this.fecha.getMonth();
  fechaInicioMes = new Date(this.ano, this.mes, 1).toISOString().split('T')[0];
  fechaFinMes = new Date(this.ano, this.mes + 1, 0).toISOString().split('T')[0];
  compania:Companias = null;
  moneda = null;
  constructor(
    public http: HttpClient

  ) { }

  private getIRPURL(api: string, id: string) {
    let test: string = '';

    if (!environment.prdMode) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    
    return URL;
  }
  getGastosSinAnticipo(){
    let URL = this.getIRPURL( environment.getGastosSinAnticipoURL, `` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
 
    return this.http.get<GastoSinAnticipo[]>(URL);
 
  }
  putGastoConAnticipo(gastoSinAnticipo: GastoSinAnticipo) {
    let URL = this.getIRPURL(environment.putGastosSinAnticipos, ``);
    URL = URL + gastoSinAnticipo.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(gastoSinAnticipo));
    return this.http.put(URL, JSON.stringify(gastoSinAnticipo), options);
  }
  private  getGastosSinAnticipoCompaniaMonedaEstadoRangoFecha(compania,moneda,estado,valor1,valor2){
    let URL = this.getIRPURL( environment.gastosSinAnticipoCompaniaMonedaEstadoRangoFecha, `` );

      URL = URL + compania + `&moneda=${moneda}`+ `&estado=${estado}`+ `&valor1=${valor1}`+ `&valor2=${valor2}`
      console.log(URL,'url')
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
 
    return this.http.get<GastoSinAnticipo[]>(URL);
 
  }
  private getGastosSinAnticipo2(id: string , estado: string, value1: string, value2: string) {
    let URL = this.getIRPURL(environment.getGastosSinAnticipoURL2, '');
    URL = URL +id + '&estado=' + estado+`&valor1=${value1}`+`&valor2=${value2}`;
    console.log('URL', URL)
    return this.http.get<GastoSinAnticipo[]>(URL);

  }
  syncGetGastosSinAnticipoToPromise2(id: string , estado: string, value1: string, value2: string){

    return this.getGastosSinAnticipo2(id,estado,value1,value2).toPromise();
  }
syncGetGastosSinAnticipoToPromise(){

  return this.getGastosSinAnticipo().toPromise();
}
syncGetGastosSinAnticipoCompaniaMonedaEstadoRangoFechaToPromise(compania,moneda,estado,valor1,valor2){

  return this.getGastosSinAnticipoCompaniaMonedaEstadoRangoFecha(compania,moneda,estado,valor1,valor2).toPromise();
}
syncPutGastoSinAnticipoToPromise(gastoSinAnticipo: GastoSinAnticipo) {
  return this.putGastoConAnticipo(gastoSinAnticipo).toPromise();
}
async sincronizarGastosSinAnticipos(usuario:string, valor1:string, valor2:string) {
  return this.syncGetGastosSinAnticipoToPromise2(usuario,'',valor1,valor2);
  
 }
}
