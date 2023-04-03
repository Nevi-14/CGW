import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ONE_MOVDIR, ONE_Asiento_Diario, ONE_Diario } from '../models/procesoContable';

@Injectable({
  providedIn: 'root'
})
export class ProcesoContableService {

  constructor(
    public http: HttpClient
  ) { }


  private getAPI(api) {

    let test = '';
    if (!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;

    return URL;

  }

  private getMovDir() {
    let URL = this.getAPI(environment.getMovDir);
    return this.http.get<ONE_MOVDIR[]>(URL);
  }

  private getAsientoDiario() {
    let URL = this.getAPI(environment.getAsientoDiario);
    return this.http.get<ONE_Asiento_Diario[]>(URL);
  }

  private getDiario() {
    let URL = this.getAPI(environment.getDiario);
    return this.http.get<ONE_Diario[]>(URL);
  }


  private postMovDir(post: ONE_MOVDIR) {
    const URL = this.getAPI(environment.postMovDir);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    console.log('post', post)
    return this.http.post(URL, post, options);
  }


  private postAsientoDiario(post: ONE_Asiento_Diario) {
    const URL = this.getAPI(environment.postAsientoDiario);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    console.log('post', post)
    return this.http.post(URL, post, options);
  }


  private postDiario(post: ONE_Diario[]) {
    const URL = this.getAPI(environment.postDiario);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Origin': '*'
      }
    }
    console.log('URL', URL)
    console.log('post', post)
    return this.http.post(URL, post, options);
  }


  syncGetMovDirToPromise() {
    return this.getMovDir().toPromise();
  }
  syncGetAsientoDiario() {
    return this.getAsientoDiario().toPromise();
  }
  syncGetDiario() {
    return this.getDiario().toPromise();
  }


  syncPostMovDirToPromise(post: ONE_MOVDIR) {
    return this.postMovDir(post).toPromise();
  }
  syncPostAsientoDiarioToPromise(post: ONE_Asiento_Diario) {
    return this.postAsientoDiario(post).toPromise();
  }
  syncPostDiarioToPromise(post: ONE_Diario[]) {
    return this.postDiario(post).toPromise();
  }



}


