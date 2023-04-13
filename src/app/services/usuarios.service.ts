import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario, UsuariosCitrix } from '../models/usuario';
import { Usuarios } from '../models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
usuario:Usuario = null;
usuarios:Usuario[] = [];
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
private getUsuariosExactus(){

  let URL = this.getAPI(environment.getusuariosExactus);
      return this.http.get<UsuariosCitrix[]>(URL);
}


private postUsuario(usuario:Usuarios){
  const URL = this.getAPI(environment.postUsuario);
  const options = {
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Access-Control':'*'
    }
  }
  return this.http.post(URL, usuario, options);

}


private putUsuario(usuario:Usuarios){
  let URL = this.getAPI(environment.putUsuario);
      URL = URL + usuario.id
  const options = {
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }
  console.log(URL)
  console.log(usuario)
  return this.http.put(URL,usuario,options);
}

private deleteUsuario(id:number){
  let URL = this.getAPI(environment.deleteUsuario);
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



getUsuarioIdToPtomise(id){

  return this.getUsuarioID(id).toPromise();
}

syncGetUsuariosToPromise(){

  return this.getUsuarios().toPromise();
}
syncGetUsuariosExactusToPromise(){

  return this.getUsuariosExactus().toPromise();
}

 
syncPostUsuarioToPromise(usuario:Usuarios){
  return this.postUsuario(usuario).toPromise();
}
syncPutUsuarioToPromise(usuario:Usuarios){
  return this.putUsuario(usuario).toPromise();
}

syncDeleteUsuarioToPromise(id:number){
  return this.deleteUsuario(id).toPromise();
}

}
