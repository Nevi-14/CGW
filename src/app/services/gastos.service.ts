import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { gastos } from '../models/gastos';
import { AlertasService } from './alertas.service';
import { UsuariosService } from './usuarios.service';
import { vistaGastos } from '../models/gastosView';
 
interface ids {
  id:string
}
interface gastosView {
  tipo : string,
  descripcion:string,
  total:number,
usuarios:string[],
  gastos:gastos[]
}
@Injectable({
  providedIn: 'root'
})
export class GastosService {
  viaticos:    gastosView[] = [];
  total:       number = 0;
  gastos:gastos[]=[]
  constructor(
 public http: HttpClient,
 public alertasService:AlertasService,   
 public  usuarioService: UsuariosService
  ) { }


  private getAPI(api){

  let test = '';

  if(!environment.prdMode){
    test = environment.TestURL;
  }

const URL = environment.preURL+test+environment.postURL+api;
console.log(URL)
return URL;

  }

  private getGastos(estado:string, value1:string, value2:string){

    let URL = this.getAPI(environment.getGastos);
       URL = URL + estado  +'&value1='+value1+'&value2='+value2;
console.log('URL', URL)
    return this.http.get<gastos[]>(URL);

  }
  private getUsuarioGastos(ID){

    let URL = this.getAPI(environment.getUsuarioGastos);
        URL = URL + ID;
        console.log('URL', URL)
    return this.http.get<gastos[]>(URL);

  }
  private getUsuarioGastosRangoFecha(id:number,estado:string, value1:string, value2:string){
    let URL = this.getAPI(environment.getUsuarioGastosRangoFecha);
    URL = URL+id+'&estado='+ estado  +'&valor1='+value1+'&valor2='+value2;
        console.log('URL', URL)
    return this.http.get<gastos[]>(URL);

  }

  private getGastosAnticipo(id:number){
    let URL = this.getAPI(environment.getGastosAnticipo);
    URL = URL+id;
        console.log('URL', URL)
    return this.http.get<vistaGastos[]>(URL);

  }
  private getFacturaGastos(Factura){

    let URL = this.getAPI(environment.getFacturaGastos);
        URL = URL + Factura;
    return this.http.get<gastos[]>(URL);

  }
  
  private putGasto(gasto:gastos){
    let URL = this.getAPI(environment.putGastos);
    URL = URL + gasto.referencia;
    const options = {
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Access-Control-Origin':'*'
      }
    };  
      return this.http.put(URL, gasto, options);
    }
  


  getGastosToPromise(procesado:string, value1:string, value2:string){

    return this.getGastos(procesado,value1,value2).toPromise();
  }


  syncGetGastosAnticipoToPtomise(id:number){
    return this.getGastosAnticipo(id).toPromise();
  }
  syngPutGastoToPromise(gasto:gastos){

    return this.putGasto(gasto).toPromise();
  }
  syncGetUsuarioGastosToPromise(ID){

    return this.getUsuarioGastos(ID).toPromise();
  }
  syncGetGastoFacturaToPromise(Factura){
    return this.getFacturaGastos(Factura).toPromise();

  }

  getViaticos(procesado:string, value1:string, value2:string){
 this.viaticos = [];
    this.alertasService.presentaLoading('Cargando datos...')
    console.log('usuario', this.usuarioService.usuario)
   this.getGastosToPromise(procesado, value1,value2).then(resp =>{
    console.log('resp', resp)
   
  if(resp.length == 0){
    this.alertasService.message('DIONE','Lo sentimos no se encontrarón resultados!.')
    return     this.alertasService.loadingDissmiss();
  }
 
  this.rellenarArregloGastos(resp);
   }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1', 'Lo sentimos algo salio mal..')
   })
  }


  synsgetGastosUsuarioRangoFechaToPromise(id:number,estado:string, value1:string, value2:string){
    return this.getUsuarioGastosRangoFecha(id,estado, value1,value2).toPromise()
  }
  getGastosUsuarioRangoFecha(id:number,estado:string, value1:string, value2:string){
 
    this.alertasService.presentaLoading('Cargando datos...')
    console.log('usuario', this.usuarioService.usuario)
   this.getUsuarioGastosRangoFecha(id,estado, value1,value2).subscribe(resp =>{
    console.log('resp', resp)
   
  if(resp.length == 0){
    this.alertasService.message('DIONE','Lo sentimos no se encontrarón resultados!.')
    return     this.alertasService.loadingDissmiss();
  }
 
  this.rellenarArregloGastos(resp);
   }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1', 'Lo sentimos algo salio mal..')
   })
  }

  rellenarArregloGastos(resp:gastos[]){
    this.viaticos = [];
    this.total = 0;
    this.gastos = [];
    resp.forEach( (x, index) => {

      let  gasto:gastosView = {
         tipo : x.tipo_Gasto,
         descripcion:x.justificacion,
         total:1,
         usuarios:[],
         gastos:[x]
       }
       let i = this.viaticos.findIndex(v => v.tipo == x.tipo_Gasto);
       if(i >=0){
         this.viaticos[i].total += 1;
         this.viaticos[i].gastos.push(x)
         let u = this.viaticos[i].usuarios.findIndex(y => y == x.usuario);
         if(u < 0){
           this.viaticos[i].usuarios.push(x.usuario)
         }
       }else {
         gasto.usuarios.push(x.usuario)
         this.viaticos.push(gasto)
       }
 
       this.total += x.monto;
       if(index == resp.length -1){
         this.alertasService.loadingDissmiss();
       }
      })
  }
}
