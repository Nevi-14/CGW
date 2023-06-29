import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TiposGastos } from '../models/tiposGastos';
 
@Injectable({
  providedIn: 'root'
})
export class TiposGastosService {
  tiposGastos:TiposGastos[]=[]
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

  getTiposGastos(){
    const URL = this.getIRPURL( environment.TipGastosURL, `` );
    return this.http.get<TiposGastos[]>( URL );
  }

  getgastosToPromise(){
    return this.getTiposGastos().toPromise();;
  }
}
