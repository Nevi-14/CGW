import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Solicitudes } from '../models/solicitudes';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(
    public http: HttpClient
    
      ) { }
    
    
    private getAPI(api:string){
    
      let test : string = '';
    
      if(!environment.prdMode)   test = environment.TestURL;
    
      const URL = environment.preURL+test+environment.postURL+api;
    
      return URL;
    
    }
    private solicitudesCompaniaMonedaEstadoRangoFecha(compania,moneda,estado,valor1,valor2){
      let URL = this.getAPI( environment.solitudesCompaniaMonedaEstadoRangoFecha );
  
        URL = URL + compania + `&moneda=${moneda}`+ `&estado=${estado}`+ `&valor1=${valor1}`+ `&valor2=${valor2}`
        console.log(URL,'url')
      const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
      };
   
      return this.http.get<Solicitudes[]>(URL);
   
    }
  
    syncSolicitudesCompaniaMonedaEstadoRangoFechaToPromise(compania,moneda,estado,valor1,valor2){
  
      return this.solicitudesCompaniaMonedaEstadoRangoFecha(compania,moneda,estado,valor1,valor2).toPromise();
    }
    private getSolicitudes(){
      let URL = this.getAPI(environment.getSolicitudes);
          URL = URL ;
          console.log(URL)
          return this.http.get<Solicitudes[]>(URL);
    }
    putsolicitud(solicitud: Solicitudes) {
      let URL = this.getAPI(environment.putSolicitud);
      URL = URL + solicitud.id;
      console.log(URL,URL)
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
      console.log(JSON.stringify(solicitud));
      return this.http.put(URL, JSON.stringify(solicitud), options);
    }
    syncPutSolicitudToPromise(solicitud: Solicitudes){
      return  this.putsolicitud(solicitud).toPromise();
     }
    syncGetSolicitudesToPromise(){
     return  this.getSolicitudes().toPromise();
    }
}
