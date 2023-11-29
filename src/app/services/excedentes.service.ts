import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Excedentes } from '../models/excedentes';
 
@Injectable({
  providedIn: 'root'
})
export class ExcedentesService {

  constructor(
    public http: HttpClient
    
      ) { }
    
      private getIRPURL( api: string, id: string ){
        let test: string = '';
    
        if ( !environment.prdMode ) {
          test = environment.TestURL;
        }
        const URL = environment.preURL + test + environment.postURL + api + id;
        console.log(URL);
        return URL;
      }
    
     
      private getExcedenteUsuario(id:string, asiento:string){
        let URL = this.getIRPURL(environment.getUsuarioExcedentes,'');
        URL = URL+id+`&asiento=${asiento}`;
            console.log('URL', URL)
        return this.http.get<Excedentes[]>(URL);
    
      }
      private getExcedentesUsuario(id:string){
        let URL = this.getIRPURL(environment.getUsuarioExcedente,id);
            console.log('URL', URL)
        return this.http.get<Excedentes[]>(URL);
    
      }
     
      private getExcedentesUsuarioRangoFecha(id:string,valor1:string,valor2:string, id_anticipo:string){
        let URL = this.getIRPURL(environment.getUsuarioExcedente,'');
        URL = URL+id + `&valor1=${valor1}`+ `&valor2=${valor2}`+ `&id_anticipo=${id_anticipo}`
            console.log('URL', URL)
        return this.http.get<Excedentes[]>(URL);
    
      }
    
    
      postExcedente( excedente: Excedentes){
        const URL = this.getIRPURL( environment.postExcedente, `` );
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(excedente));
        return this.http.post( URL, JSON.stringify(excedente), options );
      }
      putExcedente( excedente: Excedentes ){
        let URL = this.getIRPURL( environment.putExcedente, `` );
             URL = URL + excedente.id;
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(excedente));
        return this.http.put( URL, JSON.stringify(excedente), options );
      }
      private deleteexcedente(id:number){
        let URL = this.getIRPURL(environment.deleteExcedente,'');
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
 
      syncGetExcedentesUsuarioToPromise(id:string){
        return this.getExcedentesUsuario(id).toPromise();
      }
      syncGetExcedenteUsuarioToPromise(id:string, referencia:string){
        return this.getExcedenteUsuario(id,referencia).toPromise();
      }
      syncGetExcedentesUsuarioRangoFechaToPromise(id:string,valor1:string,valor2:string, id_anticipo:string){
       return this.getExcedentesUsuarioRangoFecha(id,valor1,valor2, id_anticipo).toPromise();
      }
      syncPostExcedenteToPromise( excedente: Excedentes ){
        return this.postExcedente( excedente ).toPromise();
      }
      syncPutExcedenteToPromise( excedente: Excedentes ){
        return this.putExcedente( excedente ).toPromise();
      }
      syncDeleteexcedente(id:number){
        return this.deleteexcedente(id).toPromise();
      }

}
