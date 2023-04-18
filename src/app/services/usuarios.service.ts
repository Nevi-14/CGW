import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario, UsuariosCitrix } from '../models/usuario';
import { Usuarios } from '../models/usuarios';
import { MatrizAccesoView } from '../models/matrizAccesoView';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
usuario:Usuario = null;
usuarios:Usuario[] = [];
accesoModulos:MatrizAccesoView[]=[];
moduloAcceso:MatrizAccesoView  = {
   id:null,
   ruta: null,
   modulo: null,
   compania: null,
   departamento: null,
   role: null,
   usuario: null,
   iD_USUARIO: null,
   estatuS_USUARIO: null,
   correo: null,
   estatus: null,
   c: null,
   r: null,
   u: null,
   d: null,
   aprobador: null,
   rolE_ID:null
}
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
      console.log(URL)
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
private getUsuarioMatrizAccesos(id:number){

  let URL = this.getAPI(environment.getMatrizAccesoUsuario);
      URL = URL + id;
      console.log(URL)
      return this.http.get<MatrizAccesoView[]>(URL);
}


private postUsuario(usuario:Usuario){
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


private putUsuario(usuario:Usuario){
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

 
syncPostUsuarioToPromise(usuario:Usuario){
  return this.postUsuario(usuario).toPromise();
}
syncPutUsuarioToPromise(usuario:Usuario){
  return this.putUsuario(usuario).toPromise();
}

syncGetUsuarioMatrizAccesosToPromise(id:number){
  return this.getUsuarioMatrizAccesos(id).toPromise();
}
syncDeleteUsuarioToPromise(id:number){
  return this.deleteUsuario(id).toPromise();
}

}
