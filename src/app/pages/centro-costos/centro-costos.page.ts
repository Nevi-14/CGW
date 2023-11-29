import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CentrO_COSTO } from 'src/app/models/centroCostos';
import { cuentasGastos } from 'src/app/models/cuentsaGastos';

@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.page.html',
  styleUrls: ['./centro-costos.page.scss'],
})
export class CentroCostosPage implements OnInit {
@Input() centroCostos:cuentasGastos[]=[];
  constructor(
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
    this.centroCostos[0].descripcion
  }

  centroCosto(centro:any){
this.modalCtrl.dismiss(centro)
  }
  cerrarModal(){
    this.modalCtrl.dismiss()
  }
  onSearchChange($event){
    console.log($event.target.value)

  }
}
