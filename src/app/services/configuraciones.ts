import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {
  menu = false;
  isLoading = false;
  loading: HTMLIonLoadingElement ;
  elementos =[]
  isPRD:boolean;
  url: string;
  chartHeight ='0px';
  title = "";

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl:ModalController
  ) { }


  getURL(){

  let test : string = '';

    if(!environment.prdMode){

      test = environment.TestURL;
      this.isPRD = false;
    }   else{

      this.isPRD = true;
    }
  this.url =  environment.preURL + test +environment.postURL;

 console.log('URL', this.url, 'isPRD', this.isPRD)
  }





}
