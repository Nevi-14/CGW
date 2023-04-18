import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatrizAcceso } from '../models/matrizAcceso';
import { MatrizAccesoView } from '../models/matrizAccesoView';
import { OneUsuariosMatrizAcceso } from '../models/oneUsuariosMatrizAcceso';


@Injectable({
  providedIn: 'root'
})
export class MatrizAccesoService {
  matrizAcceso:MatrizAccesoView[]=[];
  constructor(
    private http: HttpClient
  ) { }


  getAPI(api){
    let test = '';
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private getMatrizAccesos(){
    let URL = this.getAPI(environment.getMatrizAcceso);
    console.log('URL', URL)
    return this.http.get<MatrizAccesoView[]>(URL);
  }
  private getMatrizAccesosID(id:number){
    let URL = this.getAPI(environment.getMatrizAccesoUsuario);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<MatrizAccesoView[]>(URL);
  }

  private getUsuariosMatrizAccesosID(id:number){
    let URL = this.getAPI(environment.getUsuariosMstrizAcceso);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<MatrizAccesoView[]>(URL);
  }
  private getMatrizAccesosBYID(id:number){
    let URL = this.getAPI(environment.getMatrizAccesoBYID);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<MatrizAccesoView[]>(URL);
  }
  private postMatrizAcceso(matrizAcceso:MatrizAcceso){
    const URL = this.getAPI(environment.postMatrizAcceo);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, matrizAcceso, options);
  
  }
  
  private postUsuarioMatrizAcceso(usuarioMatrizAcceso:OneUsuariosMatrizAcceso){
    const URL = this.getAPI(environment.postUsuarioMatrizAcceo);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, usuarioMatrizAcceso, options);
  
  }
  
  private putMatrizAcceso(matrizAcceso:MatrizAcceso){
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
  
  private deleteMatrizAcceso(id:number){
    let URL = this.getAPI(environment.deleteMatrizAcceso);
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
  
  
  syncGetMatrizAccesotoToPromise(){
   return  this.getMatrizAccesos().toPromise();
  }
  syncGetMatrizAccesoByIDtoToPromise(id:number){
    return  this.getMatrizAccesosID(id).toPromise();
   }
   syncGetMatrizAccesoIDtoToPromise(id:number){
    return  this.getMatrizAccesosBYID(id).toPromise();
   }
   syncGetUsuariosMatrizAccesoIDtoToPromise(id:number){
    return  this.getUsuariosMatrizAccesosID(id).toPromise();
   }
   
   
  syncPostMatrizAccesoToPromise(matrizAcceso:MatrizAcceso){
    return this.postMatrizAcceso(matrizAcceso).toPromise();
  }
  syncPostUsuarioMatrizAccesoToPromise(usuarioMatrizAcceso:OneUsuariosMatrizAcceso){
    return this.postUsuarioMatrizAcceso(usuarioMatrizAcceso).toPromise();
  }
  syncPutMatrizAccesoToPromise(matrizAcceso:MatrizAcceso){
    return this.putMatrizAcceso(matrizAcceso).toPromise();
  }
  
  syncDeleteMatrizAccesoToPromise(id:number){
    return this.deleteMatrizAcceso(id).toPromise();
  }
}
