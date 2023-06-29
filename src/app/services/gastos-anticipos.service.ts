import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LineaGasto } from '../models/gastos';

@Injectable({
  providedIn: 'root'
})
export class GastosAnticiposService {

  constructor(
    public http: HttpClient

  ) { }


  private getIRPURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  putGasto( lineasGasto: LineaGasto ){
    let URL = this.getIRPURL( environment.ONE_LinGastoURL, `` );
    URL = URL + lineasGasto.id
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(lineasGasto));
    return this.http.put( URL, JSON.stringify(lineasGasto), options );
  }


  syncPutGastoToPromise(gasto){

    return this.putGasto(gasto).toPromise();
  }
}
