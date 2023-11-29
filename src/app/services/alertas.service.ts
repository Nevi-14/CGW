import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  isLoading = false;
  loading: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) { }

  async dismissAllLoaders() {
    let topLoader = await this.loadingCtrl.getTop();
    while (topLoader) {
      if (await topLoader.dismiss().catch(() => false)) {
        // Dismiss successful, move on to the next loader
        topLoader = await this.loadingCtrl.getTop();
      } else {
        // Dismiss failed, log the error and move on
        //console.error('Error dismissing loader.');
        topLoader = null;
      }
    }
  }
 
  async presentaLoading(message: string) {
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      message: message ? message : 'Please wait...'
    });

    await this.loading.present();
  }

  async loadingDissmiss() {
    this.isLoading = false;

    // Dismiss the current loading if it exists
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null; // Reset the loading variable
    }

    // Dismiss any remaining loading indicators
    await this.dismissAllLoaders();
  }

  async message(header, message) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-popup',
      header: header,
      mode: 'ios',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
