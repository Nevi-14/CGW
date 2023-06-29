import { Injectable } from '@angular/core';
import { GastoSinAnticipo } from '../models/gastoSinAnticipo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class GastosSinAnticipoService {
  gastos: GastoSinAnticipo[] = [];
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
syncGetGastosSinAnticipoToPromise(){

  return this.getGastosSinAnticipo().toPromise();
}

}
