import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OneUsuariosModulosMatrizAccesoView } from '../models/OneUsuariosModulosMatrizAccesoView';
import { GetUsuarioExactus, UsuarioExactus, Usuarios } from '../models/usuarios';
import { EmpleadoSoland, EmpleadoSolandVariant } from '../models/empleadoSofland';
 

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
usuario:Usuarios = null;
usuarios:Usuarios[] = [];
CorreoVerificacion:string = ''; 
accesoModulos:OneUsuariosModulosMatrizAccesoView[]=[];
moduloAcceso:OneUsuariosModulosMatrizAccesoView  = {
   id:null,
    iD_USUARIO:null,
    estatus: null,
    aprobador: null,
    c: null,
    r: null,
    u: null,
    d: null,
    iD_MODULO:null,
    nombre: null,
    ruta:null
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

private getUsuario(correo){

  let URL = this.getAPI(environment.getUsuarioID);
      URL = URL + correo;
      console.log(URL)
      return this.http.get<Usuarios[]>(URL);
}
private getUsuarios(){

  let URL = this.getAPI(environment.getUsuarios);
      return this.http.get<Usuarios[]>(URL);
}
private getUsuariosExactus(compania:string){

  let URL = this.getAPI(environment.getusuariosSoflandCompania);
      URL = URL + compania;
      return this.http.get<UsuarioExactus[]>(URL);
}

private getUsuariosExactusID(id:string){

  let URL = this.getAPI(environment.getusuariosSoflandCompania);
      URL = 'https://sde1.sderp.site/api-coris-control-viaticos/api/get/usuario/exactus' +'?id='+ id;
      console.log(URL,'djdkkdd')
      return this.http.get<GetUsuarioExactus[]>(URL);
}

private getUsuariosSofland(compania:string, departamento:string){

  let URL = this.getAPI(environment.getUsuariosSofland);
      URL = URL + compania + '&departamento=' + departamento;
      console.log(URL,'getUsuariosSofland')
     // let type:any = compania == 'COOK'? EmpleadoSolandVariant : EmpleadoSoland
      return this.http.get<any[]>(URL);
}


syncGetUsuariosSofland(compania:string, departamento:string){
  return this.getUsuariosSofland(compania,departamento).toPromise();
}

private getUsuarioMatrizAccesos(id:number){

  let URL = this.getAPI(environment.getMatrizAccesoUsuario);
      URL = URL + id;
      console.log(URL)
      return this.http.get<OneUsuariosModulosMatrizAccesoView[]>(URL);
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


async syncGetUsuariosExactusID(){
  return this.getUsuariosExactusID(this.usuario.usuario).toPromise();
}
 
getUsuarioToPromise(correo){

  return this.getUsuario(correo).toPromise();
}

syncGetUsuariosToPromise(){

  return this.getUsuarios().toPromise();
}
syncGetUsuariosExactusToPromise(compania:string){

  return this.getUsuariosExactus(compania).toPromise();
}

 
syncPostUsuarioToPromise(usuario:Usuarios){
  return this.postUsuario(usuario).toPromise();
}
syncPutUsuarioToPromise(usuario:Usuarios){
  return this.putUsuario(usuario).toPromise();
}

syncGetUsuarioMatrizAccesosToPromise(id:number){
  return this.getUsuarioMatrizAccesos(id).toPromise();
}
syncDeleteUsuarioToPromise(id:number){
  return this.deleteUsuario(id).toPromise();
}

}
