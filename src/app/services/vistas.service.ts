import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Clientes } from '../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class VistassService {

  constructor(
public http: HttpClient

  ) { }


private getAPI(api:string){

  let test : string = '';

  if(!environment.prdMode)   test = environment.TestURL;

  const URL = environment.preURL+test+environment.postURL+api;

  return URL;

}

private getClientes(){

  let URL = this.getAPI(environment.getUsuarioID);
      return this.http.get<Clientes[]>('https://sde1.sderp.site/api-coris-control-viaticos/api/get/ultimo-consecutivo/exactus');
}
private getUltimoConsecutivo(){

  let URL = this.getAPI(environment.getUsuarios);
      return this.http.get<any[]>(URL);
}

syncGetClientesToPromise(){

  return this.getClientes().toPromise();
}

syncGetUltimoConsecutivoToPromise(){

  return this.getUltimoConsecutivo().toPromise();
}


}
