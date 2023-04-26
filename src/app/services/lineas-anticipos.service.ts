import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LineaAnticipo } from '../models/adelantoViaticos';
import { LineaGasto } from '../models/gastos';

@Injectable({
  providedIn: 'root'
})
export class LineasAnticiposService {

  constructor(
    public http: HttpClient

  ) { }

  private getAPI(api: String) {
    let test = "";
    if (!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }
  private getGastosLineas(id:number){
    let URL = this.getAPI(environment.getGastosAnticipoLineas);
    URL = URL+id;
        console.log('URL', URL)
    return this.http.get<LineaGasto[]>(URL);

  }
  private getLineasAnticipos(id:number) {

    let URL = this.getAPI(environment.getLineasAnticipos);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<LineaAnticipo[]>(URL);
  }
  private getLineasAnticiposLineas(id:number) {

    let URL = this.getAPI(environment.getGastosAnticipoLineas);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<LineaAnticipo[]>(URL);
  }
  private postLineaAnticipo(lineaAnticipo: LineaAnticipo) {
    const URL = this.getAPI(environment.postLineaAnticipos);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    console.log('lineaAnticipo', lineaAnticipo)
    return this.http.post(URL, lineaAnticipo, options);
  }

  private putLineaAnticipo(lineaAnticipo: LineaAnticipo) {
    let URL = this.getAPI(environment.putLineaAnticipos);
        URL = URL + lineaAnticipo.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    console.log('lineaAnticipo', lineaAnticipo)
    return this.http.put(URL, lineaAnticipo, options);
  }
  syncGetLineasAnriciposToPromise(id:number) {
    return this.getLineasAnticipos(id).toPromise();
  }

  syncGetLineasAnticiposLineasToPromise(id:number) {
    return this.getLineasAnticiposLineas(id).toPromise();
  }
  syncGetGastosLineasToPromise(id:number) {
    return this.getGastosLineas(id).toPromise();
  }

  syncPutLineaAnticipoToPromise(lineaAnticipo: LineaAnticipo) {
    return this.putLineaAnticipo(lineaAnticipo).toPromise();
  }
  
  syncPostLineaAnticipoToPromise(lineaAnticipo: LineaAnticipo) {
    return this.postLineaAnticipo(lineaAnticipo).toPromise();
  }
}
