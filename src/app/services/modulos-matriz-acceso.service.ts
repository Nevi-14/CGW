import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatrizAccesoModulos } from '../models/matrizAcceso';

@Injectable({
  providedIn: 'root'
})
export class ModulosMatrizAccesoService {
  constructor(
    private http: HttpClient
  ) { }


  getAPI(api){
    let test = '';
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }


  private getModulosMatrizAccesosID(id:string){
    let URL = this.getAPI(environment.getMatrizAccesoModulosURL);
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<MatrizAccesoModulos[]>(URL);
  }

  private postModuloMatrizAcceso(matrizAcceso:MatrizAccesoModulos){
    const URL = this.getAPI(environment.postModuloMatrizAcceo);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, matrizAcceso, options);
  
  }
  
 
  
  private putModuloMatrizAcceso(matrizAcceso:MatrizAccesoModulos){
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
  
  private deleteModuloMatrizAcceso(id:string){
    let URL = this.getAPI(environment.deleteModuloMatrizAcceso);
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
  
  

  syncGetModulosMatrizAccesoByIDtoToPromise(id:string){
    return  this.getModulosMatrizAccesosID(id).toPromise();
   }

  syncPostModuloMatrizAccesoToPromise(matrizAcceso:MatrizAccesoModulos){
    return this.postModuloMatrizAcceso(matrizAcceso).toPromise();
  }
 
  syncPutModuloMatrizAccesoToPromise(matrizAcceso:MatrizAccesoModulos){
    return this.putModuloMatrizAcceso(matrizAcceso).toPromise();
  }
  
  syncDeleteModuloMatrizAccesoToPromise(id:string){
    return this.deleteModuloMatrizAcceso(id).toPromise();
  }
}
