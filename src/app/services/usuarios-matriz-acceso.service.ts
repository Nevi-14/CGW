import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuariosMatrizAcceso } from '../models/matrizAcceso';

@Injectable({
  providedIn: 'root'
})
export class UsuariosMatrizAccesoService {
  constructor(
    private http: HttpClient
  ) { }


  getAPI(api){
    let test = '';
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }


  private getUsuariosMatrizAccesosID(id:number){
    let URL = this.getAPI(environment.getUsuarioMatrizAccesoURL);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<UsuariosMatrizAcceso[]>(URL);
  }

  private postUsuarioMatrizAcceso(matrizAcceso:UsuariosMatrizAcceso){
    const URL = this.getAPI(environment.postUsuarioMatrizAcceo);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, matrizAcceso, options);
  
  }
  
 
  
  private putUsuarioMatrizAcceso(matrizAcceso:UsuariosMatrizAcceso){
    let URL = this.getAPI(environment.putMatrizAcceso);
        URL = URL + matrizAcceso.id
    const options = {
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    console.log(URL)
    console.log(matrizAcceso)
    return this.http.put(URL,matrizAcceso,options);
  }
  
  private deleteUsuarioMatrizAcceso(id:number){
    let URL = this.getAPI(environment.deleteUsuarioMatrizAcceso);
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
  
  

  syncGetUsuariosMatrizAccesoByIDtoToPromise(id:number){
    return  this.getUsuariosMatrizAccesosID(id).toPromise();
   }

  syncPostUsuarioMatrizAccesoToPromise(matrizAcceso:UsuariosMatrizAcceso){
    return this.postUsuarioMatrizAcceso(matrizAcceso).toPromise();
  }
 
  syncPutUsuarioMatrizAccesoToPromise(matrizAcceso:UsuariosMatrizAcceso){
    return this.putUsuarioMatrizAcceso(matrizAcceso).toPromise();
  }
  
  syncDeleteUsuarioMatrizAccesoToPromise(id:number){
    return this.deleteUsuarioMatrizAcceso(id).toPromise();
  }
}