import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LineaGasto } from '../models/gastos';
import { GastoConAnticipo } from '../models/gastoConAnticipo';

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
  putGastoConAnticipo( lineasGasto: GastoConAnticipo ){
    let URL = this.getIRPURL( environment.putGastosConAnticipos, `` );
         URL = URL + lineasGasto.id;
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
  putGasto( lineasGasto: LineaGasto ){
    let URL = this.getIRPURL( environment.putLineaAnticipos, `` );
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


  syncPuLineatGastoToPromise(gasto){

    return this.putGasto(gasto).toPromise();
  }

  syncPutGastoConAnticipo(lineasGasto: GastoConAnticipo){
    return this.putGastoConAnticipo(lineasGasto).toPromise();
  }
}
