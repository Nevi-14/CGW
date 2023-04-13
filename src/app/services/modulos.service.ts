import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Modulos } from '../models/modulos';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  modulos:Modulos[]=[];
  constructor(
    public http:HttpClient

  ) { }

getAPI(api:string){

  let test = "";
  if(!environment.prdMode) test = environment.TestURL;
  const URL = environment.preURL + test + environment.postURL + api;
  return URL;
}

private getModulos(){
const URL = this.getAPI(environment.getModulos);
console.log('URL',URL)
return this.http.get<Modulos[]>(URL);
}

syncGetModulosToPromise(){
  return this.getModulos().toPromise();
}

}
