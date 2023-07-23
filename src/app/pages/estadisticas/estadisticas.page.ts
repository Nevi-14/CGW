import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GraficosService } from 'src/app/services/graficos.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  constructor(
  public graficosService: GraficosService ,
  public modalCtrl:ModalController 
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.graficosService.cargarGRaficos();
  }
  regresar(){
    this.modalCtrl.dismiss()

  }
}
