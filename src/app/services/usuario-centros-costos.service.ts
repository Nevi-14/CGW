import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioCentroCosto } from '../models/usuarioCentroCosto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioCentrosCostosService {

  constructor(
private http:HttpClient

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
  private getUsuarioCentroCosto(id:any){
    let URL = this.getIRPURL(environment.getUsuarioCentroCosto,'');
    URL = URL+id
        console.log('URL', URL)
    return this.http.get<UsuarioCentroCosto[]>(URL);

  }

  postUsuarioCentroCosto( centro: UsuarioCentroCosto ){
    console.log('centro', centro)
    const URL = this.getIRPURL( environment.postUsuarioCentroCosto, `` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(centro));
    return this.http.post( URL, JSON.stringify(centro), options );
  }
  putUsuarioCentroCosto( centro: UsuarioCentroCosto ){
    let URL = this.getIRPURL( environment.putUsuarioCentroCosto, `` );
         URL = URL + centro.id;
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(centro));
    return this.http.put( URL, JSON.stringify(centro), options );
  }
  private deleteUsuarioCentroCosto(id:any){
    let URL = this.getIRPURL(environment.deleteUsuarioCentroCostoUsuario,'');
        URL = URL + id;
        const options = {
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
    return this.http.delete(URL,options);
  }
  
 
  syncPostUsuarioCentroCostoToPromise(centro:UsuarioCentroCosto){
    return this.postUsuarioCentroCosto(centro).toPromise();
  }
syncPutUsuarioCentroCostoToPromise(centro:UsuarioCentroCosto){
  return this.putUsuarioCentroCosto(centro).toPromise();
}

syncGetUsuarioCentroCostoToPromise(referencia:any){
  return this.getUsuarioCentroCosto(referencia).toPromise();
}

  syncDeleteUsuarioCentroCostoToPromise(id:any){

    return this.deleteUsuarioCentroCosto(id).toPromise();
  }
}
