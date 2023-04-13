import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Roles } from '../models/roles';
 

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roles:Roles[]=[];
  constructor(
    private http: HttpClient
  ) { }


  getAPI(api){
    let test = '';
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private getRoles(){
    let URL = this.getAPI(environment.getRoles);
    console.log('URL', URL)
    return this.http.get<Roles[]>(URL);
  }
  
  private postRole(role:Roles){
    const URL = this.getAPI(environment.postRole);
    const options = {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control':'*'
      }
    }
    return this.http.post(URL, role, options);
  
  }
  
  
  private putRole(role:Roles){
    let URL = this.getAPI(environment.putRole);
        URL = URL + role.id
    const options = {
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    console.log(URL)
    console.log(role)
    return this.http.put(URL,role,options);
  }
  
  private deleteRole(id:number){
    let URL = this.getAPI(environment.deleteRole);
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
  
  
  syncGetRolesToPromise(){
   return  this.getRoles().toPromise();
  }
  
  syncPostRoletoToPromise(role:Roles){
    return this.postRole(role).toPromise();
  }
  syncPutRoleoToPromise(role:Roles){
    return this.putRole(role).toPromise();
  }
  
  syncDeleteRoletoToPromise(id:number){
    return this.deleteRole(id).toPromise();
  }
}
