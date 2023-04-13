import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { estadosCuenta } from '../models/estadosCuenta';
import { AlertasService } from './alertas.service';
import { UsuariosService } from './usuarios.service';
interface email {
  toEmail:string,
  file:string,
  subject:string,
  body:string
}
@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  constructor(
    public http:HttpClient,
    public alertasService: AlertasService,
    public usuariosService: UsuariosService
    
    ) { }


  getAPI(api:string){

    let test = "";
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private postEmailApi (email:email){
    const URL =  this.getAPI(environment.postEmail);
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
   console.log('URL post lineas: ', URL);
   console.log('JSON Lineas:', JSON.stringify(email));
    return this.http.post( URL, JSON.stringify(email), options );
  }
  
  syncPostEmailToPromise(email:email){
  
  return this.postEmailApi(email).toPromise();
    
  }

  enviarCorreo(estado:estadosCuenta){
    this.usuariosService.syncGetUsuariosToPromise().then(resp =>{

      let i = resp.findIndex(u => u.usuario == estado.destinatario);
      if(i >=0){

        this.alertasService.presentaLoading('Enviando correo...')
        let correo:email = {
          toEmail:resp[i].correo,
          file:estado.archivo,
          subject:'Estado De Cuenta ' + estado.archivo,
          body:'Se adjunta el estado de cuenta '+ estado.archivo
        }
        this.syncPostEmailToPromise(correo).then(resp =>{
          this.alertasService.message('APP', 'Correo enviado..')
          this.alertasService.loadingDissmiss();
    console.log('resp', resp)
        }, error =>{
          this.alertasService.loadingDissmiss();
          this.alertasService.message('APP', 'Lo sentimos algo salio mal...')
        })
      }

    })

  }

}
