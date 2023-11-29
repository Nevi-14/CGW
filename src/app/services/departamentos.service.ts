import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Departamentos } from '../models/departamentos';


@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
  departamentos:Departamentos[]=[];
  constructor(
    private http: HttpClient
  ) { }


  getAPI(api){
    let test = '';
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private getDepartamentos(){
    let URL = this.getAPI(environment.getDepartamentos);
    console.log('URL', URL)
    return this.http.get<Departamentos[]>(URL);
  }
  private getDepartamentosSofland(compania:string){
    let URL = this.getAPI(environment.getDepartamentosSofland);
        URL = URL + compania;
    console.log('URL', URL)
    return this.http.get<any[]>(URL);
  }
  syncGetDepartamentosSofland(compania:string){
    return this.getDepartamentosSofland(compania).toPromise();
  }
  private postDepartamento(departamento:Departamentos){
    const URL = this.getAPI(environment.postDepartamento);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, departamento, options);
  
  }
  
  
  private putDepartamento(departamento:Departamentos){
    let URL = this.getAPI(environment.putDepartamento);
        URL = URL + departamento.id
    const options = {
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    console.log(URL)
    console.log(departamento)
    return this.http.put(URL,departamento,options);
  }
  
  private deleteDepartamento(id:number){
    let URL = this.getAPI(environment.deleteDepartamento);
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
  
  
  syncGetDepartamentoToPromise(){
   return  this.getDepartamentos().toPromise();
  }
  
  syncPostDepartamentoToPromise(departamento:Departamentos){
    return this.postDepartamento(departamento).toPromise();
  }
  syncPutDepartamentoToPromise(departamento:Departamentos){
    return this.putDepartamento(departamento).toPromise();
  }
  
  syncDeleteDepartamentoToPromise(id:number){
    return this.deleteDepartamento(id).toPromise();
  }
}
