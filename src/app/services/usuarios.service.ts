import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
usuario:Usuario = null;

  constructor(
public http: HttpClient

  ) { }


private getAPI(api:string){

  let test : string = '';

  if(!environment.prdMode)   test = environment.TestURL;

  const URL = environment.preURL+test+environment.postURL+api;

  return URL;

}

private getUsuarioID(id){

  let URL = this.getAPI(environment.getUsuarioID);
      URL = URL + id;
      return this.http.get<Usuario[]>(URL);
}
private getUsuarios(){

  let URL = this.getAPI(environment.getUsuarios);
      return this.http.get<Usuario[]>(URL);
}

getUsuarioIdToPtomise(id){

  return this.getUsuarioID(id).toPromise();
}

syncGetUsuariosToPromise(){

  return this.getUsuarios().toPromise();
}



}
