import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  LineaAnticipo, adelantoViaticos, anticipo } from '../models/adelantoViaticos';
import { Consecutivo } from '../models/consecutivo';
import { ONE_Asiento_Diario } from '../models/procesoContable';
import { TipoCambio } from '../models/tipoCambio';
import { Solicitudes } from '../models/solicitudes';

@Injectable({
  providedIn: 'root'
})
export class AdelantoViaticosService {
  lineasAnticipo:LineaAnticipo[]=[]
  adelantoVaticos: anticipo[] = [];
  adelantoViatico :adelantoViaticos;
  solicitudes:any[]=[]
  solicitudesActualizar: Solicitudes[]=[];
  constructor(
    public http: HttpClient

  ) { }


  private getAPI(api: String) {

    let test = "";
    if (!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private getAdelantoViaticos() {

    let URL = this.getAPI(environment.getAdelantoViaticos);
    console.log('URL', URL)
    return this.http.get<adelantoViaticos[]>(URL);
  }
  private getAdelantoViaticosBYID(id) {

    let URL = this.getAPI(environment.getAdelantoViaticosID);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<adelantoViaticos[]>(URL);
  }
  private getUltimoConsecutivo(compania:string,tipo:string) {

    let URL = this.getAPI(environment.getUltimoConsecitvo);
        URL = URL + compania + '&tipo=' + tipo;
    console.log('URL', URL)
    return this.http.get<ONE_Asiento_Diario>(URL);
  }
  private GetTipoCambio(compania:string,tipo:string) {

    let URL = this.getAPI(environment.getTipoCambo);
    URL = URL + compania + '&tipo=' + tipo;
    console.log('URL', URL)
    return this.http.get<TipoCambio>(URL);
  }
  private getGastosAnticipo(id:number) {

    let URL = this.getAPI(environment.getGastosAnticipos);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<LineaAnticipo[]>(URL);
  }
  private postAdelantoViaticos(adelanto: adelantoViaticos) {
    const URL = this.getAPI(environment.postAdelantoViaticos);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    return this.http.post(URL, adelanto, options);
  }
  private putAdelantoViaticos(adelanto: adelantoViaticos) {
    let  URL = this.getAPI(environment.putAdelantoViaticos);
         URL = URL + adelanto.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    return this.http.put(URL, adelanto, options);
  }
  syncGetAdelantoViaticosToPromise() {
    return this.getAdelantoViaticos().toPromise();
  }
  syncGetAdelantoViaticoIDToPromise(id) {
    return this.getAdelantoViaticosBYID(id).toPromise();
  }

  syncGetUltimoConsecutivo(compania:string,tipo:string){
    return this.getUltimoConsecutivo(compania,tipo).toPromise();
  }
  syncGetTipoCambio(compania:string,tipo:string){
    return this.GetTipoCambio(compania,tipo).toPromise();
  }

  syncGetGastosAnticipo(id) {
    return this.getGastosAnticipo(id).toPromise();
  }
  syncPostAdelantoViaticosToPromise(adelanto: adelantoViaticos) {
    return this.postAdelantoViaticos(adelanto).toPromise();
  }
  syncPuttAdelantoViaticosToPromise(adelanto: adelantoViaticos) {
    return this.putAdelantoViaticos(adelanto).toPromise();
  }
}
