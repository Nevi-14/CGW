import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LineaGasto, adelantoViaticos } from '../models/adelantoViaticos';


@Injectable({
  providedIn: 'root'
})
export class AdelantoViaticosService {

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

  private getGastosAnticipo(id:number) {

    let URL = this.getAPI(environment.getGastosAnticipos);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<LineaGasto[]>(URL);
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

  syncGetAdelantoViaticosToPromise() {
    return this.getAdelantoViaticos().toPromise();
  }


  syncGetGastosAnticipo(id) {
    return this.getGastosAnticipo(id).toPromise();
  }
  syncPostAdelantoViaticosToPromise(adelanto: adelantoViaticos) {
    return this.postAdelantoViaticos(adelanto).toPromise();
  }
}
