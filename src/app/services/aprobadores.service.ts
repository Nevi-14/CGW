import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AprobadoresService {

  constructor(
    private http:HttpClient
    
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
      private getAprobadores(){
        let URL = this.getIRPURL(environment.getAprobadores,'');
            console.log('URL', URL)
        return this.http.get<any[]>(URL);
    
      }
    
      postAprobador( aprobador: any ){
        console.log('aprobador', aprobador)
        const URL = this.getIRPURL( environment.postAprobador, `` );
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(aprobador));
        return this.http.post( URL, JSON.stringify(aprobador), options );
      }
      putAprobador( aprobador: any ){
        let URL = this.getIRPURL( environment.putAprobador, `` );
             URL = URL + aprobador.id;
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };aprobador
        console.log(JSON.stringify(aprobador));
        return this.http.put( URL, JSON.stringify(aprobador), options );
      }
      private deleteAprobador(id:number){
        let URL = this.getIRPURL(environment.deleteAprobador,'');
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
      
        
    syncGetAprobadoresToPromise(){
      return this.getAprobadores().toPromise();
    }
      syncPostAprobadorToPromise(aprobador:any){
        return this.postAprobador(aprobador).toPromise();
      }
    syncPutAprobadorToPromise(aprobador:any){
      return this.putAprobador(aprobador).toPromise();
    } 
      syncDeleteAprobadorToPromise(id:any){
        return this.deleteAprobador(id).toPromise();
      }
}
